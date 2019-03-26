<?php

return [
    'id'                     => 69,
    'scaling'                => 480,
    'level'                  => 0,
    'dependantFactories'     => [
        76, // Medical technology Inc.
        118, // Drone shipyard
    ],
    'productionDependencies' => [
        ['id' => 1, 'amount' => 480 / 8 * 5000,],
        ['id' => 58, 'amount' => 240,],
        ['id' => 36, 'amount' => 180,],
        ['id' => 67, 'amount' => 60,],
    ],
];
