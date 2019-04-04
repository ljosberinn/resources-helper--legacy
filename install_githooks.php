<?php

const GIT_PATH        = './.git';
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

if($zipArchive->open(ZIP) && $zipArchive->extractTo(getcwd()) && $zipArchive->close()) {

    $unzippedFolderName = str_replace('.', '', substr(ZIP, 0, -4));

    $installedHooks = 1;

    foreach(HOOKS as $index => $hook) {
        $currentHookPath = implode('/', [$unzippedFolderName, $hook]);
        $nextHookPath    = implode('/', [GIT_PATH, 'hooks', $hook]);

        if(!rename('./' . $currentHookPath, $nextHookPath)) {
            notify('Hook ' . $hook . ' could not be moved, aborting');
            die;
        }

        notify($index . ' - Hook ' . $hook . ' installed.');
        ++$installedHooks;
    }

    notify($installedHooks . ' Hooks successfully installed, cleaning up...');

    if(!unlink(ZIP)) {
        notify('Could not remove the zip, please do so manually');
        die;
    }

    if(!unlink('install_githooks.php')) {
        notify('Could not remove this file, please do so manually');
        die;
    }

    if(!rmdir($unzippedFolderName)) {
        notify('Could not remove folder `' . $unzippedFolderName . '`, please do so manually');
        die;
    }

    notify("Cleaned up, you're good to go.");

    if(!empty(FINISHERS)) {
        notify("Please run these to install dependencies:\r\n\r\n" . implode(' && ', FINISHERS));
    }
    die;
}

notify('An error occured during unzipping. Please try manually.');

function notify(string $words): void {
    echo "\r\n" . $words . "\r\n";
}
