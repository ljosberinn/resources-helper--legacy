<?php declare (strict_types = 1);

$response = [];

header('Content-type: application/json');

$dirName = dirname(__DIR__, 2) . '/static';

$staticDirectories = (array) scandir($dirName . '/');
$staticDirectories = array_slice($staticDirectories, 2);

$queryExists = isset($_GET['type']);
$isValidQuery = in_array($_GET['type'], $staticDirectories, true);
$dirName .= '/' . $_GET['type'];

if (!$queryExists || !$isValidQuery || !is_dir($dirName)) {
    echo json_encode($response);
    die;
}

$isLocalizationQuery = isset($_GET['locale'], $_GET['component']);

if (!$isLocalizationQuery) {

    $files = (array) scandir($dirName);
    $files = array_slice($files, 2);

    foreach ($files as $fileName) {
        // e.g. ./static/factories/6.php
        $response[] = require $dirName . '/' . $fileName;
    }

    usort($response, function (array $a, array $b) {
        return $a['id'] > $b['id'] ? 1 : -1;
    });

    echo json_encode($response, JSON_NUMERIC_CHECK);
    die;
}

$component = $dirName . '/' . $_GET['component'] . '.php';

if (file_exists($component)) {
    $localization = require $component;
    $locale = $_GET['locale'];

    foreach ($localization as $key => $value) {
        if (array_key_exists($locale, $value)) {
            $response[$key] = $value[$locale];
        }
    }
}

echo json_encode($response, JSON_NUMERIC_CHECK);
