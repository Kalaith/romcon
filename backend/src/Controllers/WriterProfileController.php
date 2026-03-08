<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Models\WriterProfile;
use App\Services\WriterProfileResolver;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class WriterProfileController extends BaseController
{
    public function show(Request $request, Response $response): Response
    {
        $userId = (string) $request->getAttribute('user_id');
        $resolver = new WriterProfileResolver();
        $default = $resolver->getDefaultProfile();
        $custom = $resolver->getCustomProfile($userId);

        return $this->success($response, [
            'default_profile' => $default,
            'custom_profile' => $custom ?? '',
            'effective_profile' => $custom ?? $default,
            'is_default' => $custom === null,
        ]);
    }

    public function update(Request $request, Response $response): Response
    {
        $userId = (string) $request->getAttribute('user_id');
        $data = $this->getRequestData($request);
        $profileMarkdown = trim((string) ($data['profile_markdown'] ?? ''));
        $now = date('Y-m-d H:i:s');

        $profile = WriterProfile::query()
            ->where('created_by', $userId)
            ->first();

        if ($profileMarkdown === '') {
            if ($profile !== null) {
                $profile->delete();
            }

            return $this->show($request, $response);
        }

        if ($profile === null) {
            $profile = new WriterProfile();
            $profile->created_by = $userId;
            $profile->created_at = $now;
        }

        $profile->profile_markdown = $profileMarkdown;
        $profile->updated_at = $now;
        $profile->save();

        return $this->show($request, $response);
    }
}
