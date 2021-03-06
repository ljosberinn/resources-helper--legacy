<!-- #module-factories -->

<?php

$columns = [
    'Factory'                       => 'sorttable_nosort',
    'Factory Level'                 => 'sorttable_nosort',
    'Product'                       => 'sorttable_nosort',
    'Dependencies'                  => 'sorttable_nosort',
    'Workload'                      => 'sorttable_numeric',
    'Turnover'                      => '',
    'Turnover Increase per Upgrade' => '',
    'Upgrade Cost'                  => '',
    'Return on Investment'          => '',
];

$textOrientation = 'text-md-right text-sm-left';

$arrayKeys = array_keys($columns);

?>

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-factories">

    <h6><span class="nav-icon-factories"></span> <span id="factories-header">Factories</span></h6>
    <hr class="mb-3">

    <div class="row">
        <div class="col-xs-12 col-md-12">

            <table class="table table-responsive table-break-medium table-striped mb-3">
                <thead>
                <tr class="small">

                    <?php

                    $i = 0;

                    foreach($columns as $column => $specialClasses) { ?>
                        <th id="factories-th-<?= $i ?>" class="<?= $textOrientation ?> <?= $specialClasses ?>">
                            <?= $column ?>
                        </th>
                        <?php

                        ++$i;
                    }

                    ?>

                </tr>
                </thead>
                <tbody>

                <?php for($i = 0; $i <= 21; ++$i) { ?>
                    <tr>
                        <td data-th="<?= $arrayKeys[0] ?>" class="<?= $textOrientation ?>">
                            <span class="resources-factories-<?= $i ?>"></span>
                        </td>
                        <td data-th="<?= $arrayKeys[1] ?>">
                            <input type="number" min="0" max="2000" class="form-control form-control-sm <?= $textOrientation ?>" id="factories-level-<?= $i ?>"/>
                        </td>
                        <td class="<?= $textOrientation ?>" data-th="<?= $arrayKeys[2] ?>">
                            <span id="factories-product-<?= $i ?>"></span> <span class="resources-product-<?= $i ?>"></span>
                        </td>
                        <td class="<?= $textOrientation ?>" id="factories-dependencies-<?= $i ?>" data-th="<?= $arrayKeys[3] ?>"></td>
                        <td class="<?= $textOrientation ?>" id="factories-workload-<?= $i ?>" data-th="<?= $arrayKeys[4] ?>"></td>
                        <td class="<?= $textOrientation ?>" id="factories-turnover-<?= $i ?>" data-th="<?= $arrayKeys[5] ?>"></td>
                        <td class="<?= $textOrientation ?>" id="factories-increase-per-upgrade-<?= $i ?>" data-th="<?= $arrayKeys[6] ?>"></td>
                        <td class="<?= $textOrientation ?>" id="factories-upgrade-cost-<?= $i ?>" data-th="<?= $arrayKeys[7] ?>"></td>
                        <td class="<?= $textOrientation ?>" id="factories-roi-<?= $i ?>" data-th="<?= $arrayKeys[8] ?>"></td>
                    </tr>
                <?php } ?>
                </tbody>
                <tfoot>
                <tr>
                    <td></td>
                    <td class="<?= $textOrientation ?> text-muted" data-th="Total factory upgrades"><strong id="factories-total-upgrades"></strong></td>
                    <td colspan="7"></td>
                </tr>
                </tfoot>
            </table>
        </div>
    </div>

    <div class="col-md-12" id="graph-factories-amortisation"></div>
</div>
