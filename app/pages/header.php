<?php

$headerClasses = $_SESSION['id'] ? 'col-xl-6 col-lg-6 mb-xl-3 mb-lg-3 mb-sm-0' : 'col-xl-12 col-lg-12 mb-3';

?>

<!-- logo -->

<div class="<?= $headerClasses; ?> col-md-12 col-sm-12 p-4">

    <h1><img src="assets/img/icon.png" alt=""/> <img src="assets/img/logo.png" alt="Resources"/> Helper <?php require_once "loadingDiv.php" ?></h1>
    <hr class="mb-3">
    <p class="text-muted small">your go-to calculator for Resources mobile GPS real-time economy simulation</p>

</div>
