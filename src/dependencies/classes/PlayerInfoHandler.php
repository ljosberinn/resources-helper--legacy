<?php

class PlayerInfoHandler extends APICore implements APIInterface {

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

    private const UNWANTED_KEYS = ['appV', 'abbVRB', 'lvl'];

    public function transform(PDO $pdo, array $data, int $playerIndexUID): bool {
        $data = (array) $data[0];

        $data['level'] = $data['lvl'];

        foreach(self::UNWANTED_KEYS as $key) {
            unset($data[$key]);
        }

        return true;
    }

    public function getPlayerNameFromSource(): string {
        $playerInfoData = $this->curlAPI();

        // raw api data is nested one level; also check against potential errors during curlAPI
        return $playerInfoData[0]['username'] ?? '';
    }
}
