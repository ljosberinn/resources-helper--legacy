<?php

if (isset($_POST['queries'])) {

    session_start();

    include 'db.php';

    $conn = new mysqli($host, $user, $pw, $db);
    $conn->set_charset('utf8');

    $allowedQueries = [0, 1, 2, 3, 4, 5, 51, 6, 7, 9, 10];
    $givenQueries = split(',', $_POST['queries']);

    $string = '';

    foreach ($givenQueries as $query) {

        $query = str_replace('[', '', $query);
        $query = str_replace(']', '', $query);

        if (in_array($query, $allowedQueries)) {
            if ($query != 0) {
                $string .= $query. ', ';
            }
        } else {
            header('HTTP/1.0 403 Forbidden');
            die();
        }
    }

    $string = substr($string, 0, -2);

    $stmt = "UPDATE `userSettings` SET `queryPreset` = '" .$string. "' WHERE `id` = " .$_SESSION['id']. "";

    $update = $conn->query($stmt);

} else {
    header('HTTP/1.0 403 Forbidden');
}

?>