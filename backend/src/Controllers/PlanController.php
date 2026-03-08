<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Models\Plan;
use App\Services\WriterProfileResolver;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class PlanController extends BaseController
{
    public function index(Request $request, Response $response): Response
    {
        $userId = (string) $request->getAttribute('user_id');
        $plans = Plan::query()
            ->where('created_by', $userId)
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (Plan $plan) => $plan->toApiArray())
            ->all();

        return $this->success($response, $plans);
    }

    public function show(Request $request, Response $response, array $args): Response
    {
        $plan = $this->findOwnedPlan((string) $request->getAttribute('user_id'), (int) $args['id']);
        if ($plan === null) {
            return $this->error($response, 'Plan not found', 404);
        }

        return $this->success($response, $plan->toApiArray());
    }

    public function create(Request $request, Response $response): Response
    {
        $userId = (string) $request->getAttribute('user_id');
        $data = $this->getRequestData($request);
        $plan = new Plan();
        $this->fillPlan($plan, $data, $userId);
        $plan->save();

        return $this->success($response, $plan->toApiArray(), 'Plan created', 201);
    }

    public function export(Request $request, Response $response, array $args): Response
    {
        $plan = $this->findOwnedPlan((string) $request->getAttribute('user_id'), (int) $args['id']);
        if ($plan === null) {
            return $this->error($response, 'Plan not found', 404);
        }

        $format = strtolower(trim((string) (($request->getQueryParams()['format'] ?? 'json'))));
        $payload = $this->buildExportPayload($plan);
        $slug = $this->slugify((string) $plan->title);

        if ($format === 'xml') {
            $xml = new \SimpleXMLElement('<romcon_plan/>');
            $this->appendXml($xml, $payload);
            $response->getBody()->write($xml->asXML() ?: '');
            return $response
                ->withHeader('Content-Type', 'application/xml')
                ->withHeader('Content-Disposition', "attachment; filename=\"{$slug}.xml\"");
        }

        $response->getBody()->write((string) json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        return $response
            ->withHeader('Content-Type', 'application/json')
            ->withHeader('Content-Disposition', "attachment; filename=\"{$slug}.json\"");
    }

    public function update(Request $request, Response $response, array $args): Response
    {
        $userId = (string) $request->getAttribute('user_id');
        $plan = $this->findOwnedPlan($userId, (int) $args['id']);
        if ($plan === null) {
            return $this->error($response, 'Plan not found', 404);
        }

        $this->fillPlan($plan, $this->getRequestData($request), $userId);
        $plan->save();

        return $this->success($response, $plan->toApiArray(), 'Plan updated');
    }

    public function delete(Request $request, Response $response, array $args): Response
    {
        $userId = (string) $request->getAttribute('user_id');
        $plan = $this->findOwnedPlan($userId, (int) $args['id']);
        if ($plan === null) {
            return $this->error($response, 'Plan not found', 404);
        }

        $plan->delete();
        return $this->success($response, null, 'Plan deleted');
    }

    private function findOwnedPlan(string $userId, int $planId): ?Plan
    {
        return Plan::query()
            ->where('id', $planId)
            ->where('created_by', $userId)
            ->first();
    }

    private function fillPlan(Plan $plan, array $data, string $userId): void
    {
        $now = date('Y-m-d H:i:s');
        $plan->created_by = $userId;
        $plan->title = trim((string) ($data['title'] ?? 'Untitled RomCom'));
        $plan->concept_brief = isset($data['concept_brief']) ? (string) $data['concept_brief'] : null;
        $plan->setting = isset($data['setting']) ? (string) $data['setting'] : null;
        $plan->romance_configuration = trim((string) ($data['romance_configuration'] ?? 'm/f'));
        $plan->main_character_focus = isset($data['main_character_focus']) ? (string) $data['main_character_focus'] : null;
        $plan->romance_structure_notes = isset($data['romance_structure_notes']) ? (string) $data['romance_structure_notes'] : null;
        $plan->pov_mode = trim((string) ($data['pov_mode'] ?? 'single_close_third'));
        $plan->pov_notes = isset($data['pov_notes']) ? (string) $data['pov_notes'] : null;
        $plan->dominant_romance_arc = isset($data['dominant_romance_arc']) ? (string) $data['dominant_romance_arc'] : null;
        $plan->central_external_pressure = isset($data['central_external_pressure']) ? (string) $data['central_external_pressure'] : null;
        $plan->emotional_question = isset($data['emotional_question']) ? (string) $data['emotional_question'] : null;
        $plan->flavor_seeds_json = json_encode($data['flavor_seeds'] ?? []);
        $plan->cast_json = json_encode($data['cast'] ?? []);
        $plan->chapter_details_json = json_encode($data['chapter_details'] ?? []);
        $plan->heat_level = trim((string) ($data['heat_level'] ?? 'sweet'));
        $plan->target_words = max(10000, (int) ($data['target_words'] ?? 30000));
        $plan->summary = isset($data['summary']) ? (string) $data['summary'] : null;
        $plan->lead_one_json = json_encode($data['lead_one'] ?? null);
        $plan->lead_two_json = json_encode($data['lead_two'] ?? null);
        $plan->pairing_json = json_encode($data['pairing'] ?? null);
        $plan->premise_json = json_encode($data['premise'] ?? null);
        $plan->trope_notes_json = json_encode($data['trope_notes'] ?? []);
        $plan->notes = isset($data['notes']) ? (string) $data['notes'] : null;
        if (!$plan->exists && empty($plan->created_at)) {
            $plan->created_at = $now;
        }
        $plan->updated_at = $now;
    }

    private function buildExportPayload(Plan $plan): array
    {
        $data = $plan->toApiArray();
        $writerProfile = (new WriterProfileResolver())->getEffectiveProfile((string) $plan->created_by);
        $selectedTrope = $this->resolveSelectedTrope($data);
        $supportingCast = $this->buildSupportingCast($data);
        $pairingSummary = $this->buildPairingSummary($data['pairing'] ?? null, $selectedTrope);
        $premiseSummary = $this->buildPremiseSummary($data['premise'] ?? null);

        return [
            'meta' => [
                'app' => 'RomCon',
                'exported_at' => date('c'),
                'plan_id' => $data['id'],
                'title' => $data['title'],
                'target_words' => $data['target_words'],
                'heat_level' => $data['heat_level'],
                'romance_configuration' => $data['romance_configuration'],
            ],
            'ai_novel_prompt_package' => [
                'instruction' => 'Use this plan package to write a romantic comedy novella. Preserve the leads, pairing logic, premise engine, chapter-beat intent, and tone.',
                'writer_profile' => $writerProfile,
                'title' => $data['title'],
                'concept_brief' => $data['concept_brief'],
                'setting' => $data['setting'],
                'romance_configuration' => $data['romance_configuration'],
                'main_character_focus' => $data['main_character_focus'],
                'romance_structure_notes' => $data['romance_structure_notes'],
                'pov_mode' => $data['pov_mode'],
                'pov_notes' => $data['pov_notes'],
                'dominant_romance_arc' => $data['dominant_romance_arc'],
                'central_external_pressure' => $data['central_external_pressure'],
                'emotional_question' => $data['emotional_question'],
                'heat_level' => $data['heat_level'],
                'target_words' => $data['target_words'],
                'selected_trope' => $selectedTrope,
                'lead_one' => $data['lead_one'],
                'lead_two' => $data['lead_two'],
                'supporting_cast' => $supportingCast,
                'pairing' => $pairingSummary,
                'premise' => $premiseSummary,
                'chapter_details' => $data['chapter_details'] ?? [],
                'flavor_seeds' => $data['flavor_seeds'],
                'notes' => $data['notes'],
            ],
        ];
    }

    private function buildSupportingCast(array $data): array
    {
        $cast = is_array($data['cast'] ?? null) ? $data['cast'] : [];
        $unique = [];
        $result = [];

        foreach ($cast as $member) {
            if (!is_array($member)) {
                continue;
            }

            if (($member['is_main'] ?? false) === true || ($member['include_in_story'] ?? true) === false) {
                continue;
            }

            $name = trim((string) ($member['name'] ?? ''));
            if ($name === '') {
                continue;
            }

            $key = mb_strtolower($name . '|' . trim((string) ($member['role'] ?? '')));
            if (isset($unique[$key])) {
                continue;
            }

            $unique[$key] = true;
            $result[] = $member;
        }

        return $result;
    }

    private function buildPairingSummary(mixed $pairing, string $selectedTrope): ?array
    {
        if (!is_array($pairing)) {
            return null;
        }

        return [
            'pairing_hook' => $pairing['pairing_hook'] ?? '',
            'selected_trope' => $selectedTrope,
            'why_they_clash' => $pairing['why_they_clash'] ?? [],
            'why_they_fit' => $pairing['why_they_fit'] ?? [],
            'scene_engines' => $pairing['scene_engines'] ?? [],
            'emotional_lessons' => $pairing['emotional_lessons'] ?? null,
            'risk_notes' => $pairing['risk_notes'] ?? [],
        ];
    }

    private function buildPremiseSummary(mixed $premise): ?array
    {
        if (!is_array($premise)) {
            return null;
        }

        return [
            'logline' => $premise['logline'] ?? '',
            'premise' => $premise['premise'] ?? '',
            'forced_proximity_device' => $premise['forced_proximity_device'] ?? '',
            'primary_obstacle' => $premise['primary_obstacle'] ?? '',
            'midpoint_shift' => $premise['midpoint_shift'] ?? '',
            'finale_payoff' => $premise['finale_payoff'] ?? '',
            'chapter_beats' => $premise['chapter_beats'] ?? [],
            'recurring_comedic_motif' => $premise['recurring_comedic_motif'] ?? '',
        ];
    }

    private function resolveSelectedTrope(array $data): string
    {
        $tropeNotes = is_array($data['trope_notes'] ?? null) ? $data['trope_notes'] : [];
        if ($tropeNotes !== [] && trim((string) $tropeNotes[0]) !== '') {
            return (string) $tropeNotes[0];
        }

        $pairing = $data['pairing'] ?? null;
        if (is_array($pairing) && trim((string) ($pairing['best_trope'] ?? '')) !== '') {
            return (string) $pairing['best_trope'];
        }

        return '';
    }

    private function slugify(string $value): string
    {
        $value = strtolower(trim($value));
        $value = preg_replace('/[^a-z0-9]+/', '-', $value) ?? 'romcon-plan';
        $value = trim($value, '-');
        return $value !== '' ? $value : 'romcon-plan';
    }

    private function appendXml(\SimpleXMLElement $element, mixed $data, string $defaultNodeName = 'item'): void
    {
        if (is_array($data)) {
            foreach ($data as $key => $value) {
                $nodeName = is_string($key) ? preg_replace('/[^a-zA-Z0-9_:-]/', '_', $key) : $defaultNodeName;
                $nodeName = $nodeName !== '' ? $nodeName : $defaultNodeName;
                $child = $element->addChild($nodeName);
                $this->appendXml($child, $value, $defaultNodeName);
            }
            return;
        }

        if ($data === null) {
            $element[0] = '';
            return;
        }

        $element[0] = htmlspecialchars((string) $data, ENT_QUOTES | ENT_XML1, 'UTF-8');
    }
}
