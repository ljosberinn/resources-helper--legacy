<?php

return [
    'id'                 => 37,
    'scaling'            => 270,
    'level'              => 0,
    'dependantFactories' => [
        29, // Insecticides
        69, // Electronics
    ],
    'dependencies'       => [
        ['id' => 1, 'amount' => 270 / 3 * 2500,],
        ['id' => 26, 'amount' => 810,],
    ],
];
