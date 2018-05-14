<?php

/**
 * resourcesGame contains all methods for this page
 *
 * @author  Gerrit Alex <admin@gerritalex.de>
 * @license MIT (https://github.com/ljosberinn/resources-helper/blob/master/LICENSE)
 * @link    https://github.com/ljosberinn/resources-helper
 **/

class resourcesGame
{
    /**
     * @var object $_host host adress
     */
    private $_host;
    /**
     * @var object $user user
     */
    private $_user;
    /**
     * @var object $_pw password
     */
    private $_pw;
    /**
     * @var object $_db database
     */
    private $_db;

    /**
     * @var object $_conn is the global mysqli object
     */
    private $_conn;

    /**
     * @var array $_prices contains all prices returned by @method private _getAllPrices()
     */
    private $_prices;

    /**
     * queries also function as table names
     * also defines min max indices for each subgroup of exported JSON as well as their access points for JavaScript and their localizationTab
     *
     * @var     array TABLE_NAMES [defines possible time intervals for display; these names are case-sensitive for JavaScript access]
     * @example resources => min = 0, max = 13, length = 14, outputName = material, localizationTable = materialNames
     */
    const TABLE_NAMES = [
      "resources" => [
        "min" => 0,
        "max" => 13,
        "length" => 14,
        "outputName" => "material",
        "localizationTable" => "materialNames"
      ],
      "factories" => [
        "min" => 14,
        "max" => 35,
        "length" => 22,
        "outputName" => "products",
        "localizationTable" => "productNames"
      ],
      "loot" => [
        "min" => 36,
        "max" => 51,
        "length" => 16,
        "outputName" => "loot",
        "localizationTable" => "lootNames"
      ],
      "units" => [
        "min" => 52,
        "max" => 57,
        "length" => 6,
        "outputName" => "units",
        "localizationTable" => "unitNames"
        ]
      ];

    /**
    * @var array PRICE_INTERVALS [defines possible time intervals for display; these names are case-sensitive for JavaScript access]
    * @example current, 1day, 3days, 7days, 4weeks, 3months, 6months, 1year, max
    */
    const PRICE_INTERVALS = [
      "current" => 60*60,
      "1day" => 60*60*24,
      "3days" => 60*60*24*3,
      "7days" => 60*60*24*7,
      "4weeks" => 60*60*24*7*4,
      "3months" => 60*60*24*7*4*3,
      "6months" => 60*60*24*7*4*6,
      "1year" => 60*60*24*365,
      "max" => 0
    ];

    /**
    * @var array PRODUCT_ARRAY [defines warehouse access points for JavaScript]
    * @example contingent, fillAmount, filLStatus, level
    */
    const WAREHOUSE_ARRAY = [
      "contingent",
      "fillAmount",
      "fillStatus",
      "level"
    ];

    /**
    * @var array RESOURCE_ARRAY [defines resource access points for JavaScript]
    * @example amountOfMines, perHour
    */
    const RESOURCE_ARRAY = [
      "amountOfMines",
      "perHour"
    ];

    /**
    * @var array PRODUCT_ARRAY [defines product access points for JavaScript]
    * @example factoryLevel
    */
    const PRODUCT_ARRAY = [
      "factoryLevel"
    ];

    /**
    * @var int BUILDING_AMOUNT [defines amount of buildings]
    * @example 12
    */
    const BUILDING_AMOUNT = 12;


    /**
    * @var array LANGUAGES [defines available languages]
    * @example de, en, fr, ru, jp, in
    */
    const LANGUAGES = [
      "de",
      "en",
      "fr",
      "ru",
      "jp",
      "in"
    ];

    /**
    * @var array SETTINGS [defines settings and their base value]
    */
    const SETTINGS = [
      "language" => self::LANGUAGES[0],
      "customTU" => [111,26,0,0],
      "idealCondition" => 0,
      "factoryNames" => 0,
      "transportCostInclusion" => 0,
      "mapVisibleHQ" => 0,
      "showNames" => 0,
      "queryPreset" => [1,2,3,4,5,51,6,7,9,10],
    ];


    /**
     * builds an array out of a array string
     *
     * @method  private _convertArrayStringToArray($string)
     * @param   int|mixed $string [some array concatenated as string with ","]
     * @example $string = "1,2,3"; => $result = [1, 2, 3];
     *
     * @return array [returns converted array]
     */
    private function _convertArrayStringToArray($string)
    {
        $array = [];
        $explode = explode(",", $string);

        foreach ($explode as $dataset) {
            array_push($array, $dataset);
        }

        return $array;
    }

    /**
     * establishes database connection and points it to $this->_conn
     *
     * @method private _DBConnection()
     * @return mixed [returns $this->_conn as new mysqli()]
     */
    private function _DBConnection()
    {
        try {
            $_conn = new mysqli($this->_host, $this->_user, $this->_pw, $this->_db);
            $_conn->set_charset("utf8mb4");
            $this->_conn = $_conn;
        } catch (Exception $e) {
            return $e->getMessage();
            die();
        }

        return $_conn;
    }

    /**
     * - construct obj with $this as database connection
     * - fetch all prices as they are always required upon calling this class
     *
     * @method public __construct($_host, $_user, $_pw, $_db)
     * @param  mixed $_host   [server to connect to]
     * @param  mixed $_user   [user to connect as]
     * @param  mixed $_pw     [password to connect with]
     * @param  mixed $_db     [database to select]
     * @param  array $_prices [$_prices array via _getAllPrices()]
     *
     * @return mixed [returns $this->_conn as new mysqli() and $this->_prices as global price array]
     */
    public function __construct($_host, $_user, $_pw, $_db, $_prices)
    {
        $this->_host = $_host;
        $this->_user = $_user;
        $this->_pw = $_pw;
        $this->_db = $_db;

        $this->_conn = $this->_DBConnection();

        if ($_prices === "on") {
            $this->_prices = $this->getAllPrices();
        }
    }

    /**
     * builds base queries for general game data
     *
     * @method  private _getBaseQuery($type)
     * @param   mixed $type [type of query to be fetched]
     * @example resources, factories, loot, units, headquarter, settings
     *
     * @return array [returns modified array]
     */
    private function _getBaseQuery($type)
    {
        $stmt = "SELECT ";

        switch ($type) {
        case "resources":
            $stmt.= "`basePrice`, `dependantFactories`, `maxRate`";
            break;

        case "factories":
            $stmt.= "`cashPerHour`, `dependantFactories`, `dependencies`, `scaling`, `requiredAmount`, `upgradeMaterial`, `upgradeMaterialAmount`";
            break;

        case "loot":
            $stmt.= "`recyclingDivisor`, `recyclingProduct`, `recyclingAmount`";
            break;

        case "units":
            $stmt.= "`requirements`, `requiredAmount`, `baseStrength`";
            break;

        case "headquarter":
            $stmt.= "`amount`, `material`, `boost`, `radius`";
            break;

        case "buildings":
            $stmt.= "`level`, `material`, `materialAmount0`, `materialAmount1`, `materialAmount2`, `materialAmount3`";
            break;

        case "settings":
            $stmt.= "`setting`, `value`, `description`";
            break;
        }

        $stmt.= " FROM `" . $type . "` ORDER BY `id` ASC";

        return $stmt;
    }

    /**
     * swaps internal IDs to old structure (prices table columns index are all tradeables ordered alphabetically in German)
     *
     * @method  private _convertInternalIdToOldStructure($id)
     * @param   int $id [type of query to be fetched]
     * @example 42 => 1
     *
     * @return int [returns modified id]
     */
    private function _convertInternalIdToOldStructure($id)
    {
        switch ($id) {
        case 42: //Old tires
            $convertedId = 1;
            break;

        case 51: //Waste glass
            $convertedId = 2;
            break;

        case 45: //Scrap metal
            $convertedId = 3;
            break;

        case 50: //Used oil
            $convertedId = 4;
            break;

        case 22: //Aluminium
            $convertedId = 5;
            break;

        case 25: //Batteries
            $convertedId = 6;
            break;

        case 8: //Bauxite
            $convertedId = 7;
            break;

        case 15: //Concrete
            $convertedId = 8;
            break;

        case 37: //Drone wreckage
            $convertedId = 9;
            break;

        case 16: //Fertilizer
            $convertedId = 10;
            break;

        case 4: //Iron ore
            $convertedId = 11;
            break;

        case 28: //Electronics
            $convertedId = 12;
            break;

        case 38: //Electronic scrap
            $convertedId = 13;
            break;

        case 53: //Elite force
            $convertedId = 14;
            break;

        case 18: //Fossil fuel
            $convertedId = 15;
            break;

        case 39: //Fossils
            $convertedId = 16;
            break;

        case 54: //Gangster
            $convertedId = 17;
            break;

        case 19: //Glass
            $convertedId = 18;
            break;

        case 32: //Gold
            $convertedId = 19;
            break;

        case 12: //Gold ore
            $convertedId = 20;
            break;

        case 10: //Ilmenite
            $convertedId = 21;
            break;

        case 20: //Insecticides
            $convertedId = 22;
            break;

        case 1: //Limestone
            $convertedId = 23;
            break;

        case 52: //Attack dogs
            $convertedId = 24;
            break;

        case 2: //Gravel
            $convertedId = 25;
            break;

        case 3: //Coal
            $convertedId = 26;
            break;

        case 23: //Plastics
            $convertedId = 27;
            break;

        case 43: //Plastic scrap
            $convertedId = 28;
            break;

        case 21: //Copper
            $convertedId = 29;
            break;

        case 7: //Chalcopyrite
            $convertedId = 30;
            break;

        case 36: //Copper coins
            $convertedId = 31;
            break;

        case 34: //Trucks
            $convertedId = 32;
            break;

        case 0: //Clay
            $convertedId = 33;
            break;

        case 24: //Lithium
            $convertedId = 34;
            break;

        case 9: //Lithium ore
            $convertedId = 35;
            break;

        case 30: //Medical technology
            $convertedId = 36;
            break;

        case 55: //Private army
            $convertedId = 37;
            break;

        case 6: //Quartz sand
            $convertedId = 38;
            break;

        case 40: //Giant diamond
            $convertedId = 39;
            break;

        case 13: //Rough diamonds
            $convertedId = 40;
            break;

        case 5: //Crude oil
            $convertedId = 41;
            break;

        case 44: //Roman coins
            $convertedId = 42;
            break;

        case 35: //Scan drones
            $convertedId = 43;
            break;

        case 33: //Jewellery
            $convertedId = 44;
            break;

        case 31: //Silver
            $convertedId = 45;
            break;

        case 11: //Silver ore
            $convertedId = 46;
            break;

        case 27: //Silicon
            $convertedId = 47;
            break;

        case 17: //Steel
            $convertedId = 48;
            break;

        case 46: //Tech upgrade 1
            $convertedId = 49;
            break;

        case 47: //Tech upgrade 2
            $convertedId = 50;
            break;

        case 48: //Tech upgrade 3
            $convertedId = 51;
            break;

        case 49: //Tech upgrade 4
            $convertedId = 52;
            break;

        case 29: //Titanium
            $convertedId = 53;
            break;

        case 57: //Watch dogs
            $convertedId = 54;
            break;

        case 56: //Security staff
            $convertedId = 55;
            break;

        case 26: //Weapons
            $convertedId = 56;
            break;

        case 41: //Maintenance kit
            $convertedId = 57;
            break;

        case 14: //Bricks
            $convertedId = 58;
            break;

        case -1: //Cash
            $convertedId = -1;
            break;
        }

        return $convertedId;
    }

    /**
     * extracts prices from table `price` grouped by type
     *
     * @method  public getAllPrices()
     * @example type examples: resources, factories, loot, units
     *
     * @return array [global price array $this->_prices]
     */
    public function getAllPrices()
    {
        $_prices = [
          "resources" => [],
          "factories" => [],
          "loot" => [],
          "units" => []
        ];

        foreach (self::TABLE_NAMES as $arrayIndex => $minMax) {
            $globalIndex = 0;

            for ($index = $minMax["min"]; $index <= $minMax["max"]; $index += 1) {
                $query = "SELECT * FROM ";

                $officialId = $this->_convertInternalIdToOldStructure($index);

                foreach (self::PRICE_INTERVALS as $interval => $seconds) {
                    $indexInterval = $index. "_" .$interval;

                    $query .= "(
                      SELECT
                      AVG(" .$officialId. "_k) AS `" .$indexInterval. "_ai`,
                      AVG(nullif(" .$officialId. "_tk, 0)) AS `" .$indexInterval. "_player`
                      FROM `price` ";

                    switch ($interval) {
                    case "max":
                        break;
                    default:
                        $query .= "WHERE `ts` >= (UNIX_TIMESTAMP() - " .$seconds. ")";
                        break;
                    }

                    $query .= ") AS `" .$indexInterval. "`, ";
                }

                $query = substr($query, 0, -2);

                $getPrices = $this->_conn->query($query);

                if ($getPrices->num_rows > 0) {
                    while ($result = $getPrices->fetch_assoc()) {
                        foreach (self::PRICE_INTERVALS as $interval => $seconds) {
                            $_prices[$arrayIndex][$globalIndex][$interval]["ai"] = round($result[$index. "_" .$interval. "_ai"]);
                            $_prices[$arrayIndex][$globalIndex][$interval]["player"] = round($result[$index. "_" .$interval. "_player"]);
                        }
                    }
                } else {
                    foreach (self::PRICE_INTERVALS as $interval => $seconds) {
                        $_prices[$arrayIndex][$globalIndex][$interval]["ai"] = 0;
                        $_prices[$arrayIndex][$globalIndex][$interval]["player"] = 0;
                    }
                }

                $globalIndex += 1;
            }
        }

          return $_prices;
    }

