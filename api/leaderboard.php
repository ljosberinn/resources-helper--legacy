<?php

require "class.resourcesGame.php";
require "db.php";

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
function connect($host, $user, $pw, $db)
{
    $conn = new mysqli($host, $user, $pw, $db);
    $conn->set_charset("UTF-8");

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
function getPrices($host, $user, $pw, $db)
{

    $rGame = new resourcesGame($host, $user, $pw, $db, "on");

    $prices = $rGame->getAllPrices();

    return $prices;
}

/**
 * Returns corresponding query depending on type
 *
 * @param string $type [query type to be fetched]
 *
 * @return string [sql query]
 */
function returnQueries($type)
{
    switch($type) {
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
        return "SELECT `building0`, `building1`, `building2`, `building3`, `building4`, `building5`, `building6`, `building7`, `building8`, `building9`, `building10`, `building11` FROM `userBuildings` WHERE `id` = ?";
    break;
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
function shoveDataToArray($result, $query, $target, $userId)
{
    $query->bind_param("s", $userId);
    $query->execute();
    $queryData = $query->get_result();

    while ($data = $queryData->fetch_assoc()) {
        $result[$userId][$target] = $data;

        if ($target == "general") {
            $result[$userId][$target]["registeredGame"] = date("Y-m-j h:i (a)", $data["registeredGame"]);
        }
    }

    return $result;
}

/**
 * Outputs valid user IDs
 *
 * @param object $conn [database conncetion]
 *
 * @method public getValidUserIds
 * @return array [userIds]
 */
function getValidUserIds($conn)
{
    $userIds = [];
    $getUsersQuery = "SELECT `id` FROM `userOverview` WHERE `hashedKey` != ''";
    $getUsers = $conn->query($getUsersQuery);

    if ($getUsers->num_rows > 0) {
        while ($userId = $getUsers->fetch_assoc()) {
            array_push($userIds, $userId["id"]);
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
function returnCompanyWorth($result)
{
    return ($result["headquarterSum"] + $result["mineErectionSum"] + $result["factoryErectionSum"] + $result["buildingsErectionSum"]);
}

/**
 * Fetches bsae data of headquarters
 *
 * @param object $conn [database connection]
 *
 * @return array $result [base data of headquarters]
 */
function getHeadquarterBaseData($conn)
{
    $result = [];

    $baseDataQuery = "SELECT `amount`, `material` FROM `headquarter` WHERE `id` != 0";
    $baseData = $conn->query($baseDataQuery);

    if ($baseData->num_rows > 0) {
        while ($data = $baseData->fetch_assoc()) {
            array_push($result, $data);
        }
    }

    for ($i = 0; $i <= 9; $i += 1) {
        $result[$i]["material"] = splitCommaToArray($result[$i]["material"]);
    }

    return $result;
}


/**
 * Returns worth of a headquarter depending on level and progress
 *
 * @param array  $headquarterBaseData [base data]
 * @param array  $headquarterArray    [originating array]
 * @param object $conn                [database connection]
 * @param object $prices              [prices object]
 *
 * @return number $sum
 */
function returnHeadquarterWorth($headquarterBaseData, $headquarterArray, $conn, $prices)
{
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
            $price = returnPriceViaId($material, $prices);
            $sum += $price * $requiredAmount;
        }

        if ($userHQLevel != 10) {
            $k = 0;
            foreach ($paid as $paidValue) {
                if ($paidValue != 0) {
                    $material = $headquarterBaseData[($userHQLevel - 2)]["material"][$k];
                    $price = returnPriceViaId($material, $prices);
                    $sum += $price * $paidValue;
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
function countMines($materialArray)
{
    $mineCount = 0;

    for ($i = 0; $i <= 13; $i += 1) {
        $mineCount += $materialArray["amountOfMines" .$i];
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
function getMineBasePrices($conn)
{
    $result = [];

    $basePriceQuery  = "SELECT `basePrice` FROM `resources`";
    $basePrice = $conn->query($basePriceQuery);

    if ($basePrice->num_rows > 0) {
        while ($data = $basePrice->fetch_assoc()) {
            array_push($result, $data["basePrice"]);
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
function returnMineErectionSum($mineBaseData, $materialArray, $conn, $prices)
{
    $sum = 0;

    $totalMines = countMines($materialArray);

    $index = 0;
    foreach ($materialArray as $material) {
        $sum += $mineBaseData[$index] * ( 1 + 0.01 * $totalMines) * $materialArray["amountOfMines" .$index];
        $index += 1;
    }


    return $sum;
}

/**
 * Splits comma-containing strings to array
 *
 * @param string $string [self-explaining]
 *
 * @return array $array [exploded array]
 */
function splitCommaToArray($string)
{

    $array = [];

    if (strpos($string, ",") !== false) {
        $explode = explode(",", $string);

        foreach ($explode as $dataset) {
            array_push($array, $dataset);
        }
    }

    return $array;
}

/**
 * Converts id to useful information
 *
 * @param number $id [raw id]
 *
 * @return array
 */
function convertId($id)
{
    if ($id <= 13) {
        $subArray = "resources";
        $position = $id;
    } else if ($id >= 14 && $id <= 35) {
        $subArray = "factories";
        $position = $id - 14;
    } else if ($id >= 36 && $id <= 51) {
        $subArray = "loot";
        $position = $id - 36;
    } else {
        $subArray = "units";
        $position = $id - 52;
    }

    return [
        "subArray" => $subArray,
        "position" => $position
    ];
}

/**
 * Returns price depending on id and period chosen
 *
 * @param number $id     [raw id]
 * @param array  $prices [prices array]
 * @param number $period [index of possible price time span]
 *
 * @return number $targetPrices [price value]
 */
function returnPriceViaId($id, $prices, $period)
{
    $possiblePrices = [
        "current",
        "1day",
        "3days",
        "7days",
        "4weeks",
        "3months",
        "6months",
        "1year",
        "max"
    ];

    $index = 0;

    if (!$period) {
        $index = 2;
    } else {
        $index = $period;
    }

    $priceAge = $possiblePrices[$index];

    $target = convertId($id);

    $subArray = $target["subArray"];
    $position = $target["position"];

    $targetPrices = $prices[$subArray][$position][$priceAge];

    if ($targetPrices["ai"] >= $targetPrices["player"]) {
        return $targetPrices["ai"];
    } else {
        return $targetPrices["player"];
    }
}

/**
 * Returns base data of buildings
 *
 * @param object $conn [database connection]
 *
 * @return array $result [base data of buildings]
 */
function getBuildingsData($conn)
{
    $result = [];

    $buildingsQuery = "SELECT `material`, `materialAmount0`, `materialAmount1`, `materialAmount2`, `materialAmount3` FROM `buildings`";
    $buildingsData = $conn->query($buildingsQuery);

    if ($buildingsData->num_rows > 0) {
        while ($data = $buildingsData->fetch_assoc()) {
            array_push($result, $data);
        }
    }

    for ($i = 0; $i <= 11; $i += 1) {
        $result[$i]["material"] = splitCommaToArray($result[$i]["material"]);
        for ($k = 0; $k <= 3; $k += 1) {
            $result[$i]["materialAmount" .$k] = splitCommaToArray($result[$i]["materialAmount". $k]);
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
function returnFactoryErectionSum($factoryBaseData, $productsArray, $conn, $prices)
{
    $sum = 0;

    $currentFactoryIndex = 0;
    foreach ($productsArray as $factoryLevel) {

        $upgradeMaterials = splitCommaToArray($factoryBaseData[$currentFactoryIndex]["upgradeMaterial"]);
        $upgradeMaterialAmounts = splitCommaToArray($factoryBaseData[$currentFactoryIndex]["upgradeMaterialAmount"]);

        for ($i = 0; $i <= $factoryLevel; $i += 1) {

            $upgradeMaterialindex = 0;

            foreach ($upgradeMaterials as $upgradeMaterial) {

                $value = $upgradeMaterialAmounts[$upgradeMaterialindex] * pow($i, 2);

                if ($upgradeMaterial == -1) {
                    $sum += $value;
                } else {
                    $price = returnPriceViaId($upgradeMaterial, $prices);
                    $sum += $value * $price;
                }

                $upgradeMaterialindex += 1;
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
 * @param object $conn              [database connection]
 * @param object $prices            [prices object]
 *
 * @return number $sum
 */
function returnBuildingsErectionSum($buildingsBaseData, $buildingsArray, $conn, $prices)
{
    $sum = 0;

    $buildingsIndex = 0;
    foreach ($buildingsArray as $buildingLevel) {

        for ($level = 0; $level < $buildingLevel; $level += 1) {

            for ($materialIndex = 0; $materialIndex <= 3; $materialIndex += 1) {
                $material = $buildingsBaseData[$buildingsIndex]["material"][$materialIndex];
                $materialAmount = $buildingsBaseData[$buildingsIndex]["materialAmount" .$materialIndex][$level];

                if ($material == -1) {
                    $sum += $materialAmount;
                } else {
                    $price = returnPriceViaId($material, $prices);
                    $sum += $materialAmount * $price;
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
 * @param object $prices [prices object]
 *
 * @return array [leaderboard data]
 */
function generateLeaderboardData($conn, $prices)
{
    $result = [];

    $template = [
        "material" => [],
        "products" => [],
        "buildings" => [],
        "headquarter" => [],
        "general" => [],
    ];

    $userIds = getValidUserIds($conn);

    $queries = [
        "general",
        "headquarter",
        "material",
        "products",
        "buildings",
    ];

    foreach ($queries as $shortcut) {
        ${$shortcut. "DataQuery"} = $conn->prepare(returnQueries($shortcut));
    }

    $headquarterBaseData = getHeadquarterBaseData($conn);
    $mineBasePrices = getMineBasePrices($conn);
    $factoryBaseData = getFactoryData($conn);
    $buildingsBaseData = getBuildingsData($conn);

    foreach ($userIds as $userId) {
        $result[$userId] = $template;

        $preparableQueries = [
            "generalDataQuery" => "general",
            "headquarterDataQuery" => "headquarter",
            "materialDataQuery" => "material",
            "productsDataQuery" => "products",
            "buildingsDataQuery" => "buildings",
        ];

        foreach ($preparableQueries as $query => $target) {
            $result = shoveDataToArray($result, ${$query}, $target, $userId);
        }

        $result[$userId]["headquarterSum"] = returnHeadquarterWorth($headquarterBaseData, $result[$userId]["headquarter"], $conn, $prices);
        $result[$userId]["mineErectionSum"] = returnMineErectionSum($mineBasePrices, $result[$userId]["material"], $conn, $prices);
        $result[$userId]["factoryErectionSum"] = returnFactoryErectionSum($factoryBaseData, $result[$userId]["products"], $conn, $prices);
        $result[$userId]["buildingsErectionSum"] = returnBuildingsErectionSum($buildingsBaseData, $result[$userId]["buildings"], $conn, $prices);

        $result[$userId]["companyWorth"] = returnCompanyWorth($result[$userId]);


        // calculate mine income
        // calculate effective income

    }

    return $result;
}

/**
 * Returns base data of factories
 *
 * @param object $conn [database connection]
 *
 * @return array [result]
 */
function getFactoryData($conn)
{
    $result = [];

    $getFactoryDataQuery = "SELECT * FROM `factories`";
    $getFactoryData = $conn->query($getFactoryDataQuery);

    if ($getFactoryData->num_rows > 0) {
        while ($data = $getFactoryData->fetch_assoc()) {
            array_push($result, $data);
        }
    }

    return $result;
}

header("Content-type: application/json");

$conn = connect($host, $user, $pw, $db);

$prices = getPrices($host, $user, $pw, $db);

$result = generateLeaderboardData($conn, $prices);

echo json_encode($result, JSON_NUMERIC_CHECK);



?>