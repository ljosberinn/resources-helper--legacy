<?php

$textOrientation = 'text-md-right text-sm-left';

$columns = [
    'Trade partner' => '',
    'Timestamp'     => $textOrientation,
    'Amount'        => $textOrientation,
    'Price'         => $textOrientation,
    'Sum'           => $textOrientation,
];

?>

<div class="row">
    <div class="col-xs-12 col-md-12">

        <table class="table table-responsive table-break-medium mb-3">
            <tbody>
            <tr>
                <td class="text-center">
                    <select class="custom-select" id="tradelog-filter-event">
                        <option selected disabled id="tradelog-detail-filter-0">filter event type</option>
                        <option value="-1" id="tradelog-detail-filter-1">show all</option>
                        <option value="0" id="tradelog-detail-filter-2">show only BUY events</option>
                        <option value="1" id="tradelog-detail-filter-3">show only SELL events</option>
                    </select>
                </td>
            </tr>
            </tbody>
        </table>

        <table class="table table-responsive table-break-medium table-striped mb-3">
            <thead>
            <tr class="small">

                <?php

                $i = 0;

                foreach($columns as $column => $classes) {

                    $class = empty($classes) ? $classes : 'class="' . $classes . '"';

                    ?>
                    <th id="tradelog-detail-th-<?= $i ?>" <?= $class ?>><?= $column ?></th>
                    <?php

                    ++$i;
                }
                ?>

            </tr>
            </thead>
            <tbody id="tradelog-detailed-tbody"></tbody>
            <tfoot id="tradelog-detailed-tfoot"></tfoot>
        </table>
    </div>
</div>
