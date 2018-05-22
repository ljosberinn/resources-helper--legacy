<form class="mb-3" method="POST" action="api/changePageSettings.php">

<!-- SETTING PAGE LANGUAGE -->
  <div class="form-group">
    <label class="text-success" for="settings-language">
      <strong><?php echo file_get_contents("assets/img/icons/text.svg"); ?> <span id="settings-language-header">Language</span></strong>
    </label>

    <br />

    <select class="custom-select" id="settings-language" name="settings-language" aria-describedby="settings-language-help">
      <option selected disabled value="">select your preferred language</option>

        <?php

        $languageQuery = "SELECT * FROM `languages` WHERE `active` = 1 ORDER BY `short` ASC";
        $getLanguages = $conn->query($languageQuery);

        if ($getLanguages->num_rows > 0) {
            while ($language = $getLanguages->fetch_assoc()) {
                echo '
                <option value="' .$language["id"]. '">' .$language["short"]. ' | ' .$language["name"]. '</option>';
            }
        } else {
            echo '
            <option value="" disabled>
            Sorry, server seems to be unavailable. Please try again later! If this issue persists, please write a mail to admin@gerritalex.de
            </option>';
        }

        ?>

    </select>
    <small class="form-text text-muted" id="settings-language-help">
      Your preferred language.
    </small>
  </div>

  <!-- SETTING CUSTOM TECH UPGRADES -->
  <div class="form-group">
    <label class="text-success">
      <strong id="settings-custom-tu-header">Custom Tech-Upgrade combination</strong>
    </label>

    <br />

    <?php

    for ($i = 1; $i <= 4; $i += 1) {
        echo '
        <div class="input-group mb-1 mt-1">
          <div class="input-group-addon resources-loot-1' .($i - 1). '" id="custom-tu-desc-' .$i. '"></div>

          <input
            class="form-control col-md-12 col-xl-6"
            id="settings-custom-tu-' .$i. '"
            name="settings-custom-tu-' .$i. '"
            type="number"
            min="0"
            max="999"
            placeholder="# Tech-Upgrade ' .$i. '"
            aria-label="# Tech-Upgrade ' .$i. '"
            aria-describedby="custom-tu-desc-' .$i. '"
            />
        </div>
        ';
    }

    ?>

    <small class="form-text text-muted" id="settings-custom-tu-info">
      Used to calculate mine amortisation (default 111/26/0/0).
    </small>
  </div>


  <!-- SETTING IDEAL CONDITION -->
  <div class="form-group">
    <label class="custom-control custom-checkbox">
    <input class="custom-control-input" id="settings-ideal-conditions" name="settings-ideal-conditions" type="checkbox" />
    <span class="custom-control-indicator"></span>
    <span class="custom-control-description" id="settings-ideal-condition-txt">toggles activation of <mark>ideal conditions</mark> when loading page (100% workload for all factories)</span>
    </label>
  </div>

  <!-- SETTING TRANSPORT COST -->
  <div class="form-group">
    <label class="custom-control custom-checkbox">
      <input class="custom-control-input" id="settings-toggle-transport-cost-inclusion" name="settings-toggle-transport-cost-inclusion" type="checkbox"/>
      <span class="custom-control-indicator"></span>
      <span class="custom-control-description" id="settings-transport-cost-inclusion-txt">toggles automatical <mark>transport cost inclusion</mark> when loading page (Recycling & Units)</span>
    </label>
  </div>

  <!-- SETTING SHOW NAMES -->
  <div class="form-group">
    <label class="custom-control custom-checkbox">
      <input class="custom-control-input" id="settings-show-names" name="settings-show-names" type="checkbox"/>
      <span class="custom-control-indicator"></span>
      <span class="custom-control-description" id="settings-show-names-txt">toggles automatical <mark>visibility of factory names</mark> when loading page <span class="text-danger">warning: page layout may suffer</span></span>
    </label>
  </div>

  <!-- SETTING IDEAL CONDITION -->
  <div class="form-group" id="settings-overwrite-api-container">
    <label class="custom-control custom-checkbox">
    <input class="custom-control-input" id="settings-overwrite-api" name="settings-overwrite-api" type="checkbox" />
    <span class="custom-control-indicator"></span>
    <span class="custom-control-description" id="settings-overwrite-api-txt">only for API users: if this option is checked, you will <span class="text-danger">NO LONGER</span> appear within the leaderboard, <span class="text-success">but you will be able to save your manually added changes</span>, overwriting API data. <span class="text-danger">This change is permanent!</span></span>
    </label>
  </div>

  <!-- SETTING HQ VISIBILITY ON MAP -->
  <div class="form-group">
    <label class="text-success" for="settings-hq-visibility">
      <strong><img src="assets/img/icons/hidehq.png" alt="" /> <span id="settings-hq-visibility-txt">Headquarter visibility on worldmap</span> <img src="assets/img/icons/showhq.png" alt="" /></strong>
    </label>

   <br />

    <select class="custom-select" id="settings-hq-visibility" name="settings-hq-visibility" aria-describedby="settings-hq-visibility-help">
      <option selected value="0" id="settings-hq-visiblility-0">invisible (default)</option>
      <option value="1" id="settings-hq-visiblility-1">visible</option>
    </select>
    <small class="form-text text-muted" id="settings-hq-visibility-help">
      Toggles your headquarter visibility on the worldmap when Headquarter data via API is imported.
    </small>
  </div>

  <!-- SETTING MINE VISIBILITY ON MAP -->
  <div class="form-group">
    <label class="text-success" for="settings-mine-visibility">
      <strong><span class="nav-icon-mines"></span> <span id="settings-mine-visibility-txt">Mine visibility on worldmap</span></strong>
    </label>

   <br />

    <select class="custom-select" id="settings-mine-visibility" name="settings-mine-visibility" aria-describedby="settings-mine-visibility-help">
      <option selected value="0" id="settings-mine-visiblility-0">invisible (default)</option>
      <option value="1" id="settings-mine-visiblility-1">visible</option>
    </select>
    <small class="form-text text-muted" id="settings-mine-visibility-help">
      Toggles your mine visibility on the worldmap when Detailed Mine data data via API is imported.
    </small>
  </div>

  <!-- SETTING BASE PRICE AGE -->

  <div class="form-group">
    <label class="text-success" for="settings-price-age">
      <strong><?php echo file_get_contents("assets/img/icons/numbers.svg"); ?> <span id="settings-price-age-txt">Price Age selection</span></strong>
    </label>

    <br />

    <select class="custom-select" id="settings-price-age" name="settings-price-age" aria-describedby="settings-price-age-help">
      <option value="0" id="settings-price-age-0">most recent prices</option>
      <option value="1" id="settings-price-age-1">1 day average</option>
      <option selected value="2" id="settings-price-age-2">3 days average (default)</option>
      <option value="3" id="settings-price-age-3">7 days average</option>
      <option value="4" id="settings-price-age-4">4 weeks average/option>
      <option value="5" id="settings-price-age-5">3 months average</option>
      <option value="6" id="settings-price-age-6">6 months average</option>
      <option value="7" id="settings-price-age-7">1 year average</option>
      <option value="8" id="settings-price-age-8">maximum</>
    </select>
    <small class="form-text text-muted" id="settings-price-age-help">
      Defines base Price Age everything is calculated with.
    </small>
  </div>

  <button class="btn btn-success" id="page-settings-submit" type="submit">Save</button>
</form>
