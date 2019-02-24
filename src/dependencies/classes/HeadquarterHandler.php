<?php declare(strict_types=1);

class HeadquarterHandler implements APIInterface {

    /*
     * {
     *  "lvl": "10",
     *  "lat": "12.1234567890123456",
     *  "lon": "12.1234567890123456",
     *  "progress1": "0",
     *  "progress2": "0",
     *  "progress3": "0",
     *  "progress4": "0",
     *  "target": "60",
     *  "itemID1": "60",
     *  "itemID2": "70",
     *  "itemID3": "77",
     *  "itemID4": null,
     *  "itemname1": "Glass",
     *  "itemname2": "Scrap metal",
     *  "itemname3": "Plastic scrap",
     *  "itemname4": null
     * }
     */

    /** @var PDO $pdo */
    private $pdo;

    private $playerIndexUID;

    private const QUERIES = [
        'deleteOldData' => 'DELETE FROM `headquarter` WHERE `playerIndexUID`= :playerIndexUID',
    ];

    private const UNWANTED_KEYS = ['itemname1', 'itemname2', 'itemname3', 'itemname4'];

    public function __construct(PDO $pdo, int $playerIndexUID) {
        $this->pdo            = $pdo;
        $this->playerIndexUID = $playerIndexUID;
    }

    public function transform(array $data): bool {
        $data = (array) $data[0];

        return $this->save($data);
    }

    private function deleteOldData(): bool {
        $stmt = $this->pdo->prepare(self::QUERIES['deleteOldData']);
        return $stmt->execute(['playerIndexUID' => $this->playerIndexUID]);
    }

    private function save(array $data): bool {
        if(!$this->deleteOldData()) {
            return false;
        }


        return true;
    }
}
