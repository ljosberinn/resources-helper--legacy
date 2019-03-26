<?php

return [
    'id'                     => 34,
    'scaling'                => 3000,
    'level'                  => 0,
    'dependantFactories'     => [
        85, // Goldsmith
    ],
    'productionDependencies' => [
        ['id' => 1, 'amount' => 3000 / 50 * 10000,],
        ['id' => 15, 'amount' => 480,],
    ],
];
