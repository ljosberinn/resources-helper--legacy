<?php

return [
    'id'                     => 25,
    'scaling'                => 800,
    'level'                  => 0,
    'dependantFactories'     => [],
    'productionDependencies' => [
        ['id' => 1, 'amount' => 800 / 2 * 10],
        ['id' => 2, 'amount' => 1200],
    ],
];
