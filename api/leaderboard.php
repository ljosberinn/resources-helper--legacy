<?php

require_once "class.resourcesGame.php";
require_once "db.php";

session_start ();

/**
 * Connects to database
 *
 * @param string $host [host]
 * @param string $user [user]
 * @param string $pw   [password]
 * @param string $db   [database]
 *
 * @return object $conn [database connection mysqli]
 */
function connect ($host, $user, $pw, $db) {
    $conn = new mysqli($host, $user, $pw, $db);
    $conn->set_charset ("utf8");

    return $conn;
}

/**
 * Fetches prices...
 *
 * @param string $host [host]
 * @param string $user [user]
 * @param string $pw   [password]
 * @param string $db   [database]
 *
 * @return array $prices [array split up in "material", "products", "loot" and "units]
 */
function getPrices ($host, $user, $pw, $db) {

    $rGame = new resourcesGame($host, $user, $pw, $db, "on");

    $prices = $rGame->getAllPrices ();

    return $prices;
}

/**
 * Returns corresponding query depending on type
 *
 * @param string $type [query type to be fetched]
 *
 * @return string [sql query]
 */
function returnQueries ($type) {
    switch ($type) {
        case "general":
            return "SELECT `name`, `points`, `rank`, `level`, `registeredGame` FROM `userOverview` WHERE `id` = ?";
            break;
        case "headquarter":
            return "SELECT `mineCount`, `level`, `progress0`, `progress1`, `progress2`, `progress3` FROM `userHeadquarter` WHERE `id` = ?";
            break;
        case "material":
            return "SELECT `perHour0`, `amountOfMines0`, `perHour1`, `amountOfMines1`, `perHour2`, `amountOfMines2`, `perHour3`, `amountOfMines3`, `perHour4`, `amountOfMines4`, `perHour5`, `amountOfMines5`, `perHour6`, `amountOfMines6`, `perHour7`, `amountOfMines7`, `perHour8`, `amountOfMines8`, `perHour9`, `amountOfMines9`, `perHour10`, `amountOfMines10`, `perHour11`, `amountOfMines11`, `perHour12`, `amountOfMines12`, `perHour13`, `amountOfMines13` FROM `userMaterial` WHERE `id` = ?";
        case "products":
            return "SELECT `factory0`, `factory1`, `factory2`, `factory3`, `factory4`, `factory5`, `factory6`, `factory7`, `factory8`, `factory9`, `factory10`, `factory11`, `factory12`, `factory13`, `factory14`, `factory15`, `factory16`, `factory17`, `factory18`, `factory19`, `factory20`, `factory21` FROM `userFactories` WHERE `id` = ?";
            break;
        case "buildings":
            return "SELECT `building0`, `building1`, `building2`, `building3`, `building4`, `building5`, `building6`, `building7`, `building8`, `building9`, `building10`, `building11`, `building12`, `building13` FROM `userBuildings` WHERE `id` = ?";
            break;
        case "warehouse":
            return "SELECT
        `level0`, `level1`, `level2`, `level3`, `level4`, `level5`, `level6`, `level7`, `level8`, `level9`, `level10`, `level11`, `level12`, `level13`, `level14`, `level15`, `level16`, `level17`, `level18`, `level19`, `level20`, `level21`, `level22`, `level23`, `level24`, `level25`, `level26`, `level27`, `level28`, `level29`, `level30`, `level31`, `level32`, `level33`, `level34`, `level35`, `level36`, `level37`, `level38`, `level39`, `level40`, `level41`, `level42`, `level43`, `level44`, `level45`, `level46`, `level47`, `level48`, `level49`, `level50`, `level51`, `level52`, `level53`, `level54`, `level55`, `level56`,  `level57` FROM `userWarehouse` WHERE `id` = ?";
    }
}

/**
 * Outputs valid user IDs
 *
 * @param object $result [resulting object]
 * @param object $query  [prepared statement]
 * @param string $target [targeted subarray]
 * @param number $userId [user id]
 *
 * @method public shoveDataToArray
 * @return array [userIds]
 */
