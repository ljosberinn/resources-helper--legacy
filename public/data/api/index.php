<?php declare(strict_types=1);

/** @noinspection PhpIncludeInspection */
require_once dirname(__DIR__, 2) . '/_boot.php';

header('Content-type: application/json');

$response = [
    'success' => false,
    'actor'   => 0,
];

if(isset($_GET['query'], $_GET['key'])) {

    [$query, $key] = [(int) $_GET['query'], $_GET['key']];

    $APIHandler = new APIHandler();

    if($APIHandler->isValidKey($key) && $APIHandler->queryExists($query)) {

        $APIHandler->setKey($key);
        $APIHandler->setQuery($query);

        $response = $APIHandler->handleQuery();
    }
}

echo json_encode($response, JSON_NUMERIC_CHECK);