    /**
     * swaps officially recieved IDs to the internal ID
     * - official IDs are globally sorted alphabetically, ascending, German
     * - internal Ids are ordered by:
     * 1. resources => identical to in-game unlock order
     * 2. products => identical to in-game unlock order of factories
     * 3. loot & units => ordered alphabetically, English
     *
     * @method  private _convertOfficialIdToInternalId($id)
     * @param   int $id [official, API-bound Id]
     * @example 57 => 42
     *
     * @return int [returns converted Id]
     */
    private function _convertOfficialIdToInternalId($id)
    {
        switch ($id) {
        case 57: // Old tires
            $convertedId = 42;
            break;
        case 115: // Waste glass
            $convertedId = 51;
            break;
        case 70: // Scrap metal
            $convertedId = 45;
            break;
        case 74: // Used oil
            $convertedId = 50;
            break;
        case 32: case 33: // Aluminium
                $convertedId = 22;
            break;
        case 93: case 95: // Batteries
                $convertedId = 25;
            break;
        case 12: // Bauxite
            $convertedId = 8;
            break;
        case 7: case 6: // Concrete
                $convertedId = 15;
            break;
        case 120: // Drone wreckage
            $convertedId = 37;
            break;
        case 22: case 23: // Fertilizer
                $convertedId = 16;
            break;
        case 13: // Iron ore
            $convertedId = 4;
            break;
        case 66: case 69: // Electronics
                $convertedId = 28;
            break;
        case 78: // Electronic scrap
            $convertedId = 38;
            break;
        case 99: // Elite force
            $convertedId = 53;
            break;
        case 38: case 39: // Fossil fuel
                $convertedId = 18;
            break;
        case 41: // Fossils
            $convertedId = 39;
            break;
        case 103: // Gangster
            $convertedId = 54;
            break;
        case 60: case 61: // Glass
                $convertedId = 19;
            break;
        case 79:  case 80: // Gold
                $convertedId = 32;
            break;
        case 14: // Gold ore
            $convertedId = 12;
            break;
        case 49: // Ilmenite
            $convertedId = 10;
            break;
        case 28: case 29: // Insecticides
                $convertedId = 20;
            break;
        case 20: // Limestone
            $convertedId = 1;
            break;
        case 102: // Attack dogs
            $convertedId = 52;
            break;
        case 3: // Gravel
            $convertedId = 2;
            break;
        case 8: // Coal
            $convertedId = 3;
            break;
        case 58: case 63: // Plastics
                $convertedId = 23;
            break;
        case 77: // Plastic scrap
            $convertedId = 43;
            break;
        case 36: case 37: // Copper
                $convertedId = 21;
            break;
        case 26: // Chalcopyrite
            $convertedId = 7;
            break;
        case 55: // Copper coins
            $convertedId = 36;
            break;
        case 124: case 125: // Trucks
                $convertedId = 34;
            break;
        case 2: // Clay
            $convertedId = 0;
            break;
        case 92: case 91: // Lithium
                $convertedId = 24;
            break;
        case 90: // Lithium ore
            $convertedId = 9;
            break;
        case 75: case 76: // Medical technology
                $convertedId = 30;
            break;
        case 104: // Private army
            $convertedId = 55;
            break;
        case 53: // Quartz sand
            $convertedId = 6;
            break;
        case 42: // Giant diamond
            $convertedId = 40;
            break;
        case 81: // Rough diamonds
            $convertedId = 13;
            break;
        case 10: // Crude oil
            $convertedId = 5;
            break;
        case 40: // Roman coins
            $convertedId = 44;
            break;
        case 117: case 118: // Scan drones
                $convertedId = 35;
            break;
        case 84: case 85: // Jewellery
                $convertedId = 33;
            break;
        case 35: case 34: // Silver
                $convertedId = 31;
            break;
        case 15: // Silver ore
            $convertedId = 11;
            break;
        case 67: case 68: // Silicon
                $convertedId = 27;
            break;
        case 30: case 31: // Steel
                $convertedId = 17;
            break;
        case 44: // Tech upgrade 1
            $convertedId = 46;
            break;
        case 45: // Tech upgrade 2
            $convertedId = 47;
            break;
        case 46: // Tech upgrade 3
            $convertedId = 48;
            break;
        case 48: // Tech upgrade 4
            $convertedId = 49;
            break;
        case 51: case 52: // Titanium
                $convertedId = 29;
            break;
        case 96: // Watch dogs
            $convertedId = 57;
            break;
        case 98: // Security staff
            $convertedId = 56;
            break;
        case 87: case 101: // Weapons
                $convertedId = 26;
            break;
        case 43: // Maintenance kit
            $convertedId = 41;
            break;
        case 24: case 25: // Bricks
                $convertedId = 14;
            break;
        default: // Cash
            $convertedId = -1;
            break;
        }

        return $convertedId;
    }

    /**
     * fetches base game data from various tables
     *
     * @method  private _returnBaseData($query, $type)
     * @param   mixed  $query [generated SQL query]
     * @param   string $type  [type information]
     * @example $type examples: resources, factories, loot, units, headquarter, buildings, settings
     *
     * @return array [returns corresponding baseData]
     */
    private function _returnBaseData($query, $type)
    {
        $answer = [];

        switch ($type) {
        case "resources":
            $imgClass = "material";
            break;
        case "factories":
            $imgClass = "product";
            break;
        case "loot":
            $imgClass = "loot";
            break;
        case "units":
            $imgClass = "unit";
            break;
        case "headquarter":
            $imgClass = "hq";
            break;
        case "buildings":
            $imgClass = "building";
            break;
        case "settings":
            $imgClass = "settings";
            break;
        }

        $getData = $this->_conn->query($query);

        if ($getData->num_rows > 0) {
            $image = $globalIndex = 0;

            while ($data = $getData->fetch_assoc()) {
                /*
                DB stores arrays as comma-separated strings => convert them to array before appending
                */
                foreach ($data as $index => $dataset) {
                    if (strpos($dataset, ",") !== false) {
                        $data[$index] = $this->_convertArrayStringToArray($dataset);
                    }
                }

                if ($imgClass !== "hq" && $imgClass !== "building" && $imgClass !== "settings") {

                    /*
                    adds prices
                    */
                    foreach (self::PRICE_INTERVALS as $interval => $seconds) {
                        $data["prices"][$interval] = $this->_prices[$type][$globalIndex][$interval];
                    }

                    /*
                    globally adds warehouse subobject
                    */
                    foreach (self::WAREHOUSE_ARRAY as $array) {
                        $data["warehouse"][$array] = 0;
                    }

                    /*
                    adds special subobjects depending on type
                    */
                    switch ($type) {
                    case "factories":
                        $originArray = self::PRODUCT_ARRAY;
                        break;
                    case "resources":
                        $originArray = self::RESOURCE_ARRAY;
                        break;
                    default:
                        $originArray = [];
                        break;
                    }

                    foreach ($originArray as $array) {
                        $data[$array] = 0;
                    }
                }

                /*
                links to corresponding image
                */
                if ($imgClass !== "settings") {
                    $data["icon"] = "resources-" .$imgClass . "-" . $image;
                }
                $image += 1;

                array_push($answer, $data);
                $globalIndex += 1;
            }
        }

        return $answer;
    }

    /**
     * helper function for _getBaseQuery
     *
     * @method  public _returnBaseData($type)
     * @param   string $type [type information]
     * @example $type examples: resources, factories, loot, units, headquarter, buildings, settings
     *
     * @return array [returns corresponding baseData]
     */
    public function getRawData($type)
    {
        $query = $this->_getBaseQuery($type);

        return $this->_returnBaseData($query, $type);
    }

    /**
     * sets or fetches user settings from userSettings depending on $_SESSION["id"]
     *
     * @method public getUserSettings($baseData, $userId)
     * @param  array $baseData [pregenerated array to iterate over]
     * @param  int   $userId   [current user Id]
     *
     * @return array [returns corresponding user settings]
     */
    public function getUserSettings($baseData, $userId)
    {
        $stmt = "SELECT * FROM `userSettings` WHERE `id` = " .$userId. "";
        $query = $this->_conn->query($stmt);

        if ($query->num_rows === 1) {
            while ($data = $query->fetch_assoc()) {

                $baseData[0]["setting"] = "lang";
                $baseData[0]["value"]   = $data["lang"];

                $baseData[1]["setting"] = "customTU";
                $baseData[1]["value"]   = $this->_convertArrayStringToArray($data["customTU"]);

                $baseData[2]["setting"] = "idealCondition";
                $baseData[2]["value"]   = $data["idealCondition"];

                $baseData[3]["setting"] = "transportCostInclusion";
                $baseData[3]["value"]   = $data["transportCostInclusion"];

                $baseData[4]["setting"] = "mapVisibleHQ";
                $baseData[4]["value"]   = $data["mapVisibleHQ"];

                $baseData[5]["setting"] = "priceAge";
                $baseData[5]["value"]   = $data["priceAge"];

                $baseData[6]["setting"] = "showNames";
                $baseData[6]["value"]   = $data["showNames"];

                $baseData[7]["setting"] = "queryPreset";
                $baseData[7]["value"]   = $this->_convertArrayStringToArray($data["queryPreset"]);

            }
        }

        return $baseData;
    }

    /**
     * fetches user buildings from userBuildings depending on $_SESSION["id"]
     *
     * @method public getUserSettings($baseData, $userId)
     * @param  array $baseData [pregenerated array to iterate over]
     * @param  int   $userId   [current user Id]
     *
     * @return array [returns corresponding user settings]
     */
    public function getUserSpecialBuildings($baseData, $userId)
    {
        $query = "SELECT * FROM `userBuildings` WHERE `id` = " .$userId. "";

        $getUserBuildings = $this->_conn->query($query);

        if ($getUserBuildings->num_rows === 1) {
            while ($data = $getUserBuildings->fetch_assoc()) {
                foreach ($data as $building => $buildingLevel) {
                    if (strpos($building, "building") !== false) {
                        $building = substr($building, 8, 2);
                        $baseData[$building]["level"] = $buildingLevel;
                    }
                }
            }
        }

        return $baseData;
    }

    /**
     * fetches user materials from userMaterials depending on $_SESSION["id"]
     *
     * @method public getUserMaterials($baseData, $userId)
     * @param  array $baseData [parent data from previous function call]
     * @param  int   $userId   [current user id]
     *
     * @return array [returns modified $baseData]
     */
    public function getUserMaterials($baseData, $userId)
    {
        $query = "SELECT * FROM `userMaterial` WHERE `id` = " .$userId. "";

        $getUserMaterial = $this->_conn->query($query);

        if ($getUserMaterial->num_rows > 0) {
            while ($data = $getUserMaterial->fetch_assoc()) {
                foreach ($data as $key => $value) {
                    $index = preg_replace("/[^0-9]/", "", $key);

                    if (is_numeric($index)) {
                        if (strpos($key, "amountOfMines") !== false) {
                            $key = substr($key, 13);
                            $target = "amountOfMines";
                        } elseif (strpos($key, "perHour") !== false) {
                            $key = substr($key, 7);
                            $target = "perHour";
                        }
                        $baseData[$key][$target] = $value;
                    }
                }
            }
        }

        return $baseData;
    }

    /**
     * helper function to easen iterating over all game objects
     *
     * @method private _convertIndexToSubarray($index)
     * @param  int $index [current index to iterate over]
     *
     * @return array [array including referenced subArray and position with in that array]
     */
    private function _convertIndexToSubarray($index)
    {
        if ($index >= 0 && $index <= 13) {
            $subArray = "material";
            $arrayPosition = $index;
        } elseif ($index >= 14 && $index <= 35) {
            $subArray = "products";
            $arrayPosition = $index-14;
        } elseif ($index >= 36 && $index <= 51) {
            $subArray = "loot";
            $arrayPosition = $index-36;
        } elseif ($index >= 52) {
            $subArray = "units";
            $arrayPosition = $index-52;
        }

        return [
          "subArray" => $subArray,
          "arrayPosition" => $arrayPosition
        ];
    }

    /**
     * fetches user factories from userFactories depending on $_SESSION["id"]
     *
     * @method public getUserFactories($baseData, $userId)
     * @param  array $baseData [parent data from previous function call]
     * @param  int   $userId   [current user id]
     *
     * @return array [returns modified $baseData]
     */
    public function getUserFactories($baseData, $userId)
    {
        $query = "SELECT * FROM `userFactories` WHERE `id` = " .$userId. "";

        $getUserFactories = $this->_conn->query($query);

        if ($getUserFactories->num_rows > 0) {
            while ($data = $getUserFactories->fetch_assoc()) {
                foreach ($data as $factory => $level) {
                    if (strpos($factory, "factory") !== false) {
                        $factory = substr($factory, 7);
                        $baseData[$factory]["factoryLevel"] = $level;
                    }
                }
            }
        }
        return $baseData;
    }

    /**
     * fetches user warehouse information from userWarehouse depending on $_SESSION["id"]
     *
     * @method public getUserWarehouseContent($baseData, $userId)
     * @param  array $baseData [parent data from previous function call]
     * @param  int   $userId   [current user id]
     *
     * @return array [returns modified $baseData]
     */
    public function getUserWarehouseContent($baseData, $userId)
    {
        $query = "SELECT * FROM `userWarehouse` WHERE `id` = " .$userId. "";

        $getUserWarehouse = $this->_conn->query($query);

        if ($getUserWarehouse->num_rows > 0) {
            while ($data = $getUserWarehouse->fetch_assoc()) {
                foreach ($data as $key => $value) {
                    $index = preg_replace("/[^0-9]/", "", $key);

                    if (is_numeric($index)) {
                        $subArrayData = $this->_convertIndexToSubarray($index);
                        $subArray = $subArrayData["subArray"];
                        $arrayPosition = $subArrayData["arrayPosition"];

                        if (strpos($key, self::WAREHOUSE_ARRAY[3]) !== false) {
                            $key = substr($key, 5);
                            $target = self::WAREHOUSE_ARRAY[3];
                            $baseData[$subArray][$arrayPosition]["warehouse"]["contingent"] = pow($value, 2) * 5000;
                        } elseif (strpos($key, self::WAREHOUSE_ARRAY[1]) !== false) {
                            $key = substr($key, 10);
                            $target = self::WAREHOUSE_ARRAY[1];
                        }

                        $baseData[$subArray][$arrayPosition]["warehouse"][$target] = $value;
                        $baseData[$subArray][$arrayPosition]["warehouse"]["fillStatus"] = $baseData[$subArray][$arrayPosition]["warehouse"]["fillAmount"] / $baseData[$subArray][$arrayPosition]["warehouse"]["contingent"];
                    }
                }
            }
        }

        return $baseData;
    }

    /**
     * converts unixtimestamp to datetime ('Y-m-d H:i:s')
     *
     * @method private _convertUnixTimestampToDateTime($unixts)
     * @param  int $unixts [10 digit long unix ts (seconds)]
     *
     * @return mixed [returns formatted dateTime]
     */
    private function _convertUnixTimestampToDateTime($unixts)
    {
        $datetime = new DateTime();
        $datetime->setTimestamp($unixts);

        return $datetime->format('Y-m-d H:i:s');
    }

    /**
     * fetches user information from userOverview depending on $_SESSION["id"]
     *
     * @method public getUserInfo($userId)
     * @param  int $userId [$_SESSION['id']]
     *
     * @return array [contains userInfo]
     */
    public function getUserInfo($userId)
    {
        $query = "SELECT
        `registeredPage`,
        `mail`,
        `registeredGame`,
        `hashedKey`,
        `realKey`,
        `lastUpdate`,
        `remainingCredits`,
        `name`,
        `points`,
        `rank`,
        `level` FROM `userOverview` WHERE `id` = " .$userId. "";

        $getUserInfo = $this->_conn->query($query);

        $result = [];

        if ($getUserInfo->num_rows === 1) {
            while ($data = $getUserInfo->fetch_assoc()) {

                $arr = [
                  "hashedKey" => $data["hashedKey"],
                  "realKey"   => $data["realKey"]
                ];

                foreach ($arr as $index => $key) {
                    if ($key === "") {
                        $key = false;
                    }
                    $result[$index] = $key;
                }

                $arr = [
                  "registeredPage" => $data["registeredPage"],
                  "registeredGame" => $data["registeredGame"],
                  "lastUpdate"     => $data["lastUpdate"]
                ];

                foreach ($arr as $index => $timestamp) {
                    $result[$index] = $this->_convertUnixTimestampToDateTime($timestamp);
                }

                $arr = [
                  "remainingCredits" => $data["remainingCredits"],
                  "mail"             => $data["mail"],
                  "name"             => $data["name"],
                  "points"           => $data["points"],
                  "rank"             => $data["rank"],
                  "level"            => $data["level"]
                ];

                foreach ($arr as $index => $value) {
                    if ($value === "") {
                        $value = false;
                    }

                    $result[$index] = $value;
                }

                $result["securityToken"] = md5($data["registeredPage"]);
            }
        }

        return $result;
    }

