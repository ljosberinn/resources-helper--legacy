<?php declare(strict_types=1);

class SpecialBuilding {

    /** @var PDO $pdo */
    private $pdo;

    private const QUERIES = [
        'getSpecialBuildings'     => 'SELECT `specialBuildingUID`, `dependency`, `amount` FROM `staticSpecialBuildings`',
        'getUserSpecialBuildings' => 'SELECT `timestamp`, `59`, `62`, `65`, `71`, `72`, `86`, `97`, `116`, `119`, `121`, `122`, `123`, `126`, `127` FROM `specialBuildings` WHERE `playerIndexUID` = :playerIndexUID',
    ];


    public function __construct() {
        $db        = DB::getInstance();
        $this->pdo = $db->getConnection();
    }

    public function getSpecialBuildings(): array {
        $initialSpecialBuildings = $specialBuildings = [];

        $stmt = $this->pdo->query(self::QUERIES['getSpecialBuildings']);

        if($stmt && $stmt->rowCount() > 0) {
            foreach((array) $stmt->fetchAll() as $specialBuilding) {
                if(!isset($initialSpecialBuildings[$specialBuilding['specialBuildingUID']])) {
                    $initialSpecialBuildings[$specialBuilding['specialBuildingUID']] = [
                        'dependencies' => [],
                        'level'        => 0,
                        'id'           => $specialBuilding['specialBuildingUID'],
                    ];
                }

                $initialSpecialBuildings[$specialBuilding['specialBuildingUID']]['dependencies'][] = [
                    'id'     => $specialBuilding['dependency'],
                    'amount' => $specialBuilding['amount'],
                ];
            }
        }

        foreach($initialSpecialBuildings as $index => $specialBuilding) {
            $specialBuildings[] = $specialBuilding;
        }

        return $specialBuildings;
    }

    public function getUserSpecialBuildings(int $playerIndexUID): array {
        $specialBuildings    = $this->getSpecialBuildings();
        $lastUpdateTimestamp = 0;

        $stmt = $this->pdo->prepare(self::QUERIES['getUserSpecialBuildings']);
        $stmt->execute(['playerIndexUID' => $playerIndexUID]);

        if($stmt->rowCount() > 0) {
            foreach((array) $stmt->fetchAll() as $column => $value) {
                if($column === 'timestamp') {
                    $lastUpdateTimestamp = $value;
                    continue;
                }

                $specialBuildings[$column]['level'] = $value;
            }
        }

        return [$specialBuildings, $lastUpdateTimestamp];
    }
}
