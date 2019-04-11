<?php declare(strict_types=1);

class UserFactories extends Factories {

    /* these factories rely exclusively on mines */
    private const PRIMARY_ORDER = [
        6,  // Concrete factory, product ID = 7
        23, // Fertilizer factory, product ID = 22
        25, // Brick factory, product ID = 24
        31, // Ironworks, product ID = 30
        33, // Aluminium factory, product ID = 32
        34, // Silver refinery, product ID = 35
        37, // Copper refinery, product ID = 36
        39, // Oil refinery, product ID = 38
        52, // Titanium refinery, product ID = 51
        63, // Plastic factory, product ID = 58
        80, // Gold refinery, product ID = 79
        91, // Lithium refinery, product ID = 92
    ];

    /* these factories rely both on mines and products */
    private const SECONDARY_ORDER = [
        29, // Insecticide factory, product ID = 28
        61, // Glacier's workshop, product ID = 60
        68, // Silicon refinery, product ID = 67
        69, // Electronics factory, product ID = 66
        85, // Goldsmith, product ID = 84
    ];

    /* these factories rely exclusively on products of other factories */
    private const TERTIARY_ORDER = [
        76,  // Medical technology Inc., product ID = 75
        95,  // Battery factory, product ID = 93
        101, // Arms factory, product ID = 87
        118, // Drone shipyard, product ID = 117
        125  // Trucks, product ID = 124
    ];

    public function __construct() {
        parent::__construct();
    }

    public function getUserFactories(int $playerIndexUID, array $mines): array {
        $factories           = $this->get();
        $lastUpdateTimestamp = 0;

        $stmt = $this->pdo->prepare(self::QUERIES['getUserFactories']);
        $stmt->execute(['playerIndexUID' => $playerIndexUID]);

        if($stmt->rowCount() === 1) {
            $userFactories = $stmt->fetch();

            foreach($userFactories as $column => $value) {
                if($column === 'timestamp') {
                    $lastUpdateTimestamp = $value;
                    continue;
                }

                $index = $this->findFactoryByKey($factories, $column, 'id');

                $factories[$index]['level'] = $value;
            }

            $factories = $this->scaleRequirementsToLevel($factories, $this->flattenMines($mines));
        }

        return [$factories, $lastUpdateTimestamp];
    }

    private function flattenMines(array $mines): array {
        $flattenedMines = [];

        foreach($mines as $mine) {
            $flattenedMines[$mine['resourceID']] = $mine['sumTechRate'];
        }

        return $flattenedMines;
    }

    private function scaleRequirementsToLevel(array $factories, array $mines): array {
        $mineUIDS = array_keys($mines);

        $calculationOrder = array_merge(self::PRIMARY_ORDER, self::SECONDARY_ORDER, self::TERTIARY_ORDER);

        foreach($calculationOrder as $factoryID) {
            $index = $this->findFactoryByKey($factories, $factoryID, 'id');

            $factory = $factories[$index];

            if($factory['level'] === 1) {
                continue;
            }

            foreach($factory['productionRequirements'] as &$requirement) {
                $requirement['currentRequiredAmount'] = $requirement['amountPerLevel'] * $factory['level'];

                if($requirement['id'] === 1) {
                    continue;
                }

                // requirement is a mine
                if(in_array($requirement['id'], $mineUIDS, true)) {
                    $requirement['currentGivenAmount'] = $mines[$requirement['id']];
                    continue;
                }

                // requirement is another factories product
                $otherFactoryIndex                 = $this->findFactoryByKey($factories, $requirement['id'], 'productID');
                $requirement['currentGivenAmount'] = $factories[$otherFactoryIndex]['level'] * $factories[$otherFactoryIndex]['scaling'];
            }

            unset($requirement);

            $factories[$index] = $factory;
        }

        return $factories;
    }
}
