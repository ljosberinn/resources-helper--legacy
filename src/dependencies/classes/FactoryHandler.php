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

    private static $possibleFactories = [
        6   => 'ConcreteFactory',
        23  => 'FertilizerFactory',
        25  => 'BricksFactory',
        29  => 'InsecticidesFactory',
        31  => 'SteelFactory',
        33  => 'AluminiumFactory',
        34  => 'SilverFactory',
        37  => 'CopperFactory',
        39  => 'FossilFuelFactory',
        52  => 'TitaniumFactory',
        61  => 'GlassFactory',
        63  => 'PlasticsFactory',
        68  => 'SiliconFactory',
        69  => 'ElectronicsFactory',
        76  => 'MedicalTechnologyFactory',
        80  => 'GoldFactory',
        85  => 'JewelleryFactory',
        91  => 'LithiumFactory',
        95  => 'BatteriesFactory',
        101 => 'ArmsFactory',
        118 => 'ScanDrones',
        125 => 'TrucksFactory',
    ];

    public function transform(PDO $pdo, array $data, int $playerIndexUID): bool {

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
        return array_key_exists($factoryID, self::$possibleFactories) && !empty($factory['name']) && $factory['level'] > 0;
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

    public static function getNameByID(int $factoryID): string {
        return self::$possibleFactories[$factoryID];
    }

}
