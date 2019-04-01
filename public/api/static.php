<?php declare (strict_types=1);

require_once '../_boot.php';

$allowedTypes = ['factories', 'specialBuildings', 'mines'];

if(!isset($_GET['type']) || !in_array($_GET['type'], $allowedTypes, true)) {
    header('HTTP/1.0 403 Forbidden');
    die;
}

$type = $_GET['type'];

header('Content-type: application/json');

if($type === 'factories') {
    echo json_encode((new Factory())->getFactories());
    die;
}

if($type === 'specialBuildings') {
    echo json_encode((new SpecialBuilding())->getSpecialBuildings());
    die;
}

if($type === 'mines') {
    echo json_encode((new Mine())->getMines());
}
