
<?php

$textOrientation = "text-md-right text-sm-left";

?>

<div class="row">
  <div class="col-12">

    <div class="form-group">
      <label class="custom-control custom-checkbox">
        <input class="custom-control-input" id="techupgrades-toggle" name="techupgrades" type="checkbox">
        <span class="custom-control-indicator"></span>
        <span class="custom-control-description">toggle Tech-Upgrade 4 combinations</span>
      </label>
    </div>

    <table class="table table-responsive table-break-medium table-striped mb-3" id="techupgrades-combinations-tbl">
      <thead>
        <tr class="small">
          <th class="<?php echo $textOrientation; ?>">Tech-Upgrade 1</th>
          <th class="<?php echo $textOrientation; ?>">Tech-Upgrade 2</th>
          <th class="<?php echo $textOrientation; ?>">Tech-Upgrade 3</th>
          <th class="<?php echo $textOrientation; ?>">Tech-Upgrade 4</th>
          <th class="<?php echo $textOrientation; ?>">Factor</th>
          <th class="<?php echo $textOrientation; ?> sorttable_reverse">Price</th>
          <th class="<?php echo $textOrientation; ?>">Pimp my mine Count</th>
        </tr>
      </thead>
      <tbody>

      </tbody>
    </table>
  </div>
</div>
