<!-- #module-pricehistory -->

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-pricehistory">

  <h6><span><?php echo file_get_contents("assets/img/icons/chart.svg"); ?></span> Price History <select class="custom-select" id="pricehistory-selector">
    <option selected disabled>select resource</option>
    <?php

    for ($i = 0; $i < 58; $i += 1) {

      if($i >= 0 && $i <= 13) {
        $imgClass = "material";
        $k = $i ;
      } else if($i >= 14 && $i <= 35) {
        $imgClass = "products";
        $k = $i - 14;
      } else if($i > 35 && $i < 52) {
        $imgClass = "loot";
        $k = $i - 36;
      } else {
        $imgClass = "units";
        $k = $i - 52;
      }

      if($i == 0) {
        echo '<optgroup label="Material"></optgroup>';
      } else if($i == 14) {
        echo '<optgroup label="Products"></optgroup>';
      } else if($i == 36) {
        echo '<optgroup label="Loot"></optgroup>';
      } else if($i == 52) {
        echo '<optgroup label="Units"></optgroup>';
      }

      echo '
      <option value="' .$i. '" id="pricehistory-' .$imgClass. '-' .$k. '">placeholder</option>';
    }

    ?>

  </select> <a href="api/exchange.php" target="_blank" rel="noopener noreferrer">Download everything here (.csv)</a></h6>
  <hr class="mb-3">

  <div class="col-xs-12 col-md-12 p-3" id="graph-pricehistory"></div>
</div>
