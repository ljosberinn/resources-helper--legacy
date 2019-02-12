<?php

class TradeLogHandler implements APIInterface {

    /*
     * {
     *  "ts": "1549837882",
     *  "event": "buy",
     *  "username": "G&K Minerals",
     *  "ulvl": "216",
     *  "itemID": "53",
     *  "itemname": "Quartz sand",
     *  "amount": "16216885",
     *  "ppstk": "457",
     *  "transcost": "370555822"
     * }
     */

    private static $validTradeGoods = [
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
        43,
        44,
        45,
        46,
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

    private $currentlyIteratedUsers = [];

    public function transform(array $data): array {

        $response = [];

        foreach($data as $dataset) {
            if(self::isValidTradeGood($dataset['itemID'])) {

                $userUID = $this->getPlayerID($dataset['username'], $dataset['ts']);

                $response[$dataset['ts']] = [
                    'event'           => $dataset['event'] === 'buy' ? 1 : 0,
                    'businessPartner' => $userUID,
                    'itemID'          => $dataset['itemID'],
                    'amount'          => $dataset['amount'],
                    'pricePerUnit'    => $dataset['pricePerUnit'],
                    'transportation'  => $dataset['transportation'],
                ];
            }
        }

        return $response;
    }

    private static function isValidTradeGood(int $tradeGood): bool {
        return in_array($tradeGood, self::$validTradeGoods, true);
    }

    private function getPlayerID(string $name, int $lastSeen = 0): int {
        if(isset($this->currentlyIteratedUsers[$name])) {
            return $this->currentlyIteratedUsers[$name];
        }

        $userIndex = new UserIndex();

        $userUID = $userIndex->getPlayerIDByName($name);

        if($userUID === 0) {
            $userUID = $userIndex->addPlayer($name, $lastSeen);
        }

        $this->currentlyIteratedUsers[$name] = $userUID;

        return $userUID;
    }
}
