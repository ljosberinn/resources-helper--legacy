<?php

$textOrientation = "text-md-right text-sm-left";

$columns = [
    "Attacked player (level)" => "sorttable_nosort",
    "Timestamp & position" => "sorttable_nosort",
    "Units lost" => "text-sm-left text-md-center sorttable_nosort",
    "Units destroyed" => "text-sm-left text-md-center sorttable_nosort",
    "Lootfactor" => $textOrientation,
    "Loot" => "sorttable_nosort",
    "Profit" => $textOrientation,
];

?>

<table class="table table-responsive table-break-medium mb-3">
  <tbody>
    <tr>
      <td class="sorttable_nosort">
        <button class="btn btn-success" id="attacklog-detailed-last">last 100 entries</button>
      </td>
      <td class="sorttable_nosort text-md-center text-sm-left">Show only attacks against...
        <select class="custom-select" id="attacklog-detailed-selector">
          <option selected disabled>select target</option>
          <option value="-1">reset selection</option>
        </select>
      </td>
      <td class="sorttable_nosort <?php echo $textOrientation; ?>">
        <button class="btn btn-success" id="attacklog-detailed-next">next 100 entries</button>
      </td>
    </tr>
  </tbody>
</table>

<table class="table table-responsive table-break-medium mb-3">
  <thead>
    <tr class="small">

      <?php

      foreach($columns as $column => $classes) {
        echo '
        <th class="' .$classes. '">' .$column. '</th>';
      }

      ?>
    </tr>
  </thead>
  <tbody id="attacklog-tbody-detailed">

  </tbody>
  <tfoot>
    <tr class="small">
      <td colspan="2">AVERAGE</td>
      <td class="text-sm-left text-md-center" id="attacklog-detailed-units-lost-avg"></td>
      <td></td>
      <td class="<?php echo $textOrientation; ?>" id="attacklog-detailed-factor-avg"></td>
      <td colspan="3" class="<?php echo $textOrientation; ?>" id="attacklog-detailed-profit-avg"></td>
    </tr>
    <tr class="small">
      <td colspan="2">TOTAL</td>
      <td class="text-sm-left text-md-center" id="attacklog-detailed-units-lost-total"></td>
      <td></td>
      <td class="<?php echo $textOrientation; ?>" id="attacklog-detailed-factor-total"></td>
      <td colspan="3" class="<?php echo $textOrientation; ?>" id="attacklog-detailed-profit-total"></td>
    </tr>
  </tfoot>
</table>
