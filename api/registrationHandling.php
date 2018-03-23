<?php

validateRegistration($_POST);

$existingMailQuery = "SELECT `id` FROM `userOverview` WHERE `mail` = '" .$_POST["registration-mail"]. "'";

$existingMailCheck = $conn->query($existingMailQuery);

if ($existingMailCheck->num_rows > 0) {
    header("Location: index.php?duplicateRegistrationMail=" .$_POST["registration-mail"]. "");
} else {
    $options = [
    "cost" => 12,
    "salt" => mcrypt_create_iv(22, MCRYPT_DEV_URANDOM),
    ];

    $hashPassword = password_hash($_POST["registration-pw-1"], PASSWORD_BCRYPT, $options);

    if (!empty($_POST["registration-api-key"])) {
        $apiKey = $_POST["registration-api-key"];
        $hashedApiKey = md5($apiKey);
    } else {
        $apiKey = "";
        $hashedApiKey = "";
    }

    $time = time('now');

    $insertionQuery = "INSERT INTO
	`userOverview`(
		`registeredPage`,
		`mail`,
		`password`,
		`salt`,
		`lastUpdate`,
		`language`,
		`realKey`,
		`hashedKey`
	) VALUES(
			" .$time. ",
			'" .$_POST["registration-mail"]. "',
			'" .$hashPassword. "',
			'" .$options["salt"]. "',
			" .time('now'). ",
			" .$_POST["registration-language"]. ",
			'" .$apiKey. "',
			'" .$hashedApiKey. "'
		);";

    $insertion = $conn->query($insertionQuery);

    $getNewIdQuery = "SELECT `id` FROM `userOverview` WHERE `mail` = '" .$_POST["registration-mail"]. "'";
    $getNewId = $conn->query($getNewIdQuery);

    while ($data = $getNewId->fetch_assoc()) {
        $id = $data["id"];
    }

    $getSettingDefaultsQuery = "SELECT `setting`, `value` FROM `settings`";
    $getSettings = $conn->query($getSettingDefaultsQuery);

    $columns = "";
    $values = "" .$id. ",";

    while ($data = $getSettings->fetch_assoc()) {
        $columns .= "`" .$data["setting"]. "`,";
        $values .= "'" .$data["value"]. "',";
    }

    $insertNewUserSettingsQuery = "INSERT INTO `userSettings` (`id`, " .substr($columns, 0, -1). ") VALUES (" .substr($values, 0, -1). ");";

    $insertNewUserSettings = $conn->query($insertNewUserSettingsQuery);

    $templateQueries = [
        "INSERT INTO `userFactories` (`id`) VALUES (" .$id. ")",
        "INSERT INTO `userMaterial` (`id`) VALUES (" .$id. ")",
        "INSERT INTO `userWarehouse` (`id`) VALUES (" .$id. ")",
        "INSERT INTO `userBuildings` (`id`) VALUES (" .$id. ")",
        "INSERT INTO `userHeadquarter` (`id`, `level`) VALUES (" .$id. ", 1)",
    ];

    foreach ($templateQueries as $query) {
        $conn->query($query);
    }

    header("Location: index.php?successfulRegistration=" .$_POST["registration-mail"]. "&token=" .md5($time));
}
