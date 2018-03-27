<!-- #module-mines -->

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-mines">
	<h6><span class="nav-icon-mines"></span> Mines</h6>
	<hr class="mb-3">

	<div class="row">
		<div class="col-xs-12 col-md-12">

			<table class="table table-responsive table-break-medium table-striped mb-3">
				<thead>
					<tr class="small">
						<?php

						$mineTH = [
							"" => 'class="sorttable_nosort"',
							"Your rate per hour" => 'class="text-md-right text-sm-left sorttable_nosort"',
							"Your amount of mines" => 'class="text-md-right text-sm-left sorttable_nosort"',
							"Worth @ 100% condition" => 'class="text-md-right text-sm-left"',
							"Mine price" => 'class="text-md-right text-sm-left"',
							"100% quality income" => 'class="text-md-right text-sm-left"',
							"Return on Investment: 100%" => 'class="text-md-right text-sm-left"',
              "505%" => 'class="text-md-right text-sm-left"',
              "505% + your HQ level" => 'class="text-md-right text-sm-left"',
						];

						foreach($mineTH as $row => $attr) {
							echo "
							<th " .$attr. ">
								" .$row. "
							</th>";
						}

						?>
					</tr>
				</thead>
				<tbody>

			<?php

      for ($i = 0; $i <= 13; $i += 1) {
        echo '
          <tr>
						<td data-th="Mine type">
							<span class="resources-material-' .$i. '"></span>
						</td>
						<td data-th="Your rate per hour">
							<input class="form-control form-control-sm text-md-right text-sm-left" id="material-rate-' .$i. '" type="number" min="0" max="999999999" placeholder="rate/h" />
						</td>
						<td data-th="Your amount of mines">
							<input class="form-control form-control-sm text-md-right text-sm-left" id="material-amount-of-mines-' .$i. '" type="number" min="0" max="35000" placeholder="# mines" />
						</td>
						<td class="text-md-right text-sm-left" id="material-worth-' .$i. '" data-th="Worth @ 100% condition"></td>
						<td class="text-md-right text-sm-left" id="material-new-price-' .$i. '" data-th="Mine price"></td>
						<td class="text-md-right text-sm-left" id="material-perfect-income-' .$i. '" data-th="100% quality income"></td>
						<td class="text-md-right text-sm-left" id="material-roi-100-' .$i. '" data-th="Return on Investment - 100%"></td>
						<td class="text-md-right text-sm-left" id="material-roi-500-' .$i. '" data-th="Return on Investment - 505%"></td>
						<td class="text-md-right text-sm-left" id="material-roi-x-' .$i. '" data-th="Return on Investment - 505% + your HQ level"></td>
					</tr>';
      }

      ?>
				</tbody>
				<tfoot>
					<tr>
						<td class="text-muted text-md-right text-sm-left" data-th="Total amount of mines" colspan="3">
							<strong id="material-total-mine-count"></strong>
						</td>
						<td class="text-muted text-md-right text-sm-left" data-th="Total worth/h @ 100% condition">
							<strong id="material-total-worth"></strong>
						</td>
						<td colspan="2"></td>
            <td class="text-sm-left text-md-center text-muted" id="material-custom-tu-price" colspan="3" data-th="Combined custom TU price"></td>
					</tr>
				</tfoot>
			</table>
		</div>
    <div class="col-xs-12 col-md-12" id="graph-material"></div>
	</div>
</div>