    /**
     * creates a new table if not exists
     *
     * @method public createTable($baseData, $userId)
     * @param  int $type   [table type to be built]
     * @param  int $userId [current user id]

     * @return mixed [returns SQL query]
     */
    public function createTable($type, $userId)
    {
        switch ($type) {
        case "attackLog":
            $query = "CREATE TABLE IF NOT EXISTS `userAttackLog_" .$userId. "` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `target` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
            `targetLevel` smallint(3) NOT NULL,
            `timestamp` int(10) NOT NULL,
            `aUnit1` int(10) NOT NULL,
            `aUnit2` int(10) NOT NULL,
            `aUnit3` int(10) NOT NULL,
            `aUnit1Price` int(10) NOT NULL,
            `aUnit2Price` int(11) NOT NULL,
            `aUnit3Price` int(11) NOT NULL,
            `dUnit1` int(10) NOT NULL,
            `dUnit2` int(10) NOT NULL,
            `dUnit3` int(10) NOT NULL,
            `dUnit1Price` int(10) NOT NULL,
            `dUnit2Price` int(11) NOT NULL,
            `dUnit3Price` int(11) NOT NULL,
            `lat` decimal(9,6) NOT NULL,
            `lon` decimal(9,6) NOT NULL,
            `action` varchar(1) COLLATE utf8mb4_unicode_ci NOT NULL,
            `result` binary(1) NOT NULL,
            `factor` float NOT NULL,
            `lootId1` smallint(2) NOT NULL,
            `lootQty1` bigint(15) NOT NULL,
            `lootPrice1` int(10) NOT NULL,
            `lootId2` smallint(2) NOT NULL,
            `lootQty2` bigint(15) NOT NULL,
            `lootPrice2` int(10) NOT NULL,
            `worth` bigint(16) NOT NULL,
            `profit` bigint(16) NOT NULL,
            PRIMARY KEY (`id`),
            UNIQUE KEY `timestamp` (`timestamp`)
            ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
            break;
        case "mineMap":
            $query = "CREATE TABLE IF NOT EXISTS `userMineMap_" .$userId. "` (
            `lon` decimal(9,6) NOT NULL,
            `lat` decimal(9,6) NOT NULL,
            `type` smallint(2) NOT NULL,
            `quality` float NOT NULL,
            `fullRate` float NOT NULL,
            `HQBoost` float NOT NULL,
            `builddate` int(10) NOT NULL,
            `rawRate` float NOT NULL,
            `techFactor` float NOT NULL,
            UNIQUE KEY `uc_name` (`lon`,`lat`),
            UNIQUE KEY `builddate` (`builddate`)
            ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;";
            break;
        case "tradeLog":
            $query = "CREATE TABLE IF NOT EXISTS `userTradeLog_" .$userId. "` (
            `id` int(11) NOT NULL AUTO_INCREMENT,
            `timestamp` int(10) NOT NULL,
            `event` tinyint(1) NOT NULL,
            `amount` bigint(15) NOT NULL,
            `price` bigint(15) NOT NULL,
            `transportCost` bigint(15) NOT NULL,
            `itemId` smallint(3) NOT NULL,
            `actor` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
            `actorLevel` mediumint(3) NOT NULL,
            PRIMARY KEY (`id`),
            UNIQUE KEY `uniqueness` (`event`,`timestamp`,`actor`,`itemId`)
            ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
            break;
        case "missions":
            $query = "CREATE TABLE IF NOT EXISTS `userMissions_" .$userId. "` (
            `id` int(11) NOT NULL,
            `startTimestamp` int(10) NOT NULL,
            `endTimestamp` int(10) NOT NULL,
            `progress` bigint(15) NOT NULL,
            `goal` bigint(15) NOT NULL,
            `cooldown` int(10) NOT NULL,
            `rewardAmount` bigint(15) NOT NULL,
            `penalty` bigint(15) NOT NULL,
            `status` tinyint(1) NOT NULL,
            UNIQUE KEY `id` (`id`)
            ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
            break;
        }

        return $query;
    }

     /**
      * fetches detailed attackLog depending on current $_SESSION["id"]
      *
      * @method public getDetailedAttackLog($userId)
      * @param  int $userId [current user id]
      *
      * @return array [returns attackLog]
      */
    public function getDetailedAttackLog($userId, $target, $skipCount)
    {
        $validTargets = [];

        $validTargetsQuery = "SELECT DISTINCT(`target`) FROM `userAttackLog_" .$userId. "` WHERE `action` = 'A' ORDER BY `target` ASC";
        $getValidTargets = $this->_conn->query($validTargetsQuery);

        if ($getValidTargets->num_rows > 0) {
            while ($data = $getValidTargets->fetch_assoc()) {
                array_push($validTargets, $data["target"]);
            }
        }

        if (!$skipCount) {
            $skipCount = 0;
        }

        $result = [
            "validTargets" => $validTargets,
            "skipCount" => $skipCount,
            "avg" => [
              "profit" => 0,
              "factor" => 0,
              "unitsLost" => [],
            ],
            "total" => [
              "profit" => 0,
              "factor" => 0,
              "unitsLost" => [],
            ],
            "days" => [

            ],
        ];

        $query = "SELECT
        `target`,
        `targetLevel`,
        `timestamp`,
        `aUnit1`, `aUnit2`, `aUnit3`,
        `dUnit1`, `dUnit2`, `dUnit3`,
        `lat`, `lon`,
        `result`,
        `factor`,
        `lootId1`, `lootId2`,
        `lootQty1`, `lootQty2`,
        `lootPrice1`, `lootPrice2`,
        `worth`, `profit`
        FROM `userAttackLog_" .$userId. "` WHERE `action` = 'A'";

        /*
        get amount of entries for this query for page-wise iteration on frontend
        */

        $getMaxLengthQuery = "SELECT COUNT(*) AS `maxLength` FROM `userAttackLog_" .$userId. "` WHERE `action` = 'A'";

        /*
        group all results per day
        */

        $getAttackingDaysQuery = "SELECT FROM_UNIXTIME(`timestamp`) as `validDay` FROM `userAttackLog_" .$userId. "` WHERE `action` = 'A' GROUP BY DATE(FROM_UNIXTIME(timestamp)) ORDER BY `timestamp` DESC";

        if (!empty($target)) {

            if (in_array($target, $validTargets)) {
                $addendum = " AND `target` = '" .$target. "'";
                $query .= $addendum;
                $getMaxLengthQuery .= $addendum;
                $getAttackingDaysQuery = "SELECT FROM_UNIXTIME(`timestamp`) as `validDay` FROM `userAttackLog_" .$userId. "` WHERE `action` = 'A' AND `target` = '" .$target. "' GROUP BY DATE(FROM_UNIXTIME(timestamp)) ORDER BY `timestamp` DESC";
            }
        }

        $validDays = [];
        $getAttackingDays = $this->_conn->query($getAttackingDaysQuery);

        if ($getAttackingDays->num_rows > 0) {
            while ($data = $getAttackingDays->fetch_assoc()) {
                array_push($validDays, substr($data["validDay"], 0, -9));
            }
        }

        $result["validDays"] = $validDays;

        $getMaxLength = $this->_conn->query($getMaxLengthQuery);

        $maxLength = 0;
        if ($getMaxLength->num_rows === 1) {
            while ($data = $getMaxLength->fetch_assoc()) {
                $maxLength = $data["maxLength"];
            }
        }

        $result["maxLength"] = $maxLength;

        $query .= " ORDER BY `timestamp` DESC LIMIT 100 OFFSET " .$skipCount;

        $getDetailedAttackLog = $this->_conn->query($query);


        $i = 0;

        if ($getDetailedAttackLog->num_rows > 0) {
            while ($data = $getDetailedAttackLog->fetch_assoc()) {

                $result["data"][$i]["coordinates"]["lat"] = $data["lat"];
                $result["data"][$i]["coordinates"]["lon"] = $data["lon"];

                $result["data"][$i]["target"]      = $data["target"];
                $result["data"][$i]["targetLevel"] = $data["targetLevel"];

                $result["data"][$i]["loot"]["primary"]["type"]   = $data["lootId1"];
                $result["data"][$i]["loot"]["primary"]["amount"] = $data["lootQty1"];
                $result["data"][$i]["loot"]["primary"]["price"]  = $data["lootPrice1"];

                $result["data"][$i]["loot"]["secondary"]["type"]   = $data["lootId2"];
                $result["data"][$i]["loot"]["secondary"]["amount"] = $data["lootQty2"];
                $result["data"][$i]["loot"]["secondary"]["price"]  = $data["lootPrice2"];

                for ($k = 0; $k <= 2; $k += 1) {
                    $result["data"][$i]["offense"]["units"][$k]  = $data["aUnit" .($k + 1). ""];
                    $result["total"]["unitsLost"][$k]           += $data["aUnit" .($k + 1). ""];

                    $result["data"][$i]["defense"]["units"][$k] =  $data["dUnit" .($k + 1). ""];
                }

                switch ($data["result"]) {
                case 0:
                    $attackResult = false;
                    break;
                case 1: default:
                        $attackResult = true;
                    break;
                }

                $result["data"][$i]["result"]     = $attackResult;
                $result["data"][$i]["attackedAt"] = $data["timestamp"] * 1000;

                $result["data"][$i]["profit"]  = $data["profit"];
                $result["total"]["profit"]    += $data["profit"];

                $result["data"][$i]["factor"]  = $data["factor"] * 100;
                $result["total"]["factor"]    += $data["factor"];

                $i++;
            }
        }

        $result["avg"]["loot"]   = round($result["total"]["loot"] / $i);
        $result["avg"]["profit"] = round($result["total"]["profit"] / $i);
        $result["avg"]["factor"] = round($result["total"]["factor"] / $i) * 100;

        for ($k = 0; $k <= 2; $k += 1) {
            $result["avg"]["unitsLost"][$k] = round($result["total"]["unitsLost"][$k] / $i);
        }

        return $result;
    }

    /**
     * fetches simple attackLog depending on current $_SESSION["id"]
     *
     * @method public getSimpleAttackLog($userId)
     * @param  int $userId [current user id]
     *
     * @return array [returns attackLog]
     */
    public function getSimpleAttackLog($userId)
    {
        $result = [];

        $query = "SELECT
        `target` AS `targetName`,
        ( SELECT MAX(`timestamp` * 1000) FROM `userAttackLog_" .$userId. "` WHERE `action` = 'A' AND `target` = targetName) `lastAttacked`,
        MAX(`targetLevel`) AS `targetLevel`,
        AVG(`factor`) AS `factor`,
        COUNT(*) AS `sumAttacks`,
        SUM(`result`) as `sumWin`,
        (SELECT ROUND(AVG(`aUnit1`)) FROM `userAttackLog_" .$userId. "` WHERE `action` = 'A' AND `result` = 1 AND `dUnit1` <= 200 AND `dUnit2` <= 5 AND `dUnit3` <= 2 AND `target` = targetName AND `targetLevel` = targetLevel) `unit0`,
        (SELECT ROUND(AVG(`aUnit2`)) FROM `userAttackLog_" .$userId. "` WHERE `action` = 'A' AND `result` = 1 AND `dUnit1` <= 200 AND `dUnit2` <= 5 AND `dUnit3` <= 2 AND `target` = targetName AND `targetLevel` = targetLevel) `unit1`,
        (SELECT ROUND(AVG(`aUnit3`)) FROM `userAttackLog_" .$userId. "` WHERE `action` = 'A' AND `result` = 1 AND `dUnit1` <= 200 AND `dUnit2` <= 5 AND `dUnit3` <= 2 AND `target` = targetName AND `targetLevel` = targetLevel) `unit2`,
        SUM(`profit`) as `profit`
        FROM `userAttackLog_" .$userId. "`
        WHERE `action` = 'A'
        GROUP BY(`target`)
        ORDER BY `profit` DESC";

        $getSimpleAttackLog = $this->_conn->query($query);

        if ($getSimpleAttackLog->num_rows > 0) {
            while ($data = $getSimpleAttackLog->fetch_assoc()) {
                array_push($result, $data);
            }
        }

        return $result;
    }

    /**
     * fetches simple defenseLog depending on current $_SESSION["id"]
     *
     * @method public getDefenseLog($userId)
     * @param  int $userId [current user id]
     * @return array [returns defenseLog]
     */

    public function getDefenseLog($userId)
    {

        $result = [];

        $query = "SELECT
        `target` AS `targetName`,
        ( SELECT MAX(`timestamp` * 1000) FROM `userAttackLog_" .$userId. "` WHERE `action` = 'D' AND `target` = targetName) `lastAttacked`,
        MAX(`targetLevel`) AS `targetLevel`,
        AVG(`factor`) AS `factor`,
        COUNT(*) AS `sumAttacks`,
        SUM(`result`) as `sumWin`,
        (SELECT ROUND(AVG(`aUnit1`)) FROM `userAttackLog_" .$userId. "` WHERE `action` = 'D' AND `result` = 0 AND `dUnit1` <= 200 AND `dUnit2` <= 5 AND `dUnit3` <= 2 AND `target` = targetName) `unit0`,
        (SELECT ROUND(AVG(`aUnit2`)) FROM `userAttackLog_" .$userId. "` WHERE `action` = 'D' AND `result` = 0 AND `dUnit1` <= 200 AND `dUnit2` <= 5 AND `dUnit3` <= 2 AND `target` = targetName) `unit1`,
        (SELECT ROUND(AVG(`aUnit3`)) FROM `userAttackLog_" .$userId. "` WHERE `action` = 'D' AND `result` = 0 AND `dUnit1` <= 200 AND `dUnit2` <= 5 AND `dUnit3` <= 2 AND `target` = targetName) `unit2`,

        (SELECT SUM(`aUnit1` * `aUnit1Price` + `aUnit2` * `aUnit2Price` + `aUnit3` * `aUnit3Price`) AS `unitLossValue` FROM `userAttackLog_" .$userId. "` WHERE `action` = 'D' AND `target` = targetName) `unitLossValue`,
        (SELECT (SUM(`worth`) - `unitLossValue`) AS `profit` FROM `userAttackLog_" .$userId. "` WHERE `action` = 'D' AND `result` = 0 AND `target` = targetName) `profit`

        FROM `userAttackLog_" .$userId. "`
        WHERE `action` = 'D'
        GROUP BY(`target`)
        ORDER BY `profit` DESC";

        $getDefenseLog = $this->_conn->query($query);

        if ($getDefenseLog->num_rows > 0) {
            while ($data = $getDefenseLog->fetch_assoc()) {
                array_push($result, $data);
            }
        }

        return $result;
    }

