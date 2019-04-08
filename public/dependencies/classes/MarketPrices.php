<?php declare(strict_types=1);

class MarketPrices extends APICore {

    private const MARKET_PRICE_URI = 'https://www.resources-game.ch/exchange/kurseliste_json.txt';

    private const QUERIES = [
        'save'                   => 'INSERT INTO `marketPrices` (`timestamp`, `player_57`, `ai_57`, `player_115`, `ai_115`, `player_70`, `ai_70`, `player_74`, `ai_74`, `player_32`, `ai_32`, `player_93`, `ai_93`, `player_12`, `ai_12`, `player_7`, `ai_7`, `player_120`, `ai_120`, `player_22`, `ai_22`, `player_13`, `ai_13`, `player_66`, `ai_66`, `player_78`, `ai_78`, `player_99`, `ai_99`, `player_38`, `ai_38`, `player_41`, `ai_41`, `player_103`, `ai_103`, `player_60`, `ai_60`, `player_79`, `ai_79`, `player_14`, `ai_14`, `player_49`, `ai_49`, `player_28`, `ai_28`, `player_20`, `ai_20`, `player_102`, `ai_102`, `player_3`, `ai_3`, `player_8`, `ai_8`, `player_58`, `ai_58`, `player_77`, `ai_77`, `player_36`, `ai_36`, `player_26`, `ai_26`, `player_55`, `ai_55`, `player_124`, `ai_124`, `player_2`, `ai_2`, `player_92`, `ai_92`, `player_90`, `ai_90`, `player_75`, `ai_75`, `player_104`, `ai_104`, `player_53`, `ai_53`, `player_42`, `ai_42`, `player_81`, `ai_81`, `player_10`, `ai_10`, `player_40`, `ai_40`, `player_117`, `ai_117`, `player_84`, `ai_84`, `player_35`, `ai_35`, `player_15`, `ai_15`, `player_67`, `ai_67`, `player_30`, `ai_30`, `player_44`, `ai_44`, `player_45`, `ai_45`, `player_46`, `ai_46`, `player_48`, `ai_48`, `player_51`, `ai_51`, `player_96`, `ai_96`, `player_98`, `ai_98`, `player_87`, `ai_87`, `player_43`, `ai_43`, `player_24`, `ai_24`) VALUES(:timestamp, :player_57, :ai_57, :player_115, :ai_115, :player_70, :ai_70, :player_74, :ai_74, :player_32, :ai_32, :player_93, :ai_93, :player_12, :ai_12, :player_7, :ai_7, :player_120, :ai_120, :player_22, :ai_22, :player_13, :ai_13, :player_66, :ai_66, :player_78, :ai_78, :player_99, :ai_99, :player_38, :ai_38, :player_41, :ai_41, :player_103, :ai_103, :player_60, :ai_60, :player_79, :ai_79, :player_14, :ai_14, :player_49, :ai_49, :player_28, :ai_28, :player_20, :ai_20, :player_102, :ai_102, :player_3, :ai_3, :player_8, :ai_8, :player_58, :ai_58, :player_77, :ai_77, :player_36, :ai_36, :player_26, :ai_26, :player_55, :ai_55, :player_124, :ai_124, :player_2, :ai_2, :player_92, :ai_92, :player_90, :ai_90, :player_75, :ai_75, :player_104, :ai_104, :player_53, :ai_53, :player_42, :ai_42, :player_81, :ai_81, :player_10, :ai_10, :player_40, :ai_40, :player_117, :ai_117, :player_84, :ai_84, :player_35, :ai_35, :player_15, :ai_15, :player_67, :ai_67, :player_30, :ai_30, :player_44, :ai_44, :player_45, :ai_45, :player_46, :ai_46, :player_48, :ai_48, :player_51, :ai_51, :player_96, :ai_96, :player_98, :ai_98, :player_87, :ai_87, :player_43, :ai_43, :player_24, :ai_24)',
        'getMostRecentTimestamp' => 'SELECT `timestamp` FROM `marketPrices` ORDER BY `timestamp` DESC LIMIT 1',
    ];

    public const ID_MAP = [
        2   => 33,
        3   => 25,
        7   => 8,
        8   => 26,
        10  => 41,
        12  => 7,
        13  => 11,
        14  => 20,
        15  => 46,
        20  => 23,
        22  => 10,
        24  => 58,
        26  => 30,
        28  => 22,
        30  => 48,
        32  => 5,
        35  => 45,
        36  => 29,
        38  => 15,
        40  => 42,
        41  => 16,
        42  => 39,
        43  => 57,
        44  => 49,
        45  => 50,
        46  => 51,
        48  => 52,
        49  => 21,
        51  => 53,
        53  => 38,
        55  => 31,
        57  => 1,
        58  => 27,
        60  => 18,
        66  => 12,
        67  => 47,
        70  => 3,
        74  => 4,
        75  => 36,
        77  => 28,
        78  => 13,
        79  => 19,
        81  => 40,
        84  => 44,
        87  => 56,
        90  => 35,
        92  => 34,
        93  => 6,
        96  => 54,
        98  => 55,
        99  => 14,
        102 => 24,
        103 => 17,
        104 => 37,
        115 => 2,
        117 => 43,
        120 => 9,
        124 => 32,
    ];

    private const DEFAULT_EXPORT_TYPE = 'json';
    private const ALLOWED_EXPORT_TYPES = ['xml', 'csv', 'json'];

    private const DEFAULT_EXPORT_RANGE = 72;
    private const ALLOWED_EXPORT_RANGES = [1, 24, 48, 72, 96, 120, 144, 168,];

