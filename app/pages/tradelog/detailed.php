<div class="row">
  <div class="col-xs-12 col-md-12">

  <table class="table table-responsive table-break-medium mb-3">
      <tbody>
        <tr>
          <td class="text-center">
            <select class="custom-select" id="tradelog-filter-event">
              <option selected disabled>filter event type</option>
              <option value="-1">show all</option>
              <option value="0">show only BUY events</option>
              <option value="1">show only SELL events</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>

    <table class="table table-responsive table-break-medium table-striped mb-3">
      <thead>
        <tr class="small">

          <?php
          foreach ($columns as $column => $classes) {

            if (empty($classes)) {
              $class = $classes;
            } else {
              $class = 'class="' .$classes. '"';
            }

            echo '
            <th ' .$class. '>' .$column. '</th>';
          }
          ?>
        </tr>
      </thead>
      <tbody id="tradelog-detailed-tbody"></tbody>
      <tfoot id="tradelog-detailed-tfoot"></tfoot>
    </table>
  </div>
</div>