<!-- #module-maps -->

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-maps">

  <h6><?php echo file_get_contents("assets/img/icons/map.svg"); ?> Maps</h6>
  <hr class="mb-3">

  <div id="maps-accordion" role="tablist" aria-multiselectable="true" class="col">
    <div class="card">
      <div class="card-header bg-dark" role="tab" id="heading-map-1">
        <h5 class="mb-0">
          <a class="collapsed" data-toggle="collapse" data-parent="#maps-accordion" href="#collapse-personal-map" aria-expanded="false" aria-controls="collapse-personal-map" id="personalmap-create">
          Personal Mine Map
          </a>
        </h5>
      </div>

      <div id="collapse-personal-map" class="collapse" role="tabpanel" aria-labelledby="heading-map-1">
        <div class="card-block p-4 bg-light">

        <?php

        if (isset($_SESSION["id"])) {

            include "app/pages/maps/personalmap.php";

        } else {

            echo '<span class="text-danger text-center">Sorry, this feature is only available for registered users.</span>';
        }

        ?>

        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header bg-dark" role="tab" id="heading-map-2">
        <h5 class="mb-0">
          <a class="collapsed" data-toggle="collapse" data-parent="#maps-accordion" href="#collapse-world-map" aria-expanded="true" aria-controls="collapse-world-map" id="worldmap-create">
          World Map
          </a>
        </h5>
      </div>


      <div id="collapse-world-map" class="collapse show" role="tabpanel" aria-labelledby="heading-map-2">
        <div class="card-block p-4 bg-light">

        <?php

        require "app/pages/maps/worldmap.php";

        ?>

        </div>
      </div>
    </div>
  </div>
</div>
