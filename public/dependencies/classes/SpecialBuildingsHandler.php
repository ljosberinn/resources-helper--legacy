<?php declare(strict_types=1);

class SpecialBuildingsHandler implements APIInterface {

    /*
     * {
     *  "specbID": "126",
     *  "name": "Fire Station",
     *  "lvl": "10"
     * }
     */

    private $pdo;
    private $playerIndexUID;

    private const POSSIBLE_SPECIAL_BUILDINGS = [
        59  => 'RecyclingPlant',
        62  => 'Casino',
        65  => 'Museum',
        71  => 'Hospital',
        72  => 'LawFirm',
        86  => 'MafiaHQ',
        97  => 'TrainingCamp',
        116 => 'TechCenter',
        119 => 'DroneResearch',
        121 => 'ServiceCenter',
        122 => 'HRDepartment',
        123 => 'HaulageFirm',
        126 => 'FireStation',
        127 => 'SeismologyCentre',
    ];

    private const QUERIES = [
        'deleteOldData' => 'DELETE FROM `specialBuildings` WHERE `playerIndexUID` = :playerIndexUID',
    ];

    public function __construct(PDO $pdo, int $playerIndexUID) {
        $this->pdo            = $pdo;
        $this->playerIndexUID = $playerIndexUID;
    }

    public static function getNameById(int $specialBuildingID) {
        return self::POSSIBLE_SPECIAL_BUILDINGS[$specialBuildingID];
    }

    public function transform(array $data): array {
        $specialBuildings = [];

        foreach($data as $dataset) {

            $id = (int) $dataset['specbID'];

            if($this->isValidSpecialBuilding($id)) {
                $specialBuildings[$id] = (int) $dataset['lvl'];
            }
        }

        return $specialBuildings;
    }

    private function isValidSpecialBuilding(int $id): bool {
        return array_key_exists($id, self::POSSIBLE_SPECIAL_BUILDINGS);
    }

    private function deleteOldData(): bool {
        $stmt = $this->pdo->prepare(self::QUERIES['deleteOldData']);
        return $stmt->execute(['playerIndexUID' => $this->playerIndexUID]);
    }

    public function save(array $specialBuildings): bool {
        if(!$this->deleteOldData()) {
            return false;
        }

        $query = 'INSERT INTO `specialBuildings` (`playerIndexUID`, `timestamp`, `';
        $query .= implode('`, `', array_keys($specialBuildings)) . '`) VALUES (' . $this->playerIndexUID . ', ' . time() . ', ';
        $query .= implode(', ', array_values($specialBuildings)) . ')';

        if($this->pdo->query($query)) {
            return true;
        }

        return false;
    }

}