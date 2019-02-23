<?php

class Mine {

    private $type;

    public function __construct(int $type) {
        $this->type = $type;

        $mineTypeName = MineHandler::getNameById($type);
        $mineData     = $this->getMineData($mineTypeName);

    }

    public function getMineData(string $mineTypeName): array {
        /** @noinspection PhpIncludeInspection */
        return require './static/mines/' . $mineTypeName . '.php';
    }
}
