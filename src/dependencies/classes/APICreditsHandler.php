<?php

class APICreditsHandler implements APIInterface {

    /*
     * {
     *  "creditsleft": "8106"
     * }
     */

    public function transform(PDO $pdo, array $data, int $playerIndexUID): bool {
        return true;
        #return (array) $data[0];
    }
}