    /**
     * fetches hq information for a specific user
     *
     * @method private _extractHQInformation($userId)
     * @param  int    $userId   [current user id]
     * @param  string $relation ["friend" or "foe"]
     *
     * @return array [returns array with hq information]
     */
    private function _extractHQInformation($userId, $relation)
    {

        $result = [];

        $getHQData = "SELECT `lat`, `lon`, `level` FROM `userHeadquarter` WHERE `id` = " .$userId. "";
        $getUserHQ = $this->_conn->query($getHQData);

        $threshold = 0.000000;

        if ($getUserHQ->num_rows === 1) {
            while ($data = $getUserHQ->fetch_assoc()) {
                // prevent default entries with visible hq to be shown
                $bccomb = bccomp(abs($data["lat"]), $threshold, 6) + bccomp(abs($data["lon"]), $threshold, 6);

                if ($bccomb > 0) {
                    $data["relation"] = $relation;
                    array_push($result, $data);
                }
            }
        }

        return $result;
    }

    /**
     * fetches mine information for a specific user
     *
     * @method private _extractMineInformation($userId)
     * @param  int    $userId   [current user id]
     * @param  string $relation ["friend" or "foe"]
     * @param  int    $type     [material type]
     *
     * @return array [returns array with mine information]
     */
    private function _extractMineInformation($userId, $relation, $type)
    {
        $result = [];

        $query = "SELECT * FROM `userMineMap_" .$userId. "`";

        if ($type >= 0 && $type <= 13 && $type != "") {
            $query = "SELECT * FROM `userMineMap_" .$userId. "` WHERE `type` = " .$type. "";
        }

        $getUserMineMap = $this->_conn->query($query);

        if ($getUserMineMap->num_rows > 0) {
            while ($data = $getUserMineMap->fetch_assoc()) {
                $data["relation"] = $relation;
                array_push($result, $data);
            }
        }

        return $result;
    }

    /**
     * fetches hq visibility for a specific user
     *
     * @method private _checkHQVisibility($userId)
     * @param  int $userId [current user id]
     *
     * @return int [returns 0 or 1]
     */
    private function _checkHQVisibility($userId)
    {
        $querySetting = "SELECT `mapVisibleHQ` FROM `userSettings` WHERE `id` = " .$userId. "";
        $getUserSetting = $this->_conn->query($querySetting);

        if ($getUserSetting->num_rows === 1) {
            while ($data = $getUserSetting->fetch_assoc()) {
                $hqVisibility = $data["mapVisibleHQ"];
            }
        }

        return $hqVisibility;
    }

    /**
     * fetches all user ids
     *
     * @method private _extractUserIds($userId)
     *
     * @return array [returns all user ids]
     */
    private function _extractUserIds()
    {
        $userIds = [];

        $queryUserIds = "SELECT `id` FROM `userOverview`";
        $getUserIds = $this->_conn->query($queryUserIds);

        if ($getUserIds->num_rows > 0) {
            while ($id = $getUserIds->fetch_assoc()) {
                array_push($userIds, $id["id"]);
            }
        }

        return $userIds;
    }

    /**
     * returns relationship depending on current user
     *
     * @method private _setRelationship($userId)
     * @param  int $userId [current user id]
     *
     * @return string ["friend" or "foe"]
     */
    private function _setRelationship($userId)
    {
        if ($userId === $_SESSION["id"] && $userId !== 0) {
            $relation = "friend";
        } else {
            $relation = "foe";
        }

        return $relation;
    }

    /**
     * fetches personalMineMap depending on current $_SESSION["id"]
     *
     * @method public getPersonalMineMap($userId)
     * @param  int $userId [current user id]
     *
     * @return array [returns personalMineMap]
     */
    public function getPersonalMineMap($userId)
    {
        return [
          "hq" => $this->_extractHQInformation($userId, "friend"),
          "mines" => $this->_extractMineInformation($userId, "friend")
        ];
    }

    /**
     * fetches getWorldMap depending on type
     *
     * @method public getWorldMap($type)
     * @param  int $type [resource type, 0-13]
     * @return array [returns worldMap]
     */
    public function getWorldMap($type)
    {

        $result = [
          "hqs" => [],
          "mines" => [],
        ];

        $userIds = $this->_extractUserIds();

        array_push($userIds, 0);

        foreach ($userIds as $userId) {

            // check whether this mine will be friendly or not
            $relation = $this->_setRelationship($userId);

            // check setting for hq visibility
            if ($this->_checkHQVisibility($userId) === 1) {
                  $result["hqs"] = array_merge($result["hqs"], $this->_extractHQInformation($userId, $relation));
            }

            $result["mines"] = array_merge($result["mines"], $this->_extractMineInformation($userId, $relation, $type));
        }

        return $result;
    }

    /**
     * fetches missions depending on current $_SESSION["id"]
     *
     * @method public getMissions($userId)
     * @param  int $userId [current user id]
     *
     * @return array [returns missions]
     */
    public function getMissions($userId)
    {

        $result = [];

        $getMissionsBaseDataQuery = "SELECT `id`, `title`, `duration`, `intervalDays`, `rewardId` FROM `missions`";
        $missionBaseData = $this->_conn->query($getMissionsBaseDataQuery);

        if ($missionBaseData->num_rows > 0) {
            while ($data = $missionBaseData->fetch_assoc()) {

                $arr = [
                  "title",
                  "duration",
                  "intervalDays",
                  "rewardId",
                ];

                foreach ($arr as $column) {
                    if ($column === "rewardId") {
                          $data[$column] = $this->_convertOfficialIdToInternalId($data[$column]);
                    }

                    $result[$data["id"]][$column] = $data[$column];
                }
            }
        }

        $query = "SELECT * FROM `userMissions_" .$userId. "`";
        $getMissions = $this->_conn->query($query);

        if ($getMissions->num_rows > 0) {
            while ($data = $getMissions->fetch_assoc()) {

                $result[$data["id"]]["img"] = "resources-missions-" .$data["id"];

                $arr = [
                  "startTimestamp",
                  "endTimestamp",
                  "progress",
                  "goal",
                  "cooldown",
                  "rewardAmount",
                  "penalty",
                  "status",
                ];

                foreach ($arr as $column) {
                      $result[$data["id"]][$column] = $data[$column];
                }
            }
        }

        return $result;
    }

    /**
     * fetches userIndex
     *
     * @method public getUserIndex()
     *
     * @return array [returns userIndex]
     */
    public function getUserIndex()
    {
        $result = [];

        $query = "SELECT  `userName`, `userLevel`, `firstSeen`, `lastSeen`, `lastTradedWith`, `sell`, `buy`, `transportCost` FROM `userIndex` ORDER BY `lastSeen` DESC LIMIT 500";

        $getUser = $this->_conn->query($query);

        if ($getUser->num_rows > 0) {
            while ($data = $getUser->fetch_assoc()) {
                array_push($result, $data);
            }
        }

        return $result;
    }

    /**
     * fetches tradeLog depending on current $_SESSION["id"]
     *
     * @method public getTradeLog($userId)
     * @param  int $userId     [current user id]
     * @param  int $skipCount  [skipped pages]
     * @param  int $filter     [filter type]
     * @param  int $dateFilter [unix timestamp of date]
     *
     * @return array [returns tradeLog]
     */
    public function getTradeLog($userId, $skipCount, $filter, $dateFilter)
    {

        $result = $selling = $buying = $last100Entries = $ids = [];
        $result['log'] = $result['timestamps'] = $result['days'] = $result['overview'] = [];
        $result['selling']['total'] = $result['buying']['total'] = $result['selling']['valuesById'] = $result['buying']['valuesById'] = 0;

        for ($i = 0; $i <= 23; $i += 1) {
            $result['timestamps'][$i] = 0;
        }

        for ($event = 0; $event <= 1; $event += 1) {
            for ($i = 0; $i <= 57; $i += 1) {
                $getSumQuery = "SELECT SUM(`amount` * `price`) as `sum` FROM `userTradeLog_" .$userId. "` WHERE `event` = " .$event. " AND `itemId` = " .$i. "";
                $getSum = $this->_conn->query($getSumQuery);

                if ($getSum->num_rows === 1) {
                    while ($data = $getSum->fetch_assoc()) {

                        if ($event === 0) {
                            $targetArr = 'buying';
                        } else {
                            $targetArr = 'selling';
                        }

                        ${$targetArr}[$i] = $data['sum'];
                    }
                }
            }
        }

        $result['selling']['total'] = array_sum($selling);
        $result['selling']['valuesById'] = $selling;

        $result['buying']['total'] = array_sum($buying);
        $result['buying']['valuesById'] = $buying;

        // selling hours
        $getTimestampsQuery = "SELECT `timestamp` FROM `userTradeLog_" .$userId. "` WHERE `event` = 1";
        $getTimestamps = $this->_conn->query($getTimestampsQuery);

        if ($getTimestamps->num_rows > 0) {
            while ($data = $getTimestamps->fetch_assoc()) {
                $result['timestamps'][date('G', $data['timestamp'])] += 1;
            }
        }

        // skipCount
        $mostRecentEntryQuery = "SELECT `timestamp` FROM `userTradeLog_" .$userId. "` ORDER BY `timestamp` DESC LIMIT 1";
        $mostRecentEntry = $this->_conn->query($mostRecentEntryQuery);
        if ($mostRecentEntry->num_rows === 1) {
            $mostRecentEntry = $mostRecentEntry->fetch_assoc();
        }

        if (!$skipCount) {
            $skipCount = 0;
            $start = $mostRecentEntry['timestamp'];
            $end = strtotime('midnight', $mostRecentEntry['timestamp']);
        } else {
            $end = strtotime('midnight', $mostRecentEntry['timestamp']) - $skipCount * 86400;
            $start = strtotime('tomorrow', $mostRecentEntry['timestamp']) - $skipCount * 86400;
        }

        if ($dateFilter) {
            $skipCount = 0;
            $start = $dateFilter + 86400;
            $end = $dateFilter;
        }

        $result['skipCount'] = $skipCount;

        // filter
        if (!isset($filter) || $filter === -1) {
            $filter = -1;
            $addFilter = "";
        } else if ($filter >= -1) {
            $addFilter = " AND `event` = " .$filter;
        }

        $result['filter'] = $filter;

        // individual days filter
        $getDaysAndEntriesCountQuery = "SELECT DATE(FROM_UNIXTIME(`timestamp`)) AS `date`, COUNT(1) AS `entries` FROM `userTradeLog_" .$userId. "` GROUP BY DATE(FROM_UNIXTIME(`timestamp`)) ORDER BY `date` DESC";
        $getDaysAndEntriesCount = $this->_conn->query($getDaysAndEntriesCountQuery);

        if ($getDaysAndEntriesCount->num_rows > 0) {
            while ($data = $getDaysAndEntriesCount->fetch_assoc()) {

                $arr = [
                  'date' => $data['date'],
                  'entries' => $data['entries'],
                ];

                array_push($result['days'], $arr);
            }
        }

        $getMostRecentEntriesQuery = "SELECT `actor`, `actorLevel`, `transportCost`, `amount`, `price`, `itemId`, `timestamp`, `event` FROM `userTradeLog_" .$userId. "` WHERE `timestamp` > " .$end. " AND `timestamp` <= " .$start. " " .$addFilter. " ORDER BY `timestamp` DESC";
        $getMostRecentEntries = $this->_conn->query($getMostRecentEntriesQuery);

        if ($getMostRecentEntries->num_rows > 0) {
            while ($data = $getMostRecentEntries->fetch_assoc()) {
                array_push($result['log'], $data);
            }
        }

        // overview
        $distinctIdsQuery = "SELECT DISTINCT(`itemId`) AS `id` FROM `userTradeLog_" .$userId. "` WHERE `timestamp` > " .$end. " AND `timestamp` <= " .$start;
        $distinctIds = $this->_conn->query($distinctIdsQuery);

        if ($distinctIds->num_rows > 0) {
            while ($data = $distinctIds->fetch_assoc()) {
                array_push($ids, $data['id']);
            }
        }

        foreach ($ids as $id) {
            $sellSumQuery = "SELECT SUM(`amount` * `price`) AS `sumSell` FROM `userTradeLog_" .$userId. "` WHERE `timestamp` > " .$end. " AND `timestamp` <= " .$start. " AND `event` = 1 AND `itemId` = " .$id. "";
            $sellSum = $this->_conn->query($sellSumQuery);

            if ($sellSum->num_rows === 1) {
                while ($data = $sellSum->fetch_assoc()) {
                    $positive = $data['sumSell'];
                }
            }

            $buySumQuery = "SELECT SUM(`amount` * `price`) AS `sumBuy` FROM `userTradeLog_" .$userId. "` WHERE `timestamp` > " .$end. " AND `timestamp` <= " .$start. " AND `event` = 0 AND `itemId` = " .$id. "";
            $buySum = $this->_conn->query($buySumQuery);

            if ($buySum->num_rows === 1) {
                while ($data = $buySum->fetch_assoc()) {
                    $negative = $data['sumBuy'];
                }
            }

            if (is_null($positive)) {
                $positive = 0;
            }

            if (is_null($negative)) {
                $negative = 0;
            }

            $result['overview'][$id] = [
              'itemId' => $id,
              'sum' => $positive - $negative,
              'bought' => $negative,
              'sold' => $positive
            ];
        }

        usort($result['overview'], function ($a, $b) {
            return $b['sum'] - $a['sum'];
        });

        return $result;
    }

    /**
     * iterates over whole $baseData to insert fetched language variables; or sets default self::TABLE_NAMES[0]
     *
     * @method public getLanguageVariables($userId)
     * @param  array $baseData [complete $baseData]
     *
     * @return array [returns modified $baseData array]
     */

    public function getLanguageVariables($baseData)
    {
        /*
        get name from previous set setting
        */
        $language = self::LANGUAGES[$baseData["settings"][0]["value"]];

        $names = [];

        /*
        iterate over all available languages and fetch their localizationTable
        */
        foreach (self::TABLE_NAMES as $key => $value) {
            $names[$value["outputName"]] = $value["localizationTable"];
        }

        /*
        add building localization
        */
        $names["buildings"] = "buildingNames";

        foreach ($names as $subArray => $tableName) {
            $query = "SELECT `" .$language. "` FROM `" .$tableName. "`";

            $getLanguage = $this->_conn->query($query);

            if ($getLanguage->num_rows > 0) {
                $index = 0;

                while ($data = $getLanguage->fetch_assoc()) {
                    foreach ($data as $name) {
                        if (strpos($name, "/") !== false) {
                            $explode = explode("/", $name);
                            $name = $explode[0];
                            $factoryName = $explode[1];
                        } else {
                            $factoryName = "";
                        }

                        $baseData[$subArray][$index]["name"] = $name;
                        if ($factoryName !== "") {
                            $baseData[$subArray][$index]["factoryName"] = $factoryName;
                        }
                        $index += 1;
                    }
                }
            }
        }

        return $baseData;
    }

    /**
     * fills up an array up to its supposed length with zeroes in between
     *
     * @method private _fillUpArrayWithZeroes($array, $supposedLength)
     * @param  array  $array          [API result]
     * @param  int    $supposedLength [supposed length of array to check against]
     * @param  string $type           ["noarray" for $array not containing a subarray, else "warehouse" or "mineSummary"]
     *
     * @return array [returns modified array]
     */

