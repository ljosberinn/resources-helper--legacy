<!-- #module-buildings -->

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-buildings">

	<h6><span class="nav-icon-buildings"></span> Special Buildings</h6>
	<hr class="mb-3">

  <div class="row justify-content-center">

  <?php

  for($i = 0; $i <= 11; $i += 1) {
    echo '
    <div class="col-sm-12 col-md-8 col-xl-4 rounded m-2 p-2" id="building-' .$i. '">
      <table class="table table-responsive table-break-medium table-striped mb-3">
        <thead>
          <tr>
            <th><span class="resources-building-' .$i. '"></span></th>
            <th colspan="2">
              <span id="buildings-name-' .$i. '"></span>
            </th>
            <th class="text-right">
              <select class="custom-select" id="buildings-level-' .$i. '">';
                for($k = 0; $k <= 10; $k += 1) {
                  echo '
                  <option value="' .$k. '">Level ' .$k. '</option>';
                }
                echo '</select>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-th="Requirement">
              <img src="assets/img/cash.png" alt="Cash" />
            </td>
            <td data-th="Required amount" class="text-md-right text-sm-left" colspan="2" id="buildings-cash-' .$i. '"></td>
            <td class="text-md-right text-sm-left">
              <small class="text-danger">Transportation</small>
            </td>
          </tr>
          <tr>
            <td data-th="Requirement">
              <span id="buildings-mat-1-' .$i. '"></span>
            </td>
            <td data-th="Required amount" class="text-md-right text-sm-left" id="buildings-amount-1-' .$i. '"></td>
            <td data-th="Cost" class="text-md-right text-sm-left" id="buildings-worth-1-' .$i. '"></td>
            <td data-th="Transportation" class="text-md-right text-sm-left text-small">
              <small class="text-danger" id="buildings-transportation-1-' .$i. '"></small>
            </td>
          </tr>
          <tr>
            <td data-th="Requirement">
              <span id="buildings-mat-2-' .$i. '"></span>
            </td>
            <td data-th="Required amount" class="text-md-right text-sm-left" id="buildings-amount-2-' .$i. '"></td>
            <td data-th="Cost" class="text-md-right text-sm-left" id="buildings-worth-2-' .$i. '"></td>
            <td data-th="Transportation" class="text-md-right text-sm-left text-small">
              <small class="text-danger" id="buildings-transportation-2-' .$i. '"></small>
            </td>
          </tr>
          <tr>
            <td data-th="Requirement">
              <span id="buildings-mat-3-' .$i. '"></span>
            </td>
            <td data-th="Required amount" class="text-md-right text-sm-left" id="buildings-amount-3-' .$i. '"></td>
            <td data-th="Cost" class="text-md-right text-sm-left" id="buildings-worth-3-' .$i. '"></td>
            <td data-th="Transportation" class="text-md-right text-sm-left text-small">
              <small class="text-danger" id="buildings-transportation-3-' .$i. '"></small>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td data-th="Total cost" class="text-md-right text-sm-left" colspan="3" id="buildings-sum-' . $i. '"></td>
            <td data-th="Total transportation" class="text-md-right text-sm-left text-small">
              <small class="text-danger" id="buildings-transportation-sum-' . $i. '"></small>
            </td>
          </tr>
          <tr>
            <td data-th="Remaining cost" colspan="2" class="text-md-right text-sm-left">
              <small>to level 10:</small>
            </td>
            <td class="text-md-right text-sm-left">
              <small id="buildings-cap-' .$i. '"></small>
            </td>
            <td data-th="Remaining transportation to 10" class="text-md-right text-sm-left">
              <small class="text-danger" id="buildings-transportation-cap-' .$i. '"></small>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>';
  }

  ?>

  </div>
</div>
