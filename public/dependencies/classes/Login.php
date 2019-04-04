<?php declare(strict_types=1);

class Login extends Authentication {

    private $probablyUser;

    private const USER_BLUEPRINT = [
        'isAuthenticated' => true,
        'settings'        => [
            'remembersAPIKey' => false,
            'locale'          => 'en',
            'price'           => [
                'type'  => 'json',
                'range' => 72,
            ],
        ],
        'playerInfo'      => [
            'userName'   => '',
            'level'      => 0,
            'rank'       => 0,
            'registered' => 0,
        ],
        'API'             => [
            'isAPIUser'           => false,
            'key'                 => '',
            'remainingAPICredits' => 0,
            'lastUpdates'         => [
                'factories'        => 0,
                'specialBuildings' => 0,
                'mines'            => 0,
                'warehouses'       => 0,
                'tradeLog'         => 0,
                'combatLog'        => 0,
            ],
        ],
    ];

    private const QUERIES = [
        'isRegisteredUser' => 'SELECT `apiKey`, `mail`, `playerIndexUID`, `playerLevel`, `points`, `rank`, `registered`, `remainingAPICredits`, `password` FROM `user` WHERE `mail` = :mail',
    ];

    public function __construct(string $mail, string $password) {
        parent::__construct($mail, $password);
    }

    public function isRegisteredUser(): bool {
        $stmt = $this->pdo->prepare(self::QUERIES['isRegisteredUser']);
        $stmt->execute([
            'mail' => $this->mail,
        ]);

        if($stmt->rowCount() === 1) {
            $this->probablyUser = $stmt->fetch();
            return true;
        }

        return false;
    }

    public function isCorrectPassword(): bool {
        return password_verify($this->password, $this->probablyUser['password']);
    }

    public function login(): array {
        $user = self::USER_BLUEPRINT;

        $playerIndexUID = $this->probablyUser['playerIndexUID'];

        [$factories, $lastFactoryUpdate] = (new Factory())->getUserFactories($playerIndexUID);
        [$mines, $lastMineUpdate] = (new Mine())->getUserMines($playerIndexUID);
        [$specialBuildings, $lastSpecialBuildingUpdate] = (new SpecialBuilding())->getUserSpecialBuildings($playerIndexUID);
        [$warehouses, $lastWarehouseUpdate] = (new Warehouse())->getUserWarehouses($playerIndexUID);

        $user['API']['key']                 = $this->probablyUser['apiKey'];
        $user['API']['isAPIUser']           = strlen($this->probablyUser['apiKey']) === 45;
        $user['API']['remainingAPICredits'] = $this->probablyUser['remainingAPICredits'];

        $user['playerInfo']['level']      = $this->probablyUser['playerLevel'];
        $user['playerInfo']['points']     = $this->probablyUser['points'];
        $user['playerInfo']['rank']       = $this->probablyUser['rank'];
        $user['playerInfo']['registered'] = $this->probablyUser['registered'];
        $user['playerInfo']['userName']   = (new PlayerIndex($this->pdo))->getPlayerNameByID($playerIndexUID);

        $user['API']['lastUpdates']['factories']        = $lastFactoryUpdate;
        $user['API']['lastUpdates']['mines']            = $lastMineUpdate;
        $user['API']['lastUpdates']['specialBuildings'] = $lastSpecialBuildingUpdate;
        $user['API']['lastUpdates']['warehouses']       = $lastWarehouseUpdate;

        $marketPrices = new MarketPrices();
        $marketPrices->setExportRange(72);

        return [
            'user'             => $user,
            'factories'        => $factories,
            'specialBuildings' => $specialBuildings,
            'mines'            => $mines,
            'warehouses'       => $warehouses,
            'marketPrices'     => $marketPrices->getArray(),
        ];
    }
}
