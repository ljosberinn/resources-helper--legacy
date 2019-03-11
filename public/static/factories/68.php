<?php

return [
    'id'                 => 68,
    'scaling'            => 120,
    'level'              => 0,
    'dependantFactories' => [
        69, // Electronics factory
    ],
    'dependencies'       => [
        ['id' => 1, 'amount' => 120 / 2 * 49500,],
        ['id' => 53, 'amount' => 1200,],
        ['id' => 2, 'amount' => 60,],
        ['id' => 38, 'amount' => 300,],
    ],
];
