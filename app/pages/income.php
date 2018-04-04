<!-- #module-income -->

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-income">

	<h6>Income</h6>
	<hr class="mb-3">

	<div id="income-accordion" role="tablist" aria-multiselectable="true" class="col">

		<?php

		$accordion = "income-accordion";
		$folder = "income";

		$cards = [
			[
				"id" => "mines",
				"heading" => '<span class="nav-icon-mines"></span> Mines',
			],
			[
				"id" => "qualitycomparator",
				"heading" => '<span class="nav-icon-qualitycomparator"></span> Quality Comparator',
			],
			[
				"id" => "factories",
				"heading" => '<span class="nav-icon-factories"></span> Factories',
			],
			[
				"id" => "diamond",
				"heading" => '<span><img src="assets/img/icons/gd.png" alt="Giant diamond"></span> Calc',
			],
			[
				"id" => "flow",
				"heading" => '<span>' .file_get_contents("assets/img/icons/flow.svg"). '</span> Material Flow',
			],
		];

		foreach($cards as $details) {

			buildCard($accordion, $folder, $details["id"], $details["heading"]);

		}

		?>

	</div>

</div>
