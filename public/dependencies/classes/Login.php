<?php declare(strict_types=1);

class Login extends Authentication {

    private $probablyUser;
    private $user;

    private const QUERIES = [
        'isRegisteredUser' => 'SELECT * FROM `user` WHERE `mail` = :mail',
    ];

    public function __construct(string $mail, string $password) {
        parent::__construct($mail, $password);
    }

    public function isRegisteredUser(): bool {
        $stmt = $this->pdo->prepare(self::QUERIES['isRegisteredUser']);
        $stmt->execute([
            'mail' => $this->mail,
        ]);

        if($stmt->rowCount() === 1) {
            $this->probablyUser = $stmt->fetch();
            return true;
        }

        return false;
    }

    public function isCorrectPassword(): bool {
        return password_verify($this->password, $this->probablyUser['password']);
    }

    public function login(): array {
        foreach($this->probablyUser as $key => $value) {
            if($key === 'password') {
                continue;
            }

            $this->user[$key] = $value;
        }

        return $this->user;
    }
}
