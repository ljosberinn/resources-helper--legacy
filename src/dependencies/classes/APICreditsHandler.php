<?php

class APICreditsHandler implements APIInterface {

    /*
     * {
     *  "creditsleft": "8106"
     * }
     */

    public function transform(array $data): bool {
        return true;
        #return (array) $data[0];
    }
}
