<?php

class MineDetailsHandler implements APIInterface {

    /*
     * {
     *  "mineID": "4",
     *  "lat": "12.345678",
     *  "lon": "12.345678",
     *  "HQboost": "1",
     *  "fullrate": "7556.4",
     *  "rawrate": "1506.0",
     *  "techfactor": "5.0175",
     *  "name": "Clay pit",
     *  "builddate": "1489420594",
     *  "lastmaintenance": "1549732399",
     *  "condition": "0.950917",
     *  "resourceName": "Clay",
     *  "resourceID": "2",
     *  "lastenemyaction": "1500659890",
     *  "def1": "200",
     *  "def2": "5",
     *  "def3": "2",
     *  "attackpenalty": "1",
     *  "attackcount": "1",
     *  "attacklost": "1",
     *  "quality": "0.9843",
     *  "qualityInclTU": "4.9388"
     * }
     */

    public function transform(array $data): bool {

        foreach($data as $dataset) {
            $dataset = [
                'type'  => $dataset['resourceID'],
                'lat'   => $dataset['lat'],
                'lon'   => $dataset['lon'],
                'built' => $dataset['builddate'],

                'quality'     => $dataset['quality'],
                'techQuality' => $dataset['qualityInclTU'],
                'techRate'    => $dataset['fullrate'],
                'rawRate'     => $dataset['rawrate'],
                'techFactor'  => $dataset['techfactor'],

                'def1'          => $dataset['def1'],
                'def2'          => $dataset['def2'],
                'def3'          => $dataset['def3'],
                'attackPenalty' => $dataset['attackpenalty'],
                'attacks'       => $dataset['attackcount'],
                'attacksLost'   => $dataset['attacklost'],
            ];
        }

        return true;
    }
}
