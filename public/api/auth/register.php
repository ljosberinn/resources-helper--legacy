<?php declare(strict_types=1);

require_once '../../_boot.php';

$unauthorized = 'HTTP/1.0 401 Unauthorized';
$created      = 'HTTP/1.0 201 Created';
$badRequest   = 'HTTP/1.0 400 Bad Request';

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

$mailExists       = $registration->mailExists();
$isSecurePassword = $registration->isSecurePassword();

if($mailExists || !$isSecurePassword) {
    header('Content-type: application/json');
    header($badRequest);

    $response = ['error' => ''];

    if($mailExists) {
        $response['error'] = 'mail in use';
    }

    if($response['error'] === '' && !$isSecurePassword) {
        $response['error'] = 'password insecure';
    }

    echo json_encode($response);
    die;
}

if($registration->register()) {
    header($created);
}




