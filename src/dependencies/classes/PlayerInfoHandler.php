<?php

class PlayerInfoHandler implements APIInterface {

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

    private $unwantedKeys = ['appV', 'abbVRB', 'lvl'];

    public function transform(array $data): bool {
        $data = (array) $data[0];

        $data['level'] = $data['lvl'];

        foreach($this->unwantedKeys as $key) {
            unset($data[$key]);
        }

        return true;
    }
}
