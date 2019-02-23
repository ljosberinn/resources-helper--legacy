<?php

declare(strict_types=1);

require_once 'vendor/autoload.php';

use Tracy\Debugger;

Debugger::enable(Debugger::DETECT);
Debugger::$logSeverity = E_NOTICE | E_WARNING;
Debugger::$strictMode  = true;

spl_autoload_register(function($className) {
    if(file_exists('dependencies/classes/' . $className . '.php')) {
        require_once 'dependencies/classes/' . $className . '.php';
    }
});

$dotenv = \Dotenv\Dotenv::create(__DIR__);
$dotenv->load();
$dotenv->required(['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS']);

ob_start(function($buffer) {
    $search = [
        '/\>[^\S ]+/s',      // strip whitespaces after tags, except space
        '/[^\S ]+\</s',      // strip whitespaces before tags, except space
        '/(\s)+/s',          // shorten multiple whitespace sequences
        '/<!--(.|\s)*?-->/', // Remove HTML comments
    ];

    $replace = [
        '>',
        '<',
        '\\1',
        '',
    ];

    return preg_replace($search, $replace, $buffer);
});
