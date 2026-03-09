<?php

declare(strict_types=1);

namespace App\Middleware;

use App\Models\User;
use Firebase\JWT\BeforeValidException;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\SignatureInvalidException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as Handler;
use Slim\Psr7\Response as SlimResponse;

final class JwtAuthMiddleware implements MiddlewareInterface
{
    private string $jwtSecret;

    public function __construct()
    {
        $this->jwtSecret = trim((string) ($_ENV['JWT_SECRET'] ?? ''));
        if ($this->jwtSecret === '') {
            throw new \RuntimeException('JWT_SECRET must be set in environment variables');
        }
    }

    public function process(Request $request, Handler $handler): Response
    {
        $header = $request->getHeaderLine('Authorization');
        if (!preg_match('/Bearer\s+(.*)$/i', $header, $matches)) {
            return $this->jsonError('Missing or invalid token', 401);
        }

        try {
            $claims = JWT::decode($matches[1], new Key($this->jwtSecret, 'HS256'));
        } catch (ExpiredException|BeforeValidException|SignatureInvalidException $exception) {
            return $this->jsonError('Invalid token: ' . $exception->getMessage(), 401);
        } catch (\Throwable $exception) {
            return $this->jsonError('Authentication failed', 401);
        }

        $userId = (string) ($claims->user_id ?? $claims->sub ?? '');
        $isGuest = (bool) ($claims->is_guest ?? false);

        $userPayload = [
            'id' => $userId,
            'email' => (string) ($claims->email ?? ''),
            'username' => (string) ($claims->username ?? ''),
            'display_name' => (string) ($claims->display_name ?? ''),
            'role' => (string) ($claims->role ?? 'user'),
            'is_guest' => $isGuest,
            'auth_type' => (string) ($claims->auth_type ?? 'local'),
        ];

        if (!$isGuest) {
            $dbUser = $this->resolveUserFromClaims($claims, $userPayload);
            if ($dbUser === null) {
                return $this->jsonError('User not found', 401);
            }

            $userPayload = [
                'id' => (string) $dbUser->id,
                'email' => (string) $dbUser->email,
                'username' => (string) $dbUser->username,
                'display_name' => (string) $dbUser->display_name,
                'role' => (string) $dbUser->role,
                'is_guest' => false,
                'auth_type' => (string) ($claims->auth_type ?? 'local'),
            ];
            $userId = (string) $dbUser->id;
        }

        $request = $request
            ->withAttribute('user_id', $userId)
            ->withAttribute('user', $userPayload);

        return $handler->handle($request);
    }

    private function resolveUserFromClaims(object $claims, array $userPayload): ?User
    {
        $userId = (string) ($claims->user_id ?? $claims->sub ?? '');
        $email = trim((string) ($claims->email ?? ''));
        $username = trim((string) ($claims->username ?? ''));
        $displayName = trim((string) ($claims->display_name ?? ''));
        $role = trim((string) ($claims->role ?? 'user')) ?: 'user';

        if ($username === '' && $email !== '') {
            $username = strstr($email, '@', true) ?: $email;
        }

        if ($displayName === '') {
            $displayName = $username !== '' ? $username : $email;
        }

        if ($userId !== '' && ctype_digit($userId)) {
            $dbUser = User::find((int) $userId);
            if ($dbUser !== null) {
                return $dbUser;
            }
        }

        $dbUser = null;
        if ($userId !== '') {
            $dbUser = User::where('webhatch_id', $userId)->first();
        }

        if ($dbUser === null && $email !== '') {
            $dbUser = User::where('email', $email)->first();
        }

        if ($dbUser === null && $username !== '') {
            $dbUser = User::where('username', $username)->first();
        }

        $now = date('Y-m-d H:i:s');

        if ($dbUser === null) {
            if ($userId === '' || $email === '') {
                return null;
            }

            return User::create([
                'webhatch_id' => $userId,
                'email' => $email,
                'username' => $this->buildUniqueUsername($username !== '' ? $username : $email),
                'display_name' => $displayName !== '' ? $displayName : $email,
                'role' => $role,
                'is_verified' => true,
                'password_hash' => password_hash(bin2hex(random_bytes(24)), PASSWORD_DEFAULT),
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $dirty = false;

        if ($userId !== '' && (string) $dbUser->webhatch_id !== $userId) {
            $dbUser->webhatch_id = $userId;
            $dirty = true;
        }
        if ($email !== '' && (string) $dbUser->email !== $email) {
            $dbUser->email = $email;
            $dirty = true;
        }
        if ($username !== '' && (string) $dbUser->username !== $username) {
            $existingForUsername = User::where('username', $username)->first();
            if ($existingForUsername === null || (int) $existingForUsername->id === (int) $dbUser->id) {
                $dbUser->username = $username;
                $dirty = true;
            }
        }
        $nextDisplayName = $displayName !== '' ? $displayName : $email;
        if ($nextDisplayName !== '' && (string) $dbUser->display_name !== $nextDisplayName) {
            $dbUser->display_name = $nextDisplayName;
            $dirty = true;
        }
        if ((string) $dbUser->role !== $role) {
            $dbUser->role = $role;
            $dirty = true;
        }

        if ($dirty) {
            $dbUser->updated_at = $now;
            $dbUser->save();
        }

        return $dbUser;
    }

    private function buildUniqueUsername(string $base): string
    {
        $normalized = strtolower(trim($base));
        $normalized = preg_replace('/[^a-z0-9_]+/', '_', $normalized) ?? 'user';
        $normalized = trim($normalized, '_');
        $normalized = $normalized !== '' ? $normalized : 'user';
        $candidate = substr($normalized, 0, 80);
        $suffix = 1;

        while (User::where('username', $candidate)->exists()) {
            $suffixText = '_' . $suffix;
            $candidate = substr($normalized, 0, max(1, 80 - strlen($suffixText))) . $suffixText;
            $suffix++;
        }

        return $candidate;
    }

    private function jsonError(string $message, int $status): Response
    {
        $response = new SlimResponse($status);
        $response->getBody()->write((string) json_encode([
            'success' => false,
            'message' => $message,
        ]));
        return $response->withHeader('Content-Type', 'application/json');
    }
}
