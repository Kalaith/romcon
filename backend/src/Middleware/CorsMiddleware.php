<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as Handler;
use Slim\Psr7\Response as SlimResponse;

final class CorsMiddleware implements MiddlewareInterface
{
    public function process(Request $request, Handler $handler): Response
    {
        $allowedOrigins = array_values(array_filter(array_map(
            'trim',
            explode(',', (string) ($_ENV['CORS_ALLOWED_ORIGINS'] ?? '*'))
        )));

        $origin = trim($request->getHeaderLine('Origin'));
        $allowOrigin = $origin;
        if ($origin === '' || ($allowedOrigins !== ['*'] && !in_array($origin, $allowedOrigins, true))) {
            $allowOrigin = $allowedOrigins[0] ?? '*';
        }

        if (strtoupper($request->getMethod()) === 'OPTIONS') {
            $response = new SlimResponse(204);
        } else {
            $response = $handler->handle($request);
        }

        return $response
            ->withHeader('Access-Control-Allow-Origin', $allowOrigin)
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->withHeader('Access-Control-Allow-Credentials', 'true');
    }
}
