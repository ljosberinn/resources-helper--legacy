<?php

session_start (['cookie_lifetime' => 86400,]);

ob_start ();

$generalHeaders = [
    "X-Content-Type-Options: nosniff",
    "Strict-Transport-Security: max-age=63072000; includeSubDomains; preload",
    "X-Frame-Options: DENY",
    "X-XSS-Protection: 1; mode=block",
];

foreach ($generalHeaders as $header) {
    header ($header);
}

require_once 'api/functions.php';
require_once 'api/db.php';

$conn = new mysqli($host, $user, $pw, $db);
$conn->set_charset ("utf-8");

if (isset($_GET["source"])) {
    highlight_file ("index.php");
    die();
}

if (isset($_GET["logout"])) {
    session_destroy ();
    unset($_COOKIE["loggedIn"]);
    setcookie ("loggedIn", false, 0, '/', 'resources-helper.de');
    header ("Location: index.php");
}

if (isset($_POST["registration-mail"]) && isset($_POST["registration-pw-1"]) && isset($_POST["registration-pw-2"]) && isset($_POST["registration-language"]) && isset($_POST["registration-api-key"])) {
    require_once "api/registrationHandling.php";
}

if (isset($_POST["login-mail"]) && isset($_POST["login-pw"])) {
    require_once "api/loginHandling.php";
}

ob_end_flush ();

?>
<!DOCTYPE html>
<html prefix="og: http://ogp.me/ns#" lang="en" itemscope itemtype="http://schema.org/WebPage">
<head>

    <?php

    require_once "app/head.php";

    ?>

</head>

<body class="container-fluid">
<!-- header -->
<header class="row mt-2 mb-2 ml-1 mr-1">

    <?php

    require_once "app/pages/header.php";

    if (isset($_SESSION["id"])) {
        require_once "app/pages/statusbar.php";
    }

    require_once "app/pages/navigation.php";

    ?>

</header>
<!-- main -->
<main class="row mt-2 mb-2 ml-1 mr-1">

    <?php

    if (!isset($_SESSION["id"])) {
        require_once "app/pages/registrationlogin.php";
    } elseif (isset($_SESSION["id"])) {
        require_once "app/pages/settings.php";
    }

    $subPages = [
        "noscript",
        "api",
        "mines",
        "qualitycomparator",
        "factories",
        "flow",
        "diamond",
        "changelog",
        "maps",
        "warehouses",
        "buildings",
        "pricehistory",
        "recyclingunits",
        "techupgrades",
        "headquarter",
        "leaderboard",
        "discord",
        "contact",
        "tos",
        "donate",
    ];

    if (isset($_SESSION["id"])) {
        $additionalFeatures = [
            "tradelog",
            "attacklog",
            "missions",
        ];

        foreach ($additionalFeatures as $link) {
            $subPages[] = $link;
        }
    }

    foreach ($subPages as $pageLink) {
        require_once "app/pages/" . $pageLink . ".php";
    }

    ?>
</main>
<!-- footer -->
<footer class="row mt-2 mb-2 ml-1 mr-1 bg-light rounded justify-content-center">
    <?php

    require_once "app/pages/footer.php";

    ?>
</footer>

<?php

$JSFiles = [
    "assets/js/bootstrap.bundle.min.js" => [
        "mode"   => "",
        "params" => "",
        "type"   => "js",
    ],
    "assets/js/general.min.js"          => [
        "mode"   => "",
        "params" => "",
        "type"   => "js",
    ],
    "assets/js/rHelper.min.js"          => [
        "mode"   => "",
        "params" => "",
        "type"   => "js",
    ],
    "assets/js/variableJS.php"          => [
        "mode"   => "",
        "params" => explodeGET ($_GET),
        "type"   => "js",
    ],
];

appendFiles ($JSFiles);

?>

</body>

</html>
