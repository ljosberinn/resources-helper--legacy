<?php

session_start();

require "functions.php";
require "db.php";

if (isset($_POST["settings-current-password"]) && isset($_POST["settings-new-password-1"]) && isset($_POST["settings-new-password-2"])) {
    $currentPass = test_input($_POST["settings-current-password"]);

    $newPass1 = test_input($_POST["settings-new-password-1"]);
    $newPass2 = test_input($_POST["settings-new-password-2"]);

    if ($newPass1 != $newPass2) {
        header("Location: ../index.php?changePasswordNoMatch");
    }

    $conn = new mysqli($host, $user, $pw, $db);

    $confirmCurrentPassQuery = "SELECT `salt`, `password` FROM `userOverview` WHERE `id` = " .$_SESSION["id"]. "";

    $confirmCurrentPass = $conn->query($confirmCurrentPassQuery);

    if ($confirmCurrentPass->num_rows == 1) {
        while ($data = $confirmCurrentPass->fetch_assoc()) {
            $oldSalt = $data["salt"];
            $hashedPassword = $data["password"];
        }

        $options = [
          "cost" => 12,
          "salt" => $oldSalt,
        ];

        $hashedInputPassword = password_hash($currentPass, PASSWORD_BCRYPT, $options);

        if ($hashedPassword == $hashedInputPassword) {
            $options = [
                            "cost" => 12,
                            "salt" => mcrypt_create_iv(22, MCRYPT_DEV_URANDOM),
                        ];

            $newPassword = password_hash($newPass1, PASSWORD_BCRYPT, $options);

            $updateUserQuery = "UPDATE `userOverview` SET `salt` = '" .$options["salt"]. "', `password`= '" .$newPassword. "' WHERE `id` = " .$_SESSION["id"]. "";

            $updateUser = $conn->query($updateUserQuery);

            if ($updateUser) {
                header("Location: ../index.php?logout");
            }
        }
    } else {
        header("Location: ../index.php");
    }
}
