<?php

use App\Http\Controllers\SessionController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\ResourceItemController;
use App\Http\Controllers\ResourceUserController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\YouTubeController;
use App\Http\Controllers\ClerkSyncController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Web Session Middleware Group for Unauthenticated / Public Sync Routes
Route::middleware(['web'])->group(function () {
    Route::post('/clerk-sync', [ClerkSyncController::class, 'store'])->name('clerk.sync');
    Route::get('/sso-callback', fn() => Inertia::render('Auth/SSOCallback'))->name('sso.callback');
});

Route::middleware(['web', 'guest'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('Welcome');
    })->name('welcome');

    Route::get('/register', function () {
        return Inertia::render('Auth/Register');
    })->name('register');

    Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');

    Route::get('/forgot-password', function () {
        return Inertia::render('Auth/ForgotPassword');
    })->name('password.request');
});

// Protected Application Routes
Route::middleware(['web', 'auth'])->group(function () {
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    Route::get('/dashboard', [UserController::class, 'dashboard'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');

    // Sessions Routes
    Route::post('/sessions/create', [SessionController::class, 'studycreate'])->name('sessions.store');
    Route::get('/session/{id}', [SessionController::class, 'session_show'])->name('sessions.show');

    // Resource Management
    Route::get('/resources', [ResourceController::class, 'resourceIndex'])->name('resources.index');
    Route::post('/resources', [ResourceController::class, 'createResource'])->name('resources.store');
    Route::delete('/resources/{resource}', [ResourceController::class, 'destroy'])->name('resources.destroy');
    Route::get('/resources/private/{resource}', [ResourceController::class, 'privateResource'])->name('resources.private');
    Route::get('/resources/public/{resource}', [ResourceController::class, 'publicResource'])->name('resources.public');

    // Workspace Main View
    Route::get('/resources/{resource}', [ResourceController::class, 'show'])->name('resources.show');

    // Resource Items
    Route::post('/resource-items', [ResourceItemController::class, 'store'])->name('resource-items.store');
    Route::delete('/resource-items/{resourceItem}', [ResourceItemController::class, 'destroy'])->name('resource-items.destroy');

    // Collaborators & Members
    Route::get('/resources/{resource}/collaborators', [ResourceUserController::class, 'members'])->name('resources.collaborators.index');
    Route::post('/resources/{resource}/invite', [ResourceUserController::class, 'invite'])->name('resources.invite');
    Route::get('/resources/{resource}/invite', [ResourceUserController::class, 'acceptInviteLink'])->name('resources.invitations.link');
    Route::delete('/resources/{resource}/collaborators/{user}', [ResourceUserController::class, 'removeCollaborator'])->name('resources.collaborators.destroy');

    // Invite Status Routes
    Route::post('/resources/{resource}/accept', [ResourceUserController::class, 'acceptInvite'])->name('resources.invitations.accept');
    Route::post('/resources/{resource}/decline', [ResourceUserController::class, 'declineInvite'])->name('resources.invitations.decline');

    // YouTube Controller
    Route::get('/youtube/search', [YouTubeController::class, 'search'])->name('youtube.search');
});
