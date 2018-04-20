<!-- #module-attacklog -->

<?php

$columns = [
    "Factory"                       => "sorttable_nosort",
    "Factory Level"                 => "sorttable_nosort",
    "Product"                       => "sorttable_nosort",
    "Dependencies"                  => "sorttable_nosort",
    "Workload"                      => "sorttable_numeric",
    "Turnover"                      => "",
    "Turnover Increase per Upgrade" => "",
    "Upgrade Cost"                  => "",
    "Return on Investment"          => ""
];

$textOrientation = "text-md-right text-sm-left";

$arrayKeys = array_keys($columns);

?>

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-attacklog">

    <h6><span><?php echo file_get_contents("assets/img/icons/table.svg"); ?></span> Attack Log <span style="color: coral;">UNDER CONSTRUCTION</span></h6>
    <hr class="mb-3">

    <div id="attacklog-accordion" role="tablist" aria-multiselectable="true" class="col">
        <div class="card">
            <div class="card-header bg-dark" role="tab" id="heading-defenselog">
                <h5 class="mb-0">
                    <a class="collapsed" data-toggle="collapse" data-parent="#attacklog-accordion" href="#collapse-defenselog-simple" aria-expanded="false" aria-controls="collapse-defenselog-simple">
                        Simple Defense Log
                    </a>
                </h5>
            </div>

            <div id="collapse-defenselog-simple" class="collapse" role="tabpanel" aria-labelledby="heading-defenselog">
                <div class="card-block p-4 bg-light">

                <?php

                require "app/pages/attacklog/defense.php";

                ?>

                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header bg-dark" role="tab" id="heading-attacklog-1">
                <h5 class="mb-0">
                    <a class="collapsed" data-toggle="collapse" data-parent="#attacklog-accordion" href="#collapse-attacklog-simple" aria-expanded="false" aria-controls="collapse-attacklog-simple">
                        Simple Attack Log
                    </a>
                </h5>
            </div>

            <div id="collapse-attacklog-simple" class="collapse" role="tabpanel" aria-labelledby="heading-attacklog-1">
                <div class="card-block p-4 bg-light">

                <?php

                require "app/pages/attacklog/simple.php";

                ?>

                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header bg-dark" role="tab" id="heading-attacklog-2">
                <h5 class="mb-0">
                    <a class="collapsed" data-toggle="collapse" data-parent="#attacklog-accordion" href="#collapse-attacklog-detailed" aria-expanded="true" aria-controls="collapse-attacklog-detailed">
                        Detailed Attack Log
                    </a>
                </h5>
            </div>


            <div id="collapse-attacklog-detailed" class="collapse" role="tabpanel" aria-labelledby="heading-attacklog-2">
                <div class="card-block p-4 bg-light">

                    <?php

                    require "app/pages/attacklog/detailed.php";

                    ?>

                </div>
            </div>
        </div>
    </div>
</div>
