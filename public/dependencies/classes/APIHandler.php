<?php declare(strict_types=1);

class APIHandler extends APICore {

    private $response = [
        'success' => false,
        'actor'   => 0,
    ];

    private const QUERIES = [
        'updateLastSeenTimestamp' => 'UPDATE `user` SET `lastSeen` = :lastSeen WHERE `playerIndexUID` = :playerIndexUID',
    ];

    /** @var PDO $pdo */
    private $pdo;

    public function __construct() {
        parent::__construct();
    }

    private function getDBInstance(): bool {
        $db        = DB::getInstance();
        $this->pdo = $db->getConnection();

        return $this->pdo instanceof PDO;
    }

    public function handleQuery(): array {
        if(!$this->getDBInstance()) {
            $response['error'] = 'internal error';
            return $this->response;
        }

        $this->response['actor'] = $this->setActor();

        if($this->response['actor'] === 0) {
            $response['error'] = 'invalid name';
            return $this->response;
        }

        $data = $this->isHeavyQuery ? $this->handleHeavyQuery() : $this->curlAPI();

        if(empty($data)) {
            $response['error'] = 'API failure';
            return $this->response;
        }

        $className = self::API_MAP[$this->query];
        $class     = new $className($this->pdo, $this->response['actor']);

        if(!$this->isHeavyQuery) {
            /** @var APICreditsHandler|FactoryHandler|WarehouseHandler|SpecialBuildingsHandler|HeadquarterHandler|TradeLogHandler|PlayerInfoHandler|MonetaryItemHandler|CombatLogHandler|MissionHandler|MineHandler $class */
            $data = $class->transform($data);
        } else {
            /** @var MineDetailsHandler $class */
        }

        $this->response['success'] = $class->save($data) && $this->updateLastSeenTimestamp();

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
