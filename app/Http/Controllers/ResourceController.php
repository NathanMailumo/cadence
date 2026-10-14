<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ResourceController extends Controller
{
    public function resourceIndex(Request $request)
    {
        $latest = Resource::where('status', 'active')
            ->where('clerk_id', $request->user()->clerk_id)
            ->latest()
            ->first();

        if ($latest) {
            return redirect()->route('resources.show', $latest->id);
        }

        return redirect()->route('dashboard');
    }

    public function createResource(Request $request)
    {
        $validated = $request->validate([
            'course_name'   => 'required|string|max:255',
            'resource_type' => 'required|in:private,public',
        ]);

        $validated['clerk_id'] = $request->user()->clerk_id;

        $resource = Resource::create([...$validated, 'status' => 'active']);

        if ($resource->resource_type === 'private') {
            return redirect()->route('resources.private', $resource->id);
        }

        return redirect()->route('resources.public', $resource->id);
    }

    public function destroy(Request $request, Resource $resource)
    {
        $user = $request->user();
        $isOwner = $resource->clerk_id === $user->clerk_id;

        if ($isOwner) {
            // Owner deletes the resource globally for everyone
            DB::transaction(function () use ($resource) {
                $sessions = $resource->studySessions()
                    ->with(['sessionOutput', 'sessionFile'])
                    ->get();

                $resource->update(['status' => 'deleted']);
                $resource->resourceItems()->update(['status' => 'deleted']);
                $resource->studySessions()->update(['status' => 'deleted']);

                DB::table('resource_users')
                    ->where('resource_id', $resource->id)
                    ->delete();

                $sessions->each(function ($session) {
                    $session->sessionOutput?->update(['status' => 'deleted']);
                    $session->sessionFile?->update(['status' => 'deleted']);
                });
            });
        } else {
            // Invited collaborator removes the space individually for themselves only
            $resource->collaborators()->detach($user->clerk_id);
        }

        return redirect()->route('dashboard');
    }

    public function show(Resource $resource)
    {
        abort_unless($resource->status === 'active', 404);

        $isOwner = $resource->clerk_id === Auth::user()->clerk_id;
        $isCollaborator = $resource->collaborators()
            ->where('users.clerk_id', Auth::user()->clerk_id)
            ->exists();

        if (!$isOwner && !$isCollaborator) {
            abort(403, 'You do not have access to this workspace.');
        }

        // Include clerk_id explicitly when loading items
        $resource->load(['resourceItems' => function ($query) {
            $query->select('id', 'resource_id', 'clerk_id', 'type', 'title', 'url', 'content', 'description', 'metadata', 'study_session_id', 'created_at')
                ->latest();
        }]);

        return Inertia::render('Resources/PublicResource', [
            'resource'   => $resource,
            'items'      => $resource->resourceItems,
            'canInvite'  => $isOwner,
            'inviteLink' => route('resources.invitations.link', $resource),
        ]);
    }

    public function privateResource(Request $request, Resource $resource)
    {
        abort_unless($resource->status === 'active', 404);

        if ($resource->clerk_id !== $request->user()->clerk_id) {
            abort(403, 'Unauthorized access to this private resource.');
        }

        $resource->load(['resourceItems' => function ($query) {
            $query->latest();
        }]);

        return Inertia::render('Resources/PrivateResource', [
            'resource' => $resource,
            'items'    => $resource->resourceItems,
        ]);
    }

    public function publicResource(Request $request, Resource $resource)
    {
        abort_unless($resource->status === 'active', 404);

        $isOwner = $resource->clerk_id === Auth::user()->clerk_id;
        $isCollaborator = $resource->collaborators()
            ->where('users.clerk_id', Auth::user()->clerk_id)
            ->exists();

        if (!$isOwner && !$isCollaborator) {
            abort(403, 'You do not have access to this workspace.');
        }

        $resource->load(['resourceItems' => function ($query) {
            $query->select('id', 'resource_id', 'clerk_id', 'type', 'title', 'url', 'content', 'description', 'metadata', 'study_session_id', 'created_at')
                ->latest();
        }]);

        return Inertia::render('Resources/PublicResource', [
            'resource'   => $resource,
            'items'      => $resource->resourceItems,
            'canInvite'  => $isOwner,
            'inviteLink' => route('resources.invitations.link', $resource),
        ]);
    }
}
