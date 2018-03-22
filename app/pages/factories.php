<!-- #module-factories -->

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-factories">
	<h6><span class="nav-icon-factories"></span> Factories</h6>
	<hr class="mb-3">

	<div class="row">
		<div class="col-xs-12 col-md-12">

			<table class="table table-responsive table-break-medium table-striped mb-3">
				<thead>
					<tr class="text-small">
						<th class="sorttable_nosort">Factory</th>
						<th class="text-md-right text-sm-left sorttable_nosort">Factory Level</th>
						<th class="text-md-right text-sm-left sorttable_nosort">Product</th>
						<th class="text-md-right text-sm-left sorttable_nosort">Dependencies</th>
						<th class="text-md-right text-sm-left sorttable_numeric">Workload</th>
						<th class="text-md-right text-sm-left">Turnover</th>
						<th class="text-md-right text-sm-left">Turnover Increase per Upgrade</th>
						<th class="text-md-right text-sm-left">Upgrade Cost</th>
						<th class="text-md-right text-sm-left">Return on Investment</th>
					</tr>
				</thead>
				<tbody>

				<?php

        for ($i = 0; $i <= 21; $i += 1) {
          echo '
					<tr>
						<td data-th="Factory">
							<div class="resources-factories-' .$i. '"></div>
						</td>
						<td data-th="Factory Level">
							<input type="number" min="0" max="1000" class="form-control form-control-sm text-md-right text-sm-left" id="factories-level-' .$i. '" />
						</td>
						<td class="text-md-right text-sm-left" data-th="Product">
							<span id="factories-product-' .$i. '"></span> <span class="resources-product-' .$i. '"></span>
						</td>
						<td class="text-md-right text-sm-left" id="factories-dependencies-' .$i. '" data-th="Dependencies"></td>
						<td class="text-md-right text-sm-left" id="factories-workload-' .$i. '" data-th="Workload"></td>
						<td class="text-md-right text-sm-left" id="factories-turnover-' .$i. '" data-th="Turnover"></td>
						<td class="text-md-right text-sm-left" id="factories-increase-per-upgrade-' .$i. '" data-th="Turnover Increase per Upgrade"></td>
						<td class="text-md-right text-sm-left" id="factories-upgrade-cost-' .$i. '" data-th="Upgrade Cost"></td>
						<td class="text-md-right text-sm-left" id="factories-roi-' .$i. '" data-th="Return on Investment"></td>
					</tr>';
        }

        ?>
				</tbody>
				<tfoot>
          <tr>
            <td></td>
            <td class="text-md-right text-sm-left text-muted" data-th="Total factory upgrades"><strong id="factories-total-upgrades"></strong></td>
            <td colspan="7"></td>
          </tr>
				</tfoot>
			</table>
		</div>
	</div>
</div>
