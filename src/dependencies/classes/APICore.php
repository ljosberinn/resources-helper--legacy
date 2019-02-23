<?php

class APICore {

    protected $key;
    protected $query;

    protected const API_MAP = [
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

    public function __construct(string $key, int $query) {
        $this->key   = $key;
        $this->query = $query;
    }

    protected function queryExists(): bool {
        return isset(self::API_MAP[$this->query]);
    }

    protected function curlAPI(): array {
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

    protected function buildURI(): string {
        return 'https://resources-game.ch/resapi/?l=en&f=1&d=30&q=' . $this->query . '&k=' . $this->key;
    }

    protected function isValidKey(): bool {
        return strlen($this->key) === 45 && ctype_alnum($this->key);
    }

    public function getPlayerNameFromSource(): string {
        $playerInfoData = $this->curlAPI();

        // raw api data is nested one level; also check against potential errors during curlAPI
        return $playerInfoData[0]['username'] ?? '';
    }
}
