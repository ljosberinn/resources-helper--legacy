<!-- #module-diamond -->

<?php

$textOrientation = "text-md-right text-sm-left";

$columns = [
    "Factory"                                 => $textOrientation. " sorttable_nosort",
    "Factory level"                           => $textOrientation. " sorttable_nosort",
    "Product & required Warehouse level"      => $textOrientation. " sorttable_nosort",
    "Dependencies & required Warehouse level" => "sorttable_nosort",
    "Efficiency"                              => $textOrientation,
    "Profit"                                  => $textOrientation,
];

$arrayKeys = array_keys($columns);

?>

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-diamond">

    <h6><span class="nav-icon-factories"></span> Factories</h6>
    <hr class="mb-3">

    <div class="row">
        <div class="col-xs-12 col-md-12">

        <table class="table table-responsive table-break-medium table-striped mb-3">
            <thead>
                <tr class="small">

                <?php

                foreach ($columns as $column => $classes) {
                    echo '
                    <th class="' .$classes. '">' .$column. '</th>';
                }

                ?>
                </tr>
            </thead>
            <tbody>

            <?php

            for ($i = 0; $i <= 21; $i += 1) {
                echo '
                <tr>
                    <td data-th="' .$arrayKeys[0]. '">
                    <span class="resources-factories-' .$i. '"></span>
                    </td>
                    <td class="' .$textOrientation. '" id="diamond-level-' .$i. '" data-th="' .$arrayKeys[1]. '"></td>
                    <td class="' .$textOrientation. '" data-th="' .$arrayKeys[2]. '">
                        <span id="diamond-product-' .$i. '"></span>
                        <span class="resources-product-' .$i. '"></span>
                        ' .$arrow. '
                        <kbd>
                            <span class="nav-icon-warehouses"></span> <span id="diamond-product-warehouse-' .$i. '"></span>
                        </kbd>
                    </td>
                    <td id="diamond-dependencies-' .$i. '" data-th="' .$arrayKeys[3]. '"></td>
                    <td class="' .$textOrientation. '" id="diamond-efficiency-' .$i. '" data-th="' .$arrayKeys[4]. '"></td>
                    <td class="' .$textOrientation. '" id="diamond-profit-' .$i. '" data-th="' .$arrayKeys[5]. '"></td>
                </tr>';
            }

            ?>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="6" class="text-md-right text-sm-left">
                    Top 10 profit: <span id="diamond-top-10"></span><br />
                    Total profit: <span id="diamond-total"></span></td>
                </tr>
            </tfoot>
        </table>
        </div>
    </div>
</div>
