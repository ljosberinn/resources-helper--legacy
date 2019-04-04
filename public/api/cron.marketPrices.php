<?php declare(strict_types=1);

require_once dirname(__DIR__, 1) . '/_boot.php';

header('Content-type: application/json');

$marketPrices = new MarketPrices();

echo json_encode([
    'success' => $marketPrices->save($marketPrices->transformPrices($marketPrices->curlPrices())),
]);

