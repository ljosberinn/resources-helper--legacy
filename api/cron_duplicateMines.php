<?php

require "db.php";
require "class.resourcesGame.php";

$conn = new mysqli($host, $user, $pw, $db);

$queryUserIds = "SELECT `id` FROM `userOverview`";
$userIds = $conn->query($queryUserIds);

$ids = [];

if($userIds->num_rows > 0) {
	while($id = $userIds->fetch_assoc()) {
		array_push($ids, $id["id"]);
	}
}

$deleted = 0;

foreach($ids as $id) {
	$mines = [];

	$queryMineMap = "SELECT `lat`, `lon`, `type` FROM `userMineMap_" .$id. "`";

	$mineMap = $conn->query($queryMineMap);

	if($mineMap->num_rows > 0) {
		while($mine = $mineMap->fetch_assoc()) {
			array_push($mines, $mine);
		}
	}

	foreach($mines as $mine) {
		$queryCheckForDuplicate = "SELECT * FROM `userMineMap_0` WHERE `lon` = " .$mine["lon"]. " AND `lat` = " .$mine["lat"]. " AND `type` = " .$mine["type"]. "";
		$checkForDuplicate = $conn->query($queryCheckForDuplicate);

		if($checkForDuplicate->num_rows == 1) {
			$queryDelete = "DELETE FROM `userMineMap_0` WHERE `lon` = " .$mine["lon"]. " AND `lat` = " .$mine["lat"]. " AND `type` = " .$mine["type"]. "";
			$delete = $conn->query($queryDelete);

			$deleted++;
		}
	}
}

echo $deleted. ' mines deleted as duplicates';

?>
