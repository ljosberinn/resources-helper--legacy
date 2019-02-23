<?php

class APICreditsHandler implements APIInterface {

    /*
     * {
     *  "creditsleft": "8106"
     * }
     */

    /** @var PDO $pdo */
    private $pdo;

    private $playerIndexUID;

    private const QUERIES = [
        'save' => 'UPDATE `user` SET `remainingAPICredits` = :remainingAPICredits WHERE `playerIndexUID` = :playerIndexUID',
    ];

    public function __construct(PDO $pdo, int $playerIndexUID) {
        $this->pdo            = $pdo;
        $this->playerIndexUID = $playerIndexUID;
    }

    public function transform(array $data): bool {
        return $this->save($data[0]['creditsleft']);
    }

    private function save(int $remainingAPICredits): bool {
        $stmt = $this->pdo->prepare(self::QUERIES['save']);
        return $stmt->execute([
            'remainingAPICredits' => $remainingAPICredits,
            'playerIndexUID'      => $this->playerIndexUID,
        ]);
    }
}