function shoveDataToArray ($result, $query, $target, $userId) {
    $query->bind_param ("s", $userId);
    $query->execute ();
    $queryData = $query->get_result ();

    while ($data = $queryData->fetch_assoc ()) {
        $result[$userId][$target] = $data;

        if ($target == "general") {
            $daysPlaying                                = round ((time () - $data["registeredGame"]) / 86400) + 1;
            $result[$userId][$target]["pointsPerDay"]   = round ($data["points"] / $daysPlaying);
            $result[$userId][$target]["daysPlaying"]    = $daysPlaying;
            $result[$userId][$target]["registeredGame"] = date ("Y-m-j h:i (a)", $data["registeredGame"]);
        }
    }

    return $result;
}

/**
 * Outputs valid user IDs
 *
 * @param object $conn [database conncetion]
 *
 * @method getValidUserIds
 * @return array [userIds]
 */
function getValidUserIds ($conn) {
    $userIds       = [];
    $getUsersQuery = "SELECT userOverview.id, userSettings.mayOverwriteAPI FROM `userOverview` LEFT JOIN `userSettings` ON userOverview.id = userSettings.id WHERE userSettings.mayOverWriteAPI = 0 AND userOverview.hashedKey != ''";
    $getUsers      = $conn->query ($getUsersQuery);

    if ($getUsers->num_rows > 0) {
        while ($userId = $getUsers->fetch_assoc ()) {
            $userIds[] = $userId['id'];
        }
    }

    return $userIds;
}

/**
 * Returns company worth
 *
 * @param array $result [originating array]
 *
 * @return number $sum
 */
function returnCompanyWorth ($result) {
    return ($result["headquarterSum"] + $result["mineErectionSum"] + $result["factoryErectionSum"] + $result["buildingsErectionSum"] + $result["warehouseErectionSum"]);
}

/**
 * Fetches base data of headquarters
 *
 * @param object $conn [database connection]
 *
 * @return array $result [base data of headquarters]
 */
function getHeadquarterBaseData ($conn) {
    $result = [];

    $baseDataQuery = "SELECT `amount`, `material` FROM `headquarter` WHERE `id` != 0";
    $baseData      = $conn->query ($baseDataQuery);

    if ($baseData->num_rows > 0) {
        while ($data = $baseData->fetch_assoc ()) {
            $result[] = $data;
        }
    }

    for ($i = 0; $i <= 9; $i += 1) {
        $result[$i]["material"] = explode (',', $result[$i]["material"]);
    }

    return $result;
}

/**
 * Returns worth of a headquarter depending on level and progress
 *
 * @param array $headquarterBaseData [base data]
 * @param array $headquarterArray    [originating array]
 * @param array $prices              [prices object]
 *
 * @return number $sum
 */
function returnHeadquarterWorth (array $headquarterBaseData = [], array $headquarterArray, array $prices = []) {
    $sum = 0;

    $userHQLevel = $headquarterArray["level"];

    $paid = [
        $headquarterArray["progress0"],
        $headquarterArray["progress1"],
        $headquarterArray["progress2"],
        $headquarterArray["progress3"],
    ];

    for ($i = ($userHQLevel - 2); $i >= 1; $i -= 1) {

        $requiredAmount = $headquarterBaseData[$i]["amount"];

        foreach ($headquarterBaseData[$i]["material"] as $material) {
            $price = returnPriceViaId ($material, $prices);
            $sum   += $price * $requiredAmount;
        }

        if ((int) $userHQLevel !== 10) {
            $k = 0;
            foreach ($paid as $paidValue) {
                if ((int) $paidValue !== 0) {
                    $material = $headquarterBaseData[($userHQLevel - 2)]["material"][$k];
                    $price    = returnPriceViaId ($material, $prices);
                    $sum      += $price * $paidValue;

                }
                $k += 1;
            }
        }
    }


    return $sum;
}

/**
 * Counts mines within array
 *
 * @param array $materialArray [user material array]
 *
 * @return number $mineCount [sum]
 */
function countMines ($materialArray) {
    $mineCount = 0;

    for ($i = 0; $i <= 13; $i += 1) {
        $mineCount += $materialArray["amountOfMines" . $i];
    }

    return $mineCount;
}

/**
 * Fetches mine base prices
 *
 * @param object $conn [database connection]
 *
 * @return array $result [array with base prices of mine types]
 */
