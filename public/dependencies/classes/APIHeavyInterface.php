<?php declare(strict_types=1);

interface APIHeavyInterface {

    public function __construct(PDO $pdo, int $playerIndexUID);

    public function transform(string $fileName): string;

    public function save(string $fileName): bool;
}
