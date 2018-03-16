<!-- #module-flow -->

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-flow">

	<h6><span></span> Material Flow</h6>
	<hr class="mb-3">

	<h7><span></span> Material</h7>

	<table class="table table-responsive table-break-medium table-striped mb-3">
		<thead>
			<tr class="text-small">
				<th>Rate/hour</th>
				<th class="text-center" colspan="4">Distribution</th>
				<th class="text-md-right text-sm-left">Surplus/hour</th>
				<th class="text-md-right text-sm-left">Worth</th>
			</tr>
		</thead>
		<tbody>

		<?php

		for ($i = 0; $i <= 13; $i += 1) {
			echo '
			<tr>
				<td data-th="Rate/hour"><span class="resources-material-' .($i + 1). '"></span> <span id="flow-material-rate-' .$i. '"></span></td>
				<td id="flow-material-distribution-' .$i. '-0"></td>
				<td id="flow-material-distribution-' .$i. '-1"></td>
				<td id="flow-material-distribution-' .$i. '-2"></td>
				<td id="flow-material-distribution-' .$i. '-3"></td>
				<td data-th="Surplus/hour" id="flow-material-surplus-' .$i. '"></td>
				<td data-th="Worth" class="text-md-right text-sm-left" id="flow-material-worth-' .$i. '"></td>
			</tr>';
		}

		?>
		</tbody>
		<tfoot>
			<tr>
				<td class="text-md-right text-sm-left" colspan="7" id="flow-material-total"></td>
			</tr>
		</tfoot>
	</table>

	<h7><span></span> Products</h7>

	<table class="table table-responsive table-break-medium table-striped mb-3">
		<thead>
			<tr class="text-small">
				<th>Effective rate/hour</th>
				<th class="text-center" colspan="3">Distribution</th>
				<th class="text-md-right text-sm-left">Surplus/hour</th>
				<th class="text-md-right text-sm-left">Worth</th>
			</tr>
		</thead>
		<tbody>

		<?php

		for ($i = 0; $i <= 21; $i += 1) {
			echo '
			<tr>
				<td data-th="Effective rate/hour"><span class="resources-product-' .($i + 1). '"></span> <span id="flow-product-rate-' .$i. '"></span></td>
				<td id="flow-product-distribution-' .$i. '-0"></td>
				<td id="flow-product-distribution-' .$i. '-1"></td>
				<td id="flow-product-distribution-' .$i. '-2"></td>
				<td data-th="Surplus/hour" class="text-md-right text-sm-left" id="flow-product-surplus-' .$i. '"></td>
				<td data-th="Worth" class="text-md-right text-sm-left" id="flow-product-worth-' .$i. '"></td>
			</tr>';
		}

		?>
		</tbody>
		<tfoot>
			<tr>
				<td class="text-md-right text-sm-left" colspan="6" id="flow-products-total"></td>
			</tr>
		</tfoot>
	</table>
</div>
