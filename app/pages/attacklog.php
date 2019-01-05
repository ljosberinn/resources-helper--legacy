<!-- #module-attacklog -->

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-attacklog">

    <h6><span><?php echo file_get_contents ("assets/img/icons/table.svg"); ?></span> <span id="attacklog-header">Attack Log</span></h6>
    <hr class="mb-3">

    <div id="attacklog-accordion" role="tablist" aria-multiselectable="true" class="col">
        <div class="card">
            <div class="card-header bg-dark" role="tab" id="heading-defenselog-simple">
                <h5 class="mb-0">
                    <a class="collapsed" data-toggle="collapse" data-parent="#attacklog-accordion" href="#collapse-defenselog-simple" aria-expanded="false" aria-controls="collapse-defenselog-simple" id="defenselog-header">
                        Simple Defense Log
                    </a>
                </h5>
            </div>

            <div id="collapse-defenselog-simple" class="collapse" role="tabpanel" aria-labelledby="heading-defenselog-simple">
                <div class="card-block p-4 bg-light">

                    <?php

                    require_once "app/pages/attacklog/defenseSimple.php";

                    ?>

                </div>
            </div>
        </div>

        <?php if ($_SESSION['id'] == 1) { ?>

            <div class="card">
                <div class="card-header bg-dark" role="tab" id="heading-defenselog-detailed">
                    <h5 class="mb-0">
                        <a class="collapsed" data-toggle="collapse" data-parent="#attacklog-accordion" href="#collapse-defenselog-detailed" aria-expanded="false" aria-controls="collapse-defenselog-detailed" id="defenselog-detailed-header">
                            Detailed Defense Log
                        </a>
                    </h5>
                </div>

                <div id="collapse-defenselog-detailed" class="collapse" role="tabpanel" aria-labelledby="heading-defenselog-detailed">
                    <div class="card-block p-4 bg-light">

                        <?php

                        require_once "app/pages/attacklog/defenseDetailed.php";

                        ?>

                    </div>
                </div>
            </div>

        <?php } ?>

        <div class="card">
            <div class="card-header bg-dark" role="tab" id="heading-attacklog-1">
                <h5 class="mb-0">
                    <a class="collapsed" data-toggle="collapse" data-parent="#attacklog-accordion" href="#collapse-attacklog-simple" aria-expanded="false" aria-controls="collapse-attacklog-simple" id="attacklog-simple-header">
                        Simple Attack Log
                    </a>
                </h5>
            </div>

            <div id="collapse-attacklog-simple" class="collapse" role="tabpanel" aria-labelledby="heading-attacklog-1">
                <div class="card-block p-4 bg-light">

                    <?php

                    require_once "app/pages/attacklog/attackSimple.php";

                    ?>

                </div>
            </div>
        </div>

        <div class="card">
            <div class="card-header bg-dark" role="tab" id="heading-attacklog-2">
                <h5 class="mb-0">
                    <a class="collapsed" data-toggle="collapse" data-parent="#attacklog-accordion" href="#collapse-attacklog-detailed" aria-expanded="true" aria-controls="collapse-attacklog-detailed" id="attacklog-detail-header">
                        Detailed Attack Log
                    </a>
                </h5>
            </div>


            <div id="collapse-attacklog-detailed" class="collapse" role="tabpanel" aria-labelledby="heading-attacklog-2">
                <div class="card-block p-4 bg-light">

                    <?php

                    require_once "app/pages/attacklog/attackDetailed.php";

                    ?>

                </div>
            </div>
        </div>
    </div>
</div>
