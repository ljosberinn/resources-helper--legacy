loadingAnimToggler = (mode, text) => {

  $("#loading-text").text(text);

  let possibleAnimationClasses = [
    "slide-out-bck-center",
    "puff-out-center",
    "roll-out-blurred-left",
    "slit-out-vertical",
    "rotate-out-center",
  ];
  let rndAnimation = possibleAnimationClasses[Math.floor(Math.random() * possibleAnimationClasses.length)];

  switch (mode) {
  case "hide":
    $("#loading-container svg").addClass(rndAnimation);
    $("#loading-container span").each((i, obj) => {
      $(obj).fadeOut(750);
    });

    window.setTimeout(function () {
      $("#loading-container").hide();
      $("#loading-container svg").removeClass(rndAnimation);
      $("#loading-container span").each((i, obj) => {
        $(obj).fadeIn(750);
      });

    }, 750);
    break;
  case "show":
    $("#loading-container").show();
    break;
  }
}

/* src https://www.w3schools.com/js/js_cookies.asp */

getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

crEl = (tag) => {
  return document.createElement(tag);
}

Array.prototype.min = function () {
  return Math.min.apply(null, this);
}

Array.prototype.max = function () {
  return Math.max.apply(null, this);
}

applyTippyOnNewElement = (el) => {

  if (!el.hasClass("tippied")) {
    tippy(el[0], {
      dynamicTitle: true
    });
  }
}

changeElementClasses = (el, rmvClass, addClass) => {
  let $el = $(el);

  if ($.isArray(rmvClass)) {
    $.each(rmvClass, (i, className) => {
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
}

switchActiveNavigationLink = (selectedNav) => {
  $(".nav-link").each((i, navLink) => {
    if (selectedNav == navLink.id) {
      $(navLink).addClass("active");
    } else {
      $(navLink).removeClass("active");
    }
  });
}

switchActiveModule = (targetId) => {
  $("main > div").each((i, moduleEl) => {
    if (targetId == moduleEl.id) {
      $(moduleEl).css("display", "block");
    } else {
      $(moduleEl).css("display", "none");
    }
  });
}

toggleTab = (selectedNav, targetId) => {

  switchActiveNavigationLink(selectedNav);
  switchActiveModule(targetId);
}


toggleTechUpgradeInfo = (mode) => {

  let loading = $("#techupgrades-loading");
  let finished = $("#techupgrades-finished");

  let loadingChange = "";
  let finishedChange = "";

  switch (mode) {
  case "start":
    loadingChange = "flex";
    finishedChange = "none";
    break;
  case "end":
    loadingChange = "none";
    finishedChange = "inline-block";
    break;
  }

  loading.css("display", loadingChange);
  finished.css("display", finishedChange);
}