function getMineBasePrices ($conn) {
    $result = [];

    $basePriceQuery = "SELECT `basePrice` FROM `resources`";
    $basePrice      = $conn->query ($basePriceQuery);

    if ($basePrice->num_rows > 0) {
        while ($data = $basePrice->fetch_assoc ()) {
            $result[] = $data['basePrice'];
        }
    }

    return $result;
}

/**
 * Returns approximated cost of all mines currently built
 *
 * @param array  $mineBaseData  [base data]
 * @param array  $materialArray [originating array]
 * @param object $conn          [database connection]
 * @param object $prices        [prices object]
 *
 * @return number $sum
 */
function returnMineErectionSum ($mineBaseData, $materialArray) {
    $sum = 0;

    $totalMines = countMines ($materialArray);

    $index = 0;
    foreach ($materialArray as $material) {
        $sum   += $mineBaseData[$index] * (1 + 0.01 * $totalMines) * $materialArray["amountOfMines" . $index];
        $index += 1;
    }

    return $sum;
}

/**
 * Converts id to useful information
 *
 * @param number $id [raw id]
 *
 * @return array
 */
function convertId ($id) {
    if ($id <= 13) {
        $subArray = "resources";
        $position = $id;
    } elseif ($id >= 14 && $id <= 35) {
        $subArray = "factories";
        $position = $id - 14;
    } elseif ($id >= 36 && $id <= 51) {
        $subArray = "loot";
        $position = $id - 36;
    } else {
        $subArray = "units";
        $position = $id - 52;
    }

    return [
        "subArray" => $subArray,
        "position" => $position,
    ];
}

/**
 * Returns price depending on id and period chosen
 *
 * @param number         $id     [raw id]
 * @param array          $prices [prices array]
 * @param number|boolean $period [index of possible price time span]
 *
 * @return number $targetPrices [price value]
 */
function returnPriceViaId (int $id = 0, array $prices = [], int $period = -1) {
    $possiblePrices = [
        "current",
        "1day",
        "3days",
        "7days",
        "4weeks",
        "3months",
        "6months",
        "1year",
        "max",
    ];

    $index = (int) $period === -1 ? 2 : $period;

    $priceAge = $possiblePrices[$index];

    $target = convertId ($id);

    $subArray = $target["subArray"];
    $position = $target["position"];

    $targetPrices = $prices[$subArray][$position][$priceAge];

    return $targetPrices["ai"] >= $targetPrices["player"] ? $targetPrices['ai'] : $targetPrices['player'];
}

/**
 * Returns base data of buildings
 *
 * @param object $conn [database connection]
 *
 * @return array $result [base data of buildings]
 */
function getBuildingsData ($conn) {
    $result = [];

    $buildingsQuery = "SELECT `material`, `materialAmount0`, `materialAmount1`, `materialAmount2`, `materialAmount3` FROM `buildings`";
    $buildingsData  = $conn->query ($buildingsQuery);

    if ($buildingsData->num_rows > 0) {
        while ($data = $buildingsData->fetch_assoc ()) {
            $result[] = $data;
        }
    }

    for ($i = 0; $i <= 13; $i += 1) {
        $result[$i]["material"] = explode (',', $result[$i]["material"]);
        for ($k = 0; $k <= 3; $k += 1) {
            $result[$i]["materialAmount" . $k] = explode (',', $result[$i]["materialAmount" . $k]);
        }
    }

    return $result;
}

/**
 * Returns worth of all factories built depending on current level and prices
 *
 * @param array  $factoryBaseData [base data]
 * @param array  $productsArray   [originating array]
 * @param object $conn            [database connection]
 * @param object $prices          [prices object]
 *
 * @return number $sum
 */
