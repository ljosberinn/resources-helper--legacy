<!-- #module-recyclingunits -->

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-recyclingunits">

	<h6><span><?php echo file_get_contents("assets/img/icons/table.svg"); ?></span> Recycling & Units</h6>
	<hr class="mb-3">

	<p class="lead">Recycling</p>

	<table class="table table-responsive table-break-medium table-striped mb-3" id="recycling-tbl">
		<thead>
			<tr class="text-small">
				<th class="sorttable_nosort"></th>
				<th class="text-md-right text-sm-left">requried/cycle</th>
				<th class="text-md-right text-sm-left sorttable_nosort">Products</th>
				<th class="text-md-right text-sm-left">Input worth</th>
				<th class="text-md-right text-sm-left">Output worth</th>
				<th class="text-md-right text-sm-left">Profit</th>
			</tr>
		</thead>
		<tbody>

			<?php

			for($i = 0; $i <= 15; $i += 1) {

				// skip tech upgrades and giant diamonds
				if( $i == 4 || $i >= 10 && $i <= 13) {
					continue;
				}

				echo '
				<tr>
					<td data-th="Loot">
						<span class="resources-loot-' .$i. '"></span>
					</td>
					<td class="text-md-right text-sm-left" data-th="required/cycle" id="recycling-requirement-' .$i. '"></td>
					<td class="text-md-right text-sm-left" data-th="Products" id="recycling-products-' .$i. '"></td>
					<td class="text-md-right text-sm-left" data-th="Input worth" id="recycling-input-' .$i. '"></td>
					<td class="text-md-right text-sm-left" data-th="Output worth" id="recycling-output-' .$i. '"></td>
					<td class="text-md-right text-sm-left" data-th="Profit" id="recycling-profit-' .$i. '"></td>
				</tr>
				';
			}

			?>

    </tbody>
  </table>

	<p class="lead">Units</p>

	<table class="table table-responsive table-break-medium table-striped mb-3" id="units-tbl">
		<thead>
			<tr class="text-small">
				<th class="sorttable_nosort"></th>
				<th class="text-md-right text-sm-left">Crafting price</th>
				<th class="text-md-right text-sm-left">Market price</th>
				<th class="text-md-right text-sm-left">Price per strength</th>
				<th class="text-md-right text-sm-left">Profit</th>
			</tr>
		</thead>
		<tbody>

			<?php

			$order = [
				0, 2, 3, 5, 4, 1
			];

			foreach($order as $i) {

				echo '
				<tr>
					<td data-th="Unit">
						<span class="resources-unit-' .$i. '"></span>
					</td>
					<td class="text-md-right text-sm-left" data-th="Crafting price" id="units-crafting-' .$i. '"></td>
					<td class="text-md-right text-sm-left" data-th="Market price" id="units-market-' .$i. '"></td>
					<td class="text-md-right text-sm-left" data-th="Price per strength" id="units-pps-' .$i. '"></td>
					<td class="text-md-right text-sm-left" data-th="Profit" id="units-profit-' .$i. '"></td>
				</tr>
				';
			}

			?>

		</tbody>
	</table>

</div>