    private function _fillUpArrayWithZeroes($array, $supposedLength, $type)
    {
        if (sizeof($array) !== $supposedLength) {
            switch ($type) {
            case "warehouse":
                $arrayPusher = ["level" => 0, "fillAmount" => 0];
                break;
            case "mineSummary":
                $arrayPusher = ["perHour" => 0, "amountOfMines" => 0];
                break;
            default:
                $arrayPusher = 0;
                break;
            }

            for ($i = 0; $i < $supposedLength; $i += 1) {
                if (!$array[$i]) {
                    $array[$i] = $arrayPusher;
                }
            }
        }

        return $array;
    }

    /**
     * iterates over API factory data
     *
     * @method private _insertAPIFactoryData($data, $userId)
     * @param  array $data   [API result]
     * @param  int   $userId [current userId]
     *
     * @return mixed [returns JSON-encoded array]
     */
    private function _insertAPIFactoryData($data, $userId)
    {
        $factoryArray = [];
        foreach ($data as $factory) {
            $factoryId = $this->_convertOfficialIdToInternalId($factory["factoryID"]) - self::TABLE_NAMES["factories"]["min"];
            $factoryArray[$factoryId] = $factory["lvl"];
        }

        // sort factoryArray by key, ascending, to secure proper insertion further down
        ksort($factoryArray);

        // if user is missing factories, fill up with level 0
        $supposedLength = self::TABLE_NAMES["factories"]["length"];
        $factoryArray = $this->_fillUpArrayWithZeroes($factoryArray, $supposedLength, "noarray");

        if ($userId != 0) {

            $query = "SELECT `id` FROM `userFactories` WHERE `id` = " .$userId. "";
            $checkForPreviousEntry = $this->_conn->query($query);

            if ($checkForPreviousEntry->num_rows === 1) {

                $stmt = "UPDATE `userFactories` SET ";

                foreach ($factoryArray as $factoryId => $factoryLevel) {
                    $stmt .= "`factory" .$factoryId. "` = " .$factoryLevel. ",";
                }
                $stmt = substr($stmt, 0, -1). " WHERE `id` = " .$userId. ";";
            } elseif ($checkForPreviousEntry->num_rows === 0) {
                $stmt = "INSERT INTO `userFactories` (`id`,";

                for ($i = 0; $i < $supposedLength; $i += 1) {
                    $stmt .= "`factory" .$i. "`,";
                }
                $stmt = substr($stmt, 0, -1);
                $stmt .= ") VALUES (" .$userId. ",";

                foreach ($factoryArray as $value) {
                    $stmt .= $value. ",";
                }
                $stmt = substr($stmt, 0, -1);
                $stmt .= ");";
            }

            $insertion = $this->_conn->query($stmt);
        }

        echo json_encode($factoryArray, JSON_NUMERIC_CHECK);
    }

    /**
     * iterates over API warehouse data
     *
     * @method private _insertAPIWarehouseData($data, $userId)
     * @param  array $data   [API result]
     * @param  int   $userId [current userId]
     * @return mixed [returns JSON-encoded array]
     */
    private function _insertAPIWarehouseData($data, $userId)
    {
        $warehouseArray = [];

        foreach ($data as $warehouse) {
            if ($warehouse["itemID"] != 1) {
                $warehouseId = $this->_convertOfficialIdToInternalId($warehouse["itemID"]);

                $warehouseArray[$warehouseId] = [
                  "level" => $warehouse["level"],
                  "amount" => $warehouse["amount"]
                ];
            }
        }

        // sort factoryArray by key, ascending, to secure proper insertion further down
        ksort($warehouseArray);

        // if user is missing warehouses, fill up with level & amount 0
        $supposedLength = self::TABLE_NAMES["resources"]["length"]+self::TABLE_NAMES["factories"]["length"]+self::TABLE_NAMES["loot"]["length"]+self::TABLE_NAMES["units"]["length"];
        $warehouseArray = $this->_fillUpArrayWithZeroes($warehouseArray, $supposedLength, "warehouse");

        if ($userId != 0) {

            $query = "SELECT `id` FROM `userWarehouse` WHERE `id` = " .$userId. "";
            $checkForPreviousEntry = $this->_conn->query($query);

            if ($checkForPreviousEntry->num_rows === 1) {
                $stmt = "UPDATE `userWarehouse` SET ";

                if ($warehouseData["amount"] === '') {
                    $warehouseData["amount"] = 0;
                }

                foreach ($warehouseArray as $warehouseId => $warehouseData) {
                    $stmt .= "`level" .$warehouseId. "` = " .$warehouseData["level"]. ",`fillAmount" .$warehouseId. "` = " .$warehouseData["amount"]. ",";
                }

                $stmt = substr($stmt, 0, -1). " WHERE `id` = " .$userId. ";";
            } elseif ($checkForPreviousEntry->num_rows === 0) {
                $stmt = "INSERT INTO `userWarehouse` (`id`,";

                for ($i = 0; $i < $supposedLength; $i += 1) {
                    $stmt .= "`level" .$i. "`, `fillAmount" .$i. "`,";
                }

                $stmt = substr($stmt, 0, -1);
                $stmt .= ") VALUES (" .$userId. ",";

                foreach ($warehouseArray as $warehouseId => $warehouseData) {

                    if ($warehouseData["amount"] === '') {
                        $warehouseData["amount"] = 0;
                    }

                    $stmt .= $warehouseData["level"]. "," .$warehouseData["amount"]. ",";
                }

                $stmt = substr($stmt, 0, -1);
                $stmt .= ");";
            }

            $insertion = $this->_conn->query($stmt);
        }

        return json_encode($warehouseArray, JSON_NUMERIC_CHECK);
    }

    /**
     * iterates over API warehouse data
     *
     * @method private _convertOfficialBuildingIdToInternalId($buildingId)
     * @param  int $buildingId [current buildingId to iterate over]
     *
     * @return int [converted id]
     */
    private function _convertOfficialBuildingIdToInternalId($buildingId)
    {
        switch ($buildingId) {
        case 116: // Tech center
            $building = 0;
            break;
        case 65: // Museum
            $building = 1;
            break;
        case 62: // Casino
            $building = 2;
            break;
        case 97: // Training camp
            $building = 3;
            break;
        case 86: // Mafia HQ
            $building = 4;
            break;
        case 59: // Recycling plant
            $building = 5;
            break;
        case 71: // Hospital
            $building = 6;
            break;
        case 72: // Law firm
            $building = 7;
            break;
        case 121: // Service center
            $building = 8;
            break;
        case 123: // Haulage firm
            $building = 9;
            break;
        case 119: // Drone research
            $building = 10;
            break;
        case 122: // HR Department
            $building = 11;
            break;
        }

        return $building;
    }

    /**
     * iterates over API warehouse data
     *
     * @method private _insertAPIBuildingsData($data, $userId)
     * @param  array $data   [API result]
     * @param  int   $userId [current userId]
     *
     * @return mixed [returns JSON-encoded array]
     */
    private function _insertAPIBuildingsData($data, $userId)
    {
        $buildingArray = [];

        foreach ($data as $building) {
            $buildingId = $this->_convertOfficialBuildingIdToInternalId($building["specbID"]);
            $buildingArray[$buildingId] = $building["lvl"];
        }

        // sort factoryArray by key, ascending, to secure proper insertion further down
        ksort($buildingArray);

        $supposedLength = self::BUILDING_AMOUNT;
        $buildingArray = $this->_fillUpArrayWithZeroes($buildingArray, $supposedLength, "noarray");

        if ($userId != 0) {

            $query = "SELECT `id` FROM `userBuildings` WHERE `id` = " .$userId. "";
            $checkForPreviousEntry = $this->_conn->query($query);

            if ($checkForPreviousEntry->num_rows === 1) {
                $stmt = "UPDATE `userBuildings` SET ";

                foreach ($buildingArray as $buildingId => $buildingLevel) {
                    $stmt .= "`building" .$buildingId. "` = " .$buildingLevel. ",";
                }

                $stmt = substr($stmt, 0, -1). " WHERE `id` = " .$userId. ";";
            } elseif ($checkForPreviousEntry->num_rows === 0) {
                $stmt = "INSERT INTO `userBuildings` (`id`,";

                for ($i = 0; $i < $supposedLength; $i += 1) {
                    $stmt .= "`building" .$i. "`,";
                }

                $stmt = substr($stmt, 0, -1);
                $stmt .= ") VALUES (" .$userId. ",";

                foreach ($buildingArray as $buildingId => $buildingLevel) {
                    $stmt .= $buildingLevel. ",";
                }

                $stmt = substr($stmt, 0, -1);
                $stmt .= ");";
            }

            $insertion = $this->_conn->query($stmt);
        }

        return json_encode($buildingArray, JSON_NUMERIC_CHECK);
    }

    /**
     * iterates over API headquarter data
     *
     * @method private _insertAPIHeadquarterData($data, $userId)
     * @param  array $data   [API result]
     * @param  int   $userId [current userId]
     *
     * @return mixed [returns JSON-encoded array]
     */
    private function _insertAPIHeadquarterData($data, $userId)
    {
        $data = $data[0];

        $headquarterArray = [
          "level" => $data["lvl"],
          "lon" => $data["lon"],
          "lat" => $data["lat"],
          "progress0" => $data["progress1"],
          "progress1" => $data["progress2"],
          "progress2" => $data["progress3"],
          "progress3" => $data["progress4"]
        ];

        if ($userId != 0) {

            $query = "SELECT `id` FROM `userHeadquarter` WHERE `id` = " .$userId. "";
            $checkForPreviousEntry = $this->_conn->query($query);

            if ($checkForPreviousEntry->num_rows === 1) {
                $stmt = "UPDATE `userHeadquarter` SET ";

                foreach ($headquarterArray as $column => $value) {
                    $stmt.= "`" .$column. "` = " .$value. ",";
                }

                $stmt = substr($stmt, 0, -1). " WHERE `id` = " .$userId. ";";
            } elseif ($checkForPreviousEntry->num_rows === 0) {
                $stmt = "INSERT INTO `userHeadquarter` (`id`,";

                foreach ($headquarterArray as $column => $value) {
                                  $stmt .= "`" .$column. "`,";
                }

                $stmt = substr($stmt, 0, -1). ") VALUES(" .$userId. ",";

                foreach ($headquarterArray as $column => $value) {
                                  $stmt .= $value. ",";
                }

                $stmt = substr($stmt, 0, -1). ");";

            }

            $insertion = $this->_conn->query($stmt);
        }

        $headquarterArray = [
            "level" => $data["lvl"],
            "lon" => $data["lon"],
            "lat" => $data["lat"],
            "paid" => [
              $data["progress1"],
              $data["progress2"],
              $data["progress3"],
              $data["progress4"]
            ],
        ];

        return json_encode($headquarterArray, JSON_NUMERIC_CHECK);
    }

    /**
     * iterates over API mine summary data
     *
     * @method private _insertAPIMineSummary($data, $userId)
     * @param  array $data   [API result]
     * @param  int   $userId [current userId]
     *
     * @return mixed [returns JSON-encoded array]
     */
    private function _insertAPIMineSummary($data, $userId)
    {
        $materialArray = [];

        foreach ($data as $material) {
            $id = $this->_convertOfficialIdToInternalId($material["resourceID"]);

            $materialArray[$id]["perHour"] = round($material["SUMfullrate"]);
            $materialArray[$id]["amountOfMines"] = $material["minecount"];
        }

        // sort materialArray by key, ascending, to secure proper insertion further down
        ksort($materialArray);

        $materialArray = $this->_fillUpArrayWithZeroes($materialArray, 14, "mineSummary");

        if ($userId != 0) {

            $query = "SELECT `id` FROM `userMaterial` WHERE `id` = " .$userId. "";
            $checkForPreviousEntry = $this->_conn->query($query);

            if ($checkForPreviousEntry->num_rows === 1) {
                $stmt = "UPDATE `userMaterial` SET ";

                for ($i = 0; $i <= 13; $i += 1) {
                    $stmt .= "`perHour" .$i. "` = " .$materialArray[$i]["perHour"]. ",`amountOfMines". $i. "` = " .$materialArray[$i]["amountOfMines"]. ",";
                }

                $stmt = substr($stmt, 0, -1). " WHERE `id` = " .$userId. ";";
            } elseif ($checkForPreviousEntry->num_rows === 0) {
                $stmt = "INSERT INTO `userMaterial` (`id`,";

                for ($i = 0; $i <= 13; $i += 1) {
                    $stmt .= "`perHour" .$i. "`,`amountOfMines". $i. "`,";
                }
                $stmt = substr($stmt, 0, -1). ") VALUES(" .$userId. ",";

                for ($i = 0; $i <= 13; $i += 1) {
                    $stmt .= $materialArray[$i]["perHour"]. "," .$materialArray[$i]["amountOfMines"]. ",";
                }
                $stmt = substr($stmt, 0, -1). ");";
            }

            $insertion = $this->_conn->query($stmt);
        }

        return json_encode($materialArray, JSON_NUMERIC_CHECK);
    }

    /**
     * iterates over API player information
     *
     * @method private _insertAPIPlayerInformation($data, $userId)
     * @param  array $data   [API result]
     * @param  int   $userId [current userId]
     *
     * @return mixed [returns JSON-encoded array]
     */
    private function _insertAPIPlayerInformation($data, $userId, $anonymity)
    {
        $data = $data[0];

        // ignore app version and build
        unset($data["appV"]);
        unset($data["appVRB"]);

        $query = "UPDATE `userOverview` SET ";

        $result = [];

        foreach ($data as $column => $value) {
            switch ($column) {
            case "username":
                if ($anonymity === true) {
                    continue;
                } else {
                    $query .= "`name`";
                }
                break;
            case "lvl":
                $query .= "`level`";
                break;
            case "points":
                $query .= "`points`";
                break;
            case "worldrank":
                $query .= "`rank`";
                break;
            case "registerdate":
                $query .= "`registeredGame`";
                break;
            default:
                break;
            }

            if ($anonymity === true && $column === "username") {
                continue;
            } else {

                if ($column === "username") {
                    $value = str_replace('?', '', $value);
                }

                $result[$column] = $value;
                $query .= " = '" .$value. "',";
            }
        }

        $query = substr($query, 0, -1). " WHERE `id` = " .$userId. ";";

        if ($userId != 0) {
            $insertion = $this->_conn->query($query);
        }

        return json_encode($result, JSON_NUMERIC_CHECK);
    }

    /**
     * returns timestamp-relative price of old internal Id
     *
     * @method private _returnRelativePrice($id, $timestamp)
     * @param  int $id        [old internal id via]
     * @param  int $timestamp [unix timestamp]
     *
     * @return int [price]
     */
    private function _returnRelativePrice($id, $timestamp)
    {
        $query = "SELECT `" .$id. "_k` AS `ai`, `" .$id. "_tk` AS `player` FROM `price` WHERE `ts` <= " .$timestamp. " ORDER BY `ts` DESC LIMIT 1";

        $getRelativePrice = $this->_conn->query($query);

        $price = 0;

        if ($getRelativePrice->num_rows === 1) {
            while ($data = $getRelativePrice->fetch_assoc()) {
                if ($data["ai"] >= $data["player"]) {
                    $price = $data["ai"];
                } else {
                    $price = $data["player"];
                }
            }
        }

        return $price;
    }

