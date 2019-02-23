<?php

class PlayerInfoHandler extends APICore implements APIInterface {

    /*
     * {
     *  "username": "Chevron",
     *  "lvl": "283",
     *  "points": "122835945",
     *  "worldrank": "262",
     *  "appV": "1.8.1",
     *  "appVRB": "3381",
     *  "registerdate": "1489409895"
     * }
     */

    private const WANTED_KEYS = [
        'lvl'          => 'playerLevel',
        'points'       => 'points',
        'worldrank'    => 'rank',
        'registerdate' => 'registered',
    ];

    /** @var PDO $pdo */
    private $pdo;

    private $playerIndexUID;

    private const QUERIES = [
        'save' => 'UPDATE `user` SET `playerLevel` = :playerLevel, `points` = :points, `rank` = :rank, `registered` = :registered WHERE `playerIndexUID` = :playerIndexUID',
    ];

    public function __construct(PDO $pdo, int $playerIndexUID) {
        parent::__construct('', 0);
        $this->pdo            = $pdo;
        $this->playerIndexUID = $playerIndexUID;
    }

    public function transform(array $data): bool {
        $relevantData = [
            'level'      => 0,
            'points'     => 0,
            'rank'       => 0,
            'registered' => 0,
        ];

        $data = (array) $data[0];

        foreach(self::WANTED_KEYS as $key => $targetKey) {
            $relevantData[$targetKey] = $data[$key];
        }

        return $this->save($relevantData);
    }

    private function save(array $data): bool {
        $stmt = $this->pdo->prepare(self::QUERIES['save']);
        return $stmt->execute([
            'playerLevel'    => $data['playerLevel'],
            'points'         => $data['points'],
            'rank'           => $data['rank'],
            'registered'     => $data['registered'],
            'playerIndexUID' => $this->playerIndexUID,
        ]);
    }
}
