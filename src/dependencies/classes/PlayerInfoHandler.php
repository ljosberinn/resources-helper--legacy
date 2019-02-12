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

    private static $unwantedKeys = ['appV', 'abbVRB', 'lvl'];

    public function transform(array $data): array {
        $data = (array) $data[0];

        $data['level'] = $data['lvl'];

        foreach(self::$unwantedKeys as $key) {
            unset($data[$key]);
        }

        return $data;
    }
}
