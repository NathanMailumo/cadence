<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ResourceUserController extends Controller
{
    /**
     * Display the list of invited collaborators (Invited.jsx).
     */
    public function members(Resource $resource)
    {
        $isOwner = $resource->clerk_id === Auth::user()->clerk_id;

        // Fetch collaborators from pivot table
        $collaborators = $resource->collaborators()
            ->get(['users.id', 'users.name', 'users.email']);

        return Inertia::render('Resources/invited', [
            'resource'      => $resource,
            'collaborators' => $collaborators,
            'canInvite'     => $isOwner,
        ]);
    }

    /**
     * Process an invite sent to a user.
     */
    public function invite(Request $request, Resource $resource)
    {
        if ($resource->clerk_id !== Auth::user()->clerk_id) {
            abort(403, 'Only the owner can invite collaborators.');
        }

        $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
        ]);

        $userToInvite = User::where('email', $request->email)->first();

        if ($userToInvite->clerk_id === Auth::user()->clerk_id) {
            return redirect()->back()->withErrors(['email' => 'You are already the owner of this workspace.']);
        }

        $resource->collaborators()->syncWithoutDetaching([
            $userToInvite->clerk_id => ['status' => 'pending'],
        ]);

        return redirect()->back()->with('success', 'User invited successfully.');
    }

    /**
     * Allow an authenticated user to join a collaborative space from its link.
     */
    public function acceptInviteLink(Resource $resource)
    {
        abort_unless($resource->resource_type === 'public', 404);

        $user = Auth::user();

        if ($resource->clerk_id !== $user->clerk_id) {
            $resource->collaborators()->syncWithoutDetaching([
                $user->clerk_id => ['status' => 'accepted'],
            ]);
        }

        return redirect()->route('resources.public', $resource->id)
            ->with('success', 'You have joined the workspace!');
    }
    // accepting a pending invitation
    public function acceptInvite(Resource $resource)
    {
        $resource->collaborators()->updateExistingPivot(Auth::user()->clerk_id, [
            'status' => 'accepted'
        ]);

        return redirect()->route('resources.public', $resource->id)
            ->with('success', 'You have joined the workspace!');
    }

    // decline an invite
    public function declineInvite(Resource $resource)
    {
        $resource->collaborators()->updateExistingPivot(Auth::user()->clerk_id, [
            'status' => 'declined'
        ]);

        return redirect()->route('resources.public', $resource->id)
            ->with('success', 'You have joined the workspace!');
    }


    /**
     * Remove a collaborator from the workspace pivot table.
     */
    public function removeCollaborator(Resource $resource, User $user)
    {
        if ($resource->clerk_id !== Auth::user()->clerk_id) {
            abort(403, 'Only the owner can remove collaborators.');
        }

        $resource->collaborators()->detach($user->clerk_id);

        return redirect()->back()->with('success', 'Collaborator removed.');
    }
}
