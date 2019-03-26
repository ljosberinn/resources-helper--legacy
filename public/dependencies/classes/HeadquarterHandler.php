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

    private $pdo;
    private $playerIndexUID;

    private const QUERIES = [
        'deleteOldData' => 'DELETE FROM `headquarters` WHERE `playerIndexUID`= :playerIndexUID',
        'save'          => 'INSERT INTO `headquarters` (`playerIndexUID`, `timestamp`, `level`, `lat`, `lon`, `progress1`, `progress2`, `progress3`, `progress4`) VALUES(:playerIndexUID, :timestamp, :level, :lat, :lon, :progress1, :progress2, :progress3, :progress4)',
    ];

    public function __construct(PDO $pdo, int $playerIndexUID) {
        $this->pdo            = $pdo;
        $this->playerIndexUID = $playerIndexUID;
    }

    public function transform(array $data): array {
        $data = $data[0];

        return [
            'playerIndexUID' => $this->playerIndexUID,
            'timestamp'      => time(),
            'level'          => $data['lvl'],
            'lat'            => $data['lat'],
            'lon'            => $data['lon'],
            'progress1'      => $data['progress1'],
            'progress2'      => $data['progress2'],
            'progress3'      => $data['progress3'],
            'progress4'      => $data['progress4'],
        ];
    }

    private function deleteOldData(): bool {
        $stmt = $this->pdo->prepare(self::QUERIES['deleteOldData']);
        return $stmt->execute(['playerIndexUID' => $this->playerIndexUID]);
    }

    public function save(array $data): bool {
        if(!$this->deleteOldData()) {
            return false;
        }

        $query = $this->pdo->prepare(self::QUERIES['save']);
        return $query->execute($data);
    }
}