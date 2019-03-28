<?php declare(strict_types=1);

class MarketPrices extends APICore {

    private const MARKET_PRICE_URI = 'https://www.resources-game.ch/exchange/kurseliste_json.txt';

    private const QUERIES = [
        'save' => 'INSERT INTO `marketPrices` (`timestamp`, `player_57`, `ai_57`, `player_115`, `ai_115`, `player_70`, `ai_70`, `player_74`, `ai_74`, `player_32`, `ai_32`, `player_93`, `ai_93`, `player_12`, `ai_12`, `player_7`, `ai_7`, `player_120`, `ai_120`, `player_22`, `ai_22`, `player_13`, `ai_13`, `player_66`, `ai_66`, `player_78`, `ai_78`, `player_99`, `ai_99`, `player_38`, `ai_38`, `player_41`, `ai_41`, `player_103`, `ai_103`, `player_60`, `ai_60`, `player_79`, `ai_79`, `player_14`, `ai_14`, `player_49`, `ai_49`, `player_28`, `ai_28`, `player_20`, `ai_20`, `player_102`, `ai_102`, `player_3`, `ai_3`, `player_8`, `ai_8`, `player_58`, `ai_58`, `player_77`, `ai_77`, `player_36`, `ai_36`, `player_26`, `ai_26`, `player_55`, `ai_55`, `player_124`, `ai_124`, `player_2`, `ai_2`, `player_92`, `ai_92`, `player_90`, `ai_90`, `player_75`, `ai_75`, `player_104`, `ai_104`, `player_53`, `ai_53`, `player_42`, `ai_42`, `player_81`, `ai_81`, `player_10`, `ai_10`, `player_40`, `ai_40`, `player_117`, `ai_117`, `player_84`, `ai_84`, `player_35`, `ai_35`, `player_15`, `ai_15`, `player_67`, `ai_67`, `player_30`, `ai_30`, `player_44`, `ai_44`, `player_45`, `ai_45`, `player_46`, `ai_46`, `player_48`, `ai_48`, `player_51`, `ai_51`, `player_96`, `ai_96`, `player_98`, `ai_98`, `player_87`, `ai_87`, `player_43`, `ai_43`, `player_24`, `ai_24`) VALUES(:timestamp, :player_57, :ai_57, :player_115, :ai_115, :player_70, :ai_70, :player_74, :ai_74, :player_32, :ai_32, :player_93, :ai_93, :player_12, :ai_12, :player_7, :ai_7, :player_120, :ai_120, :player_22, :ai_22, :player_13, :ai_13, :player_66, :ai_66, :player_78, :ai_78, :player_99, :ai_99, :player_38, :ai_38, :player_41, :ai_41, :player_103, :ai_103, :player_60, :ai_60, :player_79, :ai_79, :player_14, :ai_14, :player_49, :ai_49, :player_28, :ai_28, :player_20, :ai_20, :player_102, :ai_102, :player_3, :ai_3, :player_8, :ai_8, :player_58, :ai_58, :player_77, :ai_77, :player_36, :ai_36, :player_26, :ai_26, :player_55, :ai_55, :player_124, :ai_124, :player_2, :ai_2, :player_92, :ai_92, :player_90, :ai_90, :player_75, :ai_75, :player_104, :ai_104, :player_53, :ai_53, :player_42, :ai_42, :player_81, :ai_81, :player_10, :ai_10, :player_40, :ai_40, :player_117, :ai_117, :player_84, :ai_84, :player_35, :ai_35, :player_15, :ai_15, :player_67, :ai_67, :player_30, :ai_30, :player_44, :ai_44, :player_45, :ai_45, :player_46, :ai_46, :player_48, :ai_48, :player_51, :ai_51, :player_96, :ai_96, :player_98, :ai_98, :player_87, :ai_87, :player_43, :ai_43, :player_24, :ai_24)',
    ];

    /** @var PDO $pdo */
    private $pdo;

    public function __construct() {
        parent::__construct();

        $db        = DB::getInstance();
        $this->pdo = $db->getConnection();
    }

    public function getPrices(): array {
        return $this->looseCurlAPI(self::MARKET_PRICE_URI);
    }

    public function transformPrices(array $prices): array {
        $response = [
            'timestamp' => $prices[0]['TS'],
        ];

        foreach($prices as $price) {
            $response['player_' . $price['ITEM_ID']] = $price['SMKURS'];
            $response['ai_' . $price['ITEM_ID']]     = $price['NORMKURS'];
        }

        return $response;
    }

    public function save(array $prices): bool {
        if(empty($prices)) {
            return false;
        }

        $stmt = $this->pdo->prepare(self::QUERIES['save']);

        return $stmt->execute($prices);
    }
}
