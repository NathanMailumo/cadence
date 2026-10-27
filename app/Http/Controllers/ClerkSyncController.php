<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\ClerkAuth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class ClerkSyncController extends Controller
{
    public function store(Request $request, ClerkAuth $clerk)
    {
        $validated = $request->validate([
            'is_registration' => 'nullable|boolean',
        ]);
        $isRegistration = ! empty($validated['is_registration']);

        // Identity comes ONLY from the verified Clerk token, never from the request body.
        $token = $request->bearerToken();
        if (! $token) {
            Log::warning('Clerk sync rejected: Missing bearer token');

            return $this->unauthorized();
        }

        try {
            $claims = $clerk->verifySessionToken($token);
            $profile = $clerk->fetchUser($claims->sub);
        } catch (\Throwable $e) {
            Log::error('Clerk sync failure: '.$e->getMessage(), [
                'exception' => $e,
            ]);

            return $this->unauthorized($e->getMessage());
        }

        $userByClerkId = User::where('clerk_id', $profile['clerk_id'])->first();
        $userByEmail = User::where('email', $profile['email'])->first();

        // Registering with an account that already exists -> back to /register
        if ($isRegistration && ($userByClerkId || $userByEmail)) {
            $message = 'Account already exists. Please log in.';

            if ($request->wantsJson()) {
                return response()->json([
                    'code' => 'account_exists',
                    'errors' => ['email' => [$message]],
                ], 422);
            }

            return redirect('/register?error='.urlencode($message));
        }

        $user = $userByClerkId ?? $userByEmail;

        if (! $user) {
            $user = User::create([
                'clerk_id' => $profile['clerk_id'],
                'name' => $profile['name'] ?? explode('@', $profile['email'])[0],
                'email' => $profile['email'],
                'profile_image_url' => $profile['image'],
                'password' => bcrypt(Str::random(32)),
            ]);
        } else {
            $user->update([
                'clerk_id' => $profile['clerk_id'],
                // Don't overwrite a saved name on login
                'name' => $user->name ?: ($profile['name'] ?? $user->name),
                'profile_image_url' => $profile['image'] ?? $user->profile_image_url,
            ]);
        }

        Auth::login($user);
        $request->session()->regenerate();

        if ($request->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return redirect('/dashboard');
    }

    private function unauthorized(?string $details = null)
    {
        $message = config('app.debug') && $details 
            ? 'Unable to verify sign in: ' . $details 
            : 'Unable to verify your sign in. Please try again.';

        return response()->json([
            'errors' => ['email' => [$message]],
        ], 401);
    }
}
