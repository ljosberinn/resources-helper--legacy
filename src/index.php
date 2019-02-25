<?php declare(strict_types=1);

require_once '_boot.php';

$APIHandler = new APIHandler($_GET['key'], (int) $_GET['query']);

echo $APIHandler->handleQuery();
