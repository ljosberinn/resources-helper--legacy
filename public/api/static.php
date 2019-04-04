<?php declare (strict_types=1);

require_once '../_boot.php';

$allowedTypes = ['factories', 'specialBuildings', 'mines'];

if(!isset($_GET['type']) || !in_array($_GET['type'], $allowedTypes, true)) {
    header('HTTP/1.0 403 Forbidden');
    die;
}

$type = $_GET['type'];

header('Content-type: application/json');

$response = [];

if($type === 'factories') {
    $response = (new Factory())->getFactories();
}

if($type === 'specialBuildings') {
    $response = (new SpecialBuilding())->getSpecialBuildings();
}

if($type === 'mines') {
    $response = (new Mine())->getMines();
}

echo json_encode($response);
