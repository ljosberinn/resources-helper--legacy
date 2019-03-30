<?php declare(strict_types=1);

header('Content-type: application/json');

require_once '../_boot.php';

$DB_ERROR = ['error' => 'Database has gone away'];

$legacyDB = [
    'server' => getenv('LEGACY_DB_HOST'),
    'user'   => (string) getenv('LEGACY_DB_USER'),
    'pass'   => (string) getenv('LEGACY_DB_PASS'),
    'dbname' => getenv('LEGACY_DB_NAME'),
];
try {
    $legacyDB = new PDO('mysql:host=' . $legacyDB['server'] . ';dbname=' . $legacyDB['dbname'] . ';charset=utf8', $legacyDB['user'], $legacyDB['pass'], [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch(PDOException $error) {
    echo json_encode(['error' => $error->getMessage()]);
    die;
}

$marketPrices = new MarketPrices();

$getStmt = $legacyDB->query('SELECT * FROM `price` WHERE `ts` > ' . $marketPrices->getMostRecentTimestamp() . ' ORDER BY `ts` ASC LIMIT 400');

if(!$getStmt) {
    echo json_encode($DB_ERROR);
    die;
}

$response = $getStmt->fetchAll();

if(empty($response)) {
    echo json_encode(['error' => 'no data available']);
    die;
}

if(!$response) {
    echo json_encode($DB_ERROR);
    die;
}

foreach($response as $dataset) {
    $prices = [
        'timestamp' => $dataset['ts'],
    ];

    foreach(MarketPrices::ID_MAP as $newID => $oldID) {
        $prices['ai_' . $newID]     = $dataset[$oldID . '_k'];
        $prices['player_' . $newID] = $dataset[$oldID . '_tk'];
    }

    try {
        $marketPrices->save($prices);
    } catch(PDOException $error) {
        // circumvent integrity constraint errors; the previous cronjob apparently had its hickups
    }
}

?>
<script>
  setTimeout(() => {
    location.reload();
  }, 500);
</script>
