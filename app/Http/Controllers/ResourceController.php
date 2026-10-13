<?php

namespace App\Http\Controllers;

use App\Models\Resource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ResourceController extends Controller
{
    public function resourceIndex(Request $request)
    {
        $latest = Resource::where('clerk_id', $request->user()->clerk_id)->latest()->first();

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

        $resource = Resource::create($validated);

        if ($resource->resource_type === 'private') {
            return redirect()->route('resources.private', $resource->id);
        }

        return redirect()->route('resources.public', $resource->id);
    }

    public function destroy(Request $request, Resource $resource)
    {
        abort_unless($resource->clerk_id === $request->user()->clerk_id, 403);

        $resource->delete();

        return redirect()->route('dashboard');
    }

    /**
     * Main workspace view for public/collaborative resources.
     */
    public function show(Resource $resource)
    {
        // Check ownership or active collaboration access
        $isOwner = $resource->clerk_id === Auth::user()->clerk_id;
        $isCollaborator = $resource->collaborators()
            ->where('users.clerk_id', Auth::user()->clerk_id)
            ->exists();

        if (!$isOwner && !$isCollaborator) {
            abort(403, 'You do not have access to this workspace.');
        }

        $resource->load(['resourceItems' => function ($query) {
            $query->latest();
        }]);

        return Inertia::render('Resources/PublicResource', [
            'resource'  => $resource,
            'items'     => $resource->resourceItems,
            'canInvite' => $isOwner,
            'inviteLink' => route('resources.invitations.link', $resource),
        ]);
    }

    public function privateResource(Request $request, Resource $resource)
    {
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
        $isOwner = $resource->clerk_id === Auth::user()->clerk_id;
        $isCollaborator = $resource->collaborators()
            ->where('users.clerk_id', Auth::user()->clerk_id)
            ->exists();

        if (!$isOwner && !$isCollaborator) {
            abort(403, 'You do not have access to this workspace.');
        }

        $resource->load(['resourceItems' => function ($query) {
            $query->latest();
        }]);

        return Inertia::render('Resources/PublicResource', [
            'resource'  => $resource,
            'items'     => $resource->resourceItems,
            'canInvite' => $isOwner,
            'inviteLink' => route('resources.invitations.link', $resource),
        ]);
    }
}
