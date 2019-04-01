<?php declare(strict_types=1);

class Factory {

    /** @var PDO $pdo */
    private $pdo;

    private const QUERIES = [
        'getStaticFactoryData'             => 'SELECT * FROM `staticFactories`',
        'getFactoryProductionDependencies' => 'SELECT `factoryUID`, `dependency`, `amount` FROM `staticFactoryProductionDependencies`',
        'getDependantFactories'            => 'SELECT `factoryUID`, `dependantFactoryUID` FROM `staticDependantFactories`',
        'getUserFactories'                 => 'SELECT `timestamp`, `6`, `23`, `25`, `29`, `31`, `33`, `34`, `37`, `39`, `52`, `61`, `63`, `68`, `69`, `76`, `80`, `85`, `91`, `95`, `101`, `118`, `125` FROM `factories` WHERE `playerIndexUID` = :playerIndexUID',
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

    private function mergeFactoriesWithDependencies(array $factories): array {
        foreach($this->getFactoryProductionDependencies() as $productionDependency) {
            $factories[$productionDependency['factoryUID']]['productionDependencies'][] = [
                'id'     => $productionDependency['dependency'],
                'amount' => $productionDependency['amount'],
            ];
        }

        return $factories;
    }

    private function mergeFactoriesWithDependants(array $factories): array {
        foreach($this->getDependantFactories() as $dependantFactory) {
            $factories[$dependantFactory['factoryUID']]['dependantFactories'][] = $dependantFactory['dependantFactoryUID'];
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

    private function getFactoryProductionDependencies(): array {
        $stmt = $this->pdo->query(self::QUERIES['getFactoryProductionDependencies']);

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
                $factories[$factory['uid']] = [
                    'id'                     => $factory['uid'],
                    'scaling'                => $factory['scaling'],
                    'dependantFactories'     => [],
                    'productionDependencies' => [],
                    'level'                  => 0,
                    'hasDetailsVisible'      => false,
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

                $factories[$column]['level'] = $value;
            }
        }


        return [$factories, $lastUpdateTimestamp];
    }
}
