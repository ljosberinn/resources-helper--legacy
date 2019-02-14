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

    private $playerIndexUID;

    /** @var PDO */
    private $pdo;

    public function transform(PDO $pdo, array $data, int $playerIndexUID): bool {
        $this->pdo            = $pdo;
        $this->playerIndexUID = $playerIndexUID;

        $userIndex = new PlayerIndex($pdo);

        $lastDatasetTimestamp = $this->loadLastDatasetTimestamp();

        foreach($data as $dataset) {
            if($lastDatasetTimestamp < $dataset['ts'] && $this->isValidTradeGood($dataset['itemID'])) {

                $escapedUserName = $userIndex->escapeUserName($dataset['username']);

                // disallow pure unicode-character players due to indistinguishability
                if(empty($escapedUserName)) {
                    continue;
                }

                // abort whole process if one insert failed
                if(!$this->save($pdo, [
                    'timestamp'       => $dataset['ts'],
                    'playerIndexUID'  => $this->playerIndexUID,
                    'businessPartner' => $this->getPlayerID($userIndex, $escapedUserName, $dataset['ts']),
                    'event'           => $dataset['event'] === 'buy' ? 1 : 0,
                    'itemID'          => $dataset['itemID'],
                    'amount'          => $dataset['amount'],
                    'pricePerUnit'    => $dataset['ppstk'],
                    'transportation'  => $dataset['transcost'],
                ])) {
                    return false;
                }
            }
        }

        return true;
    }


    private function loadLastDatasetTimestamp(): int {
        $stmt = $this->pdo->prepare('SELECT `timestamp` FROM `tradeLog` WHERE `playerIndexUID` = :playerIndexUID ORDER BY `timestamp` DESC LIMIT 1');
        $stmt->execute([
            'playerIndexUID' => $this->playerIndexUID,
        ]);

        if($stmt->rowCount() === 1) {
            return $stmt->fetch()['timestamp'];
        }

        return 0;
    }

    private function save(PDO $pdo, array $dataset): bool {
        $stmt = $pdo->prepare('INSERT INTO `tradeLog` (`timestamp`, `playerIndexUID`, `businessPartner`, `event`, `itemID`, `amount`, `pricePerUnit`, `transportation`) VALUES(:timestamp, :playerIndexUID, :businessPartner, :event, :itemID, :amount, :pricePerUnit, :transportation)');

        return $stmt->execute($dataset);
    }

    private function isValidTradeGood(int $tradeGood): bool {
        return in_array($tradeGood, $this->validTradeGoods, true);
    }

    private function getPlayerID(PlayerIndex $userIndex, string $escapedUserName, int $lastSeen = 0): int {
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
