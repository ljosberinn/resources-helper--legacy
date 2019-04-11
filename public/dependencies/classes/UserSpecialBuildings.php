<?php declare(strict_types=1);

class UserSpecialBuildings extends SpecialBuildings {

    public function __construct() {
        parent::__construct();
    }

    public function getUserSpecialBuildings(int $playerIndexUID): array {
        $specialBuildings    = $this->get();
        $lastUpdateTimestamp = 0;

        $stmt = $this->pdo->prepare(self::QUERIES['getUserSpecialBuildings']);
        $stmt->execute(['playerIndexUID' => $playerIndexUID]);

        if($stmt->rowCount() > 0) {
            foreach((array) $stmt->fetchAll() as $column => $value) {
                if($column === 'timestamp') {
                    $lastUpdateTimestamp = $value;
                    continue;
                }

                $specialBuildings[$column]['level'] = $value;
            }
        }

        return [$specialBuildings, $lastUpdateTimestamp];
    }
}
