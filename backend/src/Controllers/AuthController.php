<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Models\User;
use Firebase\JWT\JWT;
use Illuminate\Database\Capsule\Manager as Capsule;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class AuthController extends BaseController
{
    private string $jwtSecret;
    private int $jwtExpiration;

    public function __construct()
    {
        $this->jwtSecret = trim((string) ($_ENV['JWT_SECRET'] ?? ''));
        $this->jwtExpiration = (int) ($_ENV['JWT_EXPIRATION'] ?? 86400);

        if ($this->jwtSecret === '') {
            throw new \RuntimeException('JWT_SECRET must be set in environment variables');
        }
    }

    public function login(Request $request, Response $response): Response
    {
        $data = $this->getRequestData($request);
        $identifier = trim((string) ($data['identifier'] ?? $data['email'] ?? ''));
        $password = (string) ($data['password'] ?? '');

        if ($identifier === '' || $password === '') {
            return $this->error($response, 'Identifier and password are required', 422);
        }

        $user = filter_var($identifier, FILTER_VALIDATE_EMAIL)
            ? User::where('email', $identifier)->first()
            : User::where('username', $identifier)->first();

        if (!$user || !password_verify($password, (string) $user->password_hash)) {
            return $this->error($response, 'Invalid credentials', 401);
        }

        return $this->success($response, [
            'token' => $this->createToken($user),
            'user' => $this->serializeUser($user),
            'expires_in' => $this->jwtExpiration,
        ], 'Login successful');
    }

    public function register(Request $request, Response $response): Response
    {
        $data = $this->getRequestData($request);
        $email = trim((string) ($data['email'] ?? ''));
        $username = trim((string) ($data['username'] ?? ''));
        $displayName = trim((string) ($data['display_name'] ?? $username));
        $password = (string) ($data['password'] ?? '');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->error($response, 'A valid email is required', 422);
        }
        if ($username === '' || strlen($username) < 3) {
            return $this->error($response, 'Username must be at least 3 characters', 422);
        }
        if (strlen($password) < 8) {
            return $this->error($response, 'Password must be at least 8 characters', 422);
        }
        if (User::where('email', $email)->exists()) {
            return $this->error($response, 'Email is already registered', 409);
        }
        if (User::where('username', $username)->exists()) {
            return $this->error($response, 'Username is already taken', 409);
        }

        $now = date('Y-m-d H:i:s');
        $user = User::create([
            'webhatch_id' => 'local:' . bin2hex(random_bytes(12)),
            'email' => $email,
            'username' => $username,
            'display_name' => $displayName,
            'role' => 'user',
            'is_verified' => true,
            'password_hash' => password_hash($password, PASSWORD_DEFAULT),
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $this->success($response, [
            'token' => $this->createToken($user),
            'user' => $this->serializeUser($user),
            'expires_in' => $this->jwtExpiration,
        ], 'Registration successful', 201);
    }

    public function currentUser(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        if (!$user) {
            return $this->error($response, 'User not authenticated', 401);
        }

        return $this->success($response, $user);
    }

    public function createGuestSession(Request $request, Response $response): Response
    {
        $guestId = 'guest_' . bin2hex(random_bytes(16));
        $username = 'guest_' . substr($guestId, 6, 8);
        $now = time();

        $payload = [
            'sub' => $guestId,
            'user_id' => $guestId,
            'email' => '',
            'username' => $username,
            'display_name' => 'Guest Cupid',
            'role' => 'guest',
            'is_guest' => true,
            'auth_type' => 'guest',
            'iat' => $now,
            'nbf' => $now - 5,
            'exp' => $now + (60 * 60 * 24 * 365),
            'jti' => bin2hex(random_bytes(12)),
        ];

        return $this->success($response, [
            'token' => JWT::encode($payload, $this->jwtSecret, 'HS256'),
            'user' => [
                'id' => $guestId,
                'email' => '',
                'username' => $username,
                'display_name' => 'Guest Cupid',
                'role' => 'guest',
                'is_verified' => false,
                'is_guest' => true,
                'auth_type' => 'guest',
            ],
        ], 'Guest session created', 201);
    }

    public function linkGuestAccount(Request $request, Response $response): Response
    {
        $user = $request->getAttribute('user');
        if (!is_array($user) || !isset($user['id'])) {
            return $this->error($response, 'Authentication required', 401);
        }

        if (($user['role'] ?? 'user') === 'guest' || ($user['is_guest'] ?? false) === true) {
            return $this->error($response, 'Guest destination is not allowed', 400);
        }

        $payload = $this->getRequestData($request);
        $guestUserId = trim((string) ($payload['guest_user_id'] ?? ''));
        if ($guestUserId === '' || !str_starts_with($guestUserId, 'guest_')) {
            return $this->error($response, 'Invalid guest_user_id', 400);
        }

        $this->syncLinkedUserProfile((string) $user['id'], (array) ($payload['frontpage_user'] ?? []));

        $destinationUserId = (string) $user['id'];

        $movedPlans = Capsule::table('plans')
            ->where('created_by', $guestUserId)
            ->update(['created_by' => $destinationUserId]);
        $movedFlavorSeeds = Capsule::table('flavor_seeds')
            ->where('created_by', $guestUserId)
            ->update(['created_by' => $destinationUserId]);
        $movedLibraryEntries = Capsule::table('character_library_entries')
            ->where('created_by', $guestUserId)
            ->update(['created_by' => $destinationUserId]);
        $movedWriterProfiles = Capsule::table('writer_profiles')
            ->where('created_by', $guestUserId)
            ->update(['created_by' => $destinationUserId]);
        $movedTropes = Capsule::table('tropes')
            ->where('created_by', $guestUserId)
            ->where('is_global', 0)
            ->update(['created_by' => $destinationUserId]);
        $totalMoved = $movedPlans + $movedFlavorSeeds + $movedLibraryEntries + $movedWriterProfiles + $movedTropes;

        return $this->success($response, [
            'guest_user_id' => $guestUserId,
            'linked_to_user_id' => $destinationUserId,
            'moved_rows_by_table' => [
                'plans' => $movedPlans,
                'flavor_seeds' => $movedFlavorSeeds,
                'character_library_entries' => $movedLibraryEntries,
                'writer_profiles' => $movedWriterProfiles,
                'tropes' => $movedTropes,
            ],
            'total_moved_rows' => $totalMoved,
        ], 'Guest account linked successfully');
    }

    private function syncLinkedUserProfile(string $userId, array $frontpageUser): void
    {
        $user = User::find((int) $userId);
        if ($user === null) {
            return;
        }

        $email = trim((string) ($frontpageUser['email'] ?? ''));
        $username = trim((string) ($frontpageUser['username'] ?? ''));
        $displayName = trim((string) ($frontpageUser['display_name'] ?? ''));
        $role = trim((string) ($frontpageUser['role'] ?? ''));
        $webhatchId = trim((string) ($frontpageUser['id'] ?? ''));
        $dirty = false;

        if ($webhatchId !== '' && (string) $user->webhatch_id !== $webhatchId) {
            $user->webhatch_id = $webhatchId;
            $dirty = true;
        }
        if ($email !== '' && (string) $user->email !== $email) {
            $user->email = $email;
            $dirty = true;
        }
        if ($username !== '' && (string) $user->username !== $username) {
            $user->username = $username;
            $dirty = true;
        }
        if ($displayName !== '' && (string) $user->display_name !== $displayName) {
            $user->display_name = $displayName;
            $dirty = true;
        }
        if ($role !== '' && (string) $user->role !== $role) {
            $user->role = $role;
            $dirty = true;
        }

        if ($dirty) {
            $user->updated_at = date('Y-m-d H:i:s');
            $user->save();
        }
    }

    private function createToken(User $user): string
    {
        $now = time();
        $payload = [
            'sub' => (string) $user->id,
            'user_id' => (string) $user->id,
            'email' => (string) $user->email,
            'username' => (string) $user->username,
            'display_name' => (string) $user->display_name,
            'role' => (string) $user->role,
            'auth_type' => 'local',
            'is_guest' => false,
            'iat' => $now,
            'exp' => $now + $this->jwtExpiration,
        ];

        return JWT::encode($payload, $this->jwtSecret, 'HS256');
    }

    private function serializeUser(User $user): array
    {
        return [
            'id' => (string) $user->id,
            'email' => (string) $user->email,
            'username' => (string) $user->username,
            'display_name' => (string) $user->display_name,
            'role' => (string) $user->role,
            'is_verified' => (bool) $user->is_verified,
            'is_guest' => false,
            'auth_type' => 'local',
            'created_at' => (string) $user->created_at,
            'updated_at' => (string) $user->updated_at,
        ];
    }
}
