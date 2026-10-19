<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use App\Models\Subscriptions;
use App\Models\UserFreeUsage;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SubscriptionController extends Controller
{
    /**
     * Check if a given user has an active, non-expired subscription.
     */
    public static function hasActivePlan($user)
    {
        if (!$user) {
            return false;
        }

        return Subscriptions::where('clerk_id', $user->clerk_id)
            ->where('status', 'active')
            ->where('ends_at', '>', Carbon::now())
            ->exists();
    }

    /**
     * Resolve or create the usage record, handling one-time resets 
     * when a user transitions between active, expired, or cancelled states.
     */
    private static function resolveOrCreateUsageRecord($user)
    {
        $clerkId = $user->clerk_id;
        $latestSub = Subscriptions::where('clerk_id', $clerkId)->latest()->first();

        $activeSub = Subscriptions::where('clerk_id', $clerkId)
            ->where('status', 'active')
            ->where('ends_at', '>', Carbon::now())
            ->latest()
            ->first();

        $isReallyActive = $activeSub !== null;

        if ($isReallyActive) {
            $cycleKey = 'active_' . $activeSub->id;
        } else {
            $subId = $latestSub ? $latestSub->id : 'none';
            $isExpired = $latestSub && $latestSub->ends_at && Carbon::parse($latestSub->ends_at)->lessThanOrEqualTo(Carbon::now());
            $subState = $latestSub ? ($latestSub->status . '_' . ($isExpired ? 'expired' : 'active')) : 'pure_free';
            $cycleKey = 'free_' . $subId . '_' . $subState;
        }

        $usage = UserFreeUsage::where('clerk_id', $clerkId)->first();

        if (!$usage) {
            $usage = UserFreeUsage::create([
                'clerk_id' => $clerkId,
                'cycle_key' => $cycleKey,
                'collaborative_spaces_used' => 0,
                'ai_generations_used' => 0,
                'pq_uploads_used' => 0,
            ]);
        } elseif ($usage->cycle_key !== $cycleKey) {
            $usage->update([
                'cycle_key' => $cycleKey,
                'collaborative_spaces_used' => 0,
                'ai_generations_used' => 0,
                'pq_uploads_used' => 0,
            ]);
        }

        return $usage;
    }

    /**
     * Get remaining allowances for a Free user, or 'unlimited' for Plus/Semester Pass.
     */
    public static function getRemainingAllowances($user)
    {
        if (!$user) {
            return [
                'collaborative_spaces' => 2,
                'ai_generations' => 3,
                'pq_uploads' => 3,
            ];
        }

        if (self::hasActivePlan($user)) {
            return [
                'collaborative_spaces' => 'unlimited',
                'ai_generations' => 'unlimited',
                'pq_uploads' => 'unlimited',
            ];
        }

        $usage = self::resolveOrCreateUsageRecord($user);

        return [
            'collaborative_spaces' => max(0, 2 - $usage->collaborative_spaces_used),
            'ai_generations' => max(0, 3 - $usage->ai_generations_used),
            'pq_uploads' => max(0, 3 - $usage->pq_uploads_used),
        ];
    }

    /**
     * Check and consume free usage atomically using database locks.
     */
    public static function checkAndConsumeFreeUsage($user, $feature)
    {
        if (self::hasActivePlan($user)) {
            return true;
        }

        return DB::transaction(function () use ($user, $feature) {
            $usage = UserFreeUsage::where('clerk_id', $user->clerk_id)->lockForUpdate()->first();
            $usage = self::resolveOrCreateUsageRecord($user);

            $limit = match ($feature) {
                'collaborative_space' => 2,
                'ai_generation' => 3,
                'pq_upload' => 3,
                default => throw new \InvalidArgumentException("Invalid feature"),
            };

            $field = match ($feature) {
                'collaborative_space' => 'collaborative_spaces_used',
                'ai_generation' => 'ai_generations_used',
                'pq_upload' => 'pq_uploads_used',
            };

            if ($usage->$field >= $limit) {
                return false;
            }

            $usage->increment($field);
            return true;
        });
    }

    // Display the billing pricing page
    public function index(Request $request)
    {
        $user = $request->user();

        $activeSub = Subscriptions::where('clerk_id', $user->clerk_id)
            ->where('status', 'active')
            ->where('ends_at', '>', Carbon::now())
            ->latest()
            ->first();

        return Inertia::render('Payment/Billing', [
            'currentPlan' => $activeSub ? $activeSub->plan_type : 'free',
        ]);
    }

    // Display the dedicated Billing Info / Management page
    public function info(Request $request)
    {
        $user = $request->user();

        $activeSub = Subscriptions::where('clerk_id', $user->clerk_id)
            ->where('status', 'active')
            ->where('ends_at', '>', Carbon::now())
            ->latest()
            ->first();

        return Inertia::render('Payment/BillingInfo', [
            'subscription' => $activeSub,
            'currentPlan' => $activeSub ? $activeSub->plan_type : 'free',
        ]);
    }

    // Initialize Paystack Payment
    public function initialize(Request $request)
    {
        $request->validate([
            'plan' => 'required|in:plus,semester',
        ]);

        $user = $request->user();
        $planType = $request->plan;

        $amount = $planType === 'plus' ? 50000 : 150000;

        $response = Http::withToken(config('services.paystack.secret'))
            ->post('https://api.paystack.co/transaction/initialize', [
                'email' => $user->email,
                'amount' => $amount,
                'callback_url' => route('subscription.callback'),
                'metadata' => [
                    'clerk_id' => $user->clerk_id,
                    'plan_type' => $planType,
                ],
            ]);

        if ($response->successful()) {
            $authorizationUrl = $response->json('data.authorization_url');
            return Inertia::location($authorizationUrl);
        }

        return back()->withErrors(['message' => 'Could not initialize Paystack payment. Please try again.']);
    }

    // Verify Paystack Payment Callback
    public function callback(Request $request)
    {
        $reference = $request->query('reference');

        if (!$reference) {
            return redirect()->route('billing')->with('error', 'Transaction reference not found.');
        }

        $response = Http::withToken(config('services.paystack.secret'))
            ->get("https://api.paystack.co/transaction/verify/{$reference}");

        if ($response->successful() && $response->json('data.status') === 'success') {
            $data = $response->json('data');
            $clerkId = $data['metadata']['clerk_id'] ?? null;
            $planType = $data['metadata']['plan_type'] ?? 'plus';

            $activeSub = null;

            if ($clerkId) {
                $startsAt = Carbon::now();
                $endsAt = $planType === 'semester'
                    ? $startsAt->copy()->addMonths(4)
                    : $startsAt->copy()->addMonth();

                Subscriptions::where('clerk_id', $clerkId)
                    ->where('status', 'active')
                    ->update(['status' => 'expired']);

                $activeSub = Subscriptions::create([
                    'clerk_id' => $clerkId,
                    'plan_type' => $planType,
                    'status' => 'active',
                    'paystack_reference' => $reference,
                    'paystack_subscription_code' => $data['subscription_code'] ?? null,
                    'starts_at' => $startsAt,
                    'ends_at' => $endsAt,
                ]);
            }

            return Inertia::render('Payment/Receipt', [
                'subscription' => $activeSub,
            ]);
        }

        return redirect()->route('billing')->with('error', 'Payment verification failed.');
    }

    // Cancel Active Subscription
    public function cancel(Request $request)
    {
        $user = $request->user();

        Subscriptions::where('clerk_id', $user->clerk_id)
            ->where('status', 'active')
            ->update(['status' => 'cancelled']);

        return redirect()->route('billing.info')->with('success', 'Subscription cancelled successfully. You have been moved to the Free plan.');
    }
}
