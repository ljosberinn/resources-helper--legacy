<div class="row">
	<div class="col-xs-12 col-md-12">
    <div id="hq-sprite" class="justify-content-center">
      <?php

      for($i = 0; $i <= 9; $i += 1) {
        echo '
        <div class="hq-thumb-' .$i. '"></div>';
      }

      ?>
    </div>
    <div id="hq-content" class="mt-3">
      <table class="table table-responsive table-break-medium table-striped mb-3">
        <thead>
          <tr class="small">
            <th class="text-md-right text-sm-left">Paid / required</th>
            <th class="text-md-right text-sm-left">Missing</th>
            <th class="text-md-right text-sm-left">Cost</th>
            <th class="text-md-right text-sm-left small text-danger">Transportation</th>
          </tr>
        </thead>
        <tbody>

          <?php

          for($i = 0; $i <= 3; $i += 1) {
            echo '
            <tr>
              <td data-th="Paid / required">
                <div class="input-group">
                  <span class="input-group-addon" id="hq-content-icon-' .$i. '"></span>
                  <input type="number" min="0" max="50000000" class="form-control form-control-sm text-md-right text-sm-left" placeholder="paid" id="hq-content-input-' .$i. '" />
                  <span class="input-group-addon">/<span id="hq-content-requirement-' .$i. '"></span></span>
                </div>
              </td>
              <td data-th="Missing" class="text-md-right text-sm-left" id="hq-content-missing-' .$i. '"></td>
              <td data-th="Worth" class="text-md-right text-sm-left" id="hq-content-cost-' .$i. '"></td>
              <td data-th="Transportation" class="text-md-right text-sm-left small text-danger" id="hq-content-transportation-' .$i. '"></td>
            </tr>';
          }

          ?>

        </tbody>
        <tfoot>
          <tr>
            <td class="text-md-right text-sm-left" colspan="3" id="hq-content-cost-sum"></td>
            <td class="text-md-right text-sm-left small text-danger" id="hq-content-transportation-sum"></td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div id="graph-headquarter"></div>
	</div>

</div>
