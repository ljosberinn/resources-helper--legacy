<!-- #module-tradelog -->

<?php

$textOrientation = "text-md-right text-sm-left";

$columns = [
    "Trade partner" => "",
    "Timestamp"     => $textOrientation,
    "Amount"        => $textOrientation,
    "Price"         => $textOrientation,
    "Sum"           => $textOrientation,
];

?>

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-tradelog">

    <h6><span><?php echo file_get_contents("assets/img/icons/piechart.svg"); ?></span> Trade Log</h6>
    <hr class="mb-3">

    <div class="row">
        <div class="col-sm-12 col-lg-6" id="graph-tradelog-buying"></div>

        <div class="col-sm-12 col-lg-6" id="graph-tradelog-selling"></div>

        <div class="col-12" id="graph-tradelog-habits"></div>
    </div>

    <div class="row">
        <div class="col-xs-12 col-md-12">

            <table class="table table-responsive table-break-medium mb-3">
                <tbody>
                    <tr>
                        <td class="sorttable_nosort">
                        <button class="btn btn-success" id="tradelog-previous">previous day</button>
                        </td>
                        <td class="text-center">
                            <select class="custom-select" id="tradelog-filter-day">
                                <option selected disabled>jump to day X</option>
                            </select>
                            <select class="custom-select" id="tradelog-filter-event">
                                <option selected disabled>filter event type</option>
                                <option value="-1">show all</option>
                                <option value="0">show only BUY events</option>
                                <option value="1">show only SELL events</option>
                            </select>
                        </td>
                        <td class="sorttable_nosort <?php echo $textOrientation; ?>">
                        <button class="btn btn-success" id="tradelog-next" disabled>next day</button>
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
                <tbody id="tradelog-tbody">

                </tbody>
                <tfoot id="tradelog-tfoot">

                </tfoot>
            </table>
        </div>
    </div>

</div>
