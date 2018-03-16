<?php

session_start();


if (isset($_POST["settings-confirm-account-deletion"])) {
    require "db.php";
    require "functions.php";

    $conn = new mysqli($host, $user, $pw, $db);

    $selectRegisterTimestampQuery = "SELECT `registeredPage` FROM `userOverview` WHERE `id` = " .$_SESSION["id"]. "";

    $selectRegisterTimestamp = $conn->query($selectRegisterTimestampQuery);

    if ($selectRegisterTimestamp->num_rows == 1) {
        while ($data = $selectRegisterTimestamp->fetch_assoc()) {
            $timestamp = $data["registeredPage"];
        }

        $securityTokenDB = md5($timestamp);

        if (test_input($_POST["settings-confirm-account-deletion"]) == $securityTokenDB) {
            $deletionQueries = [
                "DELETE FROM `userOverview` WHERE `id` = " .$_SESSION["id"]. "",
                "DELETE FROM `userSettings` WHERE `id` = " .$_SESSION["id"]. "",
                "DELETE FROM `userFactories` WHERE `id` = " .$_SESSION["id"]. "",
                "DELETE FROM `userBuildings` WHERE `id` = " .$_SESSION["id"]. "",
                "DELETE FROM `userMaterial` WHERE `id` = " .$_SESSION["id"]. "",
                "DELETE FROM `userWarehouse` WHERE `id` = " .$_SESSION["id"]. "",
                "DELETE FROM `userHeadquarter` WHERE `id` = " .$_SESSION["id"]. "",
                "DROP TABLE IF EXISTS `userAttackLog_" .$_SESSION["id"]. "`",
                "DROP TABLE IF EXISTS `userTradeLog_" .$_SESSION["id"]. "`",
                "DROP TABLE IF EXISTS `userMineMap_" .$_SESSION["id"]. "`",
            ];

            foreach ($deletionQueries as $query) {
                $delete = $conn->query($query);
            }

            header("Location: ../index.php?goodbye");
        } else {
            header("Location: ../index.php?invalidCredentials");
        }
    } else {
        header("Location: ../index.php?userNotFound");
    }
} else {
    header("Location: ../index.php");
}