function returnFactoryErectionSum ($factoryBaseData, $productsArray, $prices) {
    $sum = 0;

    $currentFactoryIndex = 0;
    foreach ($productsArray as $factoryLevel) {

        $upgradeMaterials       = explode (',', $factoryBaseData[$currentFactoryIndex]["upgradeMaterial"]);
        $upgradeMaterialAmounts = explode (',', $factoryBaseData[$currentFactoryIndex]["upgradeMaterialAmount"]);

        for ($i = 0; $i <= $factoryLevel; $i += 1) {

            $upgradeMaterialIndex = 0;

            foreach ($upgradeMaterials as $upgradeMaterial) {

                $value = $upgradeMaterialAmounts[$upgradeMaterialIndex] * pow ($i, 2);

                if ($upgradeMaterial == -1) {
                    $sum += $value;
                } else {
                    $price = returnPriceViaId ($upgradeMaterial, $prices);
                    $sum   += $value * $price;
                }

                $upgradeMaterialIndex += 1;
            }
        }
        $currentFactoryIndex += 1;
    }

    return $sum;
}

/**
 * Returns worth of all buildings built depending on current level and prices
 *
 * @param array  $buildingsBaseData [base data]
 * @param array  $buildingsArray    [originating array]
 * @param object $prices            [prices object]
 *
 * @return number $sum
 */
function returnBuildingsErectionSum ($buildingsBaseData, $buildingsArray, $prices) {
    $sum = 0;

    $buildingsIndex = 0;
    foreach ($buildingsArray as $buildingLevel) {

        for ($level = 0; $level < $buildingLevel; $level += 1) {

            for ($materialIndex = 0; $materialIndex <= 3; $materialIndex += 1) {
                $material       = $buildingsBaseData[$buildingsIndex]["material"][$materialIndex];
                $materialAmount = $buildingsBaseData[$buildingsIndex]["materialAmount" . $materialIndex][$level];

                if ($material == -1) {
                    $sum += $materialAmount;
                } else {
                    $price = returnPriceViaId ($material, $prices);
                    $sum   += $materialAmount * $price;
                }
            }
        }
        $buildingsIndex += 1;
    }

    return $sum;
}

/**
 * Outputs leaderboard JSON data
 *
 * @param object $conn   [database connection]
 * @param array  $prices [prices object]
 *
 * @return array [leaderboard data]
 */
function generateLeaderboardData ($conn, $prices) {
    $result = [];

    $template = [
        "material"    => [],
        "products"    => [],
        "buildings"   => [],
        "headquarter" => [],
        "warehouse"   => [],
        "general"     => [],
    ];

    $userIds = getValidUserIds ($conn);

    $queries = [
        "general",
        "headquarter",
        "material",
        "products",
        "buildings",
        "warehouse",
    ];

    foreach ($queries as $shortcut) {
        ${$shortcut . "DataQuery"} = $conn->prepare (returnQueries ($shortcut));
    }

    $headquarterBaseData = getHeadquarterBaseData ($conn);
    $mineBasePrices      = getMineBasePrices ($conn);
    $factoryBaseData     = getFactoryData ($conn);
    $buildingsBaseData   = getBuildingsData ($conn);

    foreach ($userIds as $userId) {
        $result[$userId] = $template;

        if ($userId === $_SESSION['id']) {
            $result[$userId]['you'] = true;
        }

        $preparableQueries = [
            "generalDataQuery"     => "general",
            "headquarterDataQuery" => "headquarter",
            "materialDataQuery"    => "material",
            "productsDataQuery"    => "products",
            "buildingsDataQuery"   => "buildings",
            "warehouseDataQuery"   => "warehouse",
        ];

        foreach ($preparableQueries as $query => $target) {
            $result = shoveDataToArray ($result, ${$query}, $target, $userId);
        }

        $result[$userId]["headquarterSum"]       = returnHeadquarterWorth ($headquarterBaseData, $result[$userId]["headquarter"], $prices);
        $result[$userId]["mineErectionSum"]      = returnMineErectionSum ($mineBasePrices, $result[$userId]["material"]);
        $result[$userId]["mineIncome"]           = returnMineIncome ($result[$userId]["material"], $prices);
        $result[$userId]["totalMineCount"]       = countMines ($result[$userId]["material"]);
        $result[$userId]["factoryTotalUpgrades"] = array_sum ($result[$userId]["products"]);
        $result[$userId]["factoryErectionSum"]   = returnFactoryErectionSum ($factoryBaseData, $result[$userId]["products"], $prices);
        $result[$userId]["buildingsErectionSum"] = returnBuildingsErectionSum ($buildingsBaseData, $result[$userId]["buildings"], $prices);
        $result[$userId]["warehouseErectionSum"] = returnWarehouseErectionSum ($result[$userId]["warehouse"]);
        $result[$userId]["companyWorth"]         = returnCompanyWorth ($result[$userId]);
        $result[$userId]["tradeData"]            = returnTradeLogData ($userId, $conn);

        unset($result[$userId]["products"]);
        unset($result[$userId]["material"]);
        unset($result[$userId]["buildings"]);
        unset($result[$userId]["warehouse"]);

    }

    return $result;
}

