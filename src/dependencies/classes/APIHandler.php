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

    public function __construct(string $key, int $query) {
        parent::__construct($key, $query);

        $db        = DB::getInstance();
        $this->pdo = $db->getConnection();

        echo $this->handleQuery();
    }

    private function handleQuery(): string {
        $this->response['actor'] = $this->setActor();

        if($this->response['actor'] === 0 || !$this->isValidKey() || !$this->queryExists()) {
            return $this->respond();
        }

        $data = $this->curlAPI();

        if(empty($data)) {
            return $this->respond();
        }

        $className = self::API_MAP[$this->query];
        /** @var APICreditsHandler|FactoryHandler|WarehouseHandler|SpecialBuildingsHandler|HeadquarterHandler|MineDetailsHandler|TradeLogHandler|PlayerInfoHandler|MonetaryItemHandler|CombatLogHandler|MissionHandler|MineHandler $class */
        $class = new $className($this->pdo, $this->response['actor']);

        $this->response['success'] = $class->transform($data) && $this->updateLastSeenTimestamp();

        return $this->respond();
    }

    private function setActor(): int {
        $user = new User($this->pdo, $this->key);

        return $user->exists() ? $user->get() : $user->add();
    }

    private function respond(): string {
        return (string) json_encode($this->response, JSON_NUMERIC_CHECK);
    }

    private function updateLastSeenTimestamp(): bool {
        $stmt = $this->pdo->prepare(self::QUERIES['updateLastSeenTimestamp']);
        return $stmt->execute([
            'lastSeen'       => time(),
            'playerIndexUID' => $this->response['actor'],
        ]);
    }
}
