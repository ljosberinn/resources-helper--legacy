<?php declare(strict_types=1);

class MonetaryItemHandler implements APIInterface {


    private const CATEGORIES = [
        1  => 'Wares sold',
        2  => 'Wares purchased',
        3  => 'Chat trades inc.',
        5  => 'Scans',
        6  => 'Mine expenses',
        8  => 'Maintenance expenses',
        9  => 'Factory upgrade expenses',
        10 => 'Fabrication expenses',
        13 => 'Premiums',
        16 => 'Contractual penalties',
        19 => 'Chat trades out.',
        21 => 'Transport costs',
    ];

    private $pdo;
    private $playerIndexUID;

    public function __construct(PDO $pdo, int $playerIndexUID) {
        $this->pdo            = $pdo;
        $this->playerIndexUID = $playerIndexUID;
    }

    public function transform(array $data): array {
        foreach($data as &$dataset) {
            #unset($dataset['itemName']);
        }

        return $data;
    }

    public function save(array $data): bool {
        // TODO: Implement save() method.
        return true;
    }
}
