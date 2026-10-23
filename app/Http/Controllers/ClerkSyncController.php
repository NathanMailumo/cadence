<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class ClerkSyncController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'clerk_id' => 'required|string',
            'email' => 'required|email',
            'name' => 'nullable|string',
            'profile_image_url' => 'nullable|string',
            'is_registration' => 'nullable|boolean',
        ]);

        $userByClerkId = User::where('clerk_id', $validated['clerk_id'])->first();
        $userByEmail = User::where('email', $validated['email'])->first();
        $isRegistration = ! empty($validated['is_registration']);

        // Registering with an account that already exists -> send back to /register
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
                'clerk_id' => $validated['clerk_id'],
                'name' => $validated['name'] ?? explode('@', $validated['email'])[0],
                'email' => $validated['email'],
                'profile_image_url' => $validated['profile_image_url'] ?? null,
                'password' => bcrypt(Str::random(16)),
            ]);
        } else {
            $user->update([
                'clerk_id' => $validated['clerk_id'],
                // Don't overwrite a saved name on login
                'name' => $user->name ?: ($validated['name'] ?? $user->name),
                'profile_image_url' => $validated['profile_image_url'] ?? $user->profile_image_url,
            ]);
        }

        Auth::login($user);
        $request->session()->regenerate();

        if ($request->wantsJson()) {
            return response()->json(['success' => true]);
        }

        return redirect('/dashboard');
    }
}
