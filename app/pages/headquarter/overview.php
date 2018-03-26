<div class="row">
	<div class="col-xs-12 col-md-12">

		<table class="table table-responsive table-break-medium table-striped mb-3">
			<thead>
				<tr class="text-small">
					<th class="text-md-right text-sm-left">Level</th>
					<th class="text-md-right text-sm-left">Required material & amount</th>
					<th class="text-md-right text-sm-left">Total cost</th>
					<th class="text-md-right text-sm-left">Transportation</th>
					<th class="text-md-right text-sm-left">Radius</th>
					<th class="text-md-right text-sm-left">Boost</th>
				</tr>
			</thead>
			<tbody>

				<?php

				$textOrientation = "text-md-right text-sm-left";

        for($i = 0; $i <= 9; $i += 1) {

          echo '
          <tr>
            <td class="' .$textOrientation. '">' .($i + 1). '</td>
						<td class="' .$textOrientation. '" id="hq-ovw-mat-' .$i. '"></td>
						<td class="' .$textOrientation. '" id="hq-ovw-sum-' .$i. '"></td>
						<td class="' .$textOrientation. ' text-danger" id="hq-ovw-transportation-' .$i. '"></td>
						<td class="' .$textOrientation. '" id="hq-ovw-radius-' .$i. '"></td>
						<td class="' .$textOrientation. '" id="hq-ovw-boost-' .$i. '"></td>
          </tr>
					';

        }

				?>

			</tbody>
			<tfoot>
			</tfoot>
		</table>
	</div>
</div>
