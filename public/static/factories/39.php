<?php

return [
    'id'                 => 39,
    'scaling'            => 640,
    'level'              => 0,
    'dependantFactories' => [
        61, // Glazier's Workshop
        68, // Silicon refinery
    ],
    'dependencies'       => [
        ['id' => 1, 'amount' => 640 / 4 * 150,],
        ['id' => 10, 'amount' => 640,],
    ],
];
