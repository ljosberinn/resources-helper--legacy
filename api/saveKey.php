<?php

if (isset($_POST['key'])
  && strlen($_POST['key']) == 45
  ) {
    session_start();

    include 'db.php';
    $conn = new mysqli($host, $user, $pw, $db);

    $updateQuery = "UPDATE `userOverview` SET `realKey` = '" .$_POST['key']. "' WHERE `id` = " .$_SESSION['id']. "";


    $update = $conn->query($updateQuery);

    if ($update) {
        return true;
    }
}

?>