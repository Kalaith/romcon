<?php

declare(strict_types=1);

use App\Controllers\AuthController;
use App\Controllers\CharacterLibraryController;
use App\Controllers\FlavorSeedController;
use App\Controllers\GeneratorController;
use App\Controllers\PlanController;
use App\Controllers\TropeController;
use App\Controllers\WriterProfileController;
use App\Middleware\JwtAuthMiddleware;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\App;
use Slim\Routing\RouteCollectorProxy;

return function (App $app) {
    $app->get('/health', function (Request $request, Response $response) {
        $data = [
            'status' => 'ok',
            'service' => 'romcon-api',
            'timestamp' => date('c'),
        ];

        $response->getBody()->write((string) json_encode($data));
        return $response->withHeader('Content-Type', 'application/json');
    });

    $app->group('/auth', function (RouteCollectorProxy $auth) {
        $auth->post('/login', [AuthController::class, 'login']);
        $auth->post('/register', [AuthController::class, 'register']);
        $auth->post('/guest-session', [AuthController::class, 'createGuestSession']);
        $auth->get('/current-user', [AuthController::class, 'currentUser'])->add(new JwtAuthMiddleware());
        $auth->post('/link-guest', [AuthController::class, 'linkGuestAccount'])->add(new JwtAuthMiddleware());
    });

    $app->group('/catalog', function (RouteCollectorProxy $catalog) {
        $catalog->get('/tropes', [TropeController::class, 'index']);
        $catalog->post('/tropes', [TropeController::class, 'create']);
        $catalog->delete('/tropes/{id}', [TropeController::class, 'delete']);
    })->add(new JwtAuthMiddleware());

    $app->group('/flavor-seeds', function (RouteCollectorProxy $seeds) {
        $seeds->get('', [FlavorSeedController::class, 'index']);
        $seeds->post('', [FlavorSeedController::class, 'create']);
        $seeds->delete('/{id}', [FlavorSeedController::class, 'delete']);
    })->add(new JwtAuthMiddleware());

    $app->group('/character-library', function (RouteCollectorProxy $library) {
        $library->get('', [CharacterLibraryController::class, 'index']);
        $library->post('', [CharacterLibraryController::class, 'create']);
        $library->put('/{id}', [CharacterLibraryController::class, 'update']);
        $library->delete('/{id}', [CharacterLibraryController::class, 'delete']);
    })->add(new JwtAuthMiddleware());

    $app->group('/writer-profile', function (RouteCollectorProxy $profile) {
        $profile->get('', [WriterProfileController::class, 'show']);
        $profile->put('', [WriterProfileController::class, 'update']);
    })->add(new JwtAuthMiddleware());

    $app->group('/plans', function (RouteCollectorProxy $plans) {
        $plans->get('', [PlanController::class, 'index']);
        $plans->post('', [PlanController::class, 'create']);
        $plans->get('/{id}', [PlanController::class, 'show']);
        $plans->get('/{id}/export', [PlanController::class, 'export']);
        $plans->put('/{id}', [PlanController::class, 'update']);
        $plans->delete('/{id}', [PlanController::class, 'delete']);
    })->add(new JwtAuthMiddleware());

    $app->group('/generate', function (RouteCollectorProxy $generate) {
        $generate->post('/character-pack', [GeneratorController::class, 'characterPack']);
        $generate->post('/cast', [GeneratorController::class, 'cast']);
        $generate->post('/cast-member', [GeneratorController::class, 'castMember']);
        $generate->post('/chapter-details', [GeneratorController::class, 'chapterDetails']);
        $generate->post('/pairing', [GeneratorController::class, 'pairing']);
        $generate->post('/premise', [GeneratorController::class, 'premise']);
    })->add(new JwtAuthMiddleware());
};
