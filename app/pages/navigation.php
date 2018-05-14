<!-- navbar -->

<nav class="col-12 p-4 bg-light rounded">

<!--<p class="text-warning text-center">MAINTENANCE - DISRUPTIONS POSSIBLE || WARTUNGSARBEITEN - UNTERBRECHUNGEN MÖGLICH</p> -->

  <ul class="nav nav-tabs">
  <?php

  $icons = [
    "map",
    "table",
    "chart",
    "flow",
    "piechart",
    "pencil",
  ];

  foreach ($icons as $icon) {
      ${"" .$icon. ""} = "<span>" .file_get_contents("assets/img/icons/" .$icon. ".svg"). "</span>";
  }

  if (!isset($_SESSION["id"])) {
      echo '
      <li class="nav-item">
      <a class="nav-link" href="#registrationlogin" data-target="module-registrationlogin"><span>' .$pencil. '</span> Registration & Login</a>
      </li>';
  }

  $navigationTabs = [
      "API" => [
        "href" => "api",
      ],
      "Mines" => [
        "href"      => "mines",
        "spanClass" => "nav-icon-mines",
      ],
      "Factories" => [
        "href"      => "factories",
        "class"     => "active",
        "spanClass" => "nav-icon-factories",
      ],
      "Calc" => [
        "href" => "diamond",
        "img"  => "<span><img src='assets/img/icons/gd.png' alt='Giant diamond' /></span>",
      ],
      "Material Flow" => [
        "href" => "flow",
        "icon" => $flow,
      ],
      "Warehouses" => [
        "href"      => "warehouses",
        "spanClass" => "nav-icon-warehouses",
      ],
      "Special Buildings" => [
        "href"      => "buildings",
        "spanClass" => "nav-icon-buildings",
      ],
      "Recycling & Units" => [
        "href" => "recyclingunits",
        "icon" => $table,
      ],
      "Tech-Upgrades" => [
        "href" => "techupgrades",
        "icon" => $table,
      ],
      "Headquarter" => [
        "href"      => "headquarter",
        "spanClass" => "nav-icon-headquarter",
      ],
      "Missions" => [
        "href"      => "missions",
        "spanClass" => "nav-icon-missions",
        "login"     => "required"
      ],
      "Trade Log" => [
        "href"  => "tradelog",
        "icon"  => $piechart,
        "login" => "required"
      ],
      "Attack Log" => [
        "href"  => "attacklog",
        "icon"  => $table,
        "login" => "required"
      ],
      "Maps" => [
        "href" => "maps",
        "icon" => $map,
      ],
      "Price History" => [
        "href" => "pricehistory",
        "icon" => $chart,
      ],
      "Quality Comparator" => [
        "href"      => "qualitycomparator",
        "spanClass" => "nav-icon-qualitycomparator",
      ],
      "Leaderboard" => [
        "href"      => "leaderboard",
        "spanClass" => "nav-icon-leaderboard",
      ],
      "Discord" => [
        "href"      => "discord",
        "spanClass" => "nav-icon-discord"
      ],
      "Changelog" => [
        "href"      => "changelog",
        "spanClass" => "nav-icon-changelog"
        ]
    ];

    foreach ($navigationTabs as $text => $subInfo) {

        if ($subInfo["login"] && !isset($_SESSION["id"])) {
            continue;
        }

        if ($subInfo["icon"]) {
            $img = $subInfo["icon"];
        } else if ($subInfo["img"]) {
            $img = $subInfo["img"];
        } else {
            $img = '<span class="' .$subInfo["spanClass"]. '"></span>';
        }

        echo '
        <li class="nav-item">
        <a class="nav-link ' .$subInfo["class"]. '" id="nav-' .$subInfo["href"]. '" data-target="module-' .$subInfo["href"]. '" href="#' .$subInfo["href"]. '">
        ' .$img. ' ' .$text. '
        </a>
        </li>';

    }

  ?>
  </ul>

</nav>
