<?php

class MonetaryItemHandler implements APIInterface {


    private $categories = [
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

    public function transform(array $data): bool {
        foreach($data as &$dataset) {
            unset($dataset['itemName']);
        }

        return true;
    }
}
