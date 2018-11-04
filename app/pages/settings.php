<!-- #module-settings -->

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-settings">

  <h6><?php echo file_get_contents("assets/img/icons/gear.svg"); ?> <span id="settings-header">Settings</span></h6>
  <button type="button" class="close" aria-label="Close" id="settings-close">
  <span aria-hidden="true">×</span>
  </button>
  <hr class="mb-3">

  <div class="alert alert-primary" role="alert">
    <span id="security-token-txt">Your security token</span>: <code id="security-token"></code>
  </div>

  <div id="settings-accordion" role="tablist" aria-multiselectable="true" class="col">
    <div class="card">
      <div class="card-header bg-dark" role="tab" id="heading-page-settings">
        <h5 class="mb-0">
          <a data-toggle="collapse" data-parent="#settings-accordion" href="#collapse-page-settings" aria-expanded="true" aria-controls="collapse-page-settings" id="settings-header-0">
          Page Settings
          </a>
        </h5>
      </div>

      <div id="collapse-page-settings" class="collapse show" role="tabpanel" aria-labelledby="heading-page-settings">
        <div class="card-block p-4 bg-light">

        <?php

        require_once "app/pages/settings/pageSettings.php";

        ?>

        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-header bg-dark" role="tab" id="heading-general-settings">
        <h5 class="mb-0">
          <a class="collapsed" data-toggle="collapse" data-parent="#settings-accordion" href="#collapse-general-settings" aria-expanded="false" aria-controls="collapse-general-settings" id="settings-header-1">
          General Settings
          </a>
        </h5>
      </div>
      <div id="collapse-general-settings" class="collapse" role="tabpanel" aria-labelledby="heading-general-settings">
        <div class="card-block p-4 bg-light">

        <?php

        require_once "app/pages/settings/generalSettings.php";

        ?>

        </div>
      </div>
    </div>
  </div>
</div>
