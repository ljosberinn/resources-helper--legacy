function loadingAnimToggler(mode, text) {

	$("#loading-text").text(text);

	var possibleAnimationClasses = [
			"slide-out-bck-center",
			"puff-out-center",
			"roll-out-blurred-left",
			"slit-out-vertical",
			"rotate-out-center",
		],
		rndAnimation = possibleAnimationClasses[Math.floor(Math.random() * possibleAnimationClasses.length)];

	switch (mode) {
		case "hide":
			$("#loading-container svg").addClass(rndAnimation);
			$("#loading-container span").each(function(i, obj) {
				$(obj).fadeOut(750);
			});

			window.setTimeout(function() {
				$("#loading-container").hide();
				$("#loading-container svg").removeClass(rndAnimation);
				$("#loading-container span").each(function(i, obj) {
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

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function crEl(tag) {
	return document.createElement(tag);
}

Array.prototype.min = function() {
	return Math.min.apply(null, this);
}

Array.prototype.max = function() {
	return Math.max.apply(null, this);
}

function applyTippyOnNewElement(el) {

	if (!el.hasClass("tippied")) {
		tippy(el[0], {
			dynamicTitle: true
		});
	}
}

function changeElementClasses(el, rmvClass, addClass) {
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
}

function switchActiveNavigationLink(selectedNav) {
  $(".nav-link").each(function(i, navLink) {
		if(selectedNav == navLink.id) {
			$(navLink).addClass("active");
		} else {
			$(navLink).removeClass("active");
		}
	});
}

function switchActiveModule(targetId) {
  $("main > div").each(function(i, moduleEl) {
		if(targetId == moduleEl.id) {
			$(moduleEl).css("display", "block");
		} else {
			$(moduleEl).css("display", "none");
		}
	});
}

function toggleTab(selectedNav, targetId) {

  switchActiveNavigationLink(selectedNav);
  switchActiveModule(targetId);	
}
