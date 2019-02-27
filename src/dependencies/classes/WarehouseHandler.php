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

    /** @var PDO $pdo */
    private $pdo;

    private $playerIndexUID;

    private $knownLuxuryGoods;

    private const QUERIES = [
        'deleteOldStandings'       => 'DELETE FROM `warehouseStandings` WHERE `playerIndexUID` = :playerIndexUID',
        'deleteOldLevels'          => 'DELETE FROM `warehouseLevels` WHERE `playerIndexUID` = :playerIndexUID',
        'getKnownLuxuryGoods'      => 'SELECT `luxuryGoodID` FROM `luxuryGoods` ORDER BY `luxuryGoodID` ASC',
        'addNewLuxuryGood'         => 'INSERT INTO `luxuryGoods` (`luxuryGoodID`, `name`, `requirement`) VALUES(:luxuryGoodID, :name, :requirement)',
        'addLuxuryGoodOwner'       => 'INSERT INTO `luxuryGoodOwner` (`playerIndexUID`, `luxuryGoodID`, `amount`) VALUES(:playerIndexUID, :luxuryGoodID, :amount)',
        'deleteOldLuxuryGoodOwner' => 'DELETE FROM `luxuryGoodOwner` WHERE `playerIndexUID` = :playerIndexUID AND `luxuryGoodID` = :luxuryGoodID',
    ];

    public function __construct(PDO $pdo, int $playerIndexUID) {
        $this->pdo              = $pdo;
        $this->playerIndexUID   = $playerIndexUID;
        $this->knownLuxuryGoods = $this->getKnownLuxuryGoods();
    }

    public function transform(array $data): array {
        $warehouses = [
            'level'     => [],
            'standings' => [],
        ];

        foreach($data as $dataset) {
            $itemID = (int) $dataset['itemID'];

            if($this->isGeneralGood($itemID)) {

                $warehouses['level'][$itemID]    = $dataset['level'];
                $warehouses['standing'][$itemID] = $dataset['amount'];

                continue;
            }

            $this->addLuxuryGoodOwner($dataset);

            if(!in_array($itemID, $this->knownLuxuryGoods, true)) {
                $this->addNewLuxuryGood($dataset);
            }
        }

        return $warehouses;
    }

    private function deleteOldLuxuryGoodOwner(int $luxuryGoodID): bool {
        $stmt = $this->pdo->prepare(self::QUERIES['deleteOldLuxuryGoodOwner']);
        return $stmt->execute([
            'playerIndexUID' => $this->playerIndexUID,
            'luxuryGoodID'   => $luxuryGoodID,
        ]);
    }

    private function addNewLuxuryGood(array $dataset): void {
        $stmt = $this->pdo->prepare(self::QUERIES['addNewLuxuryGood']);
        $stmt->execute([
            'luxuryItemID' => $dataset['itemID'],
            'name'         => $dataset['itemname'],
        ]);
    }

    private function addLuxuryGoodOwner(array $dataset): void {
        if(!$this->deleteOldLuxuryGoodOwner($dataset['itemID'])) {
            return;
        }

        $stmt = $this->pdo->prepare(self::QUERIES['addLuxuryGoodOwner']);
        $stmt->execute([
            'playerIndexUID' => $this->playerIndexUID,
            'luxuryGoodID'   => $dataset['itemID'],
            'amount'         => $dataset['amount'],
        ]);
    }

    private function getKnownLuxuryGoods(): array {
        $luxuryGoods = [];

        $stmt = $this->pdo->query(self::QUERIES['getKnownLuxuryGoods']);

        if(!$stmt) {
            return $luxuryGoods;
        }

        $knownLuxuryGoods = $stmt->fetchAll();

        if(!$knownLuxuryGoods) {
            return $luxuryGoods;
        }

        foreach($knownLuxuryGoods as $knownLuxuryGood) {
            $luxuryGoods[] = $knownLuxuryGood['luxuryGoodID'];
        }

        return $luxuryGoods;
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
