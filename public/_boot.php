<?php declare(strict_types=1);

use Dotenv\Dotenv;
use Tracy\Debugger;

require_once 'vendor/autoload.php';

Debugger::enable(Debugger::DETECT);
Debugger::$logSeverity = E_NOTICE | E_WARNING;
Debugger::$strictMode  = true;

spl_autoload_register(function($className) {
    $path = __DIR__ . '/dependencies/classes/' . $className . '.php';
    if(file_exists($path)) {
        require_once $path;
    }
});

$dotenv = Dotenv::create(__DIR__);
$dotenv->load();
$dotenv->required(['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS']);
