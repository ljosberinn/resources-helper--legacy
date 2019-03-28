<?php declare(strict_types=1);

class MineDetailsHandler implements APIHeavyInterface {

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

    private $pdo;
    private $playerIndexUID;

    private const QUERIES = [
        'deleteOldData' => 'DELETE FROM `mineDetails` WHERE `playerIndexUID` = :playerIndexUID',
        'save'          => 'INSERT INTO `mineDetails` (`playerIndexUID`, `resourceID`, `lat`, `lon`, `built`, `quality`, `techQuality`, `techRate`, `rawRate`, `techFactor`, `isInHQ`, `def1`, `def2`, `def3`, `lastAttack`, `attackPenalty`, `attacks`, `attacksLost`) VALUES(:playerIndexUID, :resourceID, :lat, :lon, :built, :quality, :techQuality, :techRate, :rawRate, :techFactor, :isInHQ, :def1, :def2, :def3, :lastAttack, :attackPenalty, :attacks, :attacksLost)',
    ];

    private const DATASET_SIZE = 497;
    private const DATASET_END_STRING = ',{"m';
    private const SAVE_BLUEPRINT = [
        'resourceID' => 'resourceID',
        'lat'        => 'lat',
        'lon'        => 'lon',
        'built'      => 'builddate',

        'quality'     => 'quality',
        'techQuality' => 'qualityInclTU',
        'techRate'    => 'fullrate',
        'rawRate'     => 'rawrate',
        'techFactor'  => 'techfactor',
        'isInHQ'      => 'HQboost',

        'def1'          => 'def1',
        'def2'          => 'def2',
        'def3'          => 'def3',
        'lastAttack'    => 'lastenemyaction',
        'attackPenalty' => 'attackpenalty',
        'attacks'       => 'attackcount',
        'attacksLost'   => 'attacklost',
    ];

    public function __construct(PDO $pdo, int $playerIndexUID) {
        $this->pdo            = $pdo;
        $this->playerIndexUID = $playerIndexUID;
    }

    public function transform(string $filePath): string {
        return $filePath;
    }

    private function deleteOldData(): bool {
        $stmt = $this->pdo->prepare(self::QUERIES['deleteOldData']);
        return $stmt->execute([
            'playerIndexUID' => $this->playerIndexUID,
        ]);
    }

    public function save(string $filePath): bool {
        if(!$this->deleteOldData()) {
            return false;
        }

        $stmt = $this->pdo->prepare(self::QUERIES['save']);

        $JSONParser = new JSONParser($filePath, 'MineDetails');
        $JSONParser->setPlayerIndexUID($this->playerIndexUID)
                   ->setBlueprint(self::SAVE_BLUEPRINT)
                   ->setDatasetEndString(self::DATASET_END_STRING)
                   ->setDatasetSize(self::DATASET_SIZE)
                   ->setFileSize((int) filesize($filePath))
                   ->storeSaveQuery($stmt);

        return $JSONParser->parse();
    }
}
