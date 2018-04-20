<form class="mb-3" method="POST" action="api/changePageSettings.php">

    <!-- SETTING PAGE LANGUAGE -->
    <div class="form-group">
        <label class="text-success" for="settings-language">
            <strong><?php echo file_get_contents("assets/img/icons/text.svg"); ?> Language</strong>
        </label>

        <br />

        <select class="custom-select" id="settings-language" name="settings-language" aria-describedby="settings-language-help" disabled>
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
            <strong>Custom Tech-Upgrade combination</strong>
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

        <small class="form-text text-muted">
            Used to calculate mine amortisation when including tech-upgrade prices (default 111/26/0/0).
        </small>
    </div>


    <!-- SETTING IDEAL CONDITION -->
    <div class="form-group">
        <label class="custom-control custom-checkbox">
            <input class="custom-control-input" id="settings-ideal-conditions" name="settings-ideal-conditions" type="checkbox" />
            <span class="custom-control-indicator"></span>
            <span class="custom-control-description">toggles activation of <mark>ideal conditions</mark> when loading page (100% workload for all factories)</span>
        </label>
    </div>

    <!-- SETTING TRANSPORT COST -->
    <div class="form-group">
        <label class="custom-control custom-checkbox">
            <input class="custom-control-input" id="settings-toggle-transport-cost-inclusion" name="settings-toggle-transport-cost-inclusion" type="checkbox"/>
            <span class="custom-control-indicator"></span>
            <span class="custom-control-description">toggles automatical <mark>transport cost inclusion</mark> when loading page (Recycling & Units)</span>
        </label>
    </div>

    <!-- SETTING HQ VISIBILITY ON MAP -->
    <div class="form-group">
        <label class="text-success" for="settings-hq-visibility">
            <strong><img src="assets/img/icons/hidehq.png" alt="" /> Headquarter visibility on worldmap <img src="assets/img/icons/showhq.png" alt="" /></strong>
        </label>

        <br />

        <select class="custom-select" id="settings-hq-visibility" name="settings-hq-visibility" aria-describedby="settings-hq-visibility-help">
                <option selected value="0">invisible (default)</option>
                <option value="1">visible</option>
        </select>
        <small class="form-text text-muted" id="settings-hq-visibility-help">
            Toggles your headquarter visibility on the worldmap.
        </small>
    </div>

    <!-- SETTING BASE PRICE AGE -->

    <div class="form-group">
        <label class="text-success" for="settings-price-age">
            <strong><?php echo file_get_contents("assets/img/icons/numbers.svg"); ?> Price Age selection</strong>
        </label>

        <br />

        <select class="custom-select" id="settings-price-age" name="settings-price-age" aria-describedby="settings-price-age-help">
                <option value="0">current</option>
                <option value="1">1 day</option>
                <option selected value="2">3 days (default)</option>
                <option value="3">7 days</option>
                <option value="4">4 weeks</option>
                <option value="5">3 months</option>
                <option value="6">6 months</option>
                <option value="7">1 year</option>
                <option value="8">maximum</option>
        </select>
        <small class="form-text text-muted" id="settings-price-age-help">
            Defines base Price Age everything is calculated with.
        </small>
    </div>

    <button class="btn btn-success" id="page-settings-submit" type="submit">
        Save
    </button>
</form>