    /**
     * returns emoji-sanitized string
     *
     * @method private _removeEmojis($string)
     * @param  string $string [potentially emoji-containing string]
     *
     * @return string [$string]
     */
    private function _removeEmojis($string)
    {
        return preg_replace("/[\x{1F3F4}](?:\x{E0067}\x{E0062}\x{E0077}\x{E006C}\x{E0073}\x{E007F})|[\x{1F3F4}](?:\x{E0067}\x{E0062}\x{E0073}\x{E0063}\x{E0074}\x{E007F})|[\x{1F3F4}](?:\x{E0067}\x{E0062}\x{E0065}\x{E006E}\x{E0067}\x{E007F})|[\x{1F3F4}](?:\x{200D}\x{2620}\x{FE0F})|[\x{1F3F3}](?:\x{FE0F}\x{200D}\x{1F308})|[\x{0023}\x{002A}\x{0030}\x{0031}\x{0032}\x{0033}\x{0034}\x{0035}\x{0036}\x{0037}\x{0038}\x{0039}](?:\x{FE0F}\x{20E3})|[\x{1F441}](?:\x{FE0F}\x{200D}\x{1F5E8}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F467}\x{200D}\x{1F467})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F467}\x{200D}\x{1F466})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F467})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F466}\x{200D}\x{1F466})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F466})|[\x{1F468}](?:\x{200D}\x{1F468}\x{200D}\x{1F467}\x{200D}\x{1F467})|[\x{1F468}](?:\x{200D}\x{1F468}\x{200D}\x{1F466}\x{200D}\x{1F466})|[\x{1F468}](?:\x{200D}\x{1F468}\x{200D}\x{1F467}\x{200D}\x{1F466})|[\x{1F468}](?:\x{200D}\x{1F468}\x{200D}\x{1F467})|[\x{1F468}](?:\x{200D}\x{1F468}\x{200D}\x{1F466})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F469}\x{200D}\x{1F467}\x{200D}\x{1F467})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F469}\x{200D}\x{1F466}\x{200D}\x{1F466})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F469}\x{200D}\x{1F467}\x{200D}\x{1F466})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F469}\x{200D}\x{1F467})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F469}\x{200D}\x{1F466})|[\x{1F469}](?:\x{200D}\x{2764}\x{FE0F}\x{200D}\x{1F469})|[\x{1F469}\x{1F468}](?:\x{200D}\x{2764}\x{FE0F}\x{200D}\x{1F468})|[\x{1F469}](?:\x{200D}\x{2764}\x{FE0F}\x{200D}\x{1F48B}\x{200D}\x{1F469})|[\x{1F469}\x{1F468}](?:\x{200D}\x{2764}\x{FE0F}\x{200D}\x{1F48B}\x{200D}\x{1F468})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F9B3})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F9B3})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F9B3})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F9B3})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F9B3})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F9B3})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F9B2})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F9B2})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F9B2})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F9B2})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F9B2})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F9B2})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F9B1})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F9B1})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F9B1})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F9B1})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F9B1})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F9B1})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F9B0})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F9B0})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F9B0})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F9B0})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F9B0})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F9B0})|[\x{1F575}\x{1F3CC}\x{26F9}\x{1F3CB}](?:\x{FE0F}\x{200D}\x{2640}\x{FE0F})|[\x{1F575}\x{1F3CC}\x{26F9}\x{1F3CB}](?:\x{FE0F}\x{200D}\x{2642}\x{FE0F})|[\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{1F3FF}\x{200D}\x{2640}\x{FE0F})|[\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{1F3FE}\x{200D}\x{2640}\x{FE0F})|[\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{1F3FD}\x{200D}\x{2640}\x{FE0F})|[\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{1F3FC}\x{200D}\x{2640}\x{FE0F})|[\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{1F3FB}\x{200D}\x{2640}\x{FE0F})|[\x{1F46E}\x{1F9B8}\x{1F9B9}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F9DE}\x{1F9DF}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F46F}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93C}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{200D}\x{2640}\x{FE0F})|[\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{1F3FF}\x{200D}\x{2642}\x{FE0F})|[\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{1F3FE}\x{200D}\x{2642}\x{FE0F})|[\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{1F3FD}\x{200D}\x{2642}\x{FE0F})|[\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{1F3FC}\x{200D}\x{2642}\x{FE0F})|[\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{1F3FB}\x{200D}\x{2642}\x{FE0F})|[\x{1F46E}\x{1F9B8}\x{1F9B9}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F9DE}\x{1F9DF}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F46F}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93C}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{200D}\x{2642}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F692})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F692})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F692})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F692})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F692})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F692})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F680})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F680})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F680})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F680})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F680})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F680})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{2708}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{2708}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{2708}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{2708}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{2708}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{200D}\x{2708}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F3A8})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F3A8})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F3A8})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F3A8})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F3A8})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F3A8})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F3A4})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F3A4})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F3A4})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F3A4})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F3A4})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F3A4})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F4BB})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F4BB})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F4BB})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F4BB})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F4BB})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F4BB})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F52C})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F52C})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F52C})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F52C})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F52C})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F52C})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F4BC})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F4BC})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F4BC})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F4BC})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F4BC})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F4BC})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F3ED})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F3ED})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F3ED})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F3ED})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F3ED})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F3ED})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F527})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F527})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F527})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F527})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F527})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F527})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F373})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F373})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F373})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F373})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F373})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F373})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F33E})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F33E})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F33E})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F33E})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F33E})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F33E})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{2696}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{2696}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{2696}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{2696}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{2696}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{200D}\x{2696}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F3EB})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F3EB})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F3EB})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F3EB})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F3EB})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F3EB})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F393})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F393})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F393})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F393})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F393})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F393})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{2695}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{2695}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{2695}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{2695}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{2695}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{200D}\x{2695}\x{FE0F})|[\x{1F476}\x{1F9D2}\x{1F466}\x{1F467}\x{1F9D1}\x{1F468}\x{1F469}\x{1F9D3}\x{1F474}\x{1F475}\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F934}\x{1F478}\x{1F473}\x{1F472}\x{1F9D5}\x{1F9D4}\x{1F471}\x{1F935}\x{1F470}\x{1F930}\x{1F931}\x{1F47C}\x{1F385}\x{1F936}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F483}\x{1F57A}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F6C0}\x{1F6CC}\x{1F574}\x{1F3C7}\x{1F3C2}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}\x{1F933}\x{1F4AA}\x{1F9B5}\x{1F9B6}\x{1F448}\x{1F449}\x{261D}\x{1F446}\x{1F595}\x{1F447}\x{270C}\x{1F91E}\x{1F596}\x{1F918}\x{1F919}\x{1F590}\x{270B}\x{1F44C}\x{1F44D}\x{1F44E}\x{270A}\x{1F44A}\x{1F91B}\x{1F91C}\x{1F91A}\x{1F44B}\x{1F91F}\x{270D}\x{1F44F}\x{1F450}\x{1F64C}\x{1F932}\x{1F64F}\x{1F485}\x{1F442}\x{1F443}](?:\x{1F3FF})|[\x{1F476}\x{1F9D2}\x{1F466}\x{1F467}\x{1F9D1}\x{1F468}\x{1F469}\x{1F9D3}\x{1F474}\x{1F475}\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F934}\x{1F478}\x{1F473}\x{1F472}\x{1F9D5}\x{1F9D4}\x{1F471}\x{1F935}\x{1F470}\x{1F930}\x{1F931}\x{1F47C}\x{1F385}\x{1F936}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F483}\x{1F57A}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F6C0}\x{1F6CC}\x{1F574}\x{1F3C7}\x{1F3C2}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}\x{1F933}\x{1F4AA}\x{1F9B5}\x{1F9B6}\x{1F448}\x{1F449}\x{261D}\x{1F446}\x{1F595}\x{1F447}\x{270C}\x{1F91E}\x{1F596}\x{1F918}\x{1F919}\x{1F590}\x{270B}\x{1F44C}\x{1F44D}\x{1F44E}\x{270A}\x{1F44A}\x{1F91B}\x{1F91C}\x{1F91A}\x{1F44B}\x{1F91F}\x{270D}\x{1F44F}\x{1F450}\x{1F64C}\x{1F932}\x{1F64F}\x{1F485}\x{1F442}\x{1F443}](?:\x{1F3FE})|[\x{1F476}\x{1F9D2}\x{1F466}\x{1F467}\x{1F9D1}\x{1F468}\x{1F469}\x{1F9D3}\x{1F474}\x{1F475}\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F934}\x{1F478}\x{1F473}\x{1F472}\x{1F9D5}\x{1F9D4}\x{1F471}\x{1F935}\x{1F470}\x{1F930}\x{1F931}\x{1F47C}\x{1F385}\x{1F936}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F483}\x{1F57A}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F6C0}\x{1F6CC}\x{1F574}\x{1F3C7}\x{1F3C2}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}\x{1F933}\x{1F4AA}\x{1F9B5}\x{1F9B6}\x{1F448}\x{1F449}\x{261D}\x{1F446}\x{1F595}\x{1F447}\x{270C}\x{1F91E}\x{1F596}\x{1F918}\x{1F919}\x{1F590}\x{270B}\x{1F44C}\x{1F44D}\x{1F44E}\x{270A}\x{1F44A}\x{1F91B}\x{1F91C}\x{1F91A}\x{1F44B}\x{1F91F}\x{270D}\x{1F44F}\x{1F450}\x{1F64C}\x{1F932}\x{1F64F}\x{1F485}\x{1F442}\x{1F443}](?:\x{1F3FD})|[\x{1F476}\x{1F9D2}\x{1F466}\x{1F467}\x{1F9D1}\x{1F468}\x{1F469}\x{1F9D3}\x{1F474}\x{1F475}\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F934}\x{1F478}\x{1F473}\x{1F472}\x{1F9D5}\x{1F9D4}\x{1F471}\x{1F935}\x{1F470}\x{1F930}\x{1F931}\x{1F47C}\x{1F385}\x{1F936}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F483}\x{1F57A}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F6C0}\x{1F6CC}\x{1F574}\x{1F3C7}\x{1F3C2}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}\x{1F933}\x{1F4AA}\x{1F9B5}\x{1F9B6}\x{1F448}\x{1F449}\x{261D}\x{1F446}\x{1F595}\x{1F447}\x{270C}\x{1F91E}\x{1F596}\x{1F918}\x{1F919}\x{1F590}\x{270B}\x{1F44C}\x{1F44D}\x{1F44E}\x{270A}\x{1F44A}\x{1F91B}\x{1F91C}\x{1F91A}\x{1F44B}\x{1F91F}\x{270D}\x{1F44F}\x{1F450}\x{1F64C}\x{1F932}\x{1F64F}\x{1F485}\x{1F442}\x{1F443}](?:\x{1F3FC})|[\x{1F476}\x{1F9D2}\x{1F466}\x{1F467}\x{1F9D1}\x{1F468}\x{1F469}\x{1F9D3}\x{1F474}\x{1F475}\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F934}\x{1F478}\x{1F473}\x{1F472}\x{1F9D5}\x{1F9D4}\x{1F471}\x{1F935}\x{1F470}\x{1F930}\x{1F931}\x{1F47C}\x{1F385}\x{1F936}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F483}\x{1F57A}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F6C0}\x{1F6CC}\x{1F574}\x{1F3C7}\x{1F3C2}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}\x{1F933}\x{1F4AA}\x{1F9B5}\x{1F9B6}\x{1F448}\x{1F449}\x{261D}\x{1F446}\x{1F595}\x{1F447}\x{270C}\x{1F91E}\x{1F596}\x{1F918}\x{1F919}\x{1F590}\x{270B}\x{1F44C}\x{1F44D}\x{1F44E}\x{270A}\x{1F44A}\x{1F91B}\x{1F91C}\x{1F91A}\x{1F44B}\x{1F91F}\x{270D}\x{1F44F}\x{1F450}\x{1F64C}\x{1F932}\x{1F64F}\x{1F485}\x{1F442}\x{1F443}](?:\x{1F3FB})|[\x{1F1E6}\x{1F1E7}\x{1F1E8}\x{1F1E9}\x{1F1F0}\x{1F1F2}\x{1F1F3}\x{1F1F8}\x{1F1F9}\x{1F1FA}](?:\x{1F1FF})|[\x{1F1E7}\x{1F1E8}\x{1F1EC}\x{1F1F0}\x{1F1F1}\x{1F1F2}\x{1F1F5}\x{1F1F8}\x{1F1FA}](?:\x{1F1FE})|[\x{1F1E6}\x{1F1E8}\x{1F1F2}\x{1F1F8}](?:\x{1F1FD})|[\x{1F1E6}\x{1F1E7}\x{1F1E8}\x{1F1EC}\x{1F1F0}\x{1F1F2}\x{1F1F5}\x{1F1F7}\x{1F1F9}\x{1F1FF}](?:\x{1F1FC})|[\x{1F1E7}\x{1F1E8}\x{1F1F1}\x{1F1F2}\x{1F1F8}\x{1F1F9}](?:\x{1F1FB})|[\x{1F1E6}\x{1F1E8}\x{1F1EA}\x{1F1EC}\x{1F1ED}\x{1F1F1}\x{1F1F2}\x{1F1F3}\x{1F1F7}\x{1F1FB}](?:\x{1F1FA})|[\x{1F1E6}\x{1F1E7}\x{1F1EA}\x{1F1EC}\x{1F1ED}\x{1F1EE}\x{1F1F1}\x{1F1F2}\x{1F1F5}\x{1F1F8}\x{1F1F9}\x{1F1FE}](?:\x{1F1F9})|[\x{1F1E6}\x{1F1E7}\x{1F1EA}\x{1F1EC}\x{1F1EE}\x{1F1F1}\x{1F1F2}\x{1F1F5}\x{1F1F7}\x{1F1F8}\x{1F1FA}\x{1F1FC}](?:\x{1F1F8})|[\x{1F1E6}\x{1F1E7}\x{1F1E8}\x{1F1EA}\x{1F1EB}\x{1F1EC}\x{1F1ED}\x{1F1EE}\x{1F1F0}\x{1F1F1}\x{1F1F2}\x{1F1F3}\x{1F1F5}\x{1F1F8}\x{1F1F9}](?:\x{1F1F7})|[\x{1F1E6}\x{1F1E7}\x{1F1EC}\x{1F1EE}\x{1F1F2}](?:\x{1F1F6})|[\x{1F1E8}\x{1F1EC}\x{1F1EF}\x{1F1F0}\x{1F1F2}\x{1F1F3}](?:\x{1F1F5})|[\x{1F1E6}\x{1F1E7}\x{1F1E8}\x{1F1E9}\x{1F1EB}\x{1F1EE}\x{1F1EF}\x{1F1F2}\x{1F1F3}\x{1F1F7}\x{1F1F8}\x{1F1F9}](?:\x{1F1F4})|[\x{1F1E7}\x{1F1E8}\x{1F1EC}\x{1F1ED}\x{1F1EE}\x{1F1F0}\x{1F1F2}\x{1F1F5}\x{1F1F8}\x{1F1F9}\x{1F1FA}\x{1F1FB}](?:\x{1F1F3})|[\x{1F1E6}\x{1F1E7}\x{1F1E8}\x{1F1E9}\x{1F1EB}\x{1F1EC}\x{1F1ED}\x{1F1EE}\x{1F1EF}\x{1F1F0}\x{1F1F2}\x{1F1F4}\x{1F1F5}\x{1F1F8}\x{1F1F9}\x{1F1FA}\x{1F1FF}](?:\x{1F1F2})|[\x{1F1E6}\x{1F1E7}\x{1F1E8}\x{1F1EC}\x{1F1EE}\x{1F1F2}\x{1F1F3}\x{1F1F5}\x{1F1F8}\x{1F1F9}](?:\x{1F1F1})|[\x{1F1E8}\x{1F1E9}\x{1F1EB}\x{1F1ED}\x{1F1F1}\x{1F1F2}\x{1F1F5}\x{1F1F8}\x{1F1F9}\x{1F1FD}](?:\x{1F1F0})|[\x{1F1E7}\x{1F1E9}\x{1F1EB}\x{1F1F8}\x{1F1F9}](?:\x{1F1EF})|[\x{1F1E6}\x{1F1E7}\x{1F1E8}\x{1F1EB}\x{1F1EC}\x{1F1F0}\x{1F1F1}\x{1F1F3}\x{1F1F8}\x{1F1FB}](?:\x{1F1EE})|[\x{1F1E7}\x{1F1E8}\x{1F1EA}\x{1F1EC}\x{1F1F0}\x{1F1F2}\x{1F1F5}\x{1F1F8}\x{1F1F9}](?:\x{1F1ED})|[\x{1F1E6}\x{1F1E7}\x{1F1E8}\x{1F1E9}\x{1F1EA}\x{1F1EC}\x{1F1F0}\x{1F1F2}\x{1F1F3}\x{1F1F5}\x{1F1F8}\x{1F1F9}\x{1F1FA}\x{1F1FB}](?:\x{1F1EC})|[\x{1F1E6}\x{1F1E7}\x{1F1E8}\x{1F1EC}\x{1F1F2}\x{1F1F3}\x{1F1F5}\x{1F1F9}\x{1F1FC}](?:\x{1F1EB})|[\x{1F1E6}\x{1F1E7}\x{1F1E9}\x{1F1EA}\x{1F1EC}\x{1F1EE}\x{1F1EF}\x{1F1F0}\x{1F1F2}\x{1F1F3}\x{1F1F5}\x{1F1F7}\x{1F1F8}\x{1F1FB}\x{1F1FE}](?:\x{1F1EA})|[\x{1F1E6}\x{1F1E7}\x{1F1E8}\x{1F1EC}\x{1F1EE}\x{1F1F2}\x{1F1F8}\x{1F1F9}](?:\x{1F1E9})|[\x{1F1E6}\x{1F1E8}\x{1F1EA}\x{1F1EE}\x{1F1F1}\x{1F1F2}\x{1F1F3}\x{1F1F8}\x{1F1F9}\x{1F1FB}](?:\x{1F1E8})|[\x{1F1E7}\x{1F1EC}\x{1F1F1}\x{1F1F8}](?:\x{1F1E7})|[\x{1F1E7}\x{1F1E8}\x{1F1EA}\x{1F1EC}\x{1F1F1}\x{1F1F2}\x{1F1F3}\x{1F1F5}\x{1F1F6}\x{1F1F8}\x{1F1F9}\x{1F1FA}\x{1F1FB}\x{1F1FF}](?:\x{1F1E6})|[\x{00A9}\x{00AE}\x{203C}\x{2049}\x{2122}\x{2139}\x{2194}-\x{2199}\x{21A9}-\x{21AA}\x{231A}-\x{231B}\x{2328}\x{23CF}\x{23E9}-\x{23F3}\x{23F8}-\x{23FA}\x{24C2}\x{25AA}-\x{25AB}\x{25B6}\x{25C0}\x{25FB}-\x{25FE}\x{2600}-\x{2604}\x{260E}\x{2611}\x{2614}-\x{2615}\x{2618}\x{261D}\x{2620}\x{2622}-\x{2623}\x{2626}\x{262A}\x{262E}-\x{262F}\x{2638}-\x{263A}\x{2640}\x{2642}\x{2648}-\x{2653}\x{2660}\x{2663}\x{2665}-\x{2666}\x{2668}\x{267B}\x{267E}-\x{267F}\x{2692}-\x{2697}\x{2699}\x{269B}-\x{269C}\x{26A0}-\x{26A1}\x{26AA}-\x{26AB}\x{26B0}-\x{26B1}\x{26BD}-\x{26BE}\x{26C4}-\x{26C5}\x{26C8}\x{26CE}-\x{26CF}\x{26D1}\x{26D3}-\x{26D4}\x{26E9}-\x{26EA}\x{26F0}-\x{26F5}\x{26F7}-\x{26FA}\x{26FD}\x{2702}\x{2705}\x{2708}-\x{270D}\x{270F}\x{2712}\x{2714}\x{2716}\x{271D}\x{2721}\x{2728}\x{2733}-\x{2734}\x{2744}\x{2747}\x{274C}\x{274E}\x{2753}-\x{2755}\x{2757}\x{2763}-\x{2764}\x{2795}-\x{2797}\x{27A1}\x{27B0}\x{27BF}\x{2934}-\x{2935}\x{2B05}-\x{2B07}\x{2B1B}-\x{2B1C}\x{2B50}\x{2B55}\x{3030}\x{303D}\x{3297}\x{3299}\x{1F004}\x{1F0CF}\x{1F170}-\x{1F171}\x{1F17E}-\x{1F17F}\x{1F18E}\x{1F191}-\x{1F19A}\x{1F201}-\x{1F202}\x{1F21A}\x{1F22F}\x{1F232}-\x{1F23A}\x{1F250}-\x{1F251}\x{1F300}-\x{1F321}\x{1F324}-\x{1F393}\x{1F396}-\x{1F397}\x{1F399}-\x{1F39B}\x{1F39E}-\x{1F3F0}\x{1F3F3}-\x{1F3F5}\x{1F3F7}-\x{1F3FA}\x{1F400}-\x{1F4FD}\x{1F4FF}-\x{1F53D}\x{1F549}-\x{1F54E}\x{1F550}-\x{1F567}\x{1F56F}-\x{1F570}\x{1F573}-\x{1F57A}\x{1F587}\x{1F58A}-\x{1F58D}\x{1F590}\x{1F595}-\x{1F596}\x{1F5A4}-\x{1F5A5}\x{1F5A8}\x{1F5B1}-\x{1F5B2}\x{1F5BC}\x{1F5C2}-\x{1F5C4}\x{1F5D1}-\x{1F5D3}\x{1F5DC}-\x{1F5DE}\x{1F5E1}\x{1F5E3}\x{1F5E8}\x{1F5EF}\x{1F5F3}\x{1F5FA}-\x{1F64F}\x{1F680}-\x{1F6C5}\x{1F6CB}-\x{1F6D2}\x{1F6E0}-\x{1F6E5}\x{1F6E9}\x{1F6EB}-\x{1F6EC}\x{1F6F0}\x{1F6F3}-\x{1F6F9}\x{1F910}-\x{1F93A}\x{1F93C}-\x{1F93E}\x{1F940}-\x{1F945}\x{1F947}-\x{1F970}\x{1F973}-\x{1F976}\x{1F97A}\x{1F97C}-\x{1F9A2}\x{1F9B0}-\x{1F9B9}\x{1F9C0}-\x{1F9C2}\x{1F9D0}-\x{1F9FF}]/u", "", $string);
    }

