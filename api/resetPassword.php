<?php

header("Content-type: application/json");

if(isset($_POST["mail"]) && isset($_POST["token"])) {

	require 'functions.php';
	require 'db.php';

	$mail = test_input($_POST["mail"]);

	if(!empty($mail)) {

		if(filter_var($mail, FILTER_VALIDATE_EMAIL)) {

			$getRegisteredTimestampQuery = "SELECT `registeredPage` FROM `userOverview` WHERE `mail` = '". $mail. "'";

			$conn = new mysqli($host, $user, $pw, $db);
			$getRegisteredTimestamp = $conn->query($getRegisteredTimestampQuery);

			if($getRegisteredTimestamp->num_rows === 1) {
				while($data = $getRegisteredTimestamp->fetch_assoc()) {
					$securityToken = md5($data["registeredPage"]);
				}

				if($_POST["token"] == $securityToken) {

          $options = [
            "cost" => 12,
            "salt" => mcrypt_create_iv(22, MCRYPT_DEV_URANDOM),
        	];

					$password = test_input("resourcesHelper1992");

        	$hashPassword = password_hash($password, PASSWORD_BCRYPT, $options);

					$updatePasswordQuery = "UPDATE `userOverview` SET `password` = '" .$hashPassword. "', `salt` = '" .$options["salt"]. "' WHERE `mail` = '" .$mail. "'";


					$updatePassword = $conn->query($updatePasswordQuery);
					$result["url"] = "index.php?passwordResetSuccess=" .$mail;

				} else {

					$result["invalid"] = true;

				}

			} else {

				$result["invalid"] = true;

			}
		} else {

			$result["invalid"] = true;

		}
	} else {

		$result["invalid"] = true;

	}
	echo json_encode($result);
}
