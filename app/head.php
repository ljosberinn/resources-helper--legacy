<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
<meta name="theme-color" content="#342f2d"/>

<!-- All Search Engines -->
<meta name="robots" content="index,follow" />
<!-- Google Specific -->
<meta name="googlebot" content="index,follow" />
<!-- admin contact information -->
<link rel="me" href="mailto:admin@gerritalex.de" />

<!-- general page information -->
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="Resources Helper" />
<meta name="mobile-web-app-capable" content="yes" />
<meta name="application-name" content="Resources Helper" />
<meta name="description" content="Resources Helper is your go-to calculator for Resources mobile GPS real-time economy simulation" />

<meta name="author" content="Gerrit Alex" />
<meta name="language" content="en" />

<meta name="keywords" lang="en" content="calculator, realtime, mobile, game, android, economy simulation" />
<meta name="reply-to" content="admin@gerritalex.de" />
<meta name="distribution" content="global" />
<meta name="revisit-after" content="7 days" />
<meta name="page-topic" content="Resources Helper is your go-to calculator for Resources mobile GPS real-time economy simulation" />

<!-- favicons, generated via http://realfavicongenerator.net/ -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="manifest" href="/manifest.json" />
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
<meta name="apple-mobile-web-app-title" content="Resources Helper" />
<meta name="application-name" content="Resources Helper" />
<meta name="theme-color" content="#ffffff" />

<!-- OpenGraph for Facebook & WhatsApp -->
<meta property="og:title" content="Resources Helper" />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://resources-helper.de/">
<meta property="og:description" content="Resources Helper is your go-to calculator for Resources mobile GPS real-time economy simulation" />

<!-- Google+ page description -->
<meta itemprop="name" content="Resources Helper" />
<meta itemprop="description" content="Resources Helper is your go-to calculator for Resources mobile GPS real-time economy simulation" />
<meta itemprop="lastReviewed" content="2018-05-03" />

<!-- Twitter page description -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Resources Helper" />
<meta name="twitter:description" content="Resources Helper is your go-to calculator for Resources mobile GPS real-time economy simulation" />
<meta name="twitter:creator" content="@gerrit_alex" />

<title>Resources Helper</title>

<!-- DNS prefetch -->
<link rel="dns-prefetch" href="//code.highcharts.com" />
<link rel="dns-prefetch" href="//maps.googleapis.com" />
<link rel="dns-prefetch" href="//code.jquery.com" />
<link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
<link rel="dns-prefetch" href="//unpkg.com" />
<link rel="dns-prefetch" href="//maps.googleapis.com" />

<!-- external stylesheets
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans"> -->

<!-- internal stylesheets -->
<link rel="stylesheet" href="assets/css/GoogleFonts_OpenSans.min.css" />
<link rel="stylesheet" href="assets/css/sweetalert2.min.css" />

<?php

$cssFiles = [
    "assets/css/bootstrap.custom.min.css" => [
        "mode" => "",
        "params" => "",
        "type" => "css",
    ],
    "assets/css/custom.min.css" => [
        "mode" => "",
        "params" => "",
        "type" => "css",
    ],
];

appendFiles($cssFiles);

?>

<!-- hacky inline stylesheets -->
<?php

if (isset($_SESSION["id"])) {
    echo '
    <style>
    @media (max-width: 639px) {
        #loading-container {
            display: block;
            text-align: center;
            margin-top: 5px;
        }
    }
    </style>';
} else {
    echo '
    <style>
    @media (max-width: 1240px) {
        #loading-container {
            display: block;
            text-align: center;
            margin-top: 5px;
        }
    }
    </style>';
}

?>

<!-- JS external -->
<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
<script async src="https://cdn.jsdelivr.net/npm/sweetalert2@7.13.3/dist/sweetalert2.min.js" integrity="sha384-Y9tUtxNOtZ6td2fohELS1rJiv9Ktkpt6RVox+UOGikRop45QwDrzTAaUe6zsZdQ1" crossorigin="anonymous"></script>
<script async src="https://unpkg.com/tippy.js@2.2.3/dist/tippy.all.min.js" integrity="sha384-7iCQEHkOskB8DnHBeVzB1nkyndqNZ1Tk7C4tc4hQkeSJpLDJ1CJWxmCPtnM6WoQ8" crossorigin="anonymous"></script>
<script src="https://code.highcharts.com/highcharts.js"></script>
<script src="https://code.highcharts.com/modules/exporting.js" defer></script>
<script src="https://code.highcharts.com/highcharts-more.js"></script>
<script src="https://code.highcharts.com/modules/solid-gauge.js"></script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyD7JN_jcvNN6DmE87oBDzLluIMZsvrF0zw" async></script>
<script src="https://unpkg.com/sticky-table-headers"></script>

<!-- JS internal -->
<?php

$jsFiles = [
    "assets/js/sorttable.min.js" => [
        "mode" => "",
        "params" => "",
        "type" => "js",
    ],
    "assets/js/googleMarkerCluster.min.js" => [
        "mode" => "async",
        "params" => "",
        "type" => "js",
    ],
];

appendFiles($jsFiles);

?>
