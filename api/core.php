<?php

session_start();

header("Content-type: application/json");

require "db.php";
require "class.resourcesGame.php";

if (isset($_SESSION["id"])) {
    $userId = $_SESSION["id"];
} else if(isset($_GET["id"])) {
    $userId = $_GET["id"];
} else {
    $userId = 0;
}

$prices = "off";
$resourcesGame = new resourcesGame($host, $user, $pw, $db, $prices);

if (isset($_GET["key"]) && isset($_GET["query"]) && $userId != 0) {

    $output = $resourcesGame->getAPIData($_GET["query"], $_GET["key"], $userId, $_GET["anonymity"]);

} elseif(isset($_GET["mineMap"])) {
    $output = json_encode($resourcesGame->getPersonalMineMap($userId), JSON_NUMERIC_CHECK);
} elseif(isset($_GET["tradeLog"])) {
    $output = json_encode($resourcesGame->getTradeLog($userId), JSON_NUMERIC_CHECK);
} elseif(isset($_GET["attackLog"])) {
    $output = json_encode($resourcesGame->getAttackLog($userId), JSON_NUMERIC_CHECK);
} elseif(isset($_GET["missions"])) {
    $output = json_encode($resourcesGame->getMissions($userId), JSON_NUMERIC_CHECK);
} else {

    $prices = "on";
    $resourcesGame = new resourcesGame($host, $user, $pw, $db, $prices);

    $baseData = [
    "material" => $resourcesGame->getRawData("resources"),
    "products" => $resourcesGame->getRawData("factories"),
    "loot" => $resourcesGame->getRawData("loot"),
    "units" => $resourcesGame->getRawData("units"),
    "headquarter" => $resourcesGame->getRawData("headquarter"),
    "buildings" => $resourcesGame->getRawData("buildings"),
    "settings" => $resourcesGame->getRawData("settings"),
    "userInformation" => [],
    "attackLog" => [],
    "mineMap" => [],
    "missions" => [],
    "tradeLog" => []
    ];

    if ($userId !== 0) {
        $baseData["material"] = $resourcesGame->getUserMaterials($baseData["material"], $userId); // stable
        $baseData["products"] = $resourcesGame->getUserFactories($baseData["products"], $userId); // stable
        $baseData["buildings"] = $resourcesGame->getUserSpecialBuildings($baseData["buildings"], $userId); // stable
        $baseData["headquarter"] = $resourcesGame->getUserHeadquarter($baseData["headquarter"], $userId); // stable
        $baseData["settings"] = $resourcesGame->getUserSettings($baseData["settings"], $userId); // stable
        $baseData = $resourcesGame->getUserWarehouseContent($baseData, $userId); // stable
        $baseData["userInformation"] = $resourcesGame->getUserInfo($userId); // stable
        #$baseData["attackLog"] = $resourcesGame->getAttackLog($userId); // stable
        #$baseData["mineMap"] = $resourcesGame->getPersonalMineMap($userId); // stable
        $baseData["missions"] = $resourcesGame->getMissions($userId); // stable
        #$baseData["tradeLog"] = $resourcesGame->getTradeLog($userId); // stable
    }

    $baseData = $resourcesGame->getLanguageVariables($baseData); // stable

    $output = json_encode($baseData, JSON_NUMERIC_CHECK);
}

echo $output;
