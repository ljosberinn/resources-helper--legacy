<?php declare(strict_types=1);

class UserMines extends Mines {

    public function __construct() {
        parent::__construct();
    }

    public function getUserMines(int $playerIndexUID): array {
        $mines               = $this->get();
        $lastUpdateTimestamp = 0;

        $stmt = $this->pdo->prepare(self::QUERIES['getUserMines']);
        $stmt->execute(['playerIndexUID' => $playerIndexUID]);

        if($stmt->rowCount() > 0) {

            $map = [
                'amount',
                'sumTechRate',
                'sumRawRate',
                'sumDef1',
                'sumDef2',
                'sumDef3',
                'sumAttacks',
                'sumAttacksLost',
                'avgTechFactor',
                'avgHQBoost',
                'avgQuality',
                'avgTechedQuality',
                'avgPenalty',
            ];

            foreach((array) $stmt->fetchAll() as $dataset) {
                $lastUpdateTimestamp = $lastUpdateTimestamp > 0 ? $lastUpdateTimestamp : $dataset['timestamp'];

                $resourceID = $dataset['resourceID'];
                $index      = -1;

                foreach($mines as $key => $mine) {
                    if($mine['resourceID'] === $resourceID) {
                        $index = $key;
                        break;
                    }
                }

                foreach($map as $key) {
                    $mines[$index][$key] = $dataset[$key];
                }
            }
        }

        return [$mines, $lastUpdateTimestamp];
    }
}
