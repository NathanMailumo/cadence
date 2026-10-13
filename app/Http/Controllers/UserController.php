<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Resource;

class UserController extends Controller
{
    public function dashboard(Request $request)
    {
        $user = $request->user();

        $resources = Resource::where('clerk_id', $user->clerk_id)
            ->orWhereHas('collaborators', function ($q) use ($user) {
                $q->where('users.clerk_id', $user->clerk_id)->where('status', 'accepted');
            })
            ->withCount('resourceItems')
            ->get();

        $pendingInvitations = Resource::whereHas('collaborators', function ($q) use ($user) {
            $q->where('users.clerk_id', $user->clerk_id)
                ->where('status', 'pending');
        })->with('user:id,name,email')->get();

        return Inertia::render('Dashboard', compact('resources', 'pendingInvitations'));
    }
}
