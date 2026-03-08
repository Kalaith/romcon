<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Models\FlavorSeed;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class FlavorSeedController extends BaseController
{
    public function index(Request $request, Response $response): Response
    {
        $userId = (string) $request->getAttribute('user_id');
        $seeds = FlavorSeed::query()
            ->where('created_by', $userId)
            ->orderBy('label')
            ->get()
            ->map(fn (FlavorSeed $seed) => $seed->toApiArray())
            ->all();

        return $this->success($response, $seeds);
    }

    public function create(Request $request, Response $response): Response
    {
        $userId = (string) $request->getAttribute('user_id');
        $data = $this->getRequestData($request);
        $label = trim((string) ($data['label'] ?? ''));

        if ($label === '') {
            return $this->error($response, 'label is required', 422);
        }

        $existing = FlavorSeed::query()
            ->where('created_by', $userId)
            ->whereRaw('LOWER(label) = ?', [mb_strtolower($label)])
            ->first();

        if ($existing !== null) {
            return $this->success($response, $existing->toApiArray(), 'Flavor seed already exists');
        }

        $seed = new FlavorSeed();
        $seed->created_by = $userId;
        $seed->label = $label;
        $seed->save();

        return $this->success($response, $seed->toApiArray(), 'Flavor seed created', 201);
    }

    public function delete(Request $request, Response $response, array $args): Response
    {
        $userId = (string) $request->getAttribute('user_id');
        $seed = FlavorSeed::query()
            ->where('id', (int) $args['id'])
            ->where('created_by', $userId)
            ->first();

        if ($seed === null) {
            return $this->error($response, 'Flavor seed not found', 404);
        }

        $seed->delete();
        return $this->success($response, null, 'Flavor seed deleted');
    }
}
