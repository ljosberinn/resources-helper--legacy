<!-- #module-leaderboard -->

<?php

$textOrientation = "text-md-right text-sm-left";

$columns = [
    "Player (hover for details)"        => "sorttable_nosort",
    "Points per day (total points)"     => $textOrientation,
    "Factory upgrades"                  => $textOrientation,
    "Amount of mines"                   => $textOrientation,
    "Mines within HQ radius"            => $textOrientation,
    "Mine income"                       => $textOrientation,
    "Trade income per day"              => $textOrientation,
    "Bought goods for..."               => $textOrientation,
    "Sold goods for..."                 => $textOrientation,
    "Sold goods to KI for..."           => $textOrientation,
    "Company worth (hover for details)" => $textOrientation,
];

$arrayKeys = array_keys($columns);

?>

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-leaderboard">
    <h6><span class="nav-icon-leaderboard"></span> Leaderboard - values based on average of last 3 days</h6>
    <hr class="mb-3">

    <div class="row">

        <div class="bg-light mt-3 mb-3 p-4 col-12 rounded">
            <table class="table table-responsive table-striped table-break-medium mb-3">
                <thead>
                <tr class="small">

                <?php

                foreach ($columns as $column => $specialClasses) {
                    echo '
                    <th class="' .$specialClasses. '">
                    ' .$column. '
                    </th>';
                }
                ?>
                </tr>
                </thead>
                <tbody>

                <tr><td colspan="11" class="text-center">...loading...</td></tr>

                </tbody>
            </table>
        </div>
    </div>
</div>

