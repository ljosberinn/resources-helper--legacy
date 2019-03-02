<?php declare(strict_types=1);

class FactoryHandler implements APIInterface {

    /*
     * {
     *  "itemID": "117",
     *  "itemname": "Scan drones",
     *  "level": "4",
     *  "amount": "346"
     * }
     */

    private const POSSIBLE_FACTORIES = [
        6   => 'ConcreteFactory',
        23  => 'FertilizerFactory',
        25  => 'BricksFactory',
        29  => 'InsecticidesFactory',
        31  => 'SteelFactory',
        33  => 'AluminiumFactory',
        34  => 'SilverFactory',
        37  => 'CopperFactory',
        39  => 'FossilFuelFactory',
        52  => 'TitaniumFactory',
        61  => 'GlassFactory',
        63  => 'PlasticsFactory',
        68  => 'SiliconFactory',
        69  => 'ElectronicsFactory',
        76  => 'MedicalTechnologyFactory',
        80  => 'GoldFactory',
        85  => 'JewelleryFactory',
        91  => 'LithiumFactory',
        95  => 'BatteriesFactory',
        101 => 'ArmsFactory',
        118 => 'ScanDrones',
        125 => 'TrucksFactory',
    ];

    private $pdo;
    private $playerIndexUID;

    private const QUERIES = [
        'archiveOldData' => 'INSERT INTO `factoriesHistory` SELECT * FROM `factories` WHERE `playerIndexUID` = :playerIndexUID',
        'deleteOldData'  => 'DELETE FROM `factories` WHERE `playerIndexUID` = :playerIndexUID',
    ];

    public function __construct(PDO $pdo, int $playerIndexUID) {
        $this->pdo            = $pdo;
        $this->playerIndexUID = $playerIndexUID;
    }

    public function transform(array $data): array {
        $factories = [];

        foreach($data as $dataset) {

            $factoryID = (int) $dataset['factoryID'];

            if($this->isValidFactory($factoryID)) {
                $factories[$factoryID] = (int) $dataset['lvl'];
            }
        }

        return $factories;
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

    public function save(array $factories): bool {
        if(!$this->archiveOldData()) {
            return false;
        }

        $query = 'INSERT INTO `factories` (`playerIndexUID`, `timestamp`, `';
        $query .= implode('`, `', array_keys($factories)) . '`) VALUES (' . $this->playerIndexUID . ', ' . time() . ', ';
        $query .= implode(', ', array_values($factories)) . ')';


        if($this->pdo->query($query)) {
            return true;
        }

        return false;
    }

    private function isValidFactory(int $factoryID): bool {
        return array_key_exists($factoryID, self::POSSIBLE_FACTORIES);
    }

    public static function getNameByID(int $factoryID): string {
        return self::POSSIBLE_FACTORIES[$factoryID];
    }

}
