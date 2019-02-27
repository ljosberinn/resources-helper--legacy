<?php declare(strict_types=1);

class MineDetailsHandler implements APIInterface {

    /*
     * {
     *  "mineID": "4",
     *  "lat": "12.345678",
     *  "lon": "12.345678",
     *  "HQboost": "1",
     *  "fullrate": "7556.4",
     *  "rawrate": "1506.0",
     *  "techfactor": "5.0175",
     *  "name": "Clay pit",
     *  "builddate": "1489420594",
     *  "lastmaintenance": "1549732399",
     *  "condition": "0.950917",
     *  "resourceName": "Clay",
     *  "resourceID": "2",
     *  "lastenemyaction": "1500659890",
     *  "def1": "200",
     *  "def2": "5",
     *  "def3": "2",
     *  "attackpenalty": "1",
     *  "attackcount": "1",
     *  "attacklost": "1",
     *  "quality": "0.9843",
     *  "qualityInclTU": "4.9388"
     * }
     */

    /** @var PDO $pdo */
    private $pdo;

    private $playerIndexUID;

    private const QUERIES = [
        'deleteOldData' => 'DELETE FROM `mineDetails` WHERE `playerIndexUID` = :playerIndexUID',
        'save'          => 'INSERT INTO `mineDetails` (`playerIndexUID`, `resourceID`, `lat`, `lon`, `built`, `quality`, `techQuality`, `techRate`, `rawRate`, `techFactor`, `isInHQ`, `def1`, `def2`, `def3`, `lastAttack`, `attackPenalty`, `attacks`, `attacksLost`) VALUES(:playerIndexUID, :resourceID, :lat, :lon, :built, :quality, :techQuality, :techRate, :rawRate, :techFactor, :isInHQ, :def1, :def2, :def3, :lastAttack, :attackPenalty, :attacks, :attacksLost)',
    ];

    public function __construct(PDO $pdo, int $playerIndexUID) {
        $this->pdo            = $pdo;
        $this->playerIndexUID = $playerIndexUID;
    }

    public function transform(array $data): array {
        $mines = [];

        foreach($data as $dataset) {

            $mines[] = [
                'playerIndexUID' => $this->playerIndexUID,

                'resourceID' => $dataset['resourceID'],
                'lat'        => $dataset['lat'],
                'lon'        => $dataset['lon'],
                'built'      => $dataset['builddate'],

                'quality'     => $dataset['quality'],
                'techQuality' => $dataset['qualityInclTU'],
                'techRate'    => $dataset['fullrate'],
                'rawRate'     => $dataset['rawrate'],
                'techFactor'  => $dataset['techfactor'],
                'isInHQ'      => $dataset['HQboost'] > 1 ? 1 : 0,

                'def1'          => $dataset['def1'],
                'def2'          => $dataset['def2'],
                'def3'          => $dataset['def3'],
                'lastAttack'    => $dataset['lastenemyaction'],
                'attackPenalty' => $dataset['attackpenalty'],
                'attacks'       => $dataset['attackcount'],
                'attacksLost'   => $dataset['attacklost'],
            ];
        }

        return $mines;
    }

    private function deleteOldData(): bool {
        $stmt = $this->pdo->prepare(self::QUERIES['deleteOldData']);
        return $stmt->execute([
            'playerIndexUID' => $this->playerIndexUID,
        ]);
    }

    public function save(array $data): bool {
        if(!$this->deleteOldData()) {
            return false;
        }

        $stmt = $this->pdo->prepare(self::QUERIES['save']);

        foreach($data as $dataset) {
            if(!$stmt->execute($dataset)) {
                return false;
            }
        }

        return true;
    }
}
