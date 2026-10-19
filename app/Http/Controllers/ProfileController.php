<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Services\CloudinaryService;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Subscriptions;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();

        $activeSub = Subscriptions::where('clerk_id', $user->clerk_id)
            ->where('status', 'active')
            ->latest()
            ->first();

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'currentPlan' => $activeSub ? $activeSub->plan_type : 'free',
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request, CloudinaryService $cloudinary): RedirectResponse
    {
        $user = $request->user();
        $validated = $request->validated();

        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        // 1. Handle uploaded image file to Cloudinary
        if ($request->hasFile('profile_image')) {
            $upload = $cloudinary->uploadImage($request->file('profile_image'), 'tutorOS/avatars');
            if ($upload) {
                if ($user->profile_image_public_id) {
                    $cloudinary->deleteImage($user->profile_image_public_id);
                }
                $user->profile_image_url = $upload['url'];
                $user->profile_image_public_id = $upload['public_id'];
            }
        }
        // 2. Handle selected avatar preset URL
        elseif ($request->filled('avatar_url')) {
            if ($user->profile_image_public_id) {
                $cloudinary->deleteImage($user->profile_image_public_id);
            }
            $user->profile_image_url = $request->input('avatar_url');
            $user->profile_image_public_id = null;
        }

        $user->save();

        return Redirect::route('profile.edit')->with('status', 'profile-updated');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
