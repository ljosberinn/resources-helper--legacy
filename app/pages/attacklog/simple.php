<?php

$textOrientation = "text-md-right text-sm-left";

$columns = [
    "Attacked player (last known level)"                      => "sorttable_nosort",
    "Last attack"                                             => "sorttable_nosort",
    "Total attacks (Win %)"                                   => $textOrientation. " sorttable_nosort",
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

        foreach ($columns as $column => $classes) {
            echo '
            <th class="' .$classes. '">' .$column. '</th>';
        }

        ?>
        </tr>
    </thead>
    <tbody id="attacklog-tbody-simple">

    </tbody>
    <tfoot>
        <tr class="small">
        <td colspan="3" class="<?php echo $textOrientation; ?>" id="attacklog-simple-sum"></td>
        <td class="<?php echo $textOrientation; ?>" id="attacklog-simple-win"></td>
        <td class="<?php echo $textOrientation; ?>" id="attacklog-simple-loss"></td>
        <td class="<?php echo $textOrientation; ?>" id="attacklog-simple-factor"></td>
        <td colspan="2" class="<?php echo $textOrientation; ?>" id="attacklog-simple-profit"></td>
        </tr>
    </tfoot>
</table>
