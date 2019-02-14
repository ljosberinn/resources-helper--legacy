<?php

class SpecialBuildingsHandler implements APIInterface {

    /*
     * {
     *  "specbID": "126",
     *  "name": "Fire Station",
     *  "lvl": "10"
     * }
     */

    private $validSpecialBuildingIDs = [62, 65, 116, 97, 72, 59, 119, 121, 71, 86, 122, 123, 127, 126];

    public function transform(PDO $pdo, array $data, int $playerIndexUID): bool {
        $specialBuildings = [];

        foreach($data as $dataset) {
            if($this->isValidSpecialBuilding($dataset['specbID'])) {
                $specialBuildings[$dataset['specbID']] = $dataset['lvl'];
            }
        }

        return true;
    }

    private function isValidSpecialBuilding(int $specbID): bool {
        return in_array($specbID, $this->validSpecialBuildingIDs, true);
    }

}
