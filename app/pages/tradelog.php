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
        <div class="col-xs-6 col-md-12">
            buying
        </div>

        <div class="col-xs-6 col-md-12">
            selling
        </div>
    </div>

    <div class="row">
        <div class="col-xs-12 col-md-12">

            <table class="table table-responsive table-break-medium mb-3">
                <tbody>
                    <tr>
                        <td class="sorttable_nosort">
                            <button class="btn btn-success" id="tradelog-previous" disabled>previous day</button>
                        </td>
                        <td class="text-center">
                            Personal trade log, going back 24 hours from last known entry
                        </td>
                        <td class="sorttable_nosort <?php echo $textOrientation; ?>">
                            <button class="btn btn-success" id="tradelog-next">next day</button>
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
