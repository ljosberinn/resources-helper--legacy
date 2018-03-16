<?php

session_start();

if (!isset($_SESSION["id"])) {
    header("../index.php");
} else {
    $possiblePOSTVars = [
    "settings-language",
    "settings-custom-tu-1",
    "settings-custom-tu-2",
    "settings-custom-tu-3",
    "settings-custom-tu-4",
    "settings-ideal-conditions",
    "settings-toggle-factory-names",
    "settings-toggle-transport-cost-inclusion",
    "settings-thebigshort",
    "settings-hq-visibility",
    "settings-price-age",
  ];

    $query = "UPDATE `userSettings` SET ";

    foreach ($_POST as $var => $value) {
        if (!in_array($var, $possiblePOSTVars)) {
            header("Location: ../index.php");
        }

        switch ($var) {
          case "settings-language":
            $query .= "`lang` = " .$value. ", ";
          break;
          case "settings-custom-tu-4":

            $customTU = "";

            for ($i = 1; $i <= 4; $i += 1) {
                $tu = $_POST["settings-custom-tu-" .$i. ""];

                if ($tu == "") {
                    $tu = 0;
                }
                $customTU .= $tu. ", ";
            }

            $customTU = substr($customTU, 0, -2);

            if ($customTU != "") {
                $query .= "`customTU` = '" .$customTU. "', ";
            }
          break;
          case "settings-ideal-conditions":
            $query .= "`idealCondition` = ";
            if ($value == "on") {
                $query .= "1, ";
            } else {
                $query .= "0, ";
            }
          break;
          case "settings-toggle-factory-names":
            $query .= "`factoryNames` = ";
            if ($value == "on") {
                $query .= "1, ";
            } else {
                $query .= "0, ";
            }
          break;
          case "settings-toggle-transport-cost-inclusion":
            $query .= "`transportCostInclusion` = ";
            if ($value == "on") {
                $query .= "1, ";
            } else {
                $query .= "0, ";
            }
          break;
          case "settings-the-big-short":
            $allowedValues = [1, 1000, 1000000, 1000000000, ];
            if (in_array($value, $allowedValues)) {
                $query .= "`theBigShort` = " .$value. ", ";
            } else {
                header("Location: ../index.php");
            }

          break;
          case "settings-hq-visibility":
            $allowedValues = [0, 1];
            if (in_array($value, $allowedValues)) {
                $query .= "`mapVisibleHQ` = " .$value. ", ";
            } else {
                header("Location: ../index.php");
            }
          break;
          case "settings-price-age":
            $allowedValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, ];
            if (in_array($value, $allowedValues)) {
                $query .= "`priceAge` = " .$value. ", ";
            } else {
                header("Location: ../index.php");
            }
          break;
        }
    }

    $query = substr($query, 0, -2). " WHERE `id` = " .$_SESSION["id"];

    require "db.php";

    $conn = new mysqli($host, $user, $pw, $db);

    $update = $conn->query($query);

    if ($update) {
        header("Location: ../index.php?settingsSaved");
    }
}
