<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Models\TropeEntry;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class TropeController extends BaseController
{
    public function index(Request $request, Response $response): Response
    {
        $userId = (string) $request->getAttribute('user_id');
        $user = $request->getAttribute('user');
        $isAdmin = is_array($user) && (($user['role'] ?? 'user') === 'admin');

        $tropes = TropeEntry::query()
            ->where(static function ($query) use ($userId) {
                $query->where('is_global', 1)
                    ->orWhere('created_by', $userId);
            })
            ->orderByDesc('is_global')
            ->orderBy('name')
            ->get()
            ->map(fn (TropeEntry $trope) => $this->toApiArray($trope, $userId, $isAdmin))
            ->all();

        return $this->success($response, $tropes);
    }

    public function create(Request $request, Response $response): Response
    {
        $userId = (string) $request->getAttribute('user_id');
        $user = $request->getAttribute('user');
        $isAdmin = is_array($user) && (($user['role'] ?? 'user') === 'admin');
        $data = $this->getRequestData($request);
        $trope = new TropeEntry();
        $now = date('Y-m-d H:i:s');
        $error = $this->fillTrope($trope, $data, $userId, $isAdmin);

        if ($error !== null) {
            return $this->error($response, $error, 422);
        }

        $trope->created_at = $now;
        $trope->updated_at = $now;
        $trope->save();
        return $this->success($response, $this->toApiArray($trope, $userId, $isAdmin), 'Trope created', 201);
    }

    public function delete(Request $request, Response $response, array $args): Response
    {
        $userId = (string) $request->getAttribute('user_id');
        $user = $request->getAttribute('user');
        $isAdmin = is_array($user) && (($user['role'] ?? 'user') === 'admin');

        $trope = TropeEntry::query()->where('id', (int) $args['id'])->first();
        if ($trope === null) {
            return $this->error($response, 'Trope not found', 404);
        }

        if ((int) $trope->is_global === 1 && !$isAdmin) {
            return $this->error($response, 'Only admins can delete global tropes', 403);
        }

        if ((int) $trope->is_global !== 1 && (string) $trope->created_by !== $userId && !$isAdmin) {
            return $this->error($response, 'You cannot delete this trope', 403);
        }

        $trope->delete();
        return $this->success($response, null, 'Trope deleted');
    }

    private function fillTrope(TropeEntry $trope, array $data, string $userId, bool $isAdmin): ?string
    {
        $name = trim((string) ($data['name'] ?? ''));
        $clashEngine = trim((string) ($data['clash_engine'] ?? ''));
        $bestFor = trim((string) ($data['best_for'] ?? ''));
        $wantsGlobal = (bool) ($data['is_global'] ?? false);
        $scopeIsGlobal = $isAdmin && $wantsGlobal;

        if ($name === '' || $clashEngine === '' || $bestFor === '') {
            return 'name, clash_engine, and best_for are required';
        }

        $existing = TropeEntry::query()
            ->whereRaw('LOWER(name) = ?', [mb_strtolower($name)])
            ->where('is_global', $scopeIsGlobal ? 1 : 0)
            ->where(static function ($query) use ($scopeIsGlobal, $userId) {
                if ($scopeIsGlobal) {
                    $query->whereNull('created_by');
                    return;
                }

                $query->where('created_by', $userId);
            })
            ->first();

        if ($existing !== null) {
            return 'A trope with that name already exists in this scope';
        }

        $trope->created_by = $userId;
        $trope->name = $name;
        $trope->clash_engine = $clashEngine;
        $trope->best_for = $bestFor;
        $trope->is_global = $scopeIsGlobal ? 1 : 0;

        if ($scopeIsGlobal) {
            $trope->created_by = null;
        }

        return null;
    }

    private function toApiArray(TropeEntry $trope, string $userId, bool $isAdmin): array
    {
        $isGlobal = (int) $trope->is_global === 1;

        return [
            'id' => (int) $trope->id,
            'name' => (string) $trope->name,
            'clash_engine' => (string) $trope->clash_engine,
            'best_for' => (string) $trope->best_for,
            'is_global' => $isGlobal,
            'created_by' => (string) ($trope->created_by ?? ''),
            'can_manage' => $isGlobal ? $isAdmin : ($isAdmin || (string) $trope->created_by === $userId),
            'created_at' => (string) $trope->created_at,
            'updated_at' => (string) $trope->updated_at,
        ];
    }
}
