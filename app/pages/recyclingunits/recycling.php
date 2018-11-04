<?php

$columns = [
    "Loot"           => $textOrientation . " sorttable_nosort",
    "required/cycle" => $textOrientation,
    "Products"       => $textOrientation . " sorttable_nosort",
    "Input worth"    => $textOrientation,
    "Output worth"   => $textOrientation,
    "Profit"         => $textOrientation,
];

$arrayKeys = array_keys ($columns);

$textOrientation = "text-md-right text-sm-left";

?>

<p class="lead">Recycling</p>

<table class="table table-responsive table-break-medium table-striped mb-3" id="recycling-tbl">
    <thead>
    <tr class="small">

        <?php

        $i = 0;

        foreach ($columns as $column => $classes) { ?>
            <th id="recycling-th-<?= $i ?>" class="<?= $classes ?>"><?= $column ?></th>
            <?php
            $i += 1;
        }

        ?>
    </tr>
    </thead>
    <tbody>

    <?php

    for ($i = 0; $i <= 15; $i += 1) {

        // skip tech upgrades and giant diamonds
        if ($i === 4 || $i >= 10 && $i <= 13) {
            continue;
        }

        ?>
        <tr>
            <td class="<?= $textOrientation ?>" data-th="<?= $arrayKeys[0] ?>">
                <span class="resources-loot-<?= $i ?>"></span>
            </td>
            <td class="<?= $textOrientation ?>" data-th="<?= $arrayKeys[1] ?>" id="recycling-requirement-<?= $i ?>"></td>
            <td class="<?= $textOrientation ?>" data-th="<?= $arrayKeys[2] ?>" id="recycling-products-<?= $i ?>"></td>
            <td class="<?= $textOrientation ?>" data-th="<?= $arrayKeys[3] ?>" id="recycling-input-<?= $i ?>"></td>
            <td class="<?= $textOrientation ?>" data-th="<?= $arrayKeys[4] ?>" id="recycling-output-<?= $i ?>"></td>
            <td class="<?= $textOrientation ?>" data-th="<?= $arrayKeys[5] ?>" id="recycling-profit-<?= $i ?>"></td>
        </tr>

    <?php } ?>

    </tbody>
</table>
