<!-- #module-pricehistory -->

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-pricehistory">

    <h6><span><?php echo file_get_contents ("assets/img/icons/chart.svg"); ?></span> <span id="pricehistory-header">Price History</span> <select class="custom-select" id="pricehistory-selector">
            <option selected disabled id="pricehistory-select-txt">select resource</option>
            <?php

            for ($i = 0; $i < 58; $i += 1) {

                switch ($i) {
                    case ($i >= 0 && $i <= 13):
                        $imgClass = 'material';
                        $k        = $i;
                        break;
                    case ($i >= 14 && $i <= 35):
                        $imgClass = 'products';
                        $k        = $i - 14;
                        break;
                    case ($i > 35 && $i < 52):
                        $imgClass = 'loot';
                        $k        = $i - 36;
                        break;
                    default:
                        $imgClass = 'units';
                        $k        = $i - 52;
                        break;
                }

                /*if ($i >= 0 && $i <= 13) {
                    $imgClass = "material";
                    $k        = $i;
                } elseif ($i >= 14 && $i <= 35) {
                    $imgClass = "products";
                    $k        = $i - 14;
                } elseif ($i > 35 && $i < 52) {
                    $imgClass = "loot";
                    $k        = $i - 36;
                } else {
                    $imgClass = "units";
                    $k        = $i - 52;
                }*/

                if ($i === 0) {
                    echo '<optgroup label="Material"></optgroup>';
                } elseif ($i === 14) {
                    echo '<optgroup label="Products"></optgroup>';
                } elseif ($i === 36) {
                    echo '<optgroup label="Loot"></optgroup>';
                } elseif ($i === 52) {
                    echo '<optgroup label="Units"></optgroup>';
                }

                ?>
                <option value="<?= $i ?>" id="pricehistory-<?= $imgClass ?>-<?= $k ?>">PH</option>
            <?php } ?>

        </select> <a href="api/exchange.php" target="_blank" rel="noopener noreferrer" id="pricehistory-download">Download everything here (.csv)</a></h6>
    <hr class="mb-3">

    <div class="col-xs-12 col-md-12 p-3" id="graph-pricehistory"></div>
</div>
