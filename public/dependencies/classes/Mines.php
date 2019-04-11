<?php declare(strict_types=1);

class Mines {

    /** @var PDO $pdo */
    protected $pdo;

    protected const QUERIES = [
        'getMines'               => 'SELECT * FROM `staticMines`',
        'getUserMines'           => 'SELECT `timestamp`, `resourceID`, `amount`, `sumTechRate`, `sumRawRate`, `sumDef1`, `sumDef2`, `sumDef3`, `sumAttacks`, `sumAttacksLost`, `avgTechFactor`, `avgHQBoost`, `avgQuality`, `avgTechedQuality`, `avgPenalty` FROM `mines` WHERE `playerIndexUID` = :playerIndexUID',
        'getMineFactoryRelation' => 'SELECT `mineUID`, `factoryUID` FROM `staticMineFactoryRelation`',
    ];

    public function __construct() {
        $db        = DB::getInstance();
        $this->pdo = $db->getConnection();
    }

    private function getMineFactoryRelation(): array {
        $stmt = $this->pdo->query(self::QUERIES['getMineFactoryRelation']);

        $relations = [];

        if($stmt && $stmt->rowCount() > 0) {
            foreach((array) $stmt->fetchAll() as $relation) {
                if(empty($relations[$relation['mineUID']])) {
                    $relations[$relation['mineUID']] = [$relation['factoryUID'],];
                    continue;
                }

                $relations[$relation['mineUID']][] = $relation['factoryUID'];
            }
        }

        return $relations;
    }

    public function get(): array {
        $mines = [];

        $stmt = $this->pdo->query(self::QUERIES['getMines']);

        $mineFactoryRelations = $this->getMineFactoryRelation();

        if($stmt && $stmt->rowCount() > 0) {
            foreach((array) $stmt->fetchAll() as $mine) {
                $mines[] = [
                    'resourceID'         => $mine['uid'],
                    'amount'             => 0,
                    'basePrice'          => $mine['basePrice'],
                    'maxHourlyRate'      => $mine['maxHourlyRate'] / 10,
                    'sumTechRate'        => 0,
                    'sumRawRate'         => 0,
                    'sumDef1'            => 0,
                    'sumDef2'            => 0,
                    'sumDef3'            => 0,
                    'sumAttacks'         => 0,
                    'sumAttacksLost'     => 0,
                    'avgTechFactor'      => 0.00,
                    'avgHQBoost'         => 0.00,
                    'avgQuality'         => 0.00,
                    'avgTechedQuality'   => 0.00,
                    'avgPenalty'         => 0,
                    'dependantFactories' => $mineFactoryRelations[$mine['uid']] ?? [],
                ];
            }
        }

        return $mines;
    }
}
