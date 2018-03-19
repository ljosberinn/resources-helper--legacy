<!-- #module-warehouses -->

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-warehouses">

	<h6><span class="nav-icon-warehouses"></span> Warehouses</h6>
	<hr class="mb-3">

	<div class="row">
		<div class="col-xs-12 col-md-12">

			<table class="table table-responsive table-break-medium table-striped mb-3">
				<thead>
					<tr class="text-small">
						<th class="text-md-right text-sm-left" colspan="3">Stock</th>
            <th class="text-md-right text-sm-left">Min. time until full</th>
            <th class="text-md-right text-sm-left">Worth</th>
            <th class="text-md-right text-sm-left">Warehouse level</th>
            <th class="text-md-right text-sm-left" colspan="2">Upgrade calculator</th>
            <th class="text-md-right text-sm-left">Upgrade cost</th>
            <th class="text-md-right text-sm-left">Upgrade amortisation</th>
					</tr>
				</thead>
				<tbody>

				<?php

        $trBreak = '
        <tr><td class="table-hr" colspan="10"></td></tr>';

        for ($i = 0; $i < 58; $i += 1) {

          if($i >= 0 && $i <= 13) {
            $imgClass = "material";
            $idClass = $imgClass;
            $img = $i + 1;
            $k = $img - 1;
          } else if($i >= 14 && $i <= 35) {
            $imgClass = "product";
            $idClass = "products";
            $img = $i - 14 + 1;
            $k = $img - 1;
          } else if($i > 35 && $i < 52) {
            $imgClass = "loot";
            $idClass = $imgClass;
            $img = $i - 36 + 1;
            $k = $img - 1;
          } else {
            $imgClass = "unit";
            $idClass = "units";
            $img = $i - 52 + 1;
            $k = $img - 1;
          }

          if($i == 14 || $i == 36 || $i == 52) {
            echo $trBreak;
          }

          echo '
					<tr>
            <td data-th="Type">
             <span class="resources-' .$imgClass. '-' .$img. '"></span>
            </td>
            <td data-th="Stock">
              <input class="form-control form-control-sm text-md-right text-sm-left" type="number" min="0" id="warehouse-' .$idClass. '-stock-current-' .$k. '" />
            </td>

            <td data-th="Fill status">
             / <span id="warehouse-' .$idClass. '-stock-cap-' .$k. '"></span> (<span id="warehouse-' .$idClass. '-fill-percent-' .$k. '"></span> %)
            </td>

            <td data-th="Min. time until full" class="text-md-right text-sm-left" id="warehouse-' .$idClass. '-remaining-' .$k. '"></td>

            <td  data-th="Worth" class="text-md-right text-sm-left" id="warehouse-' .$idClass. '-worth-' .$k. '"></td>

            <td data-th="Warehouse level">
             <input class="form-control form-control-sm text-md-right text-sm-left" type="number" min="0" max="10000" id="warehouse-' .$idClass. '-level-' .$k. '" />
            </td>

            <td  data-th="Upgrade selection" class="text-md-right text-sm-left">
              <select class="custom-select" id="warehouse-' .$idClass. '-calc-1-' .$k. '">
                <option value="level">level</option>
                <option value="contingent">contingent</option>
              </select>
            </td>

            <td data-th="Upgrade target">
              <input class="form-control form-control-sm text-md-right text-sm-left" type="number" min="0" id="warehouse-' .$idClass. '-calc-2-' .$k. '" />
            </td>

            <td data-th="Upgrade cost" class="text-md-right text-sm-left" id="warehouse-' .$idClass. '-upgrade-cost-' .$k. '">0</td>

            <td data-th="Upgrade amortisation" class="text-md-right text-sm-left" id="warehouse-' .$idClass. '-upgrade-amortisation-' .$k. '"></td>
					</tr>';
        }

        ?>
				</tbody>
				<tfoot>
          <tr>
            <td colspan="5" class="text-md-right text-sm-left" id="warehouse-total-worth"></td>
            <td class="text-md-right text-sm-left" id="warehouse-total-level"></td>
            <td colspan="4"></td>
          </tr>
				</tfoot>
			</table>
		</div>
	</div>

</div>
