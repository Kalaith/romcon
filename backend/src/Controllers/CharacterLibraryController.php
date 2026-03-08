<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Models\CharacterLibraryEntry;
use App\Services\CharacterLibrarySyncService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class CharacterLibraryController extends BaseController
{
    public function index(Request $request, Response $response): Response
    {
        $userId = (string) $request->getAttribute('user_id');
        (new CharacterLibrarySyncService())->syncFromAllPlans($userId);
        $entries = CharacterLibraryEntry::query()
            ->where('created_by', $userId)
            ->orderBy('name')
            ->get()
            ->map(fn (CharacterLibraryEntry $entry) => $entry->toApiArray())
            ->all();

        return $this->success($response, $entries);
    }

    public function create(Request $request, Response $response): Response
    {
        $userId = (string) $request->getAttribute('user_id');
        $data = $this->getRequestData($request);

        $entry = new CharacterLibraryEntry();
        $error = $this->fillEntry($entry, $data, $userId);
        if ($error !== null) {
            return $this->error($response, $error, 422);
        }

        $entry->save();
        return $this->success($response, $entry->toApiArray(), 'Character saved to library', 201);
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $userId = (string) $request->getAttribute('user_id');
        $entry = CharacterLibraryEntry::query()
            ->where('id', (int) $args['id'])
            ->where('created_by', $userId)
            ->first();

        if ($entry === null) {
            return $this->error($response, 'Library character not found', 404);
        }

        $error = $this->fillEntry($entry, $this->getRequestData($request), $userId);
        if ($error !== null) {
            return $this->error($response, $error, 422);
        }

        $entry->save();
        return $this->success($response, $entry->toApiArray(), 'Library character updated');
    }

    public function delete(Request $request, Response $response, array $args): Response
    {
        $userId = (string) $request->getAttribute('user_id');
        $entry = CharacterLibraryEntry::query()
            ->where('id', (int) $args['id'])
            ->where('created_by', $userId)
            ->first();

        if ($entry === null) {
            return $this->error($response, 'Library character not found', 404);
        }

        $entry->delete();
        return $this->success($response, null, 'Library character deleted');
    }

    private function fillEntry(CharacterLibraryEntry $entry, array $data, string $userId): ?string
    {
        $name = trim((string) ($data['name'] ?? ''));
        if ($name === '') {
            return 'name is required';
        }

        $entry->created_by = $userId;
        $entry->name = $name;
        $entry->role = trim((string) ($data['role'] ?? ''));
        $entry->summary = trim((string) ($data['summary'] ?? ''));
        $entry->connection_to_leads = trim((string) ($data['connection_to_leads'] ?? ''));
        $entry->story_function = trim((string) ($data['story_function'] ?? ''));
        $entry->core_desire = trim((string) ($data['core_desire'] ?? ''));
        $entry->core_fear = trim((string) ($data['core_fear'] ?? ''));
        $entry->secret_pressure = trim((string) ($data['secret_pressure'] ?? ''));
        $entry->comedic_angle = trim((string) ($data['comedic_angle'] ?? ''));

        return null;
    }
}
