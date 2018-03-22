<?php

$generalHeaders = [
  "X-Content-Type-Options: nosniff",
  "Strict-Transport-Security: max-age=63072000; includeSubDomains; preload",
  "X-Frame-Options: DENY",
  "X-XSS-Protection: 1; mode=block",
  "Content-type: application/json",
];

foreach ($generalHeaders as $header) {
    header($header);
}

if(isset($_GET["factor"]) && is_numeric($_GET["factor"]) && $_GET["factor"] >= 1.01 && $_GET["factor"] <= 5) {

	$factor = htmlspecialchars($_GET["factor"]);

	require "db.php";

	$conn = new mysqli($host, $user, $pw, $db);

	$possibleCombinationsQuery = "SELECT `tu1`, `tu2`, `tu3`, `tu4`, `factor` FROM `techupgrades` WHERE `factor` LIKE " .$factor. "";
	$possibleCombinations = $conn->query($possibleCombinationsQuery);

	$potentiallyUsedCombinations = [];
	$response = [];

	if($possibleCombinations->num_rows > 0) {
		while($combinations = $possibleCombinations->fetch_assoc()) {
			array_push($potentiallyUsedCombinations, $combinations);
		}

		if(!empty($potentiallyUsedCombinations)) {

			foreach($potentiallyUsedCombinations as $subArray) {

				$selectUpcomingCombinationsQuery = "SELECT
				`tu1`, `tu2`, `tu3`, `tu4`, `factor` FROM `techupgrades`
				WHERE `tu1` >= " .$subArray["tu1"]. " AND
				`tu2` >= " .$subArray["tu2"]. " AND
				`tu3` >= " .$subArray["tu3"]. " AND
				`tu4` >= " .$subArray["tu4"]. " AND
				`factor` > 5";

				$selectUpcomingCombinations = $conn->query($selectUpcomingCombinationsQuery);

				if($selectUpcomingCombinations->num_rows > 0) {
					while($upcomingCombination = $selectUpcomingCombinations->fetch_assoc()) {

            for($l = 1; $l <= 4; $l += 1) {
              $upcomingCombination["tu" .$l. ""] -= $subArray["tu" .$l. ""];
              if($upcomingCombination["tu" .$l. ""] < 0) {
                $upcomingCombination["tu" .$l. ""] = 0;
              }
            }

						if(!$_GET["tu4"] && $upcomingCombination["tu4"] > 0) {
							continue;
						} else {
							array_push($response, $upcomingCombination);
						}
					}
				}
			}

			if(!empty($response)) {
				$response = array_slice(array_map("unserialize", array_unique(array_map("serialize", $response))), 0, 10);

				array_multisort(array_column($response, "factor"), SORT_DESC, $response);
			}
		}

		echo json_encode($response, JSON_NUMERIC_CHECK);
	}
} else {
	header("Location: ../index.php");
}

?>
