<?php

class MissionHandler implements APIInterface {

    /*
     * {
     *  "questID": "9",
     *  "title": "Bob The Builder",
     *  "descr": "Build [%1] mines",
     *  "status": "0",
     *  "progress": "0",
     *  "missiongoal": "50",
     *  "durHours": "96",
     *  "rewarditem": "48",
     *  "rewardamount": "145",
     *  "penalty": "361694000000",
     *  "cooldown": "0",
     *  "starttime": "0",
     *  "endtime": "0",
     *  "intervalDays": "7",
     *  "thumb": "https:\/\/appweb.resources-game.ch\/webcontent\/img\/questimg\/schauwieschoenichbau.jpg"
     * }
     */

    private static $unwantedKeys = ['title', 'descr', 'durHours', 'rewarditem', 'intervalDays', 'thumb'];

    public function transform(array $data): array {

        foreach($data as &$dataset) {
            foreach(self::$unwantedKeys as $key) {
                unset($dataset[$key]);
            }
        }

        return $data;
    }
}
