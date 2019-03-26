<?php declare(strict_types=1);

class SpecialBuilding {

    private $type;
    private $level;
    private $dependencies;

    public function __construct(int $type, int $level = 1) {
        $this->type  = $type;
        $this->level = $level;

        $specialBuildingName = SpecialBuildingsHandler::getNameById($type);
        $specialBuildingData = $this->getSpecialBuildingData($specialBuildingName);

        $this->dependencies = $specialBuildingData['dependencies'];

        $this->scaleToLevel();
    }

    private function getSpecialBuildingData(string $specialBuildingName): array {
        /** @noinspection PhpIncludeInspection */
        return require './static/specialBuildings/' . $specialBuildingName . '.php';
    }

    private function scaleToLevel(): void {
        foreach($this->dependencies as $dependency => $amount) {
            $this->dependencies[$dependency] = $amount * $this->level;
        }
    }

    public function getDependencies(): array {
        return $this->dependencies;
    }
}