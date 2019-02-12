<?php

class SpecialBuildingsHandler implements APIInterface {

    /*
     * {
     *  "specbID": "126",
     *  "name": "Fire Station",
     *  "lvl": "10"
     * }
     */

    private static $validSpecialBuildingIDs = [62, 65, 116, 97, 72, 59, 119, 121, 71, 86, 122, 123, 127, 126];

    public function transform(array $data): array {
        $response = [];

        foreach($data as $dataset) {
            if(self::isValidSpecialBuilding($dataset['specbID'])) {
                $response[$dataset['specbID']] = $dataset['lvl'];
            }
        }

        return $response;
    }

    private static function isValidSpecialBuilding(int $specbID): bool {
        return in_array($specbID, self::$validSpecialBuildingIDs, true);
    }

}
