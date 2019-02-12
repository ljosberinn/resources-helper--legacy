<?php

class UserIndex {


    public function getPlayerIDByName(string $name): int {
        $singleton = Singleton::getInstance();
        $pdo       = $singleton->getConnection();

        $stmt = $pdo->prepare('SELECT `id` FROM `userIndex`  WHERE `name` = :name');
        $stmt->execute(['name' => $name]);

        if($stmt->rowCount() > 0) {
            return (int) $stmt->fetch()['id'];
        }

        return 0;
    }

    public function addPlayer(string $name, $lastSeen = 0): int {
        $singleton = Singleton::getInstance();
        $pdo       = $singleton->getConnection();

        $stmt = $pdo->prepare('INSERT INTO `userIndex` (`name`, `lastSeen`) VALUES(:name, :lastSeen)');
        $stmt->execute([
            'name'     => $name,
            'lastSeen' => $lastSeen > 0 ? $lastSeen : time(),
        ]);

        return $pdo->lastInsertId();
    }
}
