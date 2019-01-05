<?php

$textOrientation = "text-md-right text-sm-left";

$columns = [
    "Attacked player (last known level)"                      => "sorttable_nosort",
    "Last attack"                                             => "sorttable_nosort",
    "Total attacks (Win %)"                                   => $textOrientation . " sorttable_nosort",
    "Win"                                                     => $textOrientation,
    "Loss"                                                    => $textOrientation,
    "Average loot factor"                                     => $textOrientation,
    "Average amount of units required to win against 200/5/2" => "sorttable_nosort",
    "Profit"                                                  => $textOrientation,
];

?>

<table class="table table-responsive table-break-medium mb-3">
    <thead>
    <tr class="small">

        <?php

        $i = 0;

        foreach ($columns as $column => $classes) { ?>
            <th id="attacklog-simple-th-<?= $i ?>" class="<?= $classes ?>"><?= $column ?></th>
            <?php
            $i += 1;
        }

        ?>
    </tr>
    </thead>
    <tbody id="attacklog-tbody-simple"></tbody>
    <tfoot>
    <tr class="small">
        <td colspan="3" class="<?= $textOrientation ?>" id="attacklog-simple-sum"></td>
        <td class="<?= $textOrientation ?>" id="attacklog-simple-win"></td>
        <td class="<?= $textOrientation ?>" id="attacklog-simple-loss"></td>
        <td class="<?= $textOrientation ?>" id="attacklog-simple-factor"></td>
        <td colspan="2" class="<?= $textOrientation ?>" id="attacklog-simple-profit"></td>
    </tr>
    </tfoot>
</table>
