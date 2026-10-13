<?php

namespace App\Http\Middleware;

use App\Models\Resource;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Define $user once from the $request
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
            ],
            'privateResources' => fn() => $user
                ? Resource::where('status', 'active')
                ->where('clerk_id', $user->clerk_id)
                ->where('resource_type', 'private')
                ->withCount('resourceItems')
                ->latest()
                ->get()
                : [],
            'publicResources' => fn() => $user
                ? Resource::where('status', 'active')
                ->where('resource_type', 'public')
                ->where(function ($query) use ($user) {
                    $query->where('clerk_id', $user->clerk_id)
                        ->orWhereHas('collaborators', function ($collaborators) use ($user) {
                            $collaborators->where('users.clerk_id', $user->clerk_id)
                                ->where('status', 'accepted');
                        });
                })
                ->withCount('resourceItems')
                ->latest()
                ->get()
                : [],
            'resources' => fn() => $user
                ? Resource::where('status', 'active')
                ->where(function ($query) use ($user) {
                    $query->where('clerk_id', $user->clerk_id)
                ->orWhereHas('collaborators', function ($q) use ($user) {
                    $q->where('users.clerk_id', $user->clerk_id)
                        ->where('status', 'accepted');
                    });
                })
                ->withCount('resourceItems')
                ->latest()
                ->get()
                : [],
        ];
    }
}
