<?php declare(strict_types=1);

$response = [];

header('Content-type: application/json');

$dirName = dirname(__DIR__, 2) . '/static';

$staticDirectories = (array) scandir($dirName . '/', SCANDIR_SORT_NONE);
$staticDirectories = array_slice($staticDirectories, 2);

$queryExists  = isset($_GET['type']);
$isValidQuery = in_array($_GET['type'], $staticDirectories, true);
$dirName      .= '/' . $_GET['type'];

if(!$queryExists || !$isValidQuery || !is_dir($dirName)) {
    echo json_encode($response);
    die;
}

$files = (array) scandir($dirName, SCANDIR_SORT_NONE);
$files = array_slice($files, 2);

foreach($files as $fileName) {
    // e.g. ./static/factories/6.php
    $response[] = require $dirName . '/' . $fileName;
}

echo json_encode($response, JSON_NUMERIC_CHECK);