/**
 * Returns warehouse erection sum
 *
 * @param  [array] $userData previously initiated user data array
 *
 * @return [integer]  $sum
 */
function returnWarehouseErectionSum ($userData) {
    $sum = 0;

    foreach ($userData as $warehouseMaxLevel) {

        for ($level = 1; $level <= $warehouseMaxLevel; $level += 1) {
            $sum += pow ($level - 1, 2) * 1250000;
        }
    }

    return $sum;
}

/**
 * Returns specific trade log data
 *
 * @param number $userId [user id]
 * @param object $conn   [database connection]
 *
 * @return array $result [trade log data array]
 */
function returnTradeLogData ($userId, $conn) {

    $log = "userTradeLog_" . $userId;

    $result = [];

    $queries = [
        "SELECT MIN(timestamp) AS `firstKnownAction`, MAX(timestamp)  AS `lastKnownAction` FROM `" . $log . "`",
        "SELECT SUM(`amount` * `price`) AS `totalSell` FROM `" . $log . "` WHERE `event` = 1",
        "SELECT SUM(`amount` * `price`) AS `totalBuy` FROM `" . $log . "` WHERE `event` = 0",
        "SELECT SUM(`amount` * `price`) AS `sumKISell` FROM `" . $log . "` WHERE `actor` = 'KI'",
    ];

    foreach ($queries as $query) {
        $getData = $conn->query ($query);
        if ($getData->num_rows > 0) {
            while ($data = $getData->fetch_assoc ()) {
                $result[] = $data;
            }
        }
    }

    $result = array_merge ($result[0], $result[1], $result[2], $result[3]);

    $result["tradeIncome"] = $result["totalSell"] - $result["totalBuy"];

    $tradeDays = ($result["lastKnownAction"] - $result["firstKnownAction"]) / 86400;

    $result["tradeIncomePerDay"] = (int) round ($result["tradeIncome"] / $tradeDays);

    unset($result["lastKnownAction"]);
    unset($result["firstKnownAction"]);

    $potentiallyMissingData = [
        "totalSell",
        "sumKISell",
        "totalBuy",
    ];

    foreach ($potentiallyMissingData as $dataset) {
        if (!$result[$dataset]) {
            $result[$dataset] = 0;
        }
    }

    return $result;
}

/**
 * Returns mine hourly income
 *
 * @param array  $userData [previously calculated user data]
 * @param object $conn     [database connection]
 * @param array  $prices   [prices array]
 *
 * @return number $sum [hourly mine income]
 */
function returnMineIncome ($userData, $prices) {
    $sum = 0;

    for ($i = 0; $i <= 13; $i += 1) {
        $sum += returnPriceViaId ($i, $prices) * $userData["perHour" . $i];
    }

    return $sum;
}

/**
 * Returns base data of factories
 *
 * @param object $conn [database connection]
 *
 * @return array [result]
 */
function getFactoryData ($conn) {
    $result = [];

    $getFactoryDataQuery = "SELECT * FROM `factories`";
    $getFactoryData      = $conn->query ($getFactoryDataQuery);

    if ($getFactoryData->num_rows > 0) {
        while ($data = $getFactoryData->fetch_assoc ()) {
            $result[] = $data;
        }
    }

    return $result;
}

$conn   = connect ($host, $user, $pw, $db);
$prices = getPrices ($host, $user, $pw, $db);
$result = generateLeaderboardData ($conn, $prices);

$headers = [
    "Content-type: application/json",
    "Cache-Control: no-cache, no-store",
];

foreach ($headers as $header) {
    header ($header);
}

echo json_encode ($result, JSON_NUMERIC_CHECK);
