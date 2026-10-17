<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\ResourceItem;
use App\Models\Resource;
use Illuminate\Support\Facades\Auth;
use Inertia\Response;
use Inertia\Inertia;
use App\Services\CloudinaryService;

class ResourceItemController extends Controller
{
    public function store(Request $request, CloudinaryService $cloudinary)
    {
        $validated = $request->validate([
            'resource_id' => 'required|exists:resources,id',
            'type'        => 'required|in:video,link,pq,note',
            'title'       => 'required|string|max:255',
            'url'         => 'nullable|string',
            'content'     => 'nullable|string',
            'description' => 'nullable|string',
            'metadata'    => 'nullable|array',
            'file'        => 'required_if:type,pq|nullable|file|mimes:pdf,png,jpg,jpeg,webp,txt|max:2048',
        ]);

        $metadata = $request->input('metadata', []);

        if ($validated['type'] === 'pq') {
            $upload = $cloudinary->uploadResourceFile($request->file('file'));

            abort_unless($upload, 503, 'Practice question upload failed. Please try again.');

            $metadata = [
                'file_url' => $upload['url'],
                'public_id' => $upload['public_id'],
                'file_name' => $request->file('file')->getClientOriginalName(),
                'mime_type' => $request->file('file')->getMimeType(),
                'file_size' => $request->file('file')->getSize(),
            ];
        }

        unset($validated['file']);

        if (!empty($validated['url'])) {
            $host = parse_url($validated['url'], PHP_URL_HOST) ?? '';
            $metadata['domain'] = $host;

            $isYouTube = str_contains($host, 'youtube.com') || str_contains($host, 'youtu.be');

            if ($validated['type'] === 'video' && $isYouTube) {
                try {
                    // Query YouTube oEmbed endpoint (free, no API key needed)
                    $response = Http::withoutVerifying()->get('https://www.youtube.com/oembed', [
                        'url'    => $validated['url'],
                        'format' => 'json',
                    ]);

                    if ($response->successful()) {
                        $oembed = $response->json();

                        // OVERWRITE DUMMY TITLE & DESCRIPTION WITH REAL OEMBED METADATA
                        if (!empty($oembed['title'])) {
                            $validated['title'] = html_entity_decode($oembed['title']);
                        }

                        if (!empty($oembed['author_name'])) {
                            $validated['description'] = 'Channel: ' . $oembed['author_name'];
                            $metadata['author_name']  = $oembed['author_name'];
                        }

                        $metadata['thumbnail_url'] = $oembed['thumbnail_url'] ?? '';
                        $metadata['provider_name']  = $oembed['provider_name'] ?? 'YouTube';
                    }
                } catch (\Exception $e) {
                    // Gracefully fallback to submitted title/description if oEmbed fails
                }
            }
        }

        $validated['metadata'] = $metadata;
        $validated['clerk_id'] = $request->user()->clerk_id;
        $validated['status'] = 'active';

        ResourceItem::create($validated);

        return redirect()->back();
    }

    public function update(Request $request, CloudinaryService $cloudinary, ResourceItem $resourceItem)
    {
        $user = $request->user();

        // Allow update if the user is the space owner OR the item creator
        $isOwner = $resourceItem->resource->clerk_id === $user->clerk_id;
        $isCreator = $resourceItem->clerk_id === $user->clerk_id;

        abort_unless($isOwner || $isCreator, 403, 'Unauthorized action.');

        $validated = $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'nullable|string',
            'url'     => 'nullable|string',
            'file'    => 'nullable|file|mimes:pdf,png,jpg,jpeg,webp,txt|max:2048',
        ]);

        $metadata = $resourceItem->metadata ?? [];

        // Handle file replacement for Past Questions (pq)
        if ($resourceItem->type === 'pq' && $request->hasFile('file')) {
            // Delete old file from Cloudinary if public_id exists
            if (!empty($metadata['public_id'])) {
                $cloudinary->deleteImage($metadata['public_id']);
            }

            $upload = $cloudinary->uploadResourceFile($request->file('file'));
            abort_unless($upload, 503, 'Practice question file replacement failed. Please try again.');

            $metadata = array_merge($metadata, [
                'file_url'  => $upload['url'],
                'public_id' => $upload['public_id'],
                'file_name' => $request->file('file')->getClientOriginalName(),
                'mime_type' => $request->file('file')->getMimeType(),
                'file_size' => $request->file('file')->getSize(),
            ]);
        }

        // Handle URL changes & YouTube oEmbed re-fetching if URL changed
        if (!empty($validated['url']) && $validated['url'] !== $resourceItem->url) {
            $host = parse_url($validated['url'], PHP_URL_HOST) ?? '';
            $metadata['domain'] = $host;

            $isYouTube = str_contains($host, 'youtube.com') || str_contains($host, 'youtu.be');

            if ($resourceItem->type === 'video' && $isYouTube) {
                try {
                    $response = Http::withoutVerifying()->get('https://www.youtube.com/oembed', [
                        'url'    => $validated['url'],
                        'format' => 'json',
                    ]);

                    if ($response->successful()) {
                        $oembed = $response->json();
                        if (!empty($oembed['title'])) {
                            $validated['title'] = html_entity_decode($oembed['title']);
                        }
                        if (!empty($oembed['author_name'])) {
                            $metadata['author_name'] = $oembed['author_name'];
                        }
                        $metadata['thumbnail_url'] = $oembed['thumbnail_url'] ?? '';
                        $metadata['provider_name'] = $oembed['provider_name'] ?? 'YouTube';
                    }
                } catch (\Exception $e) {
                    // Fallback gracefully
                }
            }
        }

        $resourceItem->update([
            'title'    => $validated['title'],
            'content'  => $validated['content'] ?? $resourceItem->content,
            'url'      => $validated['url'] ?? $resourceItem->url,
            'metadata' => $metadata,
        ]);

        return redirect()->back();
    }

    public function destroy(Request $request, ResourceItem $resourceItem)
    {
        $user = $request->user();

        // Allow deletion if the user is the space owner OR the item creator
        $isOwner = $resourceItem->resource->clerk_id === $user->clerk_id;
        $isCreator = $resourceItem->clerk_id === $user->clerk_id;

        abort_unless($isOwner || $isCreator, 403, 'Unauthorized action.');

        $resourceItem->update(['status' => 'notActive']);

        return redirect()->back();
    }

    public function show(Resource $resource): Response
    {
        // Load items related to this specific resource
        $resource->load(['items' => function ($query) {
            $query->latest();
        }]);

        return Inertia::render('Resources/PrivateResource', [
            'resource' => $resource,
            'items'    => $resource->resourceItems,
        ]);
    }
}
