<?php declare(strict_types=1);

class MineHandler implements APIInterface {

    /**
     * {
     *  "minecount": "359",
     *  "mineID": "9",
     *  "name": "Coal mine",
     *  "SUMfullrate": "901399.6",
     *  "SUMrawrate": "174082.0",
     *  "OAtechfactor": "5.0470",
     *  "OAHQboost": "1.0260",
     *  "OAcondition": "0.9508",
     *  "resourceName": "Coal",
     *  "resourceID": "8",
     *  "SUMdef1": "125451",
     *  "SUMdef2": "2463",
     *  "SUMdef3": "390",
     *  "OAattackpenalty": "1.0000",
     *  "SUMattackcount": "21",
     *  "SUMattacklost": "21",
     *  "OAquality": "0.9508",
     *  "OAqualityInclTU": "4.7986"
     * }
     */

    /** @var PDO $pdo */
    private $pdo;

    private $playerIndexUID;

    private const QUERIES = [
        'archiveOldData' => 'INSERT INTO `minesHistory` SELECT * FROM `mines` WHERE `playerIndexUID` = :playerIndexUID',
        'deleteOldData'  => 'DELETE FROM `mines` WHERE `playerIndexUID` = :playerIndexUID',
    ];

    public function __construct(PDO $pdo, int $playerIndexUID) {
        $this->pdo            = $pdo;
        $this->playerIndexUID = $playerIndexUID;
    }

    public static function getNameById(int $type) {

    }

    public function transform(array $data): bool {

        $result = [];

        foreach($data as $dataset) {
            $result[] = [
                $dataset['resourceID'], // resourceID
                $dataset['minecount'], // amount

                $dataset['SUMfullrate'], // sumTechRate
                $dataset['SUMrawrate'], // sumRawRate
                $dataset['SUMdef1'], // sumDef1
                $dataset['SUMdef2'], // sumDef2
                $dataset['SUMdef3'], // sumDef3
                $dataset['SUMattackcount'], // sumAttacks
                $dataset['SUMattacklost'], // sumAttacksLost

                $dataset['OAtechfactor'], // avgTechFactor
                $dataset['OAHQboost'], // avgHQBoost
                $dataset['OAquality'], // avgQuality
                $dataset['OAqualityInclTU'], // avgTechedQuality
                $dataset['OAattackpenalty'], // avgPenalty
            ];
        }

        return $this->save($result);
    }


    private function archiveOldData(): bool {
        $params = ['playerIndexUID' => $this->playerIndexUID];

        $stmt = $this->pdo->prepare(self::QUERIES['archiveOldData']);
        if(!$stmt->execute($params)) {
            return false;
        }

        return $this->deleteOldData($params);
    }

    private function deleteOldData(array $params): bool {
        $stmt = $this->pdo->prepare(self::QUERIES['deleteOldData']);
        return $stmt->execute($params);
    }

    private function save(array $data): bool {
        if(!$this->archiveOldData()) {
            return false;
        }

        $now = time();

        $query = 'INSERT INTO `mines` (`playerIndexUID`, `timestamp`, `resourceID`, `amount`, `sumTechRate`, `sumRawRate`, `sumDef1`, `sumDef2`, `sumDef3`, `sumAttacks`, `sumAttacksLost`, `avgTechFactor`, `avgHQBoost`, `avgQuality`, `avgTechedQuality`, `avgPenalty`) VALUES ';

        foreach($data as $dataset) {
            $query .= '(' . $this->playerIndexUID . ', ' . $now . ', ' . implode(', ', $dataset) . '), ';
        }

        $query = substr($query, 0, -2);

        if($this->pdo->query($query)) {
            return true;
        }

        return false;
    }
}
