<?php

const GIT_PATH        = '.git';
const ZIP             = '.githooks.zip';
const REPOSITORY_LINK = 'https://github.com/ljosberinn/resources-helper';
const HOOKS           = ['post-merge', 'pre-commit'];
const FINISHERS       = ['composer install', 'npm install', 'cd public', 'composer install'];

if(!is_file(ZIP)) {
    notify('`' . ZIP . "` missing! Please reclone the repository:\r\n    git clone " . REPOSITORY_LINK . "\r\n");
    die;
}

if(!is_dir(GIT_PATH)) {
    notify('`' . GIT_PATH . "` missing! Please reclone the repository:\r\n    git clone " . REPOSITORY_LINK . "\r\n");
    die;
}

foreach(HOOKS as $hook) {
    $hook = implode('/', [GIT_PATH, 'hooks', $hook]);

    if(is_file($hook)) {
        notify('A hook named ' . $hook . ' was already found, aborting.');
        die;
    }
}

$zipArchive = new ZipArchive();

if(!$zipArchive->open(ZIP) || !$zipArchive->extractTo(getcwd()) || !$zipArchive->close()) {
    notify('An error occured during unzipping. Please try manually.');
    die;
}

$unzippedFolderName = '';

if(PHP_OS !== 'WINNT') {
    $unzippedFolderName = substr(ZIP, 0, -4);
    $unzippedFolderName = str_replace('.', '', $unzippedFolderName);
}

$installedHooks = 0;

foreach(HOOKS as $index => $hook) {
    $currentHookPath = implode('\\', [__DIR__, $unzippedFolderName, $hook]);
    $nextHookPath    = implode('\\', [__DIR__, GIT_PATH, 'hooks', $hook]);

    if(!rename($currentHookPath, $nextHookPath)) {
        notify('Hook ' . $hook . ' could not be moved, aborting.');
        die;
    }

    ++$installedHooks;
    notify(($index + 1) . ' - Hook ' . $hook . ' installed.');
}

notify($installedHooks . ' Hooks successfully installed, cleaning up...');

if(PHP_OS !== 'WINNT' && !rmdir($unzippedFolderName)) {
    notify('Could not remove folder `' . $unzippedFolderName . '`, please do so manually');
    die;
}

if(!empty(FINISHERS)) {
    notify("Please run the following command as final step:\r\n\r\n" . implode(' && ', FINISHERS));
}

function notify(string $words): void {
    echo "\r\n" . $words . "\r\n";
}
