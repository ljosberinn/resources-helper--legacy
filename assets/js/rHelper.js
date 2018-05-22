'use strict';

var _typeof =
  typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
    ? function(obj) {
        return typeof obj;
      }
    : function(obj) {
        return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj;
      };

var rHelper = {
  init: {
    user: function user() {
      'use strict';

      rHelper.methods.INSRT_userSettings();
      rHelper.init.core();
    },
    core: function core() {
      'use strict';

      var ref = rHelper.methods;

      removeLoggedInButtons();

      ref.SET_tabSwitcherAnchorBased();
      ref.SET_transportCost('init');

      $.each(rHelper.data.material, function(materialId) {
        // eventListeners
        ref.EVNT_materialInput(materialId);
        // general material data insertion
        ref.INSRT_materialData(materialId);
        // warehouses
        ref.INSRT_warehouseData(materialId, 'material');
        // price history
        ref.INSRT_priceHistoryName('material', materialId);
      });

      ref.INSRT_totalMineWorth(ref.CALC_totalMineWorth());
      ref.INSRT_totalMineCount(ref.CALC_totalMineCount());

      var calculationOrder = ref.GET_calculationOrder();

      $.each(calculationOrder, function(index, factoryId) {
        // eventListeners
        ref.EVNT_factoryInput(factoryId);
        // general factory data insertion
        ref.INSRT_factoryDiamondData(factoryId, 'product');
        // warehouses
        ref.INSRT_warehouseData(factoryId, 'products');
        // price history
        ref.INSRT_priceHistoryName('products', factoryId);
      });

      // loot
      $.each(rHelper.data.loot, function(index) {
        // warehouses
        ref.INSRT_warehouseData(index, 'loot');
        // price history
        ref.INSRT_priceHistoryName('loot', index);
        // recycling table
        if (index === 4 || (index >= 10 && index <= 13)) {
          return;
        }
        ref.SET_recyclingProfitObj(index);
        ref.INSRT_recycling(index);
      });

      var unitsFns = ['SET_UnitProfitObj', 'INSRT_unitsCraftingPrice', 'INSRT_unitsMarketPrice', 'INSRT_unitsPricePerStrength'];

      $.each(rHelper.data.units, function(index) {
        // warehouses
        ref.INSRT_warehouseData(index, 'units');
        // units table
        $.each(unitsFns, function(i, fn) {
          ref[fn](index);
        });

        ref.INSRT_unitsRecyclingProfit('units', index);
        // price history
        ref.INSRT_priceHistoryName('units', index);
      });

      // buildings
      var buildingFns = ['INSRT_buildingName', 'SET_buildingBackgroundColor', 'INSRT_buildingData', 'INSRT_buildingToLevel10', 'EVNT_buildingChange'];
      $.each(rHelper.data.buildings, function(buildingId) {
        $.each(buildingFns, function(i, fn) {
          ref[fn](buildingId);
        });
      });

      var hqFns = ['INSRT_headquarterOvwString', 'INSRT_headquarterOvwRadius', 'INSRT_headquarterOvwCost', 'INSRT_headquarterOvwBoost', 'INSRT_headquarterOvwTransportation', 'EVNT_switchHeadquarter'];

      // headquarter
      $.each(rHelper.data.headquarter, function(headquarterLevel) {
        $.each(hqFns, function(i, fn) {
          ref[fn](headquarterLevel);
        });
      });

      // initiate graphs
      var pieGraphs = ['material'];

      $.each(pieGraphs, function(i, val) {
        ref.EVNT_buildGraph(val);
      });

      var gaugeGraphs = ['buildings', 'headquarter'];
      $.each(gaugeGraphs, function(i, val) {
        ref.INSRT_gaugeGraph(val);
      });

      var nonParamBoundMethods = [
        // mines
        'INSRT_materialMineAmortisation',
        'INSRT_materialHighlightMinePerfectIncome',
        // factories
        'INSRT_totalFactoryUpgrades',
        'INSRT_factoryHighlightColumns',
        'INSRT_diamondTop10Profit',
        'INSRT_diamondTotalProfit',
        'INSRT_flowDistributionGlobal',
        // warehouse
        'INSRT_warehouseTotalLevel',
        'INSRT_warehouseTotalWorth',
        // graphs
        'EVNT_priceHistoryOnChange',
        // headquarter
        'SET_hqLevel',
        'EVNT_headquarterInput',
        // missions
        'INSRT_missions',
        // general
        'EVNT_attackLogTrigger',
        'INSRT_companyWorth',
        'EVNT_assignTitleToIcons',
        'EVNT_enableTippy',
        'INSRT_showNames',
        'SET_stickyHeaders',
        'SET_language',
        'EVNT_sortableTables'
      ];

      $.each(nonParamBoundMethods, function(i, fn) {
        ref[fn]();
      });
    }
  },
  methods: {
    GET_calculationOrder: function GET_calculationOrder() {
      'use strict';

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
    API_toggleLoadSuccessorHelper: function API_toggleLoadSuccessorHelper(target) {
      'use strict';

      var fns = ['API_toggleLoader', 'API_toggleSuccessor', 'API_toggleSuccessorHelper'];

      $.each(fns, function(i, fn) {
        rHelper.methods[fn](target);
      });
    },
    API_toggleLoader: function API_toggleLoader(selector) {
      'use strict';

      var el = $('#api-' + selector + '-loading');

      if (el.css('display') === 'none') {
        el.fadeIn('fast').css('display', 'flex');
      } else {
        el.fadeOut('fast');
      }
    },
    API_toggleSuccessor: function API_toggleSuccessor(selector) {
      'use strict';

      var el = $('#api-' + selector + '-finished');

      if (el.css('display') === 'none') {
        el.fadeIn('fast');
      } else {
        el.fadeOut('fast');
      }
    },
    API_toggleSuccessorHelper: function API_toggleSuccessorHelper(selector) {
      'use strict';

      setTimeout(function() {
        rHelper.methods.API_toggleSuccessor(selector);
      }, 15000);
    },
    API_getFactories: function API_getFactories(key) {
      'use strict';

      var ref = rHelper.methods;

      ref.API_toggleLoader('factories');

      $.get('api/core.php?query=1&key=' + key, function(data) {
        $.each(data, function(i, value) {
          rHelper.data.products[i].factoryLevel = value;
        });

        var calculationOrder = ref.GET_calculationOrder();

        $.each(calculationOrder, function(index, factoryId) {
          ref.INSRT_factoryDiamondData(factoryId, 'product');
        });

        var helperFns = ['INSRT_totalFactoryUpgrades', 'INSRT_factoryHighlightColumns', 'INSRT_diamondTop10Profit', 'INSRT_diamondTotalProfit', 'INSRT_flowDistributionGlobal'];

        $.each(helperFns, function(i, fn) {
          ref[fn]();
        });

        ref.API_toggleLoadSuccessorHelper('factories');

        sorttable.innerSortFunction.apply($('#module-diamond th')[4], []);
        sorttable.innerSortFunction.apply($('#module-diamond th')[5], []);
        ref.SET_save();
      });
    },
    API_getWarehouse: function API_getWarehouse(key) {
      'use strict';

      var ref = rHelper.methods;

      ref.API_toggleLoader('warehouse');

      $.getJSON('api/core.php?query=2&key=' + key, function(data) {
        $.each(data, function(i, warehouseInfo) {
          var iterator = i;
          var targetObj = 'material';

          if (i >= 14 && i < 36) {
            iterator -= 14;
            targetObj = 'products';
          } else if (i >= 36 && i < 52) {
            iterator -= 36;
            targetObj = 'loot';
          } else if (i >= 52) {
            iterator -= 52;
            targetObj = 'units';
          }

          var contingent = Math.pow(warehouseInfo.level, 2) * 5000;
          var fillStatus = warehouseInfo.amount / contingent;
          if (isNaN(fillStatus)) {
            fillStatus = 0;
          }

          rHelper.data[targetObj][iterator].warehouse.level = warehouseInfo.level;
          rHelper.data[targetObj][iterator].warehouse.fillAmount = warehouseInfo.amount;
          rHelper.data[targetObj][iterator].warehouse.contingent = contingent;
          rHelper.data[targetObj][iterator].warehouse.fillStatus = fillStatus;

          ref.SET_save();
        });

        $.each(rHelper.data.material, function(materialId) {
          ref.INSRT_warehouseData(materialId, 'material');
        });

        var calculationOrder = ref.GET_calculationOrder();

        $.each(calculationOrder, function(index) {
          ref.INSRT_warehouseData(index, 'products');
        });

        $.each(rHelper.data.loot, function(index) {
          ref.INSRT_warehouseData(index, 'loot');
        });

        $.each(rHelper.data.units, function(index) {
          ref.INSRT_warehouseData(index, 'units');
        });

        ref.INSRT_warehouseTotalLevel();
        ref.INSRT_warehouseTotalWorth();
        ref.API_toggleLoadSuccessorHelper('warehouse');
      });
    },
    API_getMineSummary: function API_getMineSummary(key) {
      var ref = rHelper.methods;

      ref.API_toggleLoader('mines-summary');
      $.get('api/core.php?query=51&key=' + key, function(data) {
        $.each(data, function(i, obj) {
          rHelper.data.material[i].perHour = obj.perHour;
          rHelper.data.material[i].amountOfMines = obj.amountOfMines;
        });

        $.each(rHelper.data.material, function(materialId) {
          ref.INSRT_materialData(materialId, 'api');
        });

        var fns = ['INSRT_materialMineAmortisation', 'INSRT_materialHighlightMinePerfectIncome', 'INSRT_flowDistributionGlobal'];

        $.each(fns, function(i, fn) {
          ref[fn]();
        });

        ref.INSRT_totalMineWorth(ref.CALC_totalMineWorth());
        ref.INSRT_totalMineCount(ref.CALC_totalMineCount());
        ref.EVNT_buildGraph('material');
        ref.API_toggleLoadSuccessorHelper('mines-summary');

        rHelper.methods.SET_save();
      });
    },
    API_getMineMap: function API_getMineMap() {
      'use strict';

      $.getJSON('api/core.php?mineMap', function(data) {
        rHelper.data.mineMap = data;

        var ref = rHelper.methods;
        ref.API_toggleLoadSuccessorHelper('mines-detailed');
        ref.EVNT_mapCreation('personal');
        ref.SET_overTimeGraph();
      });
    },
    API_getMineMapInitiator: function API_getMineMapInitiator(key) {
      'use strict';

      rHelper.methods.API_toggleLoader('mines-detailed');
      $.getJSON('api/core.php?query=5&key=' + key, function(data) {
        if (data.callback === 'rHelper.methods.API_getMineMap()') {
          rHelper.methods.API_getMineMap();
        } else {
          swal('Error', "Couldn't fetch mine details - API potentially unavailable!", 'error');
        }
      });
    },
    API_getPlayerInfo: function API_getPlayerInfo(key, anonymity) {
      'use strict';

      rHelper.methods.API_toggleLoader('player');
      var url = 'api/core.php?query=7&key=' + key;
      if (anonymity) {
        url += '&anonymity=true';
      }
      $.getJSON(url, function(data) {
        rHelper.data.userInformation.level = data.lvl;
        rHelper.data.userInformation.points = data.points;
        rHelper.data.userInformation.rank = data.worldrank;
        if (data.name) {
          rHelper.data.userInformation.name = data.name;
        }

        rHelper.data.userInformation.registeredGame = rHelper.methods.CALC_convertDateToIso(data.registerdate);
        rHelper.methods.API_toggleLoadSuccessorHelper('player');
      });
    },
    API_getAttackLog: function API_getAttackLog(type, target, skipCount) {
      'use strict';

      if (typeof type === 'undefined') {
        type = 'attackSimple';
      }

      var url = 'api/core.php?attackLog&type=' + type;

      if (target) {
        url += '&target=' + target;
      }

      if (skipCount) {
        url += '&skip=' + skipCount;
      }

      $.getJSON(url, function(data) {
        rHelper.data.attackLog = data;
        rHelper.methods.API_toggleLoadSuccessorHelper('attack-log');

        rHelper.methods.INSRT_attackLog(type);
      });
    },
    API_getAttackLogInitiator: function API_getAttackLogInitiator(key) {
      'use strict';

      rHelper.methods.API_toggleLoader('attack-log');

      $.getJSON('api/core.php?query=9&key=' + key, function(data) {
        if (data.callback != 'rHelper.methods.API_getAttackLog("attackSimple")') {
          swal('Error', "Couldn't fetch attack log - API potentially unavailable!", 'error');
        } else {
          rHelper.methods.API_toggleLoadSuccessorHelper('attack-log');
        }
      });
    },
    API_getTradeLog: function API_getTradeLog(skipCount, filter, dateFilter) {
      'use strict';

      var url = 'api/core.php?tradeLog';

      if (skipCount) {
        url += '&skipCount=' + skipCount;
      }

      if (filter) {
        url += '&filter=' + filter;
      }

      if (dateFilter) {
        url += '&day=' + dateFilter;
      }

      var buttons = [$('#tradelog-next'), $('#tradelog-previous')];

      $.each(buttons, function(i, btn) {
        btn.attr('disabled', true);
      });

      $.getJSON(url, function(data) {
        rHelper.data.tradeLog = data;
        rHelper.methods.INSRT_tradeLog();

        $.each(buttons, function(i, btn) {
          btn.attr('disabled', false);
        });
      });
    },
    API_getTradeLogInitiator: function API_getTradeLogInitiator(key) {
      'use strict';

      rHelper.methods.API_toggleLoader('trade-log');

      $.getJSON('api/core.php?query=6&key=' + key, function(data) {
        if (data.callback !== 'rHelper.methods.API_getTradeLog()') {
          swal('Error', "Couldn't fetch trade log - API potentially unavailable!", 'error');
        }
        rHelper.methods.API_toggleLoadSuccessorHelper('trade-log');
      });
    },
    API_getMissions: function API_getMissions() {
      'use strict';

      $.getJSON('api/core.php?missions', function(data) {
        rHelper.data.missions = data;
        rHelper.methods.API_toggleLoadSuccessorHelper('missions');
        rHelper.methods.INSRT_missions();
      });
    },
    API_getMissionsInitiator: function API_getMissionsInitiator(key) {
      'use strict';

      rHelper.methods.API_toggleLoader('missions');
      $.getJSON('api/core.php?query=10&key=' + key, function(data) {
        if (data.callback === 'rHelper.methods.API_getMissions()') {
          rHelper.methods.API_getMissions();
        }
      });
    },
    API_getBuildings: function API_getBuildings(key) {
      'use strict';

      rHelper.methods.API_toggleLoader('buildings');

      $.getJSON('api/core.php?query=3&key=' + key, function(data) {
        var fns = ['INSRT_buildingName', 'SET_buildingBackgroundColor', 'INSRT_buildingData', 'INSRT_buildingToLevel10'];

        $.each(data, function(i, buildingLevel) {
          rHelper.data.buildings[i].level = buildingLevel;

          $.each(fns, function(k, fn) {
            rHelper.methods[fn](i);
          });
        });

        rHelper.methods.INSRT_gaugeGraph('buildings');
        rHelper.methods.API_toggleLoadSuccessorHelper('buildings');

        rHelper.methods.SET_save();
      });
    },
    API_getHeadquarter: function API_getHeadquarter(key) {
      'use strict';

      var ref = rHelper.methods;

      ref.API_toggleLoader('headquarter');

      $.getJSON('api/core.php?query=4&key=' + key, function(data) {
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

        $.each(data.paid, function(i, paid) {
          rHelper.data.headquarter.user.paid[i] = paid;
        });

        ref.INSRT_gaugeGraph('headquarter');
        ref.SET_hqLevel();
        ref.API_toggleLoadSuccessorHelper('headquarter');
        ref.SET_save();
      });
    },
    API_getCreditInformation: function API_getCreditInformation(key) {
      'use strict';

      $('#api-credits').html(
        '<span id="api-credits-loading" class="circles-to-rhombuses-spinner"><span class="rhombuses-circle"></span><span class="rhombuses-circle"></span><span class="rhombuses-circle"></span></span>'
      );
      $('#api-credits-loading').css('display', 'flex');

      $.get('api/core.php?query=0&key=' + key, function(data) {
        var remainingCredits = parseInt(data[0].creditsleft);
        rHelper.data.userInformation.remainingCredits = remainingCredits;
        rHelper.methods.INSRT_API_remainingCredits(remainingCredits);

        $('#api-submit').attr('disabled', false);
        $('#api-credits-loading').css('display', 'none');
      });
    },
    API_init: function API_init(key, queries, anonymity) {
      'use strict';

      var ref = rHelper.methods;

      if ($.isArray(queries)) {
        $.post({
          url: 'api/updateQueryPreset.php',
          data: {
            queries: JSON.stringify(queries)
          }
        });

        $.each(queries, function(i, query) {
          switch (query) {
            case 1:
              ref.API_getFactories(key); // STABLE
              break;
            case 2:
              ref.API_getWarehouse(key); // STABLE
              break;
            case 3:
              ref.API_getBuildings(key); // STABLE
              break;
            case 4:
              ref.API_getHeadquarter(key); // STABLE
              break;
            case 5:
              ref.API_getMineMapInitiator(key); // STABLE
              break;
            case 51:
              ref.API_getMineSummary(key); // STABLE
              break;
            case 6:
              ref.API_getTradeLogInitiator(key); // STABLE
              break;
            case 7:
              ref.API_getPlayerInfo(key, anonymity); // STABLE
              break;
            case 9:
              ref.API_getAttackLogInitiator(key); // STABLE
              break;
            case 10:
              ref.API_getMissionsInitiator(key); // STABLE
              break;
            default:
              ref.API_getCreditInformation(key); // STABLE
              break;
          }
        });
      }
    },
    API_getWorldMap: function API_getWorldMap(type) {
      'use strict';

      $.getJSON('api/core.php?worldMap=' + type, function(data) {
        rHelper.data.worldMap = rHelper.data.worldMap || {};
        rHelper.data.worldMap = data;
        rHelper.methods.EVNT_mapCreation('world');
      });
    },
    SET_language: function SET_language() {
      var languageContainer = rHelper.data.locale;

      $.each(languageContainer, function(target, value) {
        $('#' + target).html(value);
      });
    },
    SET_globalObject: function SET_globalObject(selector, index, key, value) {
      'use strict';

      if ($.isArray(key)) {
        rHelper.data[selector][index][key[0]][key[1]] = value;
      } else {
        rHelper.data[selector][index][key] = value;
      }

      rHelper.methods.SET_save();
    },
    SET_save: function SET_save() {
      'use strict';

      if (!isLoggedIn) {
        localStorage.setItem('rGame', JSON.stringify(rHelper.data));
      }
    },
    SET_stickyHeaders: function SET_stickyHeaders() {
      var stickyTables = [
        '#module-leaderboard table',
        '#module-factories table',
        '#module-mines table',
        '#module-diamond table',
        '#module-warehouses table',
        '#techupgrades-combinations-tbl',
        '#module-missions table'
      ];

      $.each(stickyTables, function(i, el) {
        $(el).stickyTableHeaders();
      });
    },
    SET_tabSwitcherAnchorBased: function SET_tabSwitcherAnchorBased() {
      'use strict';

      var anchor = '#' + window.location.hash.substr(1);
      if (anchor === '#') {
        if (isLoggedIn) {
          anchor = '#factories';
        } else {
          anchor = '#registrationlogin';
        }
      }

      if (anchor === '#leaderboard') {
        rHelper.methods.INSRT_leaderboard();
      }

      if (anchor === '#tradelog') {
        rHelper.methods.API_getTradeLog();
      }

      if (anchor === '#techupgrades') {
        rHelper.methods.INSRT_techUpgradeRows();
      }

      $('.nav-link').each(function(i, navLink) {
        var _ref = [$(navLink), $('#' + navLink.dataset.target)],
          navEl = _ref[0],
          target = _ref[1];

        if (navEl.attr('href') === anchor) {
          target.css('display', 'block');
          navEl.addClass('active');
        } else {
          target.css('display', 'none');
          navEl.removeClass('active');
        }
      });
    },
    SET_transportCost: function SET_transportCost(init) {
      'use strict';

      var ref = rHelper.methods;

      rHelper.data.buildings[9].transportCost = 1 + (15 - rHelper.data.buildings[9].level) / 100;

      if (!init) {
        $.each(rHelper.data.buildings, function(buildingId) {
          var fns = ['SET_buildingBackgroundColor', 'INSRT_buildingData', 'INSRT_buildingToLevel10'];

          $.each(fns, function(i, fn) {
            ref[fn](buildingId);
          });
        });
        var calculationOrder = ref.GET_calculationOrder();
        $.each(calculationOrder, function(index, factoryId) {
          var fns = ['INSRT_factoryUpgradeCost', 'INSRT_factoryROI'];

          $.each(fns, function(i, fn) {
            ref[fn](factoryId);
          });

          ref.INSRT_flowDistributionGlobal();
        });

        $.each(rHelper.data.headquarter, function(headquarterLevel) {
          ref.INSRT_headquarterOvwTransportation(headquarterLevel);
        });
      }
    },
    SET_buildingBackgroundColor: function SET_buildingBackgroundColor(buildingId) {
      'use strict';

      var buildingLevel = rHelper.data.buildings[buildingId].level;

      var r = 255 - buildingLevel * 10;
      var g = 127 + buildingLevel * 7;
      var b = 80 - buildingLevel * 3;

      $('#building-' + buildingId).css('background-color', 'rgba(' + r + ',' + g + ',' + b + ', 0.25)');
    },
    SET_buildingTableVisibility: function SET_buildingTableVisibility(buildingId, state) {
      'use strict';

      var _ref2 = [$('#building-' + buildingId + ' tbody'), $('#building-' + buildingId + ' tfoot')],
        tbody = _ref2[0],
        tfoot = _ref2[1];

      $.each([tbody, tfoot], function(i, el) {
        switch (state) {
          case 'show':
            if (el.css('display') === 'none') {
              el.css('display', 'table-row-group');
            }
            break;
          case 'hide':
            if (el.css('display') !== 'none') {
              el.css('display', 'none');
            }
            break;
        }
      });
    },
    SET_recyclingProfitObj: function SET_recyclingProfitObj(lootId) {
      'use strict';

      rHelper.data.loot[lootId].profit = {
        outputWorth: 0,
        inputWorth: 0,
        profit: 0
      };
    },
    SET_recyclingPlantLevel: function SET_recyclingPlantLevel() {
      'use strict';

      $.each(rHelper.data.loot, function(lootId) {
        if (lootId === 4 || (lootId >= 10 && lootId <= 13)) {
          return;
        }

        var fns = ['INSRT_recyclingProducts', 'INSRT_recyclingOutputWorth', 'INSRT_recyclingInputWorth'];

        $.each(fns, function(i, fn) {
          rHelper.methods[fn](lootId);
        });

        rHelper.methods.INSRT_unitsRecyclingProfit('recycling', lootId);
      });
    },
    SET_UnitProfitObj: function SET_UnitProfitObj(unitId) {
      'use strict';

      rHelper.data.units[unitId].profit = {
        craftingPrice: 0,
        marketPrice: 0,
        profit: 0
      };
    },
    SET_hqLevel: function SET_hqLevel() {
      'use strict';

      var headquarter = rHelper.data.headquarter;

      if (headquarter.user) {
        var userHqLevel = headquarter.user.level;
        rHelper.methods.SET_hqSelectorClass(userHqLevel - 1);
        rHelper.methods.INSRT_headquarterPaid();

        var fns = ['INSRT_headquarterContentRequiredAmount', 'INSRT_headquarterMissing', 'INSRT_headquarterRemainingCost'];

        $.each(fns, function(i, fn) {
          rHelper.methods[fn](userHqLevel);
        });
      }
    },
    SET_hqSelectorClass: function SET_hqSelectorClass(userHqLevel) {
      'use strict';

      for (var i = 0; i <= 9; i += 1) {
        if (userHqLevel != i) {
          $('.hq-thumb-' + i).addClass('disabled-hq');
        } else {
          $('.hq-thumb-' + i).removeClass('disabled-hq');
        }
      }
    },
    SET_newMap: function SET_newMap(container, zoom, type) {
      'use strict';

      return new google.maps.Map(container[0], {
        zoom: zoom,
        mapTypeId: type
      });
    },
    SET_mapOptions: function SET_mapOptions(map, maxZoom, primaryMine) {
      'use strict';

      map.setOptions({
        maxZoom: maxZoom,
        center: new google.maps.LatLng(primaryMine.lat, primaryMine.lon)
      });
      return map;
    },
    SET_mapImg: function SET_mapImg(folder, icon, size) {
      'use strict';

      return {
        url: 'assets/img/maps/' + folder + '/' + icon + '.png',
        scaledSize: new google.maps.Size(size, size)
      };
    },
    SET_mapInfoWindow: function SET_mapInfoWindow(contentString) {
      'use strict';

      return new google.maps.InfoWindow({
        content: contentString
      });
    },
    SET_mapFolderRelation: function SET_mapFolderRelation(relation) {
      'use strict';

      var folder = 'foe';
      if (relation === 'friend') {
        folder = 'friend';
      }

      return folder;
    },
    SET_mapHQHandler: function SET_mapHQHandler(map, hqObj) {
      'use strict';

      var hqLevel = hqObj.level;

      var _ref3 = [
          hqLevel * 12.5,
          rHelper.data.headquarter[hqLevel - 1].radius,
          {
            lat: hqObj.lat,
            lng: hqObj.lon
          }
        ],
        hqSize = _ref3[0],
        radius = _ref3[1],
        center = _ref3[2];

      rHelper.methods.SET_mapHqCircle(map, center, radius, hqObj.relation);

      new google.maps.Marker({
        map: map,
        position: center,
        icon: rHelper.methods.SET_mapImg('hq', hqLevel, hqSize)
      });
    },
    SET_mapHqCircle: function SET_mapHqCircle(map, hqCenter, radius, relation) {
      var color = '#FF0000';
      if (relation === 'friend') {
        color = '#00FF00';
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
    SET_mapMineHandler: function SET_mapMineHandler(now, subObj, map, mapType) {
      var ref = rHelper.methods;

      var type = subObj.type;
      var relObj = rHelper.data.material[type];
      var buildMilliseconds = ref.CALC_toMilliseconds(subObj.builddate);
      var buildDate = ref.CALC_convertDateToIso(buildMilliseconds);
      var age = (now - buildMilliseconds) / 1000 / 86400;
      var estRevenue = ref.CALC_mineEstRevenue(subObj, type, age);
      var contentString = ref.CALC_createMapContentString(relObj, buildDate, age, estRevenue, subObj);
      var infoWindow = ref.SET_mapInfoWindow(contentString);
      var marker = new google.maps.Marker({
        map: map,
        position: {
          lat: subObj.lat,
          lng: subObj.lon
        },
        icon: ref.SET_mapImg(ref.SET_mapFolderRelation(subObj.relation), type, 20)
      });

      if (mapType === 'personal') {
        if (subObj.builddate === rHelper.data.mineMap.mines[0].builddate) {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
      }
      google.maps.event.addListener(marker, 'click', function() {
        if (openedWindow) {
          openedWindow.close();
        }
        openedWindow = infoWindow;
        infoWindow.open(map, marker);
      });

      return marker;
    },
    SET_overTimeGraph: function SET_overTimeGraph() {
      'use strict';

      var data = rHelper.data.mineMap.mines;

      var timestamps = [],
        mineCount = [],
        avgMinePrice = [],
        income = [],
        hours = [];

      for (var hour = 0; hour <= 23; hour += 1) {
        hours.push([hour + ' to ' + (hour + 1), 0]);
      }

      $.each(data, function(index, subObj) {
        var buildHour = new Date(rHelper.methods.CALC_toMilliseconds(subObj.builddate)).getHours();
        hours[buildHour][1] += 1;
      });

      Highcharts.chart('graph-buildinghabits', {
        chart: {
          type: 'column',
          backgroundColor: 'transparent'
        },
        title: {
          text: 'Building habits per hour',
          style: {
            color: '#dedede'
          }
        },
        xAxis: {
          type: 'category',
          labels: {
            rotation: -45,
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif',
              color: '#dedede'
            }
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Amount of mines',
            style: {
              color: '#dedede'
            }
          },
          labels: {
            style: {
              color: '#dedede'
            }
          }
        },
        legend: {
          enabled: false
        },
        tooltip: {
          pointFormat: 'Mines built at this hour: <b>{point.y}</b>'
        },
        series: [
          {
            name: 'Mines',
            data: hours,
            dataLabels: {
              enabled: true,
              rotation: -90,
              color: '#dedede',
              align: 'right',
              y: 10,
              style: {
                fontSize: '13px',
                fontFamily: 'Verdana, sans-serif',
                color: '#dedede'
              }
            }
          }
        ],
        exporting: {
          chartOptions: {
            chart: {
              backgroundColor: '#5f473e'
            }
          }
        }
      });

      var ref = rHelper.methods;

      var _ref4 = [data[0].builddate, data[data.length - 1].builddate],
        firstMine = _ref4[0],
        lastMine = _ref4[1];

      var daysSinceFirstMine = (lastMine - firstMine) / 86400;

      timestamps.push(ref.CALC_toMilliseconds(firstMine));

      for (var i = 0; i <= daysSinceFirstMine; i += 1) {
        var date = ref.CALC_toMilliseconds(firstMine + 86400 * i);
        timestamps.push(date);
      }

      $.each(timestamps, function(i, ts) {
        var mineCountAtGivenTS = 0,
          sum = 0,
          totalIncomeAtGivenTS = 0;

        $.each(data, function(index, subObj) {
          var builddate = ref.CALC_toMilliseconds(subObj.builddate);

          if (builddate <= ts) {
            mineCountAtGivenTS += 1;
            totalIncomeAtGivenTS += ref.CALC_returnPriceViaId(subObj.type) * subObj.fullRate;
          }
        });

        $.each(rHelper.data.material, function(k) {
          sum += ref.CALC_materialNewMinePrice(mineCountAtGivenTS, k);
        });

        income.push(Math.round(totalIncomeAtGivenTS));
        mineCount.push(mineCountAtGivenTS);
        avgMinePrice.push(Math.round(sum / 14));

        timestamps[i] = ref.CALC_convertDateToIso(ts);
      });

      Highcharts.chart('graph-overtime', {
        chart: {
          type: 'spline',
          zoomType: 'x',
          backgroundColor: 'transparent'
        },
        title: {
          useHTML: true,
          text: 'Progress graph',
          style: {
            color: '#dedede'
          }
        },
        xAxis: {
          categories: timestamps,
          labels: {
            style: {
              color: '#dedede'
            }
          }
        },
        yAxis: {
          title: {
            text: 'Price or mine count over time',
            style: {
              color: '#dedede'
            }
          },
          labels: {
            formatter: function formatter() {
              return this.value.toLocaleString('en-US');
            },
            style: {
              color: '#dedede'
            }
          }
        },
        legend: {
          enabled: true,
          backgroundColor: '#dedede'
        },
        tooltip: {
          crosshairs: true,
          shared: true
        },
        plotOptions: {
          spline: {
            marker: {
              radius: 4,
              lineColor: '#666666',
              lineWidth: 1
            }
          }
        },
        series: [
          {
            name: 'Mine count',
            marker: {
              symbol: 'square'
            },
            data: mineCount,
            color: 'orange'
          },
          {
            name: 'Average cost of a new mine',
            marker: {
              symbol: 'diamond'
            },
            data: avgMinePrice,
            color: 'coral'
          },
          {
            name: 'Average income at given time',
            marker: {
              symbol: 'triangle'
            },
            data: income,
            color: 'yellowgreen'
          }
        ],
        exporting: {
          chartOptions: {
            chart: {
              backgroundColor: '#5f473e'
            }
          }
        }
      });
    },
    EVNT_enableTippy: function EVNT_enableTippy() {
      'use strict';

      $.each($('[title]'), function(i, el) {
        if (!el._tippy) {
          tippy(el, {
            dynamicTitle: true
          });
        }
        $(el).attr('tippied', true);
      });
    },
    EVNT_assignTitleToIconsHelper: function EVNT_assignTitleToIconsHelper(min, max, subSelector, incrementor) {
      'use strict';

      var _loop = function _loop(i) {
        $.each($('.resources-' + subSelector + '-' + i), function(k, el) {
          if (!$(el).attr('title')) {
            var convertedId = i + incrementor;
            $(el).attr('title', rHelper.methods.CALC_returnPriceViaId(convertedId).toLocaleString('en-US'));
          }
        });
      };

      for (var i = min; i <= max; i += 1) {
        _loop(i);
      }
    },
    EVNT_assignTitleToIcons: function EVNT_assignTitleToIcons() {
      'use strict';

      var maxIndices = [13, 21, 16, 5],
        subObjs = ['material', 'product', 'loot', 'unit'],
        length = [0, 14, 36, 52];

      $.each(maxIndices, function(i, val) {
        rHelper.methods.EVNT_assignTitleToIconsHelper(0, val, subObjs[i], length[i]);
      });
    },
    EVNT_sortableTables: function EVNT_sortableTables() {
      'use strict';

      var tables = [
        $('#module-mines table')[0],
        $('#module-factories table')[0],
        $('#module-diamond table')[0],
        $('#module-missions table')[0],
        $('#techupgrades-combinations-tbl')[0],
        $('#recycling-tbl')[0],
        $('#units-tbl')[0]
      ];

      $.each(tables, function(index, table) {
        if ((typeof table === 'undefined' ? 'undefined' : _typeof(table)) !== undefined) {
          sorttable.makeSortable(table);

          if (index === 2) {
            sorttable.innerSortFunction.apply($('#module-diamond th')[5], []);
          } else if (index === 4) {
            // sorting twice for cheapest price first...
            sorttable.innerSortFunction.apply($('#techupgrades-combinations-tbl th')[5], []);
            sorttable.innerSortFunction.apply($('#techupgrades-combinations-tbl th')[5], []);
          }
        }
      });
    },
    EVNT_factoryInput: function EVNT_factoryInput(factoryId) {
      'use strict';

      $('#factories-level-' + factoryId).on('input', function() {
        var _ref5 = [rHelper.methods, parseInt(this.id.replace('factories-level-', '')), parseInt(this.value)],
          ref = _ref5[0],
          factoryId = _ref5[1],
          factoryLevel = _ref5[2];

        ref.SET_globalObject('products', factoryId, 'factoryLevel', factoryLevel);

        var fns = [
          // factories tab
          'INSRT_factoryOutput',
          'INSRT_factoryUpgradeCost',
          'INSRT_factoryDependencies',
          'INSRT_factoryWorkload',
          'INSRT_factoryTurnover',
          'INSRT_factoryTurnoverPerUpgrade',
          'INSRT_factoryROI',
          // diamond tab
          'INSRT_diamondFactoryLevel',
          'INSRT_diamondFactoryOutput',
          'INSRT_diamondFactoryOutputWarehouse',
          'INSRT_diamondDependencies',
          'INSRT_diamondEfficiency',
          'INSRT_diamondProfit',
          'INSRT_totalFactoryUpgrades'
        ];

        $.each(fns, function(i, fn) {
          ref[fn](factoryId);
        });

        ref.CALC_dependantFactories(factoryId, 'product');
        ref.INSRT_diamondTop10Profit();
        ref.INSRT_diamondTotalProfit();
        ref.INSRT_flowRate(factoryId, 'product');
        ref.INSRT_flowDistributionGlobal();
        ref.INSRT_factoryHighlightColumns();
      });
    },
    EVNT_materialInput: function EVNT_materialInput(materialId) {
      'use strict';

      $('#material-rate-' + materialId).on('input', function() {
        var _ref6 = [rHelper.methods, this.id.replace('material-rate-', ''), parseInt(this.value)],
          ref = _ref6[0],
          materialId = _ref6[1],
          materialAmount = _ref6[2];

        ref.SET_globalObject('material', materialId, 'perHour', materialAmount);
        ref.INSRT_materialRateWorth(materialId);
        ref.INSRT_totalMineWorth(ref.CALC_totalMineWorth());
        ref.CALC_dependantFactories(materialId, 'material');
        ref.INSRT_flowRate(materialId, 'material');
        ref.INSRT_flowDistributionGlobal();
        ref.EVNT_buildGraph('material');
      });

      $('#material-amount-of-mines-' + materialId).on('input', function() {
        var _ref7 = [rHelper.methods, this.id.replace('material-amount-of-mines-', ''), parseInt(this.value)],
          ref = _ref7[0],
          materialId = _ref7[1],
          materialAmountOfMines = _ref7[2];

        ref.SET_globalObject('material', materialId, 'amountOfMines', materialAmountOfMines);

        $.each(rHelper.data.material, function(materialId) {
          ref.INSRT_materialNewMinePrice(materialId);
        });

        ref.INSRT_warehouseRemainingTimeToFull(materialId, 'material');
        ref.INSRT_materialMineAmortisation();
        ref.INSRT_totalMineCount(ref.CALC_totalMineCount());
        ref.EVNT_buildGraph('material');
      });
    },
    EVNT_warehouseInput: function EVNT_warehouseInput(id, type) {
      'use strict';

      // on upgrade calculator input

      $('#warehouse-' + type + '-calc-2-' + id).on('input', function() {
        var value = parseInt(this.value);
        if (isNaN(value)) {
          value = 0;
        }
        rHelper.methods.INSRT_warehouseUpgradeCost(id, type, value);
      });

      // reset upgrade cost on select swap
      $('#warehouse-' + type + '-calc-1-' + id).on('change', function() {
        $('#warehouse-' + type + '-upgrade-cost-' + id).empty();
        $('#warehouse-' + type + '-calc-2-' + id).val(0);
      });

      // on increase of current stock
      $('#warehouse-' + type + '-stock-current-' + id).on('input', function() {
        var value = parseInt(this.value);
        if (isNaN(value)) {
          value = 0;
        }
        var newFillStatus = value / rHelper.data[type][id].warehouse.contingent;

        rHelper.methods.SET_globalObject(type, id, ['warehouse', 'fillAmount'], value);
        rHelper.methods.SET_globalObject(type, id, ['warehouse', 'fillStatus'], newFillStatus);

        var fns = ['INSRT_warehouseWorth', 'INSRT_warehouseFillStatus', 'INSRT_warehouseRemainingTimeToFull'];

        $.each(fns, function(i, fn) {
          rHelper.methods[fn](id, type);
        });

        rHelper.methods.INSRT_warehouseTotalWorth();
      });
      // on increase of warehouse level
      $('#warehouse-' + type + '-level-' + id).on('input', function() {
        var _ref8 = [parseInt(this.value), rHelper.data[type][id].warehouse],
          value = _ref8[0],
          el = _ref8[1];

        var ref = rHelper.methods;

        if (isNaN(value)) {
          value = 0;
        }

        ref.SET_globalObject(type, id, ['warehouse', 'level'], value);
        ref.SET_globalObject(type, id, ['warehouse', 'contingent'], ref.CALC_warehouseContingent(value));
        ref.SET_globalObject(type, id, ['warehouse', 'fillStatus'], el.fillAmount / el.contingent);

        var fns = ['INSRT_warehouseCapacity', 'INSRT_warehouseFillStatus', 'INSRT_warehouseRemainingTimeToFull'];

        $.each(fns, function(i, fn) {
          ref[fn](id, type);
        });

        ref.INSRT_warehouseTotalLevel();
      });
    },
    EVNT_buildingChange: function EVNT_buildingChange(buildingId) {
      'use strict';

      $('#buildings-level-' + buildingId).on('change', function() {
        var _ref9 = [rHelper.methods, parseInt(this.value), [3, 4, 9], ['INSRT_buildingData', 'INSRT_buildingToLevel10', 'SET_buildingBackgroundColor']],
          ref = _ref9[0],
          value = _ref9[1],
          recalculateUnitStrength = _ref9[2],
          fns = _ref9[3];

        ref.SET_globalObject('buildings', buildingId, 'level', value);

        if (buildingId === 9) {
          ref.SET_transportCost();
        } else if (buildingId === 5) {
          ref.SET_recyclingPlantLevel();
        }

        if ($.inArray(buildingId, recalculateUnitStrength)) {
          $.each(rHelper.data.units, function(unitId) {
            ref.INSRT_unitsPricePerStrength(unitId);
          });
        }

        $.each(fns, function(i, fn) {
          ref[fn](buildingId);
        });

        ref.INSRT_gaugeGraph('buildings');
      });
    },
    EVNT_buildGraph: function EVNT_buildGraph(type) {
      'use strict';

      var ref = rHelper.methods;

      rHelper.graphs = rHelper.graphs || {};

      var parentGraphObj = rHelper.graphs.material;
      rHelper.graphs.material.reference.mineCount = ref.CALC_totalMineCount();
      rHelper.graphs.material.reference.mineIncome = ref.CALC_totalMineWorth();

      $.each(rHelper.data.material, function(i, material) {
        var iteration = {
          y: 0,
          color: '',
          drilldown: {
            categories: [],
            data: [],
            color: ''
          }
        };

        var mineAmountPercent = parseFloat((material.amountOfMines / rHelper.graphs.material.reference.mineCount * 100).toFixed(2));
        var mineIncomePercent = parseFloat((ref.CALC_materialRateWorth(i) / rHelper.graphs.material.reference.mineIncome * 100).toFixed(2));
        var materialName = material.name;

        if (!isNaN(mineAmountPercent)) {
          iteration.y = mineAmountPercent;
        } else {
          iteration.y = 0;
        }

        var mineDataObj = {
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

        var drillDataLen = iteration.drilldown.data.length;
        var brightness = 0;

        for (var j = 0; j < drillDataLen; j += 1) {
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

      ref.INSRT_polygonGraph(parentGraphObj.target, parentGraphObj.titleText, parentGraphObj.seriesNames, parentGraphObj.responsiveId, type);
    },
    EVNT_switchHeadquarter: function EVNT_switchHeadquarter(clickedHq) {
      'use strict';

      $('.hq-thumb-' + clickedHq).on('click', function() {
        var _ref10 = [rHelper.methods, parseInt(clickedHq) + 1],
          ref = _ref10[0],
          actualLevel = _ref10[1];

        rHelper.data.headquarter.user = rHelper.data.headquarter.user || {};
        rHelper.data.headquarter.user.paid = rHelper.data.headquarter.user.paid || [0, 0, 0, 0];
        rHelper.data.headquarter.user.level = rHelper.data.headquarter.user.level || actualLevel;

        ref.SET_globalObject('headquarter', 'user', 'level', actualLevel);
        ref.SET_hqSelectorClass(clickedHq);
        ref.INSRT_gaugeGraph('headquarter');
        ref.INSRT_headquarterContentRequiredAmount(actualLevel);
        ref.INSRT_headquarterPaid();

        for (var i = 0; i <= 3; i += 1) {
          ref.INSRT_headquarterMissing(i);
        }

        ref.INSRT_headquarterRemainingCost(actualLevel);
        ref.INSRT_companyWorth();
      });
    },
    EVNT_headquarterInput: function EVNT_headquarterInput() {
      'use strict';

      $.each($("[id*='hq-content-input-']"), function(i, el) {
        $(el).on('input', function() {
          var _ref11 = [rHelper.methods, parseInt(this.id.replace(/hq-content-input-/, ''))],
            ref = _ref11[0],
            thisId = _ref11[1];

          var thisValue = parseInt(this.value);

          if (isNaN(thisValue)) {
            thisValue = 0;
          } else if (thisValue > 50000000) {
            thisValue = 50000000;
          }

          ref.SET_globalObject('headquarter', 'user', ['paid', thisId], thisValue);
          ref.INSRT_headquarterMissing(i);
          ref.INSRT_headquarterRemainingCost(rHelper.data.headquarter.user.level);
          ref.INSRT_gaugeGraph('headquarter');
          ref.INSRT_companyWorth();
        });
      });
    },
    EVNT_priceHistoryOnChange: function EVNT_priceHistoryOnChange() {
      'use strict';

      $('#pricehistory-selector').on('change', function() {
        var _ref12 = [rHelper.methods, parseInt(this.value)],
          ref = _ref12[0],
          thisVal = _ref12[1];
        var _ref13 = ['api/getPriceHistory.php?id=' + thisVal, ref.CALC_convertId(thisVal)],
          url = _ref13[0],
          resource = _ref13[1];

        var materialName = '<span style="height: 25px; width: 25px;" class="' + resource.icon + '"></span> ' + resource.name;

        ref.EVNT_priceHistoryToggler('loading');

        $.getJSON(url, function(response) {
          var _ref14 = [response.avg.ki, response.avg.player, [], [], []],
            averageKI = _ref14[0],
            averagePlayer = _ref14[1],
            timestamps = _ref14[2],
            player = _ref14[3],
            ki = _ref14[4];

          $.each(response.data, function(i, dataset) {
            var date = ref.CALC_convertDateToIso(ref.CALC_toMilliseconds(dataset.ts));
            timestamps.push(date);

            if (dataset.player === 0) {
              dataset.player = null;
            }
            player.push(dataset.player);
            ki.push(dataset.ki);
          });

          ref.EVNT_priceHistoryToggler('finished');
          ref.INSRT_priceHistoryGraph(materialName, averageKI, averagePlayer, timestamps, player, ki);
        });
      });
    },
    EVNT_priceHistoryToggler: function EVNT_priceHistoryToggler(state) {
      'use strict';

      var _ref15 = [$('#graph-pricehistory'), $('#pricehistory-selector')],
        container = _ref15[0],
        selector = _ref15[1];

      switch (state) {
        case 'loading':
          var svg =
            '<svg id="pricehistory-svg" xmlns="http://www.w3.org/2000/svg" style="background:0 0" preserveAspectRatio="xMidYMid" viewBox="0 0 100 100"><g transform="translate(50 50)"><g transform="matrix(.6 0 0 .6 -19 -19)"><g transform="rotate(242)"><animateTransform attributeName="transform" begin="0s" dur="3s" keyTimes="0;1" repeatCount="indefinite" type="rotate" values="0;360"/><path fill="#9acd32" d="M37.3496988-7h10V7h-10a38 38 0 0 1-1.50391082 5.61267157l8.66025404 5-7 12.12435565-8.66025404-5a38 38 0 0 1-4.10876076 4.10876076l5 8.66025404-12.12435565 7-5-8.66025404A38 38 0 0 1 7 37.34969879v10H-7v-10a38 38 0 0 1-5.61267157-1.50391081l-5 8.66025404-12.12435565-7 5-8.66025404a38 38 0 0 1-4.10876076-4.10876076l-8.66025404 5-7-12.12435565 8.66025404-5A38 38 0 0 1-37.34969879 7h-10V-7h10a38 38 0 0 1 1.50391081-5.61267157l-8.66025404-5 7-12.12435565 8.66025404 5a38 38 0 0 1 4.10876076-4.10876076l-5-8.66025404 12.12435565-7 5 8.66025404A38 38 0 0 1-7-37.34969879v-10H7v10a38 38 0 0 1 5.61267157 1.50391081l5-8.66025404 12.12435565 7-5 8.66025404a38 38 0 0 1 4.10876076 4.10876076l8.66025404-5 7 12.12435565-8.66025404 5A38 38 0 0 1 37.34969879-7M0-30a30 30 0 1 0 0 60 30 30 0 1 0 0-60"/></g></g><g transform="matrix(.6 0 0 .6 19 19)"><g transform="rotate(103)"><animateTransform attributeName="transform" begin="-0.125s" dur="3s" keyTimes="0;1" repeatCount="indefinite" type="rotate" values="360;0"/><path fill="coral" d="M37.3496988-7h10V7h-10a38 38 0 0 1-1.50391082 5.61267157l8.66025404 5-7 12.12435565-8.66025404-5a38 38 0 0 1-4.10876076 4.10876076l5 8.66025404-12.12435565 7-5-8.66025404A38 38 0 0 1 7 37.34969879v10H-7v-10a38 38 0 0 1-5.61267157-1.50391081l-5 8.66025404-12.12435565-7 5-8.66025404a38 38 0 0 1-4.10876076-4.10876076l-8.66025404 5-7-12.12435565 8.66025404-5A38 38 0 0 1-37.34969879 7h-10V-7h10a38 38 0 0 1 1.50391081-5.61267157l-8.66025404-5 7-12.12435565 8.66025404 5a38 38 0 0 1 4.10876076-4.10876076l-5-8.66025404 12.12435565-7 5 8.66025404A38 38 0 0 1-7-37.34969879v-10H7v10a38 38 0 0 1 5.61267157 1.50391081l5-8.66025404 12.12435565 7-5 8.66025404a38 38 0 0 1 4.10876076 4.10876076l8.66025404-5 7 12.12435565-8.66025404 5A38 38 0 0 1 37.34969879-7M0-30a30 30 0 1 0 0 60 30 30 0 1 0 0-60"/></g></g></g></svg>';
          container.html(svg);
          selector.attr('disabled', true);
          break;
        case 'finished':
          container.empty();
          selector.attr('disabled', false);
          break;
      }
    },
    EVNT_mapCreation: function EVNT_mapCreation(mapType) {
      'use strict';

      var _ref16 = [, , ,],
        container = _ref16[0],
        data = _ref16[1],
        infoNode = _ref16[2],
        errorText = _ref16[3];

      switch (mapType) {
        case 'personal':
          container = $('#personalmap');
          data = rHelper.data.mineMap;
          infoNode = $('#personalmap-info');
          errorText = 'Your mine map is empty! Please import "Mines - detailed" via API first.';
          break;
        case 'world':
          container = $('#worldmap');
          data = rHelper.data.worldMap;
          infoNode = $('#worldmap-info');
          errorText = 'An error occured. If this problem persists, please report this issue via Discord or mail.';
          break;
      }

      if (data.length != 0) {
        var _ref17 = [new Date(), rHelper.methods.SET_newMap(container, 3, 'terrain'), []],
          now = _ref17[0],
          map = _ref17[1],
          markerArr = _ref17[2];

        map = rHelper.methods.SET_mapOptions(map, 16, data.mines[0]);

        switch (mapType) {
          case 'personal':
            rHelper.methods.SET_mapHQHandler(map, data.hq[0]);
            break;
          case 'world':
            $.each(data.hqs, function(i, hqObj) {
              rHelper.methods.SET_mapHQHandler(map, hqObj);
            });
            break;
        }

        $.each(data.mines, function(i, subObj) {
          rHelper.methods.SET_mapMineHandler(now, subObj, map, mapType);
          markerArr.push(rHelper.methods.SET_mapMineHandler(now, subObj, map, mapType));
        });

        new MarkerClusterer(map, markerArr, { imagePath: 'assets/img/maps/cluster/m', maxZoom: 15 });
      } else {
        infoNode.text(errorText);
      }
    },
    EVNT_attackLogTrigger: function EVNT_attackLogTrigger() {
      $('#heading-defenselog a').on('click', function(e) {
        e.preventDefault();
        rHelper.methods.API_getAttackLog('defenseSimple');
      });

      $('#heading-attacklog-1 a').on('click', function(e) {
        e.preventDefault();
        rHelper.methods.API_getAttackLog('attackSimple');
      });

      $('#heading-attacklog-2 a').on('click', function(e) {
        e.preventDefault();
        rHelper.methods.API_getAttackLog('attackDetailed');
      });
    },
    INSRT_leaderboardTable: function INSRT_leaderboardTable() {
      var _ref18 = [rHelper.data.leaderboard, $('#module-leaderboard tbody'), 'text-md-right text-sm-left', "class='text-right'", ''],
        container = _ref18[0],
        tbody = _ref18[1],
        textOrientation = _ref18[2],
        textClass = _ref18[3],
        string = _ref18[4];

      var returnPlayerTitle = function returnPlayerTitle(dataset) {
        var _ref19 = [dataset.general.rank.toLocaleString('en-US'), dataset.general.registeredGame, dataset.general.daysPlaying.toLocaleString('en-US')],
          rank = _ref19[0],
          registeredGame = _ref19[1],
          daysPlaying = _ref19[2];

        if (rank === 0) {
          rank = registeredGame = daysPlaying = 'unknown';
        }

        return (
          '\n        <table>\n          <tbody>\n            <tr><td>Rank</td><td ' +
          textClass +
          '>' +
          rank +
          '</td></tr>\n            <tr><td>Registered since</td><td ' +
          textClass +
          '>' +
          registeredGame +
          '</td></tr>\n            <tr><td>Days playing</td><td ' +
          textClass +
          '>' +
          daysPlaying +
          '</td></tr>\n          </tbody>\n        </table>'
        );
      };

      var numberReducer = function numberReducer(number) {
        if (number !== 0) {
          var length = ('' + number).length;
          var divisor = 1,
            unit = '';

          if (length >= 4 && length < 7) {
            divisor = 1000;
            unit = 'k';
          } else if (length >= 7 && length < 10) {
            divisor = 1000000;
            unit = 'M';
          } else if (length >= 10 && length < 13) {
            divisor = 1000000000;
            unit = 'G';
          } else if (length >= 13 && length < 16) {
            divisor = 1000000000000;
            unit = 'T';
          } else if (length >= 16 && length < 19) {
            divisor = 1000000000000000;
            unit = 'P';
          } else if (length >= 19 && length < 22) {
            divisor = 1000000000000000000;
            unit = 'E';
          }

          return parseFloat((number / divisor).toFixed(3)) + ' ' + unit;
        } else {
          return '';
        }
      };

      var returnCompanyWorthTitle = function returnCompanyWorthTitle(dataset) {
        return (
          "\n        <table>\n          <thead>\n            <tr><th colspan='2'>Money spent on...</th></tr>\n          </thead>\n          <tbody>\n            <tr><td>Mines</td><td " +
          textClass +
          '>' +
          dataset.mineErectionSum.toLocaleString('en-US') +
          '</td></tr>\n            <tr><td>Factories</td><td ' +
          textClass +
          '>' +
          dataset.factoryErectionSum.toLocaleString('en-US') +
          '</td></tr>\n            <tr><td>Headquarter</td><td ' +
          textClass +
          '>' +
          dataset.headquarterSum.toLocaleString('en-US') +
          '</td></tr>\n            <tr><td>Buildings</td><td ' +
          textClass +
          '>' +
          dataset.buildingsErectionSum.toLocaleString('en-US') +
          '</td></tr>\n            <tr><td>Warehouse</td><td ' +
          textClass +
          '>' +
          dataset.warehouseErectionSum.toLocaleString('en-US') +
          '</td></tr>\n          </tbody>\n        </table>'
        );
      };

      var fillHighlightingObj = function fillHighlightingObj(container, highlightingObj) {
        $.each(container, function(i, dataset) {
          if (dataset.mineIncome > highlightingObj.mineIncome) {
            highlightingObj.mineIncome = dataset.mineIncome;
          }
          if (dataset.tradeData.tradeIncomePerDay > highlightingObj.tradeIncomePerDay) {
            highlightingObj.tradeIncomePerDay = dataset.tradeData.tradeIncomePerDay;
          }
          if (dataset.factoryTotalUpgrades > highlightingObj.factoryUpgrades) {
            highlightingObj.factoryUpgrades = dataset.factoryTotalUpgrades;
          }
          if (dataset.totalMineCount > highlightingObj.amountOfMines) {
            highlightingObj.amountOfMines = dataset.totalMineCount;
          }
          if (dataset.headquarter.mineCount > highlightingObj.minesWithinHQRadius) {
            highlightingObj.minesWithinHQRadius = dataset.headquarter.mineCount;
          }
          if (dataset.tradeData.totalBuy > highlightingObj.totalBuy) {
            highlightingObj.totalBuy = dataset.tradeData.totalBuy;
          }
          if (dataset.tradeData.totalSell > highlightingObj.totalSell) {
            highlightingObj.totalSell = dataset.tradeData.totalSell;
          }
          if (dataset.tradeData.sumKISell > highlightingObj.sumKISell) {
            highlightingObj.sumKISell = dataset.tradeData.sumKISell;
          }
          if (dataset.general.pointsPerDay > highlightingObj.pointsPerDay) {
            highlightingObj.pointsPerDay = dataset.general.pointsPerDay;
          }
        });
      };

      var returnString = function returnString(dataset) {
        var _ref20 = [
            dataset.general.name,
            dataset.general.level.toLocaleString('en-US'),
            dataset.general.pointsPerDay.toLocaleString('en-US'),
            dataset.general.points.toLocaleString('en-US'),
            dataset.headquarter.mineCount.toLocaleString('en-US'),
            dataset.tradeData.tradeIncomePerDay,
            dataset.tradeData.totalBuy,
            dataset.tradeData.totalSell,
            dataset.tradeData.sumKISell
          ],
          name = _ref20[0],
          level = _ref20[1],
          pointsPerDay = _ref20[2],
          points = _ref20[3],
          headquarterMines = _ref20[4],
          tradeIncome = _ref20[5],
          totalBuy = _ref20[6],
          totalSell = _ref20[7],
          sumKISell = _ref20[8];

        if (name === '') {
          level = '';
        } else {
          level = '(' + level + ')';
        }

        if (pointsPerDay === 0) {
          pointsPerDay = points = '';
        } else {
          points = '(' + points + ')';
        }

        if (headquarterMines === 0) {
          headquarterMines = '';
        }

        if (tradeIncome === 0) {
          tradeIncome = totalBuy = totalSell = sumKISell = '';
        }

        var classes = {
          pointsPerDayClass: dataset.general.pointsPerDay === highlightingObj.pointsPerDay ? 'text-success' : '',
          factoryUpgradesClass: dataset.factoryTotalUpgrades === highlightingObj.factoryUpgrades ? 'text-success' : '',
          amountOfMinesClass: dataset.totalMineCount === highlightingObj.amountOfMines ? 'text-success' : '',
          minesWithinHQClass: dataset.headquarter.mineCount === highlightingObj.minesWithinHQRadius ? 'text-success' : '',
          tradeIncomeClass: dataset.tradeData.tradeIncomePerDay === highlightingObj.tradeIncomePerDay ? 'text-success' : '',
          totalBuyClass: dataset.tradeData.totalBuy === highlightingObj.totalBuy ? 'text-success' : '',
          totalSellClass: dataset.tradeData.totalSell === highlightingObj.totalSell ? 'text-success' : '',
          totalKISellClass: dataset.tradeData.sumKISell === highlightingObj.sumKISell ? 'text-success' : '',
          mineIncomeClass: dataset.mineIncome === highlightingObj.mineIncome ? 'text-success' : ''
        };

        var trClass = '';

        if (dataset.you) {
          trClass = 'style="background-color: rgba(154, 205, 50, 0.1) !important;"';
        }

        return (
          '\n        <tr ' +
          trClass +
          '>\n          <td data-th="Player (hover for details)" title="' +
          returnPlayerTitle(dataset) +
          '">' +
          name +
          ' ' +
          level +
          '</td>\n          <td sorttable_customkey="' +
          dataset.general.points +
          '" data-th="Points per day (total points)" class="' +
          textOrientation +
          ' ' +
          classes.pointsPerDayClass +
          '">' +
          pointsPerDay +
          ' ' +
          points +
          '</td>\n          <td data-th="Factory upgrades" class="' +
          textOrientation +
          ' ' +
          classes.factoryUpgradesClass +
          '">' +
          dataset.factoryTotalUpgrades.toLocaleString('en-US') +
          '</td>\n          <td data-th="Amount of mines" class="' +
          textOrientation +
          ' ' +
          classes.amountOfMinesClass +
          '">' +
          dataset.totalMineCount.toLocaleString('en-US') +
          '</td>\n          <td data-th="Mines within HQ radius" class="' +
          textOrientation +
          ' ' +
          classes.minesWithinHQClass +
          '">' +
          headquarterMines +
          '</td>\n          <td data-th="Mine income" class="' +
          textOrientation +
          ' ' +
          classes.mineIncomeClass +
          '" sorttable_customkey="' +
          dataset.mineIncome +
          '">' +
          numberReducer(dataset.mineIncome) +
          '</td>\n          <td data-th="Trade income per day" class="' +
          textOrientation +
          ' ' +
          classes.tradeIncomeClass +
          '" sorttable_customkey="' +
          dataset.tradeData.tradeIncomePerDay +
          '">' +
          numberReducer(tradeIncome) +
          '</td>\n          <td data-th="Bought goods for" class="' +
          textOrientation +
          ' ' +
          classes.totalBuyClass +
          '" sorttable_customkey="' +
          dataset.tradeData.totalBuy +
          '">' +
          numberReducer(totalBuy) +
          '</td>\n          <td data-th="Sold goods for..." class="' +
          textOrientation +
          ' ' +
          classes.totalSellClass +
          '"  sorttable_customkey="' +
          dataset.tradeData.totalSell +
          '">' +
          numberReducer(totalSell) +
          '</td>\n          <td data-th="Sold goods to KI for..." class="' +
          textOrientation +
          ' ' +
          classes.totalKISellClass +
          '" sorttable_customkey="' +
          dataset.tradeData.sumKISell +
          '">' +
          numberReducer(sumKISell) +
          '</td>\n          <td data-th="Company worth" class="' +
          textOrientation +
          '" title="' +
          returnCompanyWorthTitle(dataset) +
          '" sorttable_customkey="' +
          dataset.companyWorth +
          '">' +
          numberReducer(dataset.companyWorth) +
          '</td>\n        </tr>\n        '
        );
      };

      var highlightingObj = {
        mineIncome: 0,
        tradeIncomePerDay: 0,
        factoryUpgrades: 0,
        amountOfMines: 0,
        minesWithinHQRadius: 0,
        totalBuy: 0,
        totalSell: 0,
        sumKISell: 0,
        pointsPerDay: 0
      };

      fillHighlightingObj(container, highlightingObj);

      $.each(container, function(i, dataset) {
        if (dataset.companyWorth != 0) {
          string += returnString(dataset);
        }
      });

      tbody.empty().html(string);

      sorttable.makeSortable($('#module-leaderboard table')[0]);
      sorttable.innerSortFunction.apply($('#module-leaderboard th')[10], []);

      $.each($('#module-leaderboard td[title]'), function(i, el) {
        applyTippyOnNewElement($(el));
      });
    },
    INSRT_leaderboard: function INSRT_leaderboard() {
      rHelper.data.leaderboard = rHelper.data.leaderboard || {};

      if ($.isEmptyObject(rHelper.data.leaderboard)) {
        $.getJSON('api/leaderboard.php', function(result) {
          rHelper.data.leaderboard = result;
          rHelper.methods.INSRT_leaderboardTable();
        });
      }
    },
    INSRT_tradeLog: function INSRT_tradeLog() {
      var container = rHelper.data.tradeLog;

      if (container.length != 0) {
        var showTradeLogHabits = function showTradeLogHabits(hours) {
          Highcharts.chart('graph-tradelog-habits', {
            chart: {
              type: 'column',
              backgroundColor: 'transparent',
              height: 200
            },
            title: {
              text: 'Selling habits per hour',
              style: {
                color: '#dedede'
              }
            },
            xAxis: {
              type: 'category',
              labels: {
                rotation: -45,
                style: {
                  fontSize: '13px',
                  fontFamily: 'Verdana, sans-serif',
                  color: '#dedede'
                }
              }
            },
            yAxis: {
              min: 0,
              title: {
                text: 'Amount of trades completed',
                style: {
                  color: '#dedede'
                }
              },
              labels: {
                style: {
                  color: '#dedede'
                }
              }
            },
            legend: {
              enabled: false
            },
            tooltip: {
              pointFormat: 'Sell actions performed at this hour: <b>{point.y}</b>'
            },
            series: [
              {
                name: 'Sell action',
                data: hours,
                dataLabels: {
                  enabled: true,
                  rotation: -90,
                  color: '#dedede',
                  align: 'right',
                  y: 10,
                  style: {
                    fontSize: '13px',
                    fontFamily: 'Verdana, sans-serif',
                    color: '#dedede'
                  }
                }
              }
            ],
            exporting: {
              chartOptions: {
                chart: {
                  backgroundColor: '#5f473e'
                }
              }
            }
          });
        };

        var setSkipCount = function setSkipCount() {
          var currentDaysFilter = _daysFilterSelect.val();

          if (currentDaysFilter !== null) {
            $.each(_daysFilterSelect.children('option'), function(i, el) {
              if ($(el).val() === currentDaysFilter) {
                rHelper.data.tradeLog.skipCount = i - 1;
              }
            });
          }
        };

        var appendOptions = function appendOptions() {
          _daysFilterSelect.empty().prepend('<option selected disabled>jump to day X</option>');

          $.each(container.days, function(i, dataset) {
            _daysFilterSelect.append('<option value="' + dataset.date + '">' + dataset.date + ' (' + dataset.entries.toLocaleString('en-US') + ' entries)</option>');
          });
        };

        var appendDetailedTR = function appendDetailedTR(dataset) {
          var obj = rHelper.methods.CALC_convertId(dataset.itemId);

          var datasetSum = dataset.price * dataset.amount,
            action = 'Selling to ',
            profitClass = 'success',
            trClass = '';

          if (dataset.event === 0) {
            datasetSum *= -1;
            action = 'Buying from ';
            profitClass = 'danger';
          }

          _sum += datasetSum;

          if (dataset.actor === 'KI') {
            trClass = 'class="ki-sell"';
          }

          var template =
            '\n          <tr ' +
            trClass +
            '>\n            <td data-th="Trade partner"><span class="text-' +
            profitClass +
            '">' +
            action +
            '</span><kbd>' +
            dataset.actor +
            ' (' +
            dataset.actorLevel.toLocaleString('en-US') +
            ')</kbd></td>\n            <td data-th="Timestamp" class="' +
            _textOrientation +
            '">' +
            rHelper.methods.CALC_convertDateToIso(dataset.timestamp * 1000) +
            '</td>\n            <td data-th="Amount" class="' +
            _textOrientation +
            '">' +
            dataset.amount.toLocaleString('en-US') +
            'x <span class="' +
            obj.icon +
            '"></span></td>\n            <td data-th="Price" class="' +
            _textOrientation +
            '">' +
            dataset.price.toLocaleString('en-US') +
            '</td>\n            <td data-th="Sum" class="' +
            _textOrientation +
            ' text-' +
            profitClass +
            '">' +
            datasetSum.toLocaleString('en-US') +
            '</td>\n          </tr>\n          ';

          _tradeLogDetailedTbody.append(template);
        };

        var appendTFoot = function appendTFoot() {
          var profitClass = 'success';

          if (_sum < 0) {
            profitClass = 'danger';
          }

          $('#tradelog-detailed-tfoot')
            .empty()
            .append('<tr><td data-th="daily profit" colspan="5" class="' + _textOrientation + ' text-' + profitClass + '">' + _sum.toLocaleString('en-US') + ' <a href="#">back to top</a></td></tr>');

          $('#tradelog-simple-tfoot')
            .empty()
            .append('<tr><td data-th="daily profit" colspan="5" class="' + _textOrientation + ' text-' + profitClass + '">' + _sum.toLocaleString('en-US') + ' <a href="#">back to top</a></td></tr>');
        };

        var showGraphs = function showGraphs(target, data, title) {
          Highcharts.chart(target, {
            chart: {
              type: 'pie',
              backgroundColor: 'transparent'
            },
            title: {
              text: title,
              style: {
                color: '#dedede'
              }
            },
            tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}% ({point.y:,.0f})</b>'
            },
            plotOptions: {
              pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                  enabled: true,
                  format: '<b>{point.name}</b>: {point.percentage:.1f} % ({point.y:,.0f})',
                  style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || '#dedede',
                    textOutline: 'none'
                  }
                }
              }
            },
            series: [
              {
                name: 'Percentage',
                colorByPoint: true,
                data: data
              }
            ],
            exporting: {
              chartOptions: {
                chart: {
                  backgroundColor: '#5f473e'
                }
              }
            }
          });
        };

        var fillEventArray = function fillEventArray(container) {
          var _ref21 = [[], container.max()],
            arr = _ref21[0],
            containerMax = _ref21[1];

          $.each(container, function(i, amount) {
            var itemObj = rHelper.methods.CALC_convertId(i);

            if (amount != null) {
              var obj = {
                name: itemObj.name,
                y: amount
              };

              if (containerMax === amount) {
                obj.sliced = true;
                obj.selected = true;
              }

              arr.push(obj);
            }
          });

          return arr;
        };

        var appendSimpleTR = function appendSimpleTR(dataset) {
          var obj = rHelper.methods.CALC_convertId(dataset.itemId);

          var profitClass = 'success';

          if (dataset.sum < 0) {
            profitClass = 'danger';
          }

          var template =
            '\n          <tr>\n            <td data-th="Type" class="' +
            _textOrientation +
            '"><span class="' +
            obj.icon +
            '"></span></td>\n            <td data-th="Bought for..." class="' +
            _textOrientation +
            ' text-danger"> ' +
            dataset.bought.toLocaleString('en-US') +
            '</td>\n            <td data-th="Sold for..." class="' +
            _textOrientation +
            ' text-success"> ' +
            dataset.sold.toLocaleString('en-US') +
            '</td>\n            <td data-th="Profit of selected day" class="' +
            _textOrientation +
            ' text-' +
            profitClass +
            '">' +
            dataset.sum.toLocaleString('en-US') +
            '</td>\n          </tr>\n          ';

          _tradeLogSimpleTbody.append(template);
        };

        showTradeLogHabits(container.timestamps);

        showGraphs('graph-tradelog-buying', fillEventArray(container.buying.valuesById), 'Buy values (total: ' + container.buying.total.toLocaleString('en-US') + ')');
        showGraphs('graph-tradelog-selling', fillEventArray(container.selling.valuesById), 'Sell values (total: ' + container.selling.total.toLocaleString('en-US') + ')');

        var _ref22 = [$('#tradelog-detailed-tbody'), 'text-md-right text-sm-left', $('#tradelog-filter-day'), $('#tradelog-simple-tbody')],
          _tradeLogDetailedTbody = _ref22[0],
          _textOrientation = _ref22[1],
          _daysFilterSelect = _ref22[2],
          _tradeLogSimpleTbody = _ref22[3];

        _tradeLogDetailedTbody.empty();
        _tradeLogSimpleTbody.empty();

        var _sum = 0;

        setSkipCount();

        appendOptions();

        $.each(container.log, function(i, dataset) {
          appendDetailedTR(dataset);
        });

        $.each(container.overview, function(i, dataset) {
          appendSimpleTR(dataset);
        });

        appendTFoot();
      }
    },
    INSRT_attackLogDetailedGeneralInformation: function INSRT_attackLogDetailedGeneralInformation(dataContainer) {
      $('#attacklog-detailed-units-lost-avg').html(rHelper.methods.CALC_attackLogDetailedUnitStringInsertion('offense', dataContainer.avg.unitsLost));
      $('#attacklog-detailed-units-lost-total').html(rHelper.methods.CALC_attackLogDetailedUnitStringInsertion('offense', dataContainer.total.unitsLost));

      $('#attacklog-detailed-factor-avg').text(dataContainer.avg.factor + '%');

      $('#attacklog-detailed-profit-avg').text(dataContainer.avg.profit.toLocaleString('en-US'));
      $('#attacklog-detailed-profit-total').text(dataContainer.total.profit.toLocaleString('en-US'));
    },
    INSRT_attackLogDetailed: function INSRT_attackLogDetailed(type, dataContainer) {
      var _ref23 = [
          $('#attacklog-tbody-detailed'),
          $('#attacklog-detailed-selector'),
          $('#collapse-attacklog-detailed table')[1],
          ['Attacked player (level)', 'Timestamp & position', 'Units lost', 'Units destroyed', 'Lootfactor', 'Loot', 'Profit']
        ],
        target = _ref23[0],
        select = _ref23[1],
        sortableTable = _ref23[2],
        dataTHs = _ref23[3];

      target.empty();

      if (select[0].children.length === 2) {
        $.each(dataContainer.validTargets, function(i, target) {
          select.append('<option value="' + target + '">' + target + '</option>');
        });
      }

      $.each(dataContainer.data, function(i, dataset) {
        target.append(rHelper.methods.CALC_attackLogDetailedDatasetIteration(i, dataset, dataTHs));
      });

      rHelper.methods.INSRT_attackLogDetailedGeneralInformation(dataContainer);

      ['last', 'next'].forEach(function(type) {
        rHelper.methods.CALC_attackLogDetailedPageButtonToggler(type, dataContainer);
      });

      sorttable.makeSortable(sortableTable);
    },
    INSRT_ADLogSimple: function INSRT_ADLogSimple(type, data) {
      var _ref24 = [
          $('#attacklog-tbody-simple'),
          ['Attacked player (last known level)', 'Last attacked', 'Total attacks', 'Win', 'Loss', 'Average loot factor', 'Average amount of units used', 'Profit'],
          [0, 2, 3],
          'text-md-right text-sm-left',
          $('#collapse-attacklog-simple table')[0]
        ],
        target = _ref24[0],
        dataTHs = _ref24[1],
        unitIndices = _ref24[2],
        textOrientation = _ref24[3],
        sortableTable = _ref24[4];

      if (type === 'defenseSimple') {
        dataTHs[0] = 'Attacking player (last known level)';
        sortableTable = $('#collapse-defenselog-simple table')[0];
        target = $('#defenselog-tbody-simple');
      }

      target.empty();

      $.each(data, function(i, dataset) {
        var _ref25 = [$(crEl('tr')), 'bg-success-25'],
          tr = _ref25[0],
          factorBgColorClass = _ref25[1];

        for (var index = 0; index <= 7; index += 1) {
          var _ref26 = [$(crEl('td')).attr('data-th', dataTHs[index]), 0, 0, 0, ''],
            td = _ref26[0],
            loss = _ref26[1],
            winPercent = _ref26[2],
            factor = _ref26[3],
            unitsContent = _ref26[4];

          switch (index) {
            case 0:
              td.text(dataset.targetName + ' (' + dataset.targetLevel + ')');
              break;
            case 1:
              td.text(rHelper.methods.CALC_convertDateToIso(dataset.lastAttacked));
              break;
            case 2:
              if (type === 'defenseSimple') {
                var amountOfWins = dataset.sumAttacks - dataset.sumWin;
                winPercent = (amountOfWins / dataset.sumAttacks * 100).toFixed(2);
              } else if (type === 'attackSimple') {
                winPercent = (dataset.sumWin / dataset.sumAttacks * 100).toFixed(2);
              }
              td.text(dataset.sumAttacks.toLocaleString('en-US') + ' (' + winPercent + '%)').addClass(textOrientation);
              break;
            case 3:
              if (type === 'defenseSimple') {
                loss = dataset.sumAttacks - dataset.sumWin;
                td.text(loss.toLocaleString('en-US')).addClass(textOrientation);
              } else if (type === 'attackSimple') {
                td.text(dataset.sumWin.toLocaleString('en-US')).addClass(textOrientation);
              }
              break;
            case 4:
              if (type === 'defenseSimple') {
                td.text(dataset.sumWin.toLocaleString('en-US')).addClass(textOrientation);
              } else if (type === 'attackSimple') {
                loss = dataset.sumAttacks - dataset.sumWin;
                td.text(loss.toLocaleString('en-US')).addClass(textOrientation);
              }
              break;
            case 5:
              if (dataset.factor < 1) {
                factorBgColorClass = 'bg-warning-25';
              }
              factor = (dataset.factor * 100).toFixed(2);
              td.text(factor + '%').addClass(textOrientation + ' ' + factorBgColorClass);
              break;
            case 6:
              for (var k = 0; k <= 2; k += 1) {
                var span = $(crEl('span'));
                span.addClass('resources-unit-' + unitIndices[k]);
                var unitAmount = dataset['unit' + k];
                if (unitAmount === null) {
                  unitAmount = 0;
                }
                unitsContent += span[0].outerHTML + ' ' + unitAmount.toLocaleString('en-US') + ' ';
              }

              td.html(unitsContent);
              break;
            case 7:
              var profit = dataset.profit;
              if (profit === null) {
                profit = 0;
              }

              var unitLossValue = dataset.unitLossValue;
              if (unitLossValue != null) {
                profit -= unitLossValue;
              }

              td.text(profit.toLocaleString('en-US')).addClass(textOrientation);
              break;
          }

          tr.addClass(rHelper.methods.CALC_attackLogSetTRColor(dataset.profit)).append(td);
        }

        target.append(tr);
      });

      sorttable.makeSortable(sortableTable);
    },
    INSRT_attackLog: function INSRT_attackLog(type) {
      var _ref27 = [rHelper.data.attackLog, fn],
        data = _ref27[0],
        fn = _ref27[1];

      switch (type) {
        case 'attackSimple':
        case 'defenseSimple':
          fn = 'INSRT_ADLogSimple';
          break;
        case 'attackDetailed':
          fn = 'INSRT_attackLogDetailed';
          break;
      }

      rHelper.methods[fn](type, data);
    },
    INSRT_materialData: function INSRT_materialData(materialId, api) {
      'use strict';

      var fns = ['INSRT_materialRate', 'INSRT_materialAmountOfMines', 'INSRT_materialNewMinePrice', 'INSRT_materialRateWorth', 'INSRT_materialNewMinePerfectIncome'];

      $.each(fns, function(i, fn) {
        rHelper.methods[fn](materialId);
      });

      if (api) {
        rHelper.methods.CALC_dependantFactories(materialId, 'material');
      }

      rHelper.methods.INSRT_flowRate(materialId, 'material');
    },
    INSRT_factoryDiamondData: function INSRT_factoryDiamondData(factoryId, type) {
      'use strict';

      var fns = [
        // factories tab
        'INSRT_factoryLevel',
        'INSRT_factoryOutput',
        'INSRT_factoryUpgradeCost',
        'INSRT_factoryDependencies',
        'INSRT_factoryWorkload',
        'INSRT_factoryTurnover',
        'INSRT_factoryTurnoverPerUpgrade',
        'INSRT_factoryROI',
        // diamond tab
        'INSRT_diamondFactoryOutput',
        'INSRT_diamondFactoryOutputWarehouse',
        'INSRT_diamondDependencies',
        'INSRT_diamondEfficiency',
        'INSRT_diamondProfit'
      ];

      $.each(fns, function(i, fn) {
        rHelper.methods[fn](factoryId);
      });

      rHelper.methods.INSRT_flowRate(factoryId, type);
    },
    INSRT_recycling: function INSRT_recycling(index) {
      'use strict';

      var fns = ['INSRT_recyclingRequirement', 'INSRT_recyclingProducts', 'INSRT_recyclingOutputWorth', 'INSRT_recyclingInputWorth'];

      $.each(fns, function(i, fn) {
        rHelper.methods[fn](index);
      });

      rHelper.methods.INSRT_unitsRecyclingProfit('recycling', index);
    },
    INSRT_warehouseData: function INSRT_warehouseData(index, type) {
      'use strict';

      var fns = ['INSRT_warehouseFillAmount', 'INSRT_warehouseLevel', 'INSRT_warehouseFillStatus', 'INSRT_warehouseCapacity', 'INSRT_warehouseWorth', 'EVNT_warehouseInput'];

      $.each(fns, function(i, fn) {
        rHelper.methods[fn](index, type);
      });

      if (type === 'products' || type === 'material') {
        rHelper.methods.INSRT_warehouseRemainingTimeToFull(index, type);
      }
    },
    INSRT_priceHistoryGraph: function INSRT_priceHistoryGraph(materialName, averageKI, averagePlayer, timestamps, player, ki) {
      'use strict';

      Highcharts.chart('graph-pricehistory', {
        chart: {
          type: 'spline',
          zoomType: 'x'
        },
        title: {
          useHTML: true,
          text: 'Price history for ' + materialName
        },
        subtitle: {
          text: 'last 28 days'
        },
        xAxis: {
          categories: timestamps
        },
        yAxis: {
          title: {
            text: 'Price'
          },
          labels: {
            formatter: function formatter() {
              return this.value.toLocaleString('en-US');
            }
          },
          plotLines: [
            {
              color: 'red',
              value: averageKI,
              width: '1',
              zIndex: 5,
              label: {
                text: 'average KI price of ' + averageKI.toLocaleString('en-US'),
                align: 'right',
                style: {
                  color: 'darkgreen'
                }
              }
            },
            {
              color: 'darkgreen',
              value: averagePlayer,
              width: '1',
              zIndex: 5,
              label: {
                text: 'average player price of ' + averagePlayer.toLocaleString('en-US'),
                align: 'right',
                style: {
                  color: 'orange'
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
              lineColor: '#666666',
              lineWidth: 1
            }
          }
        },
        series: [
          {
            name: 'KI',
            marker: {
              symbol: 'square'
            },
            color: 'darkgreen',
            data: ki
          },
          {
            name: 'Player',
            marker: {
              symbol: 'diamond'
            },
            color: 'orange',
            data: player
          }
        ],
        exporting: {
          chartOptions: {
            chart: {
              backgroundColor: '#5f473e'
            }
          }
        }
      });
    },
    INSRT_polygonGraph: function INSRT_polygonGraph(target, titleText, seriesNames, responsiveId, targetObj) {
      'use strict';

      var dataObj = rHelper.graphs[targetObj];

      Highcharts.chart(target, {
        chart: {
          type: 'pie',
          backgroundColor: 'transparent'
        },
        title: {
          text: titleText,
          style: {
            color: '#dedede'
          }
        },
        plotOptions: {
          pie: {
            shadow: false,
            center: ['50%', '50%']
          }
        },
        tooltip: {
          valueSuffix: '%'
        },
        series: [
          {
            name: seriesNames[0],
            data: dataObj.mineData,
            colors: dataObj.colors,
            size: '60%',
            dataLabels: {
              formatter: function formatter() {
                return this.y > 5 ? this.point.name : null;
              },
              color: '#dedede',
              distance: -30
            }
          },
          {
            name: seriesNames[1],
            data: dataObj.incomeData,
            colors: dataObj.colors,
            size: '80%',
            innerSize: '60%',
            dataLabels: {
              formatter: function formatter() {
                return this.y > 1 ? '<b> ' + this.point.name + ' :</b> ' + this.y + ' %' : null;
              },
              style: {
                color: 'white',
                textOutline: 'none'
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
        },
        exporting: {
          chartOptions: {
            chart: {
              backgroundColor: '#5f473e'
            }
          }
        }
      });
    },
    INSRT_gaugeGraph: function INSRT_gaugeGraph(type) {
      'use strict';

      if (type === 'buildings') {
        Highcharts.chart(
          'graph-buildings',
          Highcharts.merge(rHelper.graphs.gaugeOptions, {
            yAxis: {
              min: 0,
              max: rHelper.methods.CALC_perfectWorth('buildings'),
              title: {
                text: 'total building worth'
              }
            },
            series: [
              {
                name: 'total building worth',
                data: [rHelper.methods.CALC_totalBuildingErectionSum()]
              }
            ]
          })
        );
      } else if (type === 'headquarter') {
        Highcharts.chart(
          'graph-headquarter',
          Highcharts.merge(rHelper.graphs.gaugeOptions, {
            yAxis: {
              min: 0,
              max: rHelper.methods.CALC_perfectWorth('headquarter'),
              title: {
                text: 'total headquarter worth'
              }
            },
            series: [
              {
                name: 'total headquarter worth',
                data: [rHelper.methods.CALC_totalHeadquarterErectionSum()]
              }
            ]
          })
        );
      }
    },
    INSRT_totalMineWorth: function INSRT_totalMineWorth(totalMineWorth) {
      'use strict';

      $('#material-total-worth').text(totalMineWorth.toLocaleString('en-US'));
    },
    INSRT_totalMineCount: function INSRT_totalMineCount(totalMineCount) {
      'use strict';

      $('#material-total-mine-count').text(totalMineCount.toLocaleString('en-US'));
    },
    INSRT_materialRate: function INSRT_materialRate(materialId) {
      'use strict';

      $('#material-rate-' + materialId).val(rHelper.data.material[materialId].perHour);
    },
    INSRT_materialAmountOfMines: function INSRT_materialAmountOfMines(materialId) {
      'use strict';

      $('#material-amount-of-mines-' + materialId).val(rHelper.data.material[materialId].amountOfMines);
    },
    INSRT_userSettings: function INSRT_userSettings() {
      'use strict';

      var userInfo = rHelper.data.userInformation;
      $('#security-token').text(userInfo.securityToken);

      if (userInfo.realKey !== '' && _typeof(userInfo.realKey) !== undefined) {
        $('#api-key').val(userInfo.realKey);
        rHelper.methods.INSRT_API_remainingCredits(userInfo.remainingCredits);
      }

      if (userInfo.name != '') {
        $('#api-player-anonymity')[0].parentNode.remove();
      }

      $.each(rHelper.data.settings, function(index, setting) {
        var value = 0;
        switch (setting.setting) {
          case 'lang':
            switch (setting.value) {
              case 'de':
                value = 0;
                break;
              case 'en':
                value = 1;
                break;
              case 'fr':
                value = 2;
                break;
              case 'in':
                value = 3;
                break;
              case 'jp':
                value = 4;
                break;
              case 'ru':
                value = 5;
                break;
            }
            $('#settings-language').val(value);
            break;
          case 'customTU':
            for (var i = 0; i <= 3; i += 1) {
              $('#settings-custom-tu-' + (i + 1)).val(setting.value[i]);
            }
            break;
          case 'idealCondition':
            if (setting.value === 1) {
              $('#settings-ideal-conditions').prop('checked', true);
            }
            break;
          case 'transportCostInclusion':
            if (setting.value === 1) {
              $('#settings-toggle-transport-cost-inclusion').prop('checked', true);
            }
            break;
          case 'mapVisibleHQ':
            if (setting.value === 1) {
              $('#settings-hq-visibility').val(1);
            }
            break;
          case 'mineVisibilityWorldMap':
            if (setting.value === 1) {
              $('#settings-mine-visibility').val(1);
            }
            break;
          case 'priceAge':
            $('#settings-price-age').val(setting.value);
            break;
          case 'showNames':
            if (setting.value === 1) {
              $('#settings-show-names').prop('checked', true);
            }
            break;
          case 'queryPreset':
            var possibleSelectors = [1, 2, 3, 4, 5, 51, 6, 7, 9, 10];

            $.each(possibleSelectors, function(i, selector) {
              var input = $("input[data-query='" + selector + "']");
              var state = false;

              if (setting.value.indexOf(selector) !== -1) {
                state = true;
              }

              input.prop('checked', state);
            });
            break;
          case 'mayOverwriteAPI':
            if (setting.value === 1) {
              $('#settings-overwrite-api-container').remove();
            } else {
              $('#save-button').remove();
            }
            break;
        }
      });
    },
    INSRT_showNames: function INSRT_showNames() {
      if (rHelper.data.settings[6] && rHelper.data.settings[6].value === 1) {
        var iconSelectors = ['material', 'factories', 'product', 'loot', 'units'];

        $.each(iconSelectors, function(i, iconSelector) {
          $.each($('span[class*="resources-' + iconSelector + '-"]'), function(k, el) {
            var _ref28 = [$(el), new RegExp('resources-' + iconSelector + '-'), iconSelector],
              _el = _ref28[0],
              stringToBeReplaced = _ref28[1],
              targetArray = _ref28[2];

            var index = parseInt(_el.attr('class').replace(stringToBeReplaced, ''));

            if (iconSelector === 'factories' || iconSelector === 'product') {
              targetArray = 'products';
            }

            _el.after(' <strong class="text-muted">' + rHelper.data[targetArray][index].name + '</strong>');
          });
        });
      }
    },
    INSRT_materialNewMinePrice: function INSRT_materialNewMinePrice(materialId) {
      'use strict';

      $('#material-new-price-' + materialId).text(rHelper.methods.CALC_materialNewMinePrice(rHelper.methods.CALC_totalMineCount(), materialId).toLocaleString('en-US'));
    },
    INSRT_materialRateWorth: function INSRT_materialRateWorth(materialId) {
      'use strict';

      $('#material-worth-' + materialId).text(rHelper.methods.CALC_materialRateWorth(materialId).toLocaleString('en-US'));
    },
    INSRT_materialMineAmortisation: function INSRT_materialMineAmortisation() {
      'use strict';

      var ref = rHelper.methods;

      var _ref29 = [ref.CALC_materialMineROI('100'), ref.CALC_materialMineROI('505'), ref.CALC_materialMineROI('505hq')],
        roi100Array = _ref29[0],
        roi500Array = _ref29[1],
        roiXArray = _ref29[2];

      $.each(roi100Array, function(i, value) {
        $('#material-roi-100-' + i).text(value.toFixed(2).toLocaleString('en-US'));
      });
      $.each(roi500Array, function(i, value) {
        $('#material-roi-500-' + i).text(value.toFixed(2).toLocaleString('en-US'));
      });
      $.each(roiXArray, function(i, value) {
        $('#material-roi-x-' + i).text(value.toFixed(2).toLocaleString('en-US'));
      });

      rHelper.methods.INSRT_graphMineAmortisation(roi100Array, roi500Array, roiXArray);

      ref.INSRT_materialHighlightColumns(roi100Array, '#material-roi-100-', 'text-success', 'text-danger');
      ref.INSRT_materialHighlightColumns(roi500Array, '#material-roi-500-', 'text-success', 'text-danger');
      ref.INSRT_materialHighlightColumns(roiXArray, '#material-roi-x-', 'text-success', 'text-danger');
    },
    INSRT_graphMineAmortisation: function INSRT_graphMineAmortisation(roi100Array, roi500Array, roiXArray) {
      var categories = [];

      $.each(rHelper.data.material, function(i, el) {
        categories.push(el.name);
      });

      var arrs = [roi100Array, roi500Array, roiXArray];

      $.each(arrs, function(i, arr) {
        $.each(arr, function(k, val) {
          arrs[i][k] = Math.round(val);
        });
      });

      Highcharts.chart('graph-mine-amortisation', {
        chart: {
          type: 'bar',
          backgroundColor: 'transparent'
        },
        title: {
          text: 'Mine amortisation',
          style: {
            color: '#fff'
          }
        },
        xAxis: {
          categories: categories,
          title: {
            text: null
          },
          labels: {
            style: {
              color: '#fff'
            }
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Return on investment (days)',
            align: 'high'
          },
          labels: {
            overflow: 'justify',
            style: {
              color: '#fff'
            }
          }
        },
        tooltip: {
          valueSuffix: ' days'
        },
        plotOptions: {
          bar: {
            dataLabels: {
              enabled: true
            }
          }
        },
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'top',
          x: -40,
          y: 80,
          floating: true,
          borderWidth: 1,
          backgroundColor: '#FFFFFF'
        },
        series: [
          {
            name: '100%',
            data: roi100Array,
            visible: false,
            color: '#ff0000',
            pointFormat: '{point.y:.2f}'
          },
          {
            name: '505%',
            data: roi500Array,
            color: '#ff7f50',
            pointFormat: '{point.y:.2f}'
          },
          {
            name: '505% + your HQ level',
            data: roiXArray,
            visible: false,
            color: '#9acd32',
            pointFormat: '{point.y:.2f}'
          }
        ]
      });
    },
    INSRT_materialNewMinePerfectIncome: function INSRT_materialNewMinePerfectIncome(materialId) {
      'use strict';

      $('#material-perfect-income-' + materialId).text(rHelper.methods.CALC_materialMinePerfectIncome(materialId).toLocaleString('en-US'));
    },
    INSRT_materialHighlightMinePerfectIncome: function INSRT_materialHighlightMinePerfectIncome() {
      'use strict';

      var array = [];

      $.each(rHelper.data.material, function(materialId) {
        array.push(rHelper.methods.CALC_materialMinePerfectIncome(materialId));
      });

      rHelper.methods.INSRT_materialHighlightColumns(array, '#material-perfect-income-', 'text-danger', 'text-success');
    },
    INSRT_materialHighlightColumns: function INSRT_materialHighlightColumns(array, target, minClass, maxClass) {
      'use strict';

      var _ref30 = [['min', 'max'], 0, ,],
        selectors = _ref30[0],
        value = _ref30[1],
        addClass = _ref30[2],
        rmvClass = _ref30[3];

      $.each(selectors, function(i, selector) {
        switch (selector) {
          case 'min':
            value = array.min();
            addClass = minClass;
            rmvClass = maxClass;
            break;
          case 'max':
            value = array.max();
            addClass = maxClass;
            rmvClass = minClass;
            break;
        }

        var el = $(target + array.indexOf(value));
        el.removeClass(rmvClass).addClass(addClass);
      });
    },
    INSRT_factoryLevel: function INSRT_factoryLevel(factoryId) {
      'use strict';

      var factoryLevel = rHelper.data.products[factoryId].factoryLevel;
      $('#factories-level-' + factoryId).val(factoryLevel);
      $('#diamond-level-' + factoryId).text(factoryLevel);
    },
    INSRT_factoryOutput: function INSRT_factoryOutput(factoryId) {
      'use strict';

      $('#factories-product-' + factoryId).text(rHelper.methods.CALC_factoryOutput(factoryId).toLocaleString('en-US'));
    },
    INSRT_factoryUpgradeCost: function INSRT_factoryUpgradeCost(factoryId) {
      'use strict';

      var target = $('#factories-upgrade-cost-' + factoryId);
      var calculateFactoryUpgradeCostObj = rHelper.methods.CALC_factoryUpgradeCost(factoryId);

      target.text(calculateFactoryUpgradeCostObj.sum.toLocaleString('en-US'));
      target.attr('title', calculateFactoryUpgradeCostObj.title);
      applyTippyOnNewElement(target);
    },
    INSRT_totalFactoryUpgrades: function INSRT_totalFactoryUpgrades() {
      'use strict';

      $('#factories-total-upgrades').text(rHelper.methods.CALC_totalFactoryUpgrades().toLocaleString('en-US'));
    },
    INSRT_factoryDependencies: function INSRT_factoryDependencies(factoryId) {
      'use strict';

      var ref = rHelper.methods;

      var product = rHelper.data.products[factoryId];
      var dependencies = product.dependencies;
      var dependencyString = '';

      if ($.isArray(dependencies)) {
        $.each(dependencies, function(dependencyIndex, dependency) {
          var _ref31 = [
              ref.CALC_convertId(dependency),
              $(crEl('span')),
              $(crEl('span')),
              $(crEl('span')),
              ref.CALC_returnPriceViaId(dependency).toLocaleString('en-US'),
              ref.CALC_factoryDependencyRequiredAmount(factoryId, dependencyIndex)
            ],
            dependantObj = _ref31[0],
            outerSpan = _ref31[1],
            imgSpan = _ref31[2],
            innerSpan = _ref31[3],
            price = _ref31[4],
            requiredAmount = _ref31[5];

          var existingAmount = ref.CALC_factoryDependencyExistingAmount(dependantObj, dependencyIndex);
          var addClass = ref.CALC_factoryComparatorRequiredVsExistingAmount(requiredAmount, existingAmount);

          imgSpan.addClass(dependantObj.icon).attr('title', price.toLocaleString('en-US'));
          innerSpan.addClass(addClass).text(requiredAmount.toLocaleString('en-US'));
          outerSpan.append(imgSpan[0].outerHTML + ' ' + innerSpan[0].outerHTML + ' ');
          dependencyString += outerSpan[0].outerHTML;
        });
      } else {
        var _ref32 = [
            ref.CALC_convertId(dependencies),
            $(crEl('span')),
            $(crEl('span')),
            $(crEl('span')),
            ref.CALC_returnPriceViaId(dependencies).toLocaleString('en-US'),
            ref.CALC_factoryDependencyRequiredAmount(factoryId, 0)
          ],
          dependantObj = _ref32[0],
          outerSpan = _ref32[1],
          imgSpan = _ref32[2],
          innerSpan = _ref32[3],
          price = _ref32[4],
          requiredAmount = _ref32[5];

        var existingAmount = ref.CALC_factoryDependencyExistingAmount(dependantObj, 0);
        var addClass = ref.CALC_factoryComparatorRequiredVsExistingAmount(requiredAmount, existingAmount);

        imgSpan.addClass(dependantObj.icon).attr('title', price.toLocaleString('en-US'));
        innerSpan.addClass(addClass).text(requiredAmount.toLocaleString('en-US'));
        outerSpan.append(imgSpan[0].outerHTML + ' ' + innerSpan[0].outerHTML + ' ');
        dependencyString += outerSpan[0].outerHTML;
      }
      $('#factories-dependencies-' + factoryId).html(dependencyString);
    },
    INSRT_factoryAmortisation: function INSRT_factoryAmortisation(factoryId) {
      'use strict';

      var _ref33 = ['#factories-roi-' + factoryId, rHelper.methods.CALC_factoryAmortisation(factoryId)],
        target = _ref33[0],
        amortisation = _ref33[1];

      if (amortisation < 0 || amortisation === Infinity) {
        amortisation = '∞';
      } else {
        amortisation = amortisation.toFixed(2);
      }

      $(target).text(amortisation);
    },
    INSRT_factoryWorkload: function INSRT_factoryWorkload(factoryId) {
      'use strict';

      var _ref34 = [$('#factories-workload-' + factoryId), rHelper.data.products[factoryId].dependencies],
        target = _ref34[0],
        dependencies = _ref34[1];

      rHelper.data.products[factoryId].dependencyWorkload = [];

      if ($.isArray(dependencies)) {
        $.each(dependencies, function(dependencyIndex) {
          var dependencyWorkload = rHelper.methods.CALC_factoryDepedencyWorkload(factoryId, dependencyIndex);
          rHelper.data.products[factoryId].dependencyWorkload.push(dependencyWorkload);
        });
      } else {
        var dependencyWorkload = rHelper.methods.CALC_factoryDepedencyWorkload(factoryId, 0);
        rHelper.data.products[factoryId].dependencyWorkload.push(dependencyWorkload);
      }

      var _ref35 = [rHelper.methods.CALC_factoryWorkloadMinNonSanitized(factoryId), ,],
        workload = _ref35[0],
        removeClass = _ref35[1],
        addClass = _ref35[2];

      if (workload >= 1) {
        removeClass = 'text-danger';
        addClass = 'text-success';
      } else {
        removeClass = 'text-success';
        addClass = 'text-danger';
      }

      var theoreticalFactoryLevelCap = rHelper.methods.CALC_theoreticalFactoryLevelCap(factoryId, workload);

      target
        .removeClass(removeClass)
        .addClass(addClass)
        .text((workload * 100).toFixed(2) + ' %')
        .prop('title', 'Can be upgraded up to level <strong>' + theoreticalFactoryLevelCap.toLocaleString('en-US') + '</strong>');
    },
    INSRT_factoryTurnover: function INSRT_factoryTurnover(factoryId) {
      'use strict';

      var _ref36 = [$('#factories-turnover-' + factoryId), rHelper.methods.CALC_factoryTurnover(factoryId), ,],
        target = _ref36[0],
        turnover = _ref36[1],
        removeClass = _ref36[2],
        addClass = _ref36[3];

      if (turnover <= 0) {
        removeClass = 'text-success';
        addClass = 'text-danger';
      } else {
        removeClass = 'text-danger';
        addClass = 'text-success';
      }
      rHelper.data.products[factoryId].turnover = turnover;
      target
        .removeClass(removeClass)
        .addClass(addClass)
        .text(turnover.toLocaleString('en-US'));
    },
    INSRT_factoryHighlightColumns: function INSRT_factoryHighlightColumns() {
      'use strict';

      var subArray,
        columns = ['#factories-upgrade-cost-', '#factories-increase-per-upgrade-', '#factories-roi-', '#diamond-profit-'];

      $.each(columns, function(i, column) {
        switch (i) {
          case 0:
            subArray = 'upgradeCost';
            break;
          case 1:
            subArray = 'turnoverIncrease';
            break;
          case 2:
            subArray = 'roi';
            break;
          case 3:
            subArray = [];
            break;
        }

        var valueArray = [],
          idArray = [];

        $.each(rHelper.data.products, function(k, factory) {
          $(column + k).removeClass('text-success text-danger');
          var value = 0;
          if ((typeof subArray === 'undefined' ? 'undefined' : _typeof(subArray)) === 'object') {
            value = factory.diamond.profit;
          } else {
            value = factory[subArray];
          }
          if (rHelper.data.products[k].turnover > 0 && value !== -Infinity && value !== Infinity && value > 0) {
            valueArray.push(value);
            idArray.push(k);
          }
        });

        /*
        arrayMin/Max = search within idArray for the same index thats min/max of the value array
        */

        var _ref37 = [idArray[valueArray.indexOf(valueArray.min())], idArray[valueArray.indexOf(valueArray.max())]],
          arrayMin = _ref37[0],
          arrayMax = _ref37[1];

        switch (i) {
          case 0:
          case 2:
            $(column + arrayMin).addClass('text-success');
            if (arrayMin != arrayMax) {
              $(column + arrayMax).addClass('text-danger');
            }
            break;
          case 1:
          case 3:
            $(column + arrayMax).addClass('text-success');
            if (arrayMin != arrayMax) {
              $(column + arrayMin).addClass('text-danger');
            }
            break;
        }
      });
    },
    INSRT_factoryROI: function INSRT_factoryROI(factoryId) {
      'use strict';

      var _ref38 = [$('#factories-roi-' + factoryId), rHelper.methods.CALC_factoryROI(factoryId)],
        target = _ref38[0],
        roi = _ref38[1];

      rHelper.data.products[factoryId].roi = roi;

      if (roi < 0 || roi === Infinity) {
        roi = '∞';
      } else {
        roi = roi.toFixed(2);
      }

      target.text(roi.toLocaleString('en-US'));
    },
    INSRT_factoryTurnoverPerUpgrade: function INSRT_factoryTurnoverPerUpgrade(factoryId) {
      'use strict';

      var _ref39 = [$('#factories-increase-per-upgrade-' + factoryId), rHelper.methods.CALC_factoryTurnoverPerUpgrade(factoryId)],
        target = _ref39[0],
        turnoverPerUpgrade = _ref39[1];

      rHelper.data.products[factoryId].turnoverIncrease = turnoverPerUpgrade;
      target.text(turnoverPerUpgrade.toLocaleString('en-US'));
    },
    INSRT_API_remainingCredits: function INSRT_API_remainingCredits(value) {
      'use strict';

      if (value) {
        $('#api-credits').text(value.toLocaleString('en-US') + ' Credits left');
      }
    },
    INSRT_diamondFactoryOutput: function INSRT_diamondFactoryOutput(factoryId) {
      'use strict';

      $('#diamond-product-' + factoryId).text(rHelper.methods.CALC_diamondFactoryOutput(factoryId).toLocaleString('en-US'));
    },
    INSRT_diamondFactoryOutputWarehouse: function INSRT_diamondFactoryOutputWarehouse(factoryId) {
      'use strict';

      var diamondFactoryOutput = rHelper.methods.CALC_diamondFactoryOutput(factoryId);
      var requiredWarehouseLevel = rHelper.methods.CALC_nextGreaterWarehouseLevel(diamondFactoryOutput);

      $('#diamond-product-warehouse-' + factoryId).text(requiredWarehouseLevel.toLocaleString('en-US'));
    },
    INSRT_diamondDependenciesHelper: function INSRT_diamondDependenciesHelper(dependantObj, price, requiredAmount, factoryId, warehouseIconSpan) {
      'use strict';

      var requiredWarehouseLevel = rHelper.methods.CALC_nextGreaterWarehouseLevel(requiredAmount);
      rHelper.data.products[factoryId].diamond.dependenciesWorth += price * requiredAmount;

      var imgSpan = $(crEl('span'))
        .addClass(dependantObj.icon)
        .attr('title', price.toLocaleString('en-US'));
      var innerSpan = $(crEl('span')).text(requiredAmount.toLocaleString('en-US'));
      var warehouseSamp = $(crEl('span')).text(requiredWarehouseLevel);
      var kbd = $(crEl('kbd')).append(warehouseIconSpan[0].outerHTML + ' ' + warehouseSamp[0].outerHTML);

      var outerSpan = $(crEl('span')).append(imgSpan[0].outerHTML + ' ' + innerSpan[0].outerHTML + ' ' + kbd[0].outerHTML + ' ');

      return outerSpan[0].outerHTML;
    },
    INSRT_diamondDependencies: function INSRT_diamondDependencies(factoryId) {
      'use strict';

      var product = rHelper.data.products[factoryId];

      var _ref40 = [product.dependencies, '', $(crEl('span')).addClass('nav-icon-warehouses')],
        dependencies = _ref40[0],
        dependencyString = _ref40[1],
        warehouseIconSpan = _ref40[2];

      if ($.isArray(dependencies)) {
        $.each(dependencies, function(dependencyIndex, dependency) {
          var _ref41 = [
              rHelper.methods.CALC_convertId(dependency),
              rHelper.methods.CALC_returnPriceViaId(dependency),
              rHelper.methods.CALC_factoryDependencyRequiredAmount(factoryId, dependencyIndex) * 5 * 24
            ],
            dependantObj = _ref41[0],
            price = _ref41[1],
            requiredAmount = _ref41[2];

          dependencyString += rHelper.methods.INSRT_diamondDependenciesHelper(dependantObj, price, requiredAmount, factoryId, warehouseIconSpan);
        });
      } else {
        var _ref42 = [rHelper.methods.CALC_convertId(dependencies), rHelper.methods.CALC_returnPriceViaId(dependencies), rHelper.methods.CALC_factoryDependencyRequiredAmount(factoryId, 0) * 5 * 24],
          dependantObj = _ref42[0],
          price = _ref42[1],
          requiredAmount = _ref42[2];

        dependencyString += rHelper.methods.INSRT_diamondDependenciesHelper(dependantObj, price, requiredAmount, factoryId, warehouseIconSpan);
      }

      $('#diamond-dependencies-' + factoryId).html(dependencyString);
    },
    INSRT_diamondEfficiency: function INSRT_diamondEfficiency(factoryId) {
      'use strict';

      $('#diamond-efficiency-' + factoryId).text((rHelper.methods.CALC_diamondEfficiency(factoryId) * 100).toFixed(2).toLocaleString('en-US') + '%');
    },
    INSRT_diamondProfit: function INSRT_diamondProfit(factoryId) {
      'use strict';

      $('#diamond-profit-' + factoryId).text(rHelper.methods.CALC_diamondProfit(factoryId).toLocaleString('en-US'));
    },
    INSRT_diamondFactoryLevel: function INSRT_diamondFactoryLevel(factoryId) {
      'use strict';

      $('#diamond-level-' + factoryId).text(rHelper.data.products[factoryId].factoryLevel);
    },
    INSRT_diamondTop10Profit: function INSRT_diamondTop10Profit() {
      'use strict';

      var top10Profit = rHelper.methods.CALC_diamondTop10Profit().toLocaleString('en-US');
      $('#diamond-top-10').text(top10Profit);
    },
    INSRT_diamondTotalProfit: function INSRT_diamondTotalProfit() {
      'use strict';

      var totalProfit = rHelper.methods.CALC_diamondTotalProfit().toLocaleString('en-US');
      $('#diamond-total').text(totalProfit);
    },
    INSRT_flowRate: function INSRT_flowRate(id, type) {
      'use strict';

      var _ref43 = [$('#flow-' + type + '-rate-' + id), rHelper.methods.CALC_flowRate(id, type)],
        target = _ref43[0],
        rate = _ref43[1];

      if (type === 'product') {
        if (rHelper.data.products[id].turnover < 0) {
          rate = 0;
        }
      }

      target.text(rate.toLocaleString('en-US'));
    },
    INSRT_flowDistributionGlobal: function INSRT_flowDistributionGlobal() {
      'use strict';

      var materialTotal = 0,
        productsTotal = 0,
        materialColor = 'yellowgreen',
        productColor = 'yellowgreen';

      $.each(rHelper.data.material, function(materialId) {
        materialTotal += rHelper.methods.INSRT_flowDistributionSingle(materialId, 'material');
      });

      var calculationOrder = rHelper.methods.GET_calculationOrder();

      $.each(calculationOrder, function(index, factoryId) {
        productsTotal += rHelper.methods.INSRT_flowDistributionSingle(factoryId, 'product');
      });

      if (materialTotal < 0) {
        materialColor = 'coral';
      }
      if (productsTotal < 0) {
        productColor = 'coral';
      }

      rHelper.data.material.totalIncomePerHour = materialTotal;
      rHelper.data.products.totalIncomePerHour = productsTotal;

      $('#flow-material-total')
        .text(materialTotal.toLocaleString('en-US'))
        .css('color', materialColor);
      $('#flow-products-total')
        .text(productsTotal.toLocaleString('en-US'))
        .css('color', productColor);
      $('#effective-hourly-income').text((materialTotal + productsTotal).toLocaleString('en-US'));
    },
    INSRT_flowSurplus: function INSRT_flowSurplus(id, type, remainingAmount) {
      'use strict';

      var surplusTarget = $('#flow-' + type + '-surplus-' + id);
      var color = '#dedede';
      if (remainingAmount <= 0) {
        color = 'coral';
      }
      surplusTarget.css('color', color);
      surplusTarget.html('<span class="resources-' + type + '-' + id + '"></span> ' + remainingAmount.toLocaleString('en-US'));
    },
    INSRT_flowDistributionSingle: function INSRT_flowDistributionSingle(id, type) {
      'use strict';

      var _ref44 = [$('#flow-' + type + '-worth-' + id), 0, 0, 'yellowgreen', 0, rHelper.methods.CALC_flowDistribution(id, type)],
        worthTarget = _ref44[0],
        price = _ref44[1],
        worth = _ref44[2],
        color = _ref44[3],
        productionCost = _ref44[4],
        remainingAmount = _ref44[5];

      switch (type) {
        case 'material':
          price = rHelper.methods.CALC_returnPriceViaId(id);
          break;
        case 'product':
          price = rHelper.methods.CALC_returnPriceViaId(id + 14);
          break;
      }

      if (type === 'product') {
        if (rHelper.data.products[id].turnover < 0) {
          remainingAmount *= -1;
          if (rHelper.data.products[id].dependantFactories === '') {
            remainingAmount = 0;
          }
        } else {
          productionCost = rHelper.methods.CALC_factoryCashCostPerHour(id);
        }
      }

      worth = remainingAmount * price;
      if (remainingAmount < 0) {
        worth *= rHelper.data.buildings[9].transportCost;
        color = 'coral';
      }

      worth = Math.round(worth - productionCost);
      switch (type) {
        case 'material':
          rHelper.data.material[id].effectiveTurnover = worth;
          break;
        case 'product':
          rHelper.data.products[id].effectiveTurnover = worth;
          break;
      }

      worthTarget.css('color', color).text(worth.toLocaleString('en-US'));
      rHelper.methods.INSRT_flowSurplus(id, type, remainingAmount);
      return worth;
    },
    INSRT_warehouseFillAmount: function INSRT_warehouseFillAmount(id, type) {
      'use strict';

      $('#warehouse-' + type + '-stock-current-' + id).val(rHelper.data[type][id].warehouse.fillAmount);
    },
    INSRT_warehouseLevel: function INSRT_warehouseLevel(id, type) {
      'use strict';

      var warehouseLevel = rHelper.data[type][id].warehouse.level;
      $('#warehouse-' + type + '-level-' + id).val(warehouseLevel);
      $('#warehouse-' + type + '-stock-current-' + id).attr('max', rHelper.methods.CALC_warehouseContingent(warehouseLevel));
    },
    INSRT_warehouseFillStatus: function INSRT_warehouseFillStatus(id, type) {
      'use strict';

      var target = $('#warehouse-' + type + '-fill-percent-' + id);
      var percent = (rHelper.data[type][id].warehouse.fillStatus * 100).toFixed(2);
      var color = 'rgb(255, 38, 41)';

      if (percent < 75) {
        color = 'rgb(70, 252, 6)';
      } else if (percent >= 75 && percent < 90) {
        color = 'rgb(255, 252, 38)';
      } else if (percent >= 90 && percent < 95) {
        color = 'rgb(255, 155, 38)';
      }

      target.text(percent).css('color', color);
    },
    INSRT_warehouseCapacity: function INSRT_warehouseCapacity(id, type) {
      'use strict';

      $('#warehouse-' + type + '-stock-cap-' + id).text(rHelper.data[type][id].warehouse.contingent.toLocaleString('en-US'));
    },
    INSRT_warehouseWorth: function INSRT_warehouseWorth(id, type) {
      'use strict';

      var price = rHelper.methods.CALC_warehouseWorth(id, type);
      var worth = price * rHelper.data[type][id].warehouse.fillAmount;
      $('#warehouse-' + type + '-worth-' + id).text(worth.toLocaleString('en-US'));
    },
    INSRT_warehouseTotalWorth: function INSRT_warehouseTotalWorth() {
      'use strict';

      var warehouseTotalWorth = rHelper.methods.CALC_warehouseTotalWorth();
      $('#warehouse-total-worth').text(warehouseTotalWorth.toLocaleString('en-US'));
    },
    INSRT_warehouseTotalLevel: function INSRT_warehouseTotalLevel() {
      'use strict';

      var warehouseTotalLevel = rHelper.methods.CALC_warehouseTotalLevel();
      $('#warehouse-total-level').text(warehouseTotalLevel.toLocaleString('en-US'));
    },
    INSRT_warehouseRemainingTimeToFull: function INSRT_warehouseRemainingTimeToFull(id, type) {
      'use strict';

      var remainingTime = rHelper.methods.CALC_warehouseRemainingTimeToFull(id, type);
      $('#warehouse-' + type + '-remaining-' + id).text(remainingTime);
    },
    INSRT_warehouseUpgradeCost: function INSRT_warehouseUpgradeCost(id, type, value) {
      'use strict';

      var target = $('#warehouse-' + type + '-upgrade-cost-' + id);
      var upgradeCost = rHelper.methods.CALC_warehouseUpgradeCostOnInput(id, type, value);
      target.text(upgradeCost.toLocaleString('en-US'));
    },
    INSRT_buildingName: function INSRT_buildingName(buildingId) {
      'use strict';

      $('#buildings-name-' + buildingId).text(rHelper.data.buildings[buildingId].name);
    },
    INSRT_buildingData: function INSRT_buildingData(buildingId) {
      'use strict';

      var building = rHelper.data.buildings[buildingId];
      var buildingLevel = building.level;
      var dropdown = $('#buildings-level-' + buildingId);

      if (parseInt(dropdown.val()) != buildingLevel) {
        $(dropdown[0][buildingLevel]).attr('selected', 'true');
      }

      var materialWorthSum = 0;
      var materialTransportationSum = 0;

      if (buildingLevel != 10) {
        rHelper.methods.SET_buildingTableVisibility(buildingId, 'show');

        for (var i = 0; i <= 3; i += 1) {
          if (i === 0) {
            var _ref45 = [$('#buildings-cash-' + buildingId), building.materialAmount0[buildingLevel]],
              cashTarget = _ref45[0],
              cash = _ref45[1];

            if (typeof cash === 'undefined') {
              cash = 0;
            }
            materialWorthSum += cash;
            cashTarget.text(cash.toLocaleString('en-US'));
          } else {
            var _ref46 = ['materialAmount' + i, rHelper.methods.CALC_convertId(building.material[i])],
              selector = _ref46[0],
              material = _ref46[1];

            $('#buildings-mat-' + i + '-' + buildingId).addClass(material.icon);
            var materialAmount = building[selector][buildingLevel];

            if (typeof materialAmount === 'number') {
              $('#buildings-amount-' + i + '-' + buildingId).text(materialAmount.toLocaleString('en-US'));
              var materialPrice = rHelper.methods.CALC_returnPriceViaId(building.material[i]);
              var materialWorth = materialPrice * materialAmount;
              var transportation = (rHelper.data.buildings[9].transportCost - 1) * materialWorth;

              materialWorthSum += materialWorth;
              materialTransportationSum += transportation;
              $('#buildings-worth-' + i + '-' + buildingId).text(materialWorth.toLocaleString('en-US'));
              $('#buildings-transportation-' + i + '-' + buildingId).text(transportation.toLocaleString('en-US'));
            }
          }
        }
      } else {
        rHelper.methods.SET_buildingTableVisibility(buildingId, 'hide');
      }

      $('#buildings-sum-' + buildingId).text(materialWorthSum.toLocaleString('en-US'));
      $('#buildings-transportation-sum-' + buildingId).text(Math.round(materialTransportationSum).toLocaleString('en-US'));
    },
    INSRT_buildingToLevel10: function INSRT_buildingToLevel10(buildingId) {
      'use strict';

      var buildingToLevel10 = rHelper.methods.CALC_buildingToLevel10(buildingId);
      $('#buildings-cap-' + buildingId).text(buildingToLevel10.level10Cost.toLocaleString('en-US'));
      $('#buildings-transportation-cap-' + buildingId).text(buildingToLevel10.level10Transportation.toLocaleString('en-US'));
    },
    INSRT_techUpgradeRows: function INSRT_techUpgradeRows(tu4Trigger) {
      'use strict';

      var iterateTUData = function iterateTUData() {
        $.each(rHelper.tu, function(index, combination) {
          if (typeof tu4Trigger === 'undefined' && combination.tu4 != 0) {
            return;
          }
          var tr = $(crEl('tr'));
          for (var i = 0; i <= 6; i += 1) {
            var td = $(crEl('td'));
            td.addClass('text-md-right text-sm-left');
            var tus = [combination.tu1, combination.tu2, combination.tu3, combination.tu4];
            switch (i) {
              case 0:
              case 1:
              case 2:
              case 3:
                td.text(tus[i]).attr('data-th', 'Tech-Upgrade ' + (i + 1));
                break;
              case 4:
                td.text(combination.factor).attr('data-th', 'Boost');
                break;
              case 5:
                var price = 0;
                for (var k = 0; k < tus.length; k += 1) {
                  price += tus[k] * prices[k];
                }
                td.text(price.toLocaleString('en-US')).attr('data-th', 'Price');
                break;
              case 6:
                var count = tus[0] * 1 + tus[1] * 2 + tus[2] * 3 + tus[3] * 5;
                td.text(count).attr('data-th', 'Pimp my mine count');
                break;
            }
            tr.append(td[0]);
          }
          techUpgradeTbody.append(tr[0]);
        });
      };

      var techUpgradeTbody = $('#techupgrades-combinations-tbl tbody');
      if (techUpgradeTbody[0].childNodes.length > 0) {
        techUpgradeTbody.empty();
      }

      var prices = [];

      for (var i = 46; i <= 49; i += 1) {
        prices.push(rHelper.methods.CALC_returnPriceViaId(i, 0));
      }

      if (rHelper.tu.length === 0) {
        $.getJSON('api/tu.json', function(data) {
          rHelper.tu = data;
          iterateTUData();
        });
      } else {
        iterateTUData();
      }
    },
    INSRT_techUpgradeCalculator: function INSRT_techUpgradeCalculator(value, tu4Inclusion) {
      'use strict';

      toggleTechUpgradeInfo('start');
      var table = $('#techupgrades-calc-tbl');

      if (table.css('display') === 'none') {
        table.css('display', 'table');
      }

      var target = $('#techupgrades-calc-tbl tbody');
      target.empty();

      var url = 'api/getTechCombination.php?factor=' + value;
      if (typeof tu4Inclusion === 'string') {
        url += '&tu4=allowed';
      }

      $.getJSON(url, function(data) {
        var prices = [];
        for (var i = 46; i <= 49; i += 1) {
          prices.push(rHelper.methods.CALC_returnPriceViaId(i, 0));
        }

        $.each(data, function(i, combination) {
          var tr = $(crEl('tr'));
          for (var k = 0; k <= 6; k += 1) {
            var td = $(crEl('td'));

            td.addClass('text-md-right text-sm-left');
            td.attr('data-th', 'missing Tech-Upgrade ' + (k + 1));

            var tus = [combination.tu1, combination.tu2, combination.tu3, combination.tu4];

            switch (k) {
              case 0:
              case 1:
              case 2:
              case 3:
                td.text(tus[k]);
                break;
              case 4:
                td.text(combination.factor).attr('data-th', 'resulting Boost');
                break;
              case 5:
                var price = 0;
                for (var l = 0; l < tus.length; l += 1) {
                  price += tus[l] * prices[l];
                }
                td.text(price.toLocaleString('en-US')).attr('data-th', 'Price');
                break;
              case 6:
                var count = tus[0] * 1 + tus[1] * 2 + tus[2] * 3 + tus[3] * 5;
                td.text(count).attr('data-th', 'remaining Pimp my mine count');
                break;
            }
            tr.append(td);
          }
          target.append(tr);
        });

        sorttable.makeSortable(table[0]);
        sorttable.innerSortFunction.apply($('#techupgrades-calc-tbl th')[5], []);
        sorttable.innerSortFunction.apply($('#techupgrades-calc-tbl th')[5], []);
        toggleTechUpgradeInfo('end');
      }).fail(function() {
        var tr = $(crEl('tr'));
        var td = $(crEl('td'));
        td
          .addClass('text-warning text-center')
          .attr('data-th', 'Attention')
          .attr('colspan', 7)
          .text('No entries found or invalid value. Try to lower the value a bit – up to 5 decimals are allowed (e.g. 3.00005).');
        tr.append(td);
        target.append(tr);
        toggleTechUpgradeInfo('end');
      });
    },
    INSRT_recyclingRequirement: function INSRT_recyclingRequirement(lootId) {
      'use strict';

      $('#recycling-requirement-' + lootId).text(rHelper.methods.CALC_recyclingRequirement(lootId).toLocaleString('en-US'));
    },
    INSRT_recyclingProducts: function INSRT_recyclingProducts(lootId) {
      'use strict';

      var recyclingPlantLevel = rHelper.data.buildings[5].level;
      var recyclingProducts = rHelper.methods.CALC_recyclingProducts(lootId, recyclingPlantLevel);
      $('#recycling-products-' + lootId).html(recyclingProducts);
    },
    INSRT_recyclingOutputWorth: function INSRT_recyclingOutputWorth(lootId) {
      'use strict';

      var recyclingPlantLevel = rHelper.data.buildings[5].level;
      $('#recycling-output-' + lootId).text(rHelper.methods.CALC_recyclingOutputWorth(lootId, recyclingPlantLevel).toLocaleString('en-US'));
    },
    INSRT_recyclingInputWorth: function INSRT_recyclingInputWorth(lootId) {
      'use strict';

      $('#recycling-input-' + lootId).text(rHelper.methods.CALC_recyclingInputWorth(lootId).toLocaleString('en-US'));
    },
    INSRT_unitsRecyclingProfit: function INSRT_unitsRecyclingProfit(type, id) {
      'use strict';

      var _ref47 = [$('#' + type + '-profit-' + id), 0, ,],
        target = _ref47[0],
        profit = _ref47[1],
        result = _ref47[2],
        color = _ref47[3];

      if (type === 'recycling') {
        profit = rHelper.methods.CALC_recyclingProfit(id);
      } else if (type === 'units') {
        profit = rHelper.methods.CALC_unitsProfit(id);
      }

      if (profit > 0) {
        color = '#9acd3225';
      } else {
        color = '#ff7f5025';
      }

      $(target[0].parentNode).css('background-color', color);

      result = profit.toFixed(2).toLocaleString('en-US') + '%';
      target.text(result);
    },
    INSRT_unitsCraftingPrice: function INSRT_unitsCraftingPrice(unitId) {
      'use strict';

      $('#units-crafting-' + unitId).text(rHelper.methods.CALC_unitsCraftingPrice(unitId).toLocaleString('en-US'));
    },
    INSRT_unitsPricePerStrength: function INSRT_unitsPricePerStrength(unitId) {
      'use strict';

      $('#units-pps-' + unitId).text(rHelper.methods.CALC_unitsPricePerStrength(unitId).toLocaleString('en-US'));
    },
    INSRT_unitsMarketPrice: function INSRT_unitsMarketPrice(unitId) {
      'use strict';

      var convertedId = unitId + 52;
      var marketPrice = rHelper.methods.CALC_returnPriceViaId(convertedId);
      rHelper.data.units[unitId].profit.marketPrice = marketPrice;

      $('#units-market-' + unitId).text(marketPrice.toLocaleString('en-US'));
    },
    INSRT_companyWorth: function INSRT_companyWorth() {
      'use strict';

      var companyWorth = rHelper.methods.CALC_companyWorth();
      $('#company-worth').text(companyWorth.toLocaleString('en-US'));
    },
    INSRT_headquarterOvwTransportation: function INSRT_headquarterOvwTransportation(level) {
      'use strict';

      var hqLevel = rHelper.data.headquarter[level];
      if ($.isArray(hqLevel.material)) {
        var hqCost = rHelper.methods.CALC_headquarterLevelCost(level);
        var transportation = Math.round(hqCost * (rHelper.data.buildings[9].transportCost - 1));
        $('#hq-ovw-transportation-' + level).text(transportation.toLocaleString('en-US'));
      }
    },
    INSRT_headquarterOvwCost: function INSRT_headquarterOvwCost(level) {
      'use strict';

      var hqCost = rHelper.methods.CALC_headquarterLevelCost(level);
      $('#hq-ovw-sum-' + level).text(hqCost.toLocaleString('en-US'));
    },
    INSRT_headquarterOvwRadius: function INSRT_headquarterOvwRadius(level) {
      'use strict';

      var hqLevel = rHelper.data.headquarter[level];
      $('#hq-ovw-radius-' + level).text(hqLevel.radius + ' m | ' + rHelper.methods.CALC_convertMeterToYards(hqLevel.radius) + ' yards');
    },
    INSRT_headquarterOvwBoost: function INSRT_headquarterOvwBoost(level) {
      'use strict';

      var hqLevel = rHelper.data.headquarter[level];
      $('#hq-ovw-boost-' + level).text(hqLevel.boost);
    },
    INSRT_headquarterOvwString: function INSRT_headquarterOvwString(level) {
      'use strict';

      var hqLevel = rHelper.data.headquarter[level];

      if ($.isArray(hqLevel.material)) {
        var string = rHelper.methods.CALC_headquarterOvwMaterial(level) + ' x ' + hqLevel.amount.toLocaleString('en-US');
        $('#hq-ovw-mat-' + level).html(string);
      }
    },
    INSRT_headquarterContentRequiredAmount: function INSRT_headquarterContentRequiredAmount(level) {
      'use strict';

      var hqContent = $('#hq-content');
      if (level != 10) {
        hqContent.css('display', 'block');
        var headquarter = rHelper.data.headquarter[level];
        var amount = headquarter.amount;

        $.each(headquarter.material, function(i, material) {
          var icon = rHelper.methods.CALC_headquarterContentIcon(material);
          var span = rHelper.methods.CALC_headquarterContentRequiredAmount(amount);

          $('#hq-content-icon-' + i).html(icon);
          $('#hq-content-requirement-' + i).html(span);
        });
      } else {
        hqContent.css('display', 'none');
      }
    },
    INSRT_headquarterPaid: function INSRT_headquarterPaid() {
      'use strict';

      var paid = rHelper.data.headquarter.user.paid;
      $.each(paid, function(i, amount) {
        $('#hq-content-input-' + i).val(amount);
      });
    },
    INSRT_headquarterMissing: function INSRT_headquarterMissing(i) {
      'use strict';

      var userHqLevel = rHelper.data.headquarter.user.level;
      if (userHqLevel != 10) {
        var requiredAmount = rHelper.data.headquarter[userHqLevel].amount;
        var paid = rHelper.data.headquarter.user.paid[i];
        var missing = requiredAmount - paid;
        if (missing < 0) {
          missing = 0;
        }
        $('#hq-content-missing-' + i).text(missing.toLocaleString('en-US'));
      }
    },
    INSRT_headquarterRemainingCost: function INSRT_headquarterRemainingCost(userHqLevel) {
      'use strict';

      if (userHqLevel != 10) {
        var headquarter = rHelper.data.headquarter[userHqLevel];
        var totalCost = 0;
        var totalTransportation = 0;

        $.each(headquarter.material, function(i, material) {
          var worth = rHelper.methods.CALC_headquarterRemainingCost(i, material, userHqLevel);
          totalCost += worth;
          var transportation = Math.round(worth * (rHelper.data.buildings[9].transportCost - 1));
          totalTransportation += transportation;
          $('#hq-content-cost-' + i).text(worth.toLocaleString('en-US'));
          $('#hq-content-transportation-' + i).text(transportation.toLocaleString('en-US'));
        });

        rHelper.methods.INSRT_headquarterTotalCost(totalCost);
        rHelper.methods.INSRT_headquarterTotalTransportation(totalTransportation);
      }
    },
    INSRT_headquarterTotalCost: function INSRT_headquarterTotalCost(sum) {
      'use strict';

      $('#hq-content-cost-sum').text(sum.toLocaleString('en-US'));
    },
    INSRT_headquarterTotalTransportation: function INSRT_headquarterTotalTransportation(sum) {
      'use strict';

      $('#hq-content-transportation-sum').text(sum.toLocaleString('en-US'));
    },
    INSRT_priceHistoryName: function INSRT_priceHistoryName(type, id) {
      'use strict';

      $('#pricehistory-' + type + '-' + id).text(rHelper.data[type][id].name);
    },
    INSRT_qualityComparator: function INSRT_qualityComparator(type, quality) {
      'use strict';

      if (!type || type === null) {
        type = 0;
      }
      if (!quality) {
        quality = 1;
      } else {
        quality /= 100;
      }

      var price = rHelper.methods.CALC_returnPriceViaId(type);
      var worth = price * rHelper.data.material[type].maxRate * quality;
      $('#qualitycomparator-income').text(worth.toLocaleString('en-US'));

      $.each(rHelper.data.material, function(i, material) {
        var qualityTarget = $('#qualitycomparator-' + i);
        var parentElement = $(qualityTarget[0].parentNode.parentNode);
        var thisPrice = rHelper.methods.CALC_returnPriceViaId(i);
        var thisMaxRate = material.maxRate;
        var thisResourcesRequiredAmount = worth / thisPrice;

        // hide row if identical to current scan or more required than possible
        if (i === type || thisResourcesRequiredAmount > thisMaxRate) {
          parentElement.css('opacity', 0.1);
        } else {
          parentElement.css('opacity', 1);
          var percent = (thisResourcesRequiredAmount / thisMaxRate * 100).toFixed(2);
          qualityTarget.text(percent + ' %');
        }
      });
    },
    INSRT_missions: function INSRT_missions() {
      'use strict';

      var missionContainer = rHelper.data.missions;
      if (missionContainer.length != 0) {
        var now = Math.round(Date.now() / 1000);

        var calculateMissionCost = function calculateMissionCost(i, mission) {
          var uncalculatableMissions = [9, 12, 17, 21, 22, 25, 30, 31, 32, 35, 37, 38, 41, 42, 43, 44, 50, 55],
            requirementId = 0,
            materialCost = 0,
            missionCost = 0;

          if (uncalculatableMissions.indexOf(i) === -1) {
            switch (i) {
              case 10:
                missionCost += rHelper.data.units[5].profit.craftingPrice * mission.goal;
                break;
              case 11:
              case 26:
              case 28:
              case 31:
              case 39:
                if (i === 26) {
                  requirementId = 29;
                } else if (i === 28) {
                  requirementId = 21;
                } else if (i === 31) {
                  requirementId = 20;
                } else if (i === 39) {
                  requirementId = 25;
                }

                materialCost = rHelper.methods.CALC_returnPriceViaId(requirementId) * mission.goal;
                missionCost += materialCost * rHelper.data.buildings[9].transportCost - materialCost;
                break;
              case 14:
                missionCost += rHelper.methods.CALC_currentScanCost() * mission.goal;
                break;
              case 33:
                var calcSmallestUnitPrice = function calcSmallestUnitPrice() {
                  var min = Infinity;

                  $.each(rHelper.data.units, function(i, unit) {
                    if (i === 1 || i === 4 || i === 5) {
                      var _ref48 = [unit.profit.craftingPrice, unit.profit.marketPrice * rHelper.data.buildings[9].transportCost, 0],
                        craftingPrice = _ref48[0],
                        marketPrice = _ref48[1],
                        result = _ref48[2];

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

        var calculateMissionReward = function calculateMissionReward(i, mission) {
          var _ref49 = [mission.rewardId, 0],
            rewardId = _ref49[0],
            rewardWorth = _ref49[1];

          if (rewardId != -1) {
            $('#mission-reward-' + i).addClass(rHelper.methods.CALC_convertId(rewardId).icon);
            var price = rHelper.methods.CALC_returnPriceViaId(rewardId);
            rewardWorth += mission.rewardAmount * price;
          } else {
            $('#mission-reward-' + i).html('<img src="assets/img/cash.png" alt="Cash" />');
            rewardWorth += mission.rewardAmount;
          }

          return rewardWorth;
        };

        var returnWorthColor = function returnWorthColor(missionWorth) {
          var color = 'coral';

          if (missionWorth > 0) {
            color = 'yellowgreen';
          }

          return color;
        };

        var insertMissionReward = function insertMissionReward(i, mission) {
          var parsedI = parseInt(i);

          var rewardWorth = calculateMissionReward(i, mission);
          var missionCost = calculateMissionCost(parsedI, mission);

          var missionWorth = rewardWorth - missionCost;
          var color = returnWorthColor(missionWorth);

          if (isNaN(missionWorth)) {
            missionWorth = 0;
          }

          if (parsedI != 50 && parsedI != 55 && parsedI != 31) {
            $('#mission-profit-' + i)
              .text(missionWorth.toLocaleString('en-US'))
              .css('color', color);
          }
        };

        var colorProgress = function colorProgress(progressPercent) {
          var color = 'coral';

          if (progressPercent > 33 && progressPercent < 66) {
            color = 'orange';
          } else if (progressPercent >= 66) {
            color = 'yellowgreen';
          }
          return color;
        };

        var returnMissionProgress = function returnMissionProgress(progress, goal) {
          return progress / goal * 100;
        };

        var calculateRemainingDuration = function calculateRemainingDuration(now, finish) {
          var remainingDuration = finish - now;

          if (remainingDuration < 60) {
            return remainingDuration + 's';
          } else if (remainingDuration >= 60 && remainingDuration < 3600) {
            return (remainingDuration / 60).toFixed(2) + 'm';
          } else if (remainingDuration >= 3600 && remainingDuration < 86400) {
            return (remainingDuration / 3600).toFixed(2) + 'h';
          } else {
            return (remainingDuration / 86400).toFixed(2) + 'd';
          }
        };

        var fadeOutMission = function fadeOutMission(i, mission) {
          var cooldown = calculateRemainingDuration(now, mission.cooldown);

          $('#mission-progress-' + i)
            .attr('colspan', 3)
            .html('Mission on cooldown for <span style="color: orange;">' + cooldown + '</span>')
            .css('text-align', 'center');
          $('#mission-start-' + i).remove();
          $('#mission-end-' + i).remove();
          $('#mission-' + i).addClass('faded-mission');
        };

        var highlightAvailableMission = function highlightAvailableMission(i) {
          $('#mission-' + i).addClass('yellowgreen-10');
        };

        var insertMissionConstants = function insertMissionConstants(i, mission) {
          $('#mission-duration-' + i).text(mission.duration / 24);
          $('#mission-interval-' + i).text(mission.intervalDays);

          if (mission.goal) {
            $('#mission-goal-' + i).text(mission.goal.toLocaleString('en-US'));
            $('#mission-penalty-' + i).text(mission.penalty.toLocaleString('en-US'));
            $('#mission-reward-amount-' + i).text(mission.rewardAmount.toLocaleString('en-US'));
          }
        };

        var onActiveMission = function onActiveMission(i, mission) {
          var progressPercent = returnMissionProgress(mission.progress, mission.goal);
          $('#mission-progress-bar-' + i).css({
            width: progressPercent + '%',
            'background-color': colorProgress(progressPercent)
          });

          $('#mission-start-' + i).text(rHelper.methods.CALC_convertDateToIso(rHelper.methods.CALC_toMilliseconds(mission.startTimestamp)));
          $('#mission-end-' + i).text(calculateRemainingDuration(now, mission.endTimestamp));
        };

        var onPassiveMission = function onPassiveMission(i) {
          $('#mission-progress-wrap-' + i).css('display', 'none');
        };

        var checkForMissionStatus = function checkForMissionStatus(i, mission) {
          if (mission.status === 1) {
            onActiveMission(i, mission);
          } else {
            onPassiveMission(i, mission);
          }
        };

        $.each(missionContainer, function(i, mission) {
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
    CALC_attackLogDetailedUnitStringInsertion: function CALC_attackLogDetailedUnitStringInsertion(type, container) {
      var _ref50 = [''],
        content = _ref50[0],
        unitArray = _ref50[1];

      if (type === 'offense') {
        unitArray = [0, 2, 3];
      } else if (type === 'defense') {
        unitArray = [5, 4, 1];
      }

      $.each(container, function(i, unitAmount) {
        if (unitAmount !== 0) {
          content += ' <span class="resources-unit-' + unitArray[i] + '"></span> ' + unitAmount.toLocaleString('en-US');
        }
      });

      return content;
    },
    CALC_attackLogDetailedDatasetIteration: function CALC_attackLogDetailedDatasetIteration(i, dataset, dataTHs) {
      var _ref51 = [$(crEl('tr')).addClass(rHelper.methods.CALC_attackLogSetTRColor(dataset.result)), 'text-md-right text-sm-left', 'bg-success-25'],
        tr = _ref51[0],
        textOrientation = _ref51[1],
        factorBgColorClass = _ref51[2];

      for (var index = 0; index <= 6; index += 1) {
        var td = $(crEl('td')).attr('data-th', dataTHs[index]);

        switch (index) {
          case 0:
            td.text(dataset.target + ' (' + dataset.targetLevel + ')');
            break;
          case 1:
            td.html(rHelper.methods.CALC_attackLogDetailedCoordsTimestampString(dataset));
            break;
          case 2:
            td.html(rHelper.methods.CALC_attackLogDetailedUnitStringInsertion('offense', dataset.offense.units)).addClass('text-sm-left text-md-center');
            break;
          case 3:
            td.html(rHelper.methods.CALC_attackLogDetailedUnitStringInsertion('defense', dataset.defense.units)).addClass('text-sm-left text-md-center');
            break;
          case 4:
            if (dataset.factor < 100) {
              factorBgColorClass = 'bg-warning-25';
            }

            td.text(dataset.factor.toLocaleString('en-US') + '%').addClass(textOrientation + ' ' + factorBgColorClass);
            break;
          case 5:
            td.html(rHelper.methods.CALC_attackLogDetailedLootString(dataset.loot));
            break;
          case 6:
            var _ref52 = [dataset.profit, dataset.result, '#dedede'],
              profit = _ref52[0],
              result = _ref52[1],
              profitColor = _ref52[2];

            if ((profit < 0 && result) || !result) {
              profitColor = 'coral';
            }

            td
              .text(profit.toLocaleString('en-US'))
              .addClass(textOrientation)
              .css('color', profitColor);
            break;
        }

        tr.append(td);
      }

      return tr;
    },
    CALC_attackLogSetTRColor: function CALC_attackLogSetTRColor(result) {
      var colorClass = 'bg-success-25';

      if (!result || result < 0) {
        colorClass = 'bg-warning-25';
      }

      return colorClass;
    },
    CALC_attackLogDetailedCoordsTimestampString: function CALC_attackLogDetailedCoordsTimestampString(dataset) {
      var _ref53 = [dataset.coordinates.lat + ', ' + dataset.coordinates.lon, rHelper.methods.CALC_convertDateToIso(dataset.attackedAt)],
        coords = _ref53[0],
        timestamp = _ref53[1];

      var a = '<a href="https://www.google.com/maps/search/' + coords + '" target="_blank" rel="noopener nofollow noreferrer">' + coords + '</a>';

      return timestamp + ' | ' + a;
    },
    CALC_attackLogDetailedPageButtonToggler: function CALC_attackLogDetailedPageButtonToggler(type, dataContainer) {
      var _ref54 = [$('#attacklog-detailed-' + type), 'btn-success'],
        button = _ref54[0],
        success = _ref54[1];

      if (type === 'last') {
        if (dataContainer.skipCount === 0) {
          button.attr('disabled', true).removeClass(success);
        } else {
          button.attr('disabled', false).addClass(success);
        }
      } else if (type === 'next') {
        if (dataContainer.maxLength > dataContainer.skipCount + 100) {
          button.addClass(success).attr('disabled', false);
        } else {
          button.removeClass(success).attr('disabled', true);
        }
      }
    },
    CALC_attackLogDetailedLootString: function CALC_attackLogDetailedLootString(lootContainer) {
      var lootString = '';

      $.each(lootContainer, function(index, iteration) {
        var _ref55 = [iteration.type, ''],
          type = _ref55[0],
          icon = _ref55[1];

        if (type === -1) {
          icon = '<img src="assets/img/cash.png" alt="Cash" />';
        } else {
          icon = '<span class="' + rHelper.methods.CALC_convertId(type).icon + '"></span>';
        }

        lootString += icon + ' ' + iteration.amount.toLocaleString('en-US') + ' ';
      });

      return lootString;
    },
    CALC_convertDateToIso: function CALC_convertDateToIso(milliseconds) {
      /*
      src https://stackoverflow.com/questions/10830357/javascript-toisostring-ignores-timezone-offset?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
      */

      var tzoffset = new Date(milliseconds).getTimezoneOffset() * 60000;
      var date = new Date(milliseconds - tzoffset)
        .toISOString()
        .slice(0, -1)
        .match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/);
      return date[1] + ' ' + date[2];
    },
    CALC_currentScanCost: function CALC_currentScanCost() {
      var _ref56 = [rHelper.data.buildings[0].level, rHelper.methods.CALC_totalMineCount()],
        techCenterLevel = _ref56[0],
        mineCount = _ref56[1];

      return Math.round(10000 * Math.pow(2.4, techCenterLevel) * (1 + mineCount / 1000) / 5000) * 5000;
    },
    CALC_toMilliseconds: function CALC_toMilliseconds(unix) {
      return unix * 1000;
    },
    CALC_mineEstRevenue: function CALC_mineEstRevenue(subObj, type, age) {
      'use strict';

      return Math.round(subObj.fullRate * rHelper.methods.CALC_returnPriceViaId(type, 8) * age * 24 * subObj.HQBoost);
    },
    CALC_theoreticalFactoryLevelCap: function CALC_theoreticalFactoryLevelCap(factoryId, workload) {
      return Math.floor(rHelper.data.products[factoryId].factoryLevel * workload);
    },
    CALC_createMapContentString: function CALC_createMapContentString(relObj, buildDate, age, estRevenue, subObj) {
      'use strict';

      var quality = subObj.quality * 100;
      return (
        '<div>\n        <h1 class="firstHeading">' +
        relObj.name +
        '</h1>\n        <div>\n        <p><strong>Built:</strong> ' +
        buildDate +
        '</p>\n        <p><strong>Age (days)</strong>: ' +
        age.toFixed(2) +
        '</p>\n        <p><strong>Estimated revenue (condition always 100%):</strong> ' +
        estRevenue.toLocaleString('en-US') +
        '</p>\n        <table class="table table-break-medium mb-3 text-center">\n        <thead>\n        <tr>\n          <th>Raw rate</th>\n          <th>Full rate</th>\n          <th>Tech factor</th>\n          <th>Quality</th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr>\n          <td>' +
        subObj.rawRate.toLocaleString('en-US') +
        '</td>\n          <td>' +
        subObj.fullRate.toLocaleString('en-US') +
        '</td>\n          <td>' +
        subObj.techFactor.toLocaleString('en-US') +
        '</td>\n          <td>' +
        quality.toFixed(2) +
        '% => ' +
        (quality * subObj.techFactor).toFixed(2) +
        ' %</td>\n        </tr>\n        </tbody>\n        </table>\n        </div>\n        </div>'
      );
    },
    CALC_headquarterRemainingCost: function CALC_headquarterRemainingCost(i, material, userHqLevel) {
      'use strict';

      var _ref57 = [rHelper.methods.CALC_returnPriceViaId(material), rHelper.data.headquarter[userHqLevel].amount - rHelper.data.headquarter.user.paid[i]],
        price = _ref57[0],
        missing = _ref57[1];

      if (missing < 0) {
        missing = 0;
      }

      return price * missing;
    },
    CALC_headquarterContentIcon: function CALC_headquarterContentIcon(material) {
      'use strict';

      var container = $(crEl('span'));
      container.addClass(rHelper.methods.CALC_convertId(material).icon);
      return container[0].outerHTML;
    },
    CALC_headquarterContentRequiredAmount: function CALC_headquarterContentRequiredAmount(amount) {
      'use strict';

      var span = $(crEl('span')).html(amount.toLocaleString('en-US'));
      return span[0].outerHTML;
    },
    CALC_convertMeterToYards: function CALC_convertMeterToYards(meter) {
      'use strict';

      return Math.round(meter * 1.09361);
    },
    CALC_headquarterLevelCost: function CALC_headquarterLevelCost(level) {
      'use strict';

      var _ref58 = [0, rHelper.data.headquarter[level]],
        cost = _ref58[0],
        hqLevel = _ref58[1];

      if ($.isArray(hqLevel.material)) {
        $.each(hqLevel.material, function(k, material) {
          cost += hqLevel.amount * rHelper.methods.CALC_returnPriceViaId(material);
        });
      }

      return cost;
    },
    CALC_headquarterOvwMaterial: function CALC_headquarterOvwMaterial(level) {
      'use strict';

      var _ref59 = [rHelper.data.headquarter[level], ''],
        hqLevel = _ref59[0],
        string = _ref59[1];

      if ($.isArray(hqLevel.material)) {
        $.each(hqLevel.material, function(k, material) {
          var addClass = void 0;

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

          var span = $(crEl('span')).addClass(addClass);
          string += span[0].outerHTML + ' ';
        });
      }

      return string;
    },
    CALC_totalBuildingErectionSum: function CALC_totalBuildingErectionSum() {
      'use strict';

      var total = 0;
      $.each(rHelper.data.buildings, function(i, building) {
        var _loop2 = function _loop2(level) {
          $.each(building.material, function(k, material) {
            var materialAmount = 'materialAmount' + k;

            if (material != -1) {
              total += rHelper.methods.CALC_returnPriceViaId(material) * building[materialAmount][level];
            } else {
              total += building[materialAmount][level];
            }
          });
        };

        for (var level = 0; level < building.level; level += 1) {
          _loop2(level);
        }
      });

      return total;
    },
    CALC_perfectWorth: function CALC_perfectWorth(type) {
      'use strict';

      var total = 0;

      if (type === 'headquarter') {
        $.each(rHelper.data.headquarter, function(i, hqLevel) {
          $.each(hqLevel.material, function(k, material) {
            total += hqLevel.amount * rHelper.methods.CALC_returnPriceViaId(material);
          });
        });
      } else if (type === 'buildings') {
        $.each(rHelper.data.buildings, function(i, building) {
          var _loop3 = function _loop3(level) {
            $.each(building.material, function(k, material) {
              var materialAmount = 'materialAmount' + k;

              if (material != -1) {
                total += rHelper.methods.CALC_returnPriceViaId(material) * building[materialAmount][level];
              } else {
                total += building[materialAmount][level];
              }
            });
          };

          for (var level = 0; level < 10; level += 1) {
            _loop3(level);
          }
        });
      }

      return total;
    },
    CALC_companyWorth: function CALC_companyWorth() {
      'use strict';

      var companyWorth = 0;

      var fns = ['CALC_totalHeadquarterErectionSum', 'CALC_totalBuildingErectionSum', 'CALC_totalFactoryErectionWorth', 'CALC_totalWarehouseErectionWorth', 'CALC_totalMineErectionSum'];

      $.each(fns, function(i, fn) {
        companyWorth += rHelper.methods[fn]();
      });

      return companyWorth;
    },
    CALC_totalHeadquarterErectionSum: function CALC_totalHeadquarterErectionSum() {
      'use strict';

      var total = 0;
      var headquarter = rHelper.data.headquarter;

      if (headquarter.user) {
        var userHq = headquarter.user;
        var userHqLevel = userHq.level;

        var _loop4 = function _loop4(i) {
          var hqLevel = rHelper.data.headquarter[i];
          $.each(hqLevel.material, function(k, material) {
            total += hqLevel.amount * rHelper.methods.CALC_returnPriceViaId(material);
          });
        };

        for (var i = userHqLevel - 1; i >= 1; i -= 1) {
          _loop4(i);
        }
        if (userHqLevel != 10) {
          $.each(userHq.paid, function(i, paid) {
            if (paid != 0) {
              var material = rHelper.data.headquarter[userHqLevel - 1].material[i];
              total += paid * rHelper.methods.CALC_returnPriceViaId(material);
            }
          });
        }
      }

      return total;
    },
    CALC_totalMineErectionSum: function CALC_totalMineErectionSum() {
      'use strict';

      var total = 0;
      var totalMines = rHelper.methods.CALC_totalMineCount();

      $.each(rHelper.data.material, function(i, material) {
        total += material.basePrice * (1 + 0.01 * totalMines) * material.amountOfMines;
      });

      return Math.round(total);
    },
    CALC_totalWarehouseErectionWorth: function CALC_totalWarehouseErectionWorth() {
      'use strict';

      var total = 0;
      var subArrays = ['material', 'products', 'loot', 'units'];

      $.each(subArrays, function(i, index) {
        $.each(rHelper.data[index], function(k, obj) {
          for (var _k = 1; _k <= obj.warehouse.level; _k += 1) {
            total += Math.pow(_k - 1, 2) * 1250000;
          }
        });
      });

      return total;
    },
    CALC_totalFactoryErectionWorth: function CALC_totalFactoryErectionWorth() {
      'use strict';

      var total = 0;

      $.each(rHelper.data.products, function(i, factory) {
        var _loop5 = function _loop5(level) {
          $.each(factory.upgradeMaterial, function(k, material) {
            var value = Math.pow(level, 2) * factory.upgradeMaterialAmount[k];
            if (material != -1) {
              total += value * rHelper.methods.CALC_returnPriceViaId(material);
            } else {
              total += value;
            }
          });
        };

        for (var level = 0; level <= factory.factoryLevel; level += 1) {
          _loop5(level);
        }
      });

      return total;
    },
    CALC_unitsCraftingPrice: function CALC_unitsCraftingPrice(unitId) {
      'use strict';

      var unit = rHelper.data.units[unitId];
      var worth = unit.prices.current.ai;
      var requiredAmount = unit.requiredAmount;
      var requirements = unit.requirements;

      $.each(requirements, function(index, requirement) {
        var price = rHelper.methods.CALC_returnPriceViaId(requirement);
        worth += price * requiredAmount[index];
      });

      var settings = rHelper.data.settings[3];
      var transportCostInclusion = 1;

      if ((typeof settings === 'undefined' ? 'undefined' : _typeof(settings)) !== undefined) {
        transportCostInclusion = rHelper.data.settings[3].value;
      }

      if (transportCostInclusion === 1) {
        worth *= rHelper.data.buildings[9].transportCost;
      }

      worth = Math.round(worth);
      unit.profit.craftingPrice = worth;
      return worth;
    },
    CALC_unitsPricePerStrength: function CALC_unitsPricePerStrength(unitId) {
      'use strict';

      var buildingLevel = 0;
      var strength = 0;
      var pricePerStrength = 0;
      var referencePrice = 0;
      var profitObj = rHelper.data.units[unitId].profit;

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
      var marketPriceIncludingTransportation = profitObj.marketPrice * rHelper.data.buildings[9].transportCost;

      if (marketPriceIncludingTransportation >= profitObj.craftingPrice) {
        referencePrice = profitObj.craftingPrice;
      } else {
        referencePrice = marketPriceIncludingTransportation;
      }

      pricePerStrength = Math.round(referencePrice / strength);
      return pricePerStrength;
    },
    CALC_unitsProfit: function CALC_unitsProfit(unitId) {
      'use strict';

      var profitObj = rHelper.data.units[unitId].profit;
      var profit = (1 - profitObj.marketPrice / profitObj.craftingPrice) * 100;
      profit *= -1;
      profitObj.profit = profit;

      return profit;
    },
    CALC_recyclingProfit: function CALC_recyclingProfit(lootId) {
      'use strict';

      var profitObj = rHelper.data.loot[lootId].profit;
      var profit = (1 - profitObj.outputWorth / profitObj.inputWorth) * 100;
      profit *= -1;

      return profit;
    },
    CALC_recyclingInputWorth: function CALC_recyclingInputWorth(lootId) {
      'use strict';

      var loot = rHelper.data.loot[lootId];
      var amount = loot.recyclingDivisor;
      var convertedId = lootId + 36;
      var price = rHelper.methods.CALC_returnPriceViaId(convertedId, 0);
      var worth = price * amount;

      var settings = rHelper.data.settings[3];
      var transportCostInclusion = 1;

      if ((typeof settings === 'undefined' ? 'undefined' : _typeof(settings)) !== undefined) {
        transportCostInclusion = rHelper.data.settings[3].value;
      }

      if (transportCostInclusion === 1) {
        worth *= rHelper.data.buildings[9].transportCost;
      }

      worth = Math.round(worth);
      loot.profit.inputWorth = worth;
      return worth;
    },
    CALC_recyclingOutputWorth: function CALC_recyclingOutputWorth(lootId, recyclingPlantLevel) {
      'use strict';

      var resultingAmount = rHelper.data.loot[lootId].recyclingAmount;
      var resultingProducts = rHelper.data.loot[lootId].recyclingProduct;
      var worth = 0;

      if ($.isArray(resultingProducts)) {
        $.each(resultingProducts, function(index, resultingProduct) {
          worth += rHelper.methods.CALC_recyclingOutputWorthHelper(recyclingPlantLevel, resultingProduct, resultingAmount, index);
        });
      } else {
        worth += rHelper.methods.CALC_recyclingOutputWorthHelper(recyclingPlantLevel, resultingProducts, resultingAmount);
      }

      worth = Math.round(worth);
      rHelper.data.loot[lootId].profit.outputWorth = worth;
      return worth;
    },
    CALC_recyclingOutputWorthHelper: function CALC_recyclingOutputWorthHelper(recyclingPlantLevel, resultingProduct, resultingAmount, index) {
      'use strict';

      var price = rHelper.methods.CALC_returnPriceViaId(resultingProduct, 0);
      var amount = resultingAmount * recyclingPlantLevel;

      if ($.isArray(resultingAmount)) {
        amount = resultingAmount[index] * recyclingPlantLevel;
      }

      var worth = amount * price;
      return worth;
    },
    CALC_recyclingRequirement: function CALC_recyclingRequirement(lootId) {
      'use strict';

      return rHelper.data.loot[lootId].recyclingDivisor;
    },
    CALC_recyclingProducts: function CALC_recyclingProducts(lootId, recyclingPlantLevel) {
      'use strict';

      var resultingAmount = rHelper.data.loot[lootId].recyclingAmount;
      var resultingProducts = rHelper.data.loot[lootId].recyclingProduct;
      var string = '';

      if ($.isArray(resultingProducts)) {
        $.each(resultingProducts, function(index, resultingProduct) {
          string += rHelper.methods.CALC_recyclingProductsHelper(recyclingPlantLevel, resultingProduct, resultingAmount, index);
        });
      } else {
        string += rHelper.methods.CALC_recyclingProductsHelper(recyclingPlantLevel, resultingProducts, resultingAmount);
      }

      return string;
    },
    CALC_recyclingProductsHelper: function CALC_recyclingProductsHelper(recyclingPlantLevel, resultingProduct, resultingAmount, index) {
      'use strict';

      var product = rHelper.methods.CALC_convertId(resultingProduct);
      var icon = $(crEl('span')).addClass(product.icon);
      var amount = resultingAmount * recyclingPlantLevel;

      if ($.isArray(resultingAmount)) {
        amount = resultingAmount[index] * recyclingPlantLevel;
      }

      var string = icon[0].outerHTML + ' ' + amount.toLocaleString('en-US') + ' ';
      return string;
    },
    CALC_buildingToLevel10: function CALC_buildingToLevel10(buildingId) {
      'use strict';

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
            var selector = 'materialAmount' + i;
            var materialAmount = building[selector][level];

            if (typeof materialAmount === 'number') {
              var materialPrice = rHelper.methods.CALC_returnPriceViaId(building.material[i]);
              var materialWorth = materialPrice * materialAmount;
              var transportation = (rHelper.data.buildings[9].transportCost - 1) * materialWorth;
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
    CALC_warehouseUpgradeCost: function CALC_warehouseUpgradeCost(targetLevel) {
      'use strict';

      return Math.pow(targetLevel - 1, 2) * 1250000;
    },
    CALC_warehouseCostFromTo: function CALC_warehouseCostFromTo(start, end) {
      'use strict';

      var warehouseCost = 0;
      for (var i = end; i > start; i -= 1) {
        warehouseCost += rHelper.methods.CALC_warehouseUpgradeCost(i);
      }
      return warehouseCost;
    },
    CALC_warehouseContingent: function CALC_warehouseContingent(level) {
      'use strict';

      return Math.pow(level, 2) * 5000;
    },
    CALC_warehouseUpgradeCostContigentBased: function CALC_warehouseUpgradeCostContigentBased(startLevel, endContingent) {
      'use strict';

      var warehouseCost = 0;
      var nextBiggerTargetLevel = Math.ceil(Math.sqrt(endContingent / 5000));

      warehouseCost += rHelper.methods.CALC_warehouseCostFromTo(startLevel, nextBiggerTargetLevel);
      return warehouseCost;
    },
    CALC_warehouseUpgradeCostOnInput: function CALC_warehouseUpgradeCostOnInput(id, type, value) {
      'use strict';

      var mode = $('#warehouse-' + type + '-calc-1-' + id).val();
      var currentWarehouseLevel = rHelper.data[type][id].warehouse.level;
      var upgradeCost = 0;

      switch (mode) {
        case 'level':
          upgradeCost = rHelper.methods.CALC_warehouseCostFromTo(currentWarehouseLevel, value);
          break;
        case 'contingent':
          upgradeCost = rHelper.methods.CALC_warehouseUpgradeCostContigentBased(currentWarehouseLevel, value);
          break;
      }

      return upgradeCost;
    },
    CALC_warehouseWorth: function CALC_warehouseWorth(id, type) {
      'use strict';

      var price = 0;
      var priceId = 0;

      switch (type) {
        case 'material':
          priceId = id;
          break;
        case 'products':
          priceId = id + 14;
          break;
        case 'loot':
          priceId = id + 36;
          break;
        case 'units':
          priceId = id + 51;
          break;
      }

      price = rHelper.methods.CALC_returnPriceViaId(priceId);
      return price;
    },
    CALC_warehouseRemainingTimeToFull: function CALC_warehouseRemainingTimeToFull(id, type) {
      'use strict';

      var el = rHelper.data[type][id];
      var remainingCapacity = el.warehouse.contingent - el.warehouse.fillAmount;
      var remainingTime = 0,
        divisor = 1;

      if (type === 'material') {
        divisor = el.perHour;
      } else if (type === 'products') {
        divisor = el.scaling * el.factoryLevel * rHelper.methods.CALC_factoryMinWorkload(id);
      }

      remainingTime = remainingCapacity / divisor;

      if (isNaN(remainingTime) || (type === 'products' && el.turnover <= 0) || type === 'loot' || type === 'units' || remainingTime === Infinity) {
        remainingTime = '∞';
      } else {
        if (remainingTime > 24) {
          remainingTime = '> ' + (remainingTime / 24).toFixed(2) + ' days';
        } else {
          remainingTime = '> ' + remainingTime.toFixed(2) + ' hours';
        }
      }

      return remainingTime;
    },
    CALC_warehouseTotalLevel: function CALC_warehouseTotalLevel() {
      'use strict';

      var total = 0,
        arr = ['material', 'products', 'loot', 'units'];

      $.each(arr, function(index, pointer) {
        $.each(rHelper.data[pointer], function(index, el) {
          total += el.warehouse.level;
        });
      });

      return total;
    },
    CALC_warehouseTotalWorth: function CALC_warehouseTotalWorth() {
      'use strict';

      var total = 0,
        arr = ['material', 'products', 'loot', 'units'];

      $.each(arr, function(index, pointer) {
        $.each(rHelper.data[pointer], function(index, el) {
          total += rHelper.methods.CALC_warehouseWorth(index, pointer) * el.warehouse.fillAmount;
        });
      });

      return total;
    },
    CALC_flowDistributionHelper: function CALC_flowDistributionHelper(type, dependantFactory, id, i) {
      'use strict';

      var originalIndex = 0,
        dependantIconIndex = 0,
        requiredAmountPerLevel = 0,
        dependantObj = {},
        requiredAmount = 0,
        string = '',
        arrow =
          '<svg xmlns="http://www.w3.org/2000/svg" width="15" fill="#fff" viewBox="0 0 31.49 31.49"><path d="M21.205 5.007c-.429-.444-1.143-.444-1.587 0-.429.429-.429 1.143 0 1.571l8.047 8.047H1.111C.492 14.626 0 15.118 0 15.737c0 .619.492 1.127 1.111 1.127h26.554l-8.047 8.032c-.429.444-.429 1.159 0 1.587.444.444 1.159.444 1.587 0l9.952-9.952c.444-.429.444-1.143 0-1.571l-9.952-9.953z"/></svg>';

      if (type === 'material') {
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

      string +=
        '<span class="resources-' + type + '-' + id + '"></span> ' + requiredAmount.toLocaleString('en-US') + ' ' + arrow + ' <span class="resources-product-' + dependantIconIndex + '"></span>';
      var name1 = '';
      var name2 = dependantObj.name;

      switch (type) {
        case 'material':
          name1 = rHelper.data.material[id].name;
          break;
        case 'product':
          name1 = rHelper.data.products[id].name;
          break;
      }

      $('#flow-' + type + '-distribution-' + id + '-' + i)
        .html(string)
        .attr('data-th', name1 + ' to ' + name2);
      return requiredAmount;
    },
    CALC_flowDistribution: function CALC_flowDistribution(id, type) {
      'use strict';

      var perHour = 0;
      var obj = {};
      var requiredAmount = 0;

      switch (type) {
        case 'material':
          obj = rHelper.data.material[id];
          perHour = obj.perHour;
          break;
        case 'product':
          obj = rHelper.data.products[id];
          var factoryLevel = obj.factoryLevel;
          var scaling = obj.scaling;
          var workload = rHelper.methods.CALC_factoryMinWorkload(id);
          perHour = factoryLevel * scaling * workload;
          break;
      }

      var dependantFactories = obj.dependantFactories;

      if ($.isArray(dependantFactories)) {
        $.each(dependantFactories, function(i, dependantFactory) {
          requiredAmount += rHelper.methods.CALC_flowDistributionHelper(type, dependantFactory, id, i);
        });
      } else if (dependantFactories != '') {
        requiredAmount += rHelper.methods.CALC_flowDistributionHelper(type, dependantFactories, id, 0);
      }

      return perHour - requiredAmount;
    },
    CALC_flowRate: function CALC_flowRate(id, type) {
      'use strict';

      var rate = 0;
      switch (type) {
        case 'material':
          rate = rHelper.data.material[id].perHour;
          break;
        case 'product':
          var factory = rHelper.data.products[id];
          var workload = rHelper.methods.CALC_factoryMinWorkload(id);
          rate = factory.factoryLevel * factory.scaling * workload;
          break;
      }
      return rate;
    },
    CALC_factoryMinWorkload: function CALC_factoryMinWorkload(factoryId) {
      'use strict';

      var workload = rHelper.data.products[factoryId].dependencyWorkload.min();
      if (workload > 1) {
        workload = 1;
      }

      // check for ideal conditions
      if (rHelper.data.settings[2].value === 1) {
        workload = 1;
      }

      return workload;
    },
    CALC_diamondTotalProfit: function CALC_diamondTotalProfit() {
      'use strict';

      var val = 0;

      $.each(rHelper.data.products, function(i, factory) {
        var diamondProfit = factory.diamond.profit;
        if (diamondProfit > 0) {
          val += diamondProfit;
        }
      });

      return val;
    },
    CALC_diamondTop10Profit: function CALC_diamondTop10Profit() {
      'use strict';

      var arr = [];

      $.each(rHelper.data.products, function(i, factory) {
        var diamondProfit = factory.diamond.profit;
        if (diamondProfit > 0) {
          arr.push(diamondProfit);
        }
      });

      var sum = 0;
      arr = arr.sort(function(a, b) {
        return b - a;
      });
      for (var i = 0; i <= 9; i += 1) {
        if (arr[i]) {
          sum += arr[i];
        }
      }
      return sum;
    },
    CALC_diamondEfficiency: function CALC_diamondEfficiency(factoryId) {
      'use strict';

      var factoryDiamond = rHelper.data.products[factoryId].diamond;
      var efficiency = factoryDiamond.outputWorth / (factoryDiamond.dependenciesWorth + factoryDiamond.productionCost);
      if (isNaN(efficiency)) {
        efficiency = 0;
      }

      factoryDiamond.efficiency = efficiency;
      return efficiency;
    },
    CALC_diamondProfit: function CALC_diamondProfit(factoryId) {
      'use strict';

      var factoryDiamond = rHelper.data.products[factoryId].diamond;
      factoryDiamond.profit = factoryDiamond.outputWorth - (factoryDiamond.dependenciesWorth + factoryDiamond.productionCost);
      return factoryDiamond.profit;
    },
    CALC_nextGreaterWarehouseLevel: function CALC_nextGreaterWarehouseLevel(amount) {
      'use strict';

      return Math.ceil(Math.sqrt(amount / 5000));
    },
    CALC_diamondFactoryOutput: function CALC_diamondFactoryOutput(factoryId) {
      'use strict';

      var factory = rHelper.data.products[factoryId];
      var outputAmount = factory.factoryLevel * factory.scaling * 5 * 24;
      var productionCost = 5 * 24 * factory.cashPerHour;

      if (factory.factoryLevel === 0) {
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
    CALC_dependantFactoriesHelper: function CALC_dependantFactoriesHelper(dependantFactory, type) {
      'use strict';

      if (type === 'material') {
        dependantFactory -= 14;
      }

      var fns = ['INSRT_factoryDependencies', 'INSRT_factoryWorkload', 'INSRT_factoryTurnover', 'INSRT_factoryTurnoverPerUpgrade', 'INSRT_factoryROI'];

      $.each(fns, function(i, fn) {
        rHelper.methods[fn](dependantFactory);
      });

      rHelper.methods.INSRT_factoryHighlightColumns();
      if (rHelper.data.products[dependantFactory].dependantFactories != '') {
        rHelper.methods.CALC_dependantFactories(dependantFactory, 'product');
      }
    },
    CALC_dependantFactories: function CALC_dependantFactories(id, type) {
      'use strict';

      var dependantFactories = '';
      switch (type) {
        case 'material':
          dependantFactories = rHelper.data.material[id].dependantFactories;
          break;
        case 'product':
          dependantFactories = rHelper.data.products[id].dependantFactories;
          break;
      }

      if ($.isArray(dependantFactories)) {
        $.each(dependantFactories, function(k, dependantFactory) {
          rHelper.methods.CALC_dependantFactoriesHelper(dependantFactory, type);
        });
      } else if (dependantFactories != '') {
        rHelper.methods.CALC_dependantFactoriesHelper(dependantFactories, type);
      }
    },
    CALC_factoryTurnoverPerUpgrade: function CALC_factoryTurnoverPerUpgrade(factoryId) {
      'use strict';

      var value = 0;
      var nextLevelWorkloadArray = [];
      var dependencies = rHelper.data.products[factoryId].dependencies;

      if ($.isArray(dependencies)) {
        $.each(dependencies, function(dependencyIndex) {
          var dependencyWorkload = rHelper.methods.CALC_factoryDepedencyWorkload(factoryId, dependencyIndex, 'nextLevel');
          nextLevelWorkloadArray.push(dependencyWorkload);
        });
      } else {
        var dependencyWorkload = rHelper.methods.CALC_factoryDepedencyWorkload(factoryId, 0, 'nextLevel');
        nextLevelWorkloadArray.push(dependencyWorkload);
      }
      var nextLevelWorkload = nextLevelWorkloadArray.min();
      if (nextLevelWorkload > 1) {
        nextLevelWorkload = 1;
      }
      value = parseInt(rHelper.methods.CALC_factoryTurnover(factoryId, 'nextLevel', nextLevelWorkload) - rHelper.data.products[factoryId].turnover);
      if (value < 10 && value > -10) {
        value = 0;
      }
      return value;
    },
    CALC_factoryDependencyExistingAmount: function CALC_factoryDependencyExistingAmount(dependantObj, dependencyIndex) {
      'use strict';

      if (dependantObj.perHour) {
        return dependantObj.perHour;
      } else {
        //return dependantObj.factoryLevel * dependantObj.scaling * (dependantObj.dependencyWorkload[dependencyIndex] / 100);
        return dependantObj.factoryLevel * dependantObj.scaling;
      }
    },
    CALC_factoryWorkloadMinNonSanitized: function CALC_factoryWorkloadMinNonSanitized(factoryId) {
      'use strict';

      var workload = rHelper.data.products[factoryId].dependencyWorkload.min();

      // check for ideal conditions
      if (rHelper.data.settings[2].value === 1) {
        workload = 1;
      }

      return workload;
    },
    CALC_factoryCashCostPerHour: function CALC_factoryCashCostPerHour(factoryId, nextLevel) {
      'use strict';

      var factory = rHelper.data.products[factoryId];
      var factoryLevel = factory.factoryLevel;
      if (nextLevel) {
        factoryLevel += 1;
      }
      return factory.cashPerHour * factoryLevel;
    },
    CALC_factoryTurnover: function CALC_factoryTurnover(factoryId, nextLevel, nextLevelWorkload) {
      'use strict';

      var factory = rHelper.data.products[factoryId];
      var price = rHelper.methods.CALC_returnPriceViaId(factoryId + 14);
      var factoryLevel = factory.factoryLevel;
      var cashCost = rHelper.methods.CALC_factoryCashCostPerHour(factoryId, nextLevel);
      var workload = rHelper.methods.CALC_factoryMinWorkload(factoryId);
      var materialWorth = 0;

      if (nextLevel) {
        factoryLevel += 1;
        workload = nextLevelWorkload;
      }
      var outputWorth = factory.scaling * factoryLevel * price;

      // check for ideal conditions
      if (rHelper.data.settings[2].value === 1) {
        workload = 1;
      }

      if ($.isArray(factory.dependencies)) {
        $.each(factory.dependencies, function(index) {
          var dependencyWorth = rHelper.methods.CALC_factoryDependencyWorth(factoryId, index, nextLevel);
          materialWorth += dependencyWorth;
        });
      } else {
        var dependencyWorth = rHelper.methods.CALC_factoryDependencyWorth(factoryId, 0, nextLevel);
        materialWorth += dependencyWorth;
      }

      return Math.round((outputWorth - materialWorth - cashCost) * workload);
    },
    CALC_factoryDependencyWorth: function CALC_factoryDependencyWorth(factoryId, dependencyIndex, nextLevel) {
      'use strict';

      var factory = rHelper.data.products[factoryId];
      var factoryLevel = factory.factoryLevel;

      var requiredAmount = 0,
        dependencyPrice = 0;

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
    CALC_factoryDepedencyWorkload: function CALC_factoryDepedencyWorkload(factoryId, dependencyIndex, nextLevel) {
      'use strict';

      var factory = rHelper.data.products[factoryId];
      var factoryLevel = factory.factoryLevel;

      var _ref60 = [0, 0, ,],
        workload = _ref60[0],
        existingAmount = _ref60[1],
        thisDependency = _ref60[2],
        baseAmountRequirement = _ref60[3];

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

      if (thisDependency <= 13) {
        existingAmount = rHelper.data.material[thisDependency].perHour;
      } else {
        var actualFactory = rHelper.methods.CALC_convertId(thisDependency);
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

      // check for ideal conditions
      if (rHelper.data.settings[2].value === 1) {
        workload = 1;
      }

      return workload;
    },
    CALC_factoryROI: function CALC_factoryROI(factoryId) {
      'use strict';

      return rHelper.data.products[factoryId].upgradeCost / rHelper.data.products[factoryId].turnoverIncrease / 24;
    },
    CALC_factoryComparatorRequiredVsExistingAmount: function CALC_factoryComparatorRequiredVsExistingAmount(requiredAmount, existingAmount) {
      'use strict';

      var addClass = void 0;

      if (isNaN(existingAmount)) {
        existingAmount = 0;
      }

      if (existingAmount < requiredAmount) {
        addClass = 'class="faulty-dependency"';
      } else {
        addClass = '';
      }

      return addClass;
    },
    CALC_factoryDependencyRequiredAmount: function CALC_factoryDependencyRequiredAmount(factoryId, dependencyIndex) {
      'use strict';

      var factory = rHelper.data.products[factoryId];
      var requiredAmount = 0;

      if ($.isArray(factory.requiredAmount)) {
        requiredAmount = factory.requiredAmount[dependencyIndex];
      } else {
        requiredAmount = factory.requiredAmount;
      }

      return requiredAmount * factory.factoryLevel;
    },
    CALC_totalFactoryUpgrades: function CALC_totalFactoryUpgrades() {
      'use strict';

      var totalFactoryUpgrades = 0;

      $.each(rHelper.data.products, function(i, factory) {
        totalFactoryUpgrades += factory.factoryLevel;
      });

      return totalFactoryUpgrades;
    },
    CALC_factoryUpgradeCost: function CALC_factoryUpgradeCost(factoryId) {
      'use strict';

      var factoryLevel = rHelper.data.products[factoryId].factoryLevel;
      if (typeof factoryLevel === 'undefined' || !factoryLevel) {
        factoryLevel = 0;
      }
      var nextLevel = factoryLevel + 1;

      var _ref61 = [0, 0, , , $(crEl('table')), $(crEl('tbody'))],
        sum = _ref61[0],
        sumTransportation = _ref61[1],
        td = _ref61[2],
        small = _ref61[3],
        table = _ref61[4],
        tbody = _ref61[5];

      $.each(rHelper.data.products[factoryId].upgradeMaterialAmount, function(i, amount) {
        var _ref62 = [$(crEl('tr')), 0],
          tr = _ref62[0],
          k = _ref62[1];

        if (i === 0) {
          sum += amount * Math.pow(nextLevel, 2);
          for (k = 0; k <= 2; k += 1) {
            td = $(crEl('td'));
            switch (k) {
              case 0:
                var img = $(crEl('img'))
                  .attr('src', 'assets/img/cash.png')
                  .attr('alt', 'Cash');
                td.append(img[0]);
                break;
              case 1:
                td
                  .addClass('text-right')
                  .attr('colspan', 3)
                  .text(sum.toLocaleString('en-US'));
                break;
              case 2:
                small = $(crEl('small')).text('Transportation');
                td.addClass('text-right text-warning').append(small[0]);
                break;
            }
            tr.append(td[0]);
          }
        } else {
          var upgradeMaterial = rHelper.data.products[factoryId].upgradeMaterial[i];
          var upgradeMaterialAmount = amount * Math.pow(nextLevel, 2);
          var price = rHelper.methods.CALC_returnPriceViaId(upgradeMaterial);
          var materialWorth = price * upgradeMaterialAmount;
          var transportation = (rHelper.data.buildings[9].transportCost - 1) * materialWorth;
          var className = void 0;

          sum += materialWorth;
          sumTransportation += transportation;
          upgradeMaterial += 1;

          if (upgradeMaterial <= 13) {
            className = 'material';
          } else if (upgradeMaterial >= 14 && upgradeMaterial <= 35) {
            upgradeMaterial -= 14;
            className = 'product';
          } else if (upgradeMaterial >= 36 && upgradeMaterial <= 51) {
            upgradeMaterial -= 36;
            className = 'loot';
          } else {
            upgradeMaterial -= 51;
            className = 'units';
          }

          for (k = 0; k <= 4; k += 1) {
            td = $(crEl('td'));
            switch (k) {
              case 0:
                td.addClass('resources-' + className + '-' + (upgradeMaterial - 1));
                break;
              case 1:
                td.addClass('text-right').text(upgradeMaterialAmount.toLocaleString('en-US'));
                break;
              case 2:
                td.text('≙');
                break;
              case 3:
                td.addClass('text-right').text(materialWorth.toLocaleString('en-US'));
                break;
              case 4:
                small = $(crEl('small'))
                  .addClass('text-warning')
                  .text(transportation.toLocaleString('en-US'));
                td.addClass('text-right').append(small[0]);
                break;
            }
            tr.append(td[0]);
          }
        }
        tbody.append(tr[0]);
      });
      var tr = $(crEl('tr'));
      for (var k = 0; k <= 1; k += 1) {
        td = $(crEl('td')).addClass('text-right');

        if (k === 0) {
          td.attr('colspan', 4).text(sum.toLocaleString('en-US'));
        } else {
          small = $(crEl('small'))
            .addClass('text-warning')
            .text(sumTransportation.toLocaleString('en-US'));
          td.append(small[0]);
        }
        tr.append(td[0]);
      }

      tbody.append(tr[0]);
      table.append(tbody[0]);
      rHelper.data.products[factoryId].upgradeCost = sum;

      var result = {
        sum: sum,
        title: table[0].outerHTML
      };
      return result;
    },
    CALC_factoryOutput: function CALC_factoryOutput(factoryId) {
      'use strict';

      var factory = rHelper.data.products[factoryId];
      return factory.factoryLevel * factory.scaling;
    },
    CALC_totalMineCount: function CALC_totalMineCount() {
      'use strict';

      var totalMineCount = 0;
      $.each(rHelper.data.material, function(i, material) {
        totalMineCount += material.amountOfMines;
      });

      return totalMineCount;
    },
    CALC_totalMineWorth: function CALC_totalMineWorth() {
      'use strict';

      var totalMineWorth = 0;
      $.each(rHelper.data.material, function(i) {
        totalMineWorth += rHelper.methods.CALC_materialRateWorth(i);
      });

      return totalMineWorth;
    },
    CALC_returnPriceViaId: function CALC_returnPriceViaId(id, period) {
      'use strict';

      var possiblePrices = ['current', '1day', '3days', '7days', '4weeks', '3months', '6months', '1year', 'max'];

      var index = 0;
      if (typeof period === 'undefined') {
        var settings = rHelper.data.settings[5];
        var priceAgeSetting = 2;

        if ((typeof settings === 'undefined' ? 'undefined' : _typeof(settings)) !== undefined) {
          priceAgeSetting = rHelper.data.settings[5].value;
        }

        index = possiblePrices[priceAgeSetting];
      } else if (typeof period === 'number') {
        index = possiblePrices[period];
      }

      var target = rHelper.methods.CALC_convertId(id);
      var targetPrices = target.prices[index];

      if (targetPrices.ai >= targetPrices.player) {
        return targetPrices.ai;
      } else {
        return targetPrices.player;
      }
    },
    CALC_convertId: function CALC_convertId(id) {
      'use strict';

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
    CALC_materialNewMinePrice: function CALC_materialNewMinePrice(totalMineCount, materialId) {
      'use strict';

      return Math.round(rHelper.data.material[materialId].basePrice * (1 + totalMineCount / 50));
    },
    CALC_materialRateWorth: function CALC_materialRateWorth(materialId) {
      'use strict';

      return rHelper.data.material[materialId].perHour * rHelper.methods.CALC_returnPriceViaId(materialId);
    },
    CALC_materialMinePerfectIncome: function CALC_materialMinePerfectIncome(materialId) {
      'use strict';

      return rHelper.data.material[materialId].maxRate * rHelper.methods.CALC_returnPriceViaId(materialId);
    },
    CALC_materialMineROI: function CALC_materialMineROI(type) {
      'use strict';

      var array = [];

      for (var i = 0; i <= 13; i += 1) {
        var newMinePrice = rHelper.methods.CALC_materialNewMinePrice(rHelper.methods.CALC_totalMineCount(), i);
        var perfectIncome = rHelper.methods.CALC_materialMinePerfectIncome(i);
        var customTUPrice = rHelper.methods.CALC_customTUPrice();

        switch (type) {
          case '100':
            array.push(newMinePrice / perfectIncome / 24);
            break;
          case '505':
            array.push((newMinePrice + customTUPrice) / perfectIncome / 24 / 5.05);
            break;
          case '505hq':
            var userHQLevel = 1;
            if (rHelper.data.headquarter.user) {
              userHQLevel = rHelper.data.headquarter.user.level;
            }
            var hqBoost = rHelper.data.headquarter[userHQLevel - 1].boost - 0.9;
            array.push((newMinePrice + customTUPrice) / perfectIncome / 24 / 5.05 / hqBoost);
            break;
        }
      }

      return array;
    },
    CALC_customTUPrice: function CALC_customTUPrice() {
      'use strict';

      var customTUPrice = 0;
      var tuIndex = 46;

      var settings = rHelper.data.settings[1];
      var customTUCombination = [111, 26, 0, 0];

      if ((typeof settings === 'undefined' ? 'undefined' : _typeof(settings)) !== undefined) {
        customTUCombination = settings.value;
      }

      for (var i = 0; i <= 3; i += 1) {
        customTUPrice += customTUCombination[i] * rHelper.methods.CALC_returnPriceViaId(tuIndex + i);
      }

      return customTUPrice;
    }
  },
  graphs: {
    gaugeOptions: {
      chart: {
        type: 'solidgauge',
        backgroundColor: 'transparent'
      },
      title: null,
      pane: {
        center: ['50%', '85%'],
        size: '140%',
        startAngle: -90,
        endAngle: 90,
        background: {
          backgroundColor: '#EEE',
          innerRadius: '60%',
          outerRadius: '100%',
          shape: 'arc'
        }
      },
      tooltip: {
        enabled: false
      },
      yAxis: {
        minColor: 'rgba(255, 127, 80, 0.75)',
        maxColor: 'rgba(154, 205, 50, 0.75)',
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
              color: '#dedede'
            },
            useHTML: true
          }
        }
      },
      exporting: {
        chartOptions: {
          chart: {
            backgroundColor: '#5f473e'
          }
        }
      }
    },
    material: {
      target: 'graph-material',
      categories: [],
      mineData: [],
      incomeData: [],
      data: [],
      colors: ['#8a4f3e', '#a4938e', '#aba59a', '#2d2c2b', '#8a5a3a', '#d8d8d8', '#b58359', '#b87259', '#9b7953', '#c4b9ab', '#957e60', '#cccbc2', '#b28b3d', '#b0a17d'],
      reference: {
        mineCount: 0,
        mineIncome: 0
      },
      seriesNames: ['Mines', 'Mine income'],
      responsiveId: 'income',
      titleText: 'mine distribution vs mine income'
    }
  },
  data: {},
  tu: []
};

var openedWindow = void 0;
var isLoggedIn = false;

(function() {
  $('#loading-text').text('fetching data');

  var cookieCheck = parseInt(getCookie('loggedIn'));
  if (cookieCheck === 1) {
    isLoggedIn = true;
  }

  if (typeof localStorage.rGame != 'undefined' && !isLoggedIn) {
    // if logged out and data in localStorage
    rHelper.data = JSON.parse(localStorage.getItem('rGame'));
    loadingAnimToggler('hide');
    console.log('Found existing data!');
    rHelper.init.core();
  } else {
    // if logged in or no data in localStorage
    $.get({
      url: 'api/core.php',
      success: function success(response) {
        rHelper.data = response;
        localStorage.setItem('rGame', JSON.stringify(response));
        loadingAnimToggler('hide');

        if (isLoggedIn) {
          console.log('Returning user - fetched existing data!');
        } else {
          console.log('New user - fetched basic data!');
        }

        rHelper.init.user();
      },
      error: function error(response) {
        swal('Error fetching data', 'Error message:<br />' + response + '<br /> Please try again.', 'error');
      }
    });
  }
})();
