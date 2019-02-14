<?php

class TradeLogHandler implements APIInterface {

    private $currentUserUID = 1;
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

    private $validTradeGoods = [
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

    public function transform(array $data): bool {
        $singleton = Singleton::getInstance();
        $pdo       = $singleton->getConnection();

        $userIndex = new UserIndex($pdo);

        foreach($data as $dataset) {
            if($this->isValidTradeGood($dataset['itemID'])) {

                $escapedUserName = $userIndex->escapeUserName($dataset['username']);

                if(empty($escapedUserName)) {
                    continue;
                }

                $userUID = $this->getPlayerID($userIndex, $escapedUserName, $dataset['ts']);

                $dataset = [
                    'timestamp'       => $dataset['ts'],
                    'actor'           => $this->currentUserUID,
                    'businessPartner' => $userUID,
                    'event'           => $dataset['event'] === 'buy' ? 1 : 0,
                    'itemID'          => $dataset['itemID'],
                    'amount'          => $dataset['amount'],
                    'pricePerUnit'    => $dataset['ppstk'],
                    'transportation'  => $dataset['transcost'],
                ];

                if(!$this->save($pdo, $dataset)) {
                    return false;
                }
            }
        }

        return true;
    }

    private function isNewDataset(PDO $pdo, array $params): bool {
        $stmt = $pdo->prepare('SELECT `uid` FROM `tradeLog` WHERE `timestamp` = :timestamp AND `actor` = :actor AND `businessPartner` = :businessPartner AND `event` = :event AND `itemID` = :itemID AND `amount` = :amount AND `pricePerUnit` = :pricePerUnit AND `transportation` = :transportation');
        $stmt->execute($params);

        return $stmt->rowCount() === 0;
    }

    private function save(PDO $pdo, array $dataset): bool {
        $params = [
            'timestamp'       => $dataset['timestamp'],
            'actor'           => $dataset['actor'],
            'businessPartner' => $dataset['businessPartner'],
            'event'           => $dataset['event'],
            'itemID'          => $dataset['itemID'],
            'amount'          => $dataset['amount'],
            'pricePerUnit'    => $dataset['pricePerUnit'],
            'transportation'  => $dataset['transportation'],
        ];

        if($this->isNewDataset($pdo, $params)) {
            $stmt = $pdo->prepare('INSERT INTO `tradeLog` (`timestamp`, `actor`, `businessPartner`, `event`, `itemID`, `amount`, `pricePerUnit`, `transportation`) VALUES(:timestamp, :actor, :businessPartner, :event, :itemID, :amount, :pricePerUnit, :transportation)');

            return $stmt->execute($params);
        }
        return true;
    }

    private function isValidTradeGood(int $tradeGood): bool {
        return in_array($tradeGood, $this->validTradeGoods, true);
    }

    private function getPlayerID(UserIndex $userIndex, string $escapedUserName, int $lastSeen = 0): int {
        if(isset($this->currentlyIteratedUsers[$escapedUserName])) {
            return $this->currentlyIteratedUsers[$escapedUserName];
        }

        $userUID = $userIndex->getPlayerIDByName($escapedUserName);

        if($userUID === 0) {
            $userUID = $userIndex->addPlayer($escapedUserName, $lastSeen);
        } else {
            $userIndex->updateLastSeenTimestampByPlayerID($userUID, $lastSeen);
        }

        $this->currentlyIteratedUsers[$escapedUserName] = $userUID;

        return $userUID;
    }
}
