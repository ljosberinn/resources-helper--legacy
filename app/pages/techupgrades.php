<!-- #module-techupgrades -->

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-techupgrades">

	<h6><span><?php echo file_get_contents("assets/img/icons/table.svg"); ?></span> Tech-Upgrades</h6>
	<hr class="mb-3">

	<div id="techupgrades-accordion" role="tablist" aria-multiselectable="true" class="col">
		<div class="card">
			<div class="card-header bg-dark" role="tab" id="heading-tu-1">
				<h5 class="mb-0">
					<a class="collapsed" data-toggle="collapse" data-parent="#techupgrades-accordion" href="#collapse-techupgrades-calc" aria-expanded="false" aria-controls="collapse-techupgrades-calc">
						Tech-Upgrade Calculator
					</a>
				</h5>
			</div>

			<div id="collapse-techupgrades-calc" class="collapse" role="tabpanel" aria-labelledby="heading-tu-1">
				<div class="card-block p-4 bg-light">

				<?php

				require "app/pages/techupgrades/calculator.php";

				?>

				</div>
			</div>
		</div>

		<div class="card">
			<div class="card-header bg-dark" role="tab" id="heading-tu-2">
				<h5 class="mb-0">
					<a class="collapsed" data-toggle="collapse" data-parent="#techupgrades-accordion" href="#collapse-techupgrades" aria-expanded="true" aria-controls="collapse-techupgrades">
						Tech-Upgrade Combinations
					</a>
				</h5>
			</div>


			<div id="collapse-techupgrades" class="collapse show" role="tabpanel" aria-labelledby="heading-tu-2">
				<div class="card-block p-4 bg-light">

					<?php

					require "app/pages/techupgrades/combinations.html";

					?>

				</div>
			</div>
		</div>
	</div>


</div>
