<?php

return [
    'id'                     => 52,
    'scaling'                => 320,
    'level'                  => 0,
    'dependantFactories'     => [
        76, // Medical technology Inc.
        118, // Drone shipyard
    ],
    'productionDependencies' => [
        ['id' => 1, 'amount' => 320 / 4 * 10000,],
        ['id' => 49, 'amount' => 640,],
    ],
];
