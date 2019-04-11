<?php declare(strict_types=1);

require_once '../_boot.php';

header('Content-type: application/json');

echo json_encode((new Mines())->get());
