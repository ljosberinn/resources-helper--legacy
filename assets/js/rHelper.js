"use strict";

var rHelper = {
	"init": {
		user() {
			rHelper.fn.INSRT_userSettings();
			rHelper.init.core();
		},
		core() {
			rHelper.fn.SET_tabSwitcherAnchorBased();

			rHelper.fn.SET_transportCost();

			$.each(rHelper.data.material, function (materialId) {

				rHelper.fn.EVNT_materialInput(materialId);

				rHelper.fn.INSRT_materialRate(materialId);
				rHelper.fn.INSRT_materialAmountOfMines(materialId);
				rHelper.fn.INSRT_materialNewMinePrice(materialId);
				rHelper.fn.INSRT_materialRateWorth(materialId);
				rHelper.fn.INSRT_materialNewMinePerfectIncome(materialId);

				rHelper.fn.INSRT_flowRate(materialId, "material");

			});

			rHelper.fn.INSRT_totalMineWorth(rHelper.fn.CALC_totalMineWorth());
			rHelper.fn.INSRT_totalMineCount(rHelper.fn.CALC_totalMineCount());
			rHelper.fn.INSRT_materialMineAmortisation();
			rHelper.fn.INSRT_materialHighlightMinePerfectIncome();

			var calculationOrder = rHelper.fn.GET_calculationOrder();

			$.each(calculationOrder, function (index, factoryId) {

				rHelper.fn.EVNT_factoryInput(factoryId);

				rHelper.fn.INSRT_factoryName(factoryId);
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
			});

			rHelper.fn.INSRT_totalFactoryUpgrades();
			rHelper.fn.INSRT_factoryHighlightColumns();

			rHelper.fn.INSRT_diamondTop10Profit();
			rHelper.fn.INSRT_diamondTotalProfit();

			rHelper.fn.INSRT_flowDistributionGlobal();

			rHelper.init.enableTippy();
		},
		enableTippy() {
			$.each($("[title]"), function (i, el) {
				if (!el._tippy) {
					tippy(el, {
						dynamicTitle: true
					});
				}
			});
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
			rHelper.data[selector][index][key] = value;
			console.log(selector, index, key, value);
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
		SET_transportCost() {
			rHelper.data.buildings[9].transportCost = 1 + (15 - rHelper.data.buildings[9].level) / 100;
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
			});
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

			$("#security-token").text(rHelper.data.userInformation.securityToken);

			if (rHelper.data.userInformation.realKey != "" && typeof (rHelper.data.userInformation.realKey) != "undefined") {
				$("#api-key").val(rHelper.data.userInformation.realKey);
				rHelper.fn.INSRT_API_remainingCredits(rHelper.data.userInformation.remainingCredits);
			}

			rHelper.data.settings.forEach(function (setting) {
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
				case "factoryNames":
					if (setting.value === 1) {
						$("#settings-toggle-factory-names").prop("checked", true);
					}
					break;
				case "transportCostInclusion":
					if (setting.value === 1) {
						$("#settings-toggle-transport-cost-inclusion").prop("checked", true);
					}
					break;
				case "theBigShort":
					$("#settings-thebigshort").val(setting.value);
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
		INSRT_factoryName(factoryId) {
			$("#factories-name-" + factoryId).text(rHelper.data.products[factoryId].factoryName);
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

					var outerSpan = crEl("span");
					var imgSpan = crEl("span");
					var innerSpan = crEl("span");

					$(imgSpan).addClass(dependantObj.icon).attr("title", price.toLocaleString("en-US"));
					$(innerSpan).addClass(addClass).text(requiredAmount.toLocaleString("en-US"));
					$(outerSpan).append(imgSpan.outerHTML + " " + innerSpan.outerHTML + " ");

					dependencyString += outerSpan.outerHTML;

				});
			} else {
				var dependantObj = rHelper.fn.CALC_convertId(dependencies);
				var price = rHelper.fn.CALC_returnPriceViaId(dependencies).toLocaleString("en-US");

				var requiredAmount = rHelper.fn.CALC_factoryDependencyRequiredAmount(factoryId, 0);
				var existingAmount = rHelper.fn.CALC_factoryDependencyExistingAmount(dependantObj, 0);

				var addClass = rHelper.fn.CALC_factoryComparatorRequiredVsExistingAmount(requiredAmount, existingAmount);

				var outerSpan = crEl("span");
				var imgSpan = crEl("span");
				var innerSpan = crEl("span");

				$(imgSpan).addClass(dependantObj.icon).attr("title", price.toLocaleString("en-US"));
				$(innerSpan).addClass(addClass).text(requiredAmount.toLocaleString("en-US"));
				$(outerSpan).append(imgSpan.outerHTML + " " + innerSpan.outerHTML + " ");

				dependencyString += outerSpan.outerHTML;
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
          if(arrayMin != arrayMax) {
            $(column + arrayMax).addClass("text-danger");
          }
					break;
				case 1:
				case 3:
					$(column + arrayMax).addClass("text-success");
          if(arrayMin != arrayMax) {
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
		INSRT_diamondDependencies(factoryId) {
			var product = rHelper.data.products[factoryId];
			var dependencies = product.dependencies;
			var dependencyString = "";
			var warehouseIconSpan = crEl("span");
			$(warehouseIconSpan).addClass("nav-icon-warehouses");

			if ($.isArray(dependencies)) {
				$.each(dependencies, function (dependencyIndex, dependency) {

					var dependantObj = rHelper.fn.CALC_convertId(dependency);
					var price = rHelper.fn.CALC_returnPriceViaId(dependency);

					var requiredAmount = rHelper.fn.CALC_factoryDependencyRequiredAmount(factoryId, dependencyIndex) * 5 * 24;
					var requiredWarehouseLevel = rHelper.fn.CALC_nextGreaterWarehouseLevel(requiredAmount);

					rHelper.data.products[factoryId].diamond.dependenciesWorth += price * requiredAmount;

					var outerSpan = crEl("span");
					var imgSpan = crEl("span");
					var innerSpan = crEl("span");
					var kbd = crEl("kbd");
					var warehouseSamp = crEl("span");

					$(imgSpan).addClass(dependantObj.icon).attr("title", price.toLocaleString("en-US"));
					$(innerSpan).text(requiredAmount.toLocaleString("en-US"));
					$(warehouseSamp).text(requiredWarehouseLevel);
					$(kbd).append(warehouseIconSpan.outerHTML + " " + warehouseSamp.outerHTML);
					$(outerSpan).append(imgSpan.outerHTML + " " + innerSpan.outerHTML + " " + kbd.outerHTML + " ");

					dependencyString += outerSpan.outerHTML;

				});
			} else {
				var dependantObj = rHelper.fn.CALC_convertId(dependencies);
				var price = rHelper.fn.CALC_returnPriceViaId(dependencies);

				var requiredAmount = rHelper.fn.CALC_factoryDependencyRequiredAmount(factoryId, 0) * 5 * 24;
				var requiredWarehouseLevel = rHelper.fn.CALC_nextGreaterWarehouseLevel(requiredAmount);

				rHelper.data.products[factoryId].diamond.dependenciesWorth += price * requiredAmount;

				var outerSpan = crEl("span");
				var imgSpan = crEl("span");
				var innerSpan = crEl("span");
				var kbd = crEl("kbd");
				var warehouseSamp = crEl("span");

				$(imgSpan).addClass(dependantObj.icon).attr("title", price.toLocaleString("en-US"));
				$(innerSpan).text(requiredAmount.toLocaleString("en-US"));
				$(warehouseSamp).text(requiredWarehouseLevel);
				$(kbd).append(warehouseIconSpan.outerHTML + " " + warehouseSamp.outerHTML);
				$(outerSpan).append(imgSpan.outerHTML + " " + innerSpan.outerHTML + " " + kbd.outerHTML + " ");

				dependencyString += outerSpan.outerHTML;
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
			if (remainingAmount < 0) {
				surplusTarget.css("color", "coral");
			}
			surplusTarget.html('<span class="resources-' + type + '-' + (id + 1) + '"></span> ' + remainingAmount.toLocaleString("en-US"));
		},
		INSRT_flowDistributionSingle(id, type) {
			var distributionTarget = $("#flow-" + type + "-distribution-" + id);

			var worthTarget = $("#flow-" + type + "-worth-" + id);
			var price = 0;
			var worth = 0;
			var remainingAmount = rHelper.fn.CALC_flowDistribution(id, type);
			var color = "yellowgreen";

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
					remainingAmount = 0;
				}
			}

			worth = remainingAmount * price;

			if (remainingAmount < 0) {
				worth *= rHelper.data.buildings[9].transportCost;
				color = "coral";
			}

			worth = Math.round(worth);

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
		CALC_flowDistribution(id, type) {

			function insertDistributionReturnRequiredAmount(type, dependantFactory, id, i) {
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

				string += '<span class="resources-' + type + '-' + (id + 1) + '"></span> ';
				string += requiredAmount.toLocaleString("en-US") + " " + arrow + " ";
				string += '<span class="resources-product-' + (dependantIconIndex + 1) + '"></span> ';

				$("#flow-" + type + "-distribution-" + id + "-" + i).html(string);

				return requiredAmount;
			}

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

					requiredAmount += insertDistributionReturnRequiredAmount(type, dependantFactory, id, i);

				});
			} else if (dependantFactories != "") {

				requiredAmount += insertDistributionReturnRequiredAmount(type, dependantFactories, id, 0);

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
			var table = crEl("table");
			var tbody = crEl("tbody");
			var td;
			var small;

			$.each(rHelper.data.products[factoryId].upgradeMaterialAmount, function (i, amount) {
				var tr = crEl("tr");
				var k = 0;

				if (i === 0) {
					sum += amount * Math.pow(nextLevel, 2);

					for (k = 0; k <= 2; k += 1) {
						td = crEl("td");

						switch (k) {
						case 0:
							var img = crEl("img");
							$(img).attr("src", "assets/img/cash.png").attr("alt", "Cash");
							$(td).append(img);
							break;
						case 1:
							$(td).addClass("text-right").attr("colspan", 3).text(sum.toLocaleString("en-US"));
							break;
						case 2:
							small = crEl("small");
							$(small).text("Transportation");
							$(td).addClass("text-right").append(small);
							break;
						}

						tr.append(td);
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
						className = "products";
					} else if (upgradeMaterial >= 36 && upgradeMaterial <= 51) {
						upgradeMaterial -= 36;
						className = "loot";
					} else {
						upgradeMaterial -= 51;
						className = "units";
					}

					for (k = 0; k <= 4; k += 1) {
						td = crEl("td");
						switch (k) {
						case 0:
							$(td).addClass("resources-" + className + "-" + upgradeMaterial);
							break;
						case 1:
							$(td).addClass("text-right").text(upgradeMaterialAmount.toLocaleString("en-US"));
							break;
						case 2:
							$(td).text("≙");
							break;
						case 3:
							$(td).addClass("text-right").text(materialWorth.toLocaleString("en-US"));
							break;
						case 4:
							small = crEl("small");
							$(small).addClass("text-warning").text("+" + transportation.toLocaleString("en-US"));
							$(td).addClass("text-right").append(small);
							break;
						}
						$(tr).append(td);
					}
				}
				$(tbody).append(tr);
			});

			var tr = crEl("tr");
			for (var k = 0; k <= 1; k += 1) {
				td = crEl("td");
				$(td).addClass("text-right");

				if (k === 0) {
					$(td).attr("colspan", 4).text(sum.toLocaleString("en-US"));
				} else {
					small = crEl("small");
					$(small).addClass("text-warning").text("+" + sumTransportation.toLocaleString("en-US"));
					$(td).append(small);
				}
				$(tr).append(td);
			}
			$(tbody).append(tr);
			$(table).append(tbody);

			rHelper.data.products[factoryId].upgradeCost = sum;

			var result = {
				"sum": sum,
				"title": table.outerHTML
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
		CALC_returnPriceViaId(id) {

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

			var index = possiblePrices[rHelper.data.settings[7].value];
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
				id -= 51;
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
	"data": {}
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
