<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\CharacterLibraryEntry;
use App\Models\Plan;

final class CharacterLibrarySyncService
{
    public function syncFromGeneratedFields(string $userId, array $generatedFields, ?Plan $plan = null): void
    {
        $title = $plan?->title ? (string) $plan->title : '';

        if (isset($generatedFields['lead_one']) && is_array($generatedFields['lead_one'])) {
            $this->upsertLead($userId, $generatedFields['lead_one'], $title, 'Lead One');
        }

        if (isset($generatedFields['lead_two']) && is_array($generatedFields['lead_two'])) {
            $this->upsertLead($userId, $generatedFields['lead_two'], $title, 'Lead Two');
        }

        if (isset($generatedFields['cast']) && is_array($generatedFields['cast'])) {
            foreach ($generatedFields['cast'] as $member) {
                if (is_array($member)) {
                    $this->upsertCastMember($userId, $member);
                }
            }
        }
    }

    public function syncFromAllPlans(string $userId): void
    {
        $plans = Plan::query()
            ->where('created_by', $userId)
            ->get();

        foreach ($plans as $plan) {
            $data = $plan->toApiArray();

            if (is_array($data['lead_one'] ?? null)) {
                $this->upsertLead($userId, $data['lead_one'], (string) ($data['title'] ?? ''), 'Lead One');
            }

            if (is_array($data['lead_two'] ?? null)) {
                $this->upsertLead($userId, $data['lead_two'], (string) ($data['title'] ?? ''), 'Lead Two');
            }

            if (is_array($data['cast'] ?? null)) {
                foreach ($data['cast'] as $member) {
                    if (is_array($member)) {
                        $this->upsertCastMember($userId, $member);
                    }
                }
            }
        }
    }

    private function upsertLead(string $userId, array $character, string $planTitle, string $leadLabel): void
    {
        $name = trim((string) ($character['name'] ?? ''));
        if ($name === '') {
            return;
        }

        $role = trim((string) ($character['occupation'] ?? $leadLabel));
        $entry = $this->findExisting($userId, $name, $role) ?? new CharacterLibraryEntry();
        if (!$entry->exists) {
            $entry->created_by = $userId;
            $entry->created_at = date('Y-m-d H:i:s');
        }

        $entry->name = $name;
        $entry->role = $role;
        $entry->summary = $this->preferLonger((string) ($entry->summary ?? ''), (string) ($character['personality_summary'] ?? ''));
        $entry->connection_to_leads = $this->preferLonger((string) ($entry->connection_to_leads ?? ''), 'Main romantic lead in ' . ($planTitle !== '' ? $planTitle : 'a saved story'));
        $entry->story_function = $this->preferLonger((string) ($entry->story_function ?? ''), 'Primary romantic lead');
        $entry->core_desire = $this->preferLonger((string) ($entry->core_desire ?? ''), (string) ($character['core_desire'] ?? ''));
        $entry->core_fear = $this->preferLonger((string) ($entry->core_fear ?? ''), (string) ($character['core_fear'] ?? ''));
        $entry->secret_pressure = $this->preferLonger((string) ($entry->secret_pressure ?? ''), (string) ($character['secret_pressure'] ?? ''));
        $entry->comedic_angle = $this->preferLonger((string) ($entry->comedic_angle ?? ''), (string) ($character['comedic_weakness'] ?? ''));
        $entry->updated_at = date('Y-m-d H:i:s');
        $entry->save();
    }

    private function upsertCastMember(string $userId, array $member): void
    {
        $name = trim((string) ($member['name'] ?? ''));
        if ($name === '') {
            return;
        }

        $role = trim((string) ($member['role'] ?? ''));
        $entry = $this->findExisting($userId, $name, $role) ?? new CharacterLibraryEntry();
        if (!$entry->exists) {
            $entry->created_by = $userId;
            $entry->created_at = date('Y-m-d H:i:s');
        }

        $entry->name = $name;
        $entry->role = $role;
        $entry->summary = $this->preferLonger((string) ($entry->summary ?? ''), (string) ($member['summary'] ?? ''));
        $entry->connection_to_leads = $this->preferLonger((string) ($entry->connection_to_leads ?? ''), (string) ($member['connection_to_leads'] ?? ''));
        $entry->story_function = $this->preferLonger((string) ($entry->story_function ?? ''), (string) ($member['story_function'] ?? ''));
        $entry->core_desire = $this->preferLonger((string) ($entry->core_desire ?? ''), (string) ($member['core_desire'] ?? ''));
        $entry->core_fear = $this->preferLonger((string) ($entry->core_fear ?? ''), (string) ($member['core_fear'] ?? ''));
        $entry->secret_pressure = $this->preferLonger((string) ($entry->secret_pressure ?? ''), (string) ($member['secret_pressure'] ?? ''));
        $entry->comedic_angle = $this->preferLonger((string) ($entry->comedic_angle ?? ''), (string) ($member['comedic_angle'] ?? ''));
        $entry->updated_at = date('Y-m-d H:i:s');
        $entry->save();
    }

    private function findExisting(string $userId, string $name, string $role): ?CharacterLibraryEntry
    {
        return CharacterLibraryEntry::query()
            ->where('created_by', $userId)
            ->whereRaw('LOWER(name) = ?', [mb_strtolower($name)])
            ->whereRaw('LOWER(COALESCE(role, "")) = ?', [mb_strtolower($role)])
            ->first();
    }

    private function preferLonger(string $current, string $candidate): string
    {
        $current = trim($current);
        $candidate = trim($candidate);

        if ($candidate === '') {
            return $current;
        }

        if ($current === '' || strlen($candidate) > strlen($current)) {
            return $candidate;
        }

        return $current;
    }
}
