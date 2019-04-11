<?php declare(strict_types=1);

class Factories {

    /** @var PDO $pdo */
    protected $pdo;

    protected const QUERIES = [
        'getStaticFactoryData'      => 'SELECT * FROM `staticFactories`',
        'getProductionRequirements' => 'SELECT `factoryUID`, `requirement`, `amount` FROM `staticFactoryRequirements`',
        'getUpgradeRequirements'    => 'SELECT `factoryUID`, `requirement`, `amount` FROM `staticFactoryUpgradeRequirements`',
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

    protected function findFactoryByKey(array $factories, int $id, string $column): int {
        $index = -1;

        foreach($factories as $key => $factory) {
            if($factory[$column] === $id) {
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
            $index = $this->findFactoryByKey($factories, $productionDependency['factoryUID'], 'id');

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
            $index = $this->findFactoryByKey($factories, $dependantFactory['factoryUID'], 'id');

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

    private function getUpgradeRequirements(): array {
        $stmt = $this->pdo->query(self::QUERIES['getUpgradeRequirements']);

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

        if(!$stmt || $stmt->rowCount() <= 0) {
            return $factories;
        }

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

        return $factories;
    }
}
