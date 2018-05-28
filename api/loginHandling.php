<?php

$mail = test_input($_POST["login-mail"]);
$password = test_input($_POST["login-pw"]);
$passwordPreg = preg_match("^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$", $password);

if (!empty($mail) && $passwordPreg !== 0) {

    $getSaltQuery = "SELECT `id`, `salt`, `password` FROM `userOverview` WHERE `mail` = '" .$mail. "'";

    $getSalt = $conn->query($getSaltQuery);

    if ($getSalt->num_rows == 1) {
        while ($data = $getSalt->fetch_assoc()) {
            $salt = $data["salt"];
            $hashedPasswordDB = $data["password"];
            $userId = $data["id"];
        }

        $options = [
            "cost" => 12,
            "salt" => $salt,
        ];

        $hashPassword = password_hash($password, PASSWORD_BCRYPT, $options);

        if (password_verify($password, $hashedPasswordDB)) {

            $_SESSION["id"] = $userId;
            $_SESSION["mail"] = $mail;
            setcookie("returningUser", "" .$mail. "", time()+31536000, '/', 'resources-helper.de');
            setcookie("loggedIn", true, time()+1440, '/', 'resources-helper.de');

        } else {
            header("Location: index.php?invalidCredentials");
        }

    } else if ($getSalt->num_rows == 0) {
        header("Location: index.php?invalidCredentials");
    }

} else {
    header("Location: index.php?invalidCredentials");
}