    private const EXPORT_HEADER = [
        'xml'  => [
            'Content-type: text/xml',
            'Content-type: application/octet-stream',
            'Content-disposition: attachment; filename=rhelper4-prices-export.xml',
        ],
        'csv'  => [
            'Content-type: text/csv',
            'Content-type: application/octet-stream',
            'Content-disposition: attachment; filename=rhelper4-prices-export.csv',
        ],
        'json' => [
            'Content-type: application/json',
        ],
    ];

    /** @var PDO $pdo */
    private $pdo;

    /** @var PDOStatement */
    private $stmt;

    private $exportType = 'json';
    /** @var int $exportRange */
    private $exportRange;

    private $data;

    public function __construct() {
        parent::__construct();

        if(!$this->getDBInstance()) {
            echo json_encode(['error' => 'Database connection could not be established']);
            die;
        }
    }

    private function getDBInstance(): bool {
        $db        = DB::getInstance();
        $this->pdo = $db->getConnection();

        return $this->pdo instanceof PDO;
    }

    public function curlPrices(): array {
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

        $this->stmt = $this->pdo->prepare(self::QUERIES['save']);

        return $this->stmt->execute($prices);
    }

    public function getMostRecentTimestamp(): int {
        $stmt = $this->pdo->query(self::QUERIES['getMostRecentTimestamp']);

        if(!$stmt) {
            return 0;
        }

        $response = $stmt->fetch();

        if($response['timestamp']) {
            return (int) $response['timestamp'];
        }

        return 0;
    }

    public function setExportType(string $type): void {
        if(in_array($type, self::ALLOWED_EXPORT_TYPES, true)) {
            $this->exportType = $type;
            return;
        }

        $this->exportType = self::DEFAULT_EXPORT_TYPE;
    }

    public function setExportRange(int $range): void {
        if(in_array($range, self::ALLOWED_EXPORT_RANGES, true)) {
            $this->exportRange = $range;
            return;
        }

        $this->exportRange = self::DEFAULT_EXPORT_RANGE;
    }

    private function createTimestamp(): int {
        $date = new DateTime();

        try {
            $interval = new DateInterval('PT' . $this->exportRange . 'H');
            $date->sub($interval);

            return $date->getTimestamp();
        } catch(Exception $error) {
            /** @noinspection SummerTimeUnsafeTimeManipulationInspection */
            return time() - $this->exportRange * 86400;
        }
    }

    private function buildExportQuery(): string {
        $sql = 'SELECT ';

        foreach(array_keys(self::ID_MAP) as $key) {
            $sql .= ' ROUND(AVG(player_' . $key . ')) as player_' . $key . ', ROUND(AVG(ai_' . $key . ')) as ai_' . $key . ', ';
        }

        $sql = substr($sql, 0, -2);
        $sql .= ' FROM `marketPrices` WHERE `timestamp` >= :timestamp';

        return $sql;
    }

    public function getArray(): array {
        $stmt = $this->pdo->prepare($this->buildExportQuery());
        $stmt->execute(['timestamp' => $this->createTimestamp()]);

        $prices = [];

        $data = $stmt->fetch();

        foreach(array_keys(self::ID_MAP) as $id) {
            $prices[] = [
                'id'     => $id,
                'ai'     => $data['ai_' . $id],
                'player' => $data['player_' . $id],
            ];
        }

        return $prices;
    }

    public function export(): string {
        foreach(self::EXPORT_HEADER[$this->exportType] as $header) {
            header($header);
        }

        $stmt = $this->pdo->prepare($this->buildExportQuery());
        $stmt->execute(['timestamp' => $this->createTimestamp()]);

        $this->data = $stmt->fetch();

        if($this->exportType === 'json') {
            return $this->generateJSON();
        }

        if($this->exportType === 'xml') {
            return $this->generateXML();
        }

        if($this->exportType === 'csv') {
            return $this->generateCSV();
        }

        return (string) json_encode(['error' => 'invalid output type, only CSV, XML and JSON are supported']);
    }

    private function generateJSON(): string {
        $prices = [];

        foreach(array_keys(self::ID_MAP) as $id) {
            $prices[] = [
                'id'     => $id,
                'ai'     => $this->data['ai_' . $id],
                'player' => $this->data['player_' . $id],
            ];
        }

        return (string) json_encode($prices, JSON_NUMERIC_CHECK);
    }

    private function generateXML(): string {
        $XMLWriter = new XMLWriter();
        $XMLWriter->openMemory();

        $XMLWriter->setIndent(true);
        $XMLWriter->setIndentString('    ');

        $XMLWriter->startDocument('1.9', 'UTF-8');

        $XMLWriter->startElement('prices');
        $XMLWriter->writeAttribute('range', (string) $this->exportRange);
        $XMLWriter->writeAttribute('exported', (string) time());

        foreach(array_keys(self::ID_MAP) as $id) {
            $XMLWriter->startElement('price');

            $XMLWriter->startElement('id');
            $XMLWriter->text((string) $id);
            $XMLWriter->endElement();

            $XMLWriter->startElement('ai');
            $XMLWriter->text($this->data['ai_' . $id]);
            $XMLWriter->endElement();

            $XMLWriter->startElement('player');
            $XMLWriter->text($this->data['player_' . $id]);
            $XMLWriter->endElement();

            $XMLWriter->endElement();
        }

        $XMLWriter->endElement();
        $XMLWriter->endDocument();

        return $XMLWriter->outputMemory(true);
    }

    private function generateCSV(): string {

        $csv = "id,ai,player\r\n";

        foreach(array_keys(self::ID_MAP) as $id) {
            $csv .= $id . ',' . $this->data['ai_' . $id] . ',' . $this->data['player_' . $id] . "\r\n";
        }

        return $csv;
    }
}
