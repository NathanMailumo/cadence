<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ClerkSyncController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'clerk_id'          => 'required|string',
            'email'             => 'required|email',
            'name'              => 'nullable|string',
            'profile_image_url' => 'nullable|string',
        ]);

        // 1. Look up strictly by clerk_id first
        $user = User::where('clerk_id', $validated['clerk_id'])->first();

        if (!$user) {
            // 2. Fallback to check if a user exists with this email
            $user = User::where('email', $validated['email'])->first();

            if ($user) {
                // 3. Safely update clerk_id and cascade updates to foreign keys in a transaction
                DB::transaction(function () use ($user, $validated) {
                    $oldClerkId = $user->clerk_id;
                    $newClerkId = $validated['clerk_id'];

                    if ($oldClerkId && $oldClerkId !== $newClerkId) {
                        // Temporarily bypass foreign key checks to allow updating identifier references
                        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

                        DB::table('resources')->where('clerk_id', $oldClerkId)->update(['clerk_id' => $newClerkId]);
                        DB::table('resource_users')->where('clerk_id', $oldClerkId)->update(['clerk_id' => $newClerkId]);

                        $user->update([
                            'clerk_id'          => $newClerkId,
                            'name'              => $validated['name'] ?? $user->name,
                            'profile_image_url' => $validated['profile_image_url'] ?? $user->profile_image_url,
                        ]);

                        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
                    } else {
                        $user->update([
                            'name'              => $validated['name'] ?? $user->name,
                            'profile_image_url' => $validated['profile_image_url'] ?? $user->profile_image_url,
                        ]);
                    }
                });
            } else {
                // 4. Create a brand new user if neither exists
                $user = User::create([
                    'clerk_id'          => $validated['clerk_id'],
                    'name'              => $validated['name'] ?? explode('@', $validated['email'])[0],
                    'email'             => $validated['email'],
                    'profile_image_url' => $validated['profile_image_url'] ?? null,
                    'password'          => bcrypt(Str::random(16)),
                ]);
            }
        } else {
            // 5. Update profile info for existing matching clerk user
            $user->update([
                'name'              => $validated['name'] ?? $user->name,
                'profile_image_url' => $validated['profile_image_url'] ?? $user->profile_image_url,
            ]);
        }

        // Authenticate user into local Laravel web guard
        Auth::login($user);

        // Regenerate session for Inertia cookies
        $request->session()->regenerate();

        return redirect()->route('dashboard');
    }
}
