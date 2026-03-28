<?php

declare(strict_types=1);

use App\Middleware\CorsMiddleware;
use Dotenv\Dotenv;
use Illuminate\Database\Capsule\Manager as Capsule;
use Slim\Factory\AppFactory;

$autoloader = null;

$searchDir = __DIR__;
for ($i = 0; $i < 8; $i++) {
    $candidate = $searchDir . '/vendor/autoload.php';
    if (file_exists($candidate)) {
        $autoloader = $candidate;
        break;
    }

    $parent = dirname($searchDir);
    if ($parent === $searchDir) {
        break;
    }
    $searchDir = $parent;
}

if ($autoloader === null) {
    $fallbackCandidates = [
        __DIR__ . '/../vendor/autoload.php',
        __DIR__ . '/../../vendor/autoload.php',
        __DIR__ . '/../../../vendor/autoload.php',
        __DIR__ . '/../../../../vendor/autoload.php',
    ];

    foreach ($fallbackCandidates as $candidate) {
        if (file_exists($candidate)) {
            $autoloader = $candidate;
            break;
        }
    }
}

if ($autoloader === null) {
    throw new RuntimeException('Composer autoload.php not found for romcon backend.');
}

$loader = require_once $autoloader;
$projectSrc = realpath(__DIR__ . '/../src') ?: (__DIR__ . '/../src');
if (is_object($loader) && method_exists($loader, 'addPsr4')) {
    $loader->addPsr4('App\\', rtrim($projectSrc, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR, true);
}

spl_autoload_register(static function (string $class): void {
    if (strpos($class, 'App\\') !== 0) {
        return;
    }

    $path = __DIR__ . '/../src/' . str_replace('\\', '/', substr($class, 4)) . '.php';
    if (file_exists($path)) {
        require_once $path;
    }
}, true, true);

$dotenv = Dotenv::createImmutable(__DIR__ . '/..');
$dotenv->safeLoad();

$requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_NAME', 'DB_USER', 'JWT_SECRET', 'GEMINI_API_KEY'];
foreach ($requiredEnvVars as $var) {
    if (!isset($_ENV[$var]) || trim((string) $_ENV[$var]) === '') {
        throw new RuntimeException("Missing required environment variable: {$var}");
    }
}

$capsule = new Capsule();
$capsule->addConnection([
    'driver' => 'mysql',
    'host' => $_ENV['DB_HOST'],
    'port' => $_ENV['DB_PORT'],
    'database' => $_ENV['DB_NAME'],
    'username' => $_ENV['DB_USER'],
    'password' => $_ENV['DB_PASSWORD'] ?? '',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'prefix' => '',
]);
$capsule->setAsGlobal();
$capsule->bootEloquent();

$schema = $capsule->schema();
if ($schema->hasTable('plans') && !$schema->hasColumn('plans', 'draft_chapters_json')) {
    $schema->table('plans', static function ($table): void {
        $table->longText('draft_chapters_json')->nullable()->after('chapter_details_json');
    });
}

$app = AppFactory::create();

$basePath = trim((string) ($_ENV['API_BASE_PATH'] ?? ''));
if ($basePath === '') {
    $requestUri = (string) ($_SERVER['REQUEST_URI'] ?? '');
    if (preg_match('#^(.*?/api)(?:/|$)#', $requestUri, $matches)) {
        $basePath = $matches[1];
    }
}
if ($basePath !== '') {
    $app->setBasePath(rtrim($basePath, '/'));
}

$app->add(new CorsMiddleware());
$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();

$displayErrorDetails = filter_var($_ENV['APP_DEBUG'] ?? 'false', FILTER_VALIDATE_BOOLEAN);
$errorMiddleware = $app->addErrorMiddleware($displayErrorDetails, true, true);
$errorHandler = $errorMiddleware->getDefaultErrorHandler();
$errorHandler->forceContentType('application/json');
$errorHandler->registerErrorRenderer('application/json', static function ($exception, bool $display) {
    $payload = [
        'success' => false,
        'message' => $exception->getMessage(),
    ];

    if ($display) {
        $payload['details'] = [
            'type' => get_class($exception),
            'code' => $exception->getCode(),
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
        ];
    }

    return json_encode($payload, JSON_PRETTY_PRINT);
});

$routes = require_once __DIR__ . '/../src/routes.php';
$routes($app);

$app->run();
