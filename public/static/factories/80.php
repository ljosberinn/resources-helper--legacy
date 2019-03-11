<?php

return [
    'id'                 => 80,
    'scaling'            => 240,
    'level'              => 0,
    'dependantFactories' => [
        85, // Goldsmith
    ],
    'dependencies'       => [
        ['id' => 1, 'amount' => 240 / 3 * 20000,],
        ['id' => 14, 'amount' => 1600,],
    ],
];
