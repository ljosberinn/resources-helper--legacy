<?php

interface APIInterface {

    public function __construct(PDO $pdo, int $playerIndexUID);

    public function transform(array $data): bool;
}
