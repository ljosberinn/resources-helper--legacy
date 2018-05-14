<?php

$columns = [
  "Level"                      => $textOrientation,
  "Required resource & amount" => $textOrientation,
  "Total cost"                 => $textOrientation,
  "Transportation"             => $textOrientation,
  "Radius"                     => $textOrientation,
  "Boost"                      => $textOrientation,
];

$textOrientation = "text-md-right text-sm-left";
$arrayKeys = array_keys($columns);

?>


<div class="row">
  <div class="col-xs-12 col-md-12">

  <table class="table table-responsive table-break-medium table-striped mb-3">
    <thead>
      <tr class="small">

        <?php

        $i = 0;

        foreach ($columns as $column => $classes) {
            echo '
            <th id="hq-general-th-' .$i. '" class="' .$classes. '">' .$column. '</th>';
            $i += 1;
        }

        ?>
        </tr>
    </thead>
    <tbody>

        <?php

        for ($i = 0; $i <= 9; $i += 1) {

            echo '
            <tr>
              <td data-th="' .$arrayKeys[0]. '" class="' .$textOrientation. '">' .($i + 1). '</td>
              <td data-th="' .$arrayKeys[1]. '" class="' .$textOrientation. '" id="hq-ovw-mat-' .$i. '"></td>
              <td data-th="' .$arrayKeys[2]. '" class="' .$textOrientation. '" id="hq-ovw-sum-' .$i. '"></td>
              <td data-th="' .$arrayKeys[3]. '" class="' .$textOrientation. ' text-danger small" id="hq-ovw-transportation-' .$i. '"></td>
              <td data-th="' .$arrayKeys[4]. '" class="' .$textOrientation. '" id="hq-ovw-radius-' .$i. '"></td>
              <td data-th="' .$arrayKeys[5]. '" class="' .$textOrientation. '" id="hq-ovw-boost-' .$i. '"></td>
            </tr>
            ';
        }

        ?>

    </tbody>
  </table>
  </div>
</div>
