<?php declare(strict_types=1);

class Registration extends Authentication {

    private $hashedPassword;

    private const QUERIES = [
        'mailExists' => 'SELECT `uid` FROM `user` WHERE `mail` = :mail',
        'register'   => 'INSERT INTO `user` (`mail`, `password`, `pageRegistration`) VALUES(:mail, :password, :pageRegistration)',
    ];

    public function __construct(string $mail, string $password) {
        parent::__construct($mail, $password);
    }

    public function mailExists(): bool {
        $stmt = $this->pdo->prepare(self::QUERIES['mailExists']);
        $stmt->execute([
            'mail' => $this->mail,
        ]);

        return $stmt->rowCount() > 0;
    }

    public function register(): bool {
        $this->hashedPassword = $this->hashPassword();

        if(!$this->hashedPassword) {
            return false;
        }

        $stmt = $this->pdo->prepare(self::QUERIES['register']);
        return $stmt->execute([
            'mail'             => $this->mail,
            'password'         => $this->hashedPassword,
            'pageRegistration' => time(),
        ]);
    }

    public function isSecurePassword(): bool {
        return preg_match($this->passwordPattern, $this->password) > 0;
    }
}
