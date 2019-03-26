<?php declare(strict_types=1);

class MissionHandler implements APIInterface {

    /*
     * {
     *  "questID": "9",
     *  "title": "Bob The Builder",
     *  "descr": "Build [%1] mines",
     *  "status": "0",
     *  "progress": "0",
     *  "missiongoal": "50",
     *  "durHours": "96",
     *  "rewarditem": "48",
     *  "rewardamount": "145",
     *  "penalty": "361694000000",
     *  "cooldown": "0",
     *  "starttime": "0",
     *  "endtime": "0",
     *  "intervalDays": "7",
     *  "thumb": "https:\/\/appweb.resources-game.ch\/webcontent\/img\/questimg\/schauwieschoenichbau.jpg"
     * }
     */

    private $pdo;
    private $playerIndexUID;

    private const QUERIES = [
        'deleteOldData' => 'DELETE FROM `missions` WHERE `playerIndexUID` = :playerIndexUID',
    ];

    public function __construct(PDO $pdo, int $playerIndexUID) {
        $this->pdo            = $pdo;
        $this->playerIndexUID = $playerIndexUID;
    }

    public function transform(array $data): array {
        $result = [];

        foreach($data as $dataset) {
            $result[] = [
                $dataset['questID'], // missionID
                $dataset['status'], // status
                $dataset['progress'], // progress
                $dataset['missiongoal'], // goal
                $dataset['rewardamount'], // rewardAmount
                $dataset['penalty'], // penalty
                $dataset['cooldown'], // cooldown
                $dataset['starttime'], // startTimestamp
                $dataset['endtime'], // endTimestamp
            ];
        }

        return $result;
    }

    private function deleteOldData(): bool {
        $stmt = $this->pdo->prepare(self::QUERIES['deleteOldData']);
        return $stmt->execute(['playerIndexUID' => $this->playerIndexUID]);
    }

    public function save(array $data): bool {
        if(!$this->deleteOldData()) {
            return false;
        }

        $now = time();

        $query = 'INSERT INTO `missions` (`playerIndexUID`, `timestamp`, `missionID`, `status`, `progress`, `goal`, `rewardAmount`, `penalty`, `cooldown`, `startTimestamp`, `endTimestamp`) VALUES ';

        foreach($data as $dataset) {
            $query .= '(' . $this->playerIndexUID . ', ' . $now . ', ' . implode(', ', $dataset) . '), ';
        }

        $query = substr($query, 0, -2);

        if($this->pdo->query($query)) {
            return true;
        }

        return false;
    }
}