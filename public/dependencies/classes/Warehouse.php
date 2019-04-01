<?php declare(strict_types=1);

class Warehouse {

    /** @var PDO $pdo */
    private $pdo;

    private const QUERIES = [
        'getWarehouses'     => '',
        'getUserWarehouses' => 'SELECT * FROM `warehouseLevels` RIGHT JOIN `warehouseStandings` ON `warehouseLevels`.`playerIndexUID` = `warehouseStandings`.`playerIndexUID` WHERE `warehouseStandings`.`playerIndexUID` = :playerIndexUID',
    ];

    public function __construct() {
        $db        = DB::getInstance();
        $this->pdo = $db->getConnection();
    }

    public function getWarehouses(): array {
        /*$stmt = $this->pdo->query(self::QUERIES['getWarehouses']);

        if($stmt && $stmt->rowCount() > 0) {
            foreach((array) $stmt->fetchAll() as $dataset) {

            }
        }*/

        return [];
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
