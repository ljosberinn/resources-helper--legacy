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

    public function __construct(PDO $pdo, int $playerIndexUID) {
        $this->pdo            = $pdo;
        $this->playerIndexUID = $playerIndexUID;
    }

    public function transform(array $data): array {
        $warehouses = [
            'general' => [],
            'luxury'  => [],
        ];

        foreach($data as $dataset) {
            $itemID = (int) $dataset['itemID'];

            if($this->isGeneralGood($itemID)) {

                $warehouses['general'][$itemID] = [
                    'level'  => (int) $dataset['level'],
                    'amount' => (int) $dataset['amount'],
                ];
                continue;
            }

            $warehouses['luxury'][$itemID] = [
                'level'  => (int) $dataset['level'],
                'amount' => (int) $dataset['amount'],
            ];
        }

        return $warehouses;
    }

    public function save(array $data): bool {
        // TODO: Implement save() method.
        return true;
    }

    private function isGeneralGood(int $itemID): bool {
        return in_array($itemID, $this->generalGoods, true);
    }
}
