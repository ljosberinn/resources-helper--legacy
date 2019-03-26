<?php

return [
    'id'                     => 63,
    'scaling'                => 1800,
    'level'                  => 0,
    'dependantFactories'     => [
        95, // Battery factory
        69, // Electronics factory
        76, // Medical technology Inc.
    ],
    'productionDependencies' => [
        ['id' => 1, 'amount' => 1800 / 10 * 400,],
        ['id' => 10, 'amount' => 180,],
    ],
];
