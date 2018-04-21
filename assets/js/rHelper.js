const rHelper = {
    init: {
        user() {
            "use strict";

            rHelper.methods.INSRT_userSettings();
            rHelper.init.core();
        },
        core() {
            "use strict";

            rHelper.methods.SET_tabSwitcherAnchorBased();
            rHelper.methods.SET_transportCost("init");

            $.each(rHelper.data.material, materialId => {
                // eventListeners
                rHelper.methods.EVNT_materialInput(materialId);
                // general material data insertion
                rHelper.methods.INSRT_materialData(materialId);
                // warehouses
                rHelper.methods.INSRT_warehouseData(materialId, "material");
                // price history
                rHelper.methods.INSRT_priceHistoryName("material", materialId);
            });

            rHelper.methods.INSRT_totalMineWorth(rHelper.methods.CALC_totalMineWorth());
            rHelper.methods.INSRT_totalMineCount(rHelper.methods.CALC_totalMineCount());

            let calculationOrder = rHelper.methods.GET_calculationOrder();

            $.each(calculationOrder, (index, factoryId) => {
                // eventListeners
                rHelper.methods.EVNT_factoryInput(factoryId);
                // general factory data insertion
                rHelper.methods.INSRT_factoryDiamondData(factoryId, "product");
                // warehouses
                rHelper.methods.INSRT_warehouseData(factoryId, "products");
                // price history
                rHelper.methods.INSRT_priceHistoryName("products", factoryId);
            });

            // loot
            $.each(rHelper.data.loot, index => {
                // warehouses
                rHelper.methods.INSRT_warehouseData(index, "loot");
                // price history
                rHelper.methods.INSRT_priceHistoryName("loot", index);
                // recycling table
                if (index == 4 || (index >= 10 && index <= 13)) {
                    return;
                }
                rHelper.methods.SET_recyclingProfitObj(index);
                rHelper.methods.INSRT_recycling(index);
            });

            let unitsFns = ["SET_UnitProfitObj", "INSRT_unitsCraftingPrice", "INSRT_unitsMarketPrice", "INSRT_unitsPricePerStrength"];

            $.each(rHelper.data.units, index => {
                // warehouses
                rHelper.methods.INSRT_warehouseData(index, "units");
                // units table
                $.each(unitsFns, (i, fn) => {
                    rHelper.methods[fn](index);
                });

                rHelper.methods.INSRT_unitsRecyclingProfit("units", index);
                // price history
                rHelper.methods.INSRT_priceHistoryName("units", index);
            });

            // buildings
            let buildingFns = ["INSRT_buildingName", "SET_buildingBackgroundColor", "INSRT_buildingData", "INSRT_buildingToLevel10", "EVNT_buildingChange"];
            $.each(rHelper.data.buildings, buildingId => {
                $.each(buildingFns, (i, fn) => {
                    rHelper.methods[fn](buildingId);
                });
            });

            let hqFns = [
                "INSRT_headquarterOvwString",
                "INSRT_headquarterOvwRadius",
                "INSRT_headquarterOvwCost",
                "INSRT_headquarterOvwBoost",
                "INSRT_headquarterOvwTransportation",
                "EVNT_switchHeadquarter"
            ];

            // headquarter
            $.each(rHelper.data.headquarter, headquarterLevel => {
                $.each(hqFns, (i, fn) => {
                    rHelper.methods[fn](headquarterLevel);
                });
            });

            // initiate graphs
            let pieGraphs = ["material"];

            $.each(pieGraphs, (i, val) => {
                rHelper.methods.EVNT_buildGraph(val);
            });

            let gaugeGraphs = ["buildings", "headquarter"];
            $.each(gaugeGraphs, (i, val) => {
                rHelper.methods.INSRT_gaugeGraph(val);
            });

            let nonParamBoundMethods = [
                // mines
                "INSRT_materialMineAmortisation",
                "INSRT_materialHighlightMinePerfectIncome",
                // factories
                "INSRT_totalFactoryUpgrades",
                "INSRT_factoryHighlightColumns",
                "INSRT_diamondTop10Profit",
                "INSRT_diamondTotalProfit",
                "INSRT_flowDistributionGlobal",
                // warehouse
                "INSRT_warehouseTotalLevel",
                "INSRT_warehouseTotalWorth",
                // graphs
                "EVNT_priceHistoryOnChange",
                // headquarter
                "SET_hqLevel",
                "EVNT_headquarterInput",
                // missions
                "INSRT_missions",
                // techupgrades
                "INSRT_techUpgradeRows",
                "EVNT_attackLogTrigger",
                "INSRT_companyWorth",
                "EVNT_sortableTables",
                "EVNT_assignTitleToIcons",
                "EVNT_enableTippy"
            ];

            $.each(nonParamBoundMethods, (i, fn) => {
                rHelper.methods[fn]();
            });
        }
    },
    methods: {
        GET_calculationOrder() {
            "use strict";

            return [
                0,
                1,
                2,
                3,
                4,
                7,
                8,
                9,
                10,
                15,
                17,
                18, // primary order - dependant on material
                5,
                6,
                13,
                19, // secondary order - dependant on materials and products
                11,
                12,
                14,
                16,
                20,
                21 // tertiary order - dependant on products
            ];
        },
        API_toggleLoadSuccessorHelper(target) {
            "use strict";

            let fns = ["API_toggleLoader", "API_toggleSuccessor", "API_toggleSuccessorHelper"];

            $.each(fns, (i, fn) => {
                rHelper.methods[fn](target);
            });
        },
        API_toggleLoader(selector) {
            "use strict";

            let el = $(`#api-${selector}-loading`);

            if (el.css("display") == "none") {
                el.fadeIn("fast").css("display", "flex");
            } else {
                el.fadeOut("fast");
            }
        },
        API_toggleSuccessor(selector) {
            "use strict";

            let el = $(`#api-${selector}-finished`);

            if (el.css("display") == "none") {
                el.fadeIn("fast");
            } else {
                el.fadeOut("fast");
            }
        },
        API_toggleSuccessorHelper(selector) {
            "use strict";

            setTimeout(() => {
                rHelper.methods.API_toggleSuccessor(selector);
            }, 15000);
        },
        API_getFactories(key) {
            "use strict";

            rHelper.methods.API_toggleLoader("factories");

            $.get(`api/core.php?query=1&key=${key}`, data => {
                $.each(data, (i, value) => {
                    rHelper.data.products[i].factoryLevel = value;
                });

                let calculationOrder = rHelper.methods.GET_calculationOrder();

                $.each(calculationOrder, (index, factoryId) => {
                    rHelper.methods.INSRT_factoryDiamondData(factoryId, "product");
                });

                rHelper.methods.INSRT_totalFactoryUpgrades();
                rHelper.methods.INSRT_factoryHighlightColumns();
                rHelper.methods.INSRT_diamondTop10Profit();
                rHelper.methods.INSRT_diamondTotalProfit();
                rHelper.methods.INSRT_flowDistributionGlobal();
                rHelper.methods.API_toggleLoadSuccessorHelper("factories");

                sorttable.innerSortFunction.apply($("#module-diamond th")[4], []);
                sorttable.innerSortFunction.apply($("#module-diamond th")[5], []);
                rHelper.methods.SET_save();
            });
        },
        API_getWarehouse(key) {
            "use strict";

            rHelper.methods.API_toggleLoader("warehouse");

            $.getJSON(`api/core.php?query=2&key=${key}`, data => {
                $.each(data, function(i, warehouseInfo) {
                    let iterator = i;
                    let targetObj = "material";

                    if (i >= 14 && i < 36) {
                        iterator -= 14;
                        targetObj = "products";
                    } else if (i >= 36 && i < 52) {
                        iterator -= 36;
                        targetObj = "loot";
                    } else if (i >= 52) {
                        iterator -= 52;
                        targetObj = "units";
                    }

                    let contingent = Math.pow(warehouseInfo.level, 2) * 5000;
                    let fillStatus = warehouseInfo.amount / contingent;
                    if (isNaN(fillStatus)) {
                        fillStatus = 0;
                    }

                    rHelper.data[targetObj][iterator].warehouse.level = warehouseInfo.level;
                    rHelper.data[targetObj][iterator].warehouse.fillAmount = warehouseInfo.amount;
                    rHelper.data[targetObj][iterator].warehouse.contingent = contingent;
                    rHelper.data[targetObj][iterator].warehouse.fillStatus = fillStatus;

                    rHelper.methods.SET_save();
                });

                $.each(rHelper.data.material, materialId => {
                    rHelper.methods.INSRT_warehouseData(materialId, "material");
                });

                let calculationOrder = rHelper.methods.GET_calculationOrder();

                $.each(calculationOrder, index => {
                    rHelper.methods.INSRT_warehouseData(index, "products");
                });

                $.each(rHelper.data.loot, index => {
                    rHelper.methods.INSRT_warehouseData(index, "loot");
                });

                $.each(rHelper.data.units, index => {
                    rHelper.methods.INSRT_warehouseData(index, "units");
                });

                rHelper.methods.INSRT_warehouseTotalLevel();
                rHelper.methods.INSRT_warehouseTotalWorth();
                rHelper.methods.API_toggleLoadSuccessorHelper("warehouse");
            });
        },
        API_getMineSummary(key) {
            rHelper.methods.API_toggleLoader("mines-summary");
            $.get(`api/core.php?query=51&key=${key}`, data => {
                $.each(data, (i, obj) => {
                    rHelper.data.material[i].perHour = obj.perHour;
                    rHelper.data.material[i].amountOfMines = obj.amountOfMines;
                });

                $.each(rHelper.data.material, materialId => {
                    rHelper.methods.INSRT_materialData(materialId, "api");
                });

                rHelper.methods.INSRT_totalMineWorth(rHelper.methods.CALC_totalMineWorth());
                rHelper.methods.INSRT_totalMineCount(rHelper.methods.CALC_totalMineCount());
                rHelper.methods.INSRT_materialMineAmortisation();
                rHelper.methods.INSRT_materialHighlightMinePerfectIncome();
                rHelper.methods.EVNT_buildGraph("material");
                rHelper.methods.INSRT_flowDistributionGlobal();
                rHelper.methods.API_toggleLoadSuccessorHelper("mines-summary");

                rHelper.methods.SET_save();
            });
        },
        API_getMineMap() {
            "use strict";

            $.getJSON("api/core.php?mineMap", data => {
                rHelper.data.mineMap = data;
                rHelper.methods.API_toggleLoadSuccessorHelper("mines-detailed");
                rHelper.methods.EVNT_mapCreation("personal");
                rHelper.methods.SET_overTimeGraph();
            });
        },
        API_getMineMapInitiator(key) {
            "use strict";

            rHelper.methods.API_toggleLoader("mines-detailed");
            $.getJSON(`api/core.php?query=5&key=${key}`, data => {
                if (data.callback == "rHelper.methods.API_getMineMap()") {
                    rHelper.methods.API_getMineMap();
                } else {
                    swal("Error", "Couldn't fetch mine details - API potentially unavailable!", "error");
                }
            });
        },
        API_getPlayerInfo(key, anonymity) {
            "use strict";

            rHelper.methods.API_toggleLoader("player");
            let url = `api/core.php?query=7&key=${key}`;
            if (anonymity) {
                url += "&anonymity=true";
            }
            $.getJSON(url, data => {
                rHelper.data.userInformation.level = data.lvl;
                rHelper.data.userInformation.points = data.points;
                rHelper.data.userInformation.rank = data.worldrank;
                if (data.name) {
                    rHelper.data.userInformation.name = data.name;
                }

                rHelper.data.userInformation.registeredGame = rHelper.methods.CALC_convertDateToIso(data.registerdate);
                rHelper.methods.API_toggleLoadSuccessorHelper("player");
            });
        },
        API_getAttackLog(type, target, skipCount) {
            "use strict";

            if (typeof type == "undefined") {
                type = "attackSimple";
            }

            let url = `api/core.php?attackLog&type=${type}`;

            if (target) {
                url += `&target=${target}`;
            }

            if (skipCount) {
                url += `&skip=${skipCount}`;
            }

            $.getJSON(url, data => {
                rHelper.data.attackLog = data;
                rHelper.methods.API_toggleLoadSuccessorHelper("attack-log");

                rHelper.methods.INSRT_attackLog(type);
            });
        },
        API_getAttackLogInitiator(key) {
            "use strict";

            rHelper.methods.API_toggleLoader("attack-log");

            $.getJSON(`api/core.php?query=9&key=${key}`, data => {
                if (data.callback != 'rHelper.methods.API_getAttackLog("attackSimple")') {
                    swal("Error", "Couldn't fetch attack log - API potentially unavailable!", "error");
                } else {
                    rHelper.methods.API_toggleLoadSuccessorHelper("attack-log");
                }
            });
        },
        API_getTradeLog() {
            "use strict";

            $.getJSON("api/core.php?tradeLog", data => {
                rHelper.data.tradeLog = data;
                rHelper.methods.API_toggleLoadSuccessorHelper("trade-log");
            });
        },
        API_getTradeLogInitiator(key) {
            "use strict";

            rHelper.methods.API_toggleLoader("trade-log");

            $.getJSON(`api/core.php?query=6&key=${key}`, data => {
                if (data.callback == "rHelper.methods.API_getTradeLog()") {
                    rHelper.methods.API_getTradeLog();
                } else {
                    swal("Error", "Couldn't fetch trade log - API potentially unavailable!", "error");
                }
            });
        },
        API_getMissions() {
            "use strict";

            $.getJSON("api/core.php?missions", data => {
                rHelper.data.missions = data;
                rHelper.methods.API_toggleLoadSuccessorHelper("missions");
                rHelper.methods.INSRT_missions();
            });
        },
        API_getMissionsInitiator(key) {
            "use strict";

            rHelper.methods.API_toggleLoader("missions");
            $.getJSON(`api/core.php?query=10&key=${key}`, data => {
                if (data.callback == "rHelper.methods.API_getMissions()") {
                    rHelper.methods.API_getMissions();
                }
            });
        },
        API_getBuildings(key) {
            "use strict";

            rHelper.methods.API_toggleLoader("buildings");

            $.getJSON(`api/core.php?query=3&key=${key}`, data => {
                let fns = ["INSRT_buildingName", "SET_buildingBackgroundColor", "INSRT_buildingData", "INSRT_buildingToLevel10"];

                $.each(data, (i, buildingLevel) => {
                    rHelper.data.buildings[i].level = buildingLevel;

                    $.each(fns, (k, fn) => {
                        rHelper.methods[fn](i);
                    });
                });

                rHelper.methods.INSRT_gaugeGraph("buildings");
                rHelper.methods.API_toggleLoadSuccessorHelper("buildings");

                rHelper.methods.SET_save();
            });
        },
        API_getHeadquarter(key) {
            "use strict";

            rHelper.methods.API_toggleLoader("headquarter");

            $.getJSON(`api/core.php?query=4&key=${key}`, data => {
                rHelper.data.headquarter.user = rHelper.data.headquarter.user || {
                    hqPosition: {
                        lon: 0,
                        lat: 0
                    },
                    level: 0,
                    paid: [0, 0, 0, 0]
                };

                rHelper.data.headquarter.user.hqPosition.lat = data.lat;
                rHelper.data.headquarter.user.hqPosition.lon = data.lon;
                rHelper.data.headquarter.user.level = data.level;

                $.each(data.paid, (i, paid) => {
                    rHelper.data.headquarter.user.paid[i] = paid;
                });

                rHelper.methods.INSRT_gaugeGraph("headquarter");
                rHelper.methods.SET_hqLevel();
                rHelper.methods.API_toggleLoadSuccessorHelper("headquarter");

                rHelper.methods.SET_save();
            });
        },
        API_getCreditInformation(key) {
            "use strict";

            $("#api-credits").html(
                '<span id="api-credits-loading" class="circles-to-rhombuses-spinner"><span class="rhombuses-circle"></span><span class="rhombuses-circle"></span><span class="rhombuses-circle"></span></span>'
            );
            $("#api-credits-loading").css("display", "flex");

            $.get(`api/core.php?query=0&key=${key}`, data => {
                let remainingCredits = parseInt(data[0].creditsleft);
                rHelper.data.userInformation.remainingCredits = remainingCredits;
                rHelper.methods.INSRT_API_remainingCredits(remainingCredits);

                $("#api-submit").attr("disabled", false);
                $("#api-credits-loading").css("display", "none");
            });
        },
        API_init(key, queries, anonymity) {
            "use strict";

            if ($.isArray(queries)) {
                $.each(queries, (i, query) => {
                    switch (query) {
                        case 1:
                            rHelper.methods.API_getFactories(key); // STABLE
                            break;
                        case 2:
                            rHelper.methods.API_getWarehouse(key); // STABLE
                            break;
                        case 3:
                            rHelper.methods.API_getBuildings(key); // STABLE
                            break;
                        case 4:
                            rHelper.methods.API_getHeadquarter(key); // STABLE
                            break;
                        case 5:
                            rHelper.methods.API_getMineMapInitiator(key); // STABLE
                            break;
                        case 51:
                            rHelper.methods.API_getMineSummary(key); // STABLE
                            break;
                        case 6:
                            rHelper.methods.API_getTradeLogInitiator(key); // STABLE
                            break;
                        case 7:
                            rHelper.methods.API_getPlayerInfo(key, anonymity); // STABLE
                            break;
                        case 9:
                            rHelper.methods.API_getAttackLogInitiator(key); // STABLE
                            break;
                        case 10:
                            rHelper.methods.API_getMissionsInitiator(key); // STABLE
                            break;
                        default:
                            rHelper.methods.API_getCreditInformation(key); // STABLE
                            break;
                    }
                });
            }
        },
        API_getWorldMap(type) {
            "use strict";

            $.getJSON(`api/core.php?worldMap=${type}`, data => {
                rHelper.data.worldMap = rHelper.data.worldMap || {};
                rHelper.data.worldMap = data;
                rHelper.methods.EVNT_mapCreation("world");
            });
        },

        SET_globalObject(selector, index, key, value) {
            "use strict";

            if ($.isArray(key)) {
                rHelper.data[selector][index][key[0]][key[1]] = value;
            } else {
                rHelper.data[selector][index][key] = value;
            }

            rHelper.methods.SET_save();
        },
        SET_save() {
            "use strict";

            if(getCookie("loggedIn") != 1) {
                localStorage.setItem("rGame", JSON.stringify(rHelper.data));
            }
        },
        SET_tabSwitcherAnchorBased() {
            "use strict";

            let anchor = `#${window.location.hash.substr(1)}`;
            if (anchor == "#") {
                if (getCookie("loggedIn") != 1) {
                    anchor = "#registrationlogin";
                } else {
                    anchor = "#factories";
                }
            }

            if(anchor == "#leaderboard") {
                rHelper.methods.INSRT_leaderboard();
            }

            $(".nav-link").each((i, navLink) => {
                let navEl = $(navLink);
                let target = $(`#${navLink.dataset.target}`);
                if (navEl.attr("href") == anchor) {
                    target.css("display", "block");
                    navEl.addClass("active");
                } else {
                    target.css("display", "none");
                    navEl.removeClass("active");
                }
            });
        },
        SET_transportCost(init) {
            "use strict";

            rHelper.data.buildings[9].transportCost = 1 + (15 - rHelper.data.buildings[9].level) / 100;

            if (!init) {
                $.each(rHelper.data.buildings, buildingId => {
                    let fns = ["SET_buildingBackgroundColor", "INSRT_buildingData", "INSRT_buildingToLevel10"];

                    $.each(fns, (i, fn) => {
                        rHelper.methods[fn](buildingId);
                    });
                });
                let calculationOrder = rHelper.methods.GET_calculationOrder();
                $.each(calculationOrder, (index, factoryId) => {
                    let fns = ["INSRT_factoryUpgradeCost", "INSRT_factoryROI"];

                    $.each(fns, (i, fn) => {
                        rHelper.methods[fn](factoryId);
                    });

                    rHelper.methods.INSRT_flowDistributionGlobal();
                });

                $.each(rHelper.data.headquarter, headquarterLevel => {
                    rHelper.methods.INSRT_headquarterOvwTransportation(headquarterLevel);
                });
            }
        },
        SET_buildingBackgroundColor(buildingId) {
            "use strict";

            let buildingLevel = rHelper.data.buildings[buildingId].level;

            let r = 255 - buildingLevel * 10;
            let g = 127 + buildingLevel * 7;
            let b = 80 - buildingLevel * 3;

            $(`#building-${buildingId}`).css("background-color", `rgba(${r},${g},${b}, 0.25)`);
        },
        SET_buildingTableVisibility(buildingId, state) {
            "use strict";

            let tbody = $(`#building-${buildingId} tbody`);
            let tfoot = $(`#building-${buildingId} tfoot`);

            $.each([tbody, tfoot], (i, el) => {
                switch (state) {
                    case "show":
                        if (el.css("display") == "none") {
                            el.css("display", "table-row-group");
                        }
                        break;
                    case "hide":
                        if (el.css("display") != "none") {
                            el.css("display", "none");
                        }
                        break;
                }
            });
        },
        SET_recyclingProfitObj(lootId) {
            "use strict";

            rHelper.data.loot[lootId].profit = {
                outputWorth: 0,
                inputWorth: 0,
                profit: 0
            };
        },
        SET_recyclingPlantLevel() {
            "use strict";

            $.each(rHelper.data.loot, lootId => {
                if (lootId == 4 || (lootId >= 10 && lootId <= 13)) {
                    return;
                }

                let fns = ["INSRT_recyclingProducts", "INSRT_recyclingOutputWorth", "INSRT_recyclingInputWorth"];

                $.each(fns, (i, fn) => {
                    rHelper.methods[fn](lootId);
                });

                rHelper.methods.INSRT_unitsRecyclingProfit("recycling", lootId);
            });
        },
        SET_UnitProfitObj(unitId) {
            "use strict";

            rHelper.data.units[unitId].profit = {
                craftingPrice: 0,
                marketPrice: 0,
                profit: 0
            };
        },
        SET_hqLevel() {
            "use strict";

            let headquarter = rHelper.data.headquarter;

            if (headquarter.user) {
                let userHqLevel = headquarter.user.level;
                rHelper.methods.SET_hqSelectorClass(userHqLevel - 1);
                rHelper.methods.INSRT_headquarterPaid();

                let fns = ["INSRT_headquarterContentRequiredAmount", "INSRT_headquarterMissing", "INSRT_headquarterRemainingCost"];

                $.each(fns, (i, fn) => {
                    rHelper.methods[fn](userHqLevel);
                });
            }
        },
        SET_hqSelectorClass(userHqLevel) {
            "use strict";

            for (let i = 0; i <= 9; i += 1) {
                if (userHqLevel != i) {
                    $(`.hq-thumb-${i}`).addClass("disabled-hq");
                } else {
                    $(`.hq-thumb-${i}`).removeClass("disabled-hq");
                }
            }
        },
        SET_newMap(container, zoom, type) {
            "use strict";

            return new google.maps.Map(container[0], {
                zoom: zoom,
                mapTypeId: type
            });
        },
        SET_mapOptions(map, maxZoom, primaryMine) {
            "use strict";

            map.setOptions({
                maxZoom: maxZoom,
                center: new google.maps.LatLng(primaryMine.lat, primaryMine.lon)
            });
            return map;
        },
        SET_mapImg(folder, icon, size) {
            "use strict";

            return {
                url: `assets/img/maps/${folder}/${icon}.png`,
                scaledSize: new google.maps.Size(size, size)
            };
        },
        SET_mapInfoWindow(contentString) {
            "use strict";

            return new google.maps.InfoWindow({
                content: contentString
            });
        },
        SET_mapFolderRelation(relation) {
            "use strict";

            let folder = "foe";
            if (relation == "friend") {
                folder = "friend";
            }

            return folder;
        },
        SET_mapHQHandler(map, hqObj) {
            "use strict";

            let hqLevel = hqObj.level;
            let radius = rHelper.data.headquarter[hqLevel - 1].radius;
            let center = {
                lat: hqObj.lat,
                lng: hqObj.lon
            };
            rHelper.methods.SET_mapHqCircle(map, center, radius, hqObj.relation);
            let hqSize = hqLevel * 12.5;
            new google.maps.Marker({
                map: map,
                position: center,
                icon: rHelper.methods.SET_mapImg("hq", hqLevel, hqSize)
            });
        },
        SET_mapHqCircle(map, hqCenter, radius, relation) {
            let color = "#FF0000";
            if (relation == "friend") {
                color = "#00FF00";
            }

            return new google.maps.Circle({
                strokeColor: color,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: color,
                fillOpacity: 0.35,
                map: map,
                center: hqCenter,
                radius: radius,
                draggable: true
            });
        },
        SET_mapMineHandler(now, subObj, map, mapType) {
            let type = subObj.type;
            let relObj = rHelper.data.material[type];
            let buildMilliseconds = rHelper.methods.CALC_toMilliseconds(subObj.builddate);
            let buildDate = rHelper.methods.CALC_convertDateToIso(buildMilliseconds);
            let age = (now - buildMilliseconds) / 1000 / 86400;
            let estRevenue = rHelper.methods.CALC_mineEstRevenue(subObj, type, age);
            let contentString = rHelper.methods.CALC_createMapContentString(relObj, buildDate, age, estRevenue, subObj);
            let infoWindow = rHelper.methods.SET_mapInfoWindow(contentString);
            let marker = new google.maps.Marker({
                map: map,
                position: {
                    lat: subObj.lat,
                    lng: subObj.lon
                },
                icon: rHelper.methods.SET_mapImg(rHelper.methods.SET_mapFolderRelation(subObj.relation), type, 20)
            });

            if (mapType == "personal") {
                if (subObj.builddate == rHelper.data.mineMap.mines[0].builddate) {
                    marker.setAnimation(google.maps.Animation.BOUNCE);
                }
            }
            google.maps.event.addListener(marker, "click", () => {
                if (openedWindow) {
                    openedWindow.close();
                }
                openedWindow = infoWindow;
                infoWindow.open(map, marker);
            });

            return marker;
        },
        SET_overTimeGraph() {
            "use strict";

            let data = rHelper.data.mineMap.mines;

            let timestamps = [];
            let mineCount = [];
            let avgMinePrice = [];
            let income = [];
            let hours = [];

            for (let hour = 0; hour <= 23; hour += 1) {
                hours.push([`${hour} to ${hour + 1}`, 0]);
            }

            $.each(data, (index, subObj) => {
                let buildHour = new Date(rHelper.methods.CALC_toMilliseconds(subObj.builddate)).getHours();
                hours[buildHour][1] += 1;
            });

            Highcharts.chart("graph-buildinghabits", {
                chart: {
                    type: "column",
                    backgroundColor: "transparent"
                },
                title: {
                    text: "Building habits per hour",
                    style: {
                        color: "#dedede"
                    }
                },
                xAxis: {
                    type: "category",
                    labels: {
                        rotation: -45,
                        style: {
                            fontSize: "13px",
                            fontFamily: "Verdana, sans-serif",
                            color: "#dedede"
                        }
                    }
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: "Amount of mines",
                        style: {
                            color: "#dedede"
                        }
                    },
                    labels: {
                        style: {
                            color: "#dedede"
                        }
                    }
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    pointFormat: "Mines built at this hour: <b>{point.y}</b>"
                },
                series: [
                    {
                        name: "Mines",
                        data: hours,
                        dataLabels: {
                            enabled: true,
                            rotation: -90,
                            color: "#dedede",
                            align: "right",
                            y: 10,
                            style: {
                                fontSize: "13px",
                                fontFamily: "Verdana, sans-serif",
                                color: "#dedede"
                            }
                        }
                    }
                ]
            });

            let firstMine = data[0].builddate;
            let lastMine = data[data.length - 1].builddate;
            let daysSinceFirstMine = (lastMine - firstMine) / 86400;

            timestamps.push(rHelper.methods.CALC_toMilliseconds(firstMine));

            for (let i = 0; i <= daysSinceFirstMine; i += 1) {
                let date = rHelper.methods.CALC_toMilliseconds(firstMine + 86400 * i);
                timestamps.push(date);
            }

            $.each(timestamps, (i, ts) => {
                let mineCountAtGivenTS = 0;
                let sum = 0;
                let totalIncomeAtGivenTS = 0;

                $.each(data, (index, subObj) => {
                    let builddate = rHelper.methods.CALC_toMilliseconds(subObj.builddate);

                    if (builddate <= ts) {
                        mineCountAtGivenTS += 1;
                        totalIncomeAtGivenTS += rHelper.methods.CALC_returnPriceViaId(subObj.type) * subObj.fullRate;
                    }
                });

                $.each(rHelper.data.material, k => {
                    sum += rHelper.methods.CALC_materialNewMinePrice(mineCountAtGivenTS, k);
                });

                income.push(Math.round(totalIncomeAtGivenTS));
                mineCount.push(mineCountAtGivenTS);
                avgMinePrice.push(Math.round(sum / 14));

                timestamps[i] = rHelper.methods.CALC_convertDateToIso(ts);
            });

            Highcharts.chart("graph-overtime", {
                chart: {
                    type: "spline",
                    zoomType: "x",
                    backgroundColor: "transparent"
                },
                title: {
                    useHTML: true,
                    text: "Progress graph",
                    style: {
                        color: "#dedede"
                    }
                },
                xAxis: {
                    categories: timestamps,
                    labels: {
                        style: {
                            color: "#dedede"
                        }
                    }
                },
                yAxis: {
                    title: {
                        text: "Price or mine count over time",
                        style: {
                            color: "#dedede"
                        }
                    },
                    labels: {
                        formatter: function() {
                            return this.value.toLocaleString("en-US");
                        },
                        style: {
                            color: "#dedede"
                        }
                    }
                },
                legend: {
                    enabled: true,
                    backgroundColor: "#dedede"
                },
                tooltip: {
                    crosshairs: true,
                    shared: true
                },
                plotOptions: {
                    spline: {
                        marker: {
                            radius: 4,
                            lineColor: "#666666",
                            lineWidth: 1
                        }
                    }
                },
                series: [
                    {
                        name: "Mine count",
                        marker: {
                            symbol: "square"
                        },
                        data: mineCount,
                        color: "orange"
                    },
                    {
                        name: "Average cost of a new mine",
                        marker: {
                            symbol: "diamond"
                        },
                        data: avgMinePrice,
                        color: "coral"
                    },
                    {
                        name: "Average income at given time",
                        marker: {
                            symbol: "triangle"
                        },
                        data: income,
                        color: "yellowgreen"
                    }
                ]
            });
        },

        EVNT_enableTippy() {
            "use strict";

            $.each($("[title]"), (i, el) => {
                if (!el._tippy) {
                    tippy(el, {
                        dynamicTitle: true
                    });
                }
            });
        },
        EVNT_assignTitleToIconsHelper(min, max, subSelector, incrementor) {
            "use strict";

            for (let i = min; i <= max; i += 1) {
                $.each($(`.resources-${subSelector}-${i}`), (k, el) => {
                    if (!$(el).attr("title")) {
                        let convertedId = i + incrementor;
                        $(el).attr("title", rHelper.methods.CALC_returnPriceViaId(convertedId).toLocaleString("en-US"));
                    }
                });
            }
        },
        EVNT_assignTitleToIcons() {
            "use strict";

            rHelper.methods.EVNT_assignTitleToIconsHelper(0, 13, "material", 0);
            rHelper.methods.EVNT_assignTitleToIconsHelper(0, 21, "product", 14);
            rHelper.methods.EVNT_assignTitleToIconsHelper(0, 16, "loot", 36);
            rHelper.methods.EVNT_assignTitleToIconsHelper(0, 5, "unit", 52);
        },
        EVNT_sortableTables() {
            "use strict";

            let tables = [
                $("#module-mines table")[0],
                $("#module-factories table")[0],
                $("#module-diamond table")[0],
                $("#techupgrades-combinations-tbl")[0],
                $("#recycling-tbl")[0],
                $("#units-tbl")[0]
            ];

            $.each(tables, (index, table) => {
                sorttable.makeSortable(table);

                if (index == 2) {
                    sorttable.innerSortFunction.apply($("#module-diamond th")[5], []);
                } else if (index == 4) {
                    // sorting twice for cheapest price first...
                    sorttable.innerSortFunction.apply($("#techupgrades-combinations-tbl th")[5], []);
                    sorttable.innerSortFunction.apply($("#techupgrades-combinations-tbl th")[5], []);
                }
            });
        },
        EVNT_factoryInput(factoryId) {
            "use strict";

            $(`#factories-level-${factoryId}`).on("input", function() {
                let factoryId = parseInt(this.id.replace("factories-level-", ""));
                let factoryLevel = parseInt(this.value);
                rHelper.methods.SET_globalObject("products", factoryId, "factoryLevel", factoryLevel);

                let fns = [
                    // factories tab
                    "INSRT_factoryOutput",
                    "INSRT_factoryUpgradeCost",
                    "INSRT_factoryDependencies",
                    "INSRT_factoryWorkload",
                    "INSRT_factoryTurnover",
                    "INSRT_factoryTurnoverPerUpgrade",
                    "INSRT_factoryROI",
                    // diamond tab
                    "INSRT_diamondFactoryLevel",
                    "INSRT_diamondFactoryOutput",
                    "INSRT_diamondFactoryOutputWarehouse",
                    "INSRT_diamondDependencies",
                    "INSRT_diamondEfficiency",
                    "INSRT_diamondProfit"
                ];

                $.each(fns, (i, fn) => {
                    rHelper.methods[fn](factoryId);
                });

                rHelper.methods.CALC_dependantFactories(factoryId, "product");
                rHelper.methods.INSRT_diamondTop10Profit();
                rHelper.methods.INSRT_diamondTotalProfit();
                rHelper.methods.INSRT_flowRate(factoryId, "product");
                rHelper.methods.INSRT_flowDistributionGlobal();
                rHelper.methods.INSRT_factoryHighlightColumns();
            });
        },
        EVNT_materialInput(materialId) {
            "use strict";

            $(`#material-rate-${materialId}`).on("input", function() {
                let materialId = this.id.replace("material-rate-", "");
                let materialAmount = parseInt(this.value);

                rHelper.methods.SET_globalObject("material", materialId, "perHour", materialAmount);
                rHelper.methods.INSRT_materialRateWorth(materialId);
                rHelper.methods.INSRT_totalMineWorth(rHelper.methods.CALC_totalMineWorth());
                rHelper.methods.CALC_dependantFactories(materialId, "material");
                rHelper.methods.INSRT_flowRate(materialId, "material");
                rHelper.methods.INSRT_flowDistributionGlobal();
                rHelper.methods.EVNT_buildGraph("material");
            });

            $(`#material-amount-of-mines-${materialId}`).on("input", function() {
                let materialId = this.id.replace("material-amount-of-mines-", "");
                let materialAmountOfMines = parseInt(this.value);

                rHelper.methods.SET_globalObject("material", materialId, "amountOfMines", materialAmountOfMines);

                $.each(rHelper.data.material, materialId => {
                    rHelper.methods.INSRT_materialNewMinePrice(materialId);
                });

                rHelper.methods.INSRT_warehouseRemainingTimeToFull(materialId, "material");
                rHelper.methods.INSRT_materialMineAmortisation();
                rHelper.methods.INSRT_totalMineCount(rHelper.methods.CALC_totalMineCount());
                rHelper.methods.EVNT_buildGraph("material");
            });
        },
        EVNT_warehouseInput(id, type) {
            "use strict";

            // on upgrade calculator input
            $(`#warehouse-${type}-calc-2-${id}`).on("input", function() {
                let value = parseInt(this.value);
                if (isNaN(value)) {
                    value = 0;
                }
                rHelper.methods.INSRT_warehouseUpgradeCost(id, type, value);
            });

            // reset upgrade cost on select swap
            $(`#warehouse-${type}-calc-1-${id}`).on("change", () => {
                $(`#warehouse-${type}-upgrade-cost-${id}`).empty();
                $(`#warehouse-${type}-calc-2-${id}`).val(0);
            });

            // on increase of current stock
            $(`#warehouse-${type}-stock-current-${id}`).on("input", function() {
                let value = parseInt(this.value);
                if (isNaN(value)) {
                    value = 0;
                }
                let newFillStatus = value / rHelper.data[type][id].warehouse.contingent;

                rHelper.methods.SET_globalObject(type, id, ["warehouse", "fillAmount"], value);
                rHelper.methods.SET_globalObject(type, id, ["warehouse", "fillStatus"], newFillStatus);

                let fns = ["INSRT_warehouseWorth", "INSRT_warehouseFillStatus", "INSRT_warehouseRemainingTimeToFull"];

                $.each(fns, (i, fn) => {
                    rHelper.methods[fn](id, type);
                });

                rHelper.methods.INSRT_warehouseTotalWorth();
            });
            // on increase of warehouse level
            $(`#warehouse-${type}-level-${id}`).on("input", function() {
                let value = parseInt(this.value);
                if (isNaN(value)) {
                    value = 0;
                }
                let el = rHelper.data[type][id].warehouse;

                rHelper.methods.SET_globalObject(type, id, ["warehouse", "level"], value);
                rHelper.methods.SET_globalObject(type, id, ["warehouse", "contingent"], rHelper.methods.CALC_warehouseContingent(value));
                rHelper.methods.SET_globalObject(type, id, ["warehouse", "fillStatus"], el.fillAmount / el.contingent);

                let fns = ["INSRT_warehouseCapacity", "INSRT_warehouseFillStatus", "INSRT_warehouseRemainingTimeToFull"];

                $.each(fns, (i, fn) => {
                    rHelper.methods[fn](id, type);
                });

                rHelper.methods.INSRT_warehouseTotalLevel();
            });
        },
        EVNT_buildingChange(buildingId) {
            "use strict";

            $(`#buildings-level-${buildingId}`).on("change", function() {
                let value = parseInt(this.value);

                rHelper.methods.SET_globalObject("buildings", buildingId, "level", value);

                if (buildingId == 9) {
                    rHelper.methods.SET_transportCost();
                } else if (buildingId == 5) {
                    rHelper.methods.SET_recyclingPlantLevel();
                }

                if (buildingId == 3 || buildingId == 4 || buildingId == 9) {
                    $.each(rHelper.data.units, unitId => {
                        rHelper.methods.INSRT_unitsPricePerStrength(unitId);
                    });
                }

                let fns = ["INSRT_buildingData", "INSRT_buildingToLevel10", "SET_buildingBackgroundColor"];

                $.each(fns, (i, fn) => {
                    rHelper.methods[fn](buildingId);
                });

                rHelper.methods.INSRT_gaugeGraph("buildings");
            });
        },
        EVNT_buildGraph(type) {
            "use strict";

            rHelper.graphs = rHelper.graphs || {};

            let parentGraphObj = rHelper.graphs.material;
            rHelper.graphs.material.reference.mineCount = rHelper.methods.CALC_totalMineCount();
            rHelper.graphs.material.reference.mineIncome = rHelper.methods.CALC_totalMineWorth();

            $.each(rHelper.data.material, (i, material) => {
                let iteration = {
                    y: 0,
                    color: "",
                    drilldown: {
                        categories: [],
                        data: [],
                        color: ""
                    }
                };

                let mineAmountPercent = parseFloat((material.amountOfMines / rHelper.graphs.material.reference.mineCount * 100).toFixed(2));
                let mineIncomePercent = parseFloat((rHelper.methods.CALC_materialRateWorth(i) / rHelper.graphs.material.reference.mineIncome * 100).toFixed(2));
                let materialName = material.name;

                if (!isNaN(mineAmountPercent)) {
                    iteration.y = mineAmountPercent;
                } else {
                    iteration.y = 0;
                }

                let mineDataObj = {
                    name: materialName,
                    y: iteration.y,
                    color: iteration.color
                };

                iteration.color = rHelper.graphs.material.colors[i];
                iteration.drilldown.color = rHelper.graphs.material.colors[i];
                iteration.drilldown.categories[i] = materialName;
                iteration.drilldown.name = materialName;

                if (!isNaN(mineIncomePercent)) {
                    iteration.drilldown.data[i] = mineIncomePercent;
                } else {
                    iteration.drilldown.data[i] = 0;
                }

                if (JSON.stringify(rHelper.graphs.material.mineData[i]) !== JSON.stringify(mineDataObj)) {
                    rHelper.graphs.material.mineData[i] = mineDataObj;
                }

                let drillDataLen = iteration.drilldown.data.length;
                let brightness = 0;

                for (let j = 0; j < drillDataLen; j += 1) {
                    brightness = 0.2 - j / drillDataLen / 5;
                    rHelper.graphs.material.incomeData[i] = {
                        name: iteration.drilldown.categories[j],
                        y: iteration.drilldown.data[j],
                        color: Highcharts.Color(iteration.color)
                            .brighten(brightness)
                            .get()
                    };
                }
                if (JSON.stringify(rHelper.graphs.material.data[i]) !== JSON.stringify(iteration)) {
                    rHelper.graphs.material.data[i] = iteration;
                }
            });

            rHelper.methods.INSRT_polygonGraph(parentGraphObj.target, parentGraphObj.titleText, parentGraphObj.seriesNames, parentGraphObj.responsiveId, type);
        },
        EVNT_switchHeadquarter(clickedHq) {
            "use strict";

            $(`.hq-thumb-${clickedHq}`).on("click", () => {
                let actualLevel = parseInt(clickedHq) + 1;

                rHelper.data.headquarter.user = rHelper.data.headquarter.user || {};
                rHelper.data.headquarter.user.paid = rHelper.data.headquarter.user.paid || [0, 0, 0, 0];
                rHelper.data.headquarter.user.level = rHelper.data.headquarter.user.level || actualLevel;

                rHelper.methods.SET_globalObject("headquarter", "user", "level", actualLevel);
                rHelper.methods.SET_hqSelectorClass(clickedHq);
                rHelper.methods.INSRT_gaugeGraph("headquarter");
                rHelper.methods.INSRT_headquarterContentRequiredAmount(actualLevel);
                rHelper.methods.INSRT_headquarterPaid();

                for (let i = 0; i <= 3; i += 1) {
                    rHelper.methods.INSRT_headquarterMissing(i);
                }

                rHelper.methods.INSRT_headquarterRemainingCost(actualLevel);
                rHelper.methods.INSRT_companyWorth();
            });
        },
        EVNT_headquarterInput() {
            "use strict";

            $.each($("[id*='hq-content-input-']"), (i, el) => {
                $(el).on("input", function() {
                    let thisId = parseInt(this.id.replace(/hq-content-input-/, ""));
                    let thisValue = parseInt(this.value);

                    if (isNaN(thisValue)) {
                        thisValue = 0;
                    } else if (thisValue > 50000000) {
                        thisValue = 50000000;
                    }

                    rHelper.methods.SET_globalObject("headquarter", "user", ["paid", thisId], thisValue);
                    rHelper.methods.INSRT_headquarterMissing(i);
                    rHelper.methods.INSRT_headquarterRemainingCost(rHelper.data.headquarter.user.level);
                    rHelper.methods.INSRT_gaugeGraph("headquarter");
                    rHelper.methods.INSRT_companyWorth();
                });
            });
        },
        EVNT_priceHistoryOnChange() {
            "use strict";

            $("#pricehistory-selector").on("change", function() {
                let thisVal = parseInt(this.value);
                let url = `api/getPriceHistory.php?id=${thisVal}`;
                let resource = rHelper.methods.CALC_convertId(thisVal);
                let materialName = `<span style="height: 25px; width: 25px;" class="${resource.icon}"></span> ${resource.name}`;

                rHelper.methods.EVNT_priceHistoryToggler("loading");

                $.getJSON(url, response => {
                    let averageKI = response.avg.ki;
                    let averagePlayer = response.avg.player;
                    let timestamps = [];
                    let player = [];
                    let ki = [];

                    $.each(response.data, (i, dataset) => {
                        let date = rHelper.methods.CALC_convertDateToIso(rHelper.methods.CALC_toMilliseconds(dataset.ts));
                        timestamps.push(date);

                        if (dataset.player == 0) {
                            dataset.player = null;
                        }
                        player.push(dataset.player);
                        ki.push(dataset.ki);
                    });

                    rHelper.methods.EVNT_priceHistoryToggler("finished");
                    rHelper.methods.INSRT_priceHistoryGraph(materialName, averageKI, averagePlayer, timestamps, player, ki);
                });
            });
        },
        EVNT_priceHistoryToggler(state) {
            "use strict";

            let container = $("#graph-pricehistory");
            let selector = $("#pricehistory-selector");
            switch (state) {
                case "loading":
                    let svg =
                        '<svg id="pricehistory-svg" xmlns="http://www.w3.org/2000/svg" style="background:0 0" preserveAspectRatio="xMidYMid" viewBox="0 0 100 100"><g transform="translate(50 50)"><g transform="matrix(.6 0 0 .6 -19 -19)"><g transform="rotate(242)"><animateTransform attributeName="transform" begin="0s" dur="3s" keyTimes="0;1" repeatCount="indefinite" type="rotate" values="0;360"/><path fill="#9acd32" d="M37.3496988-7h10V7h-10a38 38 0 0 1-1.50391082 5.61267157l8.66025404 5-7 12.12435565-8.66025404-5a38 38 0 0 1-4.10876076 4.10876076l5 8.66025404-12.12435565 7-5-8.66025404A38 38 0 0 1 7 37.34969879v10H-7v-10a38 38 0 0 1-5.61267157-1.50391081l-5 8.66025404-12.12435565-7 5-8.66025404a38 38 0 0 1-4.10876076-4.10876076l-8.66025404 5-7-12.12435565 8.66025404-5A38 38 0 0 1-37.34969879 7h-10V-7h10a38 38 0 0 1 1.50391081-5.61267157l-8.66025404-5 7-12.12435565 8.66025404 5a38 38 0 0 1 4.10876076-4.10876076l-5-8.66025404 12.12435565-7 5 8.66025404A38 38 0 0 1-7-37.34969879v-10H7v10a38 38 0 0 1 5.61267157 1.50391081l5-8.66025404 12.12435565 7-5 8.66025404a38 38 0 0 1 4.10876076 4.10876076l8.66025404-5 7 12.12435565-8.66025404 5A38 38 0 0 1 37.34969879-7M0-30a30 30 0 1 0 0 60 30 30 0 1 0 0-60"/></g></g><g transform="matrix(.6 0 0 .6 19 19)"><g transform="rotate(103)"><animateTransform attributeName="transform" begin="-0.125s" dur="3s" keyTimes="0;1" repeatCount="indefinite" type="rotate" values="360;0"/><path fill="coral" d="M37.3496988-7h10V7h-10a38 38 0 0 1-1.50391082 5.61267157l8.66025404 5-7 12.12435565-8.66025404-5a38 38 0 0 1-4.10876076 4.10876076l5 8.66025404-12.12435565 7-5-8.66025404A38 38 0 0 1 7 37.34969879v10H-7v-10a38 38 0 0 1-5.61267157-1.50391081l-5 8.66025404-12.12435565-7 5-8.66025404a38 38 0 0 1-4.10876076-4.10876076l-8.66025404 5-7-12.12435565 8.66025404-5A38 38 0 0 1-37.34969879 7h-10V-7h10a38 38 0 0 1 1.50391081-5.61267157l-8.66025404-5 7-12.12435565 8.66025404 5a38 38 0 0 1 4.10876076-4.10876076l-5-8.66025404 12.12435565-7 5 8.66025404A38 38 0 0 1-7-37.34969879v-10H7v10a38 38 0 0 1 5.61267157 1.50391081l5-8.66025404 12.12435565 7-5 8.66025404a38 38 0 0 1 4.10876076 4.10876076l8.66025404-5 7 12.12435565-8.66025404 5A38 38 0 0 1 37.34969879-7M0-30a30 30 0 1 0 0 60 30 30 0 1 0 0-60"/></g></g></g></svg>';
                    container.html(svg);
                    selector.attr("disabled", true);
                    break;
                case "finished":
                    container.empty();
                    selector.attr("disabled", false);
                    break;
            }
        },
        EVNT_mapCreation(mapType) {
            "use strict";

            let container;
            let data;
            let infoNode;
            let errorText;

            switch (mapType) {
                case "personal":
                    container = $("#personalmap");
                    data = rHelper.data.mineMap;
                    infoNode = $("#personalmap-info");
                    errorText = 'Your mine map is empty! Please import "Mines - detailed" via API first.';
                    break;
                case "world":
                    container = $("#worldmap");
                    data = rHelper.data.worldMap;
                    infoNode = $("#worldmap-info");
                    errorText = "An error occured. If this problem persists, please report this issue via Discord or mail.";
                    break;
            }

            if (data.length != 0) {
                let now = new Date();

                let map = rHelper.methods.SET_newMap(container, 3, "terrain");
                map = rHelper.methods.SET_mapOptions(map, 20, data.mines[0]);

                let markerArr = [];

                switch (mapType) {
                    case "personal":
                        rHelper.methods.SET_mapHQHandler(map, data.hq[0]);
                        break;
                    case "world":
                        $.each(data.hqs, (i, hqObj) => {
                            rHelper.methods.SET_mapHQHandler(map, hqObj);
                        });
                        break;
                }

                $.each(data.mines, (i, subObj) => {
                    markerArr.push(rHelper.methods.SET_mapMineHandler(now, subObj, map, mapType));
                });

                let markerCluster = new MarkerClusterer(map, markerArr,
                    {imagePath: 'assets/img/maps/cluster/m'});
            } else {
                infoNode.text(errorText);
            }
        },
        EVNT_attackLogTrigger() {
            $("#heading-defenselog a").on("click", e => {
                e.preventDefault();
                rHelper.methods.API_getAttackLog("defenseSimple");
            });

            $("#heading-attacklog-1 a").on("click", e => {
                e.preventDefault();
                rHelper.methods.API_getAttackLog("attackSimple");
            });

            $("#heading-attacklog-2 a").on("click", e => {
                e.preventDefault();
                rHelper.methods.API_getAttackLog("attackDetailed");
            });
        },

        INSRT_leaderboardTable() {
            let container = rHelper.data.leaderboard;
            let tbody = $("#module-leaderboard tbody");
            let textOrientation = "text-md-right text-sm-left";
            let textClass = "class='text-right'";

            let string = "";

            let returnPlayerTitle = dataset => {
                return `<table>
                <tbody>
                    <tr><td>Rank</td><td ${textClass}>${dataset.general.rank.toLocaleString("en-US")}</td></tr>
                    <tr><td>Registered since</td><td ${textClass}>${dataset.general.registeredGame}</td></tr>
                    <tr><td>Days playing</td><td ${textClass}>${dataset.general.daysPlaying.toLocaleString("en-US")}</td></tr>
                </tbody>
                </table>`;
            }

            let returnCompanyWorthTitle = dataset => {
                return `<table>
                <thead>
                    <tr><th colspan='2'>Money spent on...</th></tr>
                </thead>
                <tbody>
                    <tr><td>Mines</td><td ${textClass}>${dataset.mineErectionSum.toLocaleString("en-US")}</td></tr>
                    <tr><td>Factories</td><td ${textClass}>${dataset.factoryErectionSum.toLocaleString("en-US")}</td></tr>
                    <tr><td>Headquarter</td><td ${textClass}>${dataset.headquarterSum.toLocaleString("en-US")}</td></tr>
                    <tr><td>Buildings</td><td ${textClass}>${dataset.buildingsErectionSum.toLocaleString("en-US")}</td></tr>
                </tbody>
                </table>`;
            }

            let returnString = dataset => {
                return `
                <tr>
                    <td data-th="Player (hover for details)" title="${returnPlayerTitle(dataset)}">${dataset.general.name} (${dataset.general.level.toLocaleString("en-US")})</td>
                    <td sorttable_customkey="${dataset.general.points}" data-th="Points per day (total points)" class="${textOrientation}">${dataset.general.pointsPerDay.toLocaleString("en-US")} (${dataset.general.points.toLocaleString("en-US")})</td>
                    <td data-th="Factory upgrades" class="${textOrientation}">${dataset.factoryTotalUpgrades.toLocaleString("en-US")}</td>
                    <td data-th="Amount of mines" class="${textOrientation}">${dataset.totalMineCount.toLocaleString("en-US")}</td>
                    <td data-th="Mines within HQ radius" class="${textOrientation}">${dataset.headquarter.mineCount.toLocaleString("en-US")}</td>
                    <td data-th="Mine income" class="${textOrientation}">${dataset.mineIncome.toLocaleString("en-US")}</td>
                    <td data-th="Trade income per day" class="${textOrientation}">${dataset.tradeData.tradeIncomePerDay.toLocaleString("en-US")}</td>
                    <td data-th="Bought goods for" class="${textOrientation}">${dataset.tradeData.totalBuy.toLocaleString("en-US")}</td>
                    <td data-th="Sold goods for..." class="${textOrientation}">${dataset.tradeData.totalSell.toLocaleString("en-US")}</td>
                    <td data-th="Sold goods to KI for..." class="${textOrientation}">${dataset.tradeData.sumKISell.toLocaleString("en-US")}</td>
                    <td data-th="Company worth" class="${textOrientation}" title="${returnCompanyWorthTitle(dataset)}">${dataset.companyWorth.toLocaleString("en-US")}</td>
                </tr>
                `;
            }

            $.each(container, (i, dataset) => {
                string += returnString(dataset);
            });

            tbody.empty().html(string);

            sorttable.makeSortable($("#module-leaderboard table")[0]);
            sorttable.innerSortFunction.apply($("#module-leaderboard th")[10], []);

            $.each($("#module-leaderboard td[title]"), function(i, el) {
                applyTippyOnNewElement($(el));
            });
        },
        INSRT_leaderboard() {
            rHelper.data.leaderboard = rHelper.data.leaderboard || {};

            if($.isEmptyObject(rHelper.data.leaderboard) ) {

                $.getJSON("api/leaderboard.php", result => {
                    rHelper.data.leaderboard = result;
                    rHelper.methods.INSRT_leaderboardTable();
                });
            }
        },
        INSRT_attackLogDetailedGeneralInformation(dataContainer) {
            $("#attacklog-detailed-units-lost-avg").html(rHelper.methods.CALC_attackLogDetailedUnitStringInsertion("offense", dataContainer.avg.unitsLost));
            $("#attacklog-detailed-units-lost-total").html(rHelper.methods.CALC_attackLogDetailedUnitStringInsertion("offense", dataContainer.total.unitsLost));

            $("#attacklog-detailed-factor-avg").text(`${dataContainer.avg.factor}%`);

            $("#attacklog-detailed-profit-avg").text(dataContainer.avg.profit.toLocaleString("en-US"));
            $("#attacklog-detailed-profit-total").text(dataContainer.total.profit.toLocaleString("en-US"));
        },
        INSRT_attackLogDetailed(type, dataContainer) {
            let target = $("#attacklog-tbody-detailed");
            target.empty();

            let select = $("#attacklog-detailed-selector");
            if (select[0].children.length == 2) {
                $.each(dataContainer.validTargets, (i, target) => {
                    select.append(`<option value="${target}">${target}</option>`);
                });
            }

            let sortableTable = $("#collapse-attacklog-detailed table")[1];

            let dataTHs = ["Attacked player (level)", "Timestamp & position", "Units lost", "Units destroyed", "Lootfactor", "Loot", "Profit"];

            $.each(dataContainer.data, (i, dataset) => {
                target.append(rHelper.methods.CALC_attackLogDetailedDatasetIteration(i, dataset, dataTHs));
            });

            rHelper.methods.INSRT_attackLogDetailedGeneralInformation(dataContainer);

            ["last", "next"].forEach(type => {
                rHelper.methods.CALC_attackLogDetailedPageButtonToggler(type, dataContainer);
            });

            sorttable.makeSortable(sortableTable);
        },
        INSRT_ADLogSimple(type, data) {
            let target = $("#attacklog-tbody-simple");
            target.empty();

            let dataTHs = ["Attacked player (last known level)", "Last attacked", "Total attacks", "Win", "Loss", "Average loot factor", "Average amount of units used", "Profit"];

            let unitIndices = [0, 2, 3];
            let textOrientation = "text-md-right text-sm-left";
            let sortableTable = $("#collapse-attacklog-simple table")[0];

            if (type == "defenseSimple") {
                dataTHs[0] = "Attacking player (last known level)";
                sortableTable = $("#collapse-defenselog-simple table")[0];
                target = $("#defenselog-tbody-simple");
            }

            $.each(data, (i, dataset) => {
                let tr = $(crEl("tr"));
                let factorBgColorClass = "bg-success-25";

                for (let index = 0; index <= 7; index += 1) {
                    let td = $(crEl("td")).attr("data-th", dataTHs[index]);
                    let loss = 0;
                    let winPercent = 0;
                    let factor = 0;
                    let unitsContent = "";

                    switch (index) {
                        case 0:
                            td.text(`${dataset.targetName} (${dataset.targetLevel})`);
                            break;
                        case 1:
                            td.text(rHelper.methods.CALC_convertDateToIso(dataset.lastAttacked));
                            break;
                        case 2:
                            winPercent = (dataset.sumWin / dataset.sumAttacks * 100).toFixed(2);
                            td.text(`${dataset.sumAttacks.toLocaleString("en-US")} (${winPercent}%)`).addClass(textOrientation);
                            break;
                        case 3:
                            if (type == "defenseSimple") {
                                loss = dataset.sumAttacks - dataset.sumWin;
                                td.text(loss.toLocaleString("en-US")).addClass(textOrientation);
                            } else if (type == "attackSimple") {
                                td.text(dataset.sumWin.toLocaleString("en-US")).addClass(textOrientation);
                            }
                            break;
                        case 4:
                            if (type == "defenseSimple") {
                                td.text(dataset.sumWin.toLocaleString("en-US")).addClass(textOrientation);
                            } else if (type == "attackSimple") {
                                loss = dataset.sumAttacks - dataset.sumWin;
                                td.text(loss.toLocaleString("en-US")).addClass(textOrientation);
                            }
                            break;
                        case 5:
                            if (dataset.factor < 1) {
                                factorBgColorClass = "bg-warning-25";
                            }
                            factor = (dataset.factor * 100).toFixed(2);
                            td.text(`${factor}%`).addClass(`${textOrientation} ${factorBgColorClass}`);
                            break;
                        case 6:
                            for (let k = 0; k <= 2; k += 1) {
                                let span = $(crEl("span"));
                                span.addClass(`resources-unit-${unitIndices[k]}`);
                                let unitAmount = dataset[`unit${k}`];
                                if (unitAmount == null) {
                                    unitAmount = 0;
                                }
                                unitsContent += `${span[0].outerHTML} ${unitAmount.toLocaleString("en-US")} `;
                            }

                            td.html(unitsContent);
                            break;
                        case 7:
                            let profit = dataset.profit;
                            if (profit == null) {
                                profit = 0;
                            }

                            let unitLossValue = dataset.unitLossValue;
                            if (unitLossValue != null) {
                                profit -= unitLossValue;
                            }

                            td.text(profit.toLocaleString("en-US")).addClass(textOrientation);
                            break;
                    }

                    tr.addClass(rHelper.methods.CALC_attackLogSetTRColor(dataset.profit)).append(td);
                }

                target.append(tr);
            });

            sorttable.makeSortable(sortableTable);
        },
        INSRT_attackLog(type) {
            let data = rHelper.data.attackLog;
            let fn;

            switch (type) {
                case "attackSimple":
                case "defenseSimple":
                    fn = "INSRT_ADLogSimple";
                    break;
                case "attackDetailed":
                    fn = "INSRT_attackLogDetailed";
                    break;
            }

            rHelper.methods[fn](type, data);
        },
        INSRT_materialData(materialId, api) {
            "use strict";

            let fns = ["INSRT_materialRate", "INSRT_materialAmountOfMines", "INSRT_materialNewMinePrice", "INSRT_materialRateWorth", "INSRT_materialNewMinePerfectIncome"];

            $.each(fns, (i, fn) => {
                rHelper.methods[fn](materialId);
            });

            if (api) {
                rHelper.methods.CALC_dependantFactories(materialId, "material");
            }

            rHelper.methods.INSRT_flowRate(materialId, "material");
        },
        INSRT_factoryDiamondData(factoryId, type) {
            "use strict";

            let fns = [
                // factories tab
                "INSRT_factoryLevel",
                "INSRT_factoryOutput",
                "INSRT_factoryUpgradeCost",
                "INSRT_factoryDependencies",
                "INSRT_factoryWorkload",
                "INSRT_factoryTurnover",
                "INSRT_factoryTurnoverPerUpgrade",
                "INSRT_factoryROI",
                // diamond tab
                "INSRT_diamondFactoryOutput",
                "INSRT_diamondFactoryOutputWarehouse",
                "INSRT_diamondDependencies",
                "INSRT_diamondEfficiency",
                "INSRT_diamondProfit"
            ];

            $.each(fns, (i, fn) => {
                rHelper.methods[fn](factoryId);
            });

            rHelper.methods.INSRT_flowRate(factoryId, type);
        },
        INSRT_recycling(index) {
            "use strict";

            let fns = ["INSRT_recyclingRequirement", "INSRT_recyclingProducts", "INSRT_recyclingOutputWorth", "INSRT_recyclingInputWorth"];

            $.each(fns, (i, fn) => {
                rHelper.methods[fn](index);
            });

            rHelper.methods.INSRT_unitsRecyclingProfit("recycling", index);
        },
        INSRT_warehouseData(index, type) {
            "use strict";

            let fns = ["INSRT_warehouseFillAmount", "INSRT_warehouseLevel", "INSRT_warehouseFillStatus", "INSRT_warehouseCapacity", "INSRT_warehouseWorth", "EVNT_warehouseInput"];

            $.each(fns, (i, fn) => {
                rHelper.methods[fn](index, type);
            });

            if (type == "products" || type == "material") {
                rHelper.methods.INSRT_warehouseRemainingTimeToFull(index, type);
            }
        },
        INSRT_priceHistoryGraph(materialName, averageKI, averagePlayer, timestamps, player, ki) {
            "use strict";

            Highcharts.chart("graph-pricehistory", {
                chart: {
                    type: "spline",
                    zoomType: "x"
                },
                title: {
                    useHTML: true,
                    text: `Price history for ${materialName}`
                },
                subtitle: {
                    text: "last 28 days"
                },
                xAxis: {
                    categories: timestamps
                },
                yAxis: {
                    title: {
                        text: "Price"
                    },
                    labels: {
                        formatter: function() {
                            return this.value.toLocaleString("en-US");
                        }
                    },
                    plotLines: [
                        {
                            color: "red",
                            value: averageKI,
                            width: "1",
                            zIndex: 5,
                            label: {
                                text: `average KI price of ${averageKI.toLocaleString("en-US")}`,
                                align: "right",
                                style: {
                                    color: "darkgreen"
                                }
                            }
                        },
                        {
                            color: "darkgreen",
                            value: averagePlayer,
                            width: "1",
                            zIndex: 5,
                            label: {
                                text: `average player price of ${averagePlayer.toLocaleString("en-US")}`,
                                align: "right",
                                style: {
                                    color: "orange"
                                }
                            }
                        }
                    ]
                },
                legend: {
                    enabled: false
                },
                tooltip: {
                    crosshairs: true,
                    shared: true
                },
                plotOptions: {
                    spline: {
                        marker: {
                            radius: 4,
                            lineColor: "#666666",
                            lineWidth: 1
                        }
                    }
                },
                series: [
                    {
                        name: "KI",
                        marker: {
                            symbol: "square"
                        },
                        color: "darkgreen",
                        data: ki
                    },
                    {
                        name: "Player",
                        marker: {
                            symbol: "diamond"
                        },
                        color: "orange",
                        data: player
                    }
                ]
            });
        },
        INSRT_polygonGraph(target, titleText, seriesNames, responsiveId, targetObj) {
            "use strict";

            let dataObj = rHelper.graphs[targetObj];

            Highcharts.chart(target, {
                chart: {
                    type: "pie",
                    backgroundColor: "transparent"
                },
                title: {
                    text: titleText,
                    style: {
                        color: "#dedede"
                    }
                },
                plotOptions: {
                    pie: {
                        shadow: false,
                        center: ["50%", "50%"]
                    }
                },
                tooltip: {
                    valueSuffix: "%"
                },
                series: [
                    {
                        name: seriesNames[0],
                        data: dataObj.mineData,
                        colors: dataObj.colors,
                        size: "60%",
                        dataLabels: {
                            formatter: function() {
                                return this.y > 5 ? this.point.name : null;
                            },
                            color: "#dedede",
                            distance: -30
                        }
                    },
                    {
                        name: seriesNames[1],
                        data: dataObj.incomeData,
                        colors: dataObj.colors,
                        size: "80%",
                        innerSize: "60%",
                        dataLabels: {
                            formatter: function() {
                                return this.y > 1 ? `<b> ${this.point.name} :</b> ${this.y} %` : null;
                            },
                            style: {
                                color: "white",
                                textOutline: "none"
                            }
                        },
                        id: responsiveId
                    }
                ],
                responsive: {
                    rules: [
                        {
                            condition: {
                                maxWidth: 400
                            },
                            chartOptions: {
                                series: [
                                    {
                                        id: responsiveId,
                                        dataLabels: {
                                            enabled: false
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            });
        },
        INSRT_gaugeGraph(type) {
            "use strict";

            if (type == "buildings") {
                Highcharts.chart(
                    "graph-buildings",
                    Highcharts.merge(rHelper.graphs.gaugeOptions, {
                        yAxis: {
                            min: 0,
                            max: rHelper.methods.CALC_perfectWorth("buildings"),
                            title: {
                                text: "total building worth"
                            }
                        },
                        series: [
                            {
                                name: "total building worth",
                                data: [rHelper.methods.CALC_totalBuildingErectionSum()]
                            }
                        ]
                    })
                );
            } else if (type == "headquarter") {
                Highcharts.chart(
                    "graph-headquarter",
                    Highcharts.merge(rHelper.graphs.gaugeOptions, {
                        yAxis: {
                            min: 0,
                            max: rHelper.methods.CALC_perfectWorth("headquarter"),
                            title: {
                                text: "total headquarter worth"
                            }
                        },
                        series: [
                            {
                                name: "total headquarter worth",
                                data: [rHelper.methods.CALC_totalHeadquarterErectionSum()]
                            }
                        ]
                    })
                );
            }
        },
        INSRT_totalMineWorth(totalMineWorth) {
            "use strict";

            $("#material-total-worth").text(totalMineWorth.toLocaleString("en-US"));
        },
        INSRT_totalMineCount(totalMineCount) {
            "use strict";

            $("#material-total-mine-count").text(totalMineCount.toLocaleString("en-US"));
        },
        INSRT_materialRate(materialId) {
            "use strict";

            $(`#material-rate-${materialId}`).val(rHelper.data.material[materialId].perHour);
        },
        INSRT_materialAmountOfMines(materialId) {
            "use strict";

            $(`#material-amount-of-mines-${materialId}`).val(rHelper.data.material[materialId].amountOfMines);
        },
        INSRT_userSettings() {
            "use strict";

            let userInfo = rHelper.data.userInformation;
            $("#security-token").text(userInfo.securityToken);

            if (userInfo.realKey != "" && typeof userInfo.realKey !== undefined) {
                $("#api-key").val(userInfo.realKey);
                rHelper.methods.INSRT_API_remainingCredits(userInfo.remainingCredits);
            }

            if (userInfo.name != "") {
                $("#api-player-anonymity")[0].parentNode.remove();
            }

            $.each(rHelper.data.settings, (index, setting) => {
                let value = 0;
                switch (setting.setting) {
                    case "lang":
                        switch (setting.value) {
                            case "de":
                                value = 0;
                                break;
                            case "en":
                                value = 1;
                                break;
                            case "fr":
                                value = 2;
                                break;
                            case "in":
                                value = 3;
                                break;
                            case "jp":
                                value = 4;
                                break;
                            case "ru":
                                value = 5;
                                break;
                        }
                        $("#settings-language").val(value);
                        break;
                    case "customTU":
                        for (let i = 0; i <= 3; i += 1) {
                            $(`#settings-custom-tu-${i + 1}`).val(setting.value[i]);
                        }
                        break;
                    case "idealCondition":
                        if (setting.value === 1) {
                            $("#settings-ideal-conditions").prop("checked", true);
                        }
                        break;
                    case "transportCostInclusion":
                        if (setting.value === 1) {
                            $("#settings-toggle-transport-cost-inclusion").prop("checked", true);
                        }
                        break;
                    case "mapVisibleHQ":
                        if (setting.value === 1) {
                            $("#settings-hq-visibility").val(1);
                        }
                        break;
                    case "priceAge":
                        $("#settings-price-age").val(setting.value);
                        break;
                }
            });
        },
        INSRT_materialNewMinePrice(materialId) {
            "use strict";

            $(`#material-new-price-${materialId}`).text(rHelper.methods.CALC_materialNewMinePrice(rHelper.methods.CALC_totalMineCount(), materialId).toLocaleString("en-US"));
        },
        INSRT_materialRateWorth(materialId) {
            "use strict";

            $(`#material-worth-${materialId}`).text(rHelper.methods.CALC_materialRateWorth(materialId).toLocaleString("en-US"));
        },
        INSRT_materialMineAmortisation() {
            "use strict";

            let roi100Array = rHelper.methods.CALC_materialMineROI("100");
            let roi500Array = rHelper.methods.CALC_materialMineROI("505");
            let roiXArray = rHelper.methods.CALC_materialMineROI("505hq");

            $.each(roi100Array, (i, value) => {
                $(`#material-roi-100-${i}`).text(value.toFixed(2).toLocaleString("en-US"));
            });
            $.each(roi500Array, (i, value) => {
                $(`#material-roi-500-${i}`).text(value.toFixed(2).toLocaleString("en-US"));
            });
            $.each(roiXArray, (i, value) => {
                $(`#material-roi-x-${i}`).text(value.toFixed(2).toLocaleString("en-US"));
            });

            rHelper.methods.INSRT_materialHighlightColumns(roi100Array, "#material-roi-100-", "text-success", "text-danger");
            rHelper.methods.INSRT_materialHighlightColumns(roi500Array, "#material-roi-500-", "text-success", "text-danger");
            rHelper.methods.INSRT_materialHighlightColumns(roiXArray, "#material-roi-x-", "text-success", "text-danger");
        },
        INSRT_materialNewMinePerfectIncome(materialId) {
            "use strict";

            $(`#material-perfect-income-${materialId}`).text(rHelper.methods.CALC_materialMinePerfectIncome(materialId).toLocaleString("en-US"));
        },
        INSRT_materialHighlightMinePerfectIncome() {
            "use strict";

            let array = [];

            $.each(rHelper.data.material, materialId => {
                array.push(rHelper.methods.CALC_materialMinePerfectIncome(materialId));
            });

            rHelper.methods.INSRT_materialHighlightColumns(array, "#material-perfect-income-", "text-danger", "text-success");
        },
        INSRT_materialHighlightColumns(array, target, minClass, maxClass) {
            "use strict";

            let selectors = ["min", "max"];
            let value = 0;
            let addClass;
            let rmvClass;

            $.each(selectors, (i, selector) => {
                switch (selector) {
                    case "min":
                        value = array.min();
                        addClass = minClass;
                        rmvClass = maxClass;
                        break;
                    case "max":
                        value = array.max();
                        addClass = maxClass;
                        rmvClass = minClass;
                        break;
                }

                let el = $(target + array.indexOf(value));
                el.removeClass(rmvClass).addClass(addClass);
            });
        },
        INSRT_factoryLevel(factoryId) {
            "use strict";

            let factoryLevel = rHelper.data.products[factoryId].factoryLevel;
            $(`#factories-level-${factoryId}`).val(factoryLevel);
            $(`#diamond-level-${factoryId}`).text(factoryLevel);
        },
        INSRT_factoryOutput(factoryId) {
            "use strict";

            $(`#factories-product-${factoryId}`).text(rHelper.methods.CALC_factoryOutput(factoryId).toLocaleString("en-US"));
        },
        INSRT_factoryUpgradeCost(factoryId) {
            "use strict";

            let target = $(`#factories-upgrade-cost-${factoryId}`);
            let calculateFactoryUpgradeCostObj = rHelper.methods.CALC_factoryUpgradeCost(factoryId);

            target.text(calculateFactoryUpgradeCostObj.sum.toLocaleString("en-US"));
            target.attr("title", calculateFactoryUpgradeCostObj.title);
            applyTippyOnNewElement(target);
        },
        INSRT_totalFactoryUpgrades() {
            "use strict";

            $("#factories-total-upgrades").text(rHelper.methods.CALC_totalFactoryUpgrades().toLocaleString("en-US"));
        },
        INSRT_factoryDependencies(factoryId) {
            "use strict";

            let product = rHelper.data.products[factoryId];
            let dependencies = product.dependencies;
            let dependencyString = "";

            if ($.isArray(dependencies)) {
                $.each(dependencies, (dependencyIndex, dependency) => {
                    let dependantObj = rHelper.methods.CALC_convertId(dependency);
                    let price = rHelper.methods.CALC_returnPriceViaId(dependency).toLocaleString("en-US");
                    let requiredAmount = rHelper.methods.CALC_factoryDependencyRequiredAmount(factoryId, dependencyIndex);
                    let existingAmount = rHelper.methods.CALC_factoryDependencyExistingAmount(dependantObj, dependencyIndex);
                    let addClass = rHelper.methods.CALC_factoryComparatorRequiredVsExistingAmount(requiredAmount, existingAmount);
                    let outerSpan = $(crEl("span"));
                    let imgSpan = $(crEl("span"));
                    let innerSpan = $(crEl("span"));

                    imgSpan.addClass(dependantObj.icon).attr("title", price.toLocaleString("en-US"));
                    innerSpan.addClass(addClass).text(requiredAmount.toLocaleString("en-US"));
                    outerSpan.append(`${imgSpan[0].outerHTML} ${innerSpan[0].outerHTML} `);
                    dependencyString += outerSpan[0].outerHTML;
                });
            } else {
                let dependantObj = rHelper.methods.CALC_convertId(dependencies);
                let price = rHelper.methods.CALC_returnPriceViaId(dependencies).toLocaleString("en-US");
                let requiredAmount = rHelper.methods.CALC_factoryDependencyRequiredAmount(factoryId, 0);
                let existingAmount = rHelper.methods.CALC_factoryDependencyExistingAmount(dependantObj, 0);
                let addClass = rHelper.methods.CALC_factoryComparatorRequiredVsExistingAmount(requiredAmount, existingAmount);
                let outerSpan = $(crEl("span"));
                let imgSpan = $(crEl("span"));
                let innerSpan = $(crEl("span"));

                imgSpan.addClass(dependantObj.icon).attr("title", price.toLocaleString("en-US"));
                innerSpan.addClass(addClass).text(requiredAmount.toLocaleString("en-US"));
                outerSpan.append(`${imgSpan[0].outerHTML} ${innerSpan[0].outerHTML} `);
                dependencyString += outerSpan[0].outerHTML;
            }
            $(`#factories-dependencies-${factoryId}`).html(dependencyString);
        },
        INSRT_factoryAmortisation(factoryId) {
            "use strict";

            let target = `#factories-roi-${factoryId}`;
            let amortisation = rHelper.methods.CALC_factoryAmortisation(factoryId);

            if (amortisation < 0 || amortisation == Infinity) {
                amortisation = "∞";
            } else {
                amortisation = amortisation.toFixed(2);
            }

            $(target).text(amortisation);
        },
        INSRT_factoryWorkload(factoryId) {
            "use strict";

            let target = $(`#factories-workload-${factoryId}`);
            let dependencies = rHelper.data.products[factoryId].dependencies;
            rHelper.data.products[factoryId].dependencyWorkload = [];

            if ($.isArray(dependencies)) {
                $.each(dependencies, dependencyIndex => {
                    let dependencyWorkload = rHelper.methods.CALC_factoryDepedencyWorkload(factoryId, dependencyIndex);
                    rHelper.data.products[factoryId].dependencyWorkload.push(dependencyWorkload);
                });
            } else {
                let dependencyWorkload = rHelper.methods.CALC_factoryDepedencyWorkload(factoryId, 0);
                rHelper.data.products[factoryId].dependencyWorkload.push(dependencyWorkload);
            }

            let workload = rHelper.methods.CALC_factoryWorkloadMinNonSanitized(factoryId);
            let removeClass;
            let addClass;

            if (workload >= 1) {
                removeClass = "text-danger";
                addClass = "text-success";
            } else {
                removeClass = "text-success";
                addClass = "text-danger";
            }

            target.removeClass(removeClass).addClass(addClass);
            target.text((workload * 100).toFixed(2) + " %");
        },
        INSRT_factoryTurnover(factoryId) {
            "use strict";

            let target = $(`#factories-turnover-${factoryId}`);
            let turnover = rHelper.methods.CALC_factoryTurnover(factoryId);
            let removeClass;
            let addClass;

            if (turnover <= 0) {
                removeClass = "text-success";
                addClass = "text-danger";
            } else {
                removeClass = "text-danger";
                addClass = "text-success";
            }
            rHelper.data.products[factoryId].turnover = turnover;
            target.removeClass(removeClass).addClass(addClass);
            target.text(turnover.toLocaleString("en-US"));
        },
        INSRT_factoryHighlightColumns() {
            "use strict";

            let subArray;
            let columns = ["#factories-upgrade-cost-", "#factories-increase-per-upgrade-", "#factories-roi-", "#diamond-profit-"];

            $.each(columns, (i, column) => {
                switch (i) {
                    case 0:
                        subArray = "upgradeCost";
                        break;
                    case 1:
                        subArray = "turnoverIncrease";
                        break;
                    case 2:
                        subArray = "roi";
                        break;
                    case 3:
                        subArray = [];
                        break;
                }

                let valueArray = [];
                let idArray = [];

                $.each(rHelper.data.products, (k, factory) => {
                    $(column + k).removeClass("text-success text-danger");
                    let value = 0;
                    if (typeof subArray == "object") {
                        value = factory.diamond.profit;
                    } else {
                        value = factory[subArray];
                    }
                    if (rHelper.data.products[k].turnover > 0 && value != -Infinity && value != Infinity && value > 0) {
                        valueArray.push(value);
                        idArray.push(k);
                    }
                });

                /*
                arrayMin/Max = search within idArray for the same index thats min/max of the value array
                */
                let arrayMin = idArray[valueArray.indexOf(valueArray.min())];
                let arrayMax = idArray[valueArray.indexOf(valueArray.max())];
                switch (i) {
                    case 0:
                    case 2:
                        $(column + arrayMin).addClass("text-success");
                        if (arrayMin != arrayMax) {
                            $(column + arrayMax).addClass("text-danger");
                        }
                        break;
                    case 1:
                    case 3:
                        $(column + arrayMax).addClass("text-success");
                        if (arrayMin != arrayMax) {
                            $(column + arrayMin).addClass("text-danger");
                        }
                        break;
                }
            });
        },
        INSRT_factoryROI(factoryId) {
            "use strict";

            let target = $(`#factories-roi-${factoryId}`);
            let roi = rHelper.methods.CALC_factoryROI(factoryId);
            rHelper.data.products[factoryId].roi = roi;

            if (roi < 0 || roi === Infinity) {
                roi = "∞";
            } else {
                roi = roi.toFixed(2);
            }

            target.text(roi.toLocaleString("en-US"));
        },
        INSRT_factoryTurnoverPerUpgrade(factoryId) {
            "use strict";

            let target = $(`#factories-increase-per-upgrade-${factoryId}`);
            let turnoverPerUpgrade = rHelper.methods.CALC_factoryTurnoverPerUpgrade(factoryId);

            rHelper.data.products[factoryId].turnoverIncrease = turnoverPerUpgrade;
            target.text(turnoverPerUpgrade.toLocaleString("en-US"));
        },
        INSRT_API_remainingCredits(value) {
            "use strict";

            if(value) {
                $("#api-credits").text(value.toLocaleString("en-US") + " Credits left");
            }
        },
        INSRT_diamondFactoryOutput(factoryId) {
            "use strict";

            $(`#diamond-product-${factoryId}`).text(rHelper.methods.CALC_diamondFactoryOutput(factoryId).toLocaleString("en-US"));
        },
        INSRT_diamondFactoryOutputWarehouse(factoryId) {
            "use strict";

            let diamondFactoryOutput = rHelper.methods.CALC_diamondFactoryOutput(factoryId);
            let requiredWarehouseLevel = rHelper.methods.CALC_nextGreaterWarehouseLevel(diamondFactoryOutput);

            $(`#diamond-product-warehouse-${factoryId}`).text(requiredWarehouseLevel.toLocaleString("en-US"));
        },
        INSRT_diamondDependenciesHelper(dependantObj, price, requiredAmount, factoryId, warehouseIconSpan) {
            "use strict";

            let requiredWarehouseLevel = rHelper.methods.CALC_nextGreaterWarehouseLevel(requiredAmount);
            rHelper.data.products[factoryId].diamond.dependenciesWorth += price * requiredAmount;

            let imgSpan = $(crEl("span"))
                .addClass(dependantObj.icon)
                .attr("title", price.toLocaleString("en-US"));
            let innerSpan = $(crEl("span")).text(requiredAmount.toLocaleString("en-US"));
            let warehouseSamp = $(crEl("span")).text(requiredWarehouseLevel);
            let kbd = $(crEl("kbd")).append(`${warehouseIconSpan[0].outerHTML} ${warehouseSamp[0].outerHTML}`);

            let outerSpan = $(crEl("span")).append(`${imgSpan[0].outerHTML} ${innerSpan[0].outerHTML} ${kbd[0].outerHTML} `);

            return outerSpan[0].outerHTML;
        },
        INSRT_diamondDependencies(factoryId) {
            "use strict";

            let product = rHelper.data.products[factoryId];
            let dependencies = product.dependencies;
            let dependencyString = "";
            let warehouseIconSpan = $(crEl("span")).addClass("nav-icon-warehouses");

            if ($.isArray(dependencies)) {
                $.each(dependencies, (dependencyIndex, dependency) => {
                    let dependantObj = rHelper.methods.CALC_convertId(dependency);
                    let price = rHelper.methods.CALC_returnPriceViaId(dependency);
                    let requiredAmount = rHelper.methods.CALC_factoryDependencyRequiredAmount(factoryId, dependencyIndex) * 5 * 24;
                    dependencyString += rHelper.methods.INSRT_diamondDependenciesHelper(dependantObj, price, requiredAmount, factoryId, warehouseIconSpan);
                });
            } else {
                let dependantObj = rHelper.methods.CALC_convertId(dependencies);
                let price = rHelper.methods.CALC_returnPriceViaId(dependencies);
                let requiredAmount = rHelper.methods.CALC_factoryDependencyRequiredAmount(factoryId, 0) * 5 * 24;
                dependencyString += rHelper.methods.INSRT_diamondDependenciesHelper(dependantObj, price, requiredAmount, factoryId, warehouseIconSpan);
            }

            $(`#diamond-dependencies-${factoryId}`).html(dependencyString);
        },
        INSRT_diamondEfficiency(factoryId) {
            "use strict";

            $(`#diamond-efficiency-${factoryId}`).text((rHelper.methods.CALC_diamondEfficiency(factoryId) * 100).toFixed(2).toLocaleString("en-US") + "%");
        },
        INSRT_diamondProfit(factoryId) {
            "use strict";

            $(`#diamond-profit-${factoryId}`).text(rHelper.methods.CALC_diamondProfit(factoryId).toLocaleString("en-US"));
        },
        INSRT_diamondFactoryLevel(factoryId) {
            "use strict";

            $(`#diamond-level-${factoryId}`).text(rHelper.data.products[factoryId].factoryLevel);
        },
        INSRT_diamondTop10Profit() {
            "use strict";

            let top10Profit = rHelper.methods.CALC_diamondTop10Profit().toLocaleString("en-US");
            $("#diamond-top-10").text(top10Profit);
        },
        INSRT_diamondTotalProfit() {
            "use strict";

            let totalProfit = rHelper.methods.CALC_diamondTotalProfit().toLocaleString("en-US");
            $("#diamond-total").text(totalProfit);
        },
        INSRT_flowRate(id, type) {
            "use strict";

            let target = $(`#flow-${type}-rate-${id}`);
            let rate = rHelper.methods.CALC_flowRate(id, type);

            if (type == "product") {
                if (rHelper.data.products[id].turnover < 0) {
                    rate = 0;
                }
            }

            target.text(rate.toLocaleString("en-US"));
        },
        INSRT_flowDistributionGlobal() {
            "use strict";

            let materialTotal = 0;
            let productsTotal = 0;
            let materialColor = "yellowgreen";
            let productColor = "yellowgreen";

            $.each(rHelper.data.material, materialId => {
                materialTotal += rHelper.methods.INSRT_flowDistributionSingle(materialId, "material");
            });

            let calculationOrder = rHelper.methods.GET_calculationOrder();

            $.each(calculationOrder, (index, factoryId) => {
                productsTotal += rHelper.methods.INSRT_flowDistributionSingle(factoryId, "product");
            });

            if (materialTotal < 0) {
                materialColor = "coral";
            }
            if (productsTotal < 0) {
                productColor = "coral";
            }

            rHelper.data.material.totalIncomePerHour = materialTotal;
            rHelper.data.products.totalIncomePerHour = productsTotal;

            $("#flow-material-total")
                .text(materialTotal.toLocaleString("en-US"))
                .css("color", materialColor);
            $("#flow-products-total")
                .text(productsTotal.toLocaleString("en-US"))
                .css("color", productColor);
            $("#effective-hourly-income").text((materialTotal + productsTotal).toLocaleString("en-US"));
        },
        INSRT_flowSurplus(id, type, remainingAmount) {
            "use strict";

            let surplusTarget = $(`#flow-${type}-surplus-${id}`);
            let color = "#dedede";
            if (remainingAmount <= 0) {
                color = "coral";
            }
            surplusTarget.css("color", color);
            surplusTarget.html(`<span class="resources-${type}-${id}"></span> ${remainingAmount.toLocaleString("en-US")}`);
        },
        INSRT_flowDistributionSingle(id, type) {
            "use strict";

            let worthTarget = $(`#flow-${type}-worth-${id}`);
            let price = 0;
            let worth = 0;
            let remainingAmount = rHelper.methods.CALC_flowDistribution(id, type);
            let color = "yellowgreen";
            let productionCost = 0;

            switch (type) {
                case "material":
                    price = rHelper.methods.CALC_returnPriceViaId(id);
                    break;
                case "product":
                    price = rHelper.methods.CALC_returnPriceViaId(id + 14);
                    break;
            }

            if (type == "product") {
                if (rHelper.data.products[id].turnover < 0) {
                    remainingAmount *= -1;
                    if (rHelper.data.products[id].dependantFactories == "") {
                        remainingAmount = 0;
                    }
                } else {
                    productionCost = rHelper.methods.CALC_factoryCashCostPerHour(id);
                }
            }

            worth = remainingAmount * price;
            if (remainingAmount < 0) {
                worth *= rHelper.data.buildings[9].transportCost;
                color = "coral";
            }

            worth = Math.round(worth - productionCost);
            switch (type) {
                case "material":
                    rHelper.data.material[id].effectiveTurnover = worth;
                    break;
                case "product":
                    rHelper.data.products[id].effectiveTurnover = worth;
                    break;
            }

            worthTarget.css("color", color).text(worth.toLocaleString("en-US"));
            rHelper.methods.INSRT_flowSurplus(id, type, remainingAmount);
            return worth;
        },
        INSRT_warehouseFillAmount(id, type) {
            "use strict";

            $(`#warehouse-${type}-stock-current-${id}`).val(rHelper.data[type][id].warehouse.fillAmount);
        },
        INSRT_warehouseLevel(id, type) {
            "use strict";

            let warehouseLevel = rHelper.data[type][id].warehouse.level;
            $(`#warehouse-${type}-level-${id}`).val(warehouseLevel);
            $(`#warehouse-${type}-stock-current-${id}`).attr("max", rHelper.methods.CALC_warehouseContingent(warehouseLevel));
        },
        INSRT_warehouseFillStatus(id, type) {
            "use strict";

            let target = $(`#warehouse-${type}-fill-percent-${id}`);
            let percent = (rHelper.data[type][id].warehouse.fillStatus * 100).toFixed(2);
            let color = "rgb(255, 38, 41)";

            if (percent < 75) {
                color = "rgb(70, 252, 6)";
            } else if (percent >= 75 && percent < 90) {
                color = "rgb(255, 252, 38)";
            } else if (percent >= 90 && percent < 95) {
                color = "rgb(255, 155, 38)";
            }

            target.text(percent).css("color", color);
        },
        INSRT_warehouseCapacity(id, type) {
            "use strict";

            $(`#warehouse-${type}-stock-cap-${id}`).text(rHelper.data[type][id].warehouse.contingent.toLocaleString("en-US"));
        },
        INSRT_warehouseWorth(id, type) {
            "use strict";

            let price = rHelper.methods.CALC_warehouseWorth(id, type);
            let worth = price * rHelper.data[type][id].warehouse.fillAmount;
            $(`#warehouse-${type}-worth-${id}`).text(worth.toLocaleString("en-US"));
        },
        INSRT_warehouseTotalWorth() {
            "use strict";

            let warehouseTotalWorth = rHelper.methods.CALC_warehouseTotalWorth();
            $("#warehouse-total-worth").text(warehouseTotalWorth.toLocaleString("en-US"));
        },
        INSRT_warehouseTotalLevel() {
            "use strict";

            let warehouseTotalLevel = rHelper.methods.CALC_warehouseTotalLevel();
            $("#warehouse-total-level").text(warehouseTotalLevel.toLocaleString("en-US"));
        },
        INSRT_warehouseRemainingTimeToFull(id, type) {
            "use strict";

            let remainingTime = rHelper.methods.CALC_warehouseRemainingTimeToFull(id, type);
            $(`#warehouse-${type}-remaining-${id}`).text(remainingTime);
        },
        INSRT_warehouseUpgradeCost(id, type, value) {
            "use strict";

            let target = $(`#warehouse-${type}-upgrade-cost-${id}`);
            let upgradeCost = rHelper.methods.CALC_warehouseUpgradeCostOnInput(id, type, value);
            target.text(upgradeCost.toLocaleString("en-US"));
        },
        INSRT_buildingName(buildingId) {
            "use strict";

            $(`#buildings-name-${buildingId}`).text(rHelper.data.buildings[buildingId].name);
        },
        INSRT_buildingData(buildingId) {
            "use strict";

            let building = rHelper.data.buildings[buildingId];
            let buildingLevel = building.level;
            let dropdown = $(`#buildings-level-${buildingId}`);

            if (parseInt(dropdown.val()) != buildingLevel) {
                $(dropdown[0][buildingLevel]).attr("selected", "true");
            }

            let materialWorthSum = 0;
            let materialTransportationSum = 0;

            if (buildingLevel != 10) {
                rHelper.methods.SET_buildingTableVisibility(buildingId, "show");

                for (let i = 0; i <= 3; i += 1) {
                    if (i === 0) {
                        let cashTarget = $(`#buildings-cash-${buildingId}`);
                        let cash = building.materialAmount0[buildingLevel];
                        if (typeof cash == "undefined") {
                            cash = 0;
                        }
                        materialWorthSum += cash;
                        cashTarget.text(cash.toLocaleString("en-US"));
                    } else {
                        let selector = `materialAmount${i}`;
                        let material = rHelper.methods.CALC_convertId(building.material[i]);

                        $(`#buildings-mat-${i}-${buildingId}`).addClass(material.icon);
                        let materialAmount = building[selector][buildingLevel];

                        if (typeof materialAmount === "number") {
                            $(`#buildings-amount-${i}-${buildingId}`).text(materialAmount.toLocaleString("en-US"));
                            let materialPrice = rHelper.methods.CALC_returnPriceViaId(building.material[i]);
                            let materialWorth = materialPrice * materialAmount;
                            let transportation = (rHelper.data.buildings[9].transportCost - 1) * materialWorth;

                            materialWorthSum += materialWorth;
                            materialTransportationSum += transportation;
                            $(`#buildings-worth-${i}-${buildingId}`).text(materialWorth.toLocaleString("en-US"));
                            $(`#buildings-transportation-${i}-${buildingId}`).text(transportation.toLocaleString("en-US"));
                        }
                    }
                }
            } else {
                rHelper.methods.SET_buildingTableVisibility(buildingId, "hide");
            }

            $(`#buildings-sum-${buildingId}`).text(materialWorthSum.toLocaleString("en-US"));
            $(`#buildings-transportation-sum-${buildingId}`).text(Math.round(materialTransportationSum).toLocaleString("en-US"));
        },
        INSRT_buildingToLevel10(buildingId) {
            "use strict";

            let buildingToLevel10 = rHelper.methods.CALC_buildingToLevel10(buildingId);
            $(`#buildings-cap-${buildingId}`).text(buildingToLevel10.level10Cost.toLocaleString("en-US"));
            $(`#buildings-transportation-cap-${buildingId}`).text(buildingToLevel10.level10Transportation.toLocaleString("en-US"));
        },
        INSRT_techUpgradeRows(tu4Trigger) {
            "use strict";

            let techUpgradeTbody = $("#techupgrades-combinations-tbl tbody");
            if (techUpgradeTbody[0].childNodes.length > 0) {
                techUpgradeTbody.empty();
            }

            let prices = [];

            for (let i = 46; i <= 49; i += 1) {
                prices.push(rHelper.methods.CALC_returnPriceViaId(i, 0));
            }

            $.each(rHelper.tu, (index, combination) => {
                if (typeof tu4Trigger == "undefined" && combination.tu4 != 0) {
                    return;
                }
                let tr = $(crEl("tr"));
                for (let i = 0; i <= 6; i += 1) {
                    let td = $(crEl("td"));
                    td.addClass("text-md-right text-sm-left");
                    let tus = [combination.tu1, combination.tu2, combination.tu3, combination.tu4];
                    switch (i) {
                        case 0:
                        case 1:
                        case 2:
                        case 3:
                            td.text(tus[i]).attr("data-th", `Tech-Upgrade ${i}`);
                            break;
                        case 4:
                            td.text(combination.factor).attr("data-th", "Boost");
                            break;
                        case 5:
                            let price = 0;
                            for (let k = 0; k < tus.length; k += 1) {
                                price += tus[k] * prices[k];
                            }
                            td.text(price.toLocaleString("en-US")).attr("data-th", "Price");
                            break;
                        case 6:
                            let count = tus[0] * 1 + tus[1] * 2 + tus[2] * 3 + tus[3] * 5;
                            td.text(count).attr("data-th", "Pimp my mine count");
                            break;
                    }
                    tr.append(td[0]);
                }
                techUpgradeTbody.append(tr[0]);
            });
        },
        INSRT_techUpgradeCalculator(value, tu4Inclusion) {
            "use strict";

            toggleTechUpgradeInfo("start");
            let table = $("#techupgrades-calc-tbl");

            if (table.css("display") == "none") {
                table.css("display", "table");
            }

            let target = $("#techupgrades-calc-tbl tbody");
            target.empty();

            let url = `api/getTechCombination.php?factor=${value}`;
            if (typeof tu4Inclusion == "string") {
                url += "&tu4=allowed";
            }

            $.getJSON(url, data => {
                let prices = [];
                for (let i = 46; i <= 49; i += 1) {
                    prices.push(rHelper.methods.CALC_returnPriceViaId(i, 0));
                }

                $.each(data, (i, combination) => {
                    let tr = $(crEl("tr"));
                    for (let k = 0; k <= 6; k += 1) {
                        let td = $(crEl("td"));

                        td.addClass("text-md-right text-sm-left");
                        td.attr("data-th", `missing Tech-Upgrade ${k + 1}`);

                        let tus = [combination.tu1, combination.tu2, combination.tu3, combination.tu4];

                        switch (k) {
                            case 0:
                            case 1:
                            case 2:
                            case 3:
                                td.text(tus[k]);
                                break;
                            case 4:
                                td.text(combination.factor).attr("data-th", "resulting Boost");
                                break;
                            case 5:
                                let price = 0;
                                for (let l = 0; l < tus.length; l += 1) {
                                    price += tus[l] * prices[l];
                                }
                                td.text(price.toLocaleString("en-US")).attr("data-th", "Price");
                                break;
                            case 6:
                                let count = tus[0] * 1 + tus[1] * 2 + tus[2] * 3 + tus[3] * 5;
                                td.text(count).attr("data-th", "remaining Pimp my mine count");
                                break;
                        }
                        tr.append(td);
                    }
                    target.append(tr);
                });

                sorttable.makeSortable(table[0]);
                sorttable.innerSortFunction.apply($("#techupgrades-calc-tbl th")[5], []);
                sorttable.innerSortFunction.apply($("#techupgrades-calc-tbl th")[5], []);
                toggleTechUpgradeInfo("end");
            }).fail(() => {
                let tr = $(crEl("tr"));
                let td = $(crEl("td"));
                td
                    .addClass("text-warning text-center")
                    .attr("data-th", "Attention")
                    .attr("colspan", 7)
                    .text("No entries found or invalid value. Try to lower the value a bit – up to 5 decimals are allowed (e.g. 3.00005).");
                tr.append(td);
                target.append(tr);
                toggleTechUpgradeInfo("end");
            });
        },
        INSRT_recyclingRequirement(lootId) {
            "use strict";

            $(`#recycling-requirement-${lootId}`).text(rHelper.methods.CALC_recyclingRequirement(lootId).toLocaleString("en-US"));
        },
        INSRT_recyclingProducts(lootId) {
            "use strict";

            let recyclingPlantLevel = rHelper.data.buildings[5].level;
            let recyclingProducts = rHelper.methods.CALC_recyclingProducts(lootId, recyclingPlantLevel);
            $(`#recycling-products-${lootId}`).html(recyclingProducts);
        },
        INSRT_recyclingOutputWorth(lootId) {
            "use strict";

            let recyclingPlantLevel = rHelper.data.buildings[5].level;
            $(`#recycling-output-${lootId}`).text(rHelper.methods.CALC_recyclingOutputWorth(lootId, recyclingPlantLevel).toLocaleString("en-US"));
        },
        INSRT_recyclingInputWorth(lootId) {
            "use strict";

            $(`#recycling-input-${lootId}`).text(rHelper.methods.CALC_recyclingInputWorth(lootId).toLocaleString("en-US"));
        },
        INSRT_unitsRecyclingProfit(type, id) {
            "use strict";

            let target = $(`#${type}-profit-${id}`);
            let profit = 0;
            let result;
            let color;

            if (type == "recycling") {
                profit = rHelper.methods.CALC_recyclingProfit(id);
            } else if (type == "units") {
                profit = rHelper.methods.CALC_unitsProfit(id);
            }

            if (profit > 0) {
                color = "#9acd3225";
            } else {
                color = "#ff7f5025";
            }

            $(target[0].parentNode).css("background-color", color);

            result = profit.toFixed(2).toLocaleString("en-US") + "%";
            target.text(result);
        },
        INSRT_unitsCraftingPrice(unitId) {
            "use strict";

            $(`#units-crafting-${unitId}`).text(rHelper.methods.CALC_unitsCraftingPrice(unitId).toLocaleString("en-US"));
        },
        INSRT_unitsPricePerStrength(unitId) {
            "use strict";

            $(`#units-pps-${unitId}`).text(rHelper.methods.CALC_unitsPricePerStrength(unitId).toLocaleString("en-US"));
        },
        INSRT_unitsMarketPrice(unitId) {
            "use strict";

            let convertedId = unitId + 52;
            let marketPrice = rHelper.methods.CALC_returnPriceViaId(convertedId);
            rHelper.data.units[unitId].profit.marketPrice = marketPrice;

            $(`#units-market-${unitId}`).text(marketPrice.toLocaleString("en-US"));
        },
        INSRT_companyWorth() {
            "use strict";

            let companyWorth = rHelper.methods.CALC_companyWorth();
            $("#company-worth").text(companyWorth.toLocaleString("en-US"));
        },
        INSRT_headquarterOvwTransportation(level) {
            "use strict";

            let hqLevel = rHelper.data.headquarter[level];
            if ($.isArray(hqLevel.material)) {
                let hqCost = rHelper.methods.CALC_headquarterLevelCost(level);
                let transportation = Math.round(hqCost * (rHelper.data.buildings[9].transportCost - 1));
                $(`#hq-ovw-transportation-${level}`).text(transportation.toLocaleString("en-US"));
            }
        },
        INSRT_headquarterOvwCost(level) {
            "use strict";

            let hqCost = rHelper.methods.CALC_headquarterLevelCost(level);
            $(`#hq-ovw-sum-${level}`).text(hqCost.toLocaleString("en-US"));
        },
        INSRT_headquarterOvwRadius(level) {
            "use strict";

            let hqLevel = rHelper.data.headquarter[level];
            $(`#hq-ovw-radius-${level}`).text(`${hqLevel.radius} m | ${rHelper.methods.CALC_convertMeterToYards(hqLevel.radius)} yards`);
        },
        INSRT_headquarterOvwBoost(level) {
            "use strict";

            let hqLevel = rHelper.data.headquarter[level];
            $(`#hq-ovw-boost-${level}`).text(hqLevel.boost);
        },
        INSRT_headquarterOvwString(level) {
            "use strict";

            let hqLevel = rHelper.data.headquarter[level];

            if ($.isArray(hqLevel.material)) {
                let string = `${rHelper.methods.CALC_headquarterOvwMaterial(level)} x ${hqLevel.amount.toLocaleString("en-US")}`;
                $(`#hq-ovw-mat-${level}`).html(string);
            }
        },
        INSRT_headquarterContentRequiredAmount(level) {
            "use strict";

            let hqContent = $("#hq-content");
            if (level != 10) {
                hqContent.css("display", "block");
                let headquarter = rHelper.data.headquarter[level];
                let amount = headquarter.amount;

                $.each(headquarter.material, (i, material) => {
                    let icon = rHelper.methods.CALC_headquarterContentIcon(material);
                    let span = rHelper.methods.CALC_headquarterContentRequiredAmount(amount);

                    $(`#hq-content-icon-${i}`).html(icon);
                    $(`#hq-content-requirement-${i}`).html(span);
                });
            } else {
                hqContent.css("display", "none");
            }
        },
        INSRT_headquarterPaid() {
            "use strict";

            let paid = rHelper.data.headquarter.user.paid;
            $.each(paid, (i, amount) => {
                $(`#hq-content-paid-${i}`).val(amount);
            });
        },
        INSRT_headquarterMissing(i) {
            "use strict";

            let userHqLevel = rHelper.data.headquarter.user.level;
            if (userHqLevel != 10) {
                let requiredAmount = rHelper.data.headquarter[userHqLevel].amount;
                let paid = rHelper.data.headquarter.user.paid[i];
                let missing = requiredAmount - paid;
                if (missing < 0) {
                    missing = 0;
                }
                $(`#hq-content-missing-${i}`).text(missing.toLocaleString("en-US"));
            }
        },
        INSRT_headquarterRemainingCost(userHqLevel) {
            "use strict";

            if (userHqLevel != 10) {
                let headquarter = rHelper.data.headquarter[userHqLevel];
                let totalCost = 0;
                let totalTransportation = 0;

                $.each(headquarter.material, (i, material) => {
                    let worth = rHelper.methods.CALC_headquarterRemainingCost(i, material, userHqLevel);
                    totalCost += worth;
                    let transportation = Math.round(worth * (rHelper.data.buildings[9].transportCost - 1));
                    totalTransportation += transportation;
                    $(`#hq-content-cost-${i}`).text(worth.toLocaleString("en-US"));
                    $(`#hq-content-transportation-${i}`).text(transportation.toLocaleString("en-US"));
                });

                rHelper.methods.INSRT_headquarterTotalCost(totalCost);
                rHelper.methods.INSRT_headquarterTotalTransportation(totalTransportation);
            }
        },
        INSRT_headquarterTotalCost(sum) {
            "use strict";

            $("#hq-content-cost-sum").text(sum.toLocaleString("en-US"));
        },
        INSRT_headquarterTotalTransportation(sum) {
            "use strict";

            $("#hq-content-transportation-sum").text(sum.toLocaleString("en-US"));
        },
        INSRT_priceHistoryName(type, id) {
            "use strict";

            $(`#pricehistory-${type}-${id}`).text(rHelper.data[type][id].name);
        },
        INSRT_qualityComparator(type, quality) {
            "use strict";

            if (!type || type == null) {
                type = 0;
            }
            if (!quality) {
                quality = 1;
            } else {
                quality /= 100;
            }

            let price = rHelper.methods.CALC_returnPriceViaId(type);
            let worth = price * rHelper.data.material[type].maxRate * quality;
            $("#qualitycomparator-income").text(worth.toLocaleString("en-US"));

            $.each(rHelper.data.material, (i, material) => {
                let qualityTarget = $(`#qualitycomparator-${i}`);
                let parentElement = $(qualityTarget[0].parentNode.parentNode);
                let thisPrice = rHelper.methods.CALC_returnPriceViaId(i);
                let thisMaxRate = material.maxRate;
                let thisResourcesRequiredAmount = worth / thisPrice;

                // hide row if identical to current scan or more required than possible
                if (i == type || thisResourcesRequiredAmount > thisMaxRate) {
                    parentElement.css("opacity", 0.1);
                } else {
                    parentElement.css("opacity", 1);
                    let percent = (thisResourcesRequiredAmount / thisMaxRate * 100).toFixed(2);
                    qualityTarget.text(`${percent} %`);
                }
            });
        },
        INSRT_missions() {
            "use strict";

            let missionContainer = rHelper.data.missions;
            if (missionContainer.length != 0) {
                let now = Math.round(Date.now() / 1000);

                let calculateMissionCost = (i, mission) => {
                    let uncalculatableMissions = [9, 12, 17, 21, 22, 25, 30, 31, 32, 35, 37, 38, 41, 42, 43, 44, 50, 55];
                    let requirementId = 0;
                    let materialCost = 0;
                    let missionCost = 0;

                    if (uncalculatableMissions.indexOf(i) == -1) {
                        switch (i) {
                            case 10:
                                missionCost += rHelper.data.units[5].profit.craftingPrice * mission.goal;
                                break;
                            case 11:
                            case 26:
                            case 28:
                            case 31:
                            case 39:
                                if (i == 26) {
                                    requirementId = 29;
                                } else if (i == 28) {
                                    requirementId = 21;
                                } else if (i == 31) {
                                    requirementId = 20;
                                } else if (i == 39) {
                                    requirementId = 25;
                                }

                                materialCost = rHelper.methods.CALC_returnPriceViaId(requirementId) * mission.goal;
                                missionCost += materialCost * rHelper.data.buildings[9].transportCost - materialCost;
                                break;
                            case 14:
                                missionCost += rHelper.methods.CALC_currentScanCost() * mission.goal;
                                break;
                            case 33:
                                let calcSmallestUnitPrice = () => {
                                    let min = Infinity;

                                    $.each(rHelper.data.units, (i, unit) => {
                                        if (i == 1 || i == 4 || i == 5) {
                                            let craftingPrice = unit.profit.craftingPrice;
                                            let marketPrice = unit.profit.marketPrice * rHelper.data.buildings[9].transportCost;
                                            let result = 0;

                                            if (marketPrice > craftingPrice) {
                                                result = craftingPrice;
                                            } else {
                                                result = marketPrice;
                                            }

                                            if (result < min) {
                                                min = result;
                                            }
                                        }
                                    });

                                    return min;
                                };

                                missionCost += calcSmallestUnitPrice() * mission.goal;

                                break;
                            case 45:
                                missionCost += mission.goal / 5 * 100;
                                break;
                        }
                    }

                    return missionCost;
                };

                let calculateMissionReward = (i, mission) => {
                    let rewardId = mission.rewardId;
                    let rewardWorth = 0;

                    if (rewardId != -1) {
                        $(`#mission-reward-${i}`).addClass(rHelper.methods.CALC_convertId(rewardId).icon);
                        let price = rHelper.methods.CALC_returnPriceViaId(rewardId);
                        rewardWorth += mission.rewardAmount * price;
                    } else {
                        $(`#mission-reward-${i}`).html('<img src="assets/img/cash.png" alt="Cash" />');
                        rewardWorth += mission.rewardAmount;
                    }

                    return rewardWorth;
                };

                let returnWorthColor = missionWorth => {
                    let color = "coral";

                    if (missionWorth > 0) {
                        color = "yellowgreen";
                    }

                    return color;
                };

                let insertMissionReward = (i, mission) => {
                    let parsedI = parseInt(i);

                    let rewardWorth = calculateMissionReward(i, mission);
                    let missionCost = calculateMissionCost(parsedI, mission);

                    let missionWorth = rewardWorth - missionCost;
                    let color = returnWorthColor(missionWorth);

                    if (parsedI != 50 && parsedI != 55 && parsedI != 31) {
                        $(`#mission-profit-${i}`)
                            .text(missionWorth.toLocaleString("en-US"))
                            .css("color", color);
                    }
                };

                let colorProgress = progressPercent => {
                    let color = "coral";

                    if (progressPercent > 33 && progressPercent < 66) {
                        color = "orange";
                    } else if (progressPercent >= 66) {
                        color = "yellowgreen";
                    }
                    return color;
                };

                let returnMissionProgress = (progress, goal) => {
                    return progress / goal * 100;
                };

                let calculateRemainingDuration = (now, finish) => {
                    let remainingDuration = finish - now;

                    if (remainingDuration < 60) {
                        return remainingDuration + "s";
                    } else if (remainingDuration >= 60 && remainingDuration < 3600) {
                        return (remainingDuration / 60).toFixed(2) + "m";
                    } else if (remainingDuration >= 3600 && remainingDuration < 86400) {
                        return (remainingDuration / 3600).toFixed(2) + "h";
                    } else {
                        return (remainingDuration / 86400).toFixed(2) + "d";
                    }
                };

                let fadeOutMission = (i, mission) => {
                    let cooldown = calculateRemainingDuration(now, mission.cooldown);

                    $(`#mission-progress-${i}`)
                        .attr("colspan", 3)
                        .html('Mission on cooldown for <span style="color: orange;">' + cooldown + "</span>")
                        .css("text-align", "center");
                    $(`#mission-start-${i}`).remove();
                    $(`#mission-end-${i}`).remove();
                    $(`#mission-${i}`).addClass("faded-mission");
                };

                let highlightAvailableMission = i => {
                    $(`#mission-${i}`).addClass("yellowgreen-10");
                };

                let insertMissionConstants = (i, mission) => {
                    $(`#mission-duration-${i}`).text(mission.duration / 24);
                    $(`#mission-goal-${i}`).text(mission.goal.toLocaleString("en-US"));
                    $(`#mission-interval-${i}`).text(mission.intervalDays);
                    $(`#mission-penalty-${i}`).text(mission.penalty.toLocaleString("en-US"));
                    $(`#mission-reward-amount-${i}`).text(mission.rewardAmount.toLocaleString("en-US"));
                };

                let onActiveMission = (i, mission) => {
                    let progressPercent = returnMissionProgress(mission.progress, mission.goal);
                    $(`#mission-progress-bar-${i}`).css({
                        width: progressPercent + "%",
                        "background-color": colorProgress(progressPercent)
                    });

                    $(`#mission-start-${i}`).text(rHelper.methods.CALC_convertDateToIso(rHelper.methods.CALC_toMilliseconds(mission.startTimestamp)));
                    $(`#mission-end-${i}`).text(calculateRemainingDuration(now, mission.endTimestamp));
                };

                let onPassiveMission = i => {
                    $(`#mission-progress-wrap-${i}`).css("display", "none");
                };

                let checkForMissionStatus = (i, mission) => {
                    if (mission.status == 1) {
                        onActiveMission(i, mission);
                    } else {
                        onPassiveMission(i, mission);
                    }
                };

                $.each(missionContainer, (i, mission) => {
                    insertMissionReward(i, mission);
                    insertMissionConstants(i, mission);

                    if (mission.cooldown > now) {
                        fadeOutMission(i, mission);
                    } else {
                        highlightAvailableMission(i);
                    }

                    checkForMissionStatus(i, mission);
                });
            }
        },

        CALC_attackLogDetailedUnitStringInsertion(type, container) {
            let content = "";
            let unitArray;

            if (type == "offense") {
                unitArray = [0, 2, 3];
            } else if (type == "defense") {
                unitArray = [5, 4, 1];
            }

            $.each(container, (i, unitAmount) => {
                if (unitAmount != 0) {
                    content += ' <span class="resources-unit-' + unitArray[i] + '"></span> ' + unitAmount.toLocaleString("en-US");
                }
            });

            return content;
        },
        CALC_attackLogDetailedDatasetIteration(i, dataset, dataTHs) {
            let tr = $(crEl("tr")).addClass(rHelper.methods.CALC_attackLogSetTRColor(dataset.result));
            let textOrientation = "text-md-right text-sm-left";
            let factorBgColorClass = "bg-success-25";

            for (let index = 0; index <= 7; index += 1) {
                let td = $(crEl("td")).attr("data-th", dataTHs[index]);

                switch (index) {
                    case 0:
                        td.text(`${dataset.target} (${dataset.targetLevel})`);
                        break;
                    case 1:
                        td.html(rHelper.methods.CALC_attackLogDetailedCoordsTimestampString(dataset));
                        break;
                    case 2:
                        td.html(rHelper.methods.CALC_attackLogDetailedUnitStringInsertion("offense", dataset.offense.units)).addClass("text-sm-left text-md-center");
                        break;
                    case 3:
                        td.html(rHelper.methods.CALC_attackLogDetailedUnitStringInsertion("defense", dataset.defense.units)).addClass("text-sm-left text-md-center");
                        break;
                    case 4:
                        if (dataset.factor < 100) {
                            factorBgColorClass = "bg-warning-25";
                        }

                        td.text(dataset.factor.toLocaleString("en-US") + "%").addClass(`${textOrientation} ${factorBgColorClass}`);
                        break;
                    case 5:
                        td.html(rHelper.methods.CALC_attackLogDetailedLootString(dataset.loot));
                        break;
                    case 6:
                        let profit = dataset.profit;
                        let result = dataset.result;
                        let profitColor = "#dedede";

                        if ((profit < 0 && result) || !result) {
                            profitColor = "coral";
                        }

                        td
                            .text(profit.toLocaleString("en-US"))
                            .addClass(textOrientation)
                            .css("color", profitColor);
                        break;
                }

                tr.append(td);
            }

            return tr;
        },
        CALC_attackLogSetTRColor(result) {
            let colorClass = "bg-success-25";

            if (!result) {
                colorClass = "bg-warning-25";
            }

            return colorClass;
        },
        CALC_attackLogDetailedCoordsTimestampString(dataset) {
            let coords = `${dataset.coordinates.lat}, ${dataset.coordinates.lon}`;
            let timestamp = rHelper.methods.CALC_convertDateToIso(dataset.attackedAt);
            let a = `<a href="https://www.google.com/maps/search/${coords}" target="_blank" rel="noopener nofollow noreferrer">${coords}</a>`;

            return `${timestamp} | ${a}`;
        },
        CALC_attackLogDetailedPageButtonToggler(type, dataContainer) {
            let button = $(`#attacklog-detailed-${type}`);
            let success = "btn-success";

            if (type == "last") {
                if (dataContainer.skipCount == 0) {
                    button.attr("disabled", true).removeClass(success);
                } else {
                    button.attr("disabled", false).addClass(success);
                }
            } else if (type == "next") {
                if (dataContainer.maxLength > dataContainer.skipCount + 100) {
                    button.addClass(success).attr("disabled", false);
                } else {
                    button.removeClass(success).attr("disabled", true);
                }
            }
        },
        CALC_attackLogDetailedLootString(lootContainer) {
            let lootString = "";

            $.each(lootContainer, (index, iteration) => {
                let type = iteration.type;
                let icon = "";

                if (type == -1) {
                    icon = '<img src="assets/img/cash.png" alt="Cash" />';
                } else {
                    icon = '<span class="' + rHelper.methods.CALC_convertId(type).icon + '"></span>';
                }

                lootString += `${icon} ${iteration.amount.toLocaleString("en-US")} `;
            });

            return lootString;
        },
        CALC_convertDateToIso(milliseconds) {
            /*
            src https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
             */

            let tzoffset = new Date(milliseconds).getTimezoneOffset() * 60000;
            let date = new Date(milliseconds - tzoffset)
                .toISOString()
                .slice(0, -1)
                .match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/);
            return `${date[1]} ${date[2]}`;
        },
        CALC_currentScanCost() {
            let techCenterLevel = rHelper.data.buildings[0].level;
            let mineCount = rHelper.methods.CALC_totalMineCount();

            return Math.round(10000 * Math.pow(2.4, techCenterLevel) * (1 + mineCount / 1000) / 5000) * 5000;
        },
        CALC_toMilliseconds(unix) {
            return unix * 1000;
        },
        CALC_mineEstRevenue(subObj, type, age) {
            "use strict";

            return Math.round(subObj.fullRate * rHelper.methods.CALC_returnPriceViaId(type, 8) * age * 24 * subObj.HQBoost);
        },
        CALC_createMapContentString(relObj, buildDate, age, estRevenue, subObj) {
            "use strict";

            let quality = subObj.quality * 100;
            return `<div>
        <h1 class="firstHeading">${relObj.name}</h1>
        <div>
        <p><strong>Built:</strong> ${buildDate}</p>
        <p><strong>Age (days)</strong>: ${age.toFixed(2)}</p>
        <p><strong>Estimated revenue (condition always 100%):</strong> ${estRevenue.toLocaleString("en-US")}</p>
        <table class="table table-break-medium mb-3 text-center">
        <thead>
        <tr>
          <th>Raw rate</th>
          <th>Full rate</th>
          <th>Tech factor</th>
          <th>Quality</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>${subObj.rawRate.toLocaleString("en-US")}</td>
          <td>${subObj.fullRate.toLocaleString("en-US")}</td>
          <td>${subObj.techFactor.toLocaleString("en-US")}</td>
          <td>${quality.toFixed(2)}% => ${(quality * subObj.techFactor).toFixed(2)} %</td>
        </tr>
        </tbody>
        </table>
        </div>
        </div>`;
        },
        CALC_headquarterRemainingCost(i, material, userHqLevel) {
            "use strict";

            let price = rHelper.methods.CALC_returnPriceViaId(material);
            let missing = rHelper.data.headquarter[userHqLevel].amount - rHelper.data.headquarter.user.paid[i];
            if (missing < 0) {
                missing = 0;
            }

            return price * missing;
        },
        CALC_headquarterContentIcon(material) {
            "use strict";

            let container = $(crEl("span"));
            container.addClass(rHelper.methods.CALC_convertId(material).icon);
            return container[0].outerHTML;
        },
        CALC_headquarterContentRequiredAmount(amount) {
            "use strict";

            let span = $(crEl("span")).html(amount.toLocaleString("en-US"));
            return span[0].outerHTML;
        },
        CALC_convertMeterToYards(meter) {
            "use strict";

            return Math.round(meter * 1.09361);
        },
        CALC_headquarterLevelCost(level) {
            "use strict";

            let cost = 0;
            let hqLevel = rHelper.data.headquarter[level];

            if ($.isArray(hqLevel.material)) {
                $.each(hqLevel.material, (k, material) => {
                    cost += hqLevel.amount * rHelper.methods.CALC_returnPriceViaId(material);
                });
            }

            return cost;
        },
        CALC_headquarterOvwMaterial(level) {
            "use strict";

            let hqLevel = rHelper.data.headquarter[level];
            let string = "";

            if ($.isArray(hqLevel.material)) {
                $.each(hqLevel.material, (k, material) => {
                    let addClass;

                    if (material <= 13) {
                        addClass = rHelper.data.material[material].icon;
                    } else if (material >= 14 && material <= 35) {
                        material -= 14;
                        addClass = rHelper.data.products[material].icon;
                    } else if (material >= 36 && material <= 51) {
                        material -= 36;
                        addClass = rHelper.data.loot[material].icon;
                    } else {
                        material -= 52;
                        addClass = rHelper.data.units[material].icon;
                    }

                    let span = $(crEl("span")).addClass(addClass);
                    string += span[0].outerHTML + " ";
                });
            }

            return string;
        },
        CALC_totalBuildingErectionSum() {
            "use strict";

            let total = 0;
            $.each(rHelper.data.buildings, (i, building) => {
                for (let level = 0; level < building.level; level += 1) {
                    $.each(building.material, (k, material) => {
                        let materialAmount = `materialAmount${k}`;

                        if (material != -1) {
                            total += rHelper.methods.CALC_returnPriceViaId(material) * building[materialAmount][level];
                        } else {
                            total += building[materialAmount][level];
                        }
                    });
                }
            });

            return total;
        },
        CALC_perfectWorth(type) {
            "use strict";

            let total = 0;

            if (type == "headquarter") {
                $.each(rHelper.data.headquarter, (i, hqLevel) => {
                    $.each(hqLevel.material, (k, material) => {
                        total += hqLevel.amount * rHelper.methods.CALC_returnPriceViaId(material);
                    });
                });
            } else if (type == "buildings") {
                $.each(rHelper.data.buildings, (i, building) => {
                    for (let level = 0; level < 10; level += 1) {
                        $.each(building.material, (k, material) => {
                            let materialAmount = `materialAmount${k}`;

                            if (material != -1) {
                                total += rHelper.methods.CALC_returnPriceViaId(material) * building[materialAmount][level];
                            } else {
                                total += building[materialAmount][level];
                            }
                        });
                    }
                });
            }

            return total;
        },
        CALC_companyWorth() {
            "use strict";

            let companyWorth = 0;

            let fns = ["CALC_totalHeadquarterErectionSum", "CALC_totalBuildingErectionSum", "CALC_totalFactoryErectionWorth", "CALC_totalWarehouseErectionWorth", "CALC_totalMineErectionSum"];

            $.each(fns, (i, fn) => {
                companyWorth += rHelper.methods[fn]();
            });

            return companyWorth;
        },
        CALC_totalHeadquarterErectionSum() {
            "use strict";

            let total = 0;
            let headquarter = rHelper.data.headquarter;

            if (headquarter.user) {
                let userHq = headquarter.user;
                let userHqLevel = userHq.level;
                for (let i = userHqLevel - 1; i >= 1; i -= 1) {
                    let hqLevel = rHelper.data.headquarter[i];
                    $.each(hqLevel.material, (k, material) => {
                        total += hqLevel.amount * rHelper.methods.CALC_returnPriceViaId(material);
                    });
                }
                if (userHqLevel != 10) {
                    $.each(userHq.paid, (i, paid) => {
                        if (paid != 0) {
                            let material = rHelper.data.headquarter[userHqLevel - 1].material[i];
                            total += paid * rHelper.methods.CALC_returnPriceViaId(material);
                        }
                    });
                }
            }

            return total;
        },
        CALC_totalMineErectionSum() {
            "use strict";

            let total = 0;
            let totalMines = rHelper.methods.CALC_totalMineCount();

            $.each(rHelper.data.material, (i, material) => {
                total += material.basePrice * (1 + 0.01 * totalMines) * material.amountOfMines;
            });

            return Math.round(total);
        },
        CALC_totalWarehouseErectionWorth() {
            "use strict";

            let total = 0;
            let subArrays = ["material", "products", "loot", "units"];

            $.each(subArrays, (i, index) => {
                $.each(rHelper.data[index], (k, obj) => {
                    for (let k = 1; k <= obj.warehouse.level; k += 1) {
                        total += Math.pow(k - 1, 2) * 1250000;
                    }
                });
            });

            return total;
        },
        CALC_totalFactoryErectionWorth() {
            "use strict";

            let total = 0;

            $.each(rHelper.data.products, (i, factory) => {
                for (let level = 0; level <= factory.factoryLevel; level += 1) {
                    $.each(factory.upgradeMaterial, (k, material) => {
                        let value = Math.pow(level, 2) * factory.upgradeMaterialAmount[k];
                        if (material != -1) {
                            total += value * rHelper.methods.CALC_returnPriceViaId(material);
                        } else {
                            total += value;
                        }
                    });
                }
            });

            return total;
        },
        CALC_unitsCraftingPrice(unitId) {
            "use strict";

            let unit = rHelper.data.units[unitId];
            let worth = unit.prices.current.ai;
            let requiredAmount = unit.requiredAmount;
            let requirements = unit.requirements;

            $.each(requirements, (index, requirement) => {
                let price = rHelper.methods.CALC_returnPriceViaId(requirement);
                worth += price * requiredAmount[index];
            });

            let settings = rHelper.data.settings[3];
            let transportCostInclusion = 1;

            if (typeof settings !== undefined) {
                transportCostInclusion = rHelper.data.settings[3].value;
            }

            if (transportCostInclusion == 1) {
                worth *= rHelper.data.buildings[9].transportCost;
            }

            worth = Math.round(worth);
            unit.profit.craftingPrice = worth;
            return worth;
        },
        CALC_unitsPricePerStrength(unitId) {
            "use strict";

            let buildingLevel = 0;
            let strength = 0;
            let pricePerStrength = 0;
            let referencePrice = 0;
            let profitObj = rHelper.data.units[unitId].profit;

            switch (unitId) {
                case 0:
                case 2:
                case 3:
                    buildingLevel = rHelper.data.buildings[3].level;
                    break;
                case 1:
                case 4:
                case 5:
                    buildingLevel = rHelper.data.buildings[4].level;
                    break;
            }

            strength = rHelper.data.units[unitId].baseStrength * buildingLevel;
            let marketPriceIncludingTransportation = profitObj.marketPrice * rHelper.data.buildings[9].transportCost;

            if (marketPriceIncludingTransportation >= profitObj.craftingPrice) {
                referencePrice = profitObj.craftingPrice;
            } else {
                referencePrice = marketPriceIncludingTransportation;
            }

            pricePerStrength = Math.round(referencePrice / strength);
            return pricePerStrength;
        },
        CALC_unitsProfit(unitId) {
            "use strict";

            let profitObj = rHelper.data.units[unitId].profit;
            let profit = (1 - profitObj.marketPrice / profitObj.craftingPrice) * 100;
            profit *= -1;
            profitObj.profit = profit;

            return profit;
        },
        CALC_recyclingProfit(lootId) {
            "use strict";

            let profitObj = rHelper.data.loot[lootId].profit;
            let profit = (1 - profitObj.outputWorth / profitObj.inputWorth) * 100;
            profit *= -1;

            return profit;
        },
        CALC_recyclingInputWorth(lootId) {
            "use strict";

            let loot = rHelper.data.loot[lootId];
            let amount = loot.recyclingDivisor;
            let convertedId = lootId + 36;
            let price = rHelper.methods.CALC_returnPriceViaId(convertedId, 0);
            let worth = price * amount;

            let settings = rHelper.data.settings[3];
            let transportCostInclusion = 1;

            if (typeof settings !== undefined) {
                transportCostInclusion = rHelper.data.settings[3].value;
            }

            if (transportCostInclusion == 1) {
                worth *= rHelper.data.buildings[9].transportCost;
            }

            worth = Math.round(worth);
            loot.profit.inputWorth = worth;
            return worth;
        },
        CALC_recyclingOutputWorth(lootId, recyclingPlantLevel) {
            "use strict";

            let resultingAmount = rHelper.data.loot[lootId].recyclingAmount;
            let resultingProducts = rHelper.data.loot[lootId].recyclingProduct;
            let worth = 0;

            if ($.isArray(resultingProducts)) {
                $.each(resultingProducts, (index, resultingProduct) => {
                    worth += rHelper.methods.CALC_recyclingOutputWorthHelper(recyclingPlantLevel, resultingProduct, resultingAmount, index);
                });
            } else {
                worth += rHelper.methods.CALC_recyclingOutputWorthHelper(recyclingPlantLevel, resultingProducts, resultingAmount);
            }

            worth = Math.round(worth);
            rHelper.data.loot[lootId].profit.outputWorth = worth;
            return worth;
        },
        CALC_recyclingOutputWorthHelper(recyclingPlantLevel, resultingProduct, resultingAmount, index) {
            "use strict";

            let price = rHelper.methods.CALC_returnPriceViaId(resultingProduct, 0);
            let amount = resultingAmount * recyclingPlantLevel;

            if ($.isArray(resultingAmount)) {
                amount = resultingAmount[index] * recyclingPlantLevel;
            }

            let worth = amount * price;
            return worth;
        },
        CALC_recyclingRequirement(lootId) {
            "use strict";

            return rHelper.data.loot[lootId].recyclingDivisor;
        },
        CALC_recyclingProducts(lootId, recyclingPlantLevel) {
            "use strict";

            let resultingAmount = rHelper.data.loot[lootId].recyclingAmount;
            let resultingProducts = rHelper.data.loot[lootId].recyclingProduct;
            let string = "";

            if ($.isArray(resultingProducts)) {
                $.each(resultingProducts, (index, resultingProduct) => {
                    string += rHelper.methods.CALC_recyclingProductsHelper(recyclingPlantLevel, resultingProduct, resultingAmount, index);
                });
            } else {
                string += rHelper.methods.CALC_recyclingProductsHelper(recyclingPlantLevel, resultingProducts, resultingAmount);
            }

            return string;
        },
        CALC_recyclingProductsHelper(recyclingPlantLevel, resultingProduct, resultingAmount, index) {
            "use strict";

            let product = rHelper.methods.CALC_convertId(resultingProduct);
            let icon = $(crEl("span")).addClass(product.icon);
            let amount = resultingAmount * recyclingPlantLevel;

            if ($.isArray(resultingAmount)) {
                amount = resultingAmount[index] * recyclingPlantLevel;
            }

            let string = `${icon[0].outerHTML} ${amount.toLocaleString("en-US")} `;
            return string;
        },
        CALC_buildingToLevel10(buildingId) {
            "use strict";

            let building = rHelper.data.buildings[buildingId];
            let buildingLevel = building.level;
            let level10Cost = 0;
            let level10Transportation = 0;

            for (let level = buildingLevel; level < 10; level += 1) {
                for (let i = 0; i <= 3; i += 1) {
                    if (i === 0) {
                        let cash = building.materialAmount0[level];
                        level10Cost += cash;
                    } else {
                        let selector = `materialAmount${i}`;
                        let materialAmount = building[selector][level];

                        if (typeof materialAmount === "number") {
                            let materialPrice = rHelper.methods.CALC_returnPriceViaId(building.material[i]);
                            let materialWorth = materialPrice * materialAmount;
                            let transportation = (rHelper.data.buildings[9].transportCost - 1) * materialWorth;
                            level10Cost += materialWorth;
                            level10Transportation += transportation;
                        }
                    }
                }
            }
            return {
                level10Cost: level10Cost,
                level10Transportation: Math.round(level10Transportation)
            };
        },
        CALC_warehouseUpgradeCost(targetLevel) {
            "use strict";

            return Math.pow(targetLevel - 1, 2) * 1250000;
        },
        CALC_warehouseCostFromTo(start, end) {
            "use strict";

            let warehouseCost = 0;
            for (let i = end; i > start; i -= 1) {
                warehouseCost += rHelper.methods.CALC_warehouseUpgradeCost(i);
            }
            return warehouseCost;
        },
        CALC_warehouseContingent(level) {
            "use strict";

            return Math.pow(level, 2) * 5000;
        },
        CALC_warehouseUpgradeCostContigentBased(startLevel, endContingent) {
            "use strict";

            let warehouseCost = 0;
            let nextBiggerTargetLevel = Math.ceil(Math.sqrt(endContingent / 5000));

            warehouseCost += rHelper.methods.CALC_warehouseCostFromTo(startLevel, nextBiggerTargetLevel);
            return warehouseCost;
        },
        CALC_warehouseUpgradeCostOnInput(id, type, value) {
            "use strict";

            let mode = $(`#warehouse-${type}-calc-1-${id}`).val();
            let currentWarehouseLevel = rHelper.data[type][id].warehouse.level;
            let upgradeCost = 0;

            switch (mode) {
                case "level":
                    upgradeCost = rHelper.methods.CALC_warehouseCostFromTo(currentWarehouseLevel, value);
                    break;
                case "contingent":
                    upgradeCost = rHelper.methods.CALC_warehouseUpgradeCostContigentBased(currentWarehouseLevel, value);
                    break;
            }

            return upgradeCost;
        },
        CALC_warehouseWorth(id, type) {
            "use strict";

            let price = 0;
            let priceId = 0;

            switch (type) {
                case "material":
                    priceId = id;
                    break;
                case "products":
                    priceId = id + 14;
                    break;
                case "loot":
                    priceId = id + 36;
                    break;
                case "units":
                    priceId = id + 51;
                    break;
            }

            price = rHelper.methods.CALC_returnPriceViaId(priceId);
            return price;
        },
        CALC_warehouseRemainingTimeToFull(id, type) {
            "use strict";

            let el = rHelper.data[type][id];
            let remainingCapacity = el.warehouse.contingent - el.warehouse.fillAmount;
            let remainingTime = 0;
            let divisor = 1;

            if (type == "material") {
                divisor = el.perHour;
            } else if (type == "products") {
                divisor = el.scaling * el.factoryLevel * rHelper.methods.CALC_factoryMinWorkload(id);
            }

            remainingTime = remainingCapacity / divisor;

            if (isNaN(remainingTime) || (type == "products" && el.turnover <= 0) || type == "loot" || type == "units") {
                remainingTime = "∞";
            } else {
                if (remainingTime > 24) {
                    remainingTime = `> ${(remainingTime / 24).toFixed(2)} days`;
                } else {
                    remainingTime = `> ${remainingTime.toFixed(2)} hours`;
                }
            }

            return remainingTime;
        },
        CALC_warehouseTotalLevel() {
            "use strict";

            let total = 0;

            let arr = ["material", "products", "loot", "units"];

            $.each(arr, (index, pointer) => {
                $.each(rHelper.data[pointer], (index, el) => {
                    total += el.warehouse.level;
                });
            });

            return total;
        },
        CALC_warehouseTotalWorth() {
            "use strict";

            let total = 0;

            let arr = ["material", "products", "loot", "units"];

            $.each(arr, (index, pointer) => {
                $.each(rHelper.data[pointer], (index, el) => {
                    total += rHelper.methods.CALC_warehouseWorth(index, pointer) * el.warehouse.fillAmount;
                });
            });

            return total;
        },
        CALC_flowDistributionHelper(type, dependantFactory, id, i) {
            "use strict";

            let originalIndex = 0;
            let dependantIconIndex = 0;
            let requiredAmountPerLevel = 0;
            let dependantObj = {};
            let requiredAmount = 0;
            let string = "";
            let arrow =
                '<svg xmlns="http://www.w3.org/2000/svg" width="15" fill="#fff" viewBox="0 0 31.49 31.49"><path d="M21.205 5.007c-.429-.444-1.143-.444-1.587 0-.429.429-.429 1.143 0 1.571l8.047 8.047H1.111C.492 14.626 0 15.118 0 15.737c0 .619.492 1.127 1.111 1.127h26.554l-8.047 8.032c-.429.444-.429 1.159 0 1.587.444.444 1.159.444 1.587 0l9.952-9.952c.444-.429.444-1.143 0-1.571l-9.952-9.953z"/></svg>';

            if (type == "material") {
                dependantIconIndex = dependantFactory - 14;
                dependantObj = rHelper.data.products[dependantIconIndex];

                if ($.isArray(dependantObj.dependencies)) {
                    originalIndex = dependantObj.dependencies.indexOf(id);
                    requiredAmountPerLevel = dependantObj.requiredAmount[originalIndex];
                } else {
                    originalIndex = dependantObj.dependencies;
                    requiredAmountPerLevel = dependantObj.requiredAmount;
                }
            } else {
                dependantIconIndex = dependantFactory;
                dependantObj = rHelper.data.products[dependantFactory];

                if ($.isArray(dependantObj.dependencies)) {
                    originalIndex = dependantObj.dependencies.indexOf(id + 14);
                    requiredAmountPerLevel = dependantObj.requiredAmount[originalIndex];
                } else {
                    originalIndex = dependantObj.dependencies;
                    requiredAmountPerLevel = dependantObj.requiredAmount;
                }
            }

            if (dependantObj.turnover > 0) {
                requiredAmount = dependantObj.factoryLevel * requiredAmountPerLevel;
            }

            string += `<span class="resources-${type}-${id}"></span> ${requiredAmount.toLocaleString("en-US")} ${arrow} <span class="resources-product-${dependantIconIndex}"></span>`;
            let name1 = "";
            let name2 = dependantObj.name;

            switch (type) {
                case "material":
                    name1 = rHelper.data.material[id].name;
                    break;
                case "product":
                    name1 = rHelper.data.products[id].name;
                    break;
            }

            $(`#flow-${type}-distribution-${id}-${i}`)
                .html(string)
                .attr("data-th", `${name1} to ${name2}`);
            return requiredAmount;
        },
        CALC_flowDistribution(id, type) {
            "use strict";

            let perHour = 0;
            let obj = {};
            let requiredAmount = 0;

            switch (type) {
                case "material":
                    obj = rHelper.data.material[id];
                    perHour = obj.perHour;
                    break;
                case "product":
                    obj = rHelper.data.products[id];
                    let factoryLevel = obj.factoryLevel;
                    let scaling = obj.scaling;
                    let workload = rHelper.methods.CALC_factoryMinWorkload(id);
                    perHour = factoryLevel * scaling * workload;
                    break;
            }

            let dependantFactories = obj.dependantFactories;

            if ($.isArray(dependantFactories)) {
                $.each(dependantFactories, (i, dependantFactory) => {
                    requiredAmount += rHelper.methods.CALC_flowDistributionHelper(type, dependantFactory, id, i);
                });
            } else if (dependantFactories != "") {
                requiredAmount += rHelper.methods.CALC_flowDistributionHelper(type, dependantFactories, id, 0);
            }

            return perHour - requiredAmount;
        },
        CALC_flowRate(id, type) {
            "use strict";

            let rate = 0;
            switch (type) {
                case "material":
                    rate = rHelper.data.material[id].perHour;
                    break;
                case "product":
                    let factory = rHelper.data.products[id];
                    let workload = rHelper.methods.CALC_factoryMinWorkload(id);
                    rate = factory.factoryLevel * factory.scaling * workload;
                    break;
            }
            return rate;
        },
        CALC_factoryMinWorkload(factoryId) {
            "use strict";

            let workload = rHelper.data.products[factoryId].dependencyWorkload.min();
            if (workload > 1) {
                workload = 1;
            }
            return workload;
        },
        CALC_diamondTotalProfit() {
            "use strict";

            let val = 0;

            $.each(rHelper.data.products, (i, factory) => {
                let diamondProfit = factory.diamond.profit;
                if (diamondProfit > 0) {
                    val += diamondProfit;
                }
            });

            return val;
        },
        CALC_diamondTop10Profit() {
            "use strict";

            let arr = [];

            $.each(rHelper.data.products, (i, factory) => {
                let diamondProfit = factory.diamond.profit;
                if (diamondProfit > 0) {
                    arr.push(diamondProfit);
                }
            });

            let sum = 0;
            arr = arr.sort((a, b) => {
                return b - a;
            });
            for (let i = 0; i <= 9; i += 1) {
                if (arr[i]) {
                    sum += arr[i];
                }
            }
            return sum;
        },
        CALC_diamondEfficiency(factoryId) {
            "use strict";

            let factoryDiamond = rHelper.data.products[factoryId].diamond;
            let efficiency = factoryDiamond.outputWorth / (factoryDiamond.dependenciesWorth + factoryDiamond.productionCost);
            if (isNaN(efficiency)) {
                efficiency = 0;
            }

            factoryDiamond.efficiency = efficiency;
            return efficiency;
        },
        CALC_diamondProfit(factoryId) {
            "use strict";

            let factoryDiamond = rHelper.data.products[factoryId].diamond;
            factoryDiamond.profit = factoryDiamond.outputWorth - (factoryDiamond.dependenciesWorth + factoryDiamond.productionCost);
            return factoryDiamond.profit;
        },
        CALC_nextGreaterWarehouseLevel(amount) {
            "use strict";

            return Math.ceil(Math.sqrt(amount / 5000));
        },
        CALC_diamondFactoryOutput(factoryId) {
            "use strict";

            let factory = rHelper.data.products[factoryId];
            let outputAmount = factory.factoryLevel * factory.scaling * 5 * 24;
            let productionCost = 5 * 24 * factory.cashPerHour;

            if (factory.factoryLevel == 0) {
                productionCost = 0;
            }

            rHelper.data.products[factoryId].diamond = {
                outputWorth: outputAmount * rHelper.methods.CALC_returnPriceViaId(factoryId + 14),
                dependenciesWorth: 0,
                productionCost: productionCost,
                efficiency: 0,
                profit: 0
            };
            return factory.factoryLevel * factory.scaling * 5 * 24;
        },
        CALC_dependantFactoriesHelper(dependantFactory, type) {
            "use strict";

            if (type == "material") {
                dependantFactory -= 14;
            }

            let fns = ["INSRT_factoryDependencies", "INSRT_factoryWorkload", "INSRT_factoryTurnover", "INSRT_factoryTurnoverPerUpgrade", "INSRT_factoryROI"];

            $.each(fns, (i, fn) => {
                rHelper.methods[fn](dependantFactory);
            });

            rHelper.methods.INSRT_factoryHighlightColumns();
            if (rHelper.data.products[dependantFactory].dependantFactories != "") {
                rHelper.methods.CALC_dependantFactories(dependantFactory, "product");
            }
        },
        CALC_dependantFactories(id, type) {
            "use strict";

            let dependantFactories = "";
            switch (type) {
                case "material":
                    dependantFactories = rHelper.data.material[id].dependantFactories;
                    break;
                case "product":
                    dependantFactories = rHelper.data.products[id].dependantFactories;
                    break;
            }

            if ($.isArray(dependantFactories)) {
                $.each(dependantFactories, (k, dependantFactory) => {
                    rHelper.methods.CALC_dependantFactoriesHelper(dependantFactory, type);
                });
            } else if (dependantFactories != "") {
                rHelper.methods.CALC_dependantFactoriesHelper(dependantFactories, type);
            }
        },
        CALC_factoryTurnoverPerUpgrade(factoryId) {
            "use strict";

            let value = 0;
            let nextLevelWorkloadArray = [];
            let dependencies = rHelper.data.products[factoryId].dependencies;

            if ($.isArray(dependencies)) {
                $.each(dependencies, dependencyIndex => {
                    let dependencyWorkload = rHelper.methods.CALC_factoryDepedencyWorkload(factoryId, dependencyIndex, "nextLevel");
                    nextLevelWorkloadArray.push(dependencyWorkload);
                });
            } else {
                let dependencyWorkload = rHelper.methods.CALC_factoryDepedencyWorkload(factoryId, 0, "nextLevel");
                nextLevelWorkloadArray.push(dependencyWorkload);
            }
            let nextLevelWorkload = nextLevelWorkloadArray.min();
            if (nextLevelWorkload > 1) {
                nextLevelWorkload = 1;
            }
            value = parseInt(rHelper.methods.CALC_factoryTurnover(factoryId, "nextLevel", nextLevelWorkload) - rHelper.data.products[factoryId].turnover);
            if (value < 10 && value > -10) {
                value = 0;
            }
            return value;
        },
        CALC_factoryDependencyExistingAmount(dependantObj, dependencyIndex) {
            "use strict";

            if (dependantObj.perHour) {
                return dependantObj.perHour;
            } else {
                //return dependantObj.factoryLevel * dependantObj.scaling * (dependantObj.dependencyWorkload[dependencyIndex] / 100);
                return dependantObj.factoryLevel * dependantObj.scaling;
            }
        },
        CALC_factoryWorkloadMinNonSanitized(factoryId) {
            "use strict";

            return rHelper.data.products[factoryId].dependencyWorkload.min();
        },
        CALC_factoryCashCostPerHour(factoryId, nextLevel) {
            "use strict";

            let factory = rHelper.data.products[factoryId];
            let factoryLevel = factory.factoryLevel;
            if (nextLevel) {
                factoryLevel += 1;
            }
            return factory.cashPerHour * factoryLevel;
        },
        CALC_factoryTurnover(factoryId, nextLevel, nextLevelWorkload) {
            "use strict";

            let factory = rHelper.data.products[factoryId];
            let price = rHelper.methods.CALC_returnPriceViaId(factoryId + 14);
            let factoryLevel = factory.factoryLevel;
            let cashCost = rHelper.methods.CALC_factoryCashCostPerHour(factoryId, nextLevel);
            let workload = rHelper.methods.CALC_factoryMinWorkload(factoryId);
            let materialWorth = 0;

            if (nextLevel) {
                factoryLevel += 1;
                workload = nextLevelWorkload;
            }
            let outputWorth = factory.scaling * factoryLevel * price;

            if ($.isArray(factory.dependencies)) {
                $.each(factory.dependencies, index => {
                    let dependencyWorth = rHelper.methods.CALC_factoryDependencyWorth(factoryId, index, nextLevel);
                    materialWorth += dependencyWorth;
                });
            } else {
                let dependencyWorth = rHelper.methods.CALC_factoryDependencyWorth(factoryId, 0, nextLevel);
                materialWorth += dependencyWorth;
            }

            let remainingValue = (outputWorth - materialWorth - cashCost) * workload;
            return remainingValue;
        },
        CALC_factoryDependencyWorth(factoryId, dependencyIndex, nextLevel) {
            "use strict";

            let factory = rHelper.data.products[factoryId];
            let factoryLevel = factory.factoryLevel;
            let requiredAmount = 0;
            let dependencyPrice = 0;

            if (nextLevel) {
                factoryLevel += 1;
            }
            if ($.isArray(factory.dependencies)) {
                requiredAmount = factory.requiredAmount[dependencyIndex];
                dependencyPrice = rHelper.methods.CALC_returnPriceViaId(factory.dependencies[dependencyIndex]);
            } else {
                requiredAmount = factory.requiredAmount;
                dependencyPrice = rHelper.methods.CALC_returnPriceViaId(factory.dependencies);
            }

            return factoryLevel * requiredAmount * dependencyPrice;
        },
        CALC_factoryDepedencyWorkload(factoryId, dependencyIndex, nextLevel) {
            "use strict";

            let workload = 0;
            let factory = rHelper.data.products[factoryId];
            let factoryLevel = factory.factoryLevel;
            let thisDependency;
            let baseAmountRequirement;
            let existingAmount = 0;

            if (nextLevel) {
                factoryLevel += 1;
            }

            if ($.isArray(factory.dependencies)) {
                thisDependency = factory.dependencies[dependencyIndex];
                baseAmountRequirement = factory.requiredAmount[dependencyIndex];
            } else {
                thisDependency = factory.dependencies;
                baseAmountRequirement = factory.requiredAmount;
            }

            let requiredAmount = baseAmountRequirement * factoryLevel;

            if (thisDependency <= 13) {
                existingAmount = rHelper.data.material[thisDependency].perHour;
            } else {
                let actualFactory = rHelper.methods.CALC_convertId(thisDependency);
                let minDependencyWorkload = actualFactory.dependencyWorkload.min();
                if (minDependencyWorkload > 1) {
                    minDependencyWorkload = 1;
                }
                existingAmount = actualFactory.factoryLevel * actualFactory.scaling * minDependencyWorkload;
            }

            workload = existingAmount / requiredAmount;
            if (isNaN(workload) || workload === Infinity) {
                workload = 0;
            }

            return workload;
        },
        CALC_factoryROI(factoryId) {
            "use strict";

            return rHelper.data.products[factoryId].upgradeCost / rHelper.data.products[factoryId].turnoverIncrease / 24;
        },
        CALC_factoryComparatorRequiredVsExistingAmount(requiredAmount, existingAmount) {
            "use strict";

            let addClass;

            if (isNaN(existingAmount)) {
                existingAmount = 0;
            }

            if (existingAmount < requiredAmount) {
                addClass = 'class="faulty-dependency"';
            } else {
                addClass = "";
            }

            return addClass;
        },
        CALC_factoryDependencyRequiredAmount(factoryId, dependencyIndex) {
            "use strict";

            let factory = rHelper.data.products[factoryId];
            let requiredAmount = 0;

            if ($.isArray(factory.requiredAmount)) {
                requiredAmount = factory.requiredAmount[dependencyIndex];
            } else {
                requiredAmount = factory.requiredAmount;
            }

            return requiredAmount * factory.factoryLevel;
        },
        CALC_totalFactoryUpgrades() {
            "use strict";

            let totalFactoryUpgrades = 0;

            $.each(rHelper.data.products, (i, factory) => {
                totalFactoryUpgrades += factory.factoryLevel;
            });

            return totalFactoryUpgrades;
        },
        CALC_factoryUpgradeCost(factoryId) {
            "use strict";

            let factoryLevel = rHelper.data.products[factoryId].factoryLevel;
            if (typeof factoryLevel == "undefined" || !factoryLevel) {
                factoryLevel = 0;
            }
            let nextLevel = factoryLevel + 1;
            let sum = 0;
            let sumTransportation = 0;
            let table = $(crEl("table"));
            let tbody = $(crEl("tbody"));
            let td;
            let small;

            $.each(rHelper.data.products[factoryId].upgradeMaterialAmount, (i, amount) => {
                let tr = $(crEl("tr"));
                let k = 0;
                if (i === 0) {
                    sum += amount * Math.pow(nextLevel, 2);
                    for (k = 0; k <= 2; k += 1) {
                        td = $(crEl("td"));
                        switch (k) {
                            case 0:
                                let img = $(crEl("img"))
                                    .attr("src", "assets/img/cash.png")
                                    .attr("alt", "Cash");
                                td.append(img[0]);
                                break;
                            case 1:
                                td
                                    .addClass("text-right")
                                    .attr("colspan", 3)
                                    .text(sum.toLocaleString("en-US"));
                                break;
                            case 2:
                                small = $(crEl("small")).text("Transportation");
                                td.addClass("text-right text-warning").append(small[0]);
                                break;
                        }
                        tr.append(td[0]);
                    }
                } else {
                    let upgradeMaterial = rHelper.data.products[factoryId].upgradeMaterial[i];
                    let upgradeMaterialAmount = amount * Math.pow(nextLevel, 2);
                    let price = rHelper.methods.CALC_returnPriceViaId(upgradeMaterial);
                    let materialWorth = price * upgradeMaterialAmount;
                    let transportation = (rHelper.data.buildings[9].transportCost - 1) * materialWorth;
                    let className;

                    sum += materialWorth;
                    sumTransportation += transportation;
                    upgradeMaterial += 1;

                    if (upgradeMaterial <= 13) {
                        className = "material";
                    } else if (upgradeMaterial >= 14 && upgradeMaterial <= 35) {
                        upgradeMaterial -= 14;
                        className = "product";
                    } else if (upgradeMaterial >= 36 && upgradeMaterial <= 51) {
                        upgradeMaterial -= 36;
                        className = "loot";
                    } else {
                        upgradeMaterial -= 51;
                        className = "units";
                    }

                    for (k = 0; k <= 4; k += 1) {
                        td = $(crEl("td"));
                        switch (k) {
                            case 0:
                                td.addClass(`resources-${className}-${upgradeMaterial - 1}`);
                                break;
                            case 1:
                                td.addClass("text-right").text(upgradeMaterialAmount.toLocaleString("en-US"));
                                break;
                            case 2:
                                td.text("≙");
                                break;
                            case 3:
                                td.addClass("text-right").text(materialWorth.toLocaleString("en-US"));
                                break;
                            case 4:
                                small = $(crEl("small"))
                                    .addClass("text-warning")
                                    .text(transportation.toLocaleString("en-US"));
                                td.addClass("text-right").append(small[0]);
                                break;
                        }
                        tr.append(td[0]);
                    }
                }
                tbody.append(tr[0]);
            });
            let tr = $(crEl("tr"));
            for (let k = 0; k <= 1; k += 1) {
                td = $(crEl("td")).addClass("text-right");

                if (k === 0) {
                    td.attr("colspan", 4).text(sum.toLocaleString("en-US"));
                } else {
                    small = $(crEl("small"))
                        .addClass("text-warning")
                        .text(sumTransportation.toLocaleString("en-US"));
                    td.append(small[0]);
                }
                tr.append(td[0]);
            }

            tbody.append(tr[0]);
            table.append(tbody[0]);
            rHelper.data.products[factoryId].upgradeCost = sum;

            let result = {
                sum: sum,
                title: table[0].outerHTML
            };
            return result;
        },
        CALC_factoryOutput(factoryId) {
            "use strict";

            let factory = rHelper.data.products[factoryId];
            return factory.factoryLevel * factory.scaling;
        },
        CALC_totalMineCount() {
            "use strict";

            let totalMineCount = 0;
            $.each(rHelper.data.material, (i, material) => {
                totalMineCount += material.amountOfMines;
            });

            return totalMineCount;
        },
        CALC_totalMineWorth() {
            "use strict";

            let totalMineWorth = 0;
            $.each(rHelper.data.material, i => {
                totalMineWorth += rHelper.methods.CALC_materialRateWorth(i);
            });

            return totalMineWorth;
        },
        CALC_returnPriceViaId(id, period) {
            "use strict";

            let possiblePrices = ["current", "1day", "3days", "7days", "4weeks", "3months", "6months", "1year", "max"];

            let index = 0;
            if (typeof period == "undefined") {
                let settings = rHelper.data.settings[5];
                let priceAgeSetting = 2;

                if (typeof settings !== undefined) {
                    priceAgeSetting = rHelper.data.settings[5].value;
                }

                index = possiblePrices[priceAgeSetting];
            } else if (typeof period === "number") {
                index = possiblePrices[period];
            }

            let target = rHelper.methods.CALC_convertId(id);
            let targetPrices = target.prices[index];

            if (targetPrices.ai >= targetPrices.player) {
                return targetPrices.ai;
            } else {
                return targetPrices.player;
            }
        },
        CALC_convertId(id) {
            "use strict";

            if (id <= 13) {
                return rHelper.data.material[id];
            } else if (id >= 14 && id <= 35) {
                id -= 14;
                return rHelper.data.products[id];
            } else if (id >= 36 && id <= 51) {
                id -= 36;
                return rHelper.data.loot[id];
            } else {
                id -= 52;
                return rHelper.data.units[id];
            }
        },
        CALC_materialNewMinePrice(totalMineCount, materialId) {
            "use strict";

            return Math.round(rHelper.data.material[materialId].basePrice * (1 + totalMineCount / 50));
        },
        CALC_materialRateWorth(materialId) {
            "use strict";

            return rHelper.data.material[materialId].perHour * rHelper.methods.CALC_returnPriceViaId(materialId);
        },
        CALC_materialMinePerfectIncome(materialId) {
            "use strict";

            return rHelper.data.material[materialId].maxRate * rHelper.methods.CALC_returnPriceViaId(materialId);
        },
        CALC_materialMineROI(type) {
            "use strict";

            let array = [];

            for (let i = 0; i <= 13; i += 1) {
                let newMinePrice = rHelper.methods.CALC_materialNewMinePrice(rHelper.methods.CALC_totalMineCount(), i);
                let perfectIncome = rHelper.methods.CALC_materialMinePerfectIncome(i);
                let customTUPrice = rHelper.methods.CALC_customTUPrice();

                switch (type) {
                    case "100":
                        array.push(newMinePrice / perfectIncome / 24);
                        break;
                    case "505":
                        array.push((newMinePrice + customTUPrice) / perfectIncome / 24 / 5.05);
                        break;
                    case "505hq":
                        let userHQLevel = 1;
                        if (rHelper.data.headquarter.user) {
                            userHQLevel = rHelper.data.headquarter.user.level;
                        }
                        let hqBoost = rHelper.data.headquarter[userHQLevel - 1].boost - 0.9;
                        array.push((newMinePrice + customTUPrice) / perfectIncome / 24 / 5.05 / hqBoost);
                        break;
                }
            }

            return array;
        },
        CALC_customTUPrice() {
            "use strict";

            let customTUPrice = 0;
            let tuIndex = 46;

            let settings = rHelper.data.settings[1];
            let customTUCombination = [111, 26, 0, 0];

            if (typeof settings !== undefined) {
                customTUCombination = settings.value;
            }

            for (let i = 0; i <= 3; i += 1) {
                customTUPrice += customTUCombination[i] * rHelper.methods.CALC_returnPriceViaId(tuIndex + i);
            }

            return customTUPrice;
        }
    },
    graphs: {
        gaugeOptions: {
            chart: {
                type: "solidgauge",
                backgroundColor: "transparent"
            },
            title: null,
            pane: {
                center: ["50%", "85%"],
                size: "140%",
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: "#EEE",
                    innerRadius: "60%",
                    outerRadius: "100%",
                    shape: "arc"
                }
            },
            tooltip: {
                enabled: false
            },
            yAxis: {
                minColor: "rgba(255, 127, 80, 0.75)",
                maxColor: "rgba(154, 205, 50, 0.75)",
                lineWidth: 0,
                minorTickInterval: null,
                title: {
                    y: -70
                },
                labels: {
                    y: 16
                }
            },
            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        y: 5,
                        borderWidth: 0,
                        style: {
                            color: "#dedede"
                        },
                        useHTML: true
                    }
                }
            }
        },
        material: {
            target: "graph-material",
            categories: [],
            mineData: [],
            incomeData: [],
            data: [],
            colors: ["#8a4f3e", "#a4938e", "#aba59a", "#2d2c2b", "#8a5a3a", "#d8d8d8", "#b58359", "#b87259", "#9b7953", "#c4b9ab", "#957e60", "#cccbc2", "#b28b3d", "#b0a17d"],
            reference: {
                mineCount: 0,
                mineIncome: 0
            },
            seriesNames: ["Mines", "Mine income"],
            responsiveId: "income",
            titleText: "mine distribution vs mine income"
        }
    },
    data: {},
    tu: [
        {
            tu1: 145,
            tu2: 1,
            tu3: 2,
            tu4: 2,
            factor: 5.049546987548256
        },
        {
            tu1: 142,
            tu2: 4,
            tu3: 1,
            tu4: 2,
            factor: 5.049537328215894
        },
        {
            tu1: 141,
            tu2: 1,
            tu3: 5,
            tu4: 1,
            factor: 5.049975808955912
        },
        {
            tu1: 139,
            tu2: 7,
            tu3: 0,
            tu4: 2,
            factor: 5.04952766890201
        },
        {
            tu1: 138,
            tu2: 4,
            tu3: 4,
            tu4: 1,
            factor: 5.049966148803255
        },
        {
            tu1: 135,
            tu2: 7,
            tu3: 3,
            tu4: 1,
            factor: 5.049956488669072
        },
        {
            tu1: 135,
            tu2: 2,
            tu3: 8,
            tu4: 0,
            factor: 5.049909577605985
        },
        {
            tu1: 132,
            tu2: 10,
            tu3: 2,
            tu4: 1,
            factor: 5.049946828553374
        },
        {
            tu1: 132,
            tu2: 5,
            tu3: 7,
            tu4: 0,
            factor: 5.049899917580023
        },
        {
            tu1: 129,
            tu2: 13,
            tu3: 1,
            tu4: 1,
            factor: 5.049937168456153
        },
        {
            tu1: 129,
            tu2: 8,
            tu3: 6,
            tu4: 0,
            factor: 5.049890257572537
        },
        {
            tu1: 126,
            tu2: 16,
            tu3: 0,
            tu4: 1,
            factor: 5.049927508377411
        },
        {
            tu1: 126,
            tu2: 11,
            tu3: 5,
            tu4: 0,
            factor: 5.049880597583531
        },
        {
            tu1: 123,
            tu2: 14,
            tu3: 4,
            tu4: 0,
            factor: 5.0498709376130035
        },
        {
            tu1: 120,
            tu2: 17,
            tu3: 3,
            tu4: 0,
            factor: 5.0498612776609555
        },
        {
            tu1: 117,
            tu2: 20,
            tu3: 2,
            tu4: 0,
            factor: 5.049851617727384
        },
        {
            tu1: 114,
            tu2: 23,
            tu3: 1,
            tu4: 0,
            factor: 5.049841957812293
        },
        {
            tu1: 111,
            tu2: 26,
            tu3: 0,
            tu4: 0,
            factor: 5.049832297915679
        },
        {
            tu1: 99,
            tu2: 0,
            tu3: 0,
            tu4: 13,
            factor: 5.0498315619730025
        },
        {
            tu1: 93,
            tu2: 1,
            tu3: 3,
            tu4: 12,
            factor: 5.049765332514903
        },
        {
            tu1: 90,
            tu2: 4,
            tu3: 2,
            tu4: 12,
            factor: 5.049755672764868
        },
        {
            tu1: 87,
            tu2: 7,
            tu3: 1,
            tu4: 12,
            factor: 5.049746013033308
        },
        {
            tu1: 87,
            tu2: 2,
            tu3: 6,
            tu4: 11,
            factor: 5.0496991039254135
        },
        {
            tu1: 84,
            tu2: 10,
            tu3: 0,
            tu4: 12,
            factor: 5.04973635332023
        },
        {
            tu1: 84,
            tu2: 5,
            tu3: 5,
            tu4: 11,
            factor: 5.049689444302067
        },
        {
            tu1: 84,
            tu2: 0,
            tu3: 10,
            tu4: 10,
            factor: 5.049642535719661
        },
        {
            tu1: 81,
            tu2: 8,
            tu3: 4,
            tu4: 11,
            factor: 5.049679784697198
        },
        {
            tu1: 81,
            tu2: 3,
            tu3: 9,
            tu4: 10,
            factor: 5.049632876204525
        },
        {
            tu1: 78,
            tu2: 11,
            tu3: 3,
            tu4: 11,
            factor: 5.049670125110809
        },
        {
            tu1: 78,
            tu2: 6,
            tu3: 8,
            tu4: 10,
            factor: 5.049623216707865
        },
        {
            tu1: 78,
            tu2: 1,
            tu3: 13,
            tu4: 9,
            factor: 5.049576308740673
        },
        {
            tu1: 75,
            tu2: 14,
            tu3: 2,
            tu4: 11,
            factor: 5.049660465542896
        },
        {
            tu1: 75,
            tu2: 9,
            tu3: 7,
            tu4: 10,
            factor: 5.0496135572296845
        },
        {
            tu1: 75,
            tu2: 4,
            tu3: 12,
            tu4: 9,
            factor: 5.049566649352222
        },
        {
            tu1: 72,
            tu2: 17,
            tu3: 1,
            tu4: 11,
            factor: 5.049650805993463
        },
        {
            tu1: 72,
            tu2: 12,
            tu3: 6,
            tu4: 10,
            factor: 5.049603897769982
        },
        {
            tu1: 72,
            tu2: 7,
            tu3: 11,
            tu4: 9,
            factor: 5.049556989982251
        },
        {
            tu1: 72,
            tu2: 2,
            tu3: 16,
            tu4: 8,
            factor: 5.049510082630265
        },
        {
            tu1: 71,
            tu2: 4,
            tu3: 15,
            tu4: 8,
            factor: 5.049995472429614
        },
        {
            tu1: 69,
            tu2: 20,
            tu3: 0,
            tu4: 11,
            factor: 5.049641146462505
        },
        {
            tu1: 69,
            tu2: 15,
            tu3: 5,
            tu4: 10,
            factor: 5.049594238328755
        },
        {
            tu1: 69,
            tu2: 10,
            tu3: 10,
            tu4: 9,
            factor: 5.049547330630755
        },
        {
            tu1: 69,
            tu2: 5,
            tu3: 15,
            tu4: 8,
            factor: 5.0495004233685
        },
        {
            tu1: 68,
            tu2: 7,
            tu3: 14,
            tu4: 8,
            factor: 5.049985812239343
        },
        {
            tu1: 68,
            tu2: 2,
            tu3: 19,
            tu4: 7,
            factor: 5.049938900903856
        },
        {
            tu1: 66,
            tu2: 18,
            tu3: 4,
            tu4: 10,
            factor: 5.049584578906008
        },
        {
            tu1: 66,
            tu2: 13,
            tu3: 9,
            tu4: 9,
            factor: 5.049537671297738
        },
        {
            tu1: 65,
            tu2: 10,
            tu3: 13,
            tu4: 8,
            factor: 5.049976152067548
        },
        {
            tu1: 65,
            tu2: 5,
            tu3: 18,
            tu4: 7,
            factor: 5.0499292408218
        },
        {
            tu1: 65,
            tu2: 0,
            tu3: 23,
            tu4: 6,
            factor: 5.049882330011827
        },
        {
            tu1: 63,
            tu2: 21,
            tu3: 3,
            tu4: 10,
            factor: 5.049574919501737
        },
        {
            tu1: 63,
            tu2: 16,
            tu3: 8,
            tu4: 9,
            factor: 5.049528011983197
        },
        {
            tu1: 62,
            tu2: 13,
            tu3: 12,
            tu4: 8,
            factor: 5.049966491914233
        },
        {
            tu1: 62,
            tu2: 8,
            tu3: 17,
            tu4: 7,
            factor: 5.049919580758222
        },
        {
            tu1: 62,
            tu2: 3,
            tu3: 22,
            tu4: 6,
            factor: 5.049872670037985
        },
        {
            tu1: 60,
            tu2: 24,
            tu3: 2,
            tu4: 10,
            factor: 5.049565260115945
        },
        {
            tu1: 60,
            tu2: 19,
            tu3: 7,
            tu4: 9,
            factor: 5.0495183526871354
        },
        {
            tu1: 59,
            tu2: 16,
            tu3: 11,
            tu4: 8,
            factor: 5.049956831779397
        },
        {
            tu1: 59,
            tu2: 11,
            tu3: 16,
            tu4: 7,
            factor: 5.049909920713121
        },
        {
            tu1: 59,
            tu2: 6,
            tu3: 21,
            tu4: 6,
            factor: 5.049863010082621
        },
        {
            tu1: 59,
            tu2: 1,
            tu3: 26,
            tu4: 5,
            factor: 5.049816099887894
        },
        {
            tu1: 57,
            tu2: 27,
            tu3: 1,
            tu4: 10,
            factor: 5.049555600748631
        },
        {
            tu1: 57,
            tu2: 22,
            tu3: 6,
            tu4: 9,
            factor: 5.049508693409551
        },
        {
            tu1: 56,
            tu2: 24,
            tu3: 5,
            tu4: 9,
            factor: 5.049994083075359
        },
        {
            tu1: 56,
            tu2: 19,
            tu3: 10,
            tu4: 8,
            factor: 5.0499471716630415
        },
        {
            tu1: 56,
            tu2: 14,
            tu3: 15,
            tu4: 7,
            factor: 5.049900260686504
        },
        {
            tu1: 56,
            tu2: 9,
            tu3: 20,
            tu4: 6,
            factor: 5.049853350145739
        },
        {
            tu1: 56,
            tu2: 4,
            tu3: 25,
            tu4: 5,
            factor: 5.049806440040745
        },
        {
            tu1: 54,
            tu2: 30,
            tu3: 0,
            tu4: 10,
            factor: 5.049545941399794
        },
        {
            tu1: 53,
            tu2: 27,
            tu3: 4,
            tu4: 9,
            factor: 5.049984422887742
        },
        {
            tu1: 53,
            tu2: 22,
            tu3: 9,
            tu4: 8,
            factor: 5.049937511565163
        },
        {
            tu1: 53,
            tu2: 17,
            tu3: 14,
            tu4: 7,
            factor: 5.049890600678362
        },
        {
            tu1: 53,
            tu2: 12,
            tu3: 19,
            tu4: 6,
            factor: 5.049843690227331
        },
        {
            tu1: 53,
            tu2: 7,
            tu3: 24,
            tu4: 5,
            factor: 5.049796780212072
        },
        {
            tu1: 53,
            tu2: 2,
            tu3: 29,
            tu4: 4,
            factor: 5.04974987063258
        },
        {
            tu1: 50,
            tu2: 30,
            tu3: 3,
            tu4: 9,
            factor: 5.049974762718609
        },
        {
            tu1: 50,
            tu2: 25,
            tu3: 8,
            tu4: 8,
            factor: 5.049927851485765
        },
        {
            tu1: 50,
            tu2: 20,
            tu3: 13,
            tu4: 7,
            factor: 5.0498809406887
        },
        {
            tu1: 50,
            tu2: 15,
            tu3: 18,
            tu4: 6,
            factor: 5.049834030327405
        },
        {
            tu1: 50,
            tu2: 10,
            tu3: 23,
            tu4: 5,
            factor: 5.049787120401883
        },
        {
            tu1: 50,
            tu2: 5,
            tu3: 28,
            tu4: 4,
            factor: 5.049740210912124
        },
        {
            tu1: 50,
            tu2: 0,
            tu3: 33,
            tu4: 3,
            factor: 5.049693301858126
        },
        {
            tu1: 47,
            tu2: 33,
            tu3: 2,
            tu4: 9,
            factor: 5.04996510256795
        },
        {
            tu1: 47,
            tu2: 28,
            tu3: 7,
            tu4: 8,
            factor: 5.049918191424844
        },
        {
            tu1: 47,
            tu2: 23,
            tu3: 12,
            tu4: 7,
            factor: 5.049871280717514
        },
        {
            tu1: 47,
            tu2: 18,
            tu3: 17,
            tu4: 6,
            factor: 5.049824370445955
        },
        {
            tu1: 47,
            tu2: 13,
            tu3: 22,
            tu4: 5,
            factor: 5.049777460610167
        },
        {
            tu1: 47,
            tu2: 8,
            tu3: 27,
            tu4: 4,
            factor: 5.049730551210141
        },
        {
            tu1: 47,
            tu2: 3,
            tu3: 32,
            tu4: 3,
            factor: 5.049683642245876
        },
        {
            tu1: 45,
            tu2: 1,
            tu3: 1,
            tu4: 23,
            factor: 5.04955486484628
        },
        {
            tu1: 44,
            tu2: 36,
            tu3: 1,
            tu4: 9,
            factor: 5.049955442435773
        },
        {
            tu1: 44,
            tu2: 31,
            tu3: 6,
            tu4: 8,
            factor: 5.0499085313824015
        },
        {
            tu1: 44,
            tu2: 26,
            tu3: 11,
            tu4: 7,
            factor: 5.04986162076481
        },
        {
            tu1: 44,
            tu2: 21,
            tu3: 16,
            tu4: 6,
            factor: 5.049814710582987
        },
        {
            tu1: 44,
            tu2: 16,
            tu3: 21,
            tu4: 5,
            factor: 5.049767800836931
        },
        {
            tu1: 44,
            tu2: 11,
            tu3: 26,
            tu4: 4,
            factor: 5.049720891526639
        },
        {
            tu1: 44,
            tu2: 6,
            tu3: 31,
            tu4: 3,
            factor: 5.049673982652109
        },
        {
            tu1: 44,
            tu2: 1,
            tu3: 36,
            tu4: 2,
            factor: 5.049627074213331
        },
        {
            tu1: 42,
            tu2: 4,
            tu3: 0,
            tu4: 23,
            factor: 5.04954520549885
        },
        {
            tu1: 41,
            tu2: 39,
            tu3: 0,
            tu4: 9,
            factor: 5.049945782322073
        },
        {
            tu1: 41,
            tu2: 34,
            tu3: 5,
            tu4: 8,
            factor: 5.049898871358441
        },
        {
            tu1: 41,
            tu2: 29,
            tu3: 10,
            tu4: 7,
            factor: 5.049851960830583
        },
        {
            tu1: 41,
            tu2: 24,
            tu3: 15,
            tu4: 6,
            factor: 5.049805050738495
        },
        {
            tu1: 41,
            tu2: 19,
            tu3: 20,
            tu4: 5,
            factor: 5.049758141082175
        },
        {
            tu1: 41,
            tu2: 14,
            tu3: 25,
            tu4: 4,
            factor: 5.0497112318616155
        },
        {
            tu1: 41,
            tu2: 9,
            tu3: 30,
            tu4: 3,
            factor: 5.049664323076817
        },
        {
            tu1: 41,
            tu2: 4,
            tu3: 35,
            tu4: 2,
            factor: 5.049617414727771
        },
        {
            tu1: 41,
            tu2: 1,
            tu3: 4,
            tu4: 22,
            factor: 5.049983686922897
        },
        {
            tu1: 38,
            tu2: 37,
            tu3: 4,
            tu4: 8,
            factor: 5.049889211352958
        },
        {
            tu1: 38,
            tu2: 32,
            tu3: 9,
            tu4: 7,
            factor: 5.049842300914835
        },
        {
            tu1: 38,
            tu2: 27,
            tu3: 14,
            tu4: 6,
            factor: 5.0497953909124815
        },
        {
            tu1: 38,
            tu2: 22,
            tu3: 19,
            tu4: 5,
            factor: 5.049748481345896
        },
        {
            tu1: 38,
            tu2: 17,
            tu3: 24,
            tu4: 4,
            factor: 5.04970157221507
        },
        {
            tu1: 38,
            tu2: 12,
            tu3: 29,
            tu4: 3,
            factor: 5.049654663520003
        },
        {
            tu1: 38,
            tu2: 7,
            tu3: 34,
            tu4: 2,
            factor: 5.049607755260688
        },
        {
            tu1: 38,
            tu2: 4,
            tu3: 3,
            tu4: 22,
            factor: 5.049974026755169
        },
        {
            tu1: 38,
            tu2: 2,
            tu3: 39,
            tu4: 1,
            factor: 5.0495608474371245
        },
        {
            tu1: 35,
            tu2: 40,
            tu3: 3,
            tu4: 8,
            factor: 5.049879551365952
        },
        {
            tu1: 35,
            tu2: 35,
            tu3: 8,
            tu4: 7,
            factor: 5.049832641017565
        },
        {
            tu1: 35,
            tu2: 30,
            tu3: 13,
            tu4: 6,
            factor: 5.049785731104946
        },
        {
            tu1: 35,
            tu2: 25,
            tu3: 18,
            tu4: 5,
            factor: 5.049738821628093
        },
        {
            tu1: 35,
            tu2: 20,
            tu3: 23,
            tu4: 4,
            factor: 5.049691912587002
        },
        {
            tu1: 35,
            tu2: 15,
            tu3: 28,
            tu4: 3,
            factor: 5.049645003981666
        },
        {
            tu1: 35,
            tu2: 10,
            tu3: 33,
            tu4: 2,
            factor: 5.049598095812083
        },
        {
            tu1: 35,
            tu2: 7,
            tu3: 2,
            tu4: 22,
            factor: 5.049964366605918
        },
        {
            tu1: 35,
            tu2: 5,
            tu3: 38,
            tu4: 1,
            factor: 5.04955118807825
        },
        {
            tu1: 35,
            tu2: 2,
            tu3: 7,
            tu4: 21,
            factor: 5.04991745546965
        },
        {
            tu1: 35,
            tu2: 0,
            tu3: 43,
            tu4: 0,
            factor: 5.049504280780161
        },
        {
            tu1: 34,
            tu2: 2,
            tu3: 42,
            tu4: 0,
            factor: 5.049989670021802
        },
        {
            tu1: 32,
            tu2: 43,
            tu3: 2,
            tu4: 8,
            factor: 5.049869891397425
        },
        {
            tu1: 32,
            tu2: 38,
            tu3: 7,
            tu4: 7,
            factor: 5.049822981138776
        },
        {
            tu1: 32,
            tu2: 33,
            tu3: 12,
            tu4: 6,
            factor: 5.0497760713158915
        },
        {
            tu1: 32,
            tu2: 28,
            tu3: 17,
            tu4: 5,
            factor: 5.049729161928772
        },
        {
            tu1: 32,
            tu2: 23,
            tu3: 22,
            tu4: 4,
            factor: 5.049682252977412
        },
        {
            tu1: 32,
            tu2: 18,
            tu3: 27,
            tu4: 3,
            factor: 5.049635344461809
        },
        {
            tu1: 32,
            tu2: 13,
            tu3: 32,
            tu4: 2,
            factor: 5.049588436381957
        },
        {
            tu1: 32,
            tu2: 10,
            tu3: 1,
            tu4: 22,
            factor: 5.049954706475151
        },
        {
            tu1: 32,
            tu2: 8,
            tu3: 37,
            tu4: 1,
            factor: 5.049541528737853
        },
        {
            tu1: 32,
            tu2: 5,
            tu3: 6,
            tu4: 21,
            factor: 5.049907795428617
        },
        {
            tu1: 32,
            tu2: 0,
            tu3: 11,
            tu4: 20,
            factor: 5.0498608848178606
        },
        {
            tu1: 31,
            tu2: 5,
            tu3: 41,
            tu4: 0,
            factor: 5.049980009842626
        },
        {
            tu1: 29,
            tu2: 46,
            tu3: 1,
            tu4: 8,
            factor: 5.049860231447379
        },
        {
            tu1: 29,
            tu2: 41,
            tu3: 6,
            tu4: 7,
            factor: 5.049813321278463
        },
        {
            tu1: 29,
            tu2: 36,
            tu3: 11,
            tu4: 6,
            factor: 5.0497664115453125
        },
        {
            tu1: 29,
            tu2: 31,
            tu3: 16,
            tu4: 5,
            factor: 5.049719502247926
        },
        {
            tu1: 29,
            tu2: 26,
            tu3: 21,
            tu4: 4,
            factor: 5.049672593386299
        },
        {
            tu1: 29,
            tu2: 21,
            tu3: 26,
            tu4: 3,
            factor: 5.049625684960429
        },
        {
            tu1: 29,
            tu2: 16,
            tu3: 31,
            tu4: 2,
            factor: 5.049578776970308
        },
        {
            tu1: 29,
            tu2: 13,
            tu3: 0,
            tu4: 22,
            factor: 5.049945046362859
        },
        {
            tu1: 29,
            tu2: 11,
            tu3: 36,
            tu4: 1,
            factor: 5.049531869415934
        },
        {
            tu1: 29,
            tu2: 8,
            tu3: 5,
            tu4: 21,
            factor: 5.049898135406062
        },
        {
            tu1: 29,
            tu2: 3,
            tu3: 10,
            tu4: 20,
            factor: 5.049851224885041
        },
        {
            tu1: 28,
            tu2: 8,
            tu3: 40,
            tu4: 0,
            factor: 5.0499703496819315
        },
        {
            tu1: 26,
            tu2: 49,
            tu3: 0,
            tu4: 8,
            factor: 5.049850571515811
        },
        {
            tu1: 26,
            tu2: 44,
            tu3: 5,
            tu4: 7,
            factor: 5.04980366143663
        },
        {
            tu1: 26,
            tu2: 39,
            tu3: 10,
            tu4: 6,
            factor: 5.049756751793213
        },
        {
            tu1: 26,
            tu2: 34,
            tu3: 15,
            tu4: 5,
            factor: 5.049709842585562
        },
        {
            tu1: 26,
            tu2: 29,
            tu3: 20,
            tu4: 4,
            factor: 5.049662933813666
        },
        {
            tu1: 26,
            tu2: 24,
            tu3: 25,
            tu4: 3,
            factor: 5.049616025477527
        },
        {
            tu1: 26,
            tu2: 19,
            tu3: 30,
            tu4: 2,
            factor: 5.049569117577137
        },
        {
            tu1: 26,
            tu2: 14,
            tu3: 35,
            tu4: 1,
            factor: 5.049522210112495
        },
        {
            tu1: 26,
            tu2: 11,
            tu3: 4,
            tu4: 21,
            factor: 5.049888475401987
        },
        {
            tu1: 26,
            tu2: 6,
            tu3: 9,
            tu4: 20,
            factor: 5.049841564970703
        },
        {
            tu1: 26,
            tu2: 1,
            tu3: 14,
            tu4: 19,
            factor: 5.049794654975186
        },
        {
            tu1: 25,
            tu2: 11,
            tu3: 39,
            tu4: 0,
            factor: 5.049960689539718
        },
        {
            tu1: 23,
            tu2: 47,
            tu3: 4,
            tu4: 7,
            factor: 5.049794001613272
        },
        {
            tu1: 23,
            tu2: 42,
            tu3: 9,
            tu4: 6,
            factor: 5.049747092059591
        },
        {
            tu1: 23,
            tu2: 37,
            tu3: 14,
            tu4: 5,
            factor: 5.049700182941672
        },
        {
            tu1: 23,
            tu2: 32,
            tu3: 19,
            tu4: 4,
            factor: 5.0496532742595095
        },
        {
            tu1: 23,
            tu2: 27,
            tu3: 24,
            tu4: 3,
            factor: 5.0496063660131005
        },
        {
            tu1: 23,
            tu2: 22,
            tu3: 29,
            tu4: 2,
            factor: 5.049559458202443
        },
        {
            tu1: 23,
            tu2: 17,
            tu3: 34,
            tu4: 1,
            factor: 5.049512550827528
        },
        {
            tu1: 23,
            tu2: 14,
            tu3: 3,
            tu4: 21,
            factor: 5.04987881541639
        },
        {
            tu1: 23,
            tu2: 9,
            tu3: 8,
            tu4: 20,
            factor: 5.049831905074838
        },
        {
            tu1: 23,
            tu2: 4,
            tu3: 13,
            tu4: 19,
            factor: 5.049784995169057
        },
        {
            tu1: 22,
            tu2: 19,
            tu3: 33,
            tu4: 1,
            factor: 5.049997940864136
        },
        {
            tu1: 22,
            tu2: 14,
            tu3: 38,
            tu4: 0,
            factor: 5.049951029415983
        },
        {
            tu1: 20,
            tu2: 50,
            tu3: 3,
            tu4: 7,
            factor: 5.0497843418083965
        },
        {
            tu1: 20,
            tu2: 45,
            tu3: 8,
            tu4: 6,
            factor: 5.049737432344448
        },
        {
            tu1: 20,
            tu2: 40,
            tu3: 13,
            tu4: 5,
            factor: 5.0496905233162614
        },
        {
            tu1: 20,
            tu2: 35,
            tu3: 18,
            tu4: 4,
            factor: 5.0496436147238315
        },
        {
            tu1: 20,
            tu2: 30,
            tu3: 23,
            tu4: 3,
            factor: 5.049596706567155
        },
        {
            tu1: 20,
            tu2: 25,
            tu3: 28,
            tu4: 2,
            factor: 5.0495497988462255
        },
        {
            tu1: 20,
            tu2: 20,
            tu3: 33,
            tu4: 1,
            factor: 5.049502891561041
        },
        {
            tu1: 20,
            tu2: 17,
            tu3: 2,
            tu4: 21,
            factor: 5.049869155449271
        },
        {
            tu1: 20,
            tu2: 12,
            tu3: 7,
            tu4: 20,
            factor: 5.049822245197458
        },
        {
            tu1: 20,
            tu2: 7,
            tu3: 12,
            tu4: 19,
            factor: 5.049775335381408
        },
        {
            tu1: 20,
            tu2: 2,
            tu3: 17,
            tu4: 18,
            factor: 5.049728426001126
        },
        {
            tu1: 19,
            tu2: 22,
            tu3: 32,
            tu4: 1,
            factor: 5.04998828066914
        },
        {
            tu1: 19,
            tu2: 17,
            tu3: 37,
            tu4: 0,
            factor: 5.049941369310724
        },
        {
            tu1: 17,
            tu2: 53,
            tu3: 2,
            tu4: 7,
            factor: 5.049774682021998
        },
        {
            tu1: 17,
            tu2: 48,
            tu3: 7,
            tu4: 6,
            factor: 5.049727772647783
        },
        {
            tu1: 17,
            tu2: 43,
            tu3: 12,
            tu4: 5,
            factor: 5.049680863709329
        },
        {
            tu1: 17,
            tu2: 38,
            tu3: 17,
            tu4: 4,
            factor: 5.049633955206633
        },
        {
            tu1: 17,
            tu2: 33,
            tu3: 22,
            tu4: 3,
            factor: 5.049587047139687
        },
        {
            tu1: 17,
            tu2: 28,
            tu3: 27,
            tu4: 2,
            factor: 5.049540139508489
        },
        {
            tu1: 17,
            tu2: 20,
            tu3: 1,
            tu4: 21,
            factor: 5.049859495500633
        },
        {
            tu1: 17,
            tu2: 15,
            tu3: 6,
            tu4: 20,
            factor: 5.049812585338551
        },
        {
            tu1: 17,
            tu2: 10,
            tu3: 11,
            tu4: 19,
            factor: 5.04976567561224
        },
        {
            tu1: 17,
            tu2: 5,
            tu3: 16,
            tu4: 18,
            factor: 5.04971876632169
        },
        {
            tu1: 17,
            tu2: 0,
            tu3: 21,
            tu4: 17,
            factor: 5.049671857466898
        },
        {
            tu1: 16,
            tu2: 25,
            tu3: 31,
            tu4: 1,
            factor: 5.0499786204926265
        },
        {
            tu1: 16,
            tu2: 20,
            tu3: 36,
            tu4: 0,
            factor: 5.049931709223946
        },
        {
            tu1: 14,
            tu2: 56,
            tu3: 1,
            tu4: 7,
            factor: 5.049765022254077
        },
        {
            tu1: 14,
            tu2: 51,
            tu3: 6,
            tu4: 6,
            factor: 5.049718112969596
        },
        {
            tu1: 14,
            tu2: 46,
            tu3: 11,
            tu4: 5,
            factor: 5.049671204120877
        },
        {
            tu1: 14,
            tu2: 41,
            tu3: 16,
            tu4: 4,
            factor: 5.0496242957079085
        },
        {
            tu1: 14,
            tu2: 36,
            tu3: 21,
            tu4: 3,
            factor: 5.049577387730693
        },
        {
            tu1: 14,
            tu2: 31,
            tu3: 26,
            tu4: 2,
            factor: 5.049530480189225
        },
        {
            tu1: 14,
            tu2: 23,
            tu3: 0,
            tu4: 21,
            factor: 5.04984983557047
        },
        {
            tu1: 14,
            tu2: 18,
            tu3: 5,
            tu4: 20,
            factor: 5.049802925498126
        },
        {
            tu1: 14,
            tu2: 13,
            tu3: 10,
            tu4: 19,
            factor: 5.049756015861548
        },
        {
            tu1: 14,
            tu2: 8,
            tu3: 15,
            tu4: 18,
            factor: 5.049709106660732
        },
        {
            tu1: 14,
            tu2: 3,
            tu3: 20,
            tu4: 17,
            factor: 5.049662197895673
        },
        {
            tu1: 13,
            tu2: 28,
            tu3: 30,
            tu4: 1,
            factor: 5.049968960334589
        },
        {
            tu1: 13,
            tu2: 23,
            tu3: 35,
            tu4: 0,
            factor: 5.049922049155645
        },
        {
            tu1: 11,
            tu2: 59,
            tu3: 0,
            tu4: 7,
            factor: 5.049755362504633
        },
        {
            tu1: 11,
            tu2: 54,
            tu3: 5,
            tu4: 6,
            factor: 5.049708453309886
        },
        {
            tu1: 11,
            tu2: 49,
            tu3: 10,
            tu4: 5,
            factor: 5.049661544550898
        },
        {
            tu1: 11,
            tu2: 44,
            tu3: 15,
            tu4: 4,
            factor: 5.049614636227664
        },
        {
            tu1: 11,
            tu2: 39,
            tu3: 20,
            tu4: 3,
            factor: 5.049567728340177
        },
        {
            tu1: 11,
            tu2: 34,
            tu3: 25,
            tu4: 2,
            factor: 5.04952082088844
        },
        {
            tu1: 11,
            tu2: 21,
            tu3: 4,
            tu4: 20,
            factor: 5.049793265676176
        },
        {
            tu1: 11,
            tu2: 16,
            tu3: 9,
            tu4: 19,
            factor: 5.049746356129333
        },
        {
            tu1: 11,
            tu2: 11,
            tu3: 14,
            tu4: 18,
            factor: 5.049699447018249
        },
        {
            tu1: 11,
            tu2: 6,
            tu3: 19,
            tu4: 17,
            factor: 5.049652538342924
        },
        {
            tu1: 11,
            tu2: 1,
            tu3: 24,
            tu4: 16,
            factor: 5.0496056301033505
        },
        {
            tu1: 10,
            tu2: 31,
            tu3: 29,
            tu4: 1,
            factor: 5.049959300195031
        },
        {
            tu1: 10,
            tu2: 26,
            tu3: 34,
            tu4: 0,
            factor: 5.049912389105826
        },
        {
            tu1: 8,
            tu2: 57,
            tu3: 4,
            tu4: 6,
            factor: 5.0496987936686555
        },
        {
            tu1: 8,
            tu2: 52,
            tu3: 9,
            tu4: 5,
            factor: 5.049651884999401
        },
        {
            tu1: 8,
            tu2: 47,
            tu3: 14,
            tu4: 4,
            factor: 5.049604976765895
        },
        {
            tu1: 8,
            tu2: 42,
            tu3: 19,
            tu4: 3,
            factor: 5.0495580689681425
        },
        {
            tu1: 8,
            tu2: 37,
            tu3: 24,
            tu4: 2,
            factor: 5.049511161606134
        },
        {
            tu1: 8,
            tu2: 24,
            tu3: 3,
            tu4: 20,
            factor: 5.049783605872708
        },
        {
            tu1: 8,
            tu2: 19,
            tu3: 8,
            tu4: 19,
            factor: 5.049736696415597
        },
        {
            tu1: 8,
            tu2: 14,
            tu3: 13,
            tu4: 18,
            factor: 5.0496897873942475
        },
        {
            tu1: 8,
            tu2: 9,
            tu3: 18,
            tu4: 17,
            factor: 5.049642878808654
        },
        {
            tu1: 8,
            tu2: 4,
            tu3: 23,
            tu4: 16,
            factor: 5.049595970658812
        },
        {
            tu1: 7,
            tu2: 39,
            tu3: 23,
            tu4: 2,
            factor: 5.0499965515092
        },
        {
            tu1: 7,
            tu2: 34,
            tu3: 28,
            tu4: 1,
            factor: 5.049949640073952
        },
        {
            tu1: 7,
            tu2: 29,
            tu3: 33,
            tu4: 0,
            factor: 5.049902729074482
        },
        {
            tu1: 5,
            tu2: 60,
            tu3: 3,
            tu4: 6,
            factor: 5.049689134045903
        },
        {
            tu1: 5,
            tu2: 55,
            tu3: 8,
            tu4: 5,
            factor: 5.0496422254663775
        },
        {
            tu1: 5,
            tu2: 50,
            tu3: 13,
            tu4: 4,
            factor: 5.049595317322606
        },
        {
            tu1: 5,
            tu2: 45,
            tu3: 18,
            tu4: 3,
            factor: 5.049548409614583
        },
        {
            tu1: 5,
            tu2: 40,
            tu3: 23,
            tu4: 2,
            factor: 5.049501502342305
        },
        {
            tu1: 5,
            tu2: 27,
            tu3: 2,
            tu4: 20,
            factor: 5.049773946087716
        },
        {
            tu1: 5,
            tu2: 22,
            tu3: 7,
            tu4: 19,
            factor: 5.049727036720341
        },
        {
            tu1: 5,
            tu2: 17,
            tu3: 12,
            tu4: 18,
            factor: 5.049680127788722
        },
        {
            tu1: 5,
            tu2: 12,
            tu3: 17,
            tu4: 17,
            factor: 5.04963321929286
        },
        {
            tu1: 5,
            tu2: 7,
            tu3: 22,
            tu4: 16,
            factor: 5.0495863112327495
        },
        {
            tu1: 5,
            tu2: 2,
            tu3: 27,
            tu4: 15,
            factor: 5.049539403608389
        },
        {
            tu1: 4,
            tu2: 42,
            tu3: 22,
            tu4: 2,
            factor: 5.0499868913168635
        },
        {
            tu1: 4,
            tu2: 37,
            tu3: 27,
            tu4: 1,
            factor: 5.049939979971354
        },
        {
            tu1: 4,
            tu2: 32,
            tu3: 32,
            tu4: 0,
            factor: 5.049893069061621
        },
        {
            tu1: 2,
            tu2: 63,
            tu3: 2,
            tu4: 6,
            factor: 5.049679474441627
        },
        {
            tu1: 2,
            tu2: 58,
            tu3: 7,
            tu4: 5,
            factor: 5.049632565951837
        },
        {
            tu1: 2,
            tu2: 53,
            tu3: 12,
            tu4: 4,
            factor: 5.0495856578977945
        },
        {
            tu1: 2,
            tu2: 48,
            tu3: 17,
            tu4: 3,
            factor: 5.049538750279503
        },
        {
            tu1: 2,
            tu2: 30,
            tu3: 1,
            tu4: 20,
            factor: 5.049764286321205
        },
        {
            tu1: 2,
            tu2: 25,
            tu3: 6,
            tu4: 19,
            factor: 5.049717377043561
        },
        {
            tu1: 2,
            tu2: 20,
            tu3: 11,
            tu4: 18,
            factor: 5.049670468201676
        },
        {
            tu1: 2,
            tu2: 15,
            tu3: 16,
            tu4: 17,
            factor: 5.049623559795545
        },
        {
            tu1: 2,
            tu2: 10,
            tu3: 21,
            tu4: 16,
            factor: 5.0495766518251655
        },
        {
            tu1: 2,
            tu2: 5,
            tu3: 26,
            tu4: 15,
            factor: 5.049529744290536
        },
        {
            tu1: 1,
            tu2: 45,
            tu3: 21,
            tu4: 2,
            factor: 5.049977231143005
        },
        {
            tu1: 1,
            tu2: 40,
            tu3: 26,
            tu4: 1,
            factor: 5.049930319887234
        },
        {
            tu1: 1,
            tu2: 35,
            tu3: 31,
            tu4: 0,
            factor: 5.049883409067237
        },
        {
            tu1: 1,
            tu2: 2,
            tu3: 30,
            tu4: 14,
            factor: 5.0499682243719946
        }
    ]
};

(() => {
    $("#loading-text").text("fetching data");
    if (typeof (localStorage.rGame) != "undefined" && getCookie("loggedIn") != 1) {
        // if logged out and data in localStorage
        rHelper.data = JSON.parse(localStorage.getItem("rGame"));
        loadingAnimToggler("hide");
        console.log("Found existing data!");
        rHelper.init.core();
    } else {
        // if logged in or no data in localStorage
        $.get({
            url: "api/core.php",
            success: response => {
                rHelper.data = response;
                localStorage.setItem("rGame", JSON.stringify(response));
                loadingAnimToggler("hide");
                switch (parseInt(getCookie("loggedIn"))) {
                    case 1:
                        console.log("Returning user - fetched existing data!");
                        break;
                    default:
                        console.log("New user - fetched basic data!");
                        break;
                }
                rHelper.init.user();
            },
            error: response => {
                swal("Error fetching data", `Error message:<br />${response}<br /> Please try again.`, "error");
            }
        });
    }
})();

let openedWindow;
