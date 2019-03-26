<?php

return [
    'id'                     => 95,
    'scaling'                => 600,
    'level'                  => 0,
    'dependantFactories'     => [
        101, // Arms factory
        118, // Drone shipyard
        125, // Truck plant
    ],
    'productionDependencies' => [
        ['id' => 1, 'amount' => 600 / 10 * 75000,],
        ['id' => 92, 'amount' => 1200,],
        ['id' => 58, 'amount' => 2400,],
        ['id' => 32, 'amount' => 600,],
    ],
];
