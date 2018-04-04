
<?php

$textOrientation = "text-md-right text-sm-left";

?>

<div class="row">
	<div class="col-12 justify-content-center">

		<figure class="figure col-md-8 col-sm-12">
			<img src="assets/img/techcalc.png" class="figure-img img-fluid rounded" alt="">
			<figcaption class="figure-caption">Imagine you messed up teching a mine. This shows you possible <strong class="text-warning">remaining</strong> combinations to reach a boost factor higher than 5.0 depending on its current boost factor.
			</figcaption>
		</figure>

		<div class="form-group">
			<label class="custom-control custom-checkbox">
				<input class="custom-control-input" id="techupgrades-calc-tu4-allowance" type="checkbox">
				<span class="custom-control-indicator"></span>
				<span class="custom-control-description">allow Tech-Upgrade 4</span>
			</label>
		</div>

		<div class="input-group">

			<input class="form-control col-md-6 col-sm-12 form-control-sm <?php echo $textOrientation; ?>" id="techupgrades-input" type="number" min="0" max="5" placeholder="current factor" />

			<span class="input-group-addon">
				<span id="techupgrades-loading" class="circles-to-rhombuses-spinner">
		      <span class="rhombuses-circle"></span>
		      <span class="rhombuses-circle"></span>
		      <span class="rhombuses-circle"></span>
		    </span>
		    <span id="techupgrades-finished"><?php echo file_get_contents("assets/img/icons/success.svg"); ?></span>
			</span>
		</div>

    <table class="table table-responsive table-break-medium table-striped mb-3" id="techupgrades-calc-tbl">
			<thead>
				<tr class="small">
          <th class="<?php echo $textOrientation; ?>">missing Tech-Upgrade 1</th>
					<th class="<?php echo $textOrientation; ?>">missing Tech-Upgrade 2</th>
					<th class="<?php echo $textOrientation; ?>">missing Tech-Upgrade 3</th>
					<th class="<?php echo $textOrientation; ?>">missing Tech-Upgrade 4</th>
					<th class="<?php echo $textOrientation; ?>">resulting Factor</th>
					<th class="<?php echo $textOrientation; ?> sorttable_reverse">Price</th>
					<th class="<?php echo $textOrientation; ?>">remaining Pimp my mine Count</th>
				</tr>
			</thead>
			<tbody>

			</tbody>
		</table>
	</div>
</div>
