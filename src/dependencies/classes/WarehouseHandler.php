<?php

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

    public function transform(PDO $pdo, array $data, int $playerIndexUID): bool {
        $warehouses = [
            'general' => [],
            'luxury'  => [],
        ];

        foreach($data as $dataset) {
            if($this->isGeneralGood($dataset['itemID'])) {

                $warehouses['general'][$dataset['itemID']] = [
                    'level'  => $dataset['level'],
                    'amount' => $dataset['amount'],
                ];
                continue;
            }

            $warehouses['luxury'][$dataset['itemID']] = [
                'level'  => $dataset['level'],
                'amount' => $dataset['amount'],
            ];
        }

        return true;
    }

    private function isGeneralGood(int $itemID): bool {
        return in_array($itemID, $this->generalGoods, true);
    }
}
