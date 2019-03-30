<?php declare(strict_types=1);

require_once '../../_boot.php';

$unauthorized = 'HTTP/1.0 401 Unauthorized';

if(!isset($_POST['mail'], $_POST['password'])) {
    header($unauthorized);
    die;
}

$mail     = $_POST['mail'];
$password = $_POST['password'];

$login = new Login($mail, $password);

if(!$login->isValidData() || !$login->isRegisteredUser() || !$login->isCorrectPassword()) {
    header($unauthorized);
    die;
}

header('Content-type: application/json');

echo json_encode($login->login());




