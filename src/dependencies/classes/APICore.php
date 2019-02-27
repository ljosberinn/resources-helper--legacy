<?php declare(strict_types=1);

class APICore {

    protected $key;
    protected $query;

    protected const API_MAP = [
        0  => 'APICreditsHandler', // done
        1  => 'FactoryHandler', // done
        2  => 'WarehouseHandler', // done
        3  => 'SpecialBuildingsHandler', // done
        4  => 'HeadquarterHandler', // done
        5  => 'MineDetailsHandler',
        6  => 'TradeLogHandler', // done
        7  => 'PlayerInfoHandler', // done
        8  => 'MonetaryItemHandler',
        9  => 'CombatLogHandler',
        10 => 'MissionHandler', // done
        51 => 'MineHandler',
    ];

    public function __construct() {
    }

    public function queryExists(int $query): bool {
        return isset(self::API_MAP[$query]);
    }

    public function setKey(string $key): void {
        $this->key = $key;
    }

    public function setQuery(int $query): void {
        $this->query = $query;
    }

    protected function curlAPI(): array {
        if($_SERVER['SERVER_NAME'] === 'localhost') {
            $cachedResponse = (string) file_get_contents('api-response/' . $this->query . '.json');
            return json_decode($cachedResponse, true);
        }

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

    public function isValidKey(string $key): bool {
        return strlen($key) === 45 && ctype_alnum($key);
    }

    public function getPlayerNameFromSource(): string {
        $playerInfoData = $this->curlAPI();

        // raw api data is nested one level; also check against potential errors during curlAPI
        return $playerInfoData[0]['username'] ?? '';
    }
}
