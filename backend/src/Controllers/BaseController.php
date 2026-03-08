<?php

declare(strict_types=1);

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

abstract class BaseController
{
    protected function success(Response $response, mixed $data = null, string $message = 'OK', int $status = 200): Response
    {
        $payload = [
            'success' => true,
            'message' => $message,
            'data' => $data,
        ];

        $response->getBody()->write((string) json_encode($payload));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
    }

    protected function error(Response $response, string $message, int $status = 400, array $details = []): Response
    {
        $payload = [
            'success' => false,
            'message' => $message,
        ];

        if ($details !== []) {
            $payload['errors'] = $details;
        }

        $response->getBody()->write((string) json_encode($payload));
        return $response->withHeader('Content-Type', 'application/json')->withStatus($status);
    }

    protected function getRequestData(Request $request): array
    {
        $parsed = $request->getParsedBody();
        return is_array($parsed) ? $parsed : [];
    }
}
