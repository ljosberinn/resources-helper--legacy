<!-- #module-flow -->

<?php

$textOrientation = "text-md-right text-sm-left";

?>

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-flow">

    <h6><span></span> <span id="flow-header">Material Flow</span></h6>
    <hr class="mb-3">

    <p class="lead" id="flow-material-header">Material</p>

    <table class="table table-responsive table-break-medium table-striped mb-3">
        <thead>
        <tr class="small">
            <th id="flow-material-th-0">Rate/hour</th>
            <th id="flow-material-th-1" class="text-center" colspan="4">Distribution</th>
            <th id="flow-material-th-2" class="<?php echo $textOrientation; ?>">Surplus/hour</th>
            <th id="flow-material-th-3" class="<?php echo $textOrientation; ?>">Worth</th>
        </tr>
        </thead>
        <tbody>

        <?php for ($i = 0; $i <= 13; $i += 1) { ?>
            <tr>
                <td data-th="Rate/hour">
                    <span class="resources-material-<?= $i ?>"></span>
                    <span id="flow-material-rate-<?= $i ?>"></span>
                </td>
                <td id="flow-material-distribution-<?= $i ?>-0"></td>
                <td id="flow-material-distribution-<?= $i ?>-1"></td>
                <td id="flow-material-distribution-<?= $i ?>-2"></td>
                <td id="flow-material-distribution-<?= $i ?>-3"></td>
                <td data-th="Surplus/hour" id="flow-material-surplus-<?= $i ?>"></td>
                <td data-th="Worth" class="<?= $textOrientation ?>" id="flow-material-worth-<?= $i ?>"></td>
            </tr>
        <?php } ?>
        </tbody>
        <tfoot>
        <tr>
            <td class="<?= $textOrientation ?>" colspan="7" data-th="Effective hourly mine income" id="flow-material-total"></td>
        </tr>
        </tfoot>
    </table>

    <p class="lead" id="flow-product-header">Products</p>

    <table class="table table-responsive table-break-medium table-striped mb-3">
        <thead>
        <tr class="small">
            <th id="flow-product-th-0">Effective rate/hour</th>
            <th id="flow-product-th-1" class="text-center" colspan="3">Distribution</th>
            <th id="flow-product-th-2" class="<?php echo $textOrientation; ?> ">Surplus/hour</th>
            <th id="flow-product-th-3" class="<?php echo $textOrientation; ?>">Worth</th>
        </tr>
        </thead>
        <tbody>

        <?php

        for ($i = 0; $i <= 21; $i += 1) { ?>
            <tr>
                <td data-th="Effective rate/hour">
                    <span class="resources-product-<?= $i ?>"></span>
                    <span id="flow-product-rate-<?= $i ?>"></span>
                </td>
                <td id="flow-product-distribution-<?= $i ?>-0"></td>
                <td id="flow-product-distribution-<?= $i ?>-1"></td>
                <td id="flow-product-distribution-<?= $i ?>-2"></td>
                <td data-th="Surplus/hour" class="<?= $textOrientation ?>" id="flow-product-surplus-<?= $i ?>"></td>
                <td data-th="Worth" class="<?= $textOrientation ?>" id="flow-product-worth-<?= $i ?>"></td>
            </tr>
        <?php } ?>
        </tbody>
        <tfoot>
        <tr>
            <td class="<?= $textOrientation ?>" colspan="6" data-th="Effective hourly factories income" id="flow-products-total"></td>
        </tr>
        </tfoot>
    </table>
</div>
