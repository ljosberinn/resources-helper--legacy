<?php declare(strict_types=1);

class CombatLogHandler implements APIInterface {

    /*
     * {
     * "unixts": "1548992176",
     * "act": "D",
     * "result": "lost",
     * "targetUserName": "userName",
     * "targetUserLevel": "113",
     * "lat": "12.345678",
     * "lon": "12.345678",
     * "AQtyUnit1": "443",
     * "AQtyUnit2": "0",
     * "AQtyUnit3": "0",
     * "DQtyUnit1": "200",
     * "DQtyUnit2": "5",
     * "DQtyUnit3": "2",
     * "loot1ItemID": "81",
     * "loot1ItemQty": "1495278",
     * "loot2ItemID": "1",
     * "loot2ItemQty": "4806091135",
     * "lootfactor": "1.41"
     * }
     */

    private $pdo;
    private $playerIndexUID;

    private $currentlyIteratedUsers = [];

    public function __construct(PDO $pdo, int $playerIndexUID) {
        $this->pdo            = $pdo;
        $this->playerIndexUID = $playerIndexUID;
    }

    public function transform(array $data): array {
        $userIndex = new PlayerIndex($this->pdo);

        $result = [];

        foreach($data as &$dataset) {
            $userUID = $this->getPlayerID($userIndex, $dataset['targetUserName'], (int) $dataset['unixts']);

            /* 4 possible cases
             * act === D & result === lost ? API player is defender and lost
             * act === D & result === won ? API player is defender and won
             *
             * act === A & result === lost ? API player is attacker and lost
             * act === A & result === won ? API player is attacker and won
             */
            $action  = $dataset['act'] === 'D' ? 0 : 1;
            $outcome = $dataset['result'] === 'lost' ? 0 : 1;

            $result[] = [
                'action'     => $action,
                'result'     => $outcome,
                'timestamp'  => $dataset['unixts'],
                'actor'      => $userUID,
                'actorLevel' => $dataset['targetUserLevel'],

                'lat' => $dataset['lat'],
                'lon' => $dataset['lon'],

                'attackingUnit1' => $dataset['AQtyUnit1'],
                'attackingUnit2' => $dataset['AQtyUnit2'],
                'attackingUnit3' => $dataset['AQtyUnit3'],

                'defendingUnit1' => $dataset['DQtyUnit1'],
                'defendingUnit2' => $dataset['DQtyUnit2'],
                'defendingUnit3' => $dataset['DQtyUnit3'],

                'lootID1'       => $dataset['loot1ItemID'],
                'lootQuantity1' => $dataset['loot1ItemQty'],
                'lootID2'       => $dataset['loot2ItemID'],
                'lootQuantity2' => $dataset['loot2ItemQty'],
                'lootFactor'    => $dataset['lootfactor'],
            ];
        }

        return $result;
    }

    public function save(array $data): bool {
        return true;
    }

    private function getPlayerID(PlayerIndex $userIndex, string $name, int $lastSeen = 0): int {
        if(isset($this->currentlyIteratedUsers[$name])) {
            return $this->currentlyIteratedUsers[$name];
        }

        $userUID = $userIndex->getPlayerIDByName($name);

        if($userUID === 0) {
            $userUID = $userIndex->addPlayer($name, $lastSeen);
        }

        $this->currentlyIteratedUsers[$name] = $userUID;

        return $userUID;
    }
}