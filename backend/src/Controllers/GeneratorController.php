<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Actions\GenerateCharacterPackAction;
use App\Actions\GenerateChapterDetailsAction;
use App\Actions\GenerateCastAction;
use App\Actions\GenerateCastMemberAction;
use App\Actions\GeneratePairingAction;
use App\Actions\GeneratePremiseAction;
use App\Models\Plan;
use App\Services\CharacterLibrarySyncService;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class GeneratorController extends BaseController
{
    public function characterPack(Request $request, Response $response): Response
    {
        try {
            $payload = $this->getRequestData($request);
            $action = new GenerateCharacterPackAction();
            $result = $action->execute($payload, (string) $request->getAttribute('user_id'));
            $plan = $this->saveGeneratedResult((string) $request->getAttribute('user_id'), $payload, [
                'lead_one' => $result['lead_one'] ?? null,
                'lead_two' => $result['lead_two'] ?? null,
                'summary' => isset($payload['brief']) ? 'Generated from: ' . (string) $payload['brief'] : null,
                'pairing' => null,
                'premise' => null,
            ]);

            return $this->success($response, $plan->toApiArray());
        } catch (\Throwable $exception) {
            return $this->error($response, $exception->getMessage(), 422);
        }
    }

    public function pairing(Request $request, Response $response): Response
    {
        try {
            $payload = $this->getRequestData($request);
            $action = new GeneratePairingAction();
            $result = $action->execute($payload, (string) $request->getAttribute('user_id'));
            $plan = $this->saveGeneratedResult((string) $request->getAttribute('user_id'), $payload, [
                'pairing' => $result,
                'premise' => null,
            ]);

            return $this->success($response, $plan->toApiArray());
        } catch (\Throwable $exception) {
            return $this->error($response, $exception->getMessage(), 422);
        }
    }

    public function premise(Request $request, Response $response): Response
    {
        try {
            $payload = $this->getRequestData($request);
            $action = new GeneratePremiseAction();
            $result = $action->execute($payload, (string) $request->getAttribute('user_id'));
            $plan = $this->saveGeneratedResult((string) $request->getAttribute('user_id'), $payload, [
                'premise' => $result,
            ]);

            return $this->success($response, $plan->toApiArray());
        } catch (\Throwable $exception) {
            return $this->error($response, $exception->getMessage(), 422);
        }
    }

    public function cast(Request $request, Response $response): Response
    {
        try {
            $payload = $this->getRequestData($request);
            $action = new GenerateCastAction();
            $result = $action->execute($payload, (string) $request->getAttribute('user_id'));
            $plan = $this->saveGeneratedResult((string) $request->getAttribute('user_id'), $payload, [
                'cast' => $result['cast'] ?? $result,
            ]);

            return $this->success($response, $plan->toApiArray());
        } catch (\Throwable $exception) {
            return $this->error($response, $exception->getMessage(), 422);
        }
    }

    public function chapterDetails(Request $request, Response $response): Response
    {
        try {
            $payload = $this->getRequestData($request);
            $action = new GenerateChapterDetailsAction();
            $result = $action->execute($payload, (string) $request->getAttribute('user_id'));
            $plan = $this->saveGeneratedResult((string) $request->getAttribute('user_id'), $payload, [
                'chapter_details' => $result['chapter_details'] ?? $result,
            ]);

            return $this->success($response, $plan->toApiArray());
        } catch (\Throwable $exception) {
            return $this->error($response, $exception->getMessage(), 422);
        }
    }

    public function castMember(Request $request, Response $response): Response
    {
        try {
            $payload = $this->getRequestData($request);
            $action = new GenerateCastMemberAction();
            $result = $action->execute($payload, (string) $request->getAttribute('user_id'));

            return $this->success($response, $result);
        } catch (\Throwable $exception) {
            return $this->error($response, $exception->getMessage(), 422);
        }
    }

    private function saveGeneratedResult(string $userId, array $payload, array $generatedFields): Plan
    {
        $planId = isset($payload['plan_id']) ? (int) $payload['plan_id'] : 0;
        $plan = $planId > 0
            ? Plan::query()->where('id', $planId)->where('created_by', $userId)->first()
            : null;

        if ($plan === null) {
            $plan = new Plan();
            $plan->created_by = $userId;
            $plan->created_at = date('Y-m-d H:i:s');
        }

        $plan->title = trim((string) ($payload['title'] ?? $plan->title ?? 'Untitled RomCom'));
        $plan->concept_brief = isset($payload['brief'])
            ? (string) $payload['brief']
            : (isset($payload['concept_brief']) ? (string) $payload['concept_brief'] : $plan->concept_brief);
        $plan->setting = isset($payload['setting']) ? (string) $payload['setting'] : $plan->setting;
        $plan->romance_configuration = isset($payload['romance_configuration']) ? (string) $payload['romance_configuration'] : ($plan->romance_configuration ?? 'm/f');
        $plan->main_character_focus = isset($payload['main_character_focus']) ? (string) $payload['main_character_focus'] : $plan->main_character_focus;
        $plan->romance_structure_notes = isset($payload['romance_structure_notes']) ? (string) $payload['romance_structure_notes'] : $plan->romance_structure_notes;
        $plan->pov_mode = isset($payload['pov_mode']) ? (string) $payload['pov_mode'] : ($plan->pov_mode ?? 'single_close_third');
        $plan->pov_notes = isset($payload['pov_notes']) ? (string) $payload['pov_notes'] : $plan->pov_notes;
        $plan->dominant_romance_arc = isset($payload['dominant_romance_arc']) ? (string) $payload['dominant_romance_arc'] : $plan->dominant_romance_arc;
        $plan->central_external_pressure = isset($payload['central_external_pressure']) ? (string) $payload['central_external_pressure'] : $plan->central_external_pressure;
        $plan->emotional_question = isset($payload['emotional_question']) ? (string) $payload['emotional_question'] : $plan->emotional_question;
        $plan->flavor_seeds_json = json_encode($payload['flavor_seeds'] ?? json_decode((string) ($plan->flavor_seeds_json ?? '[]'), true) ?? []);
        $plan->heat_level = trim((string) ($payload['heat_level'] ?? $plan->heat_level ?? 'sweet'));
        $plan->target_words = max(10000, (int) ($payload['target_words'] ?? $plan->target_words ?? 30000));
        $plan->trope_notes_json = json_encode($payload['trope_notes'] ?? json_decode((string) ($plan->trope_notes_json ?? '[]'), true) ?? []);
        $plan->notes = isset($payload['notes']) ? (string) $payload['notes'] : $plan->notes;

        if (array_key_exists('lead_one', $payload) && !array_key_exists('lead_one', $generatedFields)) {
            $plan->lead_one_json = json_encode($payload['lead_one']);
        }
        if (array_key_exists('lead_two', $payload) && !array_key_exists('lead_two', $generatedFields)) {
            $plan->lead_two_json = json_encode($payload['lead_two']);
        }
        if (array_key_exists('pairing', $payload) && !array_key_exists('pairing', $generatedFields)) {
            $plan->pairing_json = json_encode($payload['pairing']);
        }
        if (array_key_exists('premise', $payload) && !array_key_exists('premise', $generatedFields)) {
            $plan->premise_json = json_encode($payload['premise']);
        }
        if (array_key_exists('cast', $payload) && !array_key_exists('cast', $generatedFields)) {
            $plan->cast_json = json_encode($payload['cast']);
        }
        if (array_key_exists('chapter_details', $payload) && !array_key_exists('chapter_details', $generatedFields)) {
            $plan->chapter_details_json = json_encode($payload['chapter_details']);
        }

        if (array_key_exists('lead_one', $generatedFields)) {
            $plan->lead_one_json = json_encode($generatedFields['lead_one']);
        }
        if (array_key_exists('lead_two', $generatedFields)) {
            $plan->lead_two_json = json_encode($generatedFields['lead_two']);
        }
        if (array_key_exists('pairing', $generatedFields)) {
            $plan->pairing_json = json_encode($generatedFields['pairing']);
        }
        if (array_key_exists('premise', $generatedFields)) {
            $plan->premise_json = json_encode($generatedFields['premise']);
        }
        if (array_key_exists('cast', $generatedFields)) {
            $plan->cast_json = json_encode($generatedFields['cast']);
        }
        if (array_key_exists('chapter_details', $generatedFields)) {
            $plan->chapter_details_json = json_encode($generatedFields['chapter_details']);
        }
        if (array_key_exists('summary', $generatedFields)) {
            $plan->summary = $generatedFields['summary'];
        }

        $plan->updated_at = date('Y-m-d H:i:s');
        $plan->save();
        (new CharacterLibrarySyncService())->syncFromGeneratedFields($userId, $generatedFields, $plan);

        return $plan;
    }
}
