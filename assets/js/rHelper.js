"use strict";

var rHelper = {
	"init": {
		user() {
			rHelper.fn.INSRT_userSettings();
			rHelper.init.core();
		},
		core() {
			rHelper.fn.SET_tabSwitcherAnchorBased();

			rHelper.fn.SET_transportCost("init");

			$.each(rHelper.data.material, function (materialId) {

				rHelper.fn.EVNT_materialInput(materialId);

				rHelper.fn.INSRT_materialRate(materialId);
				rHelper.fn.INSRT_materialAmountOfMines(materialId);
				rHelper.fn.INSRT_materialNewMinePrice(materialId);
				rHelper.fn.INSRT_materialRateWorth(materialId);
				rHelper.fn.INSRT_materialNewMinePerfectIncome(materialId);

				rHelper.fn.INSRT_flowRate(materialId, "material");

				rHelper.fn.INSRT_warehouseFillAmount(materialId, "material");
				rHelper.fn.INSRT_warehouseLevel(materialId, "material");
				rHelper.fn.INSRT_warehouseFillStatus(materialId, "material");
				rHelper.fn.INSRT_warehouseCapacity(materialId, "material");
				rHelper.fn.INSRT_warehouseWorth(materialId, "material");
				rHelper.fn.INSRT_warehouseRemainingTimeToFull(materialId, "material");
				rHelper.fn.EVNT_warehouseInput(materialId, "material");

			});

			rHelper.fn.INSRT_totalMineWorth(rHelper.fn.CALC_totalMineWorth());
			rHelper.fn.INSRT_totalMineCount(rHelper.fn.CALC_totalMineCount());
			rHelper.fn.INSRT_materialMineAmortisation();
			rHelper.fn.INSRT_materialHighlightMinePerfectIncome();

			var calculationOrder = rHelper.fn.GET_calculationOrder();

			$.each(calculationOrder, function (index, factoryId) {

				rHelper.fn.EVNT_factoryInput(factoryId);

				rHelper.fn.INSRT_factoryLevel(factoryId);
				rHelper.fn.INSRT_factoryOutput(factoryId);
				rHelper.fn.INSRT_factoryUpgradeCost(factoryId);
				rHelper.fn.INSRT_factoryDependencies(factoryId);
				rHelper.fn.INSRT_factoryWorkload(factoryId);
				rHelper.fn.INSRT_factoryTurnover(factoryId);
				rHelper.fn.INSRT_factoryTurnoverPerUpgrade(factoryId);
				rHelper.fn.INSRT_factoryROI(factoryId);

				rHelper.fn.INSRT_diamondFactoryOutput(factoryId);
				rHelper.fn.INSRT_diamondFactoryOutputWarehouse(factoryId);
				rHelper.fn.INSRT_diamondDependencies(factoryId);
				rHelper.fn.INSRT_diamondEfficiency(factoryId);
				rHelper.fn.INSRT_diamondProfit(factoryId);

				rHelper.fn.INSRT_flowRate(factoryId, "product");

				rHelper.fn.INSRT_warehouseFillAmount(index, "products");
				rHelper.fn.INSRT_warehouseLevel(index, "products");
				rHelper.fn.INSRT_warehouseFillStatus(index, "products");
				rHelper.fn.INSRT_warehouseCapacity(index, "products");
				rHelper.fn.INSRT_warehouseWorth(index, "products");
				rHelper.fn.INSRT_warehouseRemainingTimeToFull(factoryId, "products");
				rHelper.fn.EVNT_warehouseInput(factoryId, "products");

			});

			rHelper.fn.INSRT_totalFactoryUpgrades();
			rHelper.fn.INSRT_factoryHighlightColumns();

			rHelper.fn.INSRT_diamondTop10Profit();
			rHelper.fn.INSRT_diamondTotalProfit();

			rHelper.fn.INSRT_flowDistributionGlobal();

			// warehouses
			$.each(rHelper.data.loot, function (index) {
				rHelper.fn.INSRT_warehouseFillAmount(index, "loot");
				rHelper.fn.INSRT_warehouseLevel(index, "loot");
				rHelper.fn.INSRT_warehouseFillStatus(index, "loot");
				rHelper.fn.INSRT_warehouseCapacity(index, "loot");
				rHelper.fn.INSRT_warehouseWorth(index, "loot");
				rHelper.fn.EVNT_warehouseInput(index, "loot");


				// recycling table
				if (index == 4 || index >= 10 && index <= 13) {
					return;
				}

				rHelper.fn.SET_recyclingProfitObj(index);
				rHelper.fn.INSRT_recyclingRequirement(index);
				rHelper.fn.INSRT_recyclingProducts(index);
				rHelper.fn.INSRT_recyclingOutputWorth(index);
				rHelper.fn.INSRT_recyclingInputWorth(index);
				rHelper.fn.INSRT_recyclingProfit(index);
			});

			$.each(rHelper.data.units, function (index, unit) {
				rHelper.fn.INSRT_warehouseFillAmount(index, "units");
				rHelper.fn.INSRT_warehouseLevel(index, "units");
				rHelper.fn.INSRT_warehouseFillStatus(index, "units");
				rHelper.fn.INSRT_warehouseCapacity(index, "units");
				rHelper.fn.INSRT_warehouseWorth(index, "units");
				rHelper.fn.EVNT_warehouseInput(index, "units");

				// units table
				rHelper.fn.SET_UnitProfitObj(index);
				rHelper.fn.INSRT_unitsCraftingPrice(index);
				rHelper.fn.INSRT_unitsMarketPrice(index);
				rHelper.fn.INSRT_unitsProfit(index);
			});

			rHelper.fn.INSRT_warehouseTotalLevel();
			rHelper.fn.INSRT_warehouseTotalWorth();

			// buildings
			$.each(rHelper.data.buildings, function (buildingId) {
				rHelper.fn.INSRT_buildingName(buildingId);
				rHelper.fn.SET_buildingBackgroundColor(buildingId);
				rHelper.fn.INSRT_buildingData(buildingId);
				rHelper.fn.INSRT_buildingToLevel10(buildingId);

				rHelper.fn.EVNT_buildingChange(buildingId);
			});

			// headquarter
			$.each(rHelper.data.headquarter, function (headquarterLevel) {
				rHelper.fn.INSRT_headquarterOvwString(headquarterLevel);
				rHelper.fn.INSRT_headquarterOvwRadius(headquarterLevel);
				rHelper.fn.INSRT_headquarterOvwCost(headquarterLevel);
				rHelper.fn.INSRT_headquarterOvwBoost(headquarterLevel);
				rHelper.fn.INSRT_headquarterOvwTransportation(headquarterLevel);
			});

			// techupgrades
			rHelper.fn.INSRT_techUpgradeRows();

			// initiate graphs
			var pieGraphs = [
				"material",
			];
			$.each(pieGraphs, function (i, val) {
				rHelper.fn.EVNT_buildGraph(val);
			});

			var gaugeGraphs = [
				"buildings",
				"headquarter",
			];
			$.each(gaugeGraphs, function (i, val) {
				rHelper.fn.INSRT_gaugeGraph(val);
			});

			rHelper.fn.INSRT_companyWorth();

			rHelper.fn.EVNT_sortableTables();

			rHelper.fn.EVNT_assignTitleToIcons();
			rHelper.fn.EVNT_enableTippy();
		}
	},
	"fn": {
		GET_calculationOrder() {
			return [
				0, 1, 2, 3, 4, 7, 8, 9, 10, 15, 17, 18, // primary order - dependant on material
				5, 6, 13, 19, // secondary order - dependant on materials and products
				11, 12, 14, 16, 20, 21 // tertiary order - dependant on products
			];
		},

		API_toggleLoader(selector) {
			var el = $("#api-" + selector + "-loading");

			if (el.css("display") == "none") {
				el.fadeIn("fast").css("display", "flex");
			} else {
				el.fadeOut("fast");
			}
		},
		API_toggleSuccessor(selector) {
			var el = $("#api-" + selector + "-finished");

			if (el.css("display") == "none") {
				el.fadeIn("fast");
			} else {
				el.fadeOut("fast");
			}
		},
		API_toggleSuccessorHelper(selector) {
			setTimeout(function () {
				rHelper.fn.API_toggleSuccessor(selector);
			}, 15000);
		},
		API_getFactories(key) {
			rHelper.fn.API_toggleLoader("factories");
			$.get("api/core.php?query=1&key=" + key + "", function (data) {

				$.each(data, function (i, value) {
					rHelper.data.products[i].factoryLevel = value;
				});

				var calculationOrder = rHelper.fn.GET_calculationOrder();

				$.each(calculationOrder, function (index, factoryId) {

					rHelper.fn.INSRT_factoryLevel(factoryId);
					rHelper.fn.INSRT_factoryOutput(factoryId);
					rHelper.fn.INSRT_factoryUpgradeCost(factoryId);
					rHelper.fn.INSRT_factoryDependencies(factoryId);
					rHelper.fn.INSRT_factoryWorkload(factoryId);
					rHelper.fn.INSRT_factoryTurnover(factoryId);
					rHelper.fn.INSRT_factoryTurnoverPerUpgrade(factoryId);
					rHelper.fn.INSRT_factoryROI(factoryId);
				});

				rHelper.fn.INSRT_totalFactoryUpgrades();
				rHelper.fn.INSRT_factoryHighlightColumns();

				rHelper.fn.API_toggleLoader("factories");
				rHelper.fn.API_toggleSuccessor("factories");
				rHelper.fn.API_toggleSuccessorHelper("factories");
			});
		},
		API_getWarehouse(key) {
			rHelper.fn.API_toggleLoader("warehouse");

			$.getJSON("api/core.php?query=2&key=" + key, function (data) {
				$.each(data, function (i, warehouseInfo) {
					var iterator = i;
					var targetObj = "material";
					if (i >= 14 && i < 36) {
						iterator -= 14;
						var targetObj = "products";
					} else if (i >= 36 && i < 52) {
						iterator -= 36;
						var targetObj = "loot";
					} else if (i >= 52) {
						iterator -= 52;
						var targetObj = "units";
					}

					rHelper.data[targetObj][iterator].warehouse.level = warehouseInfo.level;
					rHelper.data[targetObj][iterator].warehouse.fillAmount = warehouseInfo.fillAmount;
					rHelper.data[targetObj][iterator].warehouse.contingent = Math.pow(warehouseInfo.level, 2) * 5000;

					var fillStatus = rHelper.data[targetObj][iterator].warehouse.fillAmount / rHelper.data[targetObj][iterator].warehouse.contingent;
					if (isNaN(fillStatus)) {
						fillStatus = 0;
					}
					rHelper.data[targetObj][iterator].warehouse.fillStatus = fillStatus;
				});
				rHelper.fn.API_toggleLoader("warehouse");
				rHelper.fn.API_toggleSuccessor("warehouse");
				rHelper.fn.API_toggleSuccessorHelper("warehouse");
			});
		},
		API_getMineSummary(key) {
			rHelper.fn.API_toggleLoader("mines-summary");

			$.get("api/core.php?query=51&key=" + key + "", function (data) {

				$.each(data, function (i, obj) {
					rHelper.data.material[i].perHour = obj.perHour;
					rHelper.data.material[i].amountOfMines = obj.amountOfMines;
				});

				$.each(rHelper.data.material, function (materialId) {

					rHelper.fn.INSRT_materialRate(materialId);
					rHelper.fn.INSRT_materialAmountOfMines(materialId);
					rHelper.fn.INSRT_materialNewMinePrice(materialId);
					rHelper.fn.INSRT_materialRateWorth(materialId);
					rHelper.fn.INSRT_materialNewMinePerfectIncome(materialId);
					rHelper.fn.CALC_dependantFactories(materialId, "material");
				});

				rHelper.fn.INSRT_totalMineWorth(rHelper.fn.CALC_totalMineWorth());
				rHelper.fn.INSRT_totalMineCount(rHelper.fn.CALC_totalMineCount());
				rHelper.fn.INSRT_materialMineAmortisation();
				rHelper.fn.INSRT_materialHighlightMinePerfectIncome();

				rHelper.fn.API_toggleLoader("mines-summary");
				rHelper.fn.API_toggleSuccessor("mines-summary");
				rHelper.fn.API_toggleSuccessorHelper("mines-summary");
			});
		},
		API_getMineMap() {
			$.getJSON("api/core.php?mineMap", function (data) {
				rHelper.data.mineMap = data;

				rHelper.fn.API_toggleLoader("mines-detailed");
				rHelper.fn.API_toggleSuccessor("mines-detailed");
				rHelper.fn.API_toggleSuccessorHelper("mines-detailed");
			});
		},
		API_getMineMapInitiator(key) {
			rHelper.fn.API_toggleLoader("mines-detailed");

			$.getJSON("api/core.php?query=5&key=" + key, function (data) {
				if (data.callback == "rHelper.fn.API_getMineMap()") {
					rHelper.fn.API_getMineMap();
				} else {
					swal("Error", "Couldn't fetch mine details - API potentially unavailable!", "error");
				}
			});

		},
		API_getPlayerInfo(key, anonymity) {
			rHelper.fn.API_toggleLoader("player");

			var url = "api/core.php?query=7&key=" + key;
			if (anonymity) {
				url += "&anonymity=true";
			}

			$.getJSON(url, function (data) {
				rHelper.data.userInformation.level = data.lvl;
				rHelper.data.userInformation.points = data.points;
				rHelper.data.userInformation.rank = data.worldrank;

				if (data.name) {
					rHelper.data.userInformation.name = data.name;
				}

				/*
				src https://stackoverflow.com/questions/10535782/how-can-i-convert-a-date-in-epoch-to-y-m-d-his-in-javascript
				*/
				var iso = new Date(data.registerdate * 1000).toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/);
				rHelper.data.userInformation.registeredGame = iso[1] + ' ' + iso[2];

				rHelper.fn.API_toggleLoader("player");
				rHelper.fn.API_toggleSuccessor("player");
				rHelper.fn.API_toggleSuccessorHelper("player");
			});

		},
		API_getAttackLog() {
			$.getJSON("api/core.php?attackLog", function (data) {
				rHelper.data.attackLog = data;

				rHelper.fn.API_toggleLoader("attack-log");
				rHelper.fn.API_toggleSuccessor("attack-log");
				rHelper.fn.API_toggleSuccessorHelper("attack-log");
			});
		},
		API_getAttackLogInitiator(key) {
			rHelper.fn.API_toggleLoader("attack-log");

			$.getJSON("api/core.php?query=9&key=" + key, function (data) {
				console.log(data);
				if (data.callback == "rHelper.fn.API_getAttackLog()") {
					rHelper.fn.API_getAttackLog();
				} else {
					swal("Error", "Couldn't fetch attack log - API potentially unavailable!", "error");
				}
			});
		},
		API_getTradeLog() {

			$.getJSON("api/core.php?tradeLog", function (data) {
				rHelper.data.tradeLog = data;

				rHelper.fn.API_toggleLoader("trade-log");
				rHelper.fn.API_toggleSuccessor("trade-log");
				rHelper.fn.API_toggleSuccessorHelper("trade-log");
			});
		},
		API_getTradeLogInitiator(key) {
			rHelper.fn.API_toggleLoader("trade-log");

			$.getJSON("api/core.php?query=6&key=" + key, function (data) {
				if (data.callback == "rHelper.fn.API_getTradeLog()") {
					rHelper.fn.API_getTradeLog();
				} else {
					swal("Error", "Couldn't fetch trade log - API potentially unavailable!", "error");
				}
			});
		},
		API_getMissions() {
			$.getJSON("api/core.php?missions", function (data) {
				rHelper.data.missions = data;
				rHelper.fn.API_toggleLoader("missions");
				rHelper.fn.API_toggleSuccessor("missions");
				rHelper.fn.API_toggleSuccessorHelper("missions");
			});
		},
		API_getMissionsInitiator(key) {
			rHelper.fn.API_toggleLoader("missions");

			$.getJSON("api/core.php?query=10&key=" + key, function (data) {
				if (data.callback == "rHelper.fn.API_getMissions()") {
					rHelper.fn.API_getMissions();
				}
			});
		},
		API_getBuildings(key) {
			rHelper.fn.API_toggleLoader("buildings");

			$.getJSON("api/core.php?query=3&key=" + key, function (data) {

				$.each(data, function (i, buildingLevel) {
					rHelper.data.buildings[i].level = buildingLevel;
				});

				rHelper.fn.API_toggleLoader("buildings");
				rHelper.fn.API_toggleSuccessor("buildings");
				rHelper.fn.API_toggleSuccessorHelper("buildings");
			});

		},
		API_getHeadquarter(key) {
			rHelper.fn.API_toggleLoader("headquarter");

			$.getJSON("api/core.php?query=4&key=" + key, function (data) {

				rHelper.data.headquarter.user.hqPosition.lat = data.lat;
				rHelper.data.headquarter.user.hqPosition.lon = data.lon;
				rHelper.data.headquarter.user.level = data.level;

				$.each(data.paid, function (i, paid) {
					rHelper.data.headquarter.user.paid[i] = paid;
				});

				rHelper.fn.API_toggleLoader("headquarter");
				rHelper.fn.API_toggleSuccessor("headquarter");
				rHelper.fn.API_toggleSuccessorHelper("headquarter");
			});
		},
		API_getCreditInformation(key) {
			$("#api-credits").html('<span id="api-credits-loading" class="circles-to-rhombuses-spinner"><span class="rhombuses-circle"></span><span class="rhombuses-circle"></span><span class="rhombuses-circle"></span></span>');
			$("#api-credits-loading").css("display", "flex");
			$.get("api/core.php?query=0&key=" + key + "", function (data) {
				var remainingCredits = parseInt(data[0].creditsleft);
				rHelper.data.userInformation.remainingCredits = remainingCredits;
				rHelper.fn.INSRT_API_remainingCredits(remainingCredits);
				$("#api-submit").attr("disabled", false);
				$("#api-credits-loading").css("display", "none");
			});
		},
		API_init(key, queries, anonymity) {
			if ($.isArray(queries)) {
				$.each(queries, function (i, query) {

					switch (query) {
					case 1:
						rHelper.fn.API_getFactories(key); // STABLE
						break;
					case 2:
						rHelper.fn.API_getWarehouse(key); // STABLE
						break;
					case 3:
						rHelper.fn.API_getBuildings(key); // STABLE
						break;
					case 4:
						rHelper.fn.API_getHeadquarter(key); // STABLE
						break;
					case 5:
						rHelper.fn.API_getMineMapInitiator(key); // STABLE
						break;
					case 51:
						rHelper.fn.API_getMineSummary(key); // STABLE
						break;
					case 6:
						rHelper.fn.API_getTradeLogInitiator(key); // STABLE
						break;
					case 7:
						rHelper.fn.API_getPlayerInfo(key, anonymity); // STABLE
						break;
					case 9:
						rHelper.fn.API_getAttackLogInitiator(key); // STABLE
						break;
					case 10:
						rHelper.fn.API_getMissionsInitiator(key);
						break;
					}

					if (query == queries[queries.length - 1]) {
						rHelper.fn.API_getCreditInformation(key);
					}
				});
			};
		},

		SET_globalObject(selector, index, key, value) {

			if ($.isArray(key)) {
				rHelper.data[selector][index][key[0]][key[1]] = value;
				console.log(selector, index, key[0], key[1], value);
			} else {
				rHelper.data[selector][index][key] = value;
				console.log(selector, index, key, value);
			}

		},
		SET_save() {
			localStorage.setItem("rGame", JSON.stringify(rHelper.data));
		},
		SET_tabSwitcherAnchorBased() {
			var anchor = "#" + window.location.hash.substr(1);

			if (anchor == "#") {
				anchor = "#factories";
			}

			$(".nav-link").each(function (i, navLink) {
				var navEl = $(navLink);
				var target = $("#" + navLink.dataset.target);
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
			rHelper.data.buildings[9].transportCost = 1 + (15 - rHelper.data.buildings[9].level) / 100;

			if (!init) {
				$.each(rHelper.data.buildings, function (buildingId) {

					rHelper.fn.SET_buildingBackgroundColor(buildingId);
					rHelper.fn.INSRT_buildingData(buildingId);
					rHelper.fn.INSRT_buildingToLevel10(buildingId);

				});

				var calculationOrder = rHelper.fn.GET_calculationOrder();

				$.each(calculationOrder, function (index, factoryId) {

					rHelper.fn.INSRT_factoryUpgradeCost(factoryId);
					rHelper.fn.INSRT_factoryROI(factoryId);

					rHelper.fn.INSRT_flowDistributionGlobal();

				});
			}
		},
		SET_buildingBackgroundColor(buildingId) {
			var colorArray = [
				"rgba(255, 127, 80, 0.25)",
				"rgba(244, 134, 77, 0.25)",
				"rgba(234, 142, 74, 0.25)",
				"rgba(224, 150, 71, 0.25)",
				"rgba(214, 158, 68, 0.25)",
				"rgba(204, 166, 65, 0.25)",
				"rgba(194, 173, 62, 0.25)",
				"rgba(184, 181, 59, 0.25)",
				"rgba(174, 189, 56, 0.25)",
				"rgba(164, 197, 53, 0.25)",
				"rgba(154, 205, 50, 0.25)"
			];

			$("#building-" + buildingId).css("background-color", colorArray[rHelper.data.buildings[buildingId].level]);
		},
		SET_buildingTableVisibility(buildingId, state) {
			var tbody = $("#building-" + buildingId + " tbody");
			var tfoot = $("#building-" + buildingId + " tfoot");

			$.each([tbody, tfoot], function (i, el) {

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
			rHelper.data.loot[lootId].profit = {
				"outputWorth": 0,
				"inputWorth": 0,
				"profit": 0
			};
		},
		SET_recyclingPlantLevel() {
			$.each(rHelper.data.loot, function (lootId) {
				if (lootId == 4 || lootId >= 10 && lootId <= 13) {
					return;
				}

				rHelper.fn.INSRT_recyclingProducts(lootId);
				rHelper.fn.INSRT_recyclingOutputWorth(lootId);
				rHelper.fn.INSRT_recyclingInputWorth(lootId);
				rHelper.fn.INSRT_recyclingProfit(lootId);
			})
		},
		SET_UnitProfitObj(unitId) {
			rHelper.data.units[unitId].profit = {
				"craftingPrice": 0,
				"marketPrice": 0,
				"profit": 0
			}
		},

		EVNT_enableTippy() {
			$.each($("[title]"), function (i, el) {
				if (!el._tippy) {
					tippy(el, {
						dynamicTitle: true
					});
				}
			});
		},
		EVNT_assignTitleToIconsHelper(min, max, subSelector, incrementor) {
			for (var i = min; i <= max; i += 1) {
				$.each($(".resources-" + subSelector + "-" + i + ""), function (k, el) {
					if (!$(el).attr("title")) {
						var convertedId = i + incrementor;
						$(el).attr("title", rHelper.fn.CALC_returnPriceViaId(convertedId).toLocaleString("en-US"));
					}
				});
			}
		},
		EVNT_assignTitleToIcons() {
			rHelper.fn.EVNT_assignTitleToIconsHelper(0, 13, "material", 0);
			rHelper.fn.EVNT_assignTitleToIconsHelper(0, 21, "product", 14);
			rHelper.fn.EVNT_assignTitleToIconsHelper(0, 16, "loot", 36);
			rHelper.fn.EVNT_assignTitleToIconsHelper(0, 5, "unit", 52);
		},
		EVNT_sortableTables() {
			var tables = [
				$("#module-mines table")[0],
				$("#module-factories table")[0],
				$("#module-diamond table")[0],
				$("#techupgrades-combinations-tbl")[0],
				$("#recycling-tbl")[0],
				$("#units-tbl")[0],
			];

			$.each(tables, function (index, table) {
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
			$("#factories-level-" + factoryId).on("input", function () {
				var factoryId = parseInt(this.id.replace("factories-level-", ""));
				var factoryLevel = parseInt(this.value);

				rHelper.fn.SET_globalObject("products", factoryId, "factoryLevel", factoryLevel);

				rHelper.fn.INSRT_factoryOutput(factoryId);
				rHelper.fn.INSRT_factoryUpgradeCost(factoryId);
				rHelper.fn.INSRT_factoryDependencies(factoryId);
				rHelper.fn.INSRT_factoryWorkload(factoryId);
				rHelper.fn.INSRT_factoryTurnover(factoryId);
				rHelper.fn.INSRT_factoryTurnoverPerUpgrade(factoryId);
				rHelper.fn.INSRT_factoryROI(factoryId);

				rHelper.fn.CALC_dependantFactories(factoryId, "product");

				rHelper.fn.INSRT_diamondFactoryLevel(factoryId);
				rHelper.fn.INSRT_diamondFactoryOutput(factoryId);
				rHelper.fn.INSRT_diamondFactoryOutputWarehouse(factoryId);
				rHelper.fn.INSRT_diamondDependencies(factoryId);
				rHelper.fn.INSRT_diamondEfficiency(factoryId);
				rHelper.fn.INSRT_diamondProfit(factoryId);
				rHelper.fn.INSRT_diamondTop10Profit();
				rHelper.fn.INSRT_diamondTotalProfit();

				rHelper.fn.INSRT_flowRate(factoryId, "product");
				rHelper.fn.INSRT_flowDistributionGlobal();

				rHelper.fn.INSRT_factoryHighlightColumns();
			});
		},
		EVNT_materialInput(materialId) {
			$("#material-rate-" + materialId).on("input", function () {
				var materialId = this.id.replace("material-rate-", "");
				var materialAmount = parseInt(this.value);

				rHelper.fn.SET_globalObject("material", materialId, "perHour", materialAmount);

				rHelper.fn.INSRT_materialRateWorth(materialId);

				rHelper.fn.INSRT_totalMineWorth(rHelper.fn.CALC_totalMineWorth());

				rHelper.fn.CALC_dependantFactories(materialId, "material");

				rHelper.fn.INSRT_flowRate(materialId, "material");
				rHelper.fn.INSRT_flowDistributionGlobal();

				rHelper.fn.EVNT_buildGraph("material");

			});
			$("#material-amount-of-mines-" + materialId).on("input", function () {
				var materialId = this.id.replace("material-amount-of-mines-", "");
				var materialAmountOfMines = parseInt(this.value);

				rHelper.fn.SET_globalObject("material", materialId, "amountOfMines", materialAmountOfMines);

				$.each(rHelper.data.material, function (materialId) {
					rHelper.fn.INSRT_materialNewMinePrice(materialId);
				});

				rHelper.fn.INSRT_materialMineAmortisation();
				rHelper.fn.INSRT_totalMineCount(rHelper.fn.CALC_totalMineCount());

				rHelper.fn.EVNT_buildGraph("material");
			});
		},
		EVNT_warehouseInput(id, type) {
			// on upgrade calculator input
			$("#warehouse-" + type + "-calc-2-" + id).on("input", function () {
				var value = parseInt(this.value);
				if (isNaN(value)) {
					value = 0;
				}

				rHelper.fn.INSRT_warehouseUpgradeCost(id, type, value);
			});

			// reset upgrade cost on select swap
			$("#warehouse-" + type + "-calc-1-" + id).on("change", function () {
				$("#warehouse-" + type + "-upgrade-cost-" + id).empty();
				$("#warehouse-" + type + "-calc-2-" + id).val(0);
			});

			// on increase of current stock
			$("#warehouse-" + type + "-stock-current-" + id).on("input", function () {
				var value = parseInt(this.value);
				if (isNaN(value)) {
					value = 0;
				}

				var newFillStatus = value / rHelper.data[type][id].warehouse.contingent;

				rHelper.fn.SET_globalObject(type, id, ["warehouse", "fillAmount"], value);
				rHelper.fn.SET_globalObject(type, id, ["warehouse", "fillStatus"], newFillStatus);

				rHelper.fn.INSRT_warehouseWorth(id, type);
				rHelper.fn.INSRT_warehouseFillStatus(id, type);
				rHelper.fn.INSRT_warehouseRemainingTimeToFull(id, type);
				rHelper.fn.INSRT_warehouseTotalWorth();
			});

			// on increase of warehouse level
			$("#warehouse-" + type + "-level-" + id).on("input", function () {
				var value = parseInt(this.value);
				if (isNaN(value)) {
					value = 0;
				}

				var el = rHelper.data[type][id].warehouse;

				rHelper.fn.SET_globalObject(type, id, ["warehouse", "level"], value);
				rHelper.fn.SET_globalObject(type, id, ["warehouse", "contingent"], rHelper.fn.CALC_warehouseContingent(value));
				rHelper.fn.SET_globalObject(type, id, ["warehouse", "fillStatus"], el.fillAmount / el.contingent);

				rHelper.fn.INSRT_warehouseCapacity(id, type);
				rHelper.fn.INSRT_warehouseFillStatus(id, type);
				rHelper.fn.INSRT_warehouseRemainingTimeToFull(id, type);
				rHelper.fn.INSRT_warehouseTotalLevel();
			});
		},
		EVNT_buildingChange(buildingId) {
			$("#buildings-level-" + buildingId).on("change", function () {
				var value = parseInt(this.value);
				rHelper.fn.SET_globalObject("buildings", buildingId, "level", value);

				if (buildingId == 9) {
					rHelper.fn.SET_transportCost();
				}

				if (buildingId == 5) {
					rHelper.fn.SET_recyclingPlantLevel();
				}

				rHelper.fn.INSRT_buildingData(buildingId);
				rHelper.fn.INSRT_buildingToLevel10(buildingId);
				rHelper.fn.SET_buildingBackgroundColor(buildingId);

				rHelper.fn.INSRT_gaugeGraph("buildings");
			});
		},
		EVNT_buildGraph(type) {

			rHelper.graphs = rHelper.graphs || {};

			switch (type) {
			case "material":

				var parentGraphObj = rHelper.graphs.material;

				rHelper.graphs.material.reference.mineCount = rHelper.fn.CALC_totalMineCount();
				rHelper.graphs.material.reference.mineIncome = rHelper.fn.CALC_totalMineWorth();

				$.each(rHelper.data.material, function (i, material) {

					var iteration = {
						y: 0,
						color: "",
						drilldown: {
							categories: [],
							data: [],
							color: ""
						}
					};

					var price = rHelper.fn.CALC_returnPriceViaId(i);
					var mineAmountPercent = parseFloat(((material.amountOfMines / rHelper.graphs.material.reference.mineCount) * 100).toFixed(2));
					var mineIncomePercent = parseFloat(((rHelper.fn.CALC_materialRateWorth(i) / rHelper.graphs.material.reference.mineIncome) * 100).toFixed(2));
					var materialName = material.name;

					if (!isNaN(mineAmountPercent)) {
						iteration.y = mineAmountPercent;
					} else {
						iteration.y = 0;
					}

					iteration.color = rHelper.graphs.material.colors[i];
					iteration.drilldown.color = rHelper.graphs.material.colors[i];

					iteration.drilldown.categories[i] = materialName;
					iteration.drilldown.name = materialName;
					iteration.drilldown.categories[i] = materialName;

					if (!isNaN(mineIncomePercent)) {
						iteration.drilldown.data[i] = mineIncomePercent;
					} else {
						iteration.drilldown.data[i] = 0;
					}

					var mineDataObj = {
						name: materialName,
						y: iteration.y,
						color: iteration.color
					};

					if (JSON.stringify(rHelper.graphs.material.mineData[i]) !== JSON.stringify(mineDataObj)) {
						rHelper.graphs.material.mineData[i] = mineDataObj;
					}

					var drillDataLen = iteration.drilldown.data.length;
					for (var j = 0; j < drillDataLen; j += 1) {
						brightness = 0.2 - (j / drillDataLen) / 5;
						rHelper.graphs.material.incomeData[i] = {
							name: iteration.drilldown.categories[j],
							y: iteration.drilldown.data[j],
							color: Highcharts.Color(iteration.color).brighten(brightness).get()
						};
					}

					if (JSON.stringify(rHelper.graphs.material.data[i]) !== JSON.stringify(iteration)) {
						rHelper.graphs.material.data[i] = iteration;
					}

				});

				rHelper.fn.INSRT_polygonGraph(parentGraphObj.target, parentGraphObj.titleText, parentGraphObj.seriesNames, parentGraphObj.responsiveId, type);

				break;
			case "products":
				var titleText = "mine distribution vs mine income";
				var seriesNames = [
					"Mines",
					"Mine income",
				];
				var responsiveId = "income";
				var target = "graph-material";
				break;
			}
		},
		INSRT_polygonGraph(target, titleText, seriesNames, responsiveId, targetObj) {

			var dataObj = rHelper.graphs[targetObj];

			Highcharts.chart(target, {
				chart: {
					type: "pie",
					backgroundColor: "transparent"
				},
				title: {
					text: titleText,
					style: {
						color: "#ffffff"
					}
				},
				plotOptions: {
					pie: {
						shadow: false,
						center: [
							"50%",
							"50%"
						]
					}
				},
				tooltip: {
					valueSuffix: "%"
				},
				series: [{
					name: seriesNames[0],
					data: dataObj.mineData,
					size: "60%",
					dataLabels: {
						formatter: function () {
							return this.y > 5 ? this.point.name : null;
						},
						color: "#ffffff",
						distance: -30
					}
				}, {
					name: seriesNames[1],
					data: dataObj.incomeData,
					size: "80%",
					innerSize: "60%",
					dataLabels: {
						formatter: function () {
							return this.y > 1 ? "<b>" + this.point.name + ":</b> " +
								this.y + "%" : null;
						},
						style: {
							color: "white",
							textOutline: "none"
						}
					},
					id: responsiveId
				}],
				responsive: {
					rules: [{
						condition: {
							maxWidth: 400
						},
						chartOptions: {
							series: [{
								id: responsiveId,
								dataLabels: {
									enabled: false
								}
							}]
						}
					}]
				}
			});
		},
		INSRT_gaugeGraph(type) {

			if (type == "buildings") {
				var chart = Highcharts.chart('graph-buildings', Highcharts.merge(rHelper.graphs.gaugeOptions, {
					yAxis: {
						min: 0,
						max: rHelper.fn.CALC_perfectWorth("buildings"),
						title: {
							text: "total building worth"
						}
					},
					series: [{
						name: "total building worth",
						data: [rHelper.fn.CALC_totalBuildingErectionSum()]
					}]
				}));
			} else if (type == "headquarter") {
				var chart = Highcharts.chart('graph-headquarter', Highcharts.merge(rHelper.graphs.gaugeOptions, {
					yAxis: {
						min: 0,
						max: rHelper.fn.CALC_perfectWorth("headquarter"),
						title: {
							text: "total headquarter worth"
						}
					},
					series: [{
						name: "total headquarter worth",
						data: [rHelper.fn.CALC_totalHeadquarterErectionSum()]
					}]
				}));
			}
		},

		INSRT_totalMineWorth(totalMineWorth) {
			$("#material-total-worth").text(totalMineWorth.toLocaleString("en-US"));
		},
		INSRT_totalMineCount(totalMineCount) {
			$("#material-total-mine-count").text(totalMineCount.toLocaleString("en-US"));
		},
		INSRT_materialRate(materialId) {
			$("#material-rate-" + materialId).val(rHelper.data.material[materialId].perHour);
		},
		INSRT_materialAmountOfMines(materialId) {
			$("#material-amount-of-mines-" + materialId).val(rHelper.data.material[materialId].amountOfMines);
		},
		INSRT_userSettings() {

			var userInfo = rHelper.data.userInformation;

			$("#security-token").text(userInfo.securityToken);

			if (userInfo.realKey != "" && typeof (userInfo.realKey) != "undefined") {
				$("#api-key").val(userInfo.realKey);
				rHelper.fn.INSRT_API_remainingCredits(userInfo.remainingCredits);
			}

			if (userInfo.name != "") {
				$("#api-player-anonymity")[0].parentNode.remove();
			}

			$.each(rHelper.data.settings, function (index, setting) {
				var value = 0;
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
					for (var i = 0; i <= 3; i += 1) {
						$("#settings-custom-tu-" + (i + 1)).val(setting.value[i]);
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
			$("#material-new-price-" + materialId).text(rHelper.fn.CALC_materialNewMinePrice(rHelper.fn.CALC_totalMineCount(), materialId).toLocaleString("en-US"));
		},
		INSRT_materialRateWorth(materialId) {
			$("#material-worth-" + materialId).text(rHelper.fn.CALC_materialRateWorth(materialId).toLocaleString("en-US"));
		},
		INSRT_materialMineAmortisation() {

			var roi100Array = rHelper.fn.CALC_materialMineROI("100");
			var roi500Array = rHelper.fn.CALC_materialMineROI("505");
			var roiXArray = rHelper.fn.CALC_materialMineROI("505hq");

			$.each(roi100Array, function (i, value) {
				$("#material-roi-100-" + i).text(value.toFixed(2).toLocaleString("en-US"));
			});

			$.each(roi500Array, function (i, value) {
				$("#material-roi-500-" + i).text(value.toFixed(2).toLocaleString("en-US"));
			});

			$.each(roiXArray, function (i, value) {
				$("#material-roi-x-" + i).text(value.toFixed(2).toLocaleString("en-US"));
			});

			rHelper.fn.INSRT_materialHighlightColumns(roi100Array, "#material-roi-100-", "text-success", "text-danger");
			rHelper.fn.INSRT_materialHighlightColumns(roi500Array, "#material-roi-500-", "text-success", "text-danger");
			rHelper.fn.INSRT_materialHighlightColumns(roiXArray, "#material-roi-x-", "text-success", "text-danger");
		},
		INSRT_materialNewMinePerfectIncome(materialId) {
			$("#material-perfect-income-" + materialId).text(rHelper.fn.CALC_materialMinePerfectIncome(materialId).toLocaleString("en-US"));
		},
		INSRT_materialHighlightMinePerfectIncome() {
			var array = [];

			$.each(rHelper.data.material, function (materialId) {
				array.push(rHelper.fn.CALC_materialMinePerfectIncome(materialId));
			});

			rHelper.fn.INSRT_materialHighlightColumns(array, "#material-perfect-income-", "text-danger", "text-success");
		},
		INSRT_materialHighlightColumns(array, target, minClass, maxClass) {

			var selectors = ["min", "max"];
			var value = 0;
			var addClass;
			var rmvClass;

			$.each(selectors, function (i, selector) {

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

				var el = $(target + array.indexOf(value));
				el.removeClass(rmvClass).addClass(addClass);
			});

		},
		INSRT_factoryLevel(factoryId) {
			var factoryLevel = rHelper.data.products[factoryId].factoryLevel;
			$("#factories-level-" + factoryId).val(factoryLevel);
			$("#diamond-level-" + factoryId).text(factoryLevel);
		},
		INSRT_factoryOutput(factoryId) {
			$("#factories-product-" + factoryId).text(rHelper.fn.CALC_factoryOutput(factoryId).toLocaleString("en-US"));
		},
		INSRT_factoryUpgradeCost(factoryId) {
			var target = $("#factories-upgrade-cost-" + factoryId);

			var calculateFactoryUpgradeCostObj = rHelper.fn.CALC_factoryUpgradeCost(factoryId);

			target.text(calculateFactoryUpgradeCostObj.sum.toLocaleString("en-US"));
			target.attr("title", calculateFactoryUpgradeCostObj.title);
			applyTippyOnNewElement(target);
		},
		INSRT_totalFactoryUpgrades() {
			$("#factories-total-upgrades").text(rHelper.fn.CALC_totalFactoryUpgrades().toLocaleString("en-US"));
		},
		INSRT_factoryDependencies(factoryId) {

			var product = rHelper.data.products[factoryId];
			var dependencies = product.dependencies;
			var dependencyString = "";

			if ($.isArray(dependencies)) {
				$.each(dependencies, function (dependencyIndex, dependency) {

					var dependantObj = rHelper.fn.CALC_convertId(dependency);
					var price = rHelper.fn.CALC_returnPriceViaId(dependency).toLocaleString("en-US");

					var requiredAmount = rHelper.fn.CALC_factoryDependencyRequiredAmount(factoryId, dependencyIndex);
					var existingAmount = rHelper.fn.CALC_factoryDependencyExistingAmount(dependantObj, dependencyIndex);

					var addClass = rHelper.fn.CALC_factoryComparatorRequiredVsExistingAmount(requiredAmount, existingAmount);

					var outerSpan = $(crEl("span"));
					var imgSpan = $(crEl("span"));
					var innerSpan = $(crEl("span"));

					imgSpan.addClass(dependantObj.icon).attr("title", price.toLocaleString("en-US"));
					innerSpan.addClass(addClass).text(requiredAmount.toLocaleString("en-US"));
					outerSpan.append(imgSpan[0].outerHTML + " " + innerSpan[0].outerHTML + " ");

					dependencyString += outerSpan[0].outerHTML;

				});
			} else {
				var dependantObj = rHelper.fn.CALC_convertId(dependencies);
				var price = rHelper.fn.CALC_returnPriceViaId(dependencies).toLocaleString("en-US");

				var requiredAmount = rHelper.fn.CALC_factoryDependencyRequiredAmount(factoryId, 0);
				var existingAmount = rHelper.fn.CALC_factoryDependencyExistingAmount(dependantObj, 0);

				var addClass = rHelper.fn.CALC_factoryComparatorRequiredVsExistingAmount(requiredAmount, existingAmount);

				var outerSpan = $(crEl("span"));
				var imgSpan = $(crEl("span"));
				var innerSpan = $(crEl("span"));

				imgSpan.addClass(dependantObj.icon).attr("title", price.toLocaleString("en-US"));
				innerSpan.addClass(addClass).text(requiredAmount.toLocaleString("en-US"));
				outerSpan.append(imgSpan[0].outerHTML + " " + innerSpan[0].outerHTML + " ");

				dependencyString += outerSpan[0].outerHTML;
			}

			$("#factories-dependencies-" + factoryId).html(dependencyString);
		},
		INSRT_factoryAmortisation(factoryId) {
			var target = "#factories-roi-" + factoryId;
			var amortisation = rHelper.fn.CALC_factoryAmortisation(factoryId);

			if (amortisation < 0 || amortisation == Infinity) {
				amortisation = "∞";
			} else {
				amortisation = amortisation.toFixed(2);
			}

			$(target).text(amortisation);
		},
		INSRT_factoryWorkload(factoryId) {
			var target = $("#factories-workload-" + factoryId);
			var dependencies = rHelper.data.products[factoryId].dependencies;
			rHelper.data.products[factoryId].dependencyWorkload = [];

			if ($.isArray(dependencies)) {

				$.each(dependencies, function (dependencyIndex) {
					var dependencyWorkload = rHelper.fn.CALC_factoryDepedencyWorkload(factoryId, dependencyIndex);
					rHelper.data.products[factoryId].dependencyWorkload.push(dependencyWorkload);
				});
			} else {
				var dependencyWorkload = rHelper.fn.CALC_factoryDepedencyWorkload(factoryId, 0);
				rHelper.data.products[factoryId].dependencyWorkload.push(dependencyWorkload);
			}

			var workload = rHelper.fn.CALC_factoryWorkloadMinNonSanitized(factoryId);

			if (workload >= 1) {
				target.removeClass("text-danger").addClass("text-success");
			} else {
				target.removeClass("text-success").addClass("text-danger");
			}

			target.text((workload * 100).toFixed(2) + " %");
		},
		INSRT_factoryTurnover(factoryId) {
			var target = $("#factories-turnover-" + factoryId);

			var turnover = rHelper.fn.CALC_factoryTurnover(factoryId);

			if (turnover <= 0) {
				target.removeClass("text-success").addClass("text-danger");
			} else {
				target.removeClass("text-danger").addClass("text-success");
			}

			rHelper.data.products[factoryId].turnover = turnover;
			$(target).text(turnover.toLocaleString("en-US"));
		},
		INSRT_factoryHighlightColumns() {

			var subArray;
			var columns = [
				"#factories-upgrade-cost-",
				"#factories-increase-per-upgrade-",
				"#factories-roi-",
				"#diamond-profit-"
			];

			$.each(columns, function (i, column) {
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

				var valueArray = [];
				var idArray = [];

				$.each(rHelper.data.products, function (k, factory) {
					$(column + k).removeClass("text-success text-danger");

					var value = 0;

					if (typeof (subArray) == "object") {
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
				var arrayMin = idArray[valueArray.indexOf(valueArray.min())];
				var arrayMax = idArray[valueArray.indexOf(valueArray.max())];

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
			var target = $("#factories-roi-" + factoryId);
			var roi = rHelper.fn.CALC_factoryROI(factoryId);

			rHelper.data.products[factoryId].roi = roi;

			if (roi < 0 || roi === Infinity) {
				roi = "∞";
			} else {
				roi = roi.toFixed(2);
			}

			target.text(roi.toLocaleString("en-US"));
		},
		INSRT_factoryTurnoverPerUpgrade(factoryId) {
			var target = $("#factories-increase-per-upgrade-" + factoryId);
			var turnoverPerUpgrade = rHelper.fn.CALC_factoryTurnoverPerUpgrade(factoryId);

			rHelper.data.products[factoryId].turnoverIncrease = turnoverPerUpgrade;
			target.text(turnoverPerUpgrade.toLocaleString("en-US"));
		},
		INSRT_API_remainingCredits(value) {
			$("#api-credits").text(value.toLocaleString("en-US") + " Credits left");
		},
		INSRT_diamondFactoryOutput(factoryId) {
			$("#diamond-product-" + factoryId).text(rHelper.fn.CALC_diamondFactoryOutput(factoryId).toLocaleString("en-US"));
		},
		INSRT_diamondFactoryOutputWarehouse(factoryId) {
			var diamondFactoryOutput = rHelper.fn.CALC_diamondFactoryOutput(factoryId);
			var requiredWarehouseLevel = rHelper.fn.CALC_nextGreaterWarehouseLevel(diamondFactoryOutput);

			$("#diamond-product-warehouse-" + factoryId).text(requiredWarehouseLevel.toLocaleString("en-US"));
		},
		INSRT_diamondDependenciesHelper(dependantObj, price, requiredAmount, factoryId, warehouseIconSpan) {
			var requiredWarehouseLevel = rHelper.fn.CALC_nextGreaterWarehouseLevel(requiredAmount);

			rHelper.data.products[factoryId].diamond.dependenciesWorth += price * requiredAmount;

			var outerSpan = $(crEl("span"));
			var imgSpan = $(crEl("span"));
			var innerSpan = $(crEl("span"));
			var kbd = $(crEl("kbd"));
			var warehouseSamp = $(crEl("span"));

			imgSpan.addClass(dependantObj.icon).attr("title", price.toLocaleString("en-US"));
			innerSpan.text(requiredAmount.toLocaleString("en-US"));
			warehouseSamp.text(requiredWarehouseLevel);
			kbd.append(warehouseIconSpan[0].outerHTML + " " + warehouseSamp[0].outerHTML);
			outerSpan.append(imgSpan[0].outerHTML + " " + innerSpan[0].outerHTML + " " + kbd[0].outerHTML + " ");

			return outerSpan[0].outerHTML;
		},
		INSRT_diamondDependencies(factoryId) {
			var product = rHelper.data.products[factoryId];
			var dependencies = product.dependencies;
			var dependencyString = "";
			var warehouseIconSpan = $(crEl("span")).addClass("nav-icon-warehouses");

			if ($.isArray(dependencies)) {
				$.each(dependencies, function (dependencyIndex, dependency) {

					var dependantObj = rHelper.fn.CALC_convertId(dependency);
					var price = rHelper.fn.CALC_returnPriceViaId(dependency);

					var requiredAmount = rHelper.fn.CALC_factoryDependencyRequiredAmount(factoryId, dependencyIndex) * 5 * 24;

					dependencyString += rHelper.fn.INSRT_diamondDependenciesHelper(dependantObj, price, requiredAmount, factoryId, warehouseIconSpan);
				});
			} else {
				var dependantObj = rHelper.fn.CALC_convertId(dependencies);
				var price = rHelper.fn.CALC_returnPriceViaId(dependencies);

				var requiredAmount = rHelper.fn.CALC_factoryDependencyRequiredAmount(factoryId, 0) * 5 * 24;

				dependencyString += rHelper.fn.INSRT_diamondDependenciesHelper(dependantObj, price, requiredAmount, factoryId, warehouseIconSpan);
			}

			$("#diamond-dependencies-" + factoryId).html(dependencyString);
		},
		INSRT_diamondEfficiency(factoryId) {
			$("#diamond-efficiency-" + factoryId).text((rHelper.fn.CALC_diamondEfficiency(factoryId) * 100).toFixed(2).toLocaleString("en-US") + "%");
		},
		INSRT_diamondProfit(factoryId) {
			$("#diamond-profit-" + factoryId).text(rHelper.fn.CALC_diamondProfit(factoryId).toLocaleString("en-US"));
		},
		INSRT_diamondFactoryLevel(factoryId) {
			$("#diamond-level-" + factoryId).text(rHelper.data.products[factoryId].factoryLevel);
		},
		INSRT_diamondTop10Profit() {
			var top10Profit = rHelper.fn.CALC_diamondTop10Profit().toLocaleString("en-US");
			$("#diamond-top-10").text(top10Profit);
		},
		INSRT_diamondTotalProfit() {
			var totalProfit = rHelper.fn.CALC_diamondTotalProfit().toLocaleString("en-US");
			$("#diamond-total").text(totalProfit);
		},
		INSRT_flowRate(id, type) {
			var target = $("#flow-" + type + "-rate-" + id);
			var rate = rHelper.fn.CALC_flowRate(id, type);

			if (type == "product") {
				if (rHelper.data.products[id].turnover < 0) {
					rate = 0;
				}
			}

			target.text(rate.toLocaleString("en-US"));
		},
		INSRT_flowDistributionGlobal() {

			var materialTotal = 0;
			var productsTotal = 0;
			var materialColor = "yellowgreen";
			var productColor = "yellowgreen";

			$.each(rHelper.data.material, function (materialId) {
				materialTotal += rHelper.fn.INSRT_flowDistributionSingle(materialId, "material");
			});

			var calculationOrder = rHelper.fn.GET_calculationOrder();

			$.each(calculationOrder, function (index, factoryId) {
				productsTotal += rHelper.fn.INSRT_flowDistributionSingle(factoryId, "product");
			});

			if (materialTotal < 0) {
				materialColor = "coral";
			}
			if (productsTotal < 0) {
				productColor = "coral";
			}

			rHelper.data.material.totalIncomePerHour = materialTotal;
			rHelper.data.products.totalIncomePerHour = productsTotal;

			$("#flow-material-total").text(materialTotal.toLocaleString("en-US")).css("color", materialColor);
			$("#flow-products-total").text(productsTotal.toLocaleString("en-US")).css("color", productColor);
			$("#effective-hourly-income").text((materialTotal + productsTotal).toLocaleString("en-US"));
		},
		INSRT_flowSurplus(id, type, remainingAmount) {
			var surplusTarget = $("#flow-" + type + "-surplus-" + id);
			if (remainingAmount <= 0) {
				surplusTarget.css("color", "coral");
			}
			surplusTarget.html('<span class="resources-' + type + '-' + id + '"></span> ' + remainingAmount.toLocaleString("en-US"));
		},
		INSRT_flowDistributionSingle(id, type) {
			var distributionTarget = $("#flow-" + type + "-distribution-" + id);

			var worthTarget = $("#flow-" + type + "-worth-" + id);
			var price = 0;
			var worth = 0;
			var remainingAmount = rHelper.fn.CALC_flowDistribution(id, type);
			var color = "yellowgreen";
			var productionCost = 0;

			switch (type) {
			case "material":
				price = rHelper.fn.CALC_returnPriceViaId(id);
				break;
			case "product":
				price = rHelper.fn.CALC_returnPriceViaId((id + 14));
				break;
			}

			if (type == "product") {

				if (rHelper.data.products[id].turnover < 0) {
					remainingAmount *= -1;
					if (rHelper.data.products[id].dependantFactories == "") {
						remainingAmount = 0;
					}
				} else {
					productionCost = rHelper.fn.CALC_factoryCashCostPerHour(id);
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

			worthTarget.css("color", color);
			worthTarget.text(worth.toLocaleString("en-US"));

			rHelper.fn.INSRT_flowSurplus(id, type, remainingAmount);

			return worth;
		},
		INSRT_warehouseFillAmount(id, type) {
			$("#warehouse-" + type + "-stock-current-" + id).val(rHelper.data[type][id].warehouse.fillAmount);
		},
		INSRT_warehouseLevel(id, type) {
			var warehouseLevel = rHelper.data[type][id].warehouse.level;

			$("#warehouse-" + type + "-level-" + id).val(warehouseLevel);
			$("#warehouse-" + type + "-stock-current-" + id).attr("max", rHelper.fn.CALC_warehouseContingent(warehouseLevel));
		},
		INSRT_warehouseFillStatus(id, type) {
			var target = $("#warehouse-" + type + "-fill-percent-" + id);
			var percent = (rHelper.data[type][id].warehouse.fillStatus * 100).toFixed(2);

			if (percent < 75) {
				color = "rgb(70, 252, 6)";
			} else if (percent >= 75 && percent < 90) {
				color = "rgb(255, 252, 38)";
			} else if (percent >= 90 && percent < 95) {
				color = "rgb(255, 155, 38)";
			} else if (percent >= 95) {
				color = "rgb(255, 38, 41)";
			}

			target.text(percent);
			target.css("color", color);
		},
		INSRT_warehouseCapacity(id, type) {
			$("#warehouse-" + type + "-stock-cap-" + id).text(rHelper.data[type][id].warehouse.contingent.toLocaleString("en-US"));
		},
		INSRT_warehouseWorth(id, type) {

			var price = rHelper.fn.CALC_warehouseWorth(id, type);

			var worth = price * rHelper.data[type][id].warehouse.fillAmount;

			$("#warehouse-" + type + "-worth-" + id).text(worth.toLocaleString("en-US"));
		},
		INSRT_warehouseTotalWorth() {
			var warehouseTotalWorth = rHelper.fn.CALC_warehouseTotalWorth();

			$("#warehouse-total-worth").text(warehouseTotalWorth.toLocaleString("en-US"));
		},
		INSRT_warehouseTotalLevel() {
			var warehouseTotalLevel = rHelper.fn.CALC_warehouseTotalLevel();

			$("#warehouse-total-level").text(warehouseTotalLevel.toLocaleString("en-US"));
		},
		INSRT_warehouseRemainingTimeToFull(id, type) {
			var remainingTime = rHelper.fn.CALC_warehouseRemainingTimeToFull(id, type);

			$("#warehouse-" + type + "-remaining-" + id).text(remainingTime);
		},
		INSRT_warehouseUpgradeCost(id, type, value) {
			var target = $("#warehouse-" + type + "-upgrade-cost-" + id);
			var upgradeCost = rHelper.fn.CALC_warehouseUpgradeCostOnInput(id, type, value);

			target.text(upgradeCost.toLocaleString("en-US"));
		},
		INSRT_buildingName(buildingId) {
			$("#buildings-name-" + buildingId).text(rHelper.data.buildings[buildingId].name);
		},
		INSRT_buildingData(buildingId) {

			var building = rHelper.data.buildings[buildingId];
			var buildingLevel = building.level;

			var dropdown = $("#buildings-level-" + buildingId);
			if (parseInt(dropdown.val()) != buildingLevel) {
				$(dropdown[0][buildingLevel]).attr("selected", "true");
			}

			var materialWorthSum = 0;
			var materialTransportationSum = 0;

			if (buildingLevel != 10) {

				rHelper.fn.SET_buildingTableVisibility(buildingId, "show");

				for (var i = 0; i <= 3; i += 1) {

					if (i === 0) {
						var cashTarget = $("#buildings-cash-" + buildingId);
						var cash = building.materialAmount0[buildingLevel];
						if (typeof (cash) == "undefined") {
							cash = 0;
						}
						materialWorthSum += cash;
						cashTarget.text(cash.toLocaleString("en-US"));
					} else {
						var selector = "materialAmount" + i;
						var material = rHelper.fn.CALC_convertId(building.material[i]);
						$("#buildings-mat-" + i + "-" + buildingId).addClass(material.icon);

						var materialAmount = building[selector][buildingLevel];

						if (typeof (materialAmount) == "number") {
							$("#buildings-amount-" + i + "-" + buildingId).text(materialAmount.toLocaleString("en-US"));

							var materialPrice = rHelper.fn.CALC_returnPriceViaId(building.material[i]);
							var materialWorth = materialPrice * materialAmount;
							var transportation = (rHelper.data.buildings[9].transportCost - 1) * materialWorth;

							materialWorthSum += materialWorth;
							materialTransportationSum += transportation;

							$("#buildings-worth-" + i + "-" + buildingId).text(materialWorth.toLocaleString("en-US"));
							$("#buildings-transportation-" + i + "-" + buildingId).text(transportation.toLocaleString("en-US"));
						}
					}
				}
			} else {
				rHelper.fn.SET_buildingTableVisibility(buildingId, "hide");
			}

			$("#buildings-sum-" + buildingId).text(materialWorthSum.toLocaleString("en-US"));
			$("#buildings-transportation-sum-" + buildingId).text(Math.round(materialTransportationSum).toLocaleString("en-US"));
		},
		INSRT_buildingToLevel10(buildingId) {
			var buildingToLevel10 = rHelper.fn.CALC_buildingToLevel10(buildingId);

			$("#buildings-cap-" + buildingId).text(buildingToLevel10.level10Cost.toLocaleString("en-US"));
			$("#buildings-transportation-cap-" + buildingId).text(buildingToLevel10.level10Transportation.toLocaleString("en-US"));
		},
		INSRT_techUpgradeRows(tu4Trigger) {
			var techUpgradeTbody = $("#techupgrades-combinations-tbl tbody");

			if (techUpgradeTbody[0].childNodes.length > 0) {
				techUpgradeTbody.empty();
			}

			var prices = [];

			for (var i = 46; i <= 49; i += 1) {
				prices.push(rHelper.fn.CALC_returnPriceViaId(i, 0));
			}

			$.each(rHelper.tu, function (index, combination) {

				if (typeof (tu4Trigger) == "undefined" && combination.tu4 != 0) {
					return;
				}

				var tr = $(crEl("tr"));

				for (var i = 0; i <= 6; i += 1) {
					var td = $(crEl("td"));
					td.addClass("text-md-right text-sm-left");

					var tus = [
						combination.tu1,
						combination.tu2,
						combination.tu3,
						combination.tu4
					];

					switch (i) {
					case 0:
					case 1:
					case 2:
					case 3:
						td.text(tus[i]).attr("data-th", "Tech-Upgrade " + i);
						break;
					case 4:
						td.text(combination.factor).attr("data-th", "Boost");
						break;
					case 5:
						var price = 0;
						for (var k = 0; k < tus.length; k += 1) {
							price += tus[k] * prices[k];
						}
						td.text(price.toLocaleString("en-US")).attr("data-th", "Price");
						break;
					case 6:
						var count = tus[0] * 1 + tus[1] * 2 + tus[2] * 3 + tus[3] * 5;
						td.text(count).attr("data-th", "Pimp my mine count");
						break;
					}

					tr.append(td[0]);
				}
				techUpgradeTbody.append(tr[0]);
			});
		},
		INSRT_techUpgradeCalculator(value, tu4Inclusion) {

			toggleTechUpgradeInfo("start");

			var table = $("#techupgrades-calc-tbl");
			if (table.css("display") == "none") {
				table.css("display", "table");
			}

			var target = $("#techupgrades-calc-tbl tbody");
			if (target[0].childNodes.length > 0) {
				target.empty();
			}

			var url = "api/getTechCombination.php?factor=" + value;

			if (typeof (tu4Inclusion) == "string") {
				url += "&tu4=allowed";
			}

			console.log(url);

			$.getJSON(url, function (data) {

					var prices = [];

					for (var i = 46; i <= 49; i += 1) {
						prices.push(rHelper.fn.CALC_returnPriceViaId(i, 0));
					}

					$.each(data, function (i, combination) {
						var tr = $(crEl("tr"));

						for (var k = 0; k <= 6; k += 1) {
							var td = $(crEl("td"));
							td.addClass("text-md-right text-sm-left");
							td.attr("data-th", "missing Tech-Upgrade " + (k + 1));

							var tus = [
								combination.tu1,
								combination.tu2,
								combination.tu3,
								combination.tu4
							];

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
								var price = 0;
								for (var l = 0; l < tus.length; l += 1) {
									price += tus[l] * prices[l];
								}
								td.text(price.toLocaleString("en-US")).attr("data-th", "Price");
								break;
							case 6:
								var count = tus[0] * 1 + tus[1] * 2 + tus[2] * 3 + tus[3] * 5;
								td.text(count).attr("data-th", "remaining Pimp my mine count");
								break;
							}

							tr.append(td[0]);
						}
						target.append(tr[0].outerHTML);
					});

					sorttable.makeSortable(table[0]);
					sorttable.innerSortFunction.apply($("#techupgrades-calc-tbl th")[5], []);
					sorttable.innerSortFunction.apply($("#techupgrades-calc-tbl th")[5], []);

					toggleTechUpgradeInfo("end");
				})
				.fail(function () {
					var tr = $(crEl("tr"));
					var td = $(crEl("td"));

					td.addClass("text-warning text-center").attr("data-th", "Attention").attr("colspan", 7).text("No entries found or invalid value. Try to lower the value a bit – up to 5 decimals are allowed (e.g. 3.00005).");
					tr.append(td[0]);
					target.append(tr[0]);

					toggleTechUpgradeInfo("end");
				});
		},
		INSRT_recyclingRequirement(lootId) {
			$("#recycling-requirement-" + lootId).text(rHelper.fn.CALC_recyclingRequirement(lootId).toLocaleString("en-US"));
		},
		INSRT_recyclingProducts(lootId) {

			var recyclingPlantLevel = rHelper.data.buildings[5].level;
			var recyclingProducts = rHelper.fn.CALC_recyclingProducts(lootId, recyclingPlantLevel);

			$("#recycling-products-" + lootId).html(recyclingProducts);
		},
		INSRT_recyclingOutputWorth(lootId) {
			var recyclingPlantLevel = rHelper.data.buildings[5].level;

			$("#recycling-output-" + lootId).text(rHelper.fn.CALC_recyclingOutputWorth(lootId, recyclingPlantLevel).toLocaleString("en-US"));
		},
		INSRT_recyclingInputWorth(lootId) {
			$("#recycling-input-" + lootId).text(rHelper.fn.CALC_recyclingInputWorth(lootId).toLocaleString("en-US"));
		},
		INSRT_recyclingProfit(lootId) {

			var target = $("#recycling-profit-" + lootId);
			var profit = rHelper.fn.CALC_recyclingProfit(lootId);

			if (profit > 0) {
				$(target[0].parentNode).css("background-color", "#9acd3225");
			} else {
				$(target[0].parentNode).css("background-color", "#ff7f5025");
			}

			target.text(profit.toFixed(2).toLocaleString("en-US") + "%");
		},
		INSRT_unitsCraftingPrice(unitId) {
			$("#units-crafting-" + unitId).text(rHelper.fn.CALC_unitsCraftingPrice(unitId).toLocaleString("en-US"));
		},
		INSRT_unitsMarketPrice(unitId) {
			var convertedId = unitId + 52;

			var marketPrice = rHelper.fn.CALC_returnPriceViaId(convertedId);
			rHelper.data.units[unitId].profit.marketPrice = marketPrice;

			$("#units-market-" + unitId).text(marketPrice.toLocaleString("en-US"));
		},
		INSRT_unitsProfit(unitId) {
			var target = $("#units-profit-" + unitId);
			var profit = rHelper.fn.CALC_unitsProfit(unitId);

			if (profit > 0) {
				$(target[0].parentNode).css("background-color", "#9acd3225");
			} else {
				$(target[0].parentNode).css("background-color", "#ff7f5025");
			}

			target.text(profit.toFixed(2).toLocaleString("en-US") + "%");
		},
		INSRT_companyWorth() {
			var companyWorth = rHelper.fn.CALC_companyWorth();
			$("#company-worth").text(companyWorth.toLocaleString("en-US"));
		},

		INSRT_headquarterOvwTransportation(level) {

			var hqLevel = rHelper.data.headquarter[level];

			if ($.isArray(hqLevel.material)) {
				var hqCost = rHelper.fn.CALC_headquarterLevelCost(level);
				var transportation = Math.round(hqCost * (rHelper.data.buildings[9].transportCost - 1));

				$("#hq-ovw-transportation-" + level).text(transportation.toLocaleString("en-US"));
			}
		},

		INSRT_headquarterOvwCost(level) {
			var hqCost = rHelper.fn.CALC_headquarterLevelCost(level);

			$("#hq-ovw-sum-" + level).text(hqCost.toLocaleString("en-US"));
		},
		INSRT_headquarterOvwRadius(level) {
			var hqLevel = rHelper.data.headquarter[level];

			$("#hq-ovw-radius-" + level).text(hqLevel.radius + "m | " + rHelper.fn.CALC_convertMeterToYards(hqLevel.radius) + " yards");
		},
		INSRT_headquarterOvwBoost(level) {
			var hqLevel = rHelper.data.headquarter[level];
			$("#hq-ovw-boost-" + level).text(hqLevel.boost);
		},
		INSRT_headquarterOvwString(level) {
			var hqLevel = rHelper.data.headquarter[level];

			if ($.isArray(hqLevel.material)) {
				var string = rHelper.fn.CALC_headquarterOvwMaterial(level) + " x " + hqLevel.amount.toLocaleString("en-US");

				$("#hq-ovw-mat-" + level).html(string);
			}
		},
		CALC_convertMeterToYards(meter) {
			return Math.round(meter * 1.09361);
		},
		CALC_headquarterLevelCost(level) {
			var cost = 0;
			var hqLevel = rHelper.data.headquarter[level];

			if ($.isArray(hqLevel.material)) {

				$.each(hqLevel.material, function (k, material) {
					cost += hqLevel.amount * rHelper.fn.CALC_returnPriceViaId(material);
				});

			}

			return cost;
		},
		CALC_headquarterOvwMaterial(level) {
			var hqLevel = rHelper.data.headquarter[level];
			var string = "";

			if ($.isArray(hqLevel.material)) {

				var hqCost = rHelper.fn.CALC_headquarterLevelCost(level);

				$.each(hqLevel.material, function (k, material) {
					var addClass;

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

					var span = $(crEl("span"));
					span.addClass(addClass);

					string += span[0].outerHTML + " ";
				});
			}

			return string;
		},
		CALC_totalBuildingErectionSum(type) {
			var total = 0;

			$.each(rHelper.data.buildings, function (i, building) {
				for (var level = 0; level < building.level; level += 1) {
					$.each(building.material, function (k, material) {
						if (material != -1) {
							total += rHelper.fn.CALC_returnPriceViaId(material) * building["materialAmount" + k][level];
						} else {
							total += building["materialAmount" + k][level];
						}
					});
				}
			});

			return total;
		},
		CALC_perfectWorth(type) {
			var total = 0;

			if (type == "headquarter") {

				$.each(rHelper.data.headquarter, function (i, hqLevel) {
					$.each(hqLevel.material, function (k, material) {
						total += hqLevel.amount * rHelper.fn.CALC_returnPriceViaId(material);
					});
				});

			} else if (type == "buildings") {

				$.each(rHelper.data.buildings, function (i, building) {
					for (var level = 0; level < 10; level += 1) {
						$.each(building.material, function (k, material) {
							if (material != -1) {
								total += rHelper.fn.CALC_returnPriceViaId(material) * building["materialAmount" + k][level];
							} else {
								total += building["materialAmount" + k][level];
							}
						});
					}
				});
			}

			return total;
		},
		CALC_companyWorth() {
			var companyWorth = 0;

			companyWorth += rHelper.fn.CALC_totalHeadquarterErectionSum();
			companyWorth += rHelper.fn.CALC_totalFactoryErectionWorth();
			companyWorth += rHelper.fn.CALC_totalWarehouseErectionWorth();
			companyWorth += rHelper.fn.CALC_totalBuildingErectionSum();
			companyWorth += rHelper.fn.CALC_totalMineErectionSum();

			return companyWorth;
		},
		CALC_totalHeadquarterErectionSum() {
			var total = 0;

			var userHq = rHelper.data.headquarter.user;
			var userHqLevel = userHq.level;

			for (var i = (userHqLevel - 1); i > 1; i -= 1) {
				var hqLevel = rHelper.data.headquarter[i];
				$.each(hqLevel.material, function (k, material) {
					total += hqLevel.amount * rHelper.fn.CALC_returnPriceViaId(material);
				});
			}

			$.each(userHq.paid, function (i, paid) {
				if (paid != 0) {
					var material = rHelper.data.headquarter[userHqLevel].material[i];
					total += paid * rHelper.fn.CALC_returnPriceViaId(material);
				}
			});

			return total;
		},
		CALC_totalMineErectionSum() {
			var total = 0;

			var totalMines = rHelper.fn.CALC_totalMineCount();

			$.each(rHelper.data.material, function (i, material) {
				total += material.basePrice * (1 + 0.01 * totalMines) * material.amountOfMines;
			});

			return Math.round(total);
		},
		CALC_totalWarehouseErectionWorth() {
			var total = 0;

			var subArrays = [
				"material",
				"products",
				"loot",
				"units",
			];

			$.each(subArrays, function (i, index) {
				$.each(rHelper.data[index], function (k, obj) {
					for (var k = 1; k <= obj.warehouse.level; k += 1) {
						total += Math.pow((k - 1), 2) * 1250000;
					}
				});
			});

			return total;
		},
		CALC_totalFactoryErectionWorth() {
			var total = 0;

			$.each(rHelper.data.products, function (i, factory) {
				for (var level = 0; level <= factory.factoryLevel; level += 1) {

					$.each(factory.upgradeMaterial, function (k, material) {

						var value = Math.pow(level, 2) * factory.upgradeMaterialAmount[k]

						if (material != -1) {
							total += value * rHelper.fn.CALC_returnPriceViaId(material);
						} else {
							total += value;
						}
					});
				}
			});

			return total;
		},
		CALC_unitsCraftingPrice(unitId) {
			var unit = rHelper.data.units[unitId];
			var worth = unit.prices["current"].ai;
			var requiredAmount = unit.requiredAmount;
			var requirements = unit.requirements;

			$.each(requirements, function (index, requirement) {
				var price = rHelper.fn.CALC_returnPriceViaId(requirement);
				worth += price * requiredAmount[index];
			});

			if (rHelper.data.settings[3].value == 1) {
				worth *= rHelper.data.buildings[9].transportCost;
			}

			unit.profit.craftingPrice = worth;

			return worth;
		},
		CALC_unitsProfit(unitId) {
			var profitObj = rHelper.data.units[unitId].profit;
			var profit = (1 - profitObj.marketPrice / profitObj.craftingPrice) * 100;

			profit *= -1;

			return profit;
		},
		CALC_recyclingProfit(lootId) {
			var profitObj = rHelper.data.loot[lootId].profit;


			var profit = (1 - profitObj.outputWorth / profitObj.inputWorth) * 100;
			profit *= -1;

			return profit;
		},
		CALC_recyclingInputWorth(lootId) {
			var loot = rHelper.data.loot[lootId];
			var amount = loot.recyclingDivisor;

			var convertedId = lootId + 36;

			var price = rHelper.fn.CALC_returnPriceViaId(convertedId, 0);
			var worth = price * amount;

			if (rHelper.data.settings[3].value == 1) {
				worth *= rHelper.data.buildings[9].transportCost;
			}

			loot.profit.inputWorth = worth;
			return worth;
		},
		CALC_recyclingOutputWorth(lootId, recyclingPlantLevel) {

			var resultingAmount = rHelper.data.loot[lootId].recyclingAmount;
			var resultingProducts = rHelper.data.loot[lootId].recyclingProduct;
			var worth = 0;

			if ($.isArray(resultingProducts)) {
				$.each(resultingProducts, function (index, resultingProduct) {
					worth += rHelper.fn.CALC_recyclingOutputWorthHelper(recyclingPlantLevel, resultingProduct, resultingAmount, index);
				});
			} else {
				worth += rHelper.fn.CALC_recyclingOutputWorthHelper(recyclingPlantLevel, resultingProducts, resultingAmount);
			}

			rHelper.data.loot[lootId].profit.outputWorth = worth;

			return worth;
		},
		CALC_recyclingOutputWorthHelper(recyclingPlantLevel, resultingProduct, resultingAmount, index) {
			var price = rHelper.fn.CALC_returnPriceViaId(resultingProduct, 0);
			var amount = resultingAmount * recyclingPlantLevel;

			if ($.isArray(resultingAmount)) {
				amount = resultingAmount[index] * recyclingPlantLevel;
			}

			var worth = amount * price;

			return worth;
		},
		CALC_recyclingRequirement(lootId) {
			return rHelper.data.loot[lootId].recyclingDivisor;
		},
		CALC_recyclingProducts(lootId, recyclingPlantLevel) {
			var resultingAmount = rHelper.data.loot[lootId].recyclingAmount;
			var resultingProducts = rHelper.data.loot[lootId].recyclingProduct;

			var string = "";

			if ($.isArray(resultingProducts)) {
				$.each(resultingProducts, function (index, resultingProduct) {
					string += rHelper.fn.CALC_recyclingProductsHelper(recyclingPlantLevel, resultingProduct, resultingAmount, index);
				});
			} else {
				string += rHelper.fn.CALC_recyclingProductsHelper(recyclingPlantLevel, resultingProducts, resultingAmount);
			}

			return string;
		},
		CALC_recyclingProductsHelper(recyclingPlantLevel, resultingProduct, resultingAmount, index) {
			var icon = $(crEl("span"));
			var product = rHelper.fn.CALC_convertId(resultingProduct);
			icon.addClass(product.icon);

			var amount = resultingAmount * recyclingPlantLevel;

			if ($.isArray(resultingAmount)) {
				amount = resultingAmount[index] * recyclingPlantLevel;
			}

			var string = icon[0].outerHTML + " " + amount.toLocaleString("en-US") + " ";

			return string;
		},
		CALC_buildingToLevel10(buildingId) {
			var building = rHelper.data.buildings[buildingId];
			var buildingLevel = building.level;

			var level10Cost = 0;
			var level10Transportation = 0;

			for (var level = buildingLevel; level < 10; level += 1) {
				for (var i = 0; i <= 3; i += 1) {

					if (i === 0) {
						var cash = building.materialAmount0[level];
						level10Cost += cash;
					} else {
						var selector = "materialAmount" + i;
						var material = rHelper.fn.CALC_convertId(building.material[i]);

						var materialAmount = building[selector][level];

						if (typeof (materialAmount) == "number") {

							var materialPrice = rHelper.fn.CALC_returnPriceViaId(building.material[i]);
							var materialWorth = materialPrice * materialAmount;
							var transportation = (rHelper.data.buildings[9].transportCost - 1) * materialWorth;

							level10Cost += materialWorth;
							level10Transportation += transportation;

						}
					}
				}
			}
			return {
				"level10Cost": level10Cost,
				"level10Transportation": Math.round(level10Transportation)
			}
		},
		CALC_warehouseUpgradeCost(targetLevel) {
			return Math.pow(targetLevel - 1, 2) * 1250000;
		},
		CALC_warehouseCostFromTo(start, end) {
			var warehouseCost = 0;

			for (var i = end; i > start; i -= 1) {
				warehouseCost += rHelper.fn.CALC_warehouseUpgradeCost(i);
			}

			return warehouseCost;
		},
		CALC_warehouseContingent(level) {
			return Math.pow(level, 2) * 5000;
		},
		CALC_warehouseUpgradeCostContigentBased(startLevel, endContingent) {
			var warehouseCost = 0;
			var nextBiggerTargetLevel = Math.ceil(Math.sqrt(endContingent / 5000));

			warehouseCost += rHelper.fn.CALC_warehouseCostFromTo(startLevel, nextBiggerTargetLevel);

			return warehouseCost;
		},
		CALC_warehouseUpgradeCostOnInput(id, type, value) {
			var mode = $("#warehouse-" + type + "-calc-1-" + id).val();
			var currentWarehouseLevel = rHelper.data[type][id].warehouse.level;
			var upgradeCost = 0;

			switch (mode) {
			case "level":
				upgradeCost = rHelper.fn.CALC_warehouseCostFromTo(currentWarehouseLevel, value);
				break;
			case "contingent":
				upgradeCost = rHelper.fn.CALC_warehouseUpgradeCostContigentBased(currentWarehouseLevel, value);
				break;
			}

			return upgradeCost;
		},
		CALC_warehouseWorth(id, type) {
			var price = 0;
			var priceId = 0;

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

			price = rHelper.fn.CALC_returnPriceViaId(priceId);

			return price;
		},
		CALC_warehouseRemainingTimeToFull(id, type) {
			var el = rHelper.data[type][id];
			var remainingCapacity = el.warehouse.contingent - el.warehouse.fillAmount;
			var remainingTime = 0;
			var divisor = 1;

			if (type == "material") {
				divisor = el.perHour;
			} else if (type == "products")  {
				divisor = el.scaling * el.factoryLevel * rHelper.fn.CALC_factoryMinWorkload(id);
			}

			remainingTime = remainingCapacity / divisor;

			if (remainingTime > 24) {
				remainingTime = "> " + (remainingTime / 24).toFixed(2) + " days";
			} else {
				remainingTime = "> " + remainingTime.toFixed(2) + " hours";
			}

			if ((type == "products" && el.turnover <= 0) || type == "loot" ||  type == "units") {
				remainingTime = "∞";
			}

			return remainingTime;
		},
		CALC_warehouseTotalLevel() {
			var total = 0;

			var arr = ["material", "products", "loot", "units"];

			$.each(arr, function (index, pointer) {
				$.each(rHelper.data[pointer], function (index, el) {
					total += el.warehouse.level;
				});
			});

			return total;
		},
		CALC_warehouseTotalWorth() {
			var total = 0;

			var arr = ["material", "products", "loot", "units"];

			$.each(arr, function (index, pointer) {
				$.each(rHelper.data[pointer], function (index, el) {
					total += rHelper.fn.CALC_warehouseWorth(index, pointer) * el.warehouse.fillAmount;
				});
			});

			return total;
		},
		CALC_flowDistributionHelper(type, dependantFactory, id, i) {
			var originalIndex = 0;
			var dependantIconIndex = 0;
			var requiredAmountPerLevel = 0;
			var dependantObj = {};
			var requiredAmount = 0;
			var string = "";
			var arrow = '<svg xmlns="http://www.w3.org/2000/svg" width="15" fill="#fff" viewBox="0 0 31.49 31.49"><path d="M21.205 5.007c-.429-.444-1.143-.444-1.587 0-.429.429-.429 1.143 0 1.571l8.047 8.047H1.111C.492 14.626 0 15.118 0 15.737c0 .619.492 1.127 1.111 1.127h26.554l-8.047 8.032c-.429.444-.429 1.159 0 1.587.444.444 1.159.444 1.587 0l9.952-9.952c.444-.429.444-1.143 0-1.571l-9.952-9.953z"/></svg>';

			if (type == "material") {
				dependantIconIndex = (dependantFactory - 14);
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
					originalIndex = dependantObj.dependencies.indexOf((id + 14));
					requiredAmountPerLevel = dependantObj.requiredAmount[originalIndex];
				} else {
					originalIndex = dependantObj.dependencies;
					requiredAmountPerLevel = dependantObj.requiredAmount;
				}
			}

			if (dependantObj.turnover > 0) {
				requiredAmount = dependantObj.factoryLevel * requiredAmountPerLevel;
			}

			string += '<span class="resources-' + type + '-' + id + '"></span> ';
			string += requiredAmount.toLocaleString("en-US") + " " + arrow + " ";
			string += '<span class="resources-product-' + dependantIconIndex + '"></span> ';

			var name1 = "";
			var name2 = dependantObj.name;
			switch (type) {
			case "material":
				name1 = rHelper.data.material[id].name;
				break;
			case "product":
				name1 = rHelper.data.products[id].name;
				break;
			}

			$("#flow-" + type + "-distribution-" + id + "-" + i).html(string).attr("data-th", name1 + " to " + name2);

			return requiredAmount;
		},
		CALC_flowDistribution(id, type) {

			var string = "";
			var perHour = 0;
			var obj = {};
			var requiredAmount = 0;

			switch (type) {
			case "material":
				obj = rHelper.data.material[id];
				perHour = obj.perHour;
				break;
			case "product":
				obj = rHelper.data.products[id];
				var factoryLevel = obj.factoryLevel;
				var scaling = obj.scaling;
				var workload = rHelper.fn.CALC_factoryMinWorkload(id);
				perHour = factoryLevel * scaling * workload;
				break;
			}

			var dependantFactories = obj.dependantFactories;

			if ($.isArray(dependantFactories)) {
				$.each(dependantFactories, function (i, dependantFactory) {

					requiredAmount += rHelper.fn.CALC_flowDistributionHelper(type, dependantFactory, id, i);

				});
			} else if (dependantFactories != "") {

				requiredAmount += rHelper.fn.CALC_flowDistributionHelper(type, dependantFactories, id, 0);

			}

			return perHour - requiredAmount;
		},
		CALC_flowRate(id, type) {
			var rate = 0;

			switch (type) {
			case "material":
				rate = rHelper.data.material[id].perHour;
				break;
			case "product":
				var factory = rHelper.data.products[id];
				var workload = rHelper.fn.CALC_factoryMinWorkload(id);
				rate = factory.factoryLevel * factory.scaling * workload;
				break;
			}

			return rate;
		},
		CALC_factoryMinWorkload(factoryId) {
			var workload = rHelper.data.products[factoryId].dependencyWorkload.min();
			if (workload > 1) {
				workload = 1;
			}

			return workload;
		},
		CALC_diamondTotalProfit() {
			var val = 0;

			$.each(rHelper.data.products, function (i, factory) {
				var diamondProfit = factory.diamond.profit;
				if (diamondProfit > 0) {
					val += diamondProfit;
				}
			});

			return val;
		},
		CALC_diamondTop10Profit() {
			var arr = [];

			$.each(rHelper.data.products, function (i, factory) {
				var diamondProfit = factory.diamond.profit;
				if (diamondProfit > 0) {
					arr.push(diamondProfit);
				}
			});
			var sum = 0;

			arr = arr.sort(function (a, b) {
				return b - a;
			});

			for (var i = 0; i <= 9; i += 1) {
				if (arr[i]) {
					sum += arr[i];
				}
			}

			return sum;

		},
		CALC_diamondEfficiency(factoryId) {
			var factoryDiamond = rHelper.data.products[factoryId].diamond;
			var efficiency = factoryDiamond.outputWorth / (factoryDiamond.dependenciesWorth + factoryDiamond.productionCost);

			if (isNaN(efficiency)) {
				efficiency = 0;
			}

			factoryDiamond.efficiency = efficiency;
			return efficiency;
		},
		CALC_diamondProfit(factoryId) {
			var factoryDiamond = rHelper.data.products[factoryId].diamond;
			factoryDiamond.profit = factoryDiamond.outputWorth - (factoryDiamond.dependenciesWorth + factoryDiamond.productionCost);

			return factoryDiamond.profit;
		},
		CALC_nextGreaterWarehouseLevel(amount) {
			return Math.ceil(Math.sqrt(amount / 5000));
		},
		CALC_diamondFactoryOutput(factoryId) {
			var factory = rHelper.data.products[factoryId];
			var outputAmount = factory.factoryLevel * factory.scaling * 5 * 24;
			var productionCost = 5 * 24 * factory.cashPerHour;

			if (factory.factoryLevel == 0) {
				productionCost = 0;
			}

			rHelper.data.products[factoryId].diamond = {
				"outputWorth": outputAmount * rHelper.fn.CALC_returnPriceViaId((factoryId + 14)),
				"dependenciesWorth": 0,
				"productionCost": productionCost,
				"efficiency": 0,
				"profit": 0
			}

			return factory.factoryLevel * factory.scaling * 5 * 24;
		},
		CALC_dependantFactoriesHelper(dependantFactory, type) {
			if (type == "material") {
				dependantFactory -= 14;
			}
			rHelper.fn.INSRT_factoryDependencies(dependantFactory);
			rHelper.fn.INSRT_factoryWorkload(dependantFactory);
			rHelper.fn.INSRT_factoryTurnover(dependantFactory);
			rHelper.fn.INSRT_factoryTurnoverPerUpgrade(dependantFactory);
			rHelper.fn.INSRT_factoryROI(dependantFactory);

			rHelper.fn.INSRT_factoryHighlightColumns();

			if (rHelper.data.products[dependantFactory].dependantFactories != "") {
				rHelper.fn.CALC_dependantFactories(dependantFactory, "product");
			}
		},
		CALC_dependantFactories(id, type) {

			var dependantFactories = "";

			switch (type) {
			case "material":
				dependantFactories = rHelper.data.material[id].dependantFactories;
				break;
			case "product":
				dependantFactories = rHelper.data.products[id].dependantFactories;
				break;
			}

			if ($.isArray(dependantFactories)) {
				$.each(dependantFactories, function (k, dependantFactory) {
					rHelper.fn.CALC_dependantFactoriesHelper(dependantFactory, type);
				});
			} else if (dependantFactories != "") {
				rHelper.fn.CALC_dependantFactoriesHelper(dependantFactories, type);
			}
		},
		CALC_factoryTurnoverPerUpgrade(factoryId) {
			var value = 0;

			var thisLevelWorkload = rHelper.fn.CALC_factoryMinWorkload(factoryId);

			var nextLevelWorkloadArray = [];
			var dependencies = rHelper.data.products[factoryId].dependencies;

			if ($.isArray(dependencies)) {

				$.each(dependencies, function (dependencyIndex) {
					var dependencyWorkload = rHelper.fn.CALC_factoryDepedencyWorkload(factoryId, dependencyIndex, "nextLevel");
					nextLevelWorkloadArray.push(dependencyWorkload);
				});
			} else {
				var dependencyWorkload = rHelper.fn.CALC_factoryDepedencyWorkload(factoryId, 0, "nextLevel");
				nextLevelWorkloadArray.push(dependencyWorkload);
			}

			var nextLevelWorkload = nextLevelWorkloadArray.min();

			if (nextLevelWorkload > 1) {
				nextLevelWorkload = 1;
			}

			value = parseInt(rHelper.fn.CALC_factoryTurnover(factoryId, "nextLevel", nextLevelWorkload) - rHelper.data.products[factoryId].turnover);

			if (value < 10 && value > -10) {
				value = 0;
			}

			return value;
		},
		CALC_factoryDependencyExistingAmount(dependantObj, dependencyIndex) {
			if (dependantObj.perHour) {
				return dependantObj.perHour;
			} else {
				//return dependantObj.factoryLevel * dependantObj.scaling * (dependantObj.dependencyWorkload[dependencyIndex] / 100);
				return dependantObj.factoryLevel * dependantObj.scaling;
			}
		},
		CALC_factoryWorkloadMinNonSanitized(factoryId) {
			return rHelper.data.products[factoryId].dependencyWorkload.min();
		},
		CALC_factoryCashCostPerHour(factoryId, nextLevel) {
			var factory = rHelper.data.products[factoryId];
			var factoryLevel = factory.factoryLevel;

			if (nextLevel) {
				factoryLevel += 1;
			}

			return factory.cashPerHour * factoryLevel;
		},
		CALC_factoryTurnover(factoryId, nextLevel, nextLevelWorkload) {
			var factory = rHelper.data.products[factoryId];
			var price = rHelper.fn.CALC_returnPriceViaId((factoryId + 14));
			var factoryLevel = factory.factoryLevel;
			var cashCost = rHelper.fn.CALC_factoryCashCostPerHour(factoryId, nextLevel);
			var workload = rHelper.fn.CALC_factoryMinWorkload(factoryId);
			var materialWorth = 0;

			if (nextLevel) {
				factoryLevel += 1;
				workload = nextLevelWorkload;
			}

			var outputWorth = factory.scaling * factoryLevel * price;

			if ($.isArray(factory.dependencies)) {
				$.each(factory.dependencies, function (index) {
					var dependencyWorth = rHelper.fn.CALC_factoryDependencyWorth(factoryId, index, nextLevel);
					materialWorth += dependencyWorth;
				});
			} else {
				var dependencyWorth = rHelper.fn.CALC_factoryDependencyWorth(factoryId, 0, nextLevel);
				materialWorth += dependencyWorth;
			}

			var remainingValue = (outputWorth - materialWorth - cashCost) * workload;

			return remainingValue;
		},
		CALC_factoryDependencyWorth(factoryId, dependencyIndex, nextLevel) {
			var factory = rHelper.data.products[factoryId];
			var factoryLevel = factory.factoryLevel;
			var requiredAmount = 0;
			var dependencyPrice = 0;

			if (nextLevel) {
				factoryLevel += 1;
			}

			if ($.isArray(factory.dependencies)) {
				requiredAmount = factory.requiredAmount[dependencyIndex];
				dependencyPrice = rHelper.fn.CALC_returnPriceViaId(factory.dependencies[dependencyIndex]);
			} else {
				requiredAmount = factory.requiredAmount;
				dependencyPrice = rHelper.fn.CALC_returnPriceViaId(factory.dependencies);
			}

			return factoryLevel * requiredAmount * dependencyPrice;
		},
		CALC_factoryDepedencyWorkload(factoryId, dependencyIndex, nextLevel) {

			var workload = 0;
			var factory = rHelper.data.products[factoryId];
			var factoryLevel = factory.factoryLevel;
			var thisDependency;
			var baseAmountRequirement;

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

			var requiredAmount = baseAmountRequirement * factoryLevel;
			var existingAmount = 0;

			if (thisDependency <= 13) {
				existingAmount = rHelper.data.material[thisDependency].perHour;
			} else {
				var actualFactory = rHelper.fn.CALC_convertId(thisDependency);
				var minDependencyWorkload = actualFactory.dependencyWorkload.min();
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
			return (rHelper.data.products[factoryId].upgradeCost / rHelper.data.products[factoryId].turnoverIncrease) / 24;
		},
		CALC_factoryComparatorRequiredVsExistingAmount(requiredAmount, existingAmount) {
			var addClass;
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
			var factory = rHelper.data.products[factoryId];
			var requiredAmount = 0;
			if ($.isArray(factory.requiredAmount)) {
				requiredAmount = factory.requiredAmount[dependencyIndex];
			} else {
				requiredAmount = factory.requiredAmount;
			}
			return requiredAmount * factory.factoryLevel;
		},
		CALC_totalFactoryUpgrades() {
			var totalFactoryUpgrades = 0;

			$.each(rHelper.data.products, function (i, factory) {
				totalFactoryUpgrades += factory.factoryLevel;
			});

			return totalFactoryUpgrades;
		},
		CALC_factoryUpgradeCost(factoryId) {

			var factoryLevel = rHelper.data.products[factoryId].factoryLevel;

			if (typeof (factoryLevel) == "undefined" || !factoryLevel) {
				factoryLevel = 0;
			}

			var nextLevel = factoryLevel + 1;
			var sum = 0;
			var sumTransportation = 0;
			var table = $(crEl("table"));
			var tbody = $(crEl("tbody"));
			var td;
			var small;

			$.each(rHelper.data.products[factoryId].upgradeMaterialAmount, function (i, amount) {
				var tr = $(crEl("tr"));
				var k = 0;

				if (i === 0) {
					sum += amount * Math.pow(nextLevel, 2);

					for (k = 0; k <= 2; k += 1) {
						td = $(crEl("td"));

						switch (k) {
						case 0:
							var img = $(crEl("img"));
							img.attr("src", "assets/img/cash.png").attr("alt", "Cash");
							td.append(img[0]);
							break;
						case 1:
							td.addClass("text-right").attr("colspan", 3).text(sum.toLocaleString("en-US"));
							break;
						case 2:
							small = $(crEl("small"));
							small.text("Transportation");
							td.addClass("text-right text-warning").append(small[0]);
							break;
						}

						tr.append(td[0]);
					}
				} else {
					var upgradeMaterial = rHelper.data.products[factoryId].upgradeMaterial[i];
					var upgradeMaterialAmount = amount * Math.pow(nextLevel, 2);
					var price = rHelper.fn.CALC_returnPriceViaId(upgradeMaterial);
					var materialWorth = price * upgradeMaterialAmount;
					var transportation = (rHelper.data.buildings[9].transportCost - 1) * materialWorth;
					var className;

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
							td.addClass("resources-" + className + "-" + (upgradeMaterial - 1));
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
							small = $(crEl("small"));
							small.addClass("text-warning").text(transportation.toLocaleString("en-US"));
							td.addClass("text-right").append(small[0]);
							break;
						}
						tr.append(td[0]);
					}
				}
				tbody.append(tr[0]);
			});

			var tr = $(crEl("tr"));
			for (var k = 0; k <= 1; k += 1) {
				td = $(crEl("td"));
				td.addClass("text-right");

				if (k === 0) {
					td.attr("colspan", 4).text(sum.toLocaleString("en-US"));
				} else {
					small = $(crEl("small"));
					small.addClass("text-warning").text(sumTransportation.toLocaleString("en-US"));
					td.append(small[0]);
				}
				tr.append(td[0]);
			}
			tbody.append(tr[0]);
			table.append(tbody[0]);

			rHelper.data.products[factoryId].upgradeCost = sum;

			var result = {
				"sum": sum,
				"title": table[0].outerHTML
			};

			return result;
		},
		CALC_factoryOutput(factoryId) {
			var factory = rHelper.data.products[factoryId];
			return factory.factoryLevel * factory.scaling;
		},
		CALC_totalMineCount() {
			var totalMineCount = 0;

			$.each(rHelper.data.material, function (i, material) {
				totalMineCount += material.amountOfMines;
			});

			return totalMineCount;
		},
		CALC_totalMineWorth() {
			var totalMineWorth = 0;

			$.each(rHelper.data.material, function (i, material) {
				totalMineWorth += rHelper.fn.CALC_materialRateWorth(i);
			});

			return totalMineWorth;
		},
		CALC_returnPriceViaId(id, period) {

			var possiblePrices = [
				"current",
				"1day",
				"3days",
				"7days",
				"4weeks",
				"3months",
				"6months",
				"1year",
				"max"
			];

			var index = 0;

			if (typeof (period) == "undefined") {
				index = possiblePrices[rHelper.data.settings[5].value];
			} else if (typeof (period) == "number") {
				index = possiblePrices[period];
			}

			var target = rHelper.fn.CALC_convertId(id);
			var targetPrices = target.prices[index];

			if (targetPrices.ai >= targetPrices.player) {
				return targetPrices.ai;
			} else {
				return targetPrices.player;
			}
		},
		CALC_convertId(id) {
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
			return Math.round(rHelper.data.material[materialId].basePrice * (1 + totalMineCount / 50));
		},
		CALC_materialRateWorth(materialId) {
			return rHelper.data.material[materialId].perHour * rHelper.fn.CALC_returnPriceViaId(materialId);
		},
		CALC_materialMinePerfectIncome(materialId) {
			return rHelper.data.material[materialId].maxRate * rHelper.fn.CALC_returnPriceViaId(materialId);
		},
		CALC_materialMineROI(type) {

			var array = [];

			for (var i = 0; i <= 13; i += 1) {
				var newMinePrice = rHelper.fn.CALC_materialNewMinePrice(rHelper.fn.CALC_totalMineCount(), i);
				var perfectIncome = rHelper.fn.CALC_materialMinePerfectIncome(i);
				var customTUPrice = rHelper.fn.CALC_customTUPrice();

				switch (type) {
				case "100":
					array.push(newMinePrice / perfectIncome / 24);
					break;
				case "505":
					array.push((newMinePrice + customTUPrice) / perfectIncome / 24 / 5.05);
					break;
				case "505hq":

					var userHQLevel = 1;

					if (rHelper.data.headquarter.user) {
						userHQLevel = rHelper.data.headquarter.user.level;
					}

					var hqBoost = rHelper.data.headquarter[(userHQLevel - 1)].boost - 0.9;
					array.push((newMinePrice + customTUPrice) / perfectIncome / 24 / 5.05 / hqBoost);
					break;
				}
			}
			return array;
		},
		CALC_customTUPrice() {
			var customTUPrice = 0;
			var tuIndex = 46;

			for (var i = 0; i <= 3; i += 1) {
				customTUPrice += rHelper.data.settings[1].value[i] * rHelper.fn.CALC_returnPriceViaId((tuIndex + i));
			}

			return customTUPrice;
		}
	},
	"graphs": {
		"gaugeOptions": {
			chart: {
				type: "solidgauge",
				backgroundColor: "transparent"
			},
			title: null,
			pane: {
				center: [
					"50%",
					"85%"
				],
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
							color: "#ffffff"
						},
						useHTML: true
					}
				}
			}
		},
		"material": {
			"target": "graph-material",
			"categories": [],
			"mineData": [],
			"incomeData": [],
			"data": [],
			"colors": [
				"#8a4f3e",
				"#a4938e",
				"#aba59a",
				"#2d2c2b",
				"#8a5a3a",
				"#d8d8d8",
				"#b58359",
				"#b87259",
				"#9b7953",
				"#c4b9ab",
				"#957e60",
				"#cccbc2",
				"#b28b3d",
				"#b0a17d"
			],
			"reference": {
				"mineCount": 0,
				"mineIncome": 0
			},
			"seriesNames": [
				"Mines",
				"Mine income",
			],
			"responsiveId": "income",
			"titleText": "mine distribution vs mine income"
		}
	},
	"data": {},
	"tu": [{
		"tu1": 145,
		"tu2": 1,
		"tu3": 2,
		"tu4": 2,
		"factor": 5.049546987548256
	}, {
		"tu1": 142,
		"tu2": 4,
		"tu3": 1,
		"tu4": 2,
		"factor": 5.049537328215894
	}, {
		"tu1": 141,
		"tu2": 1,
		"tu3": 5,
		"tu4": 1,
		"factor": 5.049975808955912
	}, {
		"tu1": 139,
		"tu2": 7,
		"tu3": 0,
		"tu4": 2,
		"factor": 5.04952766890201
	}, {
		"tu1": 138,
		"tu2": 4,
		"tu3": 4,
		"tu4": 1,
		"factor": 5.049966148803255
	}, {
		"tu1": 135,
		"tu2": 7,
		"tu3": 3,
		"tu4": 1,
		"factor": 5.049956488669072
	}, {
		"tu1": 135,
		"tu2": 2,
		"tu3": 8,
		"tu4": 0,
		"factor": 5.049909577605985
	}, {
		"tu1": 132,
		"tu2": 10,
		"tu3": 2,
		"tu4": 1,
		"factor": 5.049946828553374
	}, {
		"tu1": 132,
		"tu2": 5,
		"tu3": 7,
		"tu4": 0,
		"factor": 5.049899917580023
	}, {
		"tu1": 129,
		"tu2": 13,
		"tu3": 1,
		"tu4": 1,
		"factor": 5.049937168456153
	}, {
		"tu1": 129,
		"tu2": 8,
		"tu3": 6,
		"tu4": 0,
		"factor": 5.049890257572537
	}, {
		"tu1": 126,
		"tu2": 16,
		"tu3": 0,
		"tu4": 1,
		"factor": 5.049927508377411
	}, {
		"tu1": 126,
		"tu2": 11,
		"tu3": 5,
		"tu4": 0,
		"factor": 5.049880597583531
	}, {
		"tu1": 123,
		"tu2": 14,
		"tu3": 4,
		"tu4": 0,
		"factor": 5.0498709376130035
	}, {
		"tu1": 120,
		"tu2": 17,
		"tu3": 3,
		"tu4": 0,
		"factor": 5.0498612776609555
	}, {
		"tu1": 117,
		"tu2": 20,
		"tu3": 2,
		"tu4": 0,
		"factor": 5.049851617727384
	}, {
		"tu1": 114,
		"tu2": 23,
		"tu3": 1,
		"tu4": 0,
		"factor": 5.049841957812293
	}, {
		"tu1": 111,
		"tu2": 26,
		"tu3": 0,
		"tu4": 0,
		"factor": 5.049832297915679
	}, {
		"tu1": 99,
		"tu2": 0,
		"tu3": 0,
		"tu4": 13,
		"factor": 5.0498315619730025
	}, {
		"tu1": 93,
		"tu2": 1,
		"tu3": 3,
		"tu4": 12,
		"factor": 5.049765332514903
	}, {
		"tu1": 90,
		"tu2": 4,
		"tu3": 2,
		"tu4": 12,
		"factor": 5.049755672764868
	}, {
		"tu1": 87,
		"tu2": 7,
		"tu3": 1,
		"tu4": 12,
		"factor": 5.049746013033308
	}, {
		"tu1": 87,
		"tu2": 2,
		"tu3": 6,
		"tu4": 11,
		"factor": 5.0496991039254135
	}, {
		"tu1": 84,
		"tu2": 10,
		"tu3": 0,
		"tu4": 12,
		"factor": 5.04973635332023
	}, {
		"tu1": 84,
		"tu2": 5,
		"tu3": 5,
		"tu4": 11,
		"factor": 5.049689444302067
	}, {
		"tu1": 84,
		"tu2": 0,
		"tu3": 10,
		"tu4": 10,
		"factor": 5.049642535719661
	}, {
		"tu1": 81,
		"tu2": 8,
		"tu3": 4,
		"tu4": 11,
		"factor": 5.049679784697198
	}, {
		"tu1": 81,
		"tu2": 3,
		"tu3": 9,
		"tu4": 10,
		"factor": 5.049632876204525
	}, {
		"tu1": 78,
		"tu2": 11,
		"tu3": 3,
		"tu4": 11,
		"factor": 5.049670125110809
	}, {
		"tu1": 78,
		"tu2": 6,
		"tu3": 8,
		"tu4": 10,
		"factor": 5.049623216707865
	}, {
		"tu1": 78,
		"tu2": 1,
		"tu3": 13,
		"tu4": 9,
		"factor": 5.049576308740673
	}, {
		"tu1": 75,
		"tu2": 14,
		"tu3": 2,
		"tu4": 11,
		"factor": 5.049660465542896
	}, {
		"tu1": 75,
		"tu2": 9,
		"tu3": 7,
		"tu4": 10,
		"factor": 5.0496135572296845
	}, {
		"tu1": 75,
		"tu2": 4,
		"tu3": 12,
		"tu4": 9,
		"factor": 5.049566649352222
	}, {
		"tu1": 72,
		"tu2": 17,
		"tu3": 1,
		"tu4": 11,
		"factor": 5.049650805993463
	}, {
		"tu1": 72,
		"tu2": 12,
		"tu3": 6,
		"tu4": 10,
		"factor": 5.049603897769982
	}, {
		"tu1": 72,
		"tu2": 7,
		"tu3": 11,
		"tu4": 9,
		"factor": 5.049556989982251
	}, {
		"tu1": 72,
		"tu2": 2,
		"tu3": 16,
		"tu4": 8,
		"factor": 5.049510082630265
	}, {
		"tu1": 71,
		"tu2": 4,
		"tu3": 15,
		"tu4": 8,
		"factor": 5.049995472429614
	}, {
		"tu1": 69,
		"tu2": 20,
		"tu3": 0,
		"tu4": 11,
		"factor": 5.049641146462505
	}, {
		"tu1": 69,
		"tu2": 15,
		"tu3": 5,
		"tu4": 10,
		"factor": 5.049594238328755
	}, {
		"tu1": 69,
		"tu2": 10,
		"tu3": 10,
		"tu4": 9,
		"factor": 5.049547330630755
	}, {
		"tu1": 69,
		"tu2": 5,
		"tu3": 15,
		"tu4": 8,
		"factor": 5.0495004233685
	}, {
		"tu1": 68,
		"tu2": 7,
		"tu3": 14,
		"tu4": 8,
		"factor": 5.049985812239343
	}, {
		"tu1": 68,
		"tu2": 2,
		"tu3": 19,
		"tu4": 7,
		"factor": 5.049938900903856
	}, {
		"tu1": 66,
		"tu2": 18,
		"tu3": 4,
		"tu4": 10,
		"factor": 5.049584578906008
	}, {
		"tu1": 66,
		"tu2": 13,
		"tu3": 9,
		"tu4": 9,
		"factor": 5.049537671297738
	}, {
		"tu1": 65,
		"tu2": 10,
		"tu3": 13,
		"tu4": 8,
		"factor": 5.049976152067548
	}, {
		"tu1": 65,
		"tu2": 5,
		"tu3": 18,
		"tu4": 7,
		"factor": 5.0499292408218
	}, {
		"tu1": 65,
		"tu2": 0,
		"tu3": 23,
		"tu4": 6,
		"factor": 5.049882330011827
	}, {
		"tu1": 63,
		"tu2": 21,
		"tu3": 3,
		"tu4": 10,
		"factor": 5.049574919501737
	}, {
		"tu1": 63,
		"tu2": 16,
		"tu3": 8,
		"tu4": 9,
		"factor": 5.049528011983197
	}, {
		"tu1": 62,
		"tu2": 13,
		"tu3": 12,
		"tu4": 8,
		"factor": 5.049966491914233
	}, {
		"tu1": 62,
		"tu2": 8,
		"tu3": 17,
		"tu4": 7,
		"factor": 5.049919580758222
	}, {
		"tu1": 62,
		"tu2": 3,
		"tu3": 22,
		"tu4": 6,
		"factor": 5.049872670037985
	}, {
		"tu1": 60,
		"tu2": 24,
		"tu3": 2,
		"tu4": 10,
		"factor": 5.049565260115945
	}, {
		"tu1": 60,
		"tu2": 19,
		"tu3": 7,
		"tu4": 9,
		"factor": 5.0495183526871354
	}, {
		"tu1": 59,
		"tu2": 16,
		"tu3": 11,
		"tu4": 8,
		"factor": 5.049956831779397
	}, {
		"tu1": 59,
		"tu2": 11,
		"tu3": 16,
		"tu4": 7,
		"factor": 5.049909920713121
	}, {
		"tu1": 59,
		"tu2": 6,
		"tu3": 21,
		"tu4": 6,
		"factor": 5.049863010082621
	}, {
		"tu1": 59,
		"tu2": 1,
		"tu3": 26,
		"tu4": 5,
		"factor": 5.049816099887894
	}, {
		"tu1": 57,
		"tu2": 27,
		"tu3": 1,
		"tu4": 10,
		"factor": 5.049555600748631
	}, {
		"tu1": 57,
		"tu2": 22,
		"tu3": 6,
		"tu4": 9,
		"factor": 5.049508693409551
	}, {
		"tu1": 56,
		"tu2": 24,
		"tu3": 5,
		"tu4": 9,
		"factor": 5.049994083075359
	}, {
		"tu1": 56,
		"tu2": 19,
		"tu3": 10,
		"tu4": 8,
		"factor": 5.0499471716630415
	}, {
		"tu1": 56,
		"tu2": 14,
		"tu3": 15,
		"tu4": 7,
		"factor": 5.049900260686504
	}, {
		"tu1": 56,
		"tu2": 9,
		"tu3": 20,
		"tu4": 6,
		"factor": 5.049853350145739
	}, {
		"tu1": 56,
		"tu2": 4,
		"tu3": 25,
		"tu4": 5,
		"factor": 5.049806440040745
	}, {
		"tu1": 54,
		"tu2": 30,
		"tu3": 0,
		"tu4": 10,
		"factor": 5.049545941399794
	}, {
		"tu1": 53,
		"tu2": 27,
		"tu3": 4,
		"tu4": 9,
		"factor": 5.049984422887742
	}, {
		"tu1": 53,
		"tu2": 22,
		"tu3": 9,
		"tu4": 8,
		"factor": 5.049937511565163
	}, {
		"tu1": 53,
		"tu2": 17,
		"tu3": 14,
		"tu4": 7,
		"factor": 5.049890600678362
	}, {
		"tu1": 53,
		"tu2": 12,
		"tu3": 19,
		"tu4": 6,
		"factor": 5.049843690227331
	}, {
		"tu1": 53,
		"tu2": 7,
		"tu3": 24,
		"tu4": 5,
		"factor": 5.049796780212072
	}, {
		"tu1": 53,
		"tu2": 2,
		"tu3": 29,
		"tu4": 4,
		"factor": 5.04974987063258
	}, {
		"tu1": 50,
		"tu2": 30,
		"tu3": 3,
		"tu4": 9,
		"factor": 5.049974762718609
	}, {
		"tu1": 50,
		"tu2": 25,
		"tu3": 8,
		"tu4": 8,
		"factor": 5.049927851485765
	}, {
		"tu1": 50,
		"tu2": 20,
		"tu3": 13,
		"tu4": 7,
		"factor": 5.0498809406887
	}, {
		"tu1": 50,
		"tu2": 15,
		"tu3": 18,
		"tu4": 6,
		"factor": 5.049834030327405
	}, {
		"tu1": 50,
		"tu2": 10,
		"tu3": 23,
		"tu4": 5,
		"factor": 5.049787120401883
	}, {
		"tu1": 50,
		"tu2": 5,
		"tu3": 28,
		"tu4": 4,
		"factor": 5.049740210912124
	}, {
		"tu1": 50,
		"tu2": 0,
		"tu3": 33,
		"tu4": 3,
		"factor": 5.049693301858126
	}, {
		"tu1": 47,
		"tu2": 33,
		"tu3": 2,
		"tu4": 9,
		"factor": 5.04996510256795
	}, {
		"tu1": 47,
		"tu2": 28,
		"tu3": 7,
		"tu4": 8,
		"factor": 5.049918191424844
	}, {
		"tu1": 47,
		"tu2": 23,
		"tu3": 12,
		"tu4": 7,
		"factor": 5.049871280717514
	}, {
		"tu1": 47,
		"tu2": 18,
		"tu3": 17,
		"tu4": 6,
		"factor": 5.049824370445955
	}, {
		"tu1": 47,
		"tu2": 13,
		"tu3": 22,
		"tu4": 5,
		"factor": 5.049777460610167
	}, {
		"tu1": 47,
		"tu2": 8,
		"tu3": 27,
		"tu4": 4,
		"factor": 5.049730551210141
	}, {
		"tu1": 47,
		"tu2": 3,
		"tu3": 32,
		"tu4": 3,
		"factor": 5.049683642245876
	}, {
		"tu1": 45,
		"tu2": 1,
		"tu3": 1,
		"tu4": 23,
		"factor": 5.04955486484628
	}, {
		"tu1": 44,
		"tu2": 36,
		"tu3": 1,
		"tu4": 9,
		"factor": 5.049955442435773
	}, {
		"tu1": 44,
		"tu2": 31,
		"tu3": 6,
		"tu4": 8,
		"factor": 5.0499085313824015
	}, {
		"tu1": 44,
		"tu2": 26,
		"tu3": 11,
		"tu4": 7,
		"factor": 5.04986162076481
	}, {
		"tu1": 44,
		"tu2": 21,
		"tu3": 16,
		"tu4": 6,
		"factor": 5.049814710582987
	}, {
		"tu1": 44,
		"tu2": 16,
		"tu3": 21,
		"tu4": 5,
		"factor": 5.049767800836931
	}, {
		"tu1": 44,
		"tu2": 11,
		"tu3": 26,
		"tu4": 4,
		"factor": 5.049720891526639
	}, {
		"tu1": 44,
		"tu2": 6,
		"tu3": 31,
		"tu4": 3,
		"factor": 5.049673982652109
	}, {
		"tu1": 44,
		"tu2": 1,
		"tu3": 36,
		"tu4": 2,
		"factor": 5.049627074213331
	}, {
		"tu1": 42,
		"tu2": 4,
		"tu3": 0,
		"tu4": 23,
		"factor": 5.04954520549885
	}, {
		"tu1": 41,
		"tu2": 39,
		"tu3": 0,
		"tu4": 9,
		"factor": 5.049945782322073
	}, {
		"tu1": 41,
		"tu2": 34,
		"tu3": 5,
		"tu4": 8,
		"factor": 5.049898871358441
	}, {
		"tu1": 41,
		"tu2": 29,
		"tu3": 10,
		"tu4": 7,
		"factor": 5.049851960830583
	}, {
		"tu1": 41,
		"tu2": 24,
		"tu3": 15,
		"tu4": 6,
		"factor": 5.049805050738495
	}, {
		"tu1": 41,
		"tu2": 19,
		"tu3": 20,
		"tu4": 5,
		"factor": 5.049758141082175
	}, {
		"tu1": 41,
		"tu2": 14,
		"tu3": 25,
		"tu4": 4,
		"factor": 5.0497112318616155
	}, {
		"tu1": 41,
		"tu2": 9,
		"tu3": 30,
		"tu4": 3,
		"factor": 5.049664323076817
	}, {
		"tu1": 41,
		"tu2": 4,
		"tu3": 35,
		"tu4": 2,
		"factor": 5.049617414727771
	}, {
		"tu1": 41,
		"tu2": 1,
		"tu3": 4,
		"tu4": 22,
		"factor": 5.049983686922897
	}, {
		"tu1": 38,
		"tu2": 37,
		"tu3": 4,
		"tu4": 8,
		"factor": 5.049889211352958
	}, {
		"tu1": 38,
		"tu2": 32,
		"tu3": 9,
		"tu4": 7,
		"factor": 5.049842300914835
	}, {
		"tu1": 38,
		"tu2": 27,
		"tu3": 14,
		"tu4": 6,
		"factor": 5.0497953909124815
	}, {
		"tu1": 38,
		"tu2": 22,
		"tu3": 19,
		"tu4": 5,
		"factor": 5.049748481345896
	}, {
		"tu1": 38,
		"tu2": 17,
		"tu3": 24,
		"tu4": 4,
		"factor": 5.04970157221507
	}, {
		"tu1": 38,
		"tu2": 12,
		"tu3": 29,
		"tu4": 3,
		"factor": 5.049654663520003
	}, {
		"tu1": 38,
		"tu2": 7,
		"tu3": 34,
		"tu4": 2,
		"factor": 5.049607755260688
	}, {
		"tu1": 38,
		"tu2": 4,
		"tu3": 3,
		"tu4": 22,
		"factor": 5.049974026755169
	}, {
		"tu1": 38,
		"tu2": 2,
		"tu3": 39,
		"tu4": 1,
		"factor": 5.0495608474371245
	}, {
		"tu1": 35,
		"tu2": 40,
		"tu3": 3,
		"tu4": 8,
		"factor": 5.049879551365952
	}, {
		"tu1": 35,
		"tu2": 35,
		"tu3": 8,
		"tu4": 7,
		"factor": 5.049832641017565
	}, {
		"tu1": 35,
		"tu2": 30,
		"tu3": 13,
		"tu4": 6,
		"factor": 5.049785731104946
	}, {
		"tu1": 35,
		"tu2": 25,
		"tu3": 18,
		"tu4": 5,
		"factor": 5.049738821628093
	}, {
		"tu1": 35,
		"tu2": 20,
		"tu3": 23,
		"tu4": 4,
		"factor": 5.049691912587002
	}, {
		"tu1": 35,
		"tu2": 15,
		"tu3": 28,
		"tu4": 3,
		"factor": 5.049645003981666
	}, {
		"tu1": 35,
		"tu2": 10,
		"tu3": 33,
		"tu4": 2,
		"factor": 5.049598095812083
	}, {
		"tu1": 35,
		"tu2": 7,
		"tu3": 2,
		"tu4": 22,
		"factor": 5.049964366605918
	}, {
		"tu1": 35,
		"tu2": 5,
		"tu3": 38,
		"tu4": 1,
		"factor": 5.04955118807825
	}, {
		"tu1": 35,
		"tu2": 2,
		"tu3": 7,
		"tu4": 21,
		"factor": 5.04991745546965
	}, {
		"tu1": 35,
		"tu2": 0,
		"tu3": 43,
		"tu4": 0,
		"factor": 5.049504280780161
	}, {
		"tu1": 34,
		"tu2": 2,
		"tu3": 42,
		"tu4": 0,
		"factor": 5.049989670021802
	}, {
		"tu1": 32,
		"tu2": 43,
		"tu3": 2,
		"tu4": 8,
		"factor": 5.049869891397425
	}, {
		"tu1": 32,
		"tu2": 38,
		"tu3": 7,
		"tu4": 7,
		"factor": 5.049822981138776
	}, {
		"tu1": 32,
		"tu2": 33,
		"tu3": 12,
		"tu4": 6,
		"factor": 5.0497760713158915
	}, {
		"tu1": 32,
		"tu2": 28,
		"tu3": 17,
		"tu4": 5,
		"factor": 5.049729161928772
	}, {
		"tu1": 32,
		"tu2": 23,
		"tu3": 22,
		"tu4": 4,
		"factor": 5.049682252977412
	}, {
		"tu1": 32,
		"tu2": 18,
		"tu3": 27,
		"tu4": 3,
		"factor": 5.049635344461809
	}, {
		"tu1": 32,
		"tu2": 13,
		"tu3": 32,
		"tu4": 2,
		"factor": 5.049588436381957
	}, {
		"tu1": 32,
		"tu2": 10,
		"tu3": 1,
		"tu4": 22,
		"factor": 5.049954706475151
	}, {
		"tu1": 32,
		"tu2": 8,
		"tu3": 37,
		"tu4": 1,
		"factor": 5.049541528737853
	}, {
		"tu1": 32,
		"tu2": 5,
		"tu3": 6,
		"tu4": 21,
		"factor": 5.049907795428617
	}, {
		"tu1": 32,
		"tu2": 0,
		"tu3": 11,
		"tu4": 20,
		"factor": 5.0498608848178606
	}, {
		"tu1": 31,
		"tu2": 5,
		"tu3": 41,
		"tu4": 0,
		"factor": 5.049980009842626
	}, {
		"tu1": 29,
		"tu2": 46,
		"tu3": 1,
		"tu4": 8,
		"factor": 5.049860231447379
	}, {
		"tu1": 29,
		"tu2": 41,
		"tu3": 6,
		"tu4": 7,
		"factor": 5.049813321278463
	}, {
		"tu1": 29,
		"tu2": 36,
		"tu3": 11,
		"tu4": 6,
		"factor": 5.0497664115453125
	}, {
		"tu1": 29,
		"tu2": 31,
		"tu3": 16,
		"tu4": 5,
		"factor": 5.049719502247926
	}, {
		"tu1": 29,
		"tu2": 26,
		"tu3": 21,
		"tu4": 4,
		"factor": 5.049672593386299
	}, {
		"tu1": 29,
		"tu2": 21,
		"tu3": 26,
		"tu4": 3,
		"factor": 5.049625684960429
	}, {
		"tu1": 29,
		"tu2": 16,
		"tu3": 31,
		"tu4": 2,
		"factor": 5.049578776970308
	}, {
		"tu1": 29,
		"tu2": 13,
		"tu3": 0,
		"tu4": 22,
		"factor": 5.049945046362859
	}, {
		"tu1": 29,
		"tu2": 11,
		"tu3": 36,
		"tu4": 1,
		"factor": 5.049531869415934
	}, {
		"tu1": 29,
		"tu2": 8,
		"tu3": 5,
		"tu4": 21,
		"factor": 5.049898135406062
	}, {
		"tu1": 29,
		"tu2": 3,
		"tu3": 10,
		"tu4": 20,
		"factor": 5.049851224885041
	}, {
		"tu1": 28,
		"tu2": 8,
		"tu3": 40,
		"tu4": 0,
		"factor": 5.0499703496819315
	}, {
		"tu1": 26,
		"tu2": 49,
		"tu3": 0,
		"tu4": 8,
		"factor": 5.049850571515811
	}, {
		"tu1": 26,
		"tu2": 44,
		"tu3": 5,
		"tu4": 7,
		"factor": 5.04980366143663
	}, {
		"tu1": 26,
		"tu2": 39,
		"tu3": 10,
		"tu4": 6,
		"factor": 5.049756751793213
	}, {
		"tu1": 26,
		"tu2": 34,
		"tu3": 15,
		"tu4": 5,
		"factor": 5.049709842585562
	}, {
		"tu1": 26,
		"tu2": 29,
		"tu3": 20,
		"tu4": 4,
		"factor": 5.049662933813666
	}, {
		"tu1": 26,
		"tu2": 24,
		"tu3": 25,
		"tu4": 3,
		"factor": 5.049616025477527
	}, {
		"tu1": 26,
		"tu2": 19,
		"tu3": 30,
		"tu4": 2,
		"factor": 5.049569117577137
	}, {
		"tu1": 26,
		"tu2": 14,
		"tu3": 35,
		"tu4": 1,
		"factor": 5.049522210112495
	}, {
		"tu1": 26,
		"tu2": 11,
		"tu3": 4,
		"tu4": 21,
		"factor": 5.049888475401987
	}, {
		"tu1": 26,
		"tu2": 6,
		"tu3": 9,
		"tu4": 20,
		"factor": 5.049841564970703
	}, {
		"tu1": 26,
		"tu2": 1,
		"tu3": 14,
		"tu4": 19,
		"factor": 5.049794654975186
	}, {
		"tu1": 25,
		"tu2": 11,
		"tu3": 39,
		"tu4": 0,
		"factor": 5.049960689539718
	}, {
		"tu1": 23,
		"tu2": 47,
		"tu3": 4,
		"tu4": 7,
		"factor": 5.049794001613272
	}, {
		"tu1": 23,
		"tu2": 42,
		"tu3": 9,
		"tu4": 6,
		"factor": 5.049747092059591
	}, {
		"tu1": 23,
		"tu2": 37,
		"tu3": 14,
		"tu4": 5,
		"factor": 5.049700182941672
	}, {
		"tu1": 23,
		"tu2": 32,
		"tu3": 19,
		"tu4": 4,
		"factor": 5.0496532742595095
	}, {
		"tu1": 23,
		"tu2": 27,
		"tu3": 24,
		"tu4": 3,
		"factor": 5.0496063660131005
	}, {
		"tu1": 23,
		"tu2": 22,
		"tu3": 29,
		"tu4": 2,
		"factor": 5.049559458202443
	}, {
		"tu1": 23,
		"tu2": 17,
		"tu3": 34,
		"tu4": 1,
		"factor": 5.049512550827528
	}, {
		"tu1": 23,
		"tu2": 14,
		"tu3": 3,
		"tu4": 21,
		"factor": 5.04987881541639
	}, {
		"tu1": 23,
		"tu2": 9,
		"tu3": 8,
		"tu4": 20,
		"factor": 5.049831905074838
	}, {
		"tu1": 23,
		"tu2": 4,
		"tu3": 13,
		"tu4": 19,
		"factor": 5.049784995169057
	}, {
		"tu1": 22,
		"tu2": 19,
		"tu3": 33,
		"tu4": 1,
		"factor": 5.049997940864136
	}, {
		"tu1": 22,
		"tu2": 14,
		"tu3": 38,
		"tu4": 0,
		"factor": 5.049951029415983
	}, {
		"tu1": 20,
		"tu2": 50,
		"tu3": 3,
		"tu4": 7,
		"factor": 5.0497843418083965
	}, {
		"tu1": 20,
		"tu2": 45,
		"tu3": 8,
		"tu4": 6,
		"factor": 5.049737432344448
	}, {
		"tu1": 20,
		"tu2": 40,
		"tu3": 13,
		"tu4": 5,
		"factor": 5.0496905233162614
	}, {
		"tu1": 20,
		"tu2": 35,
		"tu3": 18,
		"tu4": 4,
		"factor": 5.0496436147238315
	}, {
		"tu1": 20,
		"tu2": 30,
		"tu3": 23,
		"tu4": 3,
		"factor": 5.049596706567155
	}, {
		"tu1": 20,
		"tu2": 25,
		"tu3": 28,
		"tu4": 2,
		"factor": 5.0495497988462255
	}, {
		"tu1": 20,
		"tu2": 20,
		"tu3": 33,
		"tu4": 1,
		"factor": 5.049502891561041
	}, {
		"tu1": 20,
		"tu2": 17,
		"tu3": 2,
		"tu4": 21,
		"factor": 5.049869155449271
	}, {
		"tu1": 20,
		"tu2": 12,
		"tu3": 7,
		"tu4": 20,
		"factor": 5.049822245197458
	}, {
		"tu1": 20,
		"tu2": 7,
		"tu3": 12,
		"tu4": 19,
		"factor": 5.049775335381408
	}, {
		"tu1": 20,
		"tu2": 2,
		"tu3": 17,
		"tu4": 18,
		"factor": 5.049728426001126
	}, {
		"tu1": 19,
		"tu2": 22,
		"tu3": 32,
		"tu4": 1,
		"factor": 5.04998828066914
	}, {
		"tu1": 19,
		"tu2": 17,
		"tu3": 37,
		"tu4": 0,
		"factor": 5.049941369310724
	}, {
		"tu1": 17,
		"tu2": 53,
		"tu3": 2,
		"tu4": 7,
		"factor": 5.049774682021998
	}, {
		"tu1": 17,
		"tu2": 48,
		"tu3": 7,
		"tu4": 6,
		"factor": 5.049727772647783
	}, {
		"tu1": 17,
		"tu2": 43,
		"tu3": 12,
		"tu4": 5,
		"factor": 5.049680863709329
	}, {
		"tu1": 17,
		"tu2": 38,
		"tu3": 17,
		"tu4": 4,
		"factor": 5.049633955206633
	}, {
		"tu1": 17,
		"tu2": 33,
		"tu3": 22,
		"tu4": 3,
		"factor": 5.049587047139687
	}, {
		"tu1": 17,
		"tu2": 28,
		"tu3": 27,
		"tu4": 2,
		"factor": 5.049540139508489
	}, {
		"tu1": 17,
		"tu2": 20,
		"tu3": 1,
		"tu4": 21,
		"factor": 5.049859495500633
	}, {
		"tu1": 17,
		"tu2": 15,
		"tu3": 6,
		"tu4": 20,
		"factor": 5.049812585338551
	}, {
		"tu1": 17,
		"tu2": 10,
		"tu3": 11,
		"tu4": 19,
		"factor": 5.04976567561224
	}, {
		"tu1": 17,
		"tu2": 5,
		"tu3": 16,
		"tu4": 18,
		"factor": 5.04971876632169
	}, {
		"tu1": 17,
		"tu2": 0,
		"tu3": 21,
		"tu4": 17,
		"factor": 5.049671857466898
	}, {
		"tu1": 16,
		"tu2": 25,
		"tu3": 31,
		"tu4": 1,
		"factor": 5.0499786204926265
	}, {
		"tu1": 16,
		"tu2": 20,
		"tu3": 36,
		"tu4": 0,
		"factor": 5.049931709223946
	}, {
		"tu1": 14,
		"tu2": 56,
		"tu3": 1,
		"tu4": 7,
		"factor": 5.049765022254077
	}, {
		"tu1": 14,
		"tu2": 51,
		"tu3": 6,
		"tu4": 6,
		"factor": 5.049718112969596
	}, {
		"tu1": 14,
		"tu2": 46,
		"tu3": 11,
		"tu4": 5,
		"factor": 5.049671204120877
	}, {
		"tu1": 14,
		"tu2": 41,
		"tu3": 16,
		"tu4": 4,
		"factor": 5.0496242957079085
	}, {
		"tu1": 14,
		"tu2": 36,
		"tu3": 21,
		"tu4": 3,
		"factor": 5.049577387730693
	}, {
		"tu1": 14,
		"tu2": 31,
		"tu3": 26,
		"tu4": 2,
		"factor": 5.049530480189225
	}, {
		"tu1": 14,
		"tu2": 23,
		"tu3": 0,
		"tu4": 21,
		"factor": 5.04984983557047
	}, {
		"tu1": 14,
		"tu2": 18,
		"tu3": 5,
		"tu4": 20,
		"factor": 5.049802925498126
	}, {
		"tu1": 14,
		"tu2": 13,
		"tu3": 10,
		"tu4": 19,
		"factor": 5.049756015861548
	}, {
		"tu1": 14,
		"tu2": 8,
		"tu3": 15,
		"tu4": 18,
		"factor": 5.049709106660732
	}, {
		"tu1": 14,
		"tu2": 3,
		"tu3": 20,
		"tu4": 17,
		"factor": 5.049662197895673
	}, {
		"tu1": 13,
		"tu2": 28,
		"tu3": 30,
		"tu4": 1,
		"factor": 5.049968960334589
	}, {
		"tu1": 13,
		"tu2": 23,
		"tu3": 35,
		"tu4": 0,
		"factor": 5.049922049155645
	}, {
		"tu1": 11,
		"tu2": 59,
		"tu3": 0,
		"tu4": 7,
		"factor": 5.049755362504633
	}, {
		"tu1": 11,
		"tu2": 54,
		"tu3": 5,
		"tu4": 6,
		"factor": 5.049708453309886
	}, {
		"tu1": 11,
		"tu2": 49,
		"tu3": 10,
		"tu4": 5,
		"factor": 5.049661544550898
	}, {
		"tu1": 11,
		"tu2": 44,
		"tu3": 15,
		"tu4": 4,
		"factor": 5.049614636227664
	}, {
		"tu1": 11,
		"tu2": 39,
		"tu3": 20,
		"tu4": 3,
		"factor": 5.049567728340177
	}, {
		"tu1": 11,
		"tu2": 34,
		"tu3": 25,
		"tu4": 2,
		"factor": 5.04952082088844
	}, {
		"tu1": 11,
		"tu2": 21,
		"tu3": 4,
		"tu4": 20,
		"factor": 5.049793265676176
	}, {
		"tu1": 11,
		"tu2": 16,
		"tu3": 9,
		"tu4": 19,
		"factor": 5.049746356129333
	}, {
		"tu1": 11,
		"tu2": 11,
		"tu3": 14,
		"tu4": 18,
		"factor": 5.049699447018249
	}, {
		"tu1": 11,
		"tu2": 6,
		"tu3": 19,
		"tu4": 17,
		"factor": 5.049652538342924
	}, {
		"tu1": 11,
		"tu2": 1,
		"tu3": 24,
		"tu4": 16,
		"factor": 5.0496056301033505
	}, {
		"tu1": 10,
		"tu2": 31,
		"tu3": 29,
		"tu4": 1,
		"factor": 5.049959300195031
	}, {
		"tu1": 10,
		"tu2": 26,
		"tu3": 34,
		"tu4": 0,
		"factor": 5.049912389105826
	}, {
		"tu1": 8,
		"tu2": 57,
		"tu3": 4,
		"tu4": 6,
		"factor": 5.0496987936686555
	}, {
		"tu1": 8,
		"tu2": 52,
		"tu3": 9,
		"tu4": 5,
		"factor": 5.049651884999401
	}, {
		"tu1": 8,
		"tu2": 47,
		"tu3": 14,
		"tu4": 4,
		"factor": 5.049604976765895
	}, {
		"tu1": 8,
		"tu2": 42,
		"tu3": 19,
		"tu4": 3,
		"factor": 5.0495580689681425
	}, {
		"tu1": 8,
		"tu2": 37,
		"tu3": 24,
		"tu4": 2,
		"factor": 5.049511161606134
	}, {
		"tu1": 8,
		"tu2": 24,
		"tu3": 3,
		"tu4": 20,
		"factor": 5.049783605872708
	}, {
		"tu1": 8,
		"tu2": 19,
		"tu3": 8,
		"tu4": 19,
		"factor": 5.049736696415597
	}, {
		"tu1": 8,
		"tu2": 14,
		"tu3": 13,
		"tu4": 18,
		"factor": 5.0496897873942475
	}, {
		"tu1": 8,
		"tu2": 9,
		"tu3": 18,
		"tu4": 17,
		"factor": 5.049642878808654
	}, {
		"tu1": 8,
		"tu2": 4,
		"tu3": 23,
		"tu4": 16,
		"factor": 5.049595970658812
	}, {
		"tu1": 7,
		"tu2": 39,
		"tu3": 23,
		"tu4": 2,
		"factor": 5.0499965515092
	}, {
		"tu1": 7,
		"tu2": 34,
		"tu3": 28,
		"tu4": 1,
		"factor": 5.049949640073952
	}, {
		"tu1": 7,
		"tu2": 29,
		"tu3": 33,
		"tu4": 0,
		"factor": 5.049902729074482
	}, {
		"tu1": 5,
		"tu2": 60,
		"tu3": 3,
		"tu4": 6,
		"factor": 5.049689134045903
	}, {
		"tu1": 5,
		"tu2": 55,
		"tu3": 8,
		"tu4": 5,
		"factor": 5.0496422254663775
	}, {
		"tu1": 5,
		"tu2": 50,
		"tu3": 13,
		"tu4": 4,
		"factor": 5.049595317322606
	}, {
		"tu1": 5,
		"tu2": 45,
		"tu3": 18,
		"tu4": 3,
		"factor": 5.049548409614583
	}, {
		"tu1": 5,
		"tu2": 40,
		"tu3": 23,
		"tu4": 2,
		"factor": 5.049501502342305
	}, {
		"tu1": 5,
		"tu2": 27,
		"tu3": 2,
		"tu4": 20,
		"factor": 5.049773946087716
	}, {
		"tu1": 5,
		"tu2": 22,
		"tu3": 7,
		"tu4": 19,
		"factor": 5.049727036720341
	}, {
		"tu1": 5,
		"tu2": 17,
		"tu3": 12,
		"tu4": 18,
		"factor": 5.049680127788722
	}, {
		"tu1": 5,
		"tu2": 12,
		"tu3": 17,
		"tu4": 17,
		"factor": 5.04963321929286
	}, {
		"tu1": 5,
		"tu2": 7,
		"tu3": 22,
		"tu4": 16,
		"factor": 5.0495863112327495
	}, {
		"tu1": 5,
		"tu2": 2,
		"tu3": 27,
		"tu4": 15,
		"factor": 5.049539403608389
	}, {
		"tu1": 4,
		"tu2": 42,
		"tu3": 22,
		"tu4": 2,
		"factor": 5.0499868913168635
	}, {
		"tu1": 4,
		"tu2": 37,
		"tu3": 27,
		"tu4": 1,
		"factor": 5.049939979971354
	}, {
		"tu1": 4,
		"tu2": 32,
		"tu3": 32,
		"tu4": 0,
		"factor": 5.049893069061621
	}, {
		"tu1": 2,
		"tu2": 63,
		"tu3": 2,
		"tu4": 6,
		"factor": 5.049679474441627
	}, {
		"tu1": 2,
		"tu2": 58,
		"tu3": 7,
		"tu4": 5,
		"factor": 5.049632565951837
	}, {
		"tu1": 2,
		"tu2": 53,
		"tu3": 12,
		"tu4": 4,
		"factor": 5.0495856578977945
	}, {
		"tu1": 2,
		"tu2": 48,
		"tu3": 17,
		"tu4": 3,
		"factor": 5.049538750279503
	}, {
		"tu1": 2,
		"tu2": 30,
		"tu3": 1,
		"tu4": 20,
		"factor": 5.049764286321205
	}, {
		"tu1": 2,
		"tu2": 25,
		"tu3": 6,
		"tu4": 19,
		"factor": 5.049717377043561
	}, {
		"tu1": 2,
		"tu2": 20,
		"tu3": 11,
		"tu4": 18,
		"factor": 5.049670468201676
	}, {
		"tu1": 2,
		"tu2": 15,
		"tu3": 16,
		"tu4": 17,
		"factor": 5.049623559795545
	}, {
		"tu1": 2,
		"tu2": 10,
		"tu3": 21,
		"tu4": 16,
		"factor": 5.0495766518251655
	}, {
		"tu1": 2,
		"tu2": 5,
		"tu3": 26,
		"tu4": 15,
		"factor": 5.049529744290536
	}, {
		"tu1": 1,
		"tu2": 45,
		"tu3": 21,
		"tu4": 2,
		"factor": 5.049977231143005
	}, {
		"tu1": 1,
		"tu2": 40,
		"tu3": 26,
		"tu4": 1,
		"factor": 5.049930319887234
	}, {
		"tu1": 1,
		"tu2": 35,
		"tu3": 31,
		"tu4": 0,
		"factor": 5.049883409067237
	}, {
		"tu1": 1,
		"tu2": 2,
		"tu3": 30,
		"tu4": 14,
		"factor": 5.0499682243719946
	}]
};

(function () {
	$("#loading-text").text("fetching data");
	if (typeof (localStorage.rGame) != "undefined" && getCookie("loggedIn") != 1) {
		rHelper.data = JSON.parse(localStorage.getItem("rGame"));
		loadingAnimToggler("hide");
		console.log("Found existing data!");
		rHelper.init.core();
	} else {
		$.get({
			url: "api/core.php",
			success: function (response) {
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
			error: function (response) {
				swal("Error fetching data", "Error message:<br />" + response + "<br /> Please try again.", "error");
			}
		});
	}
})();
