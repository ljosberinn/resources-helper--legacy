<!-- #module-diamond -->

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-diamond">
	<h6><span class="nav-icon-factories"></span> Factories</h6>
	<hr class="mb-3">

	<div class="row">
		<div class="col-xs-12 col-md-12">

			<table class="table table-responsive table-break-medium table-striped mb-3">
				<thead>
					<tr class="text-small">
						<th class="sorttable_nosort">Factory</th>
						<th class="text-md-right text-sm-left sorttable_nosort">Factory level</th>
						<th class="text-md-right text-sm-left sorttable_nosort">Product & required Warehouse level</th>
						<th class="sorttable_nosort">Dependencies & required Warehouse level</th>
						<th class="text-md-right text-sm-left">Efficiency</th>
						<th class="text-md-right text-sm-left">Profit</th>
					</tr>
				</thead>
				<tbody>

				<?php

        for ($i = 0; $i <= 21; $i += 1) {
          echo '
					<tr>
						<td>
              <span class="resources-factories-' .$i. '"></span>
            </td>
						<td class="text-md-right text-sm-left" id="diamond-level-' .$i. '" data-th="Factory level"></td>
						<td class="text-md-right text-sm-left" data-th="Product & required Warehouse level">
              <span id="diamond-product-' .$i. '"></span>
              <span class="resources-product-' .$i. '"></span>
              ' .$arrow. '
              <kbd>
                <span class="nav-icon-warehouses"></span> <span id="diamond-product-warehouse-' .$i. '"></span>
              </kbd>
            </td>
						<td id="diamond-dependencies-' .$i. '" data-th="Dependencies & required Warehouse level"></td>
						<td class="text-md-right text-sm-left" id="diamond-efficiency-' .$i. '" data-th="Efficiency"></td>
						<td class="text-md-right text-sm-left" id="diamond-profit-' .$i. '" data-th="Profit"></td>
					</tr>';
        }

        ?>
				</tbody>
				<tfoot>
          <tr>
						<td colspan="6" class="text-md-right text-sm-left">
            Top 10 profit: <span id="diamond-top-10"></span><br />
						Total profit: <span id="diamond-total"></span></td>
          </tr>
				</tfoot>
			</table>
		</div>
	</div>
</div>
