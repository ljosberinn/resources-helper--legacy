<!-- #module-tradelog -->

<?php

$textOrientation = "text-md-right text-sm-left";

$columns = [
    "Trade partner" => "",
    "Timestamp"     => $textOrientation,
    "Action"        => "",
    "Good"          => "",
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
                <tbody>

                </tbody>
                <tfoot>

                </tfoot>
            </table>
        </div>
    </div>

</div>
