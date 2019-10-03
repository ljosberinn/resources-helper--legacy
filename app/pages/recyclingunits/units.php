<?php

$columns = [
    'Unit'               => $textOrientation . ' sorttable_nosort',
    'Crafting price'     => $textOrientation,
    'Market price'       => $textOrientation,
    'Price per strength' => $textOrientation,
    'Profit'             => $textOrientation,
];

$arrayKeys = array_keys($columns);

$textOrientation = 'text-md-right text-sm-left';

?>

<p class="lead">Units</p>

<table class="table table-responsive table-break-medium table-striped mb-3" id="units-tbl">
    <thead>
    <tr class="small">

        <?php

        $i = 0;

        foreach($columns as $column => $classes) {
            ?>

            <th id="units-th-<?= $i ?>" class="<?= $classes ?>"><?= $column ?></th>
            <?php

            ++$i;
        }

        ?>

    </tr>
    </thead>
    <tbody>

    <?php

    foreach([
                0,
                2,
                3,
                5,
                4,
                1,
            ] as $i) { ?>
        <tr>
            <td class="<?= $textOrientation ?>" data-th="<?= $arrayKeys[0] ?>">
                <span class="resources-unit-<?= $i ?>"></span>
            </td>
            <td class="<?= $textOrientation ?>" data-th="<?= $arrayKeys[1] ?>" id="units-crafting-<?= $i ?>"></td>
            <td class="<?= $textOrientation ?>" data-th="<?= $arrayKeys[2] ?>" id="units-market-<?= $i ?>"></td>
            <td class="<?= $textOrientation ?>" data-th="<?= $arrayKeys[3] ?>" id="units-pps-<?= $i ?>"></td>
            <td class="<?= $textOrientation ?>" data-th="<?= $arrayKeys[4] ?>" id="units-profit-<?= $i ?>"></td>
        </tr>

    <?php } ?>

    </tbody>
</table>
