<?php

declare(strict_types=1);

namespace App\Controllers;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class CatalogController extends BaseController
{
    public function tropes(Request $request, Response $response): Response
    {
        return $this->success($response, [
            [
                'name' => 'Fake Dating',
                'clash_engine' => 'performative intimacy with private denial',
                'best_for' => 'image problems, family pressure, public stakes',
            ],
            [
                'name' => 'Enemies to Lovers',
                'clash_engine' => 'status rivalry and misread motives',
                'best_for' => 'sharp banter, competence attraction, forced teamwork',
            ],
            [
                'name' => 'Forced Proximity',
                'clash_engine' => 'daily logistical collision',
                'best_for' => 'roommates, road trips, inherited businesses',
            ],
            [
                'name' => 'Second Chance',
                'clash_engine' => 'history versus current self',
                'best_for' => 'regret, growth, small-town return stories',
            ],
            [
                'name' => 'Opposites Attract',
                'clash_engine' => 'one lead solves problems the other lead avoids',
                'best_for' => 'clean novella engines with obvious chemistry',
            ],
            [
                'name' => 'Accidental Partnership',
                'clash_engine' => 'shared success depends on trust',
                'best_for' => 'events, businesses, pets, weddings, property',
            ],
        ]);
    }
}
