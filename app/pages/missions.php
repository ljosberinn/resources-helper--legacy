<!-- #module-missions -->

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-missions">

	<h6><span class="nav-icon-missions"></span> Missions</h6>
	<hr class="mb-3">

  <div class="row">
		<div class="col-xs-12 col-md-12">
      <div id="missions-accordion" role="tablist" aria-multiselectable="true" class="col">

        <?php

        $missionIds = [
          9 => "Bob The Builder",
          10 => "Who let the dogs out?",
          11 => "Need clay!",
          12 => "Collectoritis",
          14 => "Scan junkie",
          17 => "Warehouse boss",
          21 => "From old make new",
          22 => "Stinginess is awesome!",
          25 => "Aggressor",
          26 => "Need medical technology!",
          28 => "Need copper!",
          30 => "Lord of the missions",
          31 => "Need more insecticides!",
          32 => "Time is Money",
          33 => "Paranoia?",
          35 => "Pimp my mine",
          37 => "Pimp my factory",
          38 => "Maintenance",
          39 => "Pretty batteries",
          41 => "Consolation money",
          42 => "Insurance",
          43 => "Wanderer",
          44 => "Service",
          45 => "Transport premium",
          50 => "Truck dealer",
          55 => "...anyone need drones?",
        ];

        foreach($missionIds as $missionId => $name) {
          echo '
          <div class="card">
      			<div class="card-header bg-dark" role="tab" id="mission-' .$missionId. '">
      				<h5 class="mb-0">
      					<a class="collapsed" data-toggle="collapse" data-parent="#missions-accordion" href="#collapse-missions-' .$missionId. '" aria-expanded="false" aria-controls="collapse-missions-' .$missionId. '" id="heading-mission-' .$missionId. '">
                  <span class="rounded img-fluid resources-missions-' .$missionId. '"></span>
                  <span class="ml-1">' .$name. '</span>
      					</a>
      				</h5>
      			</div>

      			<div id="collapse-missions-' .$missionId. '" class="collapse" role="tabpanel" aria-labelledby="heading-mission-' .$missionId. '">
      				<div class="card-block p-4 bg-light">

              <p>Cooldown: <span id="mission-cooldown-' .$missionId. '"></span></p>
              <p>Duration: <span id="mission-duration-' .$missionId. '"></span></p>
              <p>Goal: <span id="mission-goal-' .$missionId. '"></span></p>
              <p>Interval: <span id="mission-interval-' .$missionId. '"></span></p>
              <p>Penalty: <span id="mission-penalty-' .$missionId. '"></span></p>
              <p>Current progress: <span id="mission-progress-' .$missionId. '"></span></p>
              <p>Reward: <span id="mission-reward-' .$missionId. '"></span></p>
              <p>Reward Amount: <span id="mission-reward-amount-' .$missionId. '"></span></p>
              <p>StartTimestamp: <span id="mission-start-' .$missionId. '"></span></p>
              <p>EndTimestamp: <span id="mission-end-' .$missionId. '"></span></p>
              <p>Status: <span id="mission-status-' .$missionId. '"></span></p>

      				</div>
      			</div>
      		</div>';
        }

        ?>

    	</div>
    </div>
  </div>
</div>
