<?php declare(strict_types=1);

class TradeLogHandler implements APIHeavyInterface {

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

    private $playerIndexUID;
    private $pdo;

    private $currentlyIteratedUsers = [];

    private const DATASET_SIZE = 200;
    private const DATASET_END_STRING = ',{"t';
    private const SAVE_BLUEPRINT = [
        'timestamp'      => 'ts',
        'event'          => 'event',
        'itemID'         => 'itemID',
        'amount'         => 'amount',
        'pricePerUnit'   => 'ppstk',
        'transportation' => 'transcost',
    ];

    private const VALID_TRADE_GOODS = [
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

    private const QUERIES = [
        'loadLastDatasetTimestamp' => 'SELECT `timestamp` FROM `tradeLog` WHERE `playerIndexUID` = :playerIndexUID ORDER BY `timestamp` DESC LIMIT 1',
        'save'                     => 'INSERT INTO `tradeLog` (`timestamp`, `playerIndexUID`, `businessPartner`, `event`, `itemID`, `amount`, `pricePerUnit`, `transportation`) VALUES(:timestamp, :playerIndexUID, :businessPartner, :event, :itemID, :amount, :pricePerUnit, :transportation)',
    ];

    public function __construct(PDO $pdo, int $playerIndexUID) {
        $this->pdo            = $pdo;
        $this->playerIndexUID = $playerIndexUID;
    }

    public function transform(string $filePath): string {
        return $filePath;
    }

    private function loadLastDatasetTimestamp(): int {
        $stmt = $this->pdo->prepare(self::QUERIES['loadLastDatasetTimestamp']);
        $stmt->execute([
            'playerIndexUID' => $this->playerIndexUID,
        ]);

        if($stmt->rowCount() === 1) {
            return $stmt->fetch()['timestamp'];
        }

        return 0;
    }

    public function save(string $filePath): bool {
        $stmt = $this->pdo->prepare(self::QUERIES['save']);

        $fileSize = (int) filesize($filePath);

        $JSONParser = new JSONParser($filePath, 'TradeLog', $this->pdo, $this->loadLastDatasetTimestamp());
        $JSONParser->storeSaveQuery($stmt)
                   ->setFileSize($fileSize)
                   ->setDatasetSize(self::DATASET_SIZE)
                   ->setDatasetEndString(self::DATASET_END_STRING)
                   ->setBlueprint(self::SAVE_BLUEPRINT)
                   ->setPlayerIndexUID($this->playerIndexUID);

        return $JSONParser->parse();
    }

    private function isValidTradeGood(int $tradeGood): bool {
        return in_array($tradeGood, self::VALID_TRADE_GOODS, true);
    }
}
