<?php declare(strict_types=1);

class WarehouseHandler implements APIInterface {

    private $generalGoods = [
        1,
        2,
        3,
        7,
        8,
        10,
        12,
        13,
        14,
        15,
        20,
        22,
        24,
        26,
        28,
        30,
        32,
        35,
        36,
        38,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        48,
        49,
        51,
        53,
        55,
        57,
        58,
        60,
        66,
        67,
        70,
        74,
        75,
        77,
        78,
        79,
        81,
        84,
        87,
        90,
        92,
        93,
        96,
        98,
        99,
        102,
        103,
        104,
        115,
        117,
        120,
        124,
    ];

    private $pdo;
    private $playerIndexUID;

    private $knownLuxuryGoods;
    private $luxuryGoodHandler;

    private const QUERIES = [
        'deleteOldStandings' => 'DELETE FROM `warehouseStandings` WHERE `playerIndexUID` = :playerIndexUID',
        'deleteOldLevels'    => 'DELETE FROM `warehouseLevels` WHERE `playerIndexUID` = :playerIndexUID',
    ];

    public function __construct(PDO $pdo, int $playerIndexUID) {
        $this->pdo            = $pdo;
        $this->playerIndexUID = $playerIndexUID;

        $this->luxuryGoodHandler = new LuxuryGoodHandler($pdo, $playerIndexUID);
        $this->knownLuxuryGoods  = $this->luxuryGoodHandler->getKnownLuxuryGoods();
    }

    public function transform(array $data): array {
        $warehouses = [
            'level'     => [],
            'standings' => [],
        ];

        foreach($data as $dataset) {
            $dataset['itemID'] = (int) $dataset['itemID'];

            if($this->isGeneralGood($dataset['itemID'])) {

                $warehouses['level'][$dataset['itemID']]    = $dataset['level'];
                $warehouses['standing'][$dataset['itemID']] = $dataset['amount'];

                continue;
            }

            $this->luxuryGoodHandler->addLuxuryGoodOwner($dataset);

            if(!in_array($dataset['itemID'], $this->knownLuxuryGoods, true)) {
                $this->luxuryGoodHandler->addNewLuxuryGood($dataset);
            }
        }

        return $warehouses;
    }

    private function deleteOldData(): bool {
        $params = ['playerIndexUID' => $this->playerIndexUID];

        foreach(['deleteOldStandings', 'deleteOldLevels'] as $key) {
            $stmt = $this->pdo->prepare(self::QUERIES[$key]);

            if(!$stmt->execute($params)) {
                return false;
            }
        }

        return true;
    }

    public function save(array $data): bool {
        if(!$this->deleteOldData()) {
            return false;
        }

        foreach([
                    'warehouseStandings' => 'standing',
                    'warehouseLevels'    => 'level',
                ] as $tableName => $key) {
            $query = 'INSERT INTO `' . $tableName . '` (playerIndexUID, `timestamp`, `';
            $query .= implode('`, `', array_keys($data[$key])) . '`) VALUES(' . $this->playerIndexUID . ', ' . time() . ', ';
            $query .= implode(', ', array_values($data[$key])) . ')';

            if(!$this->pdo->query($query)) {
                return false;
            }
        }

        return true;
    }

    private function isGeneralGood(int $itemID): bool {
        return in_array($itemID, $this->generalGoods, true);
    }
}
