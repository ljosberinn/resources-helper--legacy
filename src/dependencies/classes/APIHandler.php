<?php declare(strict_types=1);

class APIHandler extends APICore {

    private $response = [
        'success' => false,
        'actor'   => 0,
    ];

    private const QUERIES = [
        'updateLastSeenTimestamp' => 'UPDATE `user` SET `lastSeen` = :lastSeen WHERE `playerIndexUID` = :playerIndexUID',
    ];

    /** @var PDO */
    private $pdo;

    public function __construct() {
        parent::__construct();
    }

    public function handleQuery(): array {
        $db        = DB::getInstance();
        $this->pdo = $db->getConnection();

        $this->response['actor'] = $this->setActor();

        if($this->response['actor'] === 0) {
            return $this->response;
        }

        $data = $this->curlAPI();

        if(empty($data)) {
            return $this->response;
        }

        $className = self::API_MAP[$this->query];
        /** @var APICreditsHandler|FactoryHandler|WarehouseHandler|SpecialBuildingsHandler|HeadquarterHandler|MineDetailsHandler|TradeLogHandler|PlayerInfoHandler|MonetaryItemHandler|CombatLogHandler|MissionHandler|MineHandler $class */
        $class = new $className($this->pdo, $this->response['actor']);

        $this->response['success'] = $class->save($class->transform($data)) && $this->updateLastSeenTimestamp();

        return $this->response;
    }

    private function setActor(): int {
        $user = new User($this->pdo, $this->key);

        return $user->exists() ? $user->get() : $user->add();
    }

    private function updateLastSeenTimestamp(): bool {
        $stmt = $this->pdo->prepare(self::QUERIES['updateLastSeenTimestamp']);
        return $stmt->execute([
            'lastSeen'       => time(),
            'playerIndexUID' => $this->response['actor'],
        ]);
    }
}
