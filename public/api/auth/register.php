<?php declare(strict_types=1);

require_once '../../_boot.php';

$unauthorized = 'HTTP/1.0 401 Unauthorized';
$created      = 'HTTP/1.0 201 Created';

if(!isset($_POST['mail'], $_POST['password'])) {
    header($unauthorized);
    die;
}

$mail     = $_POST['mail'];
$password = $_POST['password'];

$registration = new Registration($mail, $password);

if(!$registration->isValidData()) {
    header($unauthorized);
    die;
}

header('Content-type: application/json');

if($registration->mailExists()) {
    echo json_encode(['error' => 'mail in use']);
    die;
}

if(!$registration->isSecurePassword()) {
    echo json_encode(['error' => 'password insecure']);
    die;
}

if($registration->register()) {
    header($created);
}




