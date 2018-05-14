<!-- #module-mines -->

<?php

$columns = [
  "Mine type"                  => "sorttable_nosort",
  "Your rate per hour"         => "sorttable_nosort",
  "Your amount of mines"       => "sorttable_nosort",
  "Worth @ 100% condition"     => "",
  "Mine price"                 => "",
  "100% quality income"        => "",
  "Return on Investment: 100%" => "",
  "505%"                       => "",
  "505% + your HQ level"       => "",
];

$textOrientation = "text-md-right text-sm-left";

$arrayKeys = array_keys($columns);

?>

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-mines">

  <h6><span class="nav-icon-mines"></span> <span id="mines-header">Mines</span></h6>
  <hr class="mb-3">

  <div class="row">
    <div class="col-xs-12 col-md-12">

      <table class="table table-responsive table-break-medium table-striped mb-3">
        <thead>
          <tr class="small">
            <?php

            $i = 0;

            foreach ($columns as $row => $specialClasses) {
              echo '
              <th id="mines-th-' .$i. '" class="' .$textOrientation. ' ' .$specialClasses. '">
              ' .$row. '
              </th>';

              $i += 1;
            }

            ?>
          </tr>
        </thead>
        <tbody>

        <?php

        for ($i = 0; $i <= 13; $i += 1) {
          echo '
          <tr>
            <td class="' .$textOrientation. '" data-th="' .$arrayKeys[0]. '">
              <span class="resources-material-' .$i. '"></span>
            </td>
            <td data-th="' .$arrayKeys[1]. '">
              <input class="form-control form-control-sm ' .$textOrientation. '" id="material-rate-' .$i. '" type="number" min="0" max="999999999" placeholder="rate/h" />
            </td>
            <td data-th="' .$arrayKeys[2]. '">
              <input class="form-control form-control-sm ' .$textOrientation. '" id="material-amount-of-mines-' .$i. '" type="number" min="0" max="35000" placeholder="# mines" />
            </td>
            <td class="' .$textOrientation. '" id="material-worth-' .$i. '" data-th="' .$arrayKeys[3]. '"></td>
            <td class="' .$textOrientation. '" id="material-new-price-' .$i. '" data-th="' .$arrayKeys[4]. '"></td>
            <td class="' .$textOrientation. '" id="material-perfect-income-' .$i. '" data-th="1' .$arrayKeys[5]. '"></td>
            <td class="' .$textOrientation. '" id="material-roi-100-' .$i. '" data-th="' .$arrayKeys[6]. '"></td>
            <td class="' .$textOrientation. '" id="material-roi-500-' .$i. '" data-th="' .$arrayKeys[7]. '"></td>
            <td class="' .$textOrientation. '" id="material-roi-x-' .$i. '" data-th="' .$arrayKeys[8]. '"></td>
          </tr>';
        }

        ?>
        </tbody>
        <tfoot>
          <tr>
            <td class="text-muted <?php echo $textOrientation; ?>" data-th="Total amount of mines" colspan="3">
              <strong id="material-total-mine-count"></strong>
            </td>
            <td class="text-muted <?php echo $textOrientation; ?>" data-th="Total worth/h @ 100% condition">
              <strong id="material-total-worth"></strong>
            </td>
            <td colspan="2"></td>
            <td class="text-sm-left text-md-center text-muted" id="material-custom-tu-price" colspan="3" data-th="Combined custom TU price"></td>
          </tr>
        </tfoot>
      </table>
    </div>
    <div class="col-md-12" id="graph-material"></div>
    <div class="col-md-12" id="graph-buildinghabits"></div>
    <div class="col-md-12" id="graph-overtime"></div>
  </div>
</div>
