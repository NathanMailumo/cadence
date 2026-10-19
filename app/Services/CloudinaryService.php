<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CloudinaryService
{
    protected ?string $cloudName;
    protected ?string $apiKey;
    protected ?string $apiSecret;

    public function __construct()
    {
        $this->cloudName = config('services.cloudinary.cloud_name');
        $this->apiKey    = config('services.cloudinary.api_key');
        $this->apiSecret = config('services.cloudinary.api_secret');
    }

    /**
     * Upload an image to Cloudinary.
     *
     * @param UploadedFile|string $file
     * @param string $folder
     * @return array{url: string, public_id: string}|null
     */
    public function uploadImage($file, string $folder = 'tutorOS/avatars'): ?array
    {
        if (empty($this->cloudName) || empty($this->apiKey) || empty($this->apiSecret)) {
            Log::error('Cloudinary credentials are not configured.');
            return null;
        }

        try {
            $timestamp = time();
            $params = [
                'folder' => $folder,
                'timestamp' => $timestamp,
            ];
            ksort($params);

            $toSign = '';
            foreach ($params as $key => $val) {
                $toSign .= ($toSign ? '&' : '') . "{$key}={$val}";
            }
            $signature = sha1($toSign . $this->apiSecret);

            $multipart = [
                ['name' => 'api_key', 'contents' => (string) $this->apiKey],
                ['name' => 'timestamp', 'contents' => (string) $timestamp],
                ['name' => 'folder', 'contents' => $folder],
                ['name' => 'signature', 'contents' => $signature],
            ];

            if ($file instanceof UploadedFile) {
                $multipart[] = [
                    'name' => 'file',
                    'contents' => fopen($file->getRealPath(), 'r'),
                    'filename' => $file->getClientOriginalName(),
                ];
            } else {
                // String: could be a URL or raw contents
                $multipart[] = [
                    'name' => 'file',
                    'contents' => $file,
                ];
            }

            $endpoint = "https://api.cloudinary.com/v1_1/{$this->cloudName}/image/upload";
            $response = Http::asMultipart()->timeout(30)->post($endpoint, $multipart);

            if ($response->successful()) {
                $data = $response->json();
                return [
                    'url' => $data['secure_url'] ?? $data['url'],
                    'public_id' => $data['public_id'],
                ];
            }

            Log::error('Cloudinary upload failed: ' . $response->body());
            return null;
        } catch (\Exception $e) {
            Log::error('Cloudinary upload exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Upload a resource file to Cloudinary.
     *
     * @return array{url: string, public_id: string}|null
     */
    public function uploadResourceFile(UploadedFile $file, string $folder = 'tutorOS/practice-questions'): ?array
    {
        if (empty($this->cloudName) || empty($this->apiKey) || empty($this->apiSecret)) {
            Log::error('Cloudinary credentials are not configured.');
            return null;
        }

        try {
            $timestamp = time();
            $params = [
                'folder' => $folder,
                'timestamp' => $timestamp,
            ];
            ksort($params);

            $toSign = '';
            foreach ($params as $key => $value) {
                $toSign .= ($toSign ? '&' : '') . "{$key}={$value}";
            }
            $signature = sha1($toSign . $this->apiSecret);

            $response = Http::asMultipart()->timeout(30)->post(
                "https://api.cloudinary.com/v1_1/{$this->cloudName}/auto/upload",
                [
                    ['name' => 'api_key', 'contents' => (string) $this->apiKey],
                    ['name' => 'timestamp', 'contents' => (string) $timestamp],
                    ['name' => 'folder', 'contents' => $folder],
                    ['name' => 'signature', 'contents' => $signature],
                    [
                        'name' => 'file',
                        'contents' => fopen($file->getRealPath(), 'r'),
                        'filename' => $file->getClientOriginalName(),
                    ],
                ]
            );

            if (!$response->successful()) {
                Log::error('Cloudinary resource upload failed: ' . $response->body());
                return null;
            }

            $data = $response->json();

            return [
                'url' => $data['secure_url'] ?? $data['url'] ?? '',
                'public_id' => $data['public_id'] ?? '',
            ];
        } catch (\Throwable $e) {
            Log::error('Cloudinary resource upload exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Delete an image from Cloudinary by its public ID.
     */
    public function deleteImage(?string $publicId): bool
    {
        if (empty($publicId) || empty($this->cloudName) || empty($this->apiKey) || empty($this->apiSecret)) {
            return false;
        }

        try {
            $timestamp = time();
            $toSign = "public_id={$publicId}&timestamp={$timestamp}" . $this->apiSecret;
            $signature = sha1($toSign);

            $endpoint = "https://api.cloudinary.com/v1_1/{$this->cloudName}/image/destroy";
            $response = Http::asMultipart()->timeout(15)->post($endpoint, [
                ['name' => 'api_key', 'contents' => (string) $this->apiKey],
                ['name' => 'timestamp', 'contents' => (string) $timestamp],
                ['name' => 'public_id', 'contents' => $publicId],
                ['name' => 'signature', 'contents' => $signature],
            ]);

            return $response->successful() && ($response->json('result') === 'ok');
        } catch (\Exception $e) {
            Log::error('Cloudinary delete exception: ' . $e->getMessage());
            return false;
        }
    }
}
