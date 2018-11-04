<!-- #module-tradelog -->

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-tradelog">

  <h6><span><?php echo file_get_contents("assets/img/icons/piechart.svg"); ?></span> <span id="tradelog-header">Trade Log</span></h6>
  <hr class="mb-3">

  <div class="row">
    <div class="col-sm-12 col-lg-6" id="graph-tradelog-buying"></div>

    <div class="col-sm-12 col-lg-6" id="graph-tradelog-selling"></div>

    <div class="col-12" id="graph-tradelog-habits"></div>
  </div>

  <div id="tradelog-accordion" role="tablist" aria-multiselectable="true" class="col">
    <div class="card">
      <div class="card-header bg-dark" role="tab" id="heading-tradelog-simple">
        <h5 class="mb-0">
          <a class="collapsed" data-toggle="collapse" data-parent="#tradelog-accordion" href="#collapse-tradelog-simple" aria-expanded="false" aria-controls="collapse-tradelog-simple" id="tradelog-header-0">
          Simple Trade Log
          </a>
        </h5>
      </div>

      <div id="collapse-tradelog-simple" class="collapse show" role="tabpanel" aria-labelledby="heading-tradelog-simple">
        <div class="card-block p-4 bg-light">

        <?php

        require_once "app/pages/tradelog/simple.php";

        ?>

        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header bg-dark" role="tab" id="heading-tradelog-detailed">
        <h5 class="mb-0">
          <a class="collapsed" data-toggle="collapse" data-parent="#tradelog-accordion" href="#collapse-tradelog-detailed" aria-expanded="false" aria-controls="collapse-tradelog-detailed" id="tradelog-header-1">
          Detailed Trade Log
          </a>
        </h5>
      </div>

      <div id="collapse-tradelog-detailed" class="collapse" role="tabpanel" aria-labelledby="heading-tradelog-detailed">
        <div class="card-block p-4 bg-light">

        <?php

        require_once "app/pages/tradelog/detailed.php";

        ?>

        </div>
      </div>
    </div>
  </div>
</div>
