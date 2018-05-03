<?php


print_r($_POST);

if (isset($_POST['data']['amountOfMines'])
    && isset($_POST['data']['mineRates'])
    && isset($_POST['data']['warehouseLevels'])
    && isset($_POST['data']['warehouseFillAmounts'])
    && isset($_POST['data']['factoryLevels'])
    && isset($_POST['data']['buildingLevels'])
    && isset($_POST['data']['headquarterLevel'])
    && isset($_POST['data']['headquarterPaid'])
) {
    session_start();

    include 'db.php';
    $conn = new mysqli($host, $user, $pw, $db);

    $queries = [];

    $updateMaterialQuery = "UPDATE `userMaterial` SET ";

    for ($i = 0; $i <= 13; $i += 1) {
        $updateMaterialQuery .= "`perHour" .$i. "` = " .$_POST['data']['mineRates'][$i]. ", `amountOfMines" .$i. "` = " .$_POST['data']['amountOfMines'][$i]. ", ";
    }

    $updateMaterialQuery = substr($updateMaterialQuery, 0, -2). " WHERE `id` = " .$_SESSION['id']. "";

    array_push($queries, $updateMaterialQuery);


} else {
    header('HTTP/1.0 403 Forbidden');
}

?>