    /**
     * iterates over API trade log
     *
     * @method private _insertAPITradeLog($data, $userId)
     * @param  array $data   [API result]
     * @param  int   $userId [current userId]
     *
     * @return array [returns JSON-encoded array]
     */
    private function _insertAPITradeLog($data, $userId)
    {

        if ($userId != 0) {
            $tableBuilder = $this->createTable("tradeLog", $userId);
            $buildTable = $this->_conn->query($tableBuilder);

            $mostRecentTradeQuery = "SELECT `timestamp` FROM `userTradeLog_" .$userId. "` ORDER BY `timestamp` DESC LIMIT 1";
            $mostRecentTrade = $this->_conn->query($mostRecentTradeQuery);

            if ($mostRecentTrade->num_rows === 1) {
                while ($recentTradeData = $mostRecentTrade->fetch_assoc()) {
                    $mostRecentTradeTS = $recentTradeData["timestamp"];
                }
            } else {
                $mostRecentTradeTS = 0;
            }

            foreach ($data as $tradeAction) {
                $timestamp = $tradeAction["ts"];

                if ($timestamp > $mostRecentTradeTS) {
                    $query = "INSERT INTO `userTradeLog_" .$userId. "` (`timestamp`, `event`, `amount`, `price`, `transportCost`, `itemId`, `actor`, `actorLevel`) VALUES ";

                    switch ($tradeAction["event"]) {
                    case "buy":
                        $event = $sellValue = 0;
                        $buyValue = $tradeAction["amount"] * $tradeAction["ppstk"];
                        $transportCost = $tradeAction["transcost"];
                        break;
                    case "sell":
                        $event = 1;
                        $buyValue = $transportCost = 0;
                        $sellValue = $tradeAction["amount"] * $tradeAction["ppstk"];
                        break;
                    }

                    $tradingUserName = $this->_removeEmojis($tradeAction["username"]);
                    $tradingPartnerLevel = $tradeAction["ulvl"];

                    $itemId = $this->_convertOfficialIdToInternalId($tradeAction["itemID"]);

                    $query .= "(
                    " .$timestamp. ",
                    "  .$event. ",
                    " .$tradeAction["amount"]. ",
                    " .$tradeAction["ppstk"]. ",
                    " .$tradeAction["transcost"]. ",
                    " .$itemId. ",
                    '" .$tradingUserName. "',
                    " .$tradingPartnerLevel. "
                    );";

                    $insertIntoIndex = $this->_insertUserToIndex($timestamp, $tradingUserName, $tradingPartnerLevel, $userId, $sellValue, $buyValue, $transportCost);
                    $insertion = $this->_conn->query($query);
                }
            }
        }

        $answer["callback"] = "rHelper.methods.API_getTradeLog()";

