<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Models\Short;
use App\Services\ShortScriptNormalizer;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class ShortController extends BaseController
{
    public function index(Request $request, Response $response): Response
    {
        $userId = (string) $request->getAttribute('user_id');
        $shorts = Short::query()
            ->where('created_by', $userId)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Short $short) => $short->toApiArray())
            ->all();

        return $this->success($response, $shorts);
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $userId = (string) $request->getAttribute('user_id');
        $short = Short::query()
            ->where('id', (int) $args['id'])
            ->where('created_by', $userId)
            ->first();

        if ($short === null) {
            return $this->error($response, 'Short not found', 404);
        }

        try {
            $normalized = ShortScriptNormalizer::normalize($this->getRequestData($request));
        } catch (\Throwable $exception) {
            return $this->error($response, $exception->getMessage(), 422);
        }

        $short->title = $normalized['title'];
        $short->trope = $normalized['trope'];
        $short->script_json = (string) json_encode($normalized);
        $short->updated_at = date('Y-m-d H:i:s');
        $short->save();

        return $this->success($response, $short->toApiArray(), 'Short updated');
    }

    public function delete(Request $request, Response $response, array $args): Response
    {
        $userId = (string) $request->getAttribute('user_id');
        $short = Short::query()
            ->where('id', (int) $args['id'])
            ->where('created_by', $userId)
            ->first();

        if ($short === null) {
            return $this->error($response, 'Short not found', 404);
        }

        $short->delete();
        return $this->success($response, null, 'Short deleted');
    }
}
