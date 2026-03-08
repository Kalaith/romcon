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

        if (!$isGuest && ctype_digit($userId)) {
            $dbUser = User::find((int) $userId);
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
                'auth_type' => 'local',
            ];
        }

        $request = $request
            ->withAttribute('user_id', $userId)
            ->withAttribute('user', $userPayload);

        return $handler->handle($request);
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
