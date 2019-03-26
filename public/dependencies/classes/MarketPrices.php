<?php declare(strict_types=1);

class MarketPrices extends APICore {

    private const MARKET_PRICE_URI = 'https://resources-game.ch/resapi/?q=1006&f=1&k=%API_KEY%&l=en';

    private $actualURL = '';

    public function __construct() {
        parent::__construct();
        $this->setKey((string) getenv('API_KEY'));
        $this->setQuery(1006);

        $this->actualURL = str_replace('%API_KEY%', $this->key, self::MARKET_PRICE_URI);
    }

    public function getPrices(): array {
        return $this->looseCurlAPI($this->actualURL);
    }
}
