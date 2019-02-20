<?php

class Factory {

    private $level;
    private $scaling;

    private $dependencies;
    private $dependantFactories;

    public function __construct(int $type, int $level = 1) {
        $this->level = $level;

        $factoryName = FactoryHandler::getNameByID($type);
        $factoryData = $this->factoryData($factoryName);

        $this->dependencies       = $factoryData['dependencies'];
        $this->scaling            = $factoryData['scaling'];
        $this->dependantFactories = $factoryData['dependantFactories'];

        $this->scaleToLevel();
    }

    private function factoryData(string $factoryName): array {
        /** @noinspection PhpIncludeInspection */
        return require './static/' . $factoryName . '.php';
    }

    private function scaleToLevel(): void {
        foreach($this->dependencies as $dependency => $amount) {
            $this->dependencies[$dependency] = $amount * $this->level;
        }

        $this->scaling *= $this->level;
    }

    public function getDependencies(): array {
        return $this->dependencies;
    }

}
