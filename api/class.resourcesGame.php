<?php

/**
 * resourcesGame contains all methods for this page
 *
 * @method mixed resourcesGame
 **/

 class resourcesGame
 {
     /**
      * @var object $host host adress
      */
     private $host;
     /**
      * @var object $user user
      */
     private $user;
     /**
      * @var object $pw password
      */
     private $pw;
     /**
      * @var object $db database
      */
     private $db;

     /**
      * @var object $conn is the global mysqli object
      */
     private $conn;

     /**
      * @var array $prices contains all prices returned by @method private getAllPrices()
      */
     private $prices;

     /**
     * queries also function as table names
     * also defines min max indices for each subgroup of exported JSON as well as their access points for JavaScript and their localizationTab
      *
      * @var     array TABLE_NAMES [defines possible time intervals for display; these names are case-sensitive for JavaScript access]
      * @example resourcse => min = 0, max = 13, length = 14, outputName = material, localizationTable = materialNames
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
       "customTU" => 0,
       "idealCondition" => 0,
       "factoryNames" => 0,
       "transportCostInclusion" => 0,
       "numbers" => 0,
       "mapVisibleHQ" => 0
     ];


     /**
      * builds an array out of a array string
      *
      * @method  private convertArrayStringToArray($string)
      * @param   int|mixed $string [some array concatenated as string with ","]
      * @example $string = "1,2,3"; => $result = [1, 2, 3];
      * @return  array [returns converted array]
      */
     private function convertArrayStringToArray($string)
     {
         $array = [];
         $explode = explode(",", $string);
         foreach ($explode as $dataset) {
             array_push($array, $dataset);
         }
         return $array;
     }

     /**
      * establishes database connection and points it to $this->conn
      *
      * @method private DBConnection()
      * @return mixed [returns $this->conn as new mysqli()]
      */
     private function DBConnection()
     {
         try {
             $conn = new mysqli($this->host, $this->user, $this->pw, $this->db);
             $conn->set_charset("utf8mb4");
             $this->conn = $conn;
         } catch (Exception $e) {
             echo "DB Connection failed: ", $e->getMessage() , "\n";
         }

         return $conn;
     }

     /**
      * - construct obj with $this as database connection
      * - fetch all prices as they are always required upon calling this class
      *
      * @method public __construct($host, $user, $pw, $db)
      * @param  mixed $host [server to connect to]
      * @param  mixed $user [user to connect as]
      * @param  mixed $pw   [password to connect with]
      * @param  mixed $db   [database to select]
      * @return mixed [returns $this->conn as new mysqli() and $this->prices as global price array]
      */
     public function __construct($host, $user, $pw, $db, $prices)
     {
         $this->host = $host;
         $this->user = $user;
         $this->pw = $pw;
         $this->db = $db;

         $this->conn = $this->DBConnection();

         if($prices == "on") {
           $this->prices = $this->getAllPrices();
         }
     }

     /**
      * builds base queries for general game data
      *
      * @method  private getBaseQuery($type)
      * @param   mixed $type [type of query to be fetched]
      * @example resources, factories, loot, units, headquarter, settings
      * @return  array [returns modified array]
      */
     private function getBaseQuery($type)
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
             $stmt.= "`requirements`, `requiredAmount`";
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
      * @method  private convertInternalIdToOldStructure($id)
      * @param   int $id [type of query to be fetched]
      * @example 42 => 1
      * @return  int [returns modified id]
      */
     private function convertInternalIdToOldStructure($id)
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
      * @method  private getAllPrices()
      * @example type examples: resources, factories, loot, units
      * @return  array [global price array $this->prices]
      */
     private function getAllPrices()
     {
         $prices = [
             "resources" => [],
             "factories" => [],
             "loot" => [],
             "units" => []
         ];

         foreach (self::TABLE_NAMES as $arrayIndex => $minMax) {
             $globalIndex = 0;

             for ($index = $minMax["min"]; $index <= $minMax["max"]; $index += 1) {
                 $query = "SELECT * FROM ";

                 $officialId = $this->convertInternalIdToOldStructure($index);

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

                 $getPrices = $this->conn->query($query);

                 if ($getPrices->num_rows > 0) {
                     while ($result = $getPrices->fetch_assoc()) {
                         foreach (self::PRICE_INTERVALS as $interval => $seconds) {
                             $prices[$arrayIndex][$globalIndex][$interval]["ai"] = round($result[$index. "_" .$interval. "_ai"]);
                             $prices[$arrayIndex][$globalIndex][$interval]["player"] = round($result[$index. "_" .$interval. "_player"]);
                         }
                     }
                 } else {
                     foreach (self::PRICE_INTERVALS as $interval => $seconds) {
                         $prices[$arrayIndex][$globalIndex][$interval]["ai"] = 0;
                         $prices[$arrayIndex][$globalIndex][$interval]["player"] = 0;
                     }
                 }

                 $globalIndex += 1;
             }
         }

         return $prices;
     }

     /**
      * swaps officially recieved IDs to the internal ID
      * - official IDs are globally sorted alphabetically, ascending, German
      * - internal Ids are ordered by:
      * 1. resources => identical to in-game unlock order
      * 2. products => identical to in-game unlock order of factories
      * 3. loot & units => ordered alphabetically, English
      *
      * @method  private convertOfficialIdToInternalId($id)
      * @param   int $id [official, API-bound Id]
      * @example 57 => 42
      * @return  int [returns converted Id]
      */
     private function convertOfficialIdToInternalId($id)
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
      * @method  private returnBaseData($query, $type)
      * @param   mixed  $query [generated SQL query]
      * @param   string $type  [type information]
      * @example $type examples: resources, factories, loot, units, headquarter, buildings, settings
      * @return  array [returns corresponding baseData]
      */
     private function returnBaseData($query, $type)
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

         $getData = $this->conn->query($query);

         if ($getData->num_rows > 0) {
             $image = 0;
             $globalIndex = 0;

             while ($data = $getData->fetch_assoc()) {
                 /*
                 DB stores arrays as comma-separated strings => convert them to array before appending
                 */
                 foreach ($data as $index => $dataset) {
                     if (strpos($dataset, ",") !== false) {
                         $data[$index] = $this->convertArrayStringToArray($dataset);
                     }
                 }

                 if ($imgClass !== "hq" && $imgClass !== "building" && $imgClass !== "settings") {

                     /*
                     adds prices
                     */
                     foreach (self::PRICE_INTERVALS as $interval => $seconds) {
                         $data["prices"][$interval] = $this->prices[$type][$globalIndex][$interval];
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
      * helper function for getBaseQuery
      *
      * @method  public returnBaseData($type)
      * @param   string $type [type information]
      * @example $type examples: resources, factories, loot, units, headquarter, buildings, settings
      * @return  array [returns corresponding baseData]
      */
     public function getRawData($type)
     {
         $query = $this->getBaseQuery($type);

         return $this->returnBaseData($query, $type);
     }

     /**
      * sets or fetches user settings from userSettings depending on $_SESSION["id"]
      *
      * @method public getUserSettings($baseData, $userId)
      * @param  array $baseData [pregenerated array to iterate over]
      * @param  int   $userId   [current user Id]
      * @return array [returns corresponding user settings]
      */
     public function getUserSettings($baseData, $userId)
     {
         $stmt = "SELECT * FROM `userSettings` WHERE `id` = " .$userId. "";

         $query = $this->conn->query($stmt);

         if ($query->num_rows === 1) {
             while ($data = $query->fetch_assoc()) {
                 $baseData[0]["value"] = self::LANGUAGES[$data["lang"]];
                 $baseData[1]["value"] = $this->convertArrayStringToArray($data["customTU"]);
                 $baseData[2]["value"] = $data["idealCondition"];
                 $baseData[3]["value"] = $data["transportCostInclusion"];
                 $baseData[4]["value"] = $data["mapVisibleHQ"];
                 $baseData[5]["value"] = $data["priceAge"];
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
      * @return array [returns corresponding user settings]
      */
     public function getUserSpecialBuildings($baseData, $userId)
     {
         $query = "SELECT * FROM `userBuildings` WHERE `id` = " .$userId. "";

         $getUserBuildings = $this->conn->query($query);

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
      * @return array [returns modified $baseData]
      */
     public function getUserMaterials($baseData, $userId)
     {
         $query = "SELECT * FROM `userMaterial` WHERE `id` = " .$userId. "";

         $getUserMaterial = $this->conn->query($query);

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
      * @method private convertIndexToSubarray($index)
      * @param  int $index [current index to iterate over]
      * @return array [array including referenced subArray and position with in that array]
      */
     private function convertIndexToSubarray($index)
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
      * @return array [returns modified $baseData]
      */
     public function getUserFactories($baseData, $userId)
     {
         $query = "SELECT * FROM `userFactories` WHERE `id` = " .$userId. "";

         $getUserFactories = $this->conn->query($query);

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
      * @return array [returns modified $baseData]
      */
     public function getUserWarehouseContent($baseData, $userId)
     {
         $query = "SELECT * FROM `userWarehouse` WHERE `id` = " .$userId. "";

         $getUserWarehouse = $this->conn->query($query);

         if ($getUserWarehouse->num_rows > 0) {
             while ($data = $getUserWarehouse->fetch_assoc()) {
                 foreach ($data as $key => $value) {
                     $index = preg_replace("/[^0-9]/", "", $key);

                     if (is_numeric($index)) {
                         $subArrayData = $this->convertIndexToSubarray($index);
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
      * @method private convertUnixTimestampToDateTime($unixts)
      * @param  int $unixts [10 digit long unix ts (seconds)]
      * @return mixed [returns formatted dateTime]
      */
     private function convertUnixTimestampToDateTime($unixts)
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

         $getUserInfo = $this->conn->query($query);

         $result = [];

         if ($getUserInfo->num_rows === 1) {
             while ($data = $getUserInfo->fetch_assoc()) {
                 foreach ([
                 "hashedKey" => $data["hashedKey"],
                 "realKey" => $data["realKey"]
                 ] as $index => $key) {
                     if ($key === "") {
                         $key = false;
                     }
                     $result[$index] = $key;
                 }

                 foreach (
                 ["registeredPage" => $data["registeredPage"],
                 "registeredGame" => $data["registeredGame"],
                 "lastUpdate" => $data["lastUpdate"]
                 ] as $index => $timestamp) {
                     $result[$index] = $this->convertUnixTimestampToDateTime($timestamp);
                 }

                 foreach ([
                 "remainingCredits" => $data["remainingCredits"],
                 "mail" => $data["mail"],
                 "name" => $data["name"],
                 "points" => $data["points"],
                 "rank" => $data["rank"],
                 "level" => $data["level"]
                 ] as $index => $value) {
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
               `rewardAmount` int(15) NOT NULL,
               `penalty` bigint(15) NOT NULL,
               `status` tinyint(1) NOT NULL,
               UNIQUE KEY `id` (`id`)
               ) DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
             break;
         }

         return $query;
     }

     /**
      * fetches attackLog depending on current $_SESSION["id"]
      *
      * @method public getAttackLog($userId)
      * @param  int $userId [current user id]
      * @return array [returns attackLog]
      */
     public function getAttackLog($userId)
     {
         $result = [];

         $query = "SELECT `target`, `targetLevel`, `timestamp`, `aUnit1`, `aUnit2`, `aUnit3`, `dUnit1`, `dUnit2`, `dUnit3`, `aUnit1Price`, `aUnit2Price`, `aUnit3Price`, `dUnit1Price`, `dUnit2Price`, `dUnit3Price`, `lat`, `lon`, `action`, `result`, `factor`, `lootId1`, `lootId2`, `lootQty1`, `lootQty2`, `lootPrice1`, `lootPrice2`, `worth`, `profit` FROM `userAttackLog_" .$userId. "`";

         $getAttackLog = $this->conn->query($query);

         if ($getAttackLog->num_rows > 0) {
             while ($data = $getAttackLog->fetch_assoc()) {
                 array_push($result, $data);
             }
         }

         return $result;
     }

     /**
      * fetches personalMineMap depending on current $_SESSION["id"]
      *
      * @method public getPersonalMineMap($userId)
      * @param  int $userId [current user id]
      * @return array [returns personalMineMap]
      */
     public function getPersonalMineMap($userId)
     {
         $result = [];

         $query = "SELECT * FROM `userMineMap_" .$userId. "`";

         $getUserMineMap = $this->conn->query($query);

         if ($getUserMineMap->num_rows > 0) {
             while ($data = $getUserMineMap->fetch_assoc()) {
                 array_push($result, $data);
             }
         }

         return $result;
     }

     /**
      * fetches missions depending on current $_SESSION["id"]
      *
      * @method public getMissions($userId)
      * @param  int $userId [current user id]
      * @return array [returns missions]
      */
     public function getMissions($userId)
     {
         $result = [];

         $query = "SELECT * FROM `userMissions_" .$userId. "`";

         $getMissions = $this->conn->query($query);

         if ($getMissions->num_rows > 0) {
             while ($data = $getMissions->fetch_assoc()) {
                 $data["img"] = "missions/" .$data["id"]. ".png";
                 array_push($result, $data);
             }
         }

         return $result;
     }

     /**
      * fetches tradeLog depending on current $_SESSION["id"]
      *
      * @method public getTradeLog($userId)
      * @param  int $userId [current user id]
      * @return array [returns tradeLog]
      */
     public function getTradeLog($userId)
     {
         $result = [];

         $query = "SELECT `timestamp`, `event`, `amount`, `price`, `transportCost`, `itemId`, `actor`, `actorLevel` FROM `userTradeLog_" .$userId. "` ORDER BY `timestamp` DESC";

         $getTradeLog = $this->conn->query($query);

         if ($getTradeLog->num_rows > 0) {
             while ($data = $getTradeLog->fetch_assoc()) {
                 array_push($result, $data);
             }
         }

         return $result;
     }

     /**
      * iterates over whole $baseData to insert fetched language variables; or sets default self::TABLE_NAMES[0]
      *
      * @method public getLanguageVariables($userId)
      * @param  array $baseData [complete $baseData]
      * @return array [returns modified $baseData array]
      */
     public function getLanguageVariables($baseData)
     {
         /*
         get name from previous set setting
         */
         $language = $baseData["settings"][0]["value"];

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

             $getLanguage = $this->conn->query($query);

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
      * @method private fillUpArrayWithZeroes($array, $supposedLength)
      * @param  array  $array          [API result]
      * @param  int    $supposedLength [supposed length of array to check against]
      * @param  string $type           ["noarray" for $array not containing a subarray, else "warehouse" or "mineSummary"]
      * @return array [returns modified array]
      */
     private function fillUpArrayWithZeroes($array, $supposedLength, $type)
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
      * @method private insertAPIFactoryData($data, $userId)
      * @param  array $data   [API result]
      * @param  int   $userId [current userId]
      * @return mixed [returns JSON-encoded array]
      */
     private function insertAPIFactoryData($data, $userId)
     {
         $factoryArray = [];
         foreach ($data as $factory) {
             $factoryId = $this->convertOfficialIdToInternalId($factory["factoryID"]) - self::TABLE_NAMES["factories"]["min"];
             $factoryArray[$factoryId] = $factory["lvl"];
         }

         // sort factoryArray by key, ascending, to secure proper insertion further down
         ksort($factoryArray);

         // if user is missing factories, fill up with level 0
         $supposedLength = self::TABLE_NAMES["factories"]["length"];
         $factoryArray = $this->fillUpArrayWithZeroes($factoryArray, $supposedLength, "noarray");

         $query = "SELECT `id` FROM `userFactories` WHERE `id` = " .$userId. "";

         $checkForPreviousEntry = $this->conn->query($query);

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

         $insertion = $this->conn->query($stmt);

         echo json_encode($factoryArray, JSON_NUMERIC_CHECK);
     }

     /**
      * iterates over API warehouse data
      *
      * @method private insertAPIWarehouseData($data, $userId)
      * @param  array $data   [API result]
      * @param  int   $userId [current userId]
      * @return mixed [returns JSON-encoded array]
      */
     private function insertAPIWarehouseData($data, $userId)
     {
         $warehouseArray = [];

         foreach ($data as $warehouse) {
             if ($warehouse["itemID"] != 1) {
                 $warehouseId = $this->convertOfficialIdToInternalId($warehouse["itemID"]);
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
         $warehouseArray = $this->fillUpArrayWithZeroes($warehouseArray, $supposedLength, "warehouse");

         $query = "SELECT `id` FROM `userWarehouse` WHERE `id` = " .$userId. "";

         $checkForPreviousEntry = $this->conn->query($query);

         if ($checkForPreviousEntry->num_rows === 1) {
             $stmt = "UPDATE `userWarehouse` SET ";

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
                 $stmt .= $warehouseData["level"]. "," .$warehouseData["amount"]. ",";
             }
             $stmt = substr($stmt, 0, -1);
             $stmt .= ");";
         }

         $insertion = $this->conn->query($stmt);

         return json_encode($warehouseArray, JSON_NUMERIC_CHECK);
     }

     /**
      * iterates over API warehouse data
      *
      * @method private convertOfficialBuildingIdToInternalId($buildingId)
      * @param  int $buildingId [current buildingId to iterate over]
      * @return int [converted id]
      */
     private function convertOfficialBuildingIdToInternalId($buildingId)
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
      * @method private insertAPIBuildingsData($data, $userId)
      * @param  array $data   [API result]
      * @param  int   $userId [current userId]
      * @return mixed [returns JSON-encoded array]
      */
     private function insertAPIBuildingsData($data, $userId)
     {
         $buildingArray = [];

         foreach ($data as $building) {
             $buildingId = $this->convertOfficialBuildingIdToInternalId($building["specbID"]);
             $buildingArray[$buildingId] = $building["lvl"];
         }

         // sort factoryArray by key, ascending, to secure proper insertion further down
         ksort($buildingArray);

         $supposedLength = self::BUILDING_AMOUNT;
         $buildingArray = $this->fillUpArrayWithZeroes($buildingArray, $supposedLength, "noarray");

         $query = "SELECT `id` FROM `userBuildings` WHERE `id` = " .$userId. "";

         $checkForPreviousEntry = $this->conn->query($query);

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

         $insertion = $this->conn->query($stmt);

         return json_encode($buildingArray, JSON_NUMERIC_CHECK);
     }

     /**
      * iterates over API headquarter data
      *
      * @method private insertAPIHeadquarterData($data, $userId)
      * @param  array $data   [API result]
      * @param  int   $userId [current userId]
      * @return mixed [returns JSON-encoded array]
      */
     private function insertAPIHeadquarterData($data, $userId)
     {
         $data = $data[0];

         $headquarterArray = [
           "level" => $data["lvl"],
           "lon" => $data["lon"],
           "lat" => $data["lat"],
           "paid" => $data["progress1"],
           "progress1" => $data["progress2"],
           "progress2" => $data["progress3"],
           "progress3" => $data["progress4"]
         ];

         $query = "SELECT `id` FROM `userHeadquarter` WHERE `id` = " .$userId. "";

         $checkForPreviousEntry = $this->conn->query($query);

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

         $insertion = $this->conn->query($stmt);

         $headquarterArray = [
           "level" => $data["lvl"],
           "lon" => $data["lon"],
           "lat" => $data["lat"],
           "paid" => [
                $data["progress1"], $data["progress2"], $data["progress3"], $data["progress4"]
           ],
         ];

         return json_encode($headquarterArray, JSON_NUMERIC_CHECK);
     }

     /**
      * iterates over API mine summary data
      *
      * @method private insertAPIMineSummary($data, $userId)
      * @param  array $data   [API result]
      * @param  int   $userId [current userId]
      * @return mixed [returns JSON-encoded array]
      */
     private function insertAPIMineSummary($data, $userId)
     {
         $materialArray = [];

         foreach ($data as $material) {
             $id = $this->convertOfficialIdToInternalId($material["resourceID"]);

             $materialArray[$id]["perHour"] = round($material["SUMfullrate"]);
             $materialArray[$id]["amountOfMines"] = $material["minecount"];
         }

         // sort materialArray by key, ascending, to secure proper insertion further down
         ksort($materialArray);

         $materialArray = $this->fillUpArrayWithZeroes($materialArray, 14, "mineSummary");

         $query = "SELECT `id` FROM `userMaterial` WHERE `id` = " .$userId. "";

         $checkForPreviousEntry = $this->conn->query($query);

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

         $insertion = $this->conn->query($stmt);

         return json_encode($materialArray, JSON_NUMERIC_CHECK);
     }

     /**
      * iterates over API player information
      *
      * @method private insertAPIPlayerInformation($data, $userId)
      * @param  array $data   [API result]
      * @param  int   $userId [current userId]
      * @return mixed [returns JSON-encoded array]
      */
     private function insertAPIPlayerInformation($data, $userId, $anonymity)
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
                 if($anonymity == true) {
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
             if($anonymity == true && $column == "username") {
               continue;
             } else {
               $result[$column] = $value;
               $query .= " = '" .$value. "',";
             }
         }

         $query = substr($query, 0, -1). " WHERE `id` = " .$userId. ";";

         $insertion = $this->conn->query($query);

         return json_encode($result, JSON_NUMERIC_CHECK);
     }

     /**
      * returns timestamp-relative price of old internal Id
      *
      * @method private returnRelativePrice($id, $timestamp)
      * @param  int $id        [old internal id via]
      * @param  int $timestamp [unix timestamp]
      * @return int [price]
      */
     private function returnRelativePrice($id, $timestamp)
     {
         $query = "SELECT `" .$id. "_k` AS `ai`, `" .$id. "_tk` AS `player` FROM `price` WHERE `ts` <= " .$timestamp. " ORDER BY `ts` DESC LIMIT 1";

         $getRelativePrice = $this->conn->query($query);

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
      * @method private removeEmojis($string)
      * @param  string $string [potentially emoji-containing string]
      * @return string [$string]
      */
     private function removeEmojis($string)
     {
         return preg_replace("/[\x{1F3F4}](?:\x{E0067}\x{E0062}\x{E0077}\x{E006C}\x{E0073}\x{E007F})|[\x{1F3F4}](?:\x{E0067}\x{E0062}\x{E0073}\x{E0063}\x{E0074}\x{E007F})|[\x{1F3F4}](?:\x{E0067}\x{E0062}\x{E0065}\x{E006E}\x{E0067}\x{E007F})|[\x{1F3F4}](?:\x{200D}\x{2620}\x{FE0F})|[\x{1F3F3}](?:\x{FE0F}\x{200D}\x{1F308})|[\x{0023}\x{002A}\x{0030}\x{0031}\x{0032}\x{0033}\x{0034}\x{0035}\x{0036}\x{0037}\x{0038}\x{0039}](?:\x{FE0F}\x{20E3})|[\x{1F441}](?:\x{FE0F}\x{200D}\x{1F5E8}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F467}\x{200D}\x{1F467})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F467}\x{200D}\x{1F466})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F467})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F466}\x{200D}\x{1F466})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F466})|[\x{1F468}](?:\x{200D}\x{1F468}\x{200D}\x{1F467}\x{200D}\x{1F467})|[\x{1F468}](?:\x{200D}\x{1F468}\x{200D}\x{1F466}\x{200D}\x{1F466})|[\x{1F468}](?:\x{200D}\x{1F468}\x{200D}\x{1F467}\x{200D}\x{1F466})|[\x{1F468}](?:\x{200D}\x{1F468}\x{200D}\x{1F467})|[\x{1F468}](?:\x{200D}\x{1F468}\x{200D}\x{1F466})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F469}\x{200D}\x{1F467}\x{200D}\x{1F467})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F469}\x{200D}\x{1F466}\x{200D}\x{1F466})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F469}\x{200D}\x{1F467}\x{200D}\x{1F466})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F469}\x{200D}\x{1F467})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F469}\x{200D}\x{1F466})|[\x{1F469}](?:\x{200D}\x{2764}\x{FE0F}\x{200D}\x{1F469})|[\x{1F469}\x{1F468}](?:\x{200D}\x{2764}\x{FE0F}\x{200D}\x{1F468})|[\x{1F469}](?:\x{200D}\x{2764}\x{FE0F}\x{200D}\x{1F48B}\x{200D}\x{1F469})|[\x{1F469}\x{1F468}](?:\x{200D}\x{2764}\x{FE0F}\x{200D}\x{1F48B}\x{200D}\x{1F468})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F9B3})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F9B3})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F9B3})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F9B3})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F9B3})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F9B3})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F9B2})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F9B2})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F9B2})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F9B2})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F9B2})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F9B2})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F9B1})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F9B1})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F9B1})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F9B1})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F9B1})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F9B1})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F9B0})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F9B0})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F9B0})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F9B0})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F9B0})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F9B0})|[\x{1F575}\x{1F3CC}\x{26F9}\x{1F3CB}](?:\x{FE0F}\x{200D}\x{2640}\x{FE0F})|[\x{1F575}\x{1F3CC}\x{26F9}\x{1F3CB}](?:\x{FE0F}\x{200D}\x{2642}\x{FE0F})|[\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{1F3FF}\x{200D}\x{2640}\x{FE0F})|[\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{1F3FE}\x{200D}\x{2640}\x{FE0F})|[\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{1F3FD}\x{200D}\x{2640}\x{FE0F})|[\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{1F3FC}\x{200D}\x{2640}\x{FE0F})|[\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{1F3FB}\x{200D}\x{2640}\x{FE0F})|[\x{1F46E}\x{1F9B8}\x{1F9B9}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F9DE}\x{1F9DF}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F46F}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93C}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{200D}\x{2640}\x{FE0F})|[\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{1F3FF}\x{200D}\x{2642}\x{FE0F})|[\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{1F3FE}\x{200D}\x{2642}\x{FE0F})|[\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{1F3FD}\x{200D}\x{2642}\x{FE0F})|[\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{1F3FC}\x{200D}\x{2642}\x{FE0F})|[\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{1F3FB}\x{200D}\x{2642}\x{FE0F})|[\x{1F46E}\x{1F9B8}\x{1F9B9}\x{1F482}\x{1F477}\x{1F473}\x{1F471}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F9DE}\x{1F9DF}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F46F}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93C}\x{1F93D}\x{1F93E}\x{1F939}](?:\x{200D}\x{2642}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F692})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F692})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F692})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F692})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F692})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F692})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F680})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F680})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F680})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F680})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F680})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F680})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{2708}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{2708}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{2708}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{2708}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{2708}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{200D}\x{2708}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F3A8})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F3A8})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F3A8})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F3A8})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F3A8})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F3A8})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F3A4})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F3A4})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F3A4})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F3A4})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F3A4})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F3A4})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F4BB})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F4BB})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F4BB})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F4BB})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F4BB})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F4BB})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F52C})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F52C})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F52C})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F52C})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F52C})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F52C})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F4BC})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F4BC})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F4BC})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F4BC})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F4BC})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F4BC})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F3ED})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F3ED})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F3ED})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F3ED})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F3ED})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F3ED})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F527})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F527})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F527})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F527})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F527})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F527})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F373})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F373})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F373})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F373})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F373})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F373})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F33E})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F33E})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F33E})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F33E})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F33E})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F33E})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{2696}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{2696}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{2696}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{2696}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{2696}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{200D}\x{2696}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F3EB})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F3EB})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F3EB})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F3EB})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F3EB})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F3EB})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{1F393})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{1F393})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{1F393})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{1F393})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{1F393})|[\x{1F468}\x{1F469}](?:\x{200D}\x{1F393})|[\x{1F468}\x{1F469}](?:\x{1F3FF}\x{200D}\x{2695}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FE}\x{200D}\x{2695}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FD}\x{200D}\x{2695}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FC}\x{200D}\x{2695}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{1F3FB}\x{200D}\x{2695}\x{FE0F})|[\x{1F468}\x{1F469}](?:\x{200D}\x{2695}\x{FE0F})|[\x{1F476}\x{1F9D2}\x{1F466}\x{1F467}\x{1F9D1}\x{1F468}\x{1F469}\x{1F9D3}\x{1F474}\x{1F475}\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F934}\x{1F478}\x{1F473}\x{1F472}\x{1F9D5}\x{1F9D4}\x{1F471}\x{1F935}\x{1F470}\x{1F930}\x{1F931}\x{1F47C}\x{1F385}\x{1F936}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F483}\x{1F57A}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F6C0}\x{1F6CC}\x{1F574}\x{1F3C7}\x{1F3C2}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}\x{1F933}\x{1F4AA}\x{1F9B5}\x{1F9B6}\x{1F448}\x{1F449}\x{261D}\x{1F446}\x{1F595}\x{1F447}\x{270C}\x{1F91E}\x{1F596}\x{1F918}\x{1F919}\x{1F590}\x{270B}\x{1F44C}\x{1F44D}\x{1F44E}\x{270A}\x{1F44A}\x{1F91B}\x{1F91C}\x{1F91A}\x{1F44B}\x{1F91F}\x{270D}\x{1F44F}\x{1F450}\x{1F64C}\x{1F932}\x{1F64F}\x{1F485}\x{1F442}\x{1F443}](?:\x{1F3FF})|[\x{1F476}\x{1F9D2}\x{1F466}\x{1F467}\x{1F9D1}\x{1F468}\x{1F469}\x{1F9D3}\x{1F474}\x{1F475}\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F934}\x{1F478}\x{1F473}\x{1F472}\x{1F9D5}\x{1F9D4}\x{1F471}\x{1F935}\x{1F470}\x{1F930}\x{1F931}\x{1F47C}\x{1F385}\x{1F936}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F483}\x{1F57A}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F6C0}\x{1F6CC}\x{1F574}\x{1F3C7}\x{1F3C2}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}\x{1F933}\x{1F4AA}\x{1F9B5}\x{1F9B6}\x{1F448}\x{1F449}\x{261D}\x{1F446}\x{1F595}\x{1F447}\x{270C}\x{1F91E}\x{1F596}\x{1F918}\x{1F919}\x{1F590}\x{270B}\x{1F44C}\x{1F44D}\x{1F44E}\x{270A}\x{1F44A}\x{1F91B}\x{1F91C}\x{1F91A}\x{1F44B}\x{1F91F}\x{270D}\x{1F44F}\x{1F450}\x{1F64C}\x{1F932}\x{1F64F}\x{1F485}\x{1F442}\x{1F443}](?:\x{1F3FE})|[\x{1F476}\x{1F9D2}\x{1F466}\x{1F467}\x{1F9D1}\x{1F468}\x{1F469}\x{1F9D3}\x{1F474}\x{1F475}\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F934}\x{1F478}\x{1F473}\x{1F472}\x{1F9D5}\x{1F9D4}\x{1F471}\x{1F935}\x{1F470}\x{1F930}\x{1F931}\x{1F47C}\x{1F385}\x{1F936}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F483}\x{1F57A}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F6C0}\x{1F6CC}\x{1F574}\x{1F3C7}\x{1F3C2}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}\x{1F933}\x{1F4AA}\x{1F9B5}\x{1F9B6}\x{1F448}\x{1F449}\x{261D}\x{1F446}\x{1F595}\x{1F447}\x{270C}\x{1F91E}\x{1F596}\x{1F918}\x{1F919}\x{1F590}\x{270B}\x{1F44C}\x{1F44D}\x{1F44E}\x{270A}\x{1F44A}\x{1F91B}\x{1F91C}\x{1F91A}\x{1F44B}\x{1F91F}\x{270D}\x{1F44F}\x{1F450}\x{1F64C}\x{1F932}\x{1F64F}\x{1F485}\x{1F442}\x{1F443}](?:\x{1F3FD})|[\x{1F476}\x{1F9D2}\x{1F466}\x{1F467}\x{1F9D1}\x{1F468}\x{1F469}\x{1F9D3}\x{1F474}\x{1F475}\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F934}\x{1F478}\x{1F473}\x{1F472}\x{1F9D5}\x{1F9D4}\x{1F471}\x{1F935}\x{1F470}\x{1F930}\x{1F931}\x{1F47C}\x{1F385}\x{1F936}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F483}\x{1F57A}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F6C0}\x{1F6CC}\x{1F574}\x{1F3C7}\x{1F3C2}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}\x{1F933}\x{1F4AA}\x{1F9B5}\x{1F9B6}\x{1F448}\x{1F449}\x{261D}\x{1F446}\x{1F595}\x{1F447}\x{270C}\x{1F91E}\x{1F596}\x{1F918}\x{1F919}\x{1F590}\x{270B}\x{1F44C}\x{1F44D}\x{1F44E}\x{270A}\x{1F44A}\x{1F91B}\x{1F91C}\x{1F91A}\x{1F44B}\x{1F91F}\x{270D}\x{1F44F}\x{1F450}\x{1F64C}\x{1F932}\x{1F64F}\x{1F485}\x{1F442}\x{1F443}](?:\x{1F3FC})|[\x{1F476}\x{1F9D2}\x{1F466}\x{1F467}\x{1F9D1}\x{1F468}\x{1F469}\x{1F9D3}\x{1F474}\x{1F475}\x{1F46E}\x{1F575}\x{1F482}\x{1F477}\x{1F934}\x{1F478}\x{1F473}\x{1F472}\x{1F9D5}\x{1F9D4}\x{1F471}\x{1F935}\x{1F470}\x{1F930}\x{1F931}\x{1F47C}\x{1F385}\x{1F936}\x{1F9D9}\x{1F9DA}\x{1F9DB}\x{1F9DC}\x{1F9DD}\x{1F64D}\x{1F64E}\x{1F645}\x{1F646}\x{1F481}\x{1F64B}\x{1F647}\x{1F926}\x{1F937}\x{1F486}\x{1F487}\x{1F6B6}\x{1F3C3}\x{1F483}\x{1F57A}\x{1F9D6}\x{1F9D7}\x{1F9D8}\x{1F6C0}\x{1F6CC}\x{1F574}\x{1F3C7}\x{1F3C2}\x{1F3CC}\x{1F3C4}\x{1F6A3}\x{1F3CA}\x{26F9}\x{1F3CB}\x{1F6B4}\x{1F6B5}\x{1F938}\x{1F93D}\x{1F93E}\x{1F939}\x{1F933}\x{1F4AA}\x{1F9B5}\x{1F9B6}\x{1F448}\x{1F449}\x{261D}\x{1F446}\x{1F595}\x{1F447}\x{270C}\x{1F91E}\x{1F596}\x{1F918}\x{1F919}\x{1F590}\x{270B}\x{1F44C}\x{1F44D}\x{1F44E}\x{270A}\x{1F44A}\x{1F91B}\x{1F91C}\x{1F91A}\x{1F44B}\x{1F91F}\x{270D}\x{1F44F}\x{1F450}\x{1F64C}\x{1F932}\x{1F64F}\x{1F485}\x{1F442}\x{1F443}](?:\x{1F3FB})|[\x{1F1E6}\x{1F1E7}\x{1F1E8}\x{1F1E9}\x{1F1F0}\x{1F1F2}\x{1F1F3}\x{1F1F8}\x{1F1F9}\x{1F1FA}](?:\x{1F1FF})|[\x{1F1E7}\x{1F1E8}\x{1F1EC}\x{1F1F0}\x{1F1F1}\x{1F1F2}\x{1F1F5}\x{1F1F8}\x{1F1FA}](?:\x{1F1FE})|[\x{1F1E6}\x{1F1E8}\x{1F1F2}\x{1F1F8}](?:\x{1F1FD})|[\x{1F1E6}\x{1F1E7}\x{1F1E8}\x{1F1EC}\x{1F1F0}\x{1F1F2}\x{1F1F5}\x{1F1F7}\x{1F1F9}\x{1F1FF}](?:\x{1F1FC})|[\x{1F1E7}\x{1F1E8}\x{1F1F1}\x{1F1F2}\x{1F1F8}\x{1F1F9}](?:\x{1F1FB})|[\x{1F1E6}\x{1F1E8}\x{1F1EA}\x{1F1EC}\x{1F1ED}\x{1F1F1}\x{1F1F2}\x{1F1F3}\x{1F1F7}\x{1F1FB}](?:\x{1F1FA})|[\x{1F1E6}\x{1F1E7}\x{1F1EA}\x{1F1EC}\x{1F1ED}\x{1F1EE}\x{1F1F1}\x{1F1F2}\x{1F1F5}\x{1F1F8}\x{1F1F9}\x{1F1FE}](?:\x{1F1F9})|[\x{1F1E6}\x{1F1E7}\x{1F1EA}\x{1F1EC}\x{1F1EE}\x{1F1F1}\x{1F1F2}\x{1F1F5}\x{1F1F7}\x{1F1F8}\x{1F1FA}\x{1F1FC}](?:\x{1F1F8})|[\x{1F1E6}\x{1F1E7}\x{1F1E8}\x{1F1EA}\x{1F1EB}\x{1F1EC}\x{1F1ED}\x{1F1EE}\x{1F1F0}\x{1F1F1}\x{1F1F2}\x{1F1F3}\x{1F1F5}\x{1F1F8}\x{1F1F9}](?:\x{1F1F7})|[\x{1F1E6}\x{1F1E7}\x{1F1EC}\x{1F1EE}\x{1F1F2}](?:\x{1F1F6})|[\x{1F1E8}\x{1F1EC}\x{1F1EF}\x{1F1F0}\x{1F1F2}\x{1F1F3}](?:\x{1F1F5})|[\x{1F1E6}\x{1F1E7}\x{1F1E8}\x{1F1E9}\x{1F1EB}\x{1F1EE}\x{1F1EF}\x{1F1F2}\x{1F1F3}\x{1F1F7}\x{1F1F8}\x{1F1F9}](?:\x{1F1F4})|[\x{1F1E7}\x{1F1E8}\x{1F1EC}\x{1F1ED}\x{1F1EE}\x{1F1F0}\x{1F1F2}\x{1F1F5}\x{1F1F8}\x{1F1F9}\x{1F1FA}\x{1F1FB}](?:\x{1F1F3})|[\x{1F1E6}\x{1F1E7}\x{1F1E8}\x{1F1E9}\x{1F1EB}\x{1F1EC}\x{1F1ED}\x{1F1EE}\x{1F1EF}\x{1F1F0}\x{1F1F2}\x{1F1F4}\x{1F1F5}\x{1F1F8}\x{1F1F9}\x{1F1FA}\x{1F1FF}](?:\x{1F1F2})|[\x{1F1E6}\x{1F1E7}\x{1F1E8}\x{1F1EC}\x{1F1EE}\x{1F1F2}\x{1F1F3}\x{1F1F5}\x{1F1F8}\x{1F1F9}](?:\x{1F1F1})|[\x{1F1E8}\x{1F1E9}\x{1F1EB}\x{1F1ED}\x{1F1F1}\x{1F1F2}\x{1F1F5}\x{1F1F8}\x{1F1F9}\x{1F1FD}](?:\x{1F1F0})|[\x{1F1E7}\x{1F1E9}\x{1F1EB}\x{1F1F8}\x{1F1F9}](?:\x{1F1EF})|[\x{1F1E6}\x{1F1E7}\x{1F1E8}\x{1F1EB}\x{1F1EC}\x{1F1F0}\x{1F1F1}\x{1F1F3}\x{1F1F8}\x{1F1FB}](?:\x{1F1EE})|[\x{1F1E7}\x{1F1E8}\x{1F1EA}\x{1F1EC}\x{1F1F0}\x{1F1F2}\x{1F1F5}\x{1F1F8}\x{1F1F9}](?:\x{1F1ED})|[\x{1F1E6}\x{1F1E7}\x{1F1E8}\x{1F1E9}\x{1F1EA}\x{1F1EC}\x{1F1F0}\x{1F1F2}\x{1F1F3}\x{1F1F5}\x{1F1F8}\x{1F1F9}\x{1F1FA}\x{1F1FB}](?:\x{1F1EC})|[\x{1F1E6}\x{1F1E7}\x{1F1E8}\x{1F1EC}\x{1F1F2}\x{1F1F3}\x{1F1F5}\x{1F1F9}\x{1F1FC}](?:\x{1F1EB})|[\x{1F1E6}\x{1F1E7}\x{1F1E9}\x{1F1EA}\x{1F1EC}\x{1F1EE}\x{1F1EF}\x{1F1F0}\x{1F1F2}\x{1F1F3}\x{1F1F5}\x{1F1F7}\x{1F1F8}\x{1F1FB}\x{1F1FE}](?:\x{1F1EA})|[\x{1F1E6}\x{1F1E7}\x{1F1E8}\x{1F1EC}\x{1F1EE}\x{1F1F2}\x{1F1F8}\x{1F1F9}](?:\x{1F1E9})|[\x{1F1E6}\x{1F1E8}\x{1F1EA}\x{1F1EE}\x{1F1F1}\x{1F1F2}\x{1F1F3}\x{1F1F8}\x{1F1F9}\x{1F1FB}](?:\x{1F1E8})|[\x{1F1E7}\x{1F1EC}\x{1F1F1}\x{1F1F8}](?:\x{1F1E7})|[\x{1F1E7}\x{1F1E8}\x{1F1EA}\x{1F1EC}\x{1F1F1}\x{1F1F2}\x{1F1F3}\x{1F1F5}\x{1F1F6}\x{1F1F8}\x{1F1F9}\x{1F1FA}\x{1F1FB}\x{1F1FF}](?:\x{1F1E6})|[\x{00A9}\x{00AE}\x{203C}\x{2049}\x{2122}\x{2139}\x{2194}-\x{2199}\x{21A9}-\x{21AA}\x{231A}-\x{231B}\x{2328}\x{23CF}\x{23E9}-\x{23F3}\x{23F8}-\x{23FA}\x{24C2}\x{25AA}-\x{25AB}\x{25B6}\x{25C0}\x{25FB}-\x{25FE}\x{2600}-\x{2604}\x{260E}\x{2611}\x{2614}-\x{2615}\x{2618}\x{261D}\x{2620}\x{2622}-\x{2623}\x{2626}\x{262A}\x{262E}-\x{262F}\x{2638}-\x{263A}\x{2640}\x{2642}\x{2648}-\x{2653}\x{2660}\x{2663}\x{2665}-\x{2666}\x{2668}\x{267B}\x{267E}-\x{267F}\x{2692}-\x{2697}\x{2699}\x{269B}-\x{269C}\x{26A0}-\x{26A1}\x{26AA}-\x{26AB}\x{26B0}-\x{26B1}\x{26BD}-\x{26BE}\x{26C4}-\x{26C5}\x{26C8}\x{26CE}-\x{26CF}\x{26D1}\x{26D3}-\x{26D4}\x{26E9}-\x{26EA}\x{26F0}-\x{26F5}\x{26F7}-\x{26FA}\x{26FD}\x{2702}\x{2705}\x{2708}-\x{270D}\x{270F}\x{2712}\x{2714}\x{2716}\x{271D}\x{2721}\x{2728}\x{2733}-\x{2734}\x{2744}\x{2747}\x{274C}\x{274E}\x{2753}-\x{2755}\x{2757}\x{2763}-\x{2764}\x{2795}-\x{2797}\x{27A1}\x{27B0}\x{27BF}\x{2934}-\x{2935}\x{2B05}-\x{2B07}\x{2B1B}-\x{2B1C}\x{2B50}\x{2B55}\x{3030}\x{303D}\x{3297}\x{3299}\x{1F004}\x{1F0CF}\x{1F170}-\x{1F171}\x{1F17E}-\x{1F17F}\x{1F18E}\x{1F191}-\x{1F19A}\x{1F201}-\x{1F202}\x{1F21A}\x{1F22F}\x{1F232}-\x{1F23A}\x{1F250}-\x{1F251}\x{1F300}-\x{1F321}\x{1F324}-\x{1F393}\x{1F396}-\x{1F397}\x{1F399}-\x{1F39B}\x{1F39E}-\x{1F3F0}\x{1F3F3}-\x{1F3F5}\x{1F3F7}-\x{1F3FA}\x{1F400}-\x{1F4FD}\x{1F4FF}-\x{1F53D}\x{1F549}-\x{1F54E}\x{1F550}-\x{1F567}\x{1F56F}-\x{1F570}\x{1F573}-\x{1F57A}\x{1F587}\x{1F58A}-\x{1F58D}\x{1F590}\x{1F595}-\x{1F596}\x{1F5A4}-\x{1F5A5}\x{1F5A8}\x{1F5B1}-\x{1F5B2}\x{1F5BC}\x{1F5C2}-\x{1F5C4}\x{1F5D1}-\x{1F5D3}\x{1F5DC}-\x{1F5DE}\x{1F5E1}\x{1F5E3}\x{1F5E8}\x{1F5EF}\x{1F5F3}\x{1F5FA}-\x{1F64F}\x{1F680}-\x{1F6C5}\x{1F6CB}-\x{1F6D2}\x{1F6E0}-\x{1F6E5}\x{1F6E9}\x{1F6EB}-\x{1F6EC}\x{1F6F0}\x{1F6F3}-\x{1F6F9}\x{1F910}-\x{1F93A}\x{1F93C}-\x{1F93E}\x{1F940}-\x{1F945}\x{1F947}-\x{1F970}\x{1F973}-\x{1F976}\x{1F97A}\x{1F97C}-\x{1F9A2}\x{1F9B0}-\x{1F9B9}\x{1F9C0}-\x{1F9C2}\x{1F9D0}-\x{1F9FF}]/u", "", $string);
     }

     /**
      * iterates over API trade log
      *
      * @method private insertAPITradeLog($data, $userId)
      * @param  array $data   [API result]
      * @param  int   $userId [current userId]
      * @return array [returns JSON-encoded array]
      */
     private function insertAPITradeLog($data, $userId)
     {
         $tableBuilder = $this->createTable("tradeLog", $userId);
         $buildTable = $this->conn->query($tableBuilder);

         $mostRecentTradeQuery = "SELECT `timestamp` FROM `userTradeLog_" .$userId. "` ORDER BY `timestamp` DESC LIMIT 1";
         $mostRecentTrade = $this->conn->query($mostRecentTradeQuery);
         if ($mostRecentTrade->num_rows == 1) {
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
                             $event = 0;
                             $buyValue = $tradeAction["amount"] * $tradeAction["ppstk"];
                             $sellValue = 0;
                             $transportCost = $tradeAction["transcost"];
                             break;
                             case "sell":
                             $event = 1;
                             $buyValue = 0;
                             $sellValue = $tradeAction["amount"] * $tradeAction["ppstk"];
                             $transportCost = 0;
                             break;
             }

                 $tradingUserName = $this->removeEmojis($tradeAction["username"]);
                 $tradingPartnerLevel = $tradeAction["ulvl"];

                 $itemId = $this->convertOfficialIdToInternalId($tradeAction["itemID"]);

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

                 $insertIntoIndex = $this->insertUserToIndex($timestamp, $tradingUserName, $tradingPartnerLevel, $userId, $sellValue, $buyValue, $transportCost);

                 $insertion = $this->conn->query($query);
             }
         }

         $answer["callback"] = "rHelper.fn.API_getTradeLog()";

         return json_encode($answer);
     }

     /**
      * iterates over API mission information
      *
      * @method private insertAPIMissions($data, $userId)
      * @param  array $data   [API result]
      * @param  int   $userId [current userId]
      * @return array [returns JSON-encoded array]
      */
     private function insertAPIMissions($data, $userId)
     {
         $tableBuilder = $this->createTable("missions", $userId);
         $buildTable = $this->conn->query($tableBuilder);

         $result = [];

         foreach ($data as $mission) {
             $id = $mission["questID"];
             $startTimestamp = $mission["starttime"];
             $endTimestamp = $mission["endtime"];
             $progress = $mission["progress"];
             $goal = $mission["missiongoal"];
             $cooldown = $mission["cooldown"];
             $rewardAmount = $mission["rewardamount"];
             $penalty = $mission["penalty"];
             $status = $mission["status"];

             $checkExistingMissionQuery = "SELECT * FROM `userMissions_" .$userId. "` WHERE `id` = " .$id. "";
             $checkExistingMission = $this->conn->query($checkExistingMissionQuery);

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

             $setMission = $this->conn->query($query);

             if ($startTimestamp != 0) {
                 $startTimestamp = $this->convertUnixTimestampToDateTime($startTimestamp);
             }

             if ($endTimestamp != 0) {
                 $endTimestamp = $this->convertUnixTimestampToDateTime($endTimestamp);
             }

             $result[$id]["startData"]["dateTime"] = $startTimestamp;
             $result[$id]["startData"]["timestamp"] = $mission["starttime"];

             $result[$id]["endData"]["dateTime"] = $endTimestamp;
             $result[$id]["endData"]["timestamp"] = $mission["endtime"];

             $result[$id]["progress"] = $progress;
             $result[$id]["goal"] = $goal;
             $result[$id]["cooldown"] = $cooldown;
             $result[$id]["rewardAmount"] = $rewardAmount;
             $result[$id]["penalty"] = $penalty;
             $result[$id]["status"] = $status;
         }

         $answer["callback"] = "rHelper.fn.API_getMissions()";

         return json_encode($answer);
     }

     /**
      * iterates over API attack log information
      *
      * @method private insertAPIAttackLog($data, $userId)
      * @param  array $data   [API result]
      * @param  int   $userId [current userId]
      * @return bool [returns true/false for insertion success]
      */
     private function insertAPIAttackLog($data, $userId)
     {
         $tableBuilder = $this->createTable("attackLog", $userId);
         $createTable = $this->conn->query($tableBuilder);

         $mostRecentAttackQuery = "SELECT `timestamp` FROM `userAttackLog_" .$userId. "` ORDER BY `timestamp` DESC LIMIT 1";
         $mostRecentAttack = $this->conn->query($mostRecentAttackQuery);
         if ($mostRecentAttack->num_rows == 1) {
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
                 $currentPrice1Id = $this->convertOfficialIdToInternalId($attack["loot1ItemID"]);
                 $currentPrice2Id = $this->convertOfficialIdToInternalId($attack["loot2ItemID"]);

                 $oldPrice1Id = $this->convertInternalIdToOldStructure($currentPrice1Id);
                 $oldPrice2Id = $this->convertInternalIdToOldStructure($currentPrice2Id);

                 $relPrice1 = $this->returnRelativePrice($oldPrice1Id, $timestamp);

                 $worthItem1 = $attack["loot1ItemQty"] * $relPrice1;

                 if ($oldPrice2Id != -1) {
                     $relPrice2 = $this->returnRelativePrice($oldPrice2Id, $timestamp);
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
                         $this->returnRelativePrice(24, $timestamp),
                         $this->returnRelativePrice(17, $timestamp),
                         $this->returnRelativePrice(37, $timestamp)
                    ];

                 $defendingUnitPrices = [
                         $this->returnRelativePrice(54, $timestamp),
                         $this->returnRelativePrice(55, $timestamp),
                         $this->returnRelativePrice(14, $timestamp)
                    ];

                 $profit = 0;

                 if ($outcome == 1) {
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

                 $insertion = $this->conn->query($query);

                 $insertIntoIndex = $this->insertUserToIndex($timestamp, $attack["targetUserName"], $attack["targetUserLevel"], $userId, 0, 0, 0);
             }
        }

        $answer["callback"] = "rHelper.fn.API_getAttackLog()";

        return json_encode($answer);
     }

     /**
      * iterates over API mineMap data
      *
      * @method private insertAPIMineMap($url, $userId)
      * @param  array $url    [API url]
      * @param  int   $userId [current userId]
      * @return bool [returns true]
      */
     private function insertAPIMineMap($url, $userId)
     {
         $tableBuilder = $this->createTable("mineMap", $userId);
         $buildTable = $this->conn->query($tableBuilder);

         $killFormerContentQuery = "DELETE FROM `userMineMap_" .$userId. "`";
         $killFormerContent = $this->conn->query($killFormerContentQuery);

         include 'JsonStreamingParser/Listener.php';
         include 'JsonStreamingParser/Parser.php';
         include 'JsonStreamingParser/Listener/IdleListener.php';
         include 'JsonStreamingParser/Listener/InMemoryListener.php';

         $listener = new \JsonStreamingParser\Listener\InMemoryListener();
         $stream = fopen($url, 'r');
         try {
             $parser = new \JsonStreamingParser\Parser($stream, $listener);
             $parser->parse($this->conn, $userId);
             fclose($stream);
         } catch (Exception $e) {
             fclose($stream);
             throw $e;
         }

         $orderTableQuery = "ALTER TABLE `userMineMap_" .$userId. "` ORDER BY  `builddate`";
         $sortTable = $this->conn->query($orderTableQuery);

         $countHQMinesQuery = "SELECT COUNT(  `rawRate` ) AS  `minesInHQ`, `HQBoost` FROM  `userMineMap_" .$userId. "` WHERE  `HQBoost` > 1";
         $countHQMines = $this->conn->query($countHQMinesQuery);
         if ($countHQMines->num_rows == 1) {
             while ($data = $countHQMines->fetch_assoc()) {
                 $hqMines = $data["minesInHQ"];
                 $hqBoost = $data["HQBoost"];
             }
         }

         $updateUserHeadquarterQuery = "SELECT `id` FROM `userHeadquarter` WHERE `id` = " .$userId. "";
         $updateUserHeadquarter = $this->conn->query($updateUserHeadquarterQuery);

         if ($updateUserHeadquarter->num_rows == 0) {
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

         $insertion = $this->conn->query($insertionQuery);

         $answer["callback"] = "rHelper.fn.API_getMineMap()";

         return json_encode($answer);
     }

     /**
      * answer generator for frontend
      *
      * @method public getAPIData($query, $key, $userId)
      * @param  int   $query  [query Id]
      * @param  mixed $key    [user API key]
      * @param  int   $userId [current userId]
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
               ]
             ];

             $data = file_get_contents($url, false, stream_context_create($arrContextOptions));
             $decoded_data = json_decode($data, true);
         }

         switch ($query) {
         case 0: // credits - STABLE
             $query = "UPDATE `userOverview` SET `lastUpdate` = " .$time. ", `remainingCredits` = " .$decoded_data[0]["creditsleft"]. " WHERE `id` = " .$userId. "";
             $updateUserOverview = $this->conn->query($query);
             return $data;
         break;
         case 1: // factory - STABLE
             $convertAPIData = $this->insertAPIFactoryData($decoded_data, $userId);
             return $convertAPIData;
         break;
         case 2: // warehouse - STABLE
             $convertAPIData = $this->insertAPIWarehouseData($decoded_data, $userId);
             return $convertAPIData;
         break;
         case 3: // special buildings - STABLE
             $convertAPIData = $this->insertAPIBuildingsData($decoded_data, $userId);
             return $convertAPIData;
         break;
         case 4: // headquarter - STABLE
             $convertAPIData = $this->insertAPIHeadquarterData($decoded_data, $userId);
             return $convertAPIData;
           break;
         case 5: // mines => mineMap - STABLE
             $convertAPIData = $this->insertAPIMineMap($url, $userId);
             return $convertAPIData;
         break;
         case 51: // mines summary - STABLE
             $convertAPIData = $this->insertAPIMineSummary($decoded_data, $userId);
             return $convertAPIData;
         break;
         case 6: // tradeLog
             $convertAPIData = $this->insertAPITradeLog($decoded_data, $userId);
             return $convertAPIData;
         break;
         case 7: // player information - STABLE
             $convertAPIData = $this->insertAPIPlayerInformation($decoded_data, $userId, $anonymity);
             return $convertAPIData;
         break;
         case 9: // attackLog - STABLE
             $convertAPIData = $this->insertAPIAttackLog($decoded_data, $userId);
             return $convertAPIData;
         break;
         case 10: // missions
             $convertAPIData = $this->insertAPIMissions($decoded_data, $userId);
             return $convertAPIData;
         break;
         }

         $query = "UPDATE `userOverview` SET `lastUpdate` = " .$time. " WHERE `id` = '" .$userId. "'";
         $refreshLastUpdate = $this->conn->query($query);
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

         $getUserHeadquarter = $this->conn->query($query);

         if ($getUserHeadquarter->num_rows === 1) {
             while ($data = $getUserHeadquarter->fetch_assoc()) {
                 $baseData["user"]["hqPosition"]["lat"] = $data["lat"];
                 $baseData["user"]["hqPosition"]["lon"] = $data["lon"];
                 $baseData["user"]["level"] = $data["level"];

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
      * @method private insertUserToIndex($lastSeen, $tradingPartner, $tradingPartnerLevel, $userId, $sellValue, $buyValue)
      * @param  int   $lastSeen [timestamp of interaction]
      * @param string $tradingPartner [userName to be inserted or updated]
      * @param int $tradingPartnerLevel [userLevel to be inserted or updated]
      * @param int $userId [current userId from which this interaction was logged with]
      * @param int $sellValue [depending on action - 0 or int]
      * @param int $buyValue [depending on action - 0 or int]
      * @param int $transportCost [only when $buyvalue > 0, else is 0]
      * @return bool [true/false]
      */
     private function insertUserToIndex($lastSeen, $tradingPartner, $tradingPartnerLevel, $userId, $sellValue, $buyValue, $transportCost)
     {
         $transformIdToNameQuery = "SELECT `name` FROM `userOverview` WHERE `id` = " .$userId. "";
         $transformIdToName = $this->conn->query($transformIdToNameQuery);

         if ($transformIdToName->num_rows === 1) {
             while ($data = $transformIdToName->fetch_assoc()) {
                 $actingUser = $data["name"];
             }
         } else {
             $actingUser = "";
         }

         $checkExistingQuery = "SELECT `lastSeen`, `lastTradedWith` FROM `userIndex` WHERE `userName` = '" .$tradingPartner. "'";
         $checkExisting = $this->conn->query($checkExistingQuery);

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

         $insertion = $this->conn->query($query);

         if ($insertion) {
             return true;
         } else {
             return false;
         }
     }
 }
