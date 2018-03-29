<?php

$generalHeaders = [
  "X-Content-Type-Options: nosniff",
  "Strict-Transport-Security: max-age=10; includeSubDomains; preload",
  "X-Frame-Options: DENY",
  "X-XSS-Protection: 1; mode=block",
  "Content-type: application/json",
];

foreach ($generalHeaders as $header) {
    header($header);
}

if(isset($_GET["id"]) && is_numeric($_GET["id"]) && $_GET["id"] >= 0 && $_GET["id"] <= 58) {

  function convertInternalIdToOldStructure($id)
  {
      switch ($id) {
      case 42: //Old tires
          $convertedId = 1;
          break;

      case 51: //Waste glass
          $convertedId = 2;
          break;

      case 45: //Scrap metal
          $convertedId = 3;
          break;

      case 50: //Used oil
          $convertedId = 4;
          break;

      case 22: //Aluminium
          $convertedId = 5;
          break;

      case 25: //Batteries
          $convertedId = 6;
          break;

      case 8: //Bauxite
          $convertedId = 7;
          break;

      case 15: //Concrete
          $convertedId = 8;
          break;

      case 37: //Drone wreckage
          $convertedId = 9;
          break;

      case 16: //Fertilizer
          $convertedId = 10;
          break;

      case 4: //Iron ore
          $convertedId = 11;
          break;

      case 28: //Electronics
          $convertedId = 12;
          break;

      case 38: //Electronic scrap
          $convertedId = 13;
          break;

      case 53: //Elite force
          $convertedId = 14;
          break;

      case 18: //Fossil fuel
          $convertedId = 15;
          break;

      case 39: //Fossils
          $convertedId = 16;
          break;

      case 54: //Gangster
          $convertedId = 17;
          break;

      case 19: //Glass
          $convertedId = 18;
          break;

      case 32: //Gold
          $convertedId = 19;
          break;

      case 12: //Gold ore
          $convertedId = 20;
          break;

      case 10: //Ilmenite
          $convertedId = 21;
          break;

      case 20: //Insecticides
          $convertedId = 22;
          break;

      case 1: //Limestone
          $convertedId = 23;
          break;

      case 52: //Attack dogs
          $convertedId = 24;
          break;

      case 2: //Gravel
          $convertedId = 25;
          break;

      case 3: //Coal
          $convertedId = 26;
          break;

      case 23: //Plastics
          $convertedId = 27;
          break;

      case 43: //Plastic scrap
          $convertedId = 28;
          break;

      case 21: //Copper
          $convertedId = 29;
          break;

      case 7: //Chalcopyrite
          $convertedId = 30;
          break;

      case 36: //Copper coins
          $convertedId = 31;
          break;

      case 34: //Trucks
          $convertedId = 32;
          break;

      case 0: //Clay
          $convertedId = 33;
          break;

      case 24: //Lithium
          $convertedId = 34;
          break;

      case 9: //Lithium ore
          $convertedId = 35;
          break;

      case 30: //Medical technology
          $convertedId = 36;
          break;

      case 55: //Private army
          $convertedId = 37;
          break;

      case 6: //Quartz sand
          $convertedId = 38;
          break;

      case 40: //Giant diamond
          $convertedId = 39;
          break;

      case 13: //Rough diamonds
          $convertedId = 40;
          break;

      case 5: //Crude oil
          $convertedId = 41;
          break;

      case 44: //Roman coins
          $convertedId = 42;
          break;

      case 35: //Scan drones
          $convertedId = 43;
          break;

      case 33: //Jewellery
          $convertedId = 44;
          break;

      case 31: //Silver
          $convertedId = 45;
          break;

      case 11: //Silver ore
          $convertedId = 46;
          break;

      case 27: //Silicon
          $convertedId = 47;
          break;

      case 17: //Steel
          $convertedId = 48;
          break;

      case 46: //Tech upgrade 1
          $convertedId = 49;
          break;

      case 47: //Tech upgrade 2
          $convertedId = 50;
          break;

      case 48: //Tech upgrade 3
          $convertedId = 51;
          break;

      case 49: //Tech upgrade 4
          $convertedId = 52;
          break;

      case 29: //Titanium
          $convertedId = 53;
          break;

      case 57: //Watch dogs
          $convertedId = 54;
          break;

      case 56: //Security staff
          $convertedId = 55;
          break;

      case 26: //Weapons
          $convertedId = 56;
          break;

      case 41: //Maintenance kit
          $convertedId = 57;
          break;

      case 14: //Bricks
          $convertedId = 58;
          break;
      case -1: //Cash
          $convertedId = -1;
          break;
      }

      return $convertedId;
  }

  $id = convertInternalIdToOldStructure($_GET["id"]);

  require "db.php";
  $conn = new mysqli($host, $user, $pw, $db);

  $response = [];

  $columns = [
    $id. "_k",
    $id. "_tk"
  ];

  $threshold = time("now") - 28*86400;

  $getPricesStmt = "SELECT  `ts`, `" .$columns[0]. "`, `" .$columns[1]. "` FROM `price` WHERE `ts` >= " .$threshold. "";
  $getPrices = $conn->query($getPricesStmt);

  $i = 0;

  if ($getPrices->num_rows > 0) {
      while ($data = $getPrices->fetch_assoc()) {

      $response["data"][$i]["ki"] = $data[$columns[0]];
      $response["data"][$i]["player"] = $data[$columns[1]];
      $response["data"][$i]["ts"] = $data["ts"];

      $i++;

    }
  }

  $getAveragesStmt = "SELECT AVG(" .$columns[0]. ") AS `avg_ki`, AVG(nullif(" .$columns[1]. ", 0)) AS `avg_player` FROM `price` WHERE `ts` >= " .$threshold. "";
  $getAverages = $conn->query($getAveragesStmt);

  if($getAverages->num_rows > 0) {
    while($data = $getAverages->fetch_assoc()) {

      $response["avg"]["ki"] = round($data["avg_ki"]);
      $response["avg"]["player"] = round($data["avg_player"]);

    }
  }

	echo json_encode($response, JSON_NUMERIC_CHECK);
} else {
  header("Location: ../index.php");
}

?>
