<?php declare(strict_types=1);

class UserWarehouse extends Warehouse {

    public function __construct() {
        parent::__construct();
    }

    public function getUserWarehouses(int $playerIndexUID): array {
        $warehouses          = $this->getWarehouses();
        $lastUpdateTimestamp = 0;

        /*$stmt = $this->pdo->prepare(self::QUERIES['getUserWarehouses']);
        $stmt->execute(['playerIndexUID' => $playerIndexUID]);

        if($stmt->rowCount() === 1) {
            foreach((array) $stmt->fetch() as $column => $value) {
                if($column === 'timestamp' && $lastUpdateTimestamp === 0) {
                    $lastUpdateTimestamp = $value;
                    continue;
                }
            }
        }*/

        return [$warehouses, $lastUpdateTimestamp];
    }
}
