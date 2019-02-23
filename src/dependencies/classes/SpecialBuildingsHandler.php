<?php

class SpecialBuildingsHandler implements APIInterface {

    /*
     * {
     *  "specbID": "126",
     *  "name": "Fire Station",
     *  "lvl": "10"
     * }
     */

    /** @var PDO $pdo */
    private $pdo;

    private $playerIndexUID;

    private const VALID_SPECIAL_BUILDING_IDS = [62, 65, 116, 97, 72, 59, 119, 121, 71, 86, 122, 123, 127, 126];

    private const QUERIES = [
        'deleteOldData' => 'DELETE FROM `specialBuildings` WHERE `playerIndexUID` = :playerIndexUID',
    ];

    public function __construct(PDO $pdo, int $playerIndexUID) {
        $this->pdo            = $pdo;
        $this->playerIndexUID = $playerIndexUID;
    }

    public function transform(array $data): bool {
        $specialBuildings = [];

        foreach($data as $dataset) {
            if($this->isValidSpecialBuilding($dataset['specbID'])) {
                $specialBuildings[$dataset['specbID']] = $dataset['lvl'];
            }
        }

        return $this->save($specialBuildings);
    }

    private function isValidSpecialBuilding(int $specbID): bool {
        return in_array($specbID, self::VALID_SPECIAL_BUILDING_IDS, true);
    }

    private function deleteOldData(): bool {
        $stmt = $this->pdo->prepare(self::QUERIES['deleteOldData']);
        return $stmt->execute(['playerIndexUID' => $this->playerIndexUID]);
    }

    private function save(array $specialBuildings): bool {
        if(!$this->deleteOldData()) {
            return false;
        }

        /** @noinspection SyntaxError */
        $query = 'INSERT INTO `specialBuildings` (`playerIndexUID`, `timestamp`, `';
        $query .= implode('`, `', array_keys($specialBuildings)) . '`) VALUES (' . $this->playerIndexUID . ', ' . time() . ', ';
        $query .= implode(', ', array_values($specialBuildings)) . ')';

        if($this->pdo->query($query)) {
            return true;
        }

        return false;
    }

}
