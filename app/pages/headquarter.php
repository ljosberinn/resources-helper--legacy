<?php

if($_SESSION["id"]) {
  $show1 = "show";
  $show2 = "";
} else {
  $show1 = "";
  $show2 = "show";
}

?>

<!-- #module-headquarter -->

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-headquarter">

	<h6><span class="nav-icon-headquarter"></span> Headquarter</h6>
	<hr class="mb-3">

	<div id="headquarter-accordion" role="tablist" aria-multiselectable="true" class="col">
		<div class="card">
			<div class="card-header bg-dark" role="tab" id="heading-hq-1">
				<h5 class="mb-0">
					<a class="collapsed" data-toggle="collapse" data-parent="#headquarter-accordion" href="#collapse-headquarter-info" aria-expanded="false" aria-controls="collapse-headquarter-info">
						Personal Headquarter progress
					</a>
				</h5>
			</div>

			<div id="collapse-headquarter-info" class="collapse <?php echo $show1; ?>" role="tabpanel" aria-labelledby="heading-hq-1">
				<div class="card-block p-4 bg-light">

				<?php

				require "app/pages/headquarter/headquarter.php";

				?>

				</div>
			</div>
		</div>

		<div class="card">
			<div class="card-header bg-dark" role="tab" id="heading-hq-2">
				<h5 class="mb-0">
					<a class="collapsed" data-toggle="collapse" data-parent="#headquarter-accordion" href="#collapse-headquarter-ovw" aria-expanded="true" aria-controls="collapse-headquarter-ovw">
						General requirements
					</a>
				</h5>
			</div>


			<div id="collapse-headquarter-ovw" class="collapse <?php echo $show2; ?>" role="tabpanel" aria-labelledby="heading-hq-2">
				<div class="card-block p-4 bg-light">

					<?php

					require "app/pages/headquarter/overview.php";

					?>

				</div>
			</div>
		</div>
	</div>
</div>
