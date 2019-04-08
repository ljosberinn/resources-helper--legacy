<?php declare(strict_types=1);

class Factory {

    /** @var PDO $pdo */
    private $pdo;

    private const QUERIES = [
        'getStaticFactoryData'      => 'SELECT * FROM `staticFactories`',
        'getProductionRequirements' => 'SELECT `factoryUID`, `requirement`, `amount` FROM `staticFactoryRequirements`',
        'getDependantFactories'     => 'SELECT `factoryUID`, `dependantFactoryUID` FROM `staticDependantFactories`',
        'getUserFactories'          => 'SELECT `timestamp`, `6`, `23`, `25`, `29`, `31`, `33`, `34`, `37`, `39`, `52`, `61`, `63`, `68`, `69`, `76`, `80`, `85`, `91`, `95`, `101`, `118`, `125` FROM `factories` WHERE `playerIndexUID` = :playerIndexUID',
    ];

    private const MINE_INDEPENDENT_FACTORIES = [
        69,
        76,
        95,
        101,
        118,
        125,
    ];

    /* these factories rely exclusively on mines */
    private const PRIMARY_ORDER = [
        6,  // Concrete factory, product ID = 7
        23, // Fertilizer factory, product ID = 22
        25, // Brick factory, product ID = 24
        31, // Ironworks, product ID = 30
        33, // Aluminium factory, product ID = 32
        34, // Silver refinery, product ID = 35
        37, // Copper refinery, product ID = 36
        39, // Oil refinery, product ID = 38
        52, // Titanium refinery, product ID = 51
        63, // Plastic factory, product ID = 58
        80, // Gold refinery, product ID = 79
        91, // Lithium refinery, product ID = 92
    ];

    /* these factories rely both on mines and products */
    private const SECONDARY_ORDER = [
        29, // Insecticide factory, product ID = 28
        61, // Glacier's workshop, product ID = 60
        68, // Silicon refinery, product ID = 67
        69, // Electronics factory, product ID = 66
        85, // Goldsmith, product ID = 84
    ];

    /* these factories rely exclusively on products of other factories */
    private const TERTIARY_ORDER = [
        76,  // Medical technology Inc., product ID = 75
        95,  // Battery factory, product ID = 93
        101, // Arms factory, product ID = 87
        118, // Drone shipyard, product ID = 117
        125  // Trucks, product ID = 124
    ];

    public function __construct() {
        $db        = DB::getInstance();
        $this->pdo = $db->getConnection();
    }

    public function get(): array {
        $factories = $this->getStaticFactoryData();
        $factories = $this->mergeFactoriesWithDependencies($factories);
        $factories = $this->mergeFactoriesWithDependants($factories);

        return $factories;
    }

    private function findFactoryByID(array $factories, int $id, bool $product = false): int {
        $index = -1;

        foreach($factories as $key => $factory) {
            if($factory[$product ? 'productID' : 'id'] === $id) {
                $index = (int) $key;
                break;
            }
        }

        if($index === -1) {
            throw new RuntimeException('unknown factoryID ' . $id);
        }

        return $index;
    }

    private function mergeFactoriesWithDependencies(array $factories): array {
        foreach($this->getProductionRequirements() as $productionDependency) {
            $index = $this->findFactoryByID($factories, $productionDependency['factoryUID']);

            $factories[$index]['productionRequirements'][] = [
                'id'                    => $productionDependency['requirement'],
                'amountPerLevel'        => $productionDependency['amount'],
                'currentRequiredAmount' => $productionDependency['amount'],
                'currentGivenAmount'    => 0,
            ];
        }

        return $factories;
    }

    private function mergeFactoriesWithDependants(array $factories): array {
        foreach($this->getDependantFactories() as $dependantFactory) {
            $index = $this->findFactoryByID($factories, $dependantFactory['factoryUID']);

            $factories[$index]['dependantFactories'][] = $dependantFactory['dependantFactoryUID'];
        }

        return $factories;
    }

    private function getDependantFactories(): array {
        $stmt = $this->pdo->query(self::QUERIES['getDependantFactories']);

        if($stmt && $stmt->rowCount() > 0) {
            return (array) $stmt->fetchAll();
        }

        return [];
    }

    private function getProductionRequirements(): array {
        $stmt = $this->pdo->query(self::QUERIES['getProductionRequirements']);

        if($stmt && $stmt->rowCount() > 0) {
            return (array) $stmt->fetchAll();
        }

        return [];
    }

    private function getStaticFactoryData(): array {
        $stmt = $this->pdo->query(self::QUERIES['getStaticFactoryData']);

        $factories = [];

        if($stmt && $stmt->rowCount() > 0) {
            foreach((array) $stmt->fetchAll() as $factory) {
                $dataset = [
                    'id'                     => $factory['uid'],
                    'productID'              => $factory['productID'],
                    'scaling'                => $factory['scaling'],
                    'dependantFactories'     => [],
                    'productionRequirements' => [],
                    'upgradeRequirements'    => [],
                    'level'                  => 0,
                    'hasDetailsVisible'      => false,
                ];

                if(!in_array($factory['uid'], self::MINE_INDEPENDENT_FACTORIES, true)) {
                    $dataset['relevantMines'] = [];
                }

                $factories[] = $dataset;
            }
        }

        return $factories;
    }

    public function getUserFactories(int $playerIndexUID, array $mines): array {
        $factories           = $this->get();
        $lastUpdateTimestamp = 0;

        $stmt = $this->pdo->prepare(self::QUERIES['getUserFactories']);
        $stmt->execute(['playerIndexUID' => $playerIndexUID]);

        if($stmt->rowCount() === 1) {
            $userFactories = $stmt->fetch();

            foreach($userFactories as $column => $value) {
                if($column === 'timestamp') {
                    $lastUpdateTimestamp = $value;
                    continue;
                }

                $index = $this->findFactoryByID($factories, $column);

                $factories[$index]['level'] = $value;
            }

            $factories = $this->scaleRequirementsToLevel($factories, $this->flattenMines($mines));
        }

        return [$factories, $lastUpdateTimestamp];
    }

    private function flattenMines(array $mines): array {
        $flattenedMines = [];

        foreach($mines as $mine) {
            $flattenedMines[$mine['resourceID']] = $mine['sumTechRate'];
        }

        return $flattenedMines;
    }

    private function scaleRequirementsToLevel(array $factories, array $mines): array {
        $mineUIDS = array_keys($mines);

        $calculationOrder = array_merge(self::PRIMARY_ORDER, self::SECONDARY_ORDER, self::TERTIARY_ORDER);

        foreach($calculationOrder as $factoryID) {
            $index = $this->findFactoryByID($factories, $factoryID);

            $factory = $factories[$index];

            if($factory['level'] === 1) {
                continue;
            }

            foreach($factory['productionRequirements'] as &$requirement) {
                $requirement['currentRequiredAmount'] = $requirement['amountPerLevel'] * $factory['level'];

                if($requirement['id'] === 1) {
                    continue;
                }

                // requirement is a mine
                if(in_array($requirement['id'], $mineUIDS, true)) {
                    $requirement['currentGivenAmount'] = $mines[$requirement['id']];
                    continue;
                }

                // requirement is another factories product
                $otherFactoryIndex                 = $this->findFactoryByID($factories, $requirement['id'], true);
                $requirement['currentGivenAmount'] = $factories[$otherFactoryIndex]['level'] * $factories[$otherFactoryIndex]['scaling'];
            }

            unset($requirement);

            $factories[$index] = $factory;
        }

        return $factories;
    }
}
