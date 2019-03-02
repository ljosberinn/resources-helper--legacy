## Project Setup

`git clone https://github.com/ljosberinn/resources-helper/tree/rhelper4`

`cd rhelper4`

`composer install && npm install && cd public && composer install && cd .. && cd composer run analysis`

## Deployment

Run `npm run build` to deploy to `build`. Change `src/developmentSettings` => `isLive` to true and adjust paths.

## Local development

Run whatever PHP you have locally under `localhost/rhelper4` or adjust `src/developmentSettings.ts` accordingly.

## Git Hooks

Pre-Commit

`#!/bin/sh`

`composer run analysis`
