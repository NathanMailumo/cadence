<?php

use App\Models\User;
use Firebase\JWT\JWT;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\RateLimiter;

beforeEach(function () {
    Cache::flush();
    RateLimiter::clear('clerk.sync');

    $keyData = json_decode(file_get_contents(__DIR__.'/../fixtures_keys.json'), true);
    $this->privateKey = $keyData['private_key'];
    $this->forgedPrivateKey = $keyData['forged_private_key'];
    $this->jwk = $keyData['jwk'];
    $this->kid = $keyData['jwk']['kid'];

    $this->issuer = 'https://clerk.example.com';
    $this->allowedOrigin = 'http://localhost';

    config([
        'services.clerk.secret_key' => 'clerk_test_secret_key',
        'services.clerk.issuer' => $this->issuer,
        'services.clerk.allowed_origins' => [$this->allowedOrigin],
    ]);

    $this->makeToken = function (array $overrides = [], ?string $key = null, ?string $kid = null) {
        $claims = array_merge([
            'sub' => 'user_attacker_123',
            'iss' => $this->issuer,
            'azp' => $this->allowedOrigin,
            'exp' => time() + 3600,
            'nbf' => time() - 10,
        ], $overrides);

        return JWT::encode($claims, $key ?? $this->privateKey, 'RS256', $kid ?? $this->kid);
    };

    $this->fakeClerkApis = function (?array $userOverrides = null) {
        $userData = array_merge([
            'id' => 'user_attacker_123',
            'first_name' => 'Attacker',
            'last_name' => 'User',
            'image_url' => 'https://example.com/attacker.png',
            'primary_email_address_id' => 'email_1',
            'email_addresses' => [
                [
                    'id' => 'email_1',
                    'email_address' => 'attacker@example.com',
                    'verification' => [
                        'status' => 'verified',
                    ],
                ],
            ],
        ], $userOverrides ?? []);

        Http::fake([
            'https://api.clerk.com/v1/jwks' => Http::response(['keys' => [$this->jwk]], 200),
            'https://api.clerk.com/v1/users/*' => Http::response($userData, 200),
        ]);
    };
});

test('it returns 401 for a missing token', function () {
    ($this->fakeClerkApis)();

    $response = $this->postJson('/clerk-sync', []);

    $response->assertStatus(401)
        ->assertJson([
            'errors' => ['email' => ['Unable to verify your sign in. Please try again.']],
        ]);
    $this->assertGuest();
});

test('it returns 401 for a forged token', function () {
    ($this->fakeClerkApis)();

    // Token signed with an untrusted private key matching kid
    $forgedToken = ($this->makeToken)([], $this->forgedPrivateKey);

    $response = $this->withHeader('Authorization', 'Bearer '.$forgedToken)
        ->postJson('/clerk-sync', []);

    $response->assertStatus(401)
        ->assertJson([
            'errors' => ['email' => ['Unable to verify your sign in. Please try again.']],
        ]);
    $this->assertGuest();
});

test('it returns 401 for an expired token', function () {
    ($this->fakeClerkApis)();

    $expiredToken = ($this->makeToken)([
        'exp' => time() - 60,
    ]);

    $response = $this->withHeader('Authorization', 'Bearer '.$expiredToken)
        ->postJson('/clerk-sync', []);

    $response->assertStatus(401)
        ->assertJson([
            'errors' => ['email' => ['Unable to verify your sign in. Please try again.']],
        ]);
    $this->assertGuest();
});

test('it returns 401 for a wrong-issuer token', function () {
    ($this->fakeClerkApis)();

    $wrongIssuerToken = ($this->makeToken)([
        'iss' => 'https://malicious-issuer.com',
    ]);

    $response = $this->withHeader('Authorization', 'Bearer '.$wrongIssuerToken)
        ->postJson('/clerk-sync', []);

    $response->assertStatus(401)
        ->assertJson([
            'errors' => ['email' => ['Unable to verify your sign in. Please try again.']],
        ]);
    $this->assertGuest();
});

test('it returns 401 for a wrong-azp token', function () {
    ($this->fakeClerkApis)();

    $wrongAzpToken = ($this->makeToken)([
        'azp' => 'https://malicious-origin.com',
    ]);

    $response = $this->withHeader('Authorization', 'Bearer '.$wrongAzpToken)
        ->postJson('/clerk-sync', []);

    $response->assertStatus(401)
        ->assertJson([
            'errors' => ['email' => ['Unable to verify your sign in. Please try again.']],
        ]);
    $this->assertGuest();
});

test('it returns 401 for an unverified-email token', function () {
    // Primary email is not verified
    ($this->fakeClerkApis)([
        'email_addresses' => [
            [
                'id' => 'email_1',
                'email_address' => 'attacker@example.com',
                'verification' => [
                    'status' => 'unverified',
                ],
            ],
        ],
    ]);

    $validToken = ($this->makeToken)();

    $response = $this->withHeader('Authorization', 'Bearer '.$validToken)
        ->postJson('/clerk-sync', []);

    $response->assertStatus(401)
        ->assertJson([
            'errors' => ['email' => ['Unable to verify your sign in. Please try again.']],
        ]);
    $this->assertGuest();
});

test('the request body email and clerk_id are ignored and logs in as the attacker', function () {
    ($this->fakeClerkApis)();

    $attackerToken = ($this->makeToken)();

    // Attacker supplies their valid token, but includes victim data in the body
    $response = $this->withHeader('Authorization', 'Bearer '.$attackerToken)
        ->postJson('/clerk-sync', [
            'clerk_id' => 'user_victim_999',
            'email' => 'victim@example.com',
            'name' => 'Victim User',
        ]);

    $response->assertStatus(200)
        ->assertJson(['success' => true]);

    $this->assertAuthenticated();

    // Verified user in database must be attacker, not victim
    $authenticatedUser = Auth::user();
    expect($authenticatedUser->clerk_id)->toBe('user_attacker_123')
        ->and($authenticatedUser->email)->toBe('attacker@example.com')
        ->and(User::where('email', 'victim@example.com')->exists())->toBeFalse();
});

test('the throttle returns 429 on /clerk-sync', function () {
    ($this->fakeClerkApis)();

    $token = ($this->makeToken)();

    for ($i = 0; $i < 20; $i++) {
        auth()->logout();
        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/clerk-sync', []);
        $response->assertStatus(200);
    }

    auth()->logout();
    $throttled = $this->withHeader('Authorization', 'Bearer '.$token)
        ->postJson('/clerk-sync', []);

    $throttled->assertStatus(429);
});
