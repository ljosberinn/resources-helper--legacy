<?php declare(strict_types=1);

class Mine {

    private $type;

    private $basePrice;
    private $maxHourlyRate;

    public function __construct(int $type) {
        $this->type = $type;

        $mineTypeName = MineHandler::getNameById($type);
        $mineData     = $this->getMineData($mineTypeName);

        $this->basePrice     = $mineData['basePrice'];
        $this->maxHourlyRate = $mineData['maxHourlyRate'];

    }

    public function getMineData(string $mineTypeName): array {
        /** @noinspection PhpIncludeInspection */
        return require './static/mines/' . $mineTypeName . '.php';
    }
}