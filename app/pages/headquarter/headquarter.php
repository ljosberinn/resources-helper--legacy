<?php

$columns = [
  "Paid / required" => $textOrientation,
  "Missing"         => $textOrientation,
  "Cost"            => $textOrientation,
  "Transportation"  => $textOrientation. " small text-danger",
];

$textOrientation = "text-md-right text-sm-left";

$arrayKeys = array_keys($columns);

?>

<div class="row">
  <div class="col-xs-12 col-md-12">
    <div id="hq-sprite" class="justify-content-center">
    <?php

    for ($i = 0; $i <= 9; $i += 1) {
        echo '
        <img class="hq-thumb-' .$i. '" alt="HQ ' .($i + 1). '" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEsAAABLAQMAAAACgOipAAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABBJREFUeNpjYBgFo2AUkAwAAzkAAbSm0MAAAAAASUVORK5CYII=">';
    }

    ?>
    </div>
    <div id="hq-content" class="mt-3">
      <table class="table table-responsive table-break-medium table-striped mb-3">
        <thead>
          <tr class="small">

            <?php

            $i = 0;

            foreach ($columns as $column => $classes) {
                echo '
                <th id="hq-personal-th-' .$i. '" class="' .$classes. '">' .$column. '</th>';
                $i += 1;
            }

            ?>
          </tr>
        </thead>
        <tbody>

            <?php

            for ($i = 0; $i <= 3; $i += 1) {
                echo '
                <tr>
                  <td data-th="' .$arrayKeys[0]. '">
                    <div class="input-group">
                      <span class="input-group-addon" id="hq-content-icon-' .$i. '"></span>
                      <input type="number" min="0" max="50000000" class="form-control form-control-sm ' .$textOrientation. '" placeholder="paid" id="hq-content-input-' .$i. '" />
                      <span class="input-group-addon">/<span id="hq-content-requirement-' .$i. '"></span></span>
                    </div>
                  </td>
                  <td data-th="' .$arrayKeys[1]. '" class="' .$textOrientation. '" id="hq-content-missing-' .$i. '"></td>
                  <td data-th="' .$arrayKeys[2]. '" class="' .$textOrientation. '" id="hq-content-cost-' .$i. '"></td>
                  <td data-th="' .$arrayKeys[3]. '" class="' .$textOrientation. ' small text-danger" id="hq-content-transportation-' .$i. '"></td>
                </tr>';
            }

            ?>
        </tbody>
        <tfoot>
          <tr>
            <td data-th="HQ total cost" class="<?php echo $textOrientation; ?>" colspan="3" id="hq-content-cost-sum"></td>
            <td data-th="HQ total transportation" class="<?php echo $textOrientation; ?> small text-danger" id="hq-content-transportation-sum"></td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div id="graph-headquarter"></div>
  </div>

</div>
