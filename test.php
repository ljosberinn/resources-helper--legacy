<?php

$test = time('now');

$beginOfDay = strtotime("midnight", $test);


echo $beginOfDay;

?>