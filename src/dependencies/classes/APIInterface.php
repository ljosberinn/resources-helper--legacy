<?php

interface APIInterface {

    public function transform(PDO $pdo, array $data, int $playerIndexUID): bool;

    #public function save(array $data):bool;
}
