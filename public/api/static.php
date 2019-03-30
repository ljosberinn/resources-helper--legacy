<?php declare (strict_types=1);

$response = [];

header('Content-type: application/json');

$dirName = dirname(__DIR__, 1) . '/static';

$staticDirectories = (array) scandir($dirName . '/', SCANDIR_SORT_ASCENDING);
$staticDirectories = array_slice($staticDirectories, 2);

$queryExists  = isset($_GET['type']);
$isValidQuery = in_array($_GET['type'], $staticDirectories, true);
$dirName      .= '/' . $_GET['type'];

if(!$queryExists || !$isValidQuery || !is_dir($dirName)) {
    echo json_encode($response);
    die;
}

$files = (array) scandir($dirName, SCANDIR_SORT_ASCENDING);
$files = array_slice($files, 2);

$additionalKeys = [
    'hasDetailsVisible' => false,
];

foreach($files as $fileName) {
    // e.g. ./static/factories/6.php
    $index = substr((string) $fileName, 0, -4);

    $data = require $dirName . '/' . $fileName;

    foreach($additionalKeys as $additionalKey => $baseValue) {
        $data[$additionalKey] = $baseValue;
    }

    $response[$index] = $data;
}

echo json_encode($response, JSON_NUMERIC_CHECK);
