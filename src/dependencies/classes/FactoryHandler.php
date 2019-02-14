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

    private $factoryDataBlueprint = [
        'name'     => '',
        'level'    => 0,
        'striking' => 0,
    ];

    private $possiblFactoryIDs = [
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

    public function transform(array $data): bool {

        $factories = [];

        foreach($data as $dataset) {

            [$factoryID, $factory] = $this->extractFactoryData($dataset);

            if($this->isValidFactory($factoryID, $factory)) {
                $factories[$factoryID] = $factory;
            }
        }

        return true;
    }

    private function isValidFactory(int $factoryID, array $factory): bool {
        return in_array($factoryID, $this->possiblFactoryIDs, true) && !empty($factory['name']) && $factory['level'] > 0;
    }

    public function extractFactoryData(array $dataset): array {
        $factoryID = 0;

        $factory = $this->factoryDataBlueprint;

        foreach($dataset as $key => $value) {

            if($key === 'factoryID') {
                $factoryID = (int) $value;
            }

            if($key === 'lvl') {
                $factory['level'] = $value;
            }

            if($key === 'strike') {
                $factory['striking'] = $value === 'yes' ? 1 : 0;
            }
        }
        return [$factoryID, $factory];
    }

}
