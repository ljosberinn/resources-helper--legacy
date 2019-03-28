<?php declare(strict_types=1);

class JSONParser {

    /** @var int $datasetSize */
    private $fileSize;

    /** @var int $datasetSize */
    private $datasetSize;

    /** @var string $datasetEndString */
    private $datasetEndString;

    /** @var array $blueprint */
    private $blueprint;

    /** @var PDOStatement $saveStmt */
    private $saveStmt;

    /** @var resource $stream */
    private $stream;

    /** @var string $file */
    private $file;

    /** @var int $playerIndexUID */
    private $playerIndexUID;

    private $isTradeLog;
    //private $isMineDetails = false;

    // TRADE LOG SPECIFIC
    /** @var PlayerIndex $userIndex */
    private $userIndex;
    /** @var int $lastDatasetTimestamp */
    private $lastDatasetTimestamp;
    private $currentlyIteratedUsers = [];

    private $leftovers = '';

    private const FILE_END_STRING = ']';

    public function __construct(string $filePath, string $validator, PDO $pdo = NULL, int $lastDatasetTimestamp = 0) {
        $this->file       = $filePath;
        $this->isTradeLog = $validator === 'TradeLog';
        //$this->isMineDetails = $validator === 'MineDetails';

        if($this->isTradeLog && $pdo !== NULL) {
            $this->userIndex            = new PlayerIndex($pdo);
            $this->lastDatasetTimestamp = $lastDatasetTimestamp;
        }

        $stream = fopen($filePath, 'rb');

        if(is_resource($stream)) {
            $this->stream = $stream;
        }
    }

    final public function setDatasetSize(int $datasetSize): self {
        $this->datasetSize = $datasetSize;
        return $this;
    }

    /**
     * @example ,{"t would signal the end of a dataset of the TradeLog
     * @return JSONParser
     */
    final public function setDatasetEndString(string $datasetEnd): self {
        $this->datasetEndString = $datasetEnd;
        return $this;
    }

    final public function setBlueprint(array $blueprint): self {
        $this->blueprint = $blueprint;
        return $this;
    }

    final public function setFileSize(int $fileSize): self {
        $this->fileSize = $fileSize;
        return $this;
    }

    final public function storeSaveQuery(PDOStatement $saveStmt): self {
        $this->saveStmt = $saveStmt;
        return $this;
    }

    final public function setPlayerIndexUID(int $playerIndexUID): self {
        $this->playerIndexUID = $playerIndexUID;
        return $this;
    }

    final public function parse(): bool {
        if($this->stream === NULL) {
            return false;
        }

        $endString = $this->datasetEndString;

        for($bytes = 1; $bytes <= $this->fileSize; $bytes += $this->datasetSize) {

            $this->reduceLeftovers($endString);

            // get trailing data from previous iteration to have a full new dataset
            $data = $this->leftovers;

            $data .= stream_get_contents($this->stream, $this->datasetSize, $bytes);

            if(($bytes + $this->datasetSize) >= $this->fileSize) {
                $endString = self::FILE_END_STRING;
            }

            // find end of this dataset
            $datasetEnding = (int) strpos($data, $endString);

            // define new leftovers for next iteration, + 1 because of leading comma at the start of dataset
            $this->leftovers = substr($data, $datasetEnding + 1);

            $dataset = substr($data, 0, $datasetEnding);
            $dataset = json_decode($dataset, true);

            if($this->isTradeLog) {
                [$dataset, $escapedUserName] = $this->alterDatasetForTradeLog($dataset);

                if(empty($dataset) || empty($escapedUserName)) {
                    continue;
                }
            }

            $dataset = $this->mergeWithBlueprint($dataset, $escapedUserName ?? '');

            $saveProcess = $this->saveStmt->execute($dataset);

            if(!$saveProcess) {
                return false;
            }
        }

        unlink($this->file);

        return true;
    }

    /**
     * reduce leftovers if it contains more than 1 other datasets
     *
     * @param string $endString
     */
    private function reduceLeftovers(string $endString): void {
        if(substr_count($this->leftovers, $endString) < 1) {
            return;
        }

        while(strpos($this->leftovers, $endString) !== false) {
            $datasetEnding = strpos($this->leftovers, $endString);

            $dataset = substr($this->leftovers, 0, $datasetEnding);
            $dataset = json_decode($dataset, true);

            if($this->isTradeLog) {
                [$dataset, $escapedUserName] = $this->alterDatasetForTradeLog($dataset);

                if(empty($dataset) || empty($escapedUserName)) {
                    $this->leftovers = substr($this->leftovers, $datasetEnding + 1);
                    continue;
                }
            }

            $dataset = $this->mergeWithBlueprint($dataset, $escapedUserName ?? '');

            $this->saveStmt->execute($dataset);

            $this->leftovers = substr($this->leftovers, $datasetEnding + 1);
        }
    }

    private function mergeWithBlueprint(array $dataset, string $userName = ''): array {
        $validDataset = [
            'playerIndexUID' => $this->playerIndexUID,
        ];

        $dataset = $this->applyBlueprintExemptions($dataset);

        if($this->isTradeLog) {
            $validDataset['businessPartner'] = $this->getPlayerID($userName, $dataset['ts']);
        }

        foreach($this->blueprint as $key => $index) {
            $validDataset[$key] = $dataset[$index];
        }

        return $validDataset;
    }

    private function applyBlueprintExemptions(array $dataset): array {
        // $this->validatorIsMineDetails
        if(isset($dataset['HQBoost'])) {
            $dataset['HQBoost'] = $dataset['HQBoost'] > 1 ? 1 : 0;
        }

        // $this->validatorIsTradeLog
        if(isset($dataset['event'])) {
            $dataset['event'] = $dataset['event'] === 'buy' ? 1 : 0;
        }

        return $dataset;
    }

    private function getPlayerID(string $escapedUserName, int $lastSeen = 0): int {
        if(isset($this->currentlyIteratedUsers[$escapedUserName])) {
            return $this->currentlyIteratedUsers[$escapedUserName];
        }

        $userUID = $this->userIndex->getPlayerIDByName($escapedUserName);

        if($userUID === 0) {
            $userUID = $this->userIndex->addPlayer($escapedUserName, $lastSeen);

            $this->currentlyIteratedUsers[$escapedUserName] = $userUID;
            return $userUID;
        }

        $this->userIndex->updateLastSeenTimestampByPlayerID($userUID, $lastSeen);

        $this->currentlyIteratedUsers[$escapedUserName] = $userUID;
        return $userUID;
    }

    private function alterDatasetForTradeLog(array $dataset) {
        $dataset['ts'] = (int) $dataset['ts'];

        // only continue TradLog where we last left off
        if($this->lastDatasetTimestamp >= $dataset['ts']) {
            return [
                [],
                '',
            ];
        }

        return [
            $dataset,
            $this->userIndex->escapeUserName($dataset['username']),
        ];
    }
}
