<span id="loading-container" class="text-muted lead">

    <?php

    $loadingAnimations = glob('assets/img/loadingAnimations/*.svg', GLOB_NOSORT);

    require_once $loadingAnimations[array_rand($loadingAnimations, 1)];

    ?>

    <span id="loading-text"></span><span id="loading-dots"></span>

</span>
