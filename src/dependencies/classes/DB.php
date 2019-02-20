<?php

class DB {
    /**
     * @var PDO
     */
    protected $database;

    /**
     * @var null | self
     */
    private static $instance;

    private function __construct() {
        $DB_USER = (string) getenv('DB_USER');
        $DB_PASS = (string) getenv('DB_PASS');

        $this->database = new PDO('mysql:host=' . getenv('DB_HOST') . ';dbname=' . getenv('DB_NAME') . ';charset=utf8', $DB_USER, $DB_PASS, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::ATTR_PERSISTENT         => true,
        ]);
    }

    public static function getInstance(): DB {
        if(!self::$instance) {
            self::$instance = new DB();
        }

        return self::$instance;
    }

    public function getConnection(): PDO {
        return $this->database;
    }

    final public function __clone() {
    }

    final public function __call($name, $arguments) {
    }

    /** @noinspection PhpUnusedPrivateMethodInspection */
    /** @noinspection MagicMethodsValidityInspection */
    private function __sleep(): array {
    }

    /** @noinspection PhpUnusedPrivateMethodInspection */
    /** @noinspection MagicMethodsValidityInspection */
    private function __wakeup() {
    }
}
