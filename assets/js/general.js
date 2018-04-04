"use strict";

$("input").each(function (i, obj) {
	$(obj).click(function () {
		obj.select();
	});
});

$("#registration-reset-fields").click(function () {
	$("#registration-form input").each(function (i, obj) {
		$(obj).val("");
	});
});

$("#registration-form").submit(function (event) {
	var passwordRegex = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{4,}$");
	var pw1El = $("#registration-pw-1");
	var pw2El = $("#registration-pw-2");
	var pw1Val = pw1El.val();
	var pw2Val = pw2El.val();

	$.each([pw1Val, pw2Val], function (i, value) {
		if (value === "") {
			swal("Error", "password empty", "error");
			event.preventDefault();
		}
	});

	if (pw1Val !== pw2Val) {
		swal("Error", "Passwords do not match", "error");
		event.preventDefault();
	}

	$.each([pw1El, pw2El], function (i, obj) {
		if (passwordRegex.test(obj.val()) === false) {
			swal("Invalid password type", "minimum of 4 characters including one number\n(e.g. \"pas1\").", "error");
			event.preventDefault();
		}
	});

	if ($("#registration-language").val() === null) {
		swal("Missing language", "please select a language", "error");
		event.preventDefault();
	}
});

$("#password-change-form").submit(function (event) {
	var passwordRegex = new RegExp("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{4,}$");
	var pwOldEl = $("#settings-current-password");
	var pw1El = $("#settings-new-password-1");
	var pw2El = $("#settings-new-password-2");
	var pwOldElVal = pwOldEl.val();
	var pw1Val = pw1El.val();
	var pw2Val = pw2El.val();

	$.each([pwOldEl, pw1Val, pw2Val], function (i, value) {
		if (value === "") {
			swal("Error", "password empty", "error");
			event.preventDefault();
		}
	});

	if (pw1Val !== pw2Val) {
		swal("Error", "New passwords do not match", "error");
		event.preventDefault();
	}

	if (passwordRegex.test(pwOldEl.val()) === false) {
		swal("Invalid old password", "Your old password does not fit the required pattern: minimum of 4 characters including one number\n(e.g. \"pas1\").", "error");
		event.preventDefault();
	}

	$.each([pw1El, pw2El], function (i, obj) {
		if (passwordRegex.test(obj.val()) === false) {
			swal("Invalid password type", "minimum of 4 characters including one number\n(e.g. \"pas1\").", "error");
			event.preventDefault();
		}
	});
});



$("#login-forgot-password").click(function (e) {
	e.preventDefault();
	swal({
		title: "Reset password for...",
		input: "email",
		inputPlaceholder: "mail",
		showCancelButton: true,
		confirmButtonText: "Continue",
	}).then((result) => {
		if (result.value) {
			$.post({
				url: "api/resetPasswordValidateMail.php",
				data: {
					mail: result.value
				},
				success: function (response) {
					if (response.invalid) {
						swal.showValidationError("Account not found.");
					} else if (response.valid) {
						swal({
							title: "Security token for '" + result.value + "'",
							input: "text",
							showCancelButton: true,
							confirmButtonText: "Validate",
							showLoaderOnConfirm: true,
							allowOutsideClick: () => !swal.isLoading(),
							preConfirm: (token) => {
								return new Promise((resolve) => {
									$.post({
										url: "api/resetPassword.php",
										data: {
											mail: result.value,
											token: token
										},
										success: function (response) {
											if (response.invalid) {
												swal.showValidationError("Invalid security token.");
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

window.setInterval(function () {
	var wait = document.getElementById("loading-dots");

	if (wait) {
		if (wait.innerHTML.length > 3) {
			wait.innerHTML = "";
		} else {
			wait.innerHTML += ".";
		}
	}
}, 1000);

$("#settings-toggler").on("click", function (e) {
	e.preventDefault();

	var settings = $("#module-settings");

	if (settings.css("display") == "block") {
		settings.css("display", "none");
	} else {
		settings.css("display", "block");
	}
});

$("#settings-close").on("click", function (e) {
	e.preventDefault();
	$("#module-settings").css("display", "none");
});

$("#api-submit").on("click", function (e) {
	e.preventDefault();
	this.disabled = true;
	var key = $("#api-key").val().replace(/ /g, "");
	var anonymity = false;

	if (!key || key.length != 45) {
		swal("API Error", "Key missing or too short/long (" + key.length + " instead of 45 characters)", "error");
		return;
	}

	var API_possibilities = [
		"factories",
		"warehouse",
		"buildings",
		"headquarter",
		"mines-summary",
		"mines-detailed",
		"player",
		"attack-log",
		"trade-log",
		"missions",
	];

	var queries = [];

	$.each(API_possibilities, function (i, possibility) {

		var el = $("#api-" + possibility);

		if (el.prop("checked") === true) {
			queries.push(parseInt(el.attr("data-query")));
		}
	});

	queries.push(0);

	if ($("#api-player-anonymity").prop("checked") !== true) {
		anonymity = true;
	}

	rHelper.methods.API_init(key, queries, anonymity);
});

$(".nav-link").each(function (i, navLink) {
	$(navLink).on("click", function () {

		toggleTab(navLink.id, navLink.dataset.target);
	});
});

$("#techupgrades-toggle").on("click", function () {
	var el = $(this);

	if (el.prop("checked") === true) {
		rHelper.methods.INSRT_techUpgradeRows("tu4");
		sorttable.innerSortFunction.apply($("#module-techupgrades th")[4], []);
		sorttable.innerSortFunction.apply($("#module-techupgrades th")[5], []);
		sorttable.innerSortFunction.apply($("#module-techupgrades th")[5], []);
	} else {
		rHelper.methods.INSRT_techUpgradeRows();
	}
});

$("#techupgrades-input").on("input", function () {

	var tu4Allowance = $("#techupgrades-calc-tu4-allowance");
	var value = parseFloat(this.value);

	if (value >= 1.01 && value <= 5) {
		if (tu4Allowance.prop("checked") === true) {
			rHelper.methods.INSRT_techUpgradeCalculator(value, "tu4Included");
		} else {
			rHelper.methods.INSRT_techUpgradeCalculator(value);
		}
	}
});

$("#personalmap-create").on("click", function () {
	if (rHelper.data.mineMap.length == 0) {
		rHelper.methods.API_getMineMap();
	}
});

$("#worldmap-selector").on("change", function () {
	rHelper.methods.API_getWorldMap(this.value);	
});
