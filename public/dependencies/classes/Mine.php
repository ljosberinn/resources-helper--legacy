<?php declare(strict_types=1);

class Mine {

    /** @var PDO $pdo */
    private $pdo;

    private const QUERIES = [
        'getMines'     => 'SELECT * FROM `staticMines`',
        'getUserMines' => 'SELECT `timestamp`, `resourceID`, `amount`, `sumTechRate`, `sumRawRate`, `sumDef1`, `sumDef2`, `sumDef3`, `sumAttacks`, `sumAttacksLost`, `avgTechFactor`, `avgHQBoost`, `avgQuality`, `avgTechedQuality`, `avgPenalty` FROM `mines` WHERE `playerIndexUID` = :playerIndexUID',
    ];

    public function __construct() {
        $db        = DB::getInstance();
        $this->pdo = $db->getConnection();
    }

    public function getMines(): array {
        $mines = [];

        $stmt = $this->pdo->query(self::QUERIES['getMines']);

        if($stmt && $stmt->rowCount() > 0) {
            foreach((array) $stmt->fetchAll() as $mine) {
                $mines[] = [
                    'resourceID'       => $mine['uid'],
                    'amount'           => 0,
                    'basePrice'        => $mine['basePrice'],
                    'maxHourlyRate'    => $mine['maxHourlyRate'] / 10,
                    'sumTechRate'      => 0,
                    'sumRawRate'       => 0,
                    'sumDef1'          => 0,
                    'sumDef2'          => 0,
                    'sumDef3'          => 0,
                    'sumAttacks'       => 0,
                    'sumAttacksLost'   => 0,
                    'avgTechFactor'    => 0.00,
                    'avgHQBoost'       => 0.00,
                    'avgQuality'       => 0.00,
                    'avgTechedQuality' => 0.00,
                    'avgPenalty'       => 0,
                ];
            }
        }

        return $mines;
    }

    public function getUserMines(int $playerIndexUID): array {
        $mines               = $this->getMines();
        $lastUpdateTimestamp = 0;

        $stmt = $this->pdo->prepare(self::QUERIES['getUserMines']);
        $stmt->execute(['playerIndexUID' => $playerIndexUID]);

        if($stmt->rowCount() > 0) {

            $map = [
                'amount',
                'sumTechRate',
                'sumRawRate',
                'sumDef1',
                'sumDef2',
                'sumDef3',
                'sumAttacks',
                'sumAttacksLost',
                'avgTechFactor',
                'avgHQBoost',
                'avgQuality',
                'avgTechedQuality',
                'avgPenalty',
            ];

            foreach((array) $stmt->fetchAll() as $dataset) {
                $lastUpdateTimestamp = $lastUpdateTimestamp > 0 ? $lastUpdateTimestamp : $dataset['timestamp'];

                $resourceID = $dataset['resourceID'];
                $index      = -1;

                foreach($mines as $key => $mine) {
                    if($mine['resourceID'] === $resourceID) {
                        $index = $key;
                        break;
                    }
                }

                foreach($map as $key) {
                    $mines[$index][$key] = $dataset[$key];
                }
            }
        }

        return [$mines, $lastUpdateTimestamp];
    }
}
