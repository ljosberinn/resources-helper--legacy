<?php declare(strict_types=1);

require_once '../_boot.php';

$marketPrices = new MarketPrices();

$marketPrices->setExportType($_GET['type'] ?? 'json');
$marketPrices->setExportRange(isset($_GET['range']) ? (int) $_GET['range'] : 72);

echo $marketPrices->export();
