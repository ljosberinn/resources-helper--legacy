<?php declare(strict_types=1);

class APICore {

    protected $key;
    protected $query;
    protected $isHeavyQuery;
    protected $API_PATH;

    protected const API_MAP = [
        0  => 'APICreditsHandler', // done
        1  => 'FactoryHandler', // done
        2  => 'WarehouseHandler', // done
        3  => 'SpecialBuildingsHandler', // done
        4  => 'HeadquarterHandler', // done
        5  => 'MineDetailsHandler', // done - TODO: local file parsing
        6  => 'TradeLogHandler', // done - TODO: local file parsing
        7  => 'PlayerInfoHandler', // done
        8  => 'MonetaryItemHandler',
        9  => 'CombatLogHandler',
        10 => 'MissionHandler', // done
        51 => 'MineHandler',
    ];

    protected const HEAVY_QUERIES = [
        5,
        6,
    ];

    public function __construct() {
        $this->API_PATH = dirname(__DIR__, 2) . '/data/api';
    }

    final public function queryExists(int $query): bool {
        return isset(self::API_MAP[$query]);
    }

    final public function setKey(string $key): void {
        $this->key = $key;
    }

    final public function setQuery(int $query): void {
        $this->query        = $query;
        $this->isHeavyQuery = $this->isHeavyQuery($query);
    }

    private function hitCache(): array {
        $json = $this->API_PATH . '/cache/' . $this->query . '.json';

        $cachedResponse = (string) file_get_contents($json);
        return json_decode($cachedResponse, true);
    }

    private function isHeavyQuery(int $query): bool {
        return in_array($query, self::HEAVY_QUERIES, true);
    }

    final public function looseCurlAPI(string $uri): array {
        try {
            if($_SERVER['SERVER_NAME'] === 'localhost') {
                return $this->hitCache();
            }

            $curl = curl_init();

            curl_setopt_array($curl, [
                CURLOPT_URL            => $uri,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_SSL_VERIFYPEER => true,
            ]);

            $response = curl_exec($curl);
            curl_close($curl);

            return is_string($response) ? (array) json_decode($response, true) : [];
        } catch(Error $error) {
            return [];
        }
    }

    final protected function curlAPI(): array {
        $uri = $this->buildURI();

        return $this->looseCurlAPI($uri);
    }

    /**
     * "Heavy Queries" are those that return JSONs which cannot be decoded in RAM and are parsed manually.
     * To do so, this method downloads the JSON.
     *
     * @return string
     */
    final protected function handleHeavyQuery(): string {
        $uri = $this->buildURI();

        $fileName = implode('_', [time(), $this->query, $this->key]) . '.json';
        $path     = $this->API_PATH . '/heavyQueries/' . $fileName;

        try {
            $json = fopen($path, 'wb');

            if(!$json) {
                return '';
            }

            $ch = curl_init();

            curl_setopt_array($ch, [
                CURLOPT_URL            => $uri,
                CURLOPT_FILE           => $json,
                CURLOPT_FOLLOWLOCATION => true,
            ]);

            curl_exec($ch);

            if(intval(curl_getinfo($ch, CURLINFO_HTTP_CODE)) !== 200) {
                unlink($path);
            }

            return fclose($json) ? $path : '';
        } catch(Error $error) {
            return '';
        }
    }

    final protected function buildURI(): string {
        return 'https://resources-game.ch/resapi/?l=en&f=1&d=30&q=' . $this->query . '&k=' . $this->key;
    }

    final public function isValidKey(string $key): bool {
        return strlen($key) === 45 && ctype_alnum($key);
    }

    final public function getPlayerNameFromSource(): string {
        $playerInfoData = $this->curlAPI();

        // raw api data is nested one level; also check against potential errors during curlAPI
        return $playerInfoData[0]['username'] ?? '';
    }
}
