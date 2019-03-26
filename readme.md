## Project Setup

`git clone https://github.com/ljosberinn/resources-helper/tree/rhelper4`

`cd rhelper4`

`composer install && npm install && cd public && composer install && cd .. && cd composer run analysis && npm run start`

## Deployment

Run `npm run build` to deploy to `build`. Change `src/developmentSettings` => `isLive` to true and adjust paths.

## Local development

Run whatever PHP you have locally under `localhost/rhelper4` or adjust `src/developmentSettings.ts` accordingly.

## Git Hooks

Pre-Commit

`#!/bin/sh`

`composer run analysis`

# Spec

### General

- better/easier internationalization (supporting at least JP | FR | EN | RU | CZ | DE | CN | SP)
- better SEO via proper routing
- ideally making [r.jakumo.org](http://r.jakumo.org) obsolete
- reducing load time by at least 90%
- _maybe_ CI via Jenkins

### API connection _/api_

- integration of all possible API queries as described on [the docs](https://resources-game.ch/resapi/)
- fallbacks in case the API is not responding (UX/UI improvement)

### Mines _/mines_

- income per mine type
- cost of new mines per type
- ROI at 100% / 505% / 505% + HQ level
- building habits per hour (graph) in comparison to everyone else
- mine income progress (graph)
- mine type distribution in comparison to mine income by type

### Factories _/factories_

- workload calculator
- turnover
- turnover increase per upgrade
- upgrade cost
- ROI
- dependencies
- output
- factory upgrade progress (graph)
- upgrade cost to level X

### Giant Diamond Calculator _/gd_

- requirements
- output
- efficiency
- profit

### Material Flow _/flow_

- distribution
- surplus per hour per resource/product
- actual income per hour

### Warehouses _/wh_

- content worth
- calculator from level X to level Y
- calculator from level X to contingency Y
- current warehouse level worth

### Special Buildings _/buildings_

- requirements per building level
- total building progress (graph)
- requirements from level X to Y

### Recycling _/recycling_

- requirements, output, profit

### Units _/units_

- requirements, strength, profit

### Tech-Upgrades _/tu_

- remaining required Tech upgrades to highest possible boost
- cheapest combinations (optionally including TU4)

### Headquarter _/hq_

- personal progress calculator
- total headquarter progress (graph)
- general requirements

### Missions _/missions_

- Goal, availability, duration, reward, profit, progress, penalty

### Trade Log _/trade_

- TBA

### Attack Log _/attack_

- TBA

### Defense Log _/defense_

- TBA

### Maps _/maps_

- personal mine map
- global mine map, based on locally cached JSONs

### Price History _/prices_

- CSV, XML and JSON export of last 28|all days

### Quality Comparator _/quality_

- income comparison of scanned resource % to other resources

### Leaderboard _/leaderboard_

- TBA

### Changelog _/changelog_

### Discord _/discord_
