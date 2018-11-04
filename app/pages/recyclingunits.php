<!-- #module-recyclingunits -->

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-recyclingunits">

  <h6><span><?php echo file_get_contents("assets/img/icons/table.svg"); ?></span> <span id="recyclingunits-header">Recycling & Units</span></h6>
  <hr class="mb-3">

  <?php

  require_once "recyclingunits/recycling.php";

  require_once "recyclingunits/units.php";

  ?>

</div>
