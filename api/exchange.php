<?php

$csv_filename = "resources-helper.de_DUMP_" .time("now"). ".csv";

$generalHeaders = [
  "X-Content-Type-Options: nosniff",
  "Strict-Transport-Security: max-age=10; includeSubDomains; preload",
  "X-Frame-Options: DENY",
  "X-XSS-Protection: 1; mode=block",
  "Content-type: text/csv; charset=utf-8",
  "Content-Disposition: attachment; filename=" .$csv_filename
];

foreach ($generalHeaders as $header) {
    header($header);
}

require "db.php";

$conn = new mysqli($host, $user, $pw, $db);

$getPricesStmt = "SELECT * FROM `price` ORDER BY `id` ASC";
$getPrices = $conn->query($getPricesStmt);

if($getPrices->num_rows > 0) {

  $outputArray = [
    "Resource",
    "UnixTimestamp"
  ];

  $order = [
    "Old tires",
    "Waste glass",
    "Scrap metal",
    "Used oil",
    "Aluminium",
    "Batteries",
    "Bauxite",
    "Concrete",
    "Drone wreckage",
    "Fertilizer",
    "Iron ore",
    "Electronics",
    "Electronic scrap",
    "Elite force",
    "Fossil fuel",
    "Fossils",
    "Gangster",
    "Glass",
    "Gold",
    "Gold ore",
    "Ilmenite",
    "Insecticides",
    "Limestone",
    "Attack dogs",
    "Gravel",
    "Coal",
    "Plastics",
    "Plastic scrap",
    "Copper",
    "Chalcopyrite",
    "Copper coins",
    "Trucks",
    "Clay",
    "Lithium",
    "Lithium ore",
    "Medical technology",
    "Private army",
    "Quartz sand",
    "Giant diamond",
    "Rough diamonds",
    "Crude oil",
    "Roman coins",
    "Scan drones",
    "Jewellery",
    "Silver",
    "Silver ore",
    "Silicon",
    "Steel",
    "Tech upgrade 1",
    "Tech upgrade 2",
    "Tech upgrade 3",
    "Tech upgrade 4",
    "Titanium",
    "Watch dogs",
    "Security staff",
    "Weapons",
    "Maintenance kit",
    "Bricks"
  ];

  foreach($order as $resource) {

    $arr = [
      "" .$resource. "_AI",
      "" .$resource. "_Player"
    ];

    array_push($outputArray, $arr[0]);
    array_push($outputArray, $arr[1]);
  }

  $output = fopen("php://output", "w");

  fputcsv($output, $outputArray);

  while($row = $getPrices->fetch_assoc()) {
    fputcsv($output, $row);
  }
}

fclose($output);


?>
