<?php

class APIHandler {

    private static $apiMap = [
        0  => 'APICreditsHandler',
        1  => 'FactoryHandler',
        2  => 'WarehouseHandler',
        3  => 'SpecialBuildingsHandler',
        4  => 'HeadquarterHandler',
        5  => 'MineDetailsHandler',
        6  => 'TradeLogHandler',
        7  => 'PlayerInfoHandler',
        8  => 'MonetaryItemHandler',
        9  => 'CombatLogHandler',
        10 => 'MissionHandler',
        51 => 'MineHandler',
    ];

    private $key;
    private $query;

    public function __construct(string $key, int $query) {

        $this->key   = $key;
        $this->query = $query;

        $response = [
            'success' => false,
            'data'    => [],
        ];

        if(isset(self::$apiMap[$query]) && $this->isValidKey()) {
            $data = $this->curlAPI();

            $className = self::$apiMap[$query];
            /** @var APICreditsHandler|FactoryHandler|WarehouseHandler|SpecialBuildingsHandler|HeadquarterHandler|MineDetailsHandler|TradeLogHandler|PlayerInfoHandler|MonetaryItemHandler|CombatLogHandler|MissionHandler|MineHandler $class */
            $class = new $className();

            $response['data']    = $class->transform($data);
            $response['success'] = true;
        }

        echo json_encode($response, JSON_NUMERIC_CHECK);
    }

    private function isValidKey(): bool {
        return strlen($this->key) === 45 && ctype_alnum($this->key);
    }

    private function curlAPI(): array {
        $uri = $this->buildURI();

        try {
            $curl = curl_init();

            curl_setopt_array($curl, [
                CURLOPT_URL            => $uri,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_SSL_VERIFYPEER => true,
            ]);

            $response = curl_exec($curl);
            curl_close($curl);

            if(is_string($response)) {
                return (array) json_decode($response, true);
            }

        } catch(Error $error) {
            return [];
        }

        return [];
    }

    private function buildURI(): string {
        return 'https://resources-game.ch/resapi/?l=en&f=1&q=' . $this->query . '&k=' . $this->key;
    }

}
