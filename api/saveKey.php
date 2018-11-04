<?php

if (isset($_POST['key']) && strlen ((int) $_POST['key']) === 45) {
    session_start ();

    require_once 'db.php';
    $conn = new mysqli($host, $user, $pw, $db);

    $updateQuery = "UPDATE `userOverview` SET `realKey` = '" . $conn->real_escape_string ($_POST['key']) . "' WHERE `id` = " . $_SESSION['id'];

    $update = $conn->query ($updateQuery);

    if ($update) {
        return true;
    }
}

?>
