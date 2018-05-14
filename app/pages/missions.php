<!-- #module-missions -->

<?php

$textOrientation = "text-md-right text-sm-left";

$columns = [
  "Mission"                 => "sorttable_nosort",
  "Goal"                    => "sorttable_nosort " .$textOrientation,
  "Cooldown"                => $textOrientation,
  "Time to complete (days)" => $textOrientation,
  "Reward"                  => "sorttable_nosort",
  "Profit"                  => $textOrientation,
  "Progress"                => "sorttable_nosort",
  "Started at..."           => $textOrientation,
  "Ends in... (days)"       => $textOrientation,
  "Penalty"                 => $textOrientation,
];

$arrayKeys = array_keys($columns);

?>

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-missions">

  <h6><span class="nav-icon-missions"></span> <span id="missions-header">Missions</span></h6>
  <hr class="mb-3">

  <div class="row">

    <div class="bg-light mt-3 mb-3 p-4 col-12 rounded">
      <table class="table table-responsive table-break-medium mb-3">
        <thead>
          <tr class="small">

            <?php

            $i = 0;

            foreach ($columns as $column => $specialClasses) {
                echo '
                <th id="mission-th-' .$i. '" class="' .$specialClasses. '">
                ' .$column. '
                </th>';
                $i += 1;
            }

            ?>

          </tr>
        </thead>
      <tbody>

        <?php

        $missions = [];

        $getExistingMissionsQuery = "SELECT `id`, `title`, `objective1`, `objective2` FROM `missions`";
        $getExistingMissions = $conn->query($getExistingMissionsQuery);

        if ($getExistingMissions->num_rows > 0) {
            while ($mission = $getExistingMissions->fetch_assoc()) {
                $missions[$mission["id"]]["name"] = $mission["title"];
                $missions[$mission["id"]]["objectives"] = [$mission["objective1"], $mission["objective2"]];
            }
        }

        foreach ($missions as $missionId => $subObj) {

            echo '
            <tr id="mission-' .$missionId. '">
              <td data-th="' .$arrayKeys[0]. '">
                <span class="rounded img-fluid resources-missions-' .$missionId. '"></span>
                <span class="ml-1">' .$subObj["name"]. '</span>
              </td>
              <td data-th="' .$arrayKeys[1]. '" class="' .$textOrientation. '">
                ' .$subObj["objectives"][0]. '
                <span id="mission-goal-' .$missionId. '"></span>
                ' .$subObj["objectives"][1]. '
              </td>
              <td data-th="' .$arrayKeys[2]. '" class="' .$textOrientation. '" id="mission-interval-' .$missionId. '"></td>
              <td data-th="' .$arrayKeys[3]. '" class="' .$textOrientation. '" id="mission-duration-' .$missionId. '"></td>
              <td data-th="' .$arrayKeys[4]. '">
                <span id="mission-reward-amount-' .$missionId. '"></span>x
                <span id="mission-reward-' .$missionId. '"></span>
              </td>
              <td data-th="' .$arrayKeys[5]. '" class="' .$textOrientation. '" id="mission-profit-' .$missionId. '"></td>
              <td data-th="' .$arrayKeys[6]. '" id="mission-progress-' .$missionId. '">
                <div id="mission-progress-wrap-' .$missionId. '" class="progress-wrap progress float-right">
                  <div id="mission-progress-bar-' .$missionId. '" class="progress-bar progress"></div>
                </div>
              </td>
              <td data-th="' .$arrayKeys[7]. '" class="' .$textOrientation. '" id="mission-start-' .$missionId. '"></td>
              <td data-th="' .$arrayKeys[8]. '" class="' .$textOrientation. '" id="mission-end-' .$missionId. '"></td>
              <td data-th="' .$arrayKeys[9]. '" class="' .$textOrientation. '" id="mission-penalty-' .$missionId. '"></td>
            </tr>';

        }

        ?>
        </tbody>
      </table>
    </div>
  </div>
</div>
