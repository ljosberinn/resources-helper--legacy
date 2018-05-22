'use strict';

var loadingAnimToggler = function loadingAnimToggler(mode, text) {
  'use strict';

  $('#loading-text').text(text);

  var possibleAnimationClasses = ['slide-out-bck-center', 'puff-out-center', 'roll-out-blurred-left', 'slit-out-vertical', 'rotate-out-center'];
  var rndAnimation = possibleAnimationClasses[Math.floor(Math.random() * possibleAnimationClasses.length)];

  switch (mode) {
    case 'hide':
      $('#loading-container svg').addClass(rndAnimation);
      $('#loading-container span').each(function(i, obj) {
        $(obj).fadeOut(750);
      });

      window.setTimeout(function() {
        $('#loading-container').hide();
        $('#loading-container svg').removeClass(rndAnimation);
        $('#loading-container span').each(function(i, obj) {
          $(obj).fadeIn(750);
        });
      }, 750);
      break;
    case 'show':
      $('#loading-container').show();
      break;
  }
};

/* src https://www.w3schools.com/js/js_cookies.asp */

var getCookie = function getCookie(cname) {
  'use strict';

  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
};

var crEl = function crEl(tag) {
  'use strict';

  return document.createElement(tag);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

var applyTippyOnNewElement = function applyTippyOnNewElement(el) {
  'use strict';

  if (!el.hasClass('tippied')) {
    tippy(el[0], {
      dynamicTitle: true
    });
    el.addClass('tippied');
  }
};

var changeElementClasses = function changeElementClasses(el, rmvClass, addClass) {
  'use strict';

  var $el = $(el);

  if ($.isArray(rmvClass)) {
    $.each(rmvClass, function(i, className) {
      if ($el.hasClass(className)) {
        $el.removeClass(className);
      }
    });
  } else {
    if ($el.hasClass(rmvClass)) {
      $el.removeClass(rmvClass);
    }
  }

  if (addClass) {
    $el.addClass(addClass);
  }
};

var switchActiveNavigationLink = function switchActiveNavigationLink(selectedNav) {
  'use strict';

  $('.nav-link').each(function(i, navLink) {
    if (selectedNav === navLink.id) {
      $(navLink).addClass('active');
    } else {
      $(navLink).removeClass('active');
    }
  });
};

var switchActiveModule = function switchActiveModule(targetId) {
  'use strict';

  $('main > div').each(function(i, moduleEl) {
    if (targetId === moduleEl.id) {
      $(moduleEl).css('display', 'block');
    } else {
      $(moduleEl).css('display', 'none');
    }
  });

  if (targetId === 'module-leaderboard') {
    rHelper.methods.INSRT_leaderboard();
  }

  if (targetId === 'module-tradelog') {
    rHelper.methods.API_getTradeLog();
  }

  if (targetId === 'module-techupgrades') {
    rHelper.methods.INSRT_techUpgradeRows();
  }
};

var toggleTab = function toggleTab(selectedNav, targetId) {
  'use strict';

  switchActiveNavigationLink(selectedNav);
  switchActiveModule(targetId);
};

var toggleTechUpgradeInfo = function toggleTechUpgradeInfo(mode) {
  'use strict';

  var loading = $('#techupgrades-loading');
  var finished = $('#techupgrades-finished');

  var loadingChange = '';
  var finishedChange = '';

  switch (mode) {
    case 'start':
      loadingChange = 'flex';
      finishedChange = 'none';
      break;
    case 'end':
      loadingChange = 'none';
      finishedChange = 'inline-block';
      break;
  }

  loading.css('display', loadingChange);
  finished.css('display', finishedChange);
};

$('input').each(function(i, obj) {
  'use strict';

  $(obj).click(function() {
    obj.select();
  });
});

$('#registration-reset-fields').click(function() {
  'use strict';

  $('#registration-form input').each(function(i, obj) {
    $(obj).val('');
  });
});

$('#registration-form').submit(function(event) {
  'use strict';

  var passwordRegex = new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{4,}$');
  var pw1El = $('#registration-pw-1');
  var pw2El = $('#registration-pw-2');
  var pw1Val = pw1El.val();
  var pw2Val = pw2El.val();

  $.each([pw1Val, pw2Val], function(i, value) {
    if (value === '') {
      swal('Error', 'password empty', 'error');
      event.preventDefault();
    }
  });

  if (pw1Val !== pw2Val) {
    swal('Error', 'Passwords do not match', 'error');
    event.preventDefault();
  }

  $.each([pw1El, pw2El], function(i, obj) {
    if (passwordRegex.test(obj.val()) === false) {
      swal('Invalid password type', 'minimum of 4 characters including one number\n(e.g. "pas1").', 'error');
      event.preventDefault();
    }
  });

  if ($('#registration-language').val() === null) {
    swal('Missing language', 'please select a language', 'error');
    event.preventDefault();
  }
});

$('#password-change-form').submit(function(event) {
  'use strict';

  var passwordRegex = new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{4,}$');
  var pwOldEl = $('#settings-current-password');
  var pw1El = $('#settings-new-password-1');
  var pw2El = $('#settings-new-password-2');
  //let pwOldElVal = pwOldEl.val();
  var pw1Val = pw1El.val();
  var pw2Val = pw2El.val();

  $.each([pwOldEl, pw1Val, pw2Val], function(i, value) {
    if (value === '') {
      swal('Error', 'password empty', 'error');
      event.preventDefault();
    }
  });

  if (pw1Val !== pw2Val) {
    swal('Error', 'New passwords do not match', 'error');
    event.preventDefault();
  }

  if (passwordRegex.test(pwOldEl.val()) === false) {
    swal('Invalid old password', 'Your old password does not fit the required pattern: minimum of 4 characters including one number\n(e.g. "pas1").', 'error');
    event.preventDefault();
  }

  $.each([pw1El, pw2El], function(i, obj) {
    if (passwordRegex.test(obj.val()) === false) {
      swal('Invalid password type', 'minimum of 4 characters including one number\n(e.g. "pas1").', 'error');
      event.preventDefault();
    }
  });
});

$('#login-forgot-password').click(function(e) {
  'use strict';

  e.preventDefault();
  swal({
    title: 'Reset password for...',
    input: 'email',
    inputPlaceholder: 'mail',
    showCancelButton: true,
    confirmButtonText: 'Continue'
  }).then(function(result) {
    if (result.value) {
      $.post({
        url: 'api/resetPasswordValidateMail.php',
        data: {
          mail: result.value
        },
        success: function success(response) {
          if (response.invalid) {
            swal.showValidationError('Account not found.');
          } else if (response.valid) {
            swal({
              title: "Security token for '" + result.value + "'",
              input: 'text',
              showCancelButton: true,
              confirmButtonText: 'Validate',
              showLoaderOnConfirm: true,
              allowOutsideClick: function allowOutsideClick() {
                return !swal.isLoading();
              },
              preConfirm: function preConfirm(token) {
                return new Promise(function(resolve) {
                  $.post({
                    url: 'api/resetPassword.php',
                    data: {
                      mail: result.value,
                      token: token
                    },
                    success: function success(response) {
                      if (response.invalid) {
                        swal.showValidationError('Invalid security token.');
                      } else if (response.url) {
                        location.replace(response.url);
                      }
                      resolve();
                    }
                  });
                });
              }
            });
          }
        }
      });
    }
  });
});

var removeLoggedInButtons = function removeLoggedInButtons() {
  'use strict';

  if (rHelper.data.userInformation.realKey !== false) {
    $('#save-api-container').remove();
  }
};

window.setInterval(function() {
  'use strict';

  var wait = document.getElementById('loading-dots');

  if (wait) {
    if (wait.innerHTML.length > 3) {
      wait.innerHTML = '';
    } else {
      wait.innerHTML += '.';
    }
  }
}, 1000);

$('#settings-toggler').on('click', function(e) {
  'use strict';

  e.preventDefault();

  var settings = $('#module-settings');

  if (settings.css('display') === 'block') {
    settings.css('display', 'none');
  } else {
    settings.css('display', 'block');
  }
});

$('#settings-close').on('click', function(e) {
  'use strict';

  e.preventDefault();

  $('#module-settings').css('display', 'none');
});

$('#api-submit').on('click', function(e) {
  'use strict';

  e.preventDefault();
  this.disabled = true;

  var _ref = [
      $('#api-key')
        .val()
        .replace(/ /g, ''),
      false
    ],
    key = _ref[0],
    anonymity = _ref[1];

  if (!key || key.length != 45) {
    swal('API Error', 'Key missing or too short/long (' + key.length + ' instead of 45 characters)', 'error');
    return;
  }

  var API_possibilities = ['factories', 'warehouse', 'buildings', 'headquarter', 'mines-summary', 'mines-detailed', 'player', 'attack-log', 'trade-log', 'missions'];
  var queries = [];

  if ($('#save-key').prop('checked') === true) {
    $.post('api/saveKey.php', { key: key });
  }

  $.each(API_possibilities, function(i, possibility) {
    var el = $('#api-' + possibility);

    if (el.prop('checked') === true) {
      queries.push(parseInt(el.attr('data-query')));
    }
  });

  queries.push(0);

  if ($('#api-player-anonymity').prop('checked') !== true) {
    anonymity = true;
  }

  rHelper.methods.API_init(key, queries, anonymity);
});

$('.nav-link').each(function(i, navLink) {
  $(navLink).on('click', function() {
    toggleTab(navLink.id, navLink.dataset.target);
  });
});

$('#techupgrades-toggle').on('click', function() {
  'use strict';

  var el = $(this);

  if (el.prop('checked') === true) {
    rHelper.methods.INSRT_techUpgradeRows('tu4');
    sorttable.innerSortFunction.apply($('#module-techupgrades th')[4], []);
    sorttable.innerSortFunction.apply($('#module-techupgrades th')[5], []);
    sorttable.innerSortFunction.apply($('#module-techupgrades th')[5], []);
  } else {
    rHelper.methods.INSRT_techUpgradeRows();
  }
});

$('#techupgrades-input').on('input', function() {
  'use strict';

  var _ref2 = [$('#techupgrades-calc-tu4-allowance'), parseFloat(this.value)],
    tu4Allowance = _ref2[0],
    value = _ref2[1];

  if (value >= 1.01 && value <= 5) {
    if (tu4Allowance.prop('checked') === true) {
      rHelper.methods.INSRT_techUpgradeCalculator(value, 'tu4Included');
    } else {
      rHelper.methods.INSRT_techUpgradeCalculator(value);
    }
  }
});

$('#personalmap-create').on('click', function() {
  'use strict';

  if (rHelper.data.mineMap.length === 0 && isLoggedIn) {
    rHelper.methods.API_getMineMap();
  }
});

$('#worldmap-selector').on('change', function() {
  'use strict';

  rHelper.methods.API_getWorldMap(this.value);
  $('#worldmap').css('display', 'block');
});

$('#qualitycomparator-selector').on('change', function() {
  'use strict';

  var _ref3 = [parseInt(this.value), $('#qualitycomparator-quality').val()],
    type = _ref3[0],
    quality = _ref3[1];

  rHelper.methods.INSRT_qualityComparator(type, quality);
});

$('#qualitycomparator-quality').on('input', function() {
  'use strict';

  var _ref4 = [$('#qualitycomparator-selector').val(), parseInt(this.value)],
    type = _ref4[0],
    quality = _ref4[1];

  rHelper.methods.INSRT_qualityComparator(type, quality);
});

$('#attacklog-detailed-selector').on('change', function() {
  'use strict';

  var _ref5 = [this.value, 'attackDetailed', rHelper.data.attackLog.skipCount, rHelper.data.attackLog.data[0].target],
    target = _ref5[0],
    type = _ref5[1],
    skipCount = _ref5[2],
    currentTarget = _ref5[3];

  if (target != currentTarget) {
    skipCount = 0;
  }

  if (parseInt(target) === -1) {
    target = 0;
    skipCount = 0;
  }

  rHelper.methods.API_getAttackLog(type, target, skipCount);
});

$('#attacklog-detailed-next').on('click', function() {
  'use strict';

  var _ref6 = [$('#attacklog-detailed-selector').val(), 'attackDetailed', rHelper.data.attackLog.skipCount + 100],
    target = _ref6[0],
    type = _ref6[1],
    skipCount = _ref6[2];

  rHelper.methods.API_getAttackLog(type, target, skipCount);
});

$('#attacklog-detailed-last').on('click', function() {
  'use strict';

  var _ref7 = [$('#attacklog-detailed-selector').val(), 'attackDetailed', rHelper.data.attackLog.skipCount - 100],
    target = _ref7[0],
    type = _ref7[1],
    skipCount = _ref7[2];

  rHelper.methods.API_getAttackLog(type, target, skipCount);
});

$('#tradelog-next').on('click', function() {
  'use strict';

  var _ref8 = [rHelper.data.tradeLog.skipCount - 1, $('#tradelog-filter-event').val(), $('#tradelog-filter-day').val()],
    skipCount = _ref8[0],
    filter = _ref8[1],
    dateFilter = _ref8[2];

  if (skipCount >= 0) {
    rHelper.methods.API_getTradeLog(skipCount, filter, dateFilter);
  }
});

$('#tradelog-previous').on('click', function() {
  'use strict';

  var _ref9 = [rHelper.data.tradeLog.skipCount + 1, $('#tradelog-filter-event').val(), $('#tradelog-filter-day').val()],
    skipCount = _ref9[0],
    filter = _ref9[1],
    dateFilter = _ref9[2];

  if (skipCount >= 0) {
    rHelper.methods.API_getTradeLog(skipCount, filter, dateFilter);
  }
});

$('#tradelog-filter-event').on('change', function() {
  'use strict';

  var _ref10 = [this.value, rHelper.data.tradeLog.skipCount, $('#tradelog-filter-day').val(), rHelper.data.tradeLog.filter],
    filter = _ref10[0],
    skipCount = _ref10[1],
    dateFilter = _ref10[2],
    currentFilter = _ref10[3];

  if (filter != currentFilter) {
    rHelper.methods.API_getTradeLog(skipCount, filter, dateFilter);
  }
});

$('#tradelog-filter-day').on('change', function() {
  'use strict';

  var _ref11 = [this.value, 0, $('#tradelog-filter-event').val()],
    dateFilter = _ref11[0],
    skipCount = _ref11[1],
    filter = _ref11[2];

  rHelper.methods.API_getTradeLog(skipCount, filter, dateFilter);
});

$.each([$('#tos-trigger'), $('#contact-trigger'), $('#donate-trigger')], function(i, el) {
  var targets = ['module-tos', 'module-contact', 'module-donate'];
  var target = targets[i];

  $(el).on('click', function() {
    $.each($('main > div'), function(i, el) {
      if (el.id != target) {
        $(el).css('display', 'none');
      } else {
        $(el).css('display', 'block');
      }
    });
  });
});

$('#save-button').on('click', function(i, el) {
  var _ref12 = [$('#save-button'), [], [], [], [], [], []],
    btn = _ref12[0],
    amountOfMines = _ref12[1],
    mineRates = _ref12[2],
    warehouseLevels = _ref12[3],
    warehouseFillAmounts = _ref12[4],
    factoryLevels = _ref12[5],
    buildingLevels = _ref12[6];
  var _ref13 = [rHelper.data.headquarter.user.level, rHelper.data.headquarter.user.paid],
    headquarterLevel = _ref13[0],
    headquarterPaid = _ref13[1];

  btn.attr('disabled', true);

  $.each(rHelper.data.material, function(i, dataset) {
    amountOfMines.push(dataset.amountOfMines);
    mineRates.push(dataset.perHour);
    warehouseLevels.push(dataset.warehouse.level);
    warehouseFillAmounts.push(dataset.warehouse.fillAmount);
  });

  $.each(rHelper.data.products, function(i, dataset) {
    factoryLevels.push(dataset.factoryLevel);
    warehouseLevels.push(dataset.warehouse.level);
    warehouseFillAmounts.push(dataset.warehouse.fillAmount);
  });

  $.each(rHelper.data.loot, function(i, dataset) {
    warehouseLevels.push(dataset.warehouse.level);
    warehouseFillAmounts.push(dataset.warehouse.fillAmount);
  });

  $.each(rHelper.data.units, function(i, dataset) {
    warehouseLevels.push(dataset.warehouse.level);
    warehouseFillAmounts.push(dataset.warehouse.fillAmount);
  });

  $.each(rHelper.data.buildings, function(i, dataset) {
    buildingLevels.push(dataset.level);
  });

  var payload = {
    amountOfMines: amountOfMines,
    mineRates: mineRates,
    warehouseLevels: warehouseLevels,
    warehouseFillAmounts: warehouseFillAmounts,
    factoryLevels: factoryLevels,
    buildingLevels: buildingLevels,
    headquarterLevel: headquarterLevel,
    headquarterPaid: headquarterPaid
  };

  $.post({
    url: 'api/saveCustomData.php',
    data: {
      data: payload
    },
    success: function success() {
      btn.attr('disabled', false);
      swal('Saved', 'Your data has been successfully saved!', 'success');
    }
  });
});

var showTimeoutSwal = function showTimeoutSwal() {
  swal({
    title: 'Session expiry notice',
    html: 'You will be logged out in <span id="expiry-timer">30</span> seconds.',
    timer: 30000,
    type: 'info',
    showCancelButton: true,
    confirmButtonText: 'Logout',
    cancelButtonText: 'No, I want to stay logged in.',
    confirmButtonClass: 'btn btn-danger mr-1',
    cancelButtonClass: 'btn btn-success ml-1',
    buttonsStyling: false
  }).then(function(result) {
    if (!result.dismiss) {
      location.replace('?logout');
    } else {
      location.reload();
    }
  });

  window.setInterval(function() {
    var expiryTimer = $('#expiry-timer');
    var currentVal = parseInt(expiryTimer.innerText);

    if (currentVal > 1) {
      expiryTimer.innerText = currentVal - 1;
    }
  }, 1000);
};
