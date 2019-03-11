<?php

return [
    'id'                 => 91,
    'scaling'            => 750,
    'level'              => 0,
    'dependantFactories' => [
        95, // Battery factory
    ],
    'dependencies'       => [
        ['id' => 1, 'amount' => 750 / 5 * 5000,],
        ['id' => 90, 'amount' => 17250,],
    ],
];
