<?php declare(strict_types=1);

require_once dirname(__DIR__, 1) . '/_boot.php';

$marketPrices = new MarketPrices();

print_r($marketPrices->getPrices());
