<!-- #module-warehouses -->

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-warehouses">

	<h6><span class="nav-icon-warehouses"></span> Warehouses</h6>
	<hr class="mb-3">

	<div class="row">
		<div class="col-xs-12 col-md-12">

			<table class="table table-responsive table-break-medium table-striped mb-3">
				<thead>
					<tr class="small">
						<th class="text-md-right text-sm-left">Type & Stock</th>
            <th class="text-md-right text-sm-left">Min. time until full</th>
            <th class="text-md-right text-sm-left">Worth</th>
            <th class="text-md-right text-sm-left">Warehouse level</th>
            <th class="text-md-right text-sm-left" colspan="2">Upgrade calculator</th>
            <th class="text-md-right text-sm-left">Upgrade cost</th>
					</tr>
				</thead>
				<tbody>

				<?php

        $trBreak = '
        <tr><td class="table-hr" colspan="7"></td></tr>';

        for ($i = 0; $i < 58; $i += 1) {

          if($i >= 0 && $i <= 13) {
            $imgClass = "material";
            $idClass = $imgClass;
            $k = $i ;
          } else if($i >= 14 && $i <= 35) {
            $imgClass = "product";
            $idClass = "products";
            $k = $i - 14;
          } else if($i > 35 && $i < 52) {
            $imgClass = "loot";
            $idClass = $imgClass;
            $k = $i - 36;
          } else {
            $imgClass = "unit";
            $idClass = "units";
            $k = $i - 52;
          }

          if($i == 14 || $i == 36 || $i == 52) {
            echo $trBreak;
          }

          echo '
					<tr>
            <td data-th="Type & Stock">
              <div class="input-group">
                <span class="input-group-addon"><span class="resources-' .$imgClass. '-' .$k. '"></span></span>
                <input class="form-control form-control-sm text-md-right text-sm-left" type="number" min="0" id="warehouse-' .$idClass. '-stock-current-' .$k. '" />
                <span class="input-group-addon"><span>/ <span id="warehouse-' .$idClass. '-stock-cap-' .$k. '"></span> (<span id="warehouse-' .$idClass. '-fill-percent-' .$k. '"></span>%)</span></span>
              </div>
            </td>

            <td data-th="Min. time until full" class="text-md-right text-sm-left" id="warehouse-' .$idClass. '-remaining-' .$k. '"></td>

            <td data-th="Worth" class="text-md-right text-sm-left" id="warehouse-' .$idClass. '-worth-' .$k. '"></td>

            <td data-th="Warehouse level">
             <input class="form-control form-control-sm text-md-right text-sm-left" type="number" min="0" max="10000" id="warehouse-' .$idClass. '-level-' .$k. '" />
            </td>

            <td data-th="Upgrade selection" class="text-md-right text-sm-left">
              <select class="custom-select" id="warehouse-' .$idClass. '-calc-1-' .$k. '">
                <option value="level">level</option>
                <option value="contingent">contingent</option>
              </select>
            </td>

            <td data-th="Upgrade target">
              <input class="form-control form-control-sm text-md-right text-sm-left" type="number" min="0" id="warehouse-' .$idClass. '-calc-2-' .$k. '" />
            </td>

            <td data-th="Upgrade cost" class="text-md-right text-sm-left" id="warehouse-' .$idClass. '-upgrade-cost-' .$k. '">0</td>
					</tr>';
        }

        ?>
				</tbody>
				<tfoot>
          <tr>
            <td colspan="3" class="text-md-right text-sm-left" id="warehouse-total-worth"></td>
            <td class="text-md-right text-sm-left" id="warehouse-total-level"></td>
            <td colspan="3"></td>
          </tr>
				</tfoot>
			</table>
		</div>
	</div>

</div>
