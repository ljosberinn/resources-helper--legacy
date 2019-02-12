<?php

class FactoryHandler implements APIInterface {

    /*
     * {
     *  "itemID": "117",
     *  "itemname": "Scan drones",
     *  "level": "4",
     *  "amount": "346"
     * }
     */

    private static $factoryDataBlueprint = [
        'name'     => '',
        'level'    => 0,
        'striking' => 0,
    ];

    private static $possiblFactoryIDs = [
        6,
        23,
        25,
        29,
        31,
        33,
        34,
        37,
        39,
        52,
        61,
        63,
        68,
        69,
        76,
        80,
        85,
        91,
        95,
        101,
        118,
        125,
    ];

    public function transform(array $data): array {

        $response = [];

        foreach($data as $dataset) {

            [$factoryID, $factory] = $this->extractFactoryData($dataset);

            if(self::isValidFactory($factoryID, $factory)) {
                $response[$factoryID] = $factory;
            }
        }

        return $response;
    }

    private static function isValidFactory(int $factoryID, array $factory): bool {
        return in_array($factoryID, self::$possiblFactoryIDs, true) && !empty($factory['name']) && $factory['lvl'] > 0;
    }

    public function extractFactoryData(array $dataset): array {
        $factoryID = 0;

        $factory = self::$factoryDataBlueprint;

        foreach($dataset as $key => $value) {

            if($key === 'factoryID') {
                $factoryID = $value;
            }

            if($key === 'lvl') {
                $factory['level'] = $value;
            }

            if($key === 'strike') {
                $factory[$key] = $value === 'yes' ? 1 : 0;
            }
        }
        return [$factoryID, $factory];
    }

}
