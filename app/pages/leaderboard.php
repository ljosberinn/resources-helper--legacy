<!-- #module-leaderboard -->

<?php

$textOrientation = "text-md-right text-sm-left";

$columns = [
    "Player" => "sorttable_nosort",
    "Level" => $textOrientation,
    "Points" => $textOrientation,
    "Mine income" => $textOrientation,
    "Amount of mines" => $textOrientation,
    "Mines within HQ radius" => $textOrientation,
    "Factory upgrades" => $textOrientation,
    "Company worth" => $textOrientation,
];

$arrayKeys = array_keys($columns);

?>

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-leaderboard">
    <h6><span class="nav-icon-leaderboard"></span> Leaderboard</h6>
    <hr class="mb-3">

    <div class="row">

        <div class="bg-light mt-3 mb-3 p-4 col-12 rounded">
            <table class="table table-responsive table-break-medium mb-3">
                <thead>
                <tr class="small">

                <?php

                foreach($columns as $column => $specialClasses) {
                    echo '
                    <th class="' .$specialClasses. '">
                    ' .$column. '
                    </th>';
                }
                ?>
                </tr>
                </thead>
                <tbody>

                <tr><td colspan="8">soon</td></tr>

                </tbody>
            </table>
        </div>
    </div>
</div>

