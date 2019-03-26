<?php declare(strict_types=1);

class JSONParser {

    private $fileSize;
    private $datasetSize;
    private $datasetEndString;
    private $blueprint;
    /** @var PDOStatement $saveStmt */
    private $saveStmt;
    private $stream;
    private $file;
    private $playerIndexUID;

    private $leftovers = '';

    private const FILE_END_STRING = ']';

    public function __construct(string $filePath) {
        $this->file = $filePath;

        $this->stream = file_exists($filePath) ? fopen($filePath, 'rb') : false;
    }

    final public function setDatasetSize(int $datasetSize): self {
        $this->datasetSize = $datasetSize;
        return $this;
    }

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
        if(!$this->stream) {
            return false;
        }

        $endString = $this->datasetEndString;

        for($bytes = 1; $bytes <= $this->fileSize; $bytes += $this->datasetSize) {

            $this->reduceLeftovers($endString);

            // get trailing data from previous iteration to have a full new dataset
            $data = $this->leftovers;

            $data .= stream_get_contents($this->stream, $this->datasetSize, (int) $bytes);

            if($bytes + $this->datasetSize >= $this->fileSize) {
                $endString = self::FILE_END_STRING;
            }

            // find end of this dataset
            $datasetEnding = (int) strpos($data, $endString);

            // define new leftovers for next iteration, + 1 because of leading comma at the start of dataset
            $this->leftovers = substr($data, $datasetEnding + 1);

            $dataset = substr($data, 0, $datasetEnding);
            $dataset = json_decode($dataset, true);

            $dataset = $this->mergeWithBlueprint($dataset);

            $this->saveStmt->execute($dataset);
        }

        unlink($this->file);

        return true;
    }

    /**
     * reduce leftovers if it contains more than 10 other datasets
     *
     * @param string $endString
     */
    private function reduceLeftovers(string $endString): void {
        if(substr_count($this->leftovers, $endString) < 10) {
            return;
        }

        while(strpos($this->leftovers, $endString) !== false) {
            $datasetEnding = strpos($this->leftovers, $endString);

            $dataset = substr($this->leftovers, 0, $datasetEnding);
            $dataset = json_decode($dataset, true);
            $dataset = $this->mergeWithBlueprint($dataset);

            $this->saveStmt->execute($dataset);

            $this->leftovers = substr($this->leftovers, $datasetEnding + 1);
        }
    }

    private function mergeWithBlueprint(array $dataset): array {
        $validDataset = [
            'playerIndexUID' => $this->playerIndexUID,
        ];

        $dataset = $this->applyBlueprintExemptions($dataset);

        foreach($this->blueprint as $key => $index) {
            $validDataset[$key] = $dataset[$index];
        }

        return $validDataset;
    }

    private function applyBlueprintExemptions(array $dataset): array {
        if(isset($dataset['HQBoost'])) {
            $dataset['HQBoost'] = $dataset['HQBoost'] > 1 ? 1 : 0;
        }

        return $dataset;
    }
}
