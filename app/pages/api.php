<!-- #module-api -->

<div class="bg-light mt-3 mb-3 p-4 col-12 rounded" id="module-api">
    <h6>API</h6>
    <hr class="mb-3">

    <p id="api-description">
        The API allows you to directly import your game data via an API key. You'll recieve an API key per mail by buying API credits ingame.<br/>
        Additional info about the API be found on the games official <a href="https://www.resources-game.ch/" target="_blank" rel="noopener noreferrer">website</a> and <a href="https://www.resources-game.ch/resapi/" target="_blank"
                                                                                                                                                                           rel="noopener noreferrer">documentation</a>.<br/>
        Using the API will also allow you to appear in the Leaderboard.
    </p>

    <?php

    $apiArray = [
        [
            'inputId'     => 'factories',
            'description' => '<span id="api-factories-description">Factories</span>',
            'cost'        => '1 Credit',
            'checked'     => 'checked',
            'data-query'  => 1,
        ],
        [
            'inputId'     => 'warehouse',
            'description' => '<span id="api-warehouse-description">Warehouse & Warehouse levels</span>',
            'cost'        => '1 Credit',
            'checked'     => 'checked',
            'data-query'  => 2,
        ],
        [
            'inputId'     => 'buildings',
            'description' => '<span id="api-buildings-description">Special buildings</span>',
            'cost'        => '1 Credit',
            'checked'     => 'checked',
            'data-query'  => 3,
        ],
        [
            'inputId'     => 'headquarter',
            'description' => '<span id="api-headquarter-description">Headquarter & Headquarter details (mines within range, upgrade progress)</span>',
            'cost'        => '1 Credit',
            'checked'     => 'checked',
            'data-query'  => 4,
        ],
        [
            'inputId'     => 'mines-summary',
            'description' => '<span id="api-mines-summary-description">Mines - summary (total rates, mine amounts)</span>',
            'cost'        => '1 Credit',
            'checked'     => 'checked',
            'data-query'  => 51,
        ],
        [
            'inputId'     => 'mines-detailed',
            'description' => '<span id="api-mines-detailed-description">Mines - detailed (for your personal Mine Map and Worldmap)</span>',
            'cost'        => '1 Credit',
            'warning'     => '<span id="api-mines-detailed-warning">may take a while to load depending on your mine amount - only available for registered users</span>',
            'checked'     => 'checked',
            'data-query'  => 5,
            'login'       => 'required',
        ],
        [
            'inputId'     => 'player',
            'description' => '<span id="api-player-description">Player information (name, level, points, worldrank, account age)</span>',
            'cost'        => '1 Credit',
            'checked'     => 'checked',
            'data-query'  => 7,
            'login'       => 'required',
        ],
        [
            'inputId'     => 'attack-log',
            'description' => '<span id="api-attack-log-description">Attack log (last 30 days)</span>',
            'cost'        => '1 Credit',
            'warning'     => '<span id="api-attack-log-warning">may take a while to load depending on your attack habits - only available for registered users</span>',
            'checked'     => 'checked',
            'data-query'  => 9,
            'login'       => 'required',
        ],
        [
            'inputId'     => 'trade-log',
            'description' => '<span id="api-trade-log-description">Trade log (last 30 days)</span>',
            'cost'        => '1 Credit',
            'warning'     => '<span id="api-trade-log-warning">may take a while to load depending on your trade habits - only available for registered users</span>',
            'checked'     => 'checked',
            'data-query'  => 6,
            'login'       => 'required',
        ],
        [
            'inputId'     => 'missions',
            'description' => '<span id="api-missions-description">Missions (profit, progress, remaining time, penalty)</span>',
            'cost'        => '1 Credit',
            'checked'     => 'checked',
            'data-query'  => 10,
            'login'       => 'required',
            'warning'     => ' - only available for registered users',
        ],
        [
            'inputId'     => 'player-anonymity',
            'description' => '<span id="api-anonymity-description">Should your player name appear in world ranking?</span>',
            'cost'        => '',
            'checked'     => 'checked',
            'login'       => 'required',
        ],
    ];

    $successIcon = file_get_contents('assets/img/icons/success.svg');

    foreach($apiArray as $api) {

        $disabled = $api['login'] && !$_SESSION['id'] ? 'disabled' : '';

        $cost = $api['cost'] ? '<mark>' . $api['cost'] . '</mark>' : '';

        $warning = $api['warning'] ? '<code>' . $api['warning'] . '</code>' : '';

        $dataQuery = $api['data-query'] ? 'data-query="' . $api['data-query'] . '"' : '';

        ?>

        <div class="form-group">
            <label class="custom-control custom-checkbox">
                <input class="custom-control-input" id="api-<?= $api['inputId'] ?>" name="<?= $api['inputId'] ?>" <?= $dataQuery ?> type="checkbox" <?= $api['checked'] ?> <?= $disabled ?>/>
                <span class="custom-control-indicator"></span>
                <span class="custom-control-description"><?= $api['description'] ?> <?= $cost ?> <?= $warning ?></span>
                <span id="api-<?= $api['inputId'] ?>-loading" class="circles-to-rhombuses-spinner">
          <span class="rhombuses-circle"></span>
          <span class="rhombuses-circle"></span>
          <span class="rhombuses-circle"></span>
        </span>
                <span id="api-<?= $api['inputId'] ?>-finished"><?= $successIcon ?></span>
            </label>
        </div>

        <?php

    }

    if($_SESSION['id']) { ?>

        <div class="form-group" id="save-api-container">
            <label class="custom-control custom-checkbox">
                <input class="custom-control-input" id="save-key" name="save-key" type="checkbox"/>
                <span class="custom-control-indicator"></span>
                <span class="custom-control-description" id="api-save-key-description">save API key</span>
            </label>
        </div>
    <?php } ?>

    <div class="input-group">
        <span class="input-group-addon" id="api-key-help">API Key</span>
        <input type="text" minlength="45" maxlength="45" class="form-control" placeholder="API Key" aria-label="API Key" aria-describedby="api-key-help" id="api-key">
        <span class="input-group-addon" id="api-credits">Remaining API Credits</span>
    </div>

    <button class="btn btn-success" type="button" id="api-submit">
        Fetch API data
    </button>

</div>
