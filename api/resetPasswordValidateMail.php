<?php

header ("Content-type: application/json");

if (isset($_POST["mail"])) {

    require_once "functions.php";

    $mail = test_input ($_POST["mail"]);

    if (!empty($mail)) {

        if (pregMail ($mail)) {
            $conn = connect ();

            $validateQuery = "SELECT `id` FROM `userOverview` WHERE `mail` = '" . $mail . "'";

            $validate = $conn->query ($validateQuery);

            if ($validate->num_rows === 1) {
                $result["valid"] = true;
            } else {
                $result["invalid"] = true;
            }
        }
    }
} else {
    $result["invalid"] = true;
}

echo json_encode ($result);
