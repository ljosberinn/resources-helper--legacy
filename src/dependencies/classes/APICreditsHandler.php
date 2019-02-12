<?php

class APICreditsHandler implements APIInterface {

    /*
     * {
     *  "creditsleft": "8106"
     * }
     */

    public function transform(array $data): array {
        return (array) $data[0];
    }
}
