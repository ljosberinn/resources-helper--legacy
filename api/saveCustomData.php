<?php

if (isset($_POST['data']['amountOfMines']) // done
    && isset($_POST['data']['mineRates']) // done
    && isset($_POST['data']['warehouseLevels']) // done
    && isset($_POST['data']['warehouseFillAmounts']) // done
    && isset($_POST['data']['factoryLevels']) // done
    && isset($_POST['data']['buildingLevels']) // done
    && isset($_POST['data']['headquarterLevel'])
    && isset($_POST['data']['headquarterPaid'])
) {
    session_start();

    include 'db.php';
    $conn = new mysqli($host, $user, $pw, $db);

    $queries = [];


    // update userMaterial
    $updateMaterialQuery = "UPDATE `userMaterial` SET ";

    for ($i = 0; $i <= 13; $i += 1) {
        $updateMaterialQuery .= "`perHour" .$i. "` = " .$_POST['data']['mineRates'][$i]. ", `amountOfMines" .$i. "` = " .$_POST['data']['amountOfMines'][$i]. ", ";
    }

    $updateMaterialQuery = substr($updateMaterialQuery, 0, -2). " WHERE `id` = " .$_SESSION['id']. "";
    array_push($queries, $updateMaterialQuery);

    // update userFactories
    $updateFactoriesQuery = "UPDATE `userFactories` SET ";

    for ($i = 0; $i <= 21; $i += 1) {
        $updateFactoriesQuery .= "`factory" .$i. "` = " .$_POST['data']['factoryLevels'][$i]. ", ";
    }

    $updateFactoriesQuery = substr($updateFactoriesQuery, 0, -2). " WHERE `id` = " .$_SESSION['id']. "";
    array_push($queries, $updateFactoriesQuery);

    // update userBuildings
    $updateBuildingsQuery = "UPDATE `userBuildings` SET ";

    for ($i = 0; $i <= 11; $i += 1) {
        $updateBuildingsQuery .= "`building" .$i. "` = " .$_POST['data']['buildingLevels'][$i]. ", ";
    }

    $updateBuildingsQuery = substr($updateBuildingsQuery, 0, -2) ." WHERE `id` = " .$_SESSION['id']. "";
    array_push($queries, $updateBuildingsQuery);

    // update userWarehouse
    $updateWarehouseQuery = "UPDATE `userWarehouse` SET ";

    for ($i = 0; $i <= 57; $i += 1) {
        $updateWarehouseQuery .= "`level" .$i. "` = " .$_POST['data']['warehouseLevels'][$i]. ", `fillAmount" .$i. "` = " .$_POST['data']['warehouseFillAmounts'][$i]. ", ";
    }

    $updateWarehouseQuery = substr($updateWarehouseQuery, 0, -2) ." WHERE `id` = " .$_SESSION['id']. "";
    array_push($queries, $updateWarehouseQuery);

    // update userHeadquarter
    $updateHeadquarterQuery = "UPDATE `userHeadquarter` SET `level` = " .$_POST['data']['headquarterLevel']. ", ";

    for ($i = 0; $i <= 3; $i += 1) {
        $updateHeadquarterQuery .= "`progress" .$i. "` = " .$_POST['data']['headquarterPaid'][$i]. ", ";
    }

    $updateHeadquarterQuery = substr($updateHeadquarterQuery, 0, -2) ." WHERE `id` = " .$_SESSION['id']. "";
    array_push($queries, $updateHeadquarterQuery);

    $increment = 0;

    foreach ($queries as $query) {
        $update = $conn->query($query);

        if ($update) {
            $increment += 1;
        }
    }

    if ($increment == 5) {
        header('HTTP/1.0 200 OK');
    } else {
        header('HTTP/1.0 418 I\'m a teapot');
    }


} else {
    header('HTTP/1.0 403 Forbidden');
}

?>