        return json_encode($answer);
    }

    /**
     * iterates over API mission information
     *
     * @method private _insertAPIMissions($data, $userId)
     * @param  array $data   [API result]
     * @param  int   $userId [current userId]
     *
     * @return array [returns JSON-encoded array]
     */
    private function _insertAPIMissions($data, $userId)
    {
        if ($userId != 0) {
            $tableBuilder = $this->createTable("missions", $userId);
            $buildTable = $this->_conn->query($tableBuilder);

            $result = [];

            foreach ($data as $mission) {
                $id = $mission["questID"];
                $startTimestamp = $mission["starttime"];
                $endTimestamp = $mission["endtime"];
                $progress = $mission["progress"];
                $goal = $mission["missiongoal"];
                $cooldown = time("now") +  $mission["cooldown"];
                $rewardAmount = $mission["rewardamount"];
                $penalty = $mission["penalty"];
                $status = $mission["status"];

                $checkExistingMissionQuery = "SELECT * FROM `userMissions_" .$userId. "` WHERE `id` = " .$id. "";
                $checkExistingMission = $this->_conn->query($checkExistingMissionQuery);

                if ($checkExistingMission->num_rows === 0) {
                    $query = "INSERT INTO `userMissions_" .$userId. "` (`id`, `startTimestamp`, `endTimestamp`, `progress`, `goal`, `cooldown`, `rewardAmount`, `penalty`, `status`) VALUES ";

                    $query .= "(
                    " .$id. ",
                    " .$startTimestamp. ",
                    " .$endTimestamp. ",
                    " .$progress. ",
                    " .$goal. ",
                    " .$cooldown. ",
                    " .$rewardAmount. ",
                    " .$penalty. ",
                    " .$status. "
                    );";
                } else {

                    $query = "UPDATE `userMissions_" .$userId. "`
                    SET `startTimestamp` = " .$startTimestamp. ",
                    `endTimestamp` = " .$endTimestamp. ",
                    `progress` = " .$progress. ",
                    `goal` = " .$goal. ",
                    `cooldown` =   " .$cooldown. ",
                    `rewardAmount` = " .$rewardAmount. ",
                    `penalty` = " .$penalty. ",
                    `status` = " .$status. "
                    WHERE `id` = " .$id. "";
                }

                $setMission = $this->_conn->query($query);

                if ($startTimestamp != 0) {
                    $startTimestamp = $this->_convertUnixTimestampToDateTime($startTimestamp);
                }

                if ($endTimestamp != 0) {
                    $endTimestamp = $this->_convertUnixTimestampToDateTime($endTimestamp);
                }

                $result[$id] = [
                  "startData" => [
                    "dateTime" => $starTimeStamp,
                    "timestamp" => $mission["starttime"],
                  ],
                  "endData" => [
                    "dateTime" => $endTimestamp,
                    "timestamp" => $mission["endtime"],
                  ],
                  "progress" => $progress,
                  "goal" => $goal,
                  "cooldown" => $cooldown,
                  "rewardAmount" => $rewardAmount,
                  "penalty" => $penalty,
                  "status" => $status,
                ];
            }
        }

        $answer["callback"] = "rHelper.methods.API_getMissions()";

        return json_encode($answer);
    }

    /**
     * iterates over API attack log information
     *
     * @method private _insertAPIAttackLog($data, $userId)
     * @param  array $data   [API result]
     * @param  int   $userId [current userId]
     *
     * @return bool [returns true/false for insertion success]
     */
    private function _insertAPIAttackLog($data, $userId)
    {
        if ($userId != 0) {
            $tableBuilder = $this->createTable("attackLog", $userId);
            $createTable = $this->_conn->query($tableBuilder);

            $mostRecentAttackQuery = "SELECT `timestamp` FROM `userAttackLog_" .$userId. "` ORDER BY `timestamp` DESC LIMIT 1";
            $mostRecentAttack = $this->_conn->query($mostRecentAttackQuery);

            if ($mostRecentAttack->num_rows === 1) {
                while ($recentAttackData = $mostRecentAttack->fetch_assoc()) {
                    $mostRecentAttackTS = $recentAttackData["timestamp"];
                }
            } else {
                $mostRecentAttackTS = 0;
            }

            foreach ($data as $attack) {
                $timestamp = $attack["unixts"];

                if ($timestamp > $mostRecentAttackTS) {
                    $query = "INSERT INTO `userAttackLog_" .$userId. "` (
                    `target`, `targetLevel`, `timestamp`,
                    `aUnit1`, `aUnit2`, `aUnit3`,
                    `dUnit1`, `dUnit2`, `dUnit3`,
                    `aUnit1Price`, `aUnit2Price`, `aUnit3Price`,
                    `dUnit1Price`, `dUnit2Price`, `dUnit3Price`,
                    `lat`, `lon`,
                    `action`, `result`, `factor`,
                    `lootId1`, `lootQty1`, `lootPrice1`,
                    `lootId2`, `lootQty2`, `lootPrice2`,
                    `worth`, `profit`) VALUES ";

                    switch ($attack["result"]) {
                    case "won":
                        $outcome = 1;
                        break;
                    case "lost": default:
                            $outcome = 0;
                        break;
                    }

                    // convert officially recieved ID to internal ID, then convert it to the old structure
                    $currentPrice1Id = $this->_convertOfficialIdToInternalId($attack["loot1ItemID"]);
                    $currentPrice2Id = $this->_convertOfficialIdToInternalId($attack["loot2ItemID"]);

                    $oldPrice1Id = $this->_convertInternalIdToOldStructure($currentPrice1Id);
                    $oldPrice2Id = $this->_convertInternalIdToOldStructure($currentPrice2Id);

                    $relPrice1 = $this->_returnRelativePrice($oldPrice1Id, $timestamp);

                    $worthItem1 = $attack["loot1ItemQty"] * $relPrice1;

                    if ($oldPrice2Id != -1) {
                        $relPrice2 = $this->_returnRelativePrice($oldPrice2Id, $timestamp);
                        $worthItem2 = $attack["loot2ItemQty"] * $relPrice2;
                    } else {
                        $worthItem2 = $attack["loot2ItemQty"];
                        $relPrice2 = 1;
                    }

                    $worth = $worthItem1 + $worthItem2;

                    if (is_numeric($attack["lootfactor"])) {
                        $lootfactor = $attack["lootfactor"];
                    } else {
                        $lootfactor = 0;
                    }

                    $attackungUnitPrices = [
                        $this->_returnRelativePrice(24, $timestamp),
                        $this->_returnRelativePrice(17, $timestamp),
                        $this->_returnRelativePrice(37, $timestamp)
                    ];

                    $defendingUnitPrices = [
                        $this->_returnRelativePrice(54, $timestamp),
                        $this->_returnRelativePrice(55, $timestamp),
                        $this->_returnRelativePrice(14, $timestamp)
                    ];

                    $profit = 0;

                    if ($outcome === 1) {
                        $profit = $worth;

                        for ($i = 1; $i <= 3; $i += 1) {
                            $profit -= $attackungUnitPrices[($i-1)] * $attack["AQtyUnit" .$i. ""];
                        }
                    } else {
                        for ($i = 1; $i <= 3; $i += 1) {
                            $profit -= $attackungUnitPrices[($i-1)] * $attack["AQtyUnit" .$i. ""];
                        }
                    }

                    $query .= "('" .$attack["targetUserName"]. "',
                    " .$attack["targetUserLevel"]. ",
                    " .$timestamp. ",
                    " .$attack["AQtyUnit1"]. ",
                    " .$attack["AQtyUnit2"]. ",
                    " .$attack["AQtyUnit3"]. ",
                    " .$attack["DQtyUnit1"]. ",
                    " .$attack["DQtyUnit2"]. ",
                    " .$attack["DQtyUnit3"]. ",
                    " .$attackungUnitPrices[0]. ",
                    " .$attackungUnitPrices[1]. ",
                    " .$attackungUnitPrices[2]. ",
                    " .$defendingUnitPrices[0]. ",
                    " .$defendingUnitPrices[1]. ",
                    " .$defendingUnitPrices[2]. ",
                    " .$attack["lat"]. ",
                    " .$attack["lon"]. ",
                    '" .$attack["act"]. "',
                    " .$outcome. ",
                    " .$lootfactor. ",
                    " .$currentPrice1Id. ",
                    " .$attack["loot1ItemQty"]. ",
                    " .$relPrice1. ",
                    " .$currentPrice2Id. ",
                    " .$attack["loot2ItemQty"]. ",
                    " .$relPrice2. ",
                    " .$worth. ",
                    " .$profit. ");";

                    $insertion = $this->_conn->query($query);
                    $insertIntoIndex = $this->_insertUserToIndex($timestamp, $attack["targetUserName"], $attack["targetUserLevel"], $userId, 0, 0, 0);
                }
            }
        }

        $answer["callback"] = "rHelper.methods.API_getAttackLog(\"attackSimple\")";

        return json_encode($answer);
    }

    /**
     * iterates over API mineMap data
     *
     * @method private _insertAPIMineMap($url, $userId)
     * @param  array $url    [API url]
     * @param  int   $userId [current userId]
     *
     * @return bool [returns true]
     */
    private function _insertAPIMineMap($url, $userId)
    {
        $tableBuilder = $this->createTable("mineMap", $userId);
        $buildTable = $this->_conn->query($tableBuilder);

        if ($userId != 0) {
            $killFormerContentQuery = "DELETE FROM `userMineMap_" .$userId. "`";
            $killFormerContent = $this->_conn->query($killFormerContentQuery);
        }

        include 'JsonStreamingParser/Listener.php';
        include 'JsonStreamingParser/Parser.php';
        include 'JsonStreamingParser/Listener/IdleListener.php';
        include 'JsonStreamingParser/Listener/InMemoryListener.php';

        $listener = new \JsonStreamingParser\Listener\InMemoryListener();
        $stream = fopen($url, 'r');
        try {
            $parser = new \JsonStreamingParser\Parser($stream, $listener);
            $parser->parse($this->_conn, $userId);
            fclose($stream);
        } catch (Exception $e) {
            fclose($stream);
            throw $e;
        }

        /*
        rearrange table by builddate
        */
        $orderTableQuery = "ALTER TABLE `userMineMap_" .$userId. "` ORDER BY  `builddate`";
        $sortTable = $this->_conn->query($orderTableQuery);

        if ($userId != 0) {

            /*
            count mines within HQ by counting HQBoosted mines
            */

            $countHQMinesQuery = "SELECT COUNT(  `rawRate` ) AS  `minesInHQ`, `HQBoost` FROM  `userMineMap_" .$userId. "` WHERE  `HQBoost` > 1";
            $countHQMines = $this->_conn->query($countHQMinesQuery);

            if ($countHQMines->num_rows === 1) {
                while ($data = $countHQMines->fetch_assoc()) {
                    $hqMines = $data["minesInHQ"];
                    $hqBoost = $data["HQBoost"];
                }
            }

            /*
            update userHQ information based on recent result
            */
            $updateUserHeadquarterQuery = "SELECT `id` FROM `userHeadquarter` WHERE `id` = " .$userId. "";
            $updateUserHeadquarter = $this->_conn->query($updateUserHeadquarterQuery);

            if ($updateUserHeadquarter->num_rows === 0) {
                switch ($hqBoost) {
                case 1.9:
                    $hqLevel = 1;
                    break;
                case 2.8:
                    $hqLevel = 2;
                    break;
                case 3.7:
                    $hqLevel = 3;
                    break;
                case 4.6:
                    $hqLevel = 4;
                    break;
                case 5.5:
                    $hqLevel = 5;
                    break;
                case 6.4:
                    $hqLevel = 6;
                    break;
                case 7.3:
                    $hqLevel = 7;
                    break;
                case 8.2:
                    $hqLevel = 8;
                    break;
                case 9.1:
                    $hqLevel = 9;
                    break;
                case 10:
                    $hqLevel = 10;
                    break;
                default:
                    $hqLevel = 1;
                    break;
                }
                $insertionQuery = "INSERT INTO `userHeadquarter` (`id`, `level`, `mineCount`) VALUES(" .$userId. ", " .$hqLevel. ", " .$hqMines. ");";
            } else {
                $insertionQuery = "UPDATE `userHeadquarter` SET `mineCount` = " .$hqMines. " WHERE `id` = " .$userId. "";
            }

            $insertion = $this->_conn->query($insertionQuery);
        }

        $answer["callback"] = "rHelper.methods.API_getMineMap()";

        return json_encode($answer);
    }

    /**
     * answer generator for frontend
     *
     * @method public getAPIData($query, $key, $userId)
     * @param  int   $query  [query Id]
     * @param  mixed $key    [user API key]
     * @param  int   $userId [current userId]
     *
     * @return int [returns JSON-encoded array or original data]
     */
    public function getAPIData($query, $key, $userId, $anonymity)
    {
        $url = 'https://www.resources-game.ch/resapi/?q=' . $query . '&f=1&d=30&l=en&k=' . $key;

        $time = time('now');
        $hashedKey = md5($key);

        if ($query != 5) {
            $arrContextOptions = [
              'ssl' => [
                  'verify_peer' => false,
                  'verify_peer_name' => false
              ],
            ];

            $data = file_get_contents($url, false, stream_context_create($arrContextOptions));
            $decoded_data = json_decode($data, true);
        }

        switch ($query) {
        case 0: // credits - STABLE
            if ($userId != 0) {
                $query = "UPDATE `userOverview` SET `lastUpdate` = " .$time. ", `remainingCredits` = " .$decoded_data[0]["creditsleft"]. " WHERE `id` = " .$userId. "";
                $updateUserOverview = $this->_conn->query($query);
            }
            return $data;
            break;
        case 1: // factory - STABLE
            $convertAPIData = $this->_insertAPIFactoryData($decoded_data, $userId);
            return $convertAPIData;
            break;
        case 2: // warehouse - STABLE
            $convertAPIData = $this->_insertAPIWarehouseData($decoded_data, $userId);
            return $convertAPIData;
            break;
        case 3: // special buildings - STABLE
            $convertAPIData = $this->_insertAPIBuildingsData($decoded_data, $userId);
            return $convertAPIData;
            break;
        case 4: // headquarter - STABLE
            $convertAPIData = $this->_insertAPIHeadquarterData($decoded_data, $userId);
            return $convertAPIData;
            break;
        case 5: // mines => mineMap - STABLE
            $convertAPIData = $this->_insertAPIMineMap($url, $userId);
            return $convertAPIData;
            break;
        case 51: // mines summary - STABLE
            $convertAPIData = $this->_insertAPIMineSummary($decoded_data, $userId);
            return $convertAPIData;
            break;
        case 6: // tradeLog
            $convertAPIData = $this->_insertAPITradeLog($decoded_data, $userId);
            return $convertAPIData;
            break;
        case 7: // player information - STABLE
            $convertAPIData = $this->_insertAPIPlayerInformation($decoded_data, $userId, $anonymity);
            return $convertAPIData;
            break;
        case 9: // attackLog - STABLE
            $convertAPIData = $this->_insertAPIAttackLog($decoded_data, $userId);
            return $convertAPIData;
            break;
        case 10: // missions - STABLE
            $convertAPIData = $this->_insertAPIMissions($decoded_data, $userId);
            return $convertAPIData;
            break;
        }

        $query = "UPDATE `userOverview` SET `lastUpdate` = " .$time. ", `hashedKey` = '" .$hashedKey. "' WHERE `id` = '" .$userId. "'";
        $refreshLastUpdate = $this->_conn->query($query);
    }

    /**
     * answer generator for frontend
     *
     * @method public getUserHeadquarter($baseData, $userId)
     * @param  array $baseData [previously generated array to modify]
     * @param  int   $userId   [current userId]
     * @return array [returns modified array]
     */
    public function getUserHeadquarter($baseData, $userId)
    {
        $query = "SELECT * FROM `userHeadquarter` WHERE `id` = " .$userId. "";

        $getUserHeadquarter = $this->_conn->query($query);

        if ($getUserHeadquarter->num_rows === 1) {
            while ($data = $getUserHeadquarter->fetch_assoc()) {

                $baseData["user"] = [
                  "hqPosition" => [
                    "lat" => $data["lat"],
                    "lon" => $data["lon"],
                  ],
                  "level" => $data["level"],
                  "paid" => [
                    0,
                    0,
                    0,
                    0
                  ],
                ];

                for ($i = 0; $i <= 3; $i += 1) {
                    $baseData["user"]["paid"][$i] = $data["progress" .$i. ""];
                }
            }
        }

        return $baseData;
    }

    /**
     * inserts or updates a player within the userIndex table
     *
     * @method private _insertUserToIndex($lastSeen, $tradingPartner, $tradingPartnerLevel, $userId, $sellValue, $buyValue)
     * @param  int    $lastSeen            [timestamp of interaction]
     * @param  string $tradingPartner      [userName to be inserted or updated]
     * @param  int    $tradingPartnerLevel [userLevel to be inserted or updated]
     * @param  int    $userId              [current userId from which this interaction was logged with]
     * @param  int    $sellValue           [depending on action - 0 or int]
     * @param  int    $buyValue            [depending on action - 0 or int]
     * @param  int    $transportCost       [only when $buyvalue > 0, else is 0]
     *
     * @return bool [true/false]
     */
    private function _insertUserToIndex($lastSeen, $tradingPartner, $tradingPartnerLevel, $userId, $sellValue, $buyValue, $transportCost)
    {
        $transformIdToNameQuery = "SELECT `name` FROM `userOverview` WHERE `id` = " .$userId. "";
        $transformIdToName = $this->_conn->query($transformIdToNameQuery);

        if ($transformIdToName->num_rows === 1) {
            while ($data = $transformIdToName->fetch_assoc()) {
                $actingUser = $data["name"];
            }
        } else {
            $actingUser = "";
        }

        $checkExistingQuery = "SELECT `lastSeen`, `lastTradedWith` FROM `userIndex` WHERE `userName` = '" .$tradingPartner. "'";
        $checkExisting = $this->_conn->query($checkExistingQuery);

        if ($checkExisting->num_rows > 0) {

            // check for previous entry
            while ($data = $checkExisting->fetch_assoc()) {
                $lastSeenDB = $data["lastSeen"];
                $lastKnownTradingPartner = $data["lastTradeWith"];
            }

            // lastSeen must always be close to now than 0
            if ($lastSeenDB > $lastSeen) {
                $lastSeen = $lastSeenDB;
            }

            // update entry
            $query = "UPDATE `userIndex` SET `userLevel` = " .$tradingPartnerLevel. ", `lastSeen` = " .$lastSeen. ", `lastTradedWith` = '" .$actingUser. "', `sell` = `sell` + " .$sellValue. ", `buy` = `buy` + " .$buyValue. ", `transportCost` = `transportCost` + " .$transportCost. " WHERE `userName` = '" .$tradingPartner. "';";
        } else {
            // insert new unique user
            $query = "INSERT INTO `userIndex` (
            `userName`, `userLevel`,
            `firstSeen`, `lastSeen`, `lastTradedWith`,
            `sell`, `buy`, `transportCost`) VALUES(
            '" .$tradingPartner. "', " .$tradingPartnerLevel. ",
            " .$lastSeen. ", " .$lastSeen. ", '" .$actingUser. "',
            " .$sellValue. ", " .$buyValue. ", " .$transportCost. "
            );";
        }

        $insertion = $this->_conn->query($query);

        if ($insertion) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * fetches language content based on user setting
     *
     * @return array [localization data]
     */
    public function getUserLocale($language)
    {
        $result = [];
        $i = 0;

        $language_slug = self::LANGUAGES[$language];

        $stmt = "SELECT `target`, `" .$language_slug. "` FROM `localization`";

        $getLanguage = $this->_conn->query($stmt);
        if ($getLanguage->num_rows > 0) {
            while ($data = $getLanguage->fetch_assoc()) {
                $result[$data["target"]] = $data[$language_slug];
            }
        }

        $result["q"] = $stmt;

        return $result;

    }
}
