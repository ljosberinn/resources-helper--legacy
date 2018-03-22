<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
<meta name="theme-color" content="#342f2d"/>

<!-- All Search Engines -->
<meta name="robots" content="index,follow" />
<!-- Google Specific -->
<meta name="googlebot" content="index,follow" />

<!-- tell Google not to translate this page -->
<meta name="google" content="notranslate" />

<!-- admin contact information -->
<link rel="me" href="mailto:admin@gerritalex.de" />

<!-- DNS prefetch -->
<link rel="dns-prefetch" href="//code.highcharts.com" />
<link rel="dns-prefetch" href="//code.jquery.com" />
<link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
<link rel="dns-prefetch" href="//unpkg.com" />

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

<!-- general page information -->
<title>Resources Helper 3.0</title>

<!-- JS external -->
<script src="https://code.jquery.com/jquery-3.3.1.min.js" integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8=" crossorigin="anonymous"></script>
<script async src="https://cdn.jsdelivr.net/npm/sweetalert2@7.13.3/dist/sweetalert2.min.js" integrity="sha384-Y9tUtxNOtZ6td2fohELS1rJiv9Ktkpt6RVox+UOGikRop45QwDrzTAaUe6zsZdQ1" crossorigin="anonymous"></script>
<script async src="https://unpkg.com/tippy.js@2.2.3/dist/tippy.all.min.js" integrity="sha384-7iCQEHkOskB8DnHBeVzB1nkyndqNZ1Tk7C4tc4hQkeSJpLDJ1CJWxmCPtnM6WoQ8" crossorigin="anonymous"></script>

<!--

<script src="https://cdn.jsdelivr.net/npm/blazy@1.8.2/blazy.min.js" defer integrity="sha384-FlX58eB2jw6JYcxbyEMdW++p13qEtlQOjzF8zIX4n0t6TfNZq9KV0vNdMoSg6Gqn" crossorigin="anonymous"></script>
<script src="https://code.highcharts.com/highcharts.js" defer></script>
<script src="https://code.highcharts.com/highcharts-more.js" defer></script>
<script src="https://code.highcharts.com/modules/solid-gauge.js" defer></script>
<script src="https://code.highcharts.com/modules/sankey.js" defer></script>
-->

<!-- JS internal -->
<?php

$jsFiles = [
  "assets/js/functions.min.js" => [
    "mode" => "",
    "params" => "",
    "type" => "js",
  ],
  "assets/js/sorttable.min.js" => [
    "mode" => "",
    "params" => "",
    "type" => "js",
  ],
];

appendFiles($jsFiles);

?>
