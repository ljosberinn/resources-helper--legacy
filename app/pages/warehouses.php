<!-- #module-warehouses -->

<?php

$textOrientation = "text-md-right text-sm-left";

$columns = [
    "Type & Stock"         => "",
    "Min. time until full" => "",
    "Worth"                => "",
    "Warehouse level"      => "",
    "Upgrade calculator"   => "",
    "Upgrade target"       => "",
    "Upgrade cost"         => "",
];

$arrayKeys = array_keys ($columns);

?>

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-warehouses">

    <h6><span class="nav-icon-warehouses"></span> <span id="warehouse-header">Warehouses</h6>
    <hr class="mb-3">

    <div class="row">
        <div class="col-xs-12 col-md-12">

            <table class="table table-responsive table-break-medium table-striped mb-3">
                <thead>
                <tr class="small">

                    <?php

                    $i = 0;

                    foreach ($columns as $column => $specialClasses) { ?>
                        <th id="warehouse-th-<?= $i ?>" class=" <?= $textOrientation ?><?= $specialClasses ?>"><?= $column ?></th>
                        <?php

                        $i += 1;
                    }

                    ?>
                </tr>
                </thead>
                <tbody>

                <?php

                $trBreak = '
        <tr><td class="table-hr" colspan="7"></td></tr>';

                for ($i = 0; $i < 58; $i += 1) {

                    if ($i >= 0 && $i <= 13) {
                        $imgClass = "material";
                        $idClass  = $imgClass;
                        $k        = $i;
                    } elseif ($i >= 14 && $i <= 35) {
                        $imgClass = "product";
                        $idClass  = "products";
                        $k        = $i - 14;
                    } elseif ($i > 35 && $i < 52) {
                        $imgClass = "loot";
                        $idClass  = $imgClass;
                        $k        = $i - 36;
                    } else {
                        $imgClass = "unit";
                        $idClass  = "units";
                        $k        = $i - 52;
                    }

                    if ($i === 14 || $i === 36 || $i === 52) {
                        echo $trBreak;
                    }

                    ?>
                    <tr>
                        <td data-th="<?= $arrayKeys[0] ?>">
                            <div class="input-group">
                                <span class="input-group-addon"><span class="resources-<?= $imgClass ?>-<?= $k ?>"></span></span>
                                <input class="form-control form-control-sm <?= $textOrientation ?>" type="number" min="0" id="warehouse-<?= $idClass ?>-stock-current-<?= $k ?>"/>
                                <span class="input-group-addon"><span>/ <span id="warehouse-<?= $idClass ?>-stock-cap-<?= $k ?>"></span> (<span id="warehouse-<?= $idClass ?>-fill-percent-<?= $k ?>"></span>%)</span></span>
                            </div>
                        </td>

                        <td data-th="<?= $arrayKeys[1] ?>" class="<?= $textOrientation ?>" id="warehouse-<?= $idClass ?>-remaining-<?= $k ?>"></td>
                        <td data-th="<?= $arrayKeys[2] ?>" class="<?= $textOrientation ?>" id="warehouse-<?= $idClass ?>-worth-<?= $k ?>"></td>
                        <td data-th="<?= $arrayKeys[3] ?>">
                            <input class="form-control form-control-sm <?= $textOrientation ?>" type="number" min="0" max="10000" id="warehouse-<?= $idClass ?>-level-<?= $k ?>"/>
                        </td>
                        <td data-th="<?= $arrayKeys[4] ?>" class="<?= $textOrientation ?>">
                            <select class="custom-select" id="warehouse-<?= $idClass ?>-calc-1-<?= $k ?>">
                                <option value="level">level</option>
                                <option value="contingent">contingent</option>
                            </select>
                        </td>

                        <td data-th="<?= $arrayKeys[5] ?>">
                            <input class="form-control form-control-sm <?= $textOrientation ?>" type="number" min="0" id="warehouse-<?= $idClass ?>-calc-2-<?= $k ?>"/>
                        </td>

                        <td data-th="<?= $arrayKeys[6] ?>" class="<?= $textOrientation ?>" id="warehouse-<?= $idClass ?>-upgrade-cost-<?= $k ?>">0</td>
                    </tr>
                <?php } ?>
                </tbody>
                <tfoot>
                <tr>
                    <td colspan="3" class="<?= $textOrientation ?>" id="warehouse-total-worth"></td>
                    <td class="<?= $textOrientation ?>" id="warehouse-total-level"></td>
                    <td colspan="3"></td>
                </tr>
                </tfoot>
            </table>
        </div>
    </div>
</div>
