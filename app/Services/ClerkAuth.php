<?php

namespace App\Services;

use Firebase\JWT\JWK;
use Firebase\JWT\JWT;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use InvalidArgumentException;
use RuntimeException;
use UnexpectedValueException;

class ClerkAuth
{
    private const JWKS_CACHE_KEY = 'clerk_jwks';
    private const JWKS_CACHE_TTL = 3600; // 1 hour

    /**
     * Verifies the Clerk session JWT.
     *
     * @param string $token
     * @return object
     *
     * @throws InvalidArgumentException
     * @throws UnexpectedValueException
     * @throws RuntimeException
     */
    public function verifySessionToken(string $token): object
    {
        $segments = explode('.', $token);
        if (count($segments) !== 3) {
            throw new InvalidArgumentException('Malformed JWT token.');
        }

        $header = json_decode(JWT::urlsafeB64Decode($segments[0]), true);
        if (! is_array($header) || empty($header['kid'])) {
            throw new UnexpectedValueException('Token header missing kid.');
        }

        if (($header['alg'] ?? null) !== 'RS256') {
            throw new UnexpectedValueException('Token algorithm must be RS256.');
        }

        $kid = $header['kid'];
        $jwks = Cache::get(self::JWKS_CACHE_KEY);

        if (! is_array($jwks) || empty($jwks['keys'])) {
            $jwks = $this->fetchJwks();
            Cache::put(self::JWKS_CACHE_KEY, $jwks, self::JWKS_CACHE_TTL);
        }

        $keys = JWK::parseKeySet($jwks, 'RS256');

        if (! isset($keys[$kid])) {
            // Unknown kid: refresh once from Clerk JWKS endpoint
            $jwks = $this->fetchJwks();
            Cache::put(self::JWKS_CACHE_KEY, $jwks, self::JWKS_CACHE_TTL);
            $keys = JWK::parseKeySet($jwks, 'RS256');

            if (! isset($keys[$kid])) {
                throw new UnexpectedValueException("Unknown kid: {$kid}");
            }
        }

        // Allow 60 seconds leeway for minor local clock skews
        JWT::$leeway = 60;
        $payload = JWT::decode($token, $keys);

        if (! isset($payload->exp)) {
            throw new UnexpectedValueException('Token missing exp claim.');
        }

        $issuer = rtrim(config('services.clerk.issuer') ?? '', '/');
        if (empty($issuer)) {
            throw new UnexpectedValueException('Clerk issuer is not configured.');
        }

        $tokenIss = rtrim($payload->iss ?? '', '/');
        if ($tokenIss !== $issuer) {
            throw new UnexpectedValueException('Token issuer mismatch.');
        }

        $allowedOrigins = config('services.clerk.allowed_origins', []);
        if (is_string($allowedOrigins)) {
            $allowedOrigins = array_values(array_filter(array_map('trim', explode(',', $allowedOrigins))));
        } elseif (! is_array($allowedOrigins)) {
            $allowedOrigins = [];
        }

        $normalizedOrigins = array_map(fn($o) => rtrim($o, '/'), $allowedOrigins);
        $tokenAzp = rtrim($payload->azp ?? '', '/');

        if (! isset($payload->azp) || ! in_array($tokenAzp, $normalizedOrigins, true)) {
            throw new UnexpectedValueException('Token azp is not authorized.');
        }

        if (empty($payload->sub)) {
            throw new UnexpectedValueException('Token missing sub.');
        }

        return $payload;
    }

    /**
     * Fetches user profile from Clerk API and enforces a verified primary email.
     *
     * @param string $sub
     * @return array
     *
     * @throws UnexpectedValueException
     * @throws RuntimeException
     */
    public function fetchUser(string $sub): array
    {
        $secretKey = config('services.clerk.secret_key');
        if (empty($secretKey)) {
            throw new UnexpectedValueException('Clerk secret key is not configured.');
        }

        $response = Http::withToken($secretKey)->get("https://api.clerk.com/v1/users/{$sub}");

        if (! $response->successful()) {
            throw new RuntimeException('Failed to fetch user from Clerk API: '.$response->body());
        }

        $data = $response->json();
        $primaryEmailId = $data['primary_email_address_id'] ?? null;
        $emailAddresses = $data['email_addresses'] ?? [];
        $verifiedPrimaryEmail = null;

        if ($primaryEmailId && is_array($emailAddresses)) {
            foreach ($emailAddresses as $emailItem) {
                if (($emailItem['id'] ?? null) === $primaryEmailId) {
                    if (($emailItem['verification']['status'] ?? null) === 'verified') {
                        $verifiedPrimaryEmail = $emailItem['email_address'] ?? null;
                    }
                    break;
                }
            }
        }

        if (! $verifiedPrimaryEmail) {
            throw new UnexpectedValueException('User primary email is not verified or missing.');
        }

        $firstName = $data['first_name'] ?? '';
        $lastName = $data['last_name'] ?? '';
        $name = trim("{$firstName} {$lastName}");
        if ($name === '' && ! empty($data['name'])) {
            $name = trim($data['name']);
        }

        return [
            'clerk_id' => $data['id'] ?? $sub,
            'email' => $verifiedPrimaryEmail,
            'name' => $name !== '' ? $name : null,
            'image' => $data['image_url'] ?? ($data['profile_image_url'] ?? null),
        ];
    }

    /**
     * Fetches JWKS from Clerk public endpoint.
     *
     * @return array
     */
    protected function fetchJwks(): array
    {
        $secretKey = config('services.clerk.secret_key');
        $request = $secretKey ? Http::withToken($secretKey) : Http::newPendingRequest();
        $response = $request->get('https://api.clerk.com/v1/jwks');

        if (! $response->successful()) {
            throw new RuntimeException('Failed to fetch JWKS from Clerk: '.$response->body());
        }

        $jwks = $response->json();
        if (! is_array($jwks) || empty($jwks['keys'])) {
            throw new RuntimeException('Invalid JWKS structure returned from Clerk.');
        }

        return $jwks;
    }
}
