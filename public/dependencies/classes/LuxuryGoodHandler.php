<?php declare(strict_types=1);

class LuxuryGoodHandler {

    private $pdo;
    private $playerIndexUID;

    private const QUERIES = [
        'getKnownLuxuryGoods'      => 'SELECT `luxuryGoodID` FROM `luxuryGoods` ORDER BY `luxuryGoodID` ASC',
        'addNewLuxuryGood'         => 'INSERT INTO `luxuryGoods` (`luxuryGoodID`, `name`, `requirement`) VALUES(:luxuryGoodID, :name, :requirement)',
        'addLuxuryGoodOwner'       => 'INSERT INTO `luxuryGoodOwner` (`playerIndexUID`, `luxuryGoodID`, `amount`) VALUES(:playerIndexUID, :luxuryGoodID, :amount)',
        'deleteOldLuxuryGoodOwner' => 'DELETE FROM `luxuryGoodOwner` WHERE `playerIndexUID` = :playerIndexUID AND `luxuryGoodID` = :luxuryGoodID',
    ];

    public function __construct(PDO $pdo, int $playerIndexUID) {
        $this->pdo            = $pdo;
        $this->playerIndexUID = $playerIndexUID;
    }

    public function deleteOldLuxuryGoodOwner(int $luxuryGoodID): bool {
        $stmt = $this->pdo->prepare(self::QUERIES['deleteOldLuxuryGoodOwner']);
        return $stmt->execute([
            'playerIndexUID' => $this->playerIndexUID,
            'luxuryGoodID'   => $luxuryGoodID,
        ]);
    }

    public function addNewLuxuryGood(array $dataset): void {
        $stmt = $this->pdo->prepare(self::QUERIES['addNewLuxuryGood']);
        $stmt->execute([
            'luxuryGoodID' => $dataset['itemID'],
            'name'         => $dataset['itemname'],
            'requirement'  => 0,
        ]);
    }

    public function addLuxuryGoodOwner(array $dataset): void {
        if(!$this->deleteOldLuxuryGoodOwner($dataset['itemID'])) {
            return;
        }

        $stmt = $this->pdo->prepare(self::QUERIES['addLuxuryGoodOwner']);
        $stmt->execute([
            'playerIndexUID' => $this->playerIndexUID,
            'luxuryGoodID'   => $dataset['itemID'],
            'amount'         => $dataset['amount'],
        ]);
    }

    public function getKnownLuxuryGoods(): array {
        $luxuryGoods = [];

        $stmt = $this->pdo->query(self::QUERIES['getKnownLuxuryGoods']);

        if(!$stmt) {
            return $luxuryGoods;
        }

        $knownLuxuryGoods = $stmt->fetchAll();

        if(!$knownLuxuryGoods) {
            return $luxuryGoods;
        }

        foreach($knownLuxuryGoods as $knownLuxuryGood) {
            $luxuryGoods[] = $knownLuxuryGood['luxuryGoodID'];
        }

        return $luxuryGoods;
    }
}