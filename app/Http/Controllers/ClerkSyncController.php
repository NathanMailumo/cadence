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

        $user = User::where('clerk_id', $validated['clerk_id'])->first();

        if (!$user) {
            $user = User::where('email', $validated['email'])->first();

            if ($user) {
                DB::transaction(function () use ($user, $validated) {
                    $oldClerkId = $user->clerk_id;
                    $newClerkId = $validated['clerk_id'];

                    if ($oldClerkId && $oldClerkId !== $newClerkId) {
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
                $user = User::create([
                    'clerk_id'          => $validated['clerk_id'],
                    'name'              => $validated['name'] ?? explode('@', $validated['email'])[0],
                    'email'             => $validated['email'],
                    'profile_image_url' => $validated['profile_image_url'] ?? null,
                    'password'          => bcrypt(Str::random(16)),
                ]);
            }
        } else {
            $user->update([
                'name'              => $validated['name'] ?? $user->name,
                'profile_image_url' => $validated['profile_image_url'] ?? $user->profile_image_url,
            ]);
        }

        // Authenticate user session
        Auth::login($user);
        $request->session()->regenerate();

        return response()->json(['success' => true]);
    }
}
