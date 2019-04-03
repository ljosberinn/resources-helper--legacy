<?php declare(strict_types=1);

class Factory {

    /** @var PDO $pdo */
    private $pdo;

    private const QUERIES = [
        'getStaticFactoryData'   => 'SELECT * FROM `staticFactories`',
        'getFactoryRequirements' => 'SELECT `factoryUID`, `requirement`, `amount` FROM `staticFactoryRequirements`',
        'getDependantFactories'  => 'SELECT `factoryUID`, `dependantFactoryUID` FROM `staticDependantFactories`',
        'getUserFactories'       => 'SELECT `timestamp`, `6`, `23`, `25`, `29`, `31`, `33`, `34`, `37`, `39`, `52`, `61`, `63`, `68`, `69`, `76`, `80`, `85`, `91`, `95`, `101`, `118`, `125` FROM `factories` WHERE `playerIndexUID` = :playerIndexUID',
    ];

    public function __construct() {
        $db        = DB::getInstance();
        $this->pdo = $db->getConnection();
    }

    public function getFactories(): array {
        $factories = $this->getStaticFactoryData();
        $factories = $this->mergeFactoriesWithDependencies($factories);
        $factories = $this->mergeFactoriesWithDependants($factories);

        return $factories;
    }

    private function findFactoryByID(array $factories, int $id): int {
        $index = -1;

        foreach($factories as $key => $factory) {
            if($factory['id'] === $id) {
                $index = (int) $key;
                break;
            }
        }

        if($index === -1) {
            throw new RuntimeException('unknown factoryID');
        }

        return $index;
    }

    private function mergeFactoriesWithDependencies(array $factories): array {
        foreach($this->getFactoryRequirements() as $productionDependency) {
            $index = $this->findFactoryByID($factories, $productionDependency['factoryUID']);

            $factories[$index]['requirements'][] = [
                'id'            => $productionDependency['requirement'],
                'amount'        => $productionDependency['amount'],
                'currentAmount' => $productionDependency['amount'],
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

    private function getFactoryRequirements(): array {
        $stmt = $this->pdo->query(self::QUERIES['getFactoryRequirements']);

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
                $factories[] = [
                    'id'                 => $factory['uid'],
                    'scaling'            => $factory['scaling'],
                    'dependantFactories' => [],
                    'requirements'       => [],
                    'level'              => 0,
                    'hasDetailsVisible'  => false,
                ];
            }
        }

        return $factories;
    }

    public function getUserFactories(int $playerIndexUID): array {
        $factories           = $this->getFactories();
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

            $factories = $this->scaleRequirementsToLevel($factories);
        }

        return [$factories, $lastUpdateTimestamp];
    }

    private function scaleRequirementsToLevel(array $factories): array {
        foreach($factories as &$factory) {
            if($factory['level'] === 1) {
                continue;
            }

            foreach($factory['requirements'] as &$requirement) {
                $requirement['currentAmount'] = $requirement['amount'] * $factory['level'];
            }

            unset($requirement);
        }

        return $factories;
    }
}
