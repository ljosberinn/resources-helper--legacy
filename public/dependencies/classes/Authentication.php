<?php declare(strict_types=1);

class Authentication {

    protected $mail;
    protected $password;

    protected $passwordPattern = '/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/';

    /** @var PDO $pdo */
    protected $pdo;

    public function __construct(string $mail, string $password) {
        $this->mail     = $this->sanitizeMail($mail);
        $this->password = $this->sanitizePassword($password);

        $this->getDBInstance();
    }

    private function sanitizeMail(string $mail): string {
        $mail = filter_var(strtolower($mail), FILTER_SANITIZE_EMAIL);

        if(!$mail) {
            return '';
        }

        return $mail;
    }

    private function sanitizePassword(string $password): string {
        $password = filter_var($password, FILTER_SANITIZE_STRING);

        if(!$password) {
            return '';
        }

        return $password;
    }

    protected function hashPassword(): string {
        $password = password_hash($this->password, PASSWORD_BCRYPT, ['cost' => 12]);

        if(!$password) {
            return '';
        }

        return $password;
    }

    public function isValidData(): bool {
        return !empty($this->mail) && !empty($this->password);
    }

    public function getDBInstance(): bool {
        $db        = DB::getInstance();
        $this->pdo = $db->getConnection();

        return $this->pdo instanceof PDO;
    }
}
