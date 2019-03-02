<?php declare(strict_types=1);

interface APIInterface {

    public function __construct(PDO $pdo, int $playerIndexUID);

    public function transform(array $data): array;

    public function save(array $data): bool;
}
