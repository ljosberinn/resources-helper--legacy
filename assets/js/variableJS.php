<?php
ob_start();

header("Content-type: application/x-javascript");

session_start();

ob_end_flush();

$toggleRegistrationLoginForms = '$("#collapse-registration").removeClass("show");$("#collapse-login").addClass("show");';

if (isset($_GET["changePasswordNoMatch"])) {
    echo 'swal("Error", "Passwords did not match.", "error");';
} elseif (isset($_GET["goodbye"])) {
    echo 'swal({ title: "Deletion completed", text: "Sad to see you go. Goodbye!", type: "info", confirmButtonText: "Bye", onClose: function() { location.replace("index.php?logout"); } });';
} elseif (isset($_GET["settingsSaved"])) {
    echo 'swal("Success", "Settings saved!", "success");';
} elseif (isset($_GET["invalidCredentials"])) {
    echo $toggleRegistrationLoginForms. ' swal("Error", "Invalid credentials.", "error");';
} elseif (isset($_GET["passwordResetSuccess"])) {
    echo $toggleRegistrationLoginForms. ' swal("Success", "Password for <code class=\"rounded\">' .$_GET["passwordResetSuccess"]. '</code> has been reset to:<br/></br/><code class=\"rounded\">resourcesHelper1992</code><br /><br />Please login and change your password!", "success")';
} elseif (isset($_GET["successfulRegistration"]) && isset($_GET["token"])) {
    echo $toggleRegistrationLoginForms. ' swal("Account created:<br />' .$_GET["successfulRegistration"]. '", "Your security token is:<br /><br />' .$_GET["token"]. '<br /><br />Your token is required to reset your password in case you forget it. You may login now.", "success");';
} elseif (isset($_COOKIE["returningUser"])) {
    echo $toggleRegistrationLoginForms;
} elseif (isset($_GET["duplicateRegistrationMail"])) {
    echo '
    swal({
      title: "Duplicate mail:<br />' .$_GET["duplicateRegistrationMail"]. '",
      text: "This mail is already registered.",
      type: "warning",
      showCancelButton: true,
      confirmButtonText: "OK",
      cancelButtonText: "Reset password",
      confirmButtonClass: "btn btn-success ml-1",
      cancelButtonClass: "btn btn-danger mr-1",
      buttonsStyling: false,
      reverseButtons: true
    }).then((result) => {
      if (result.dismiss) {
        swal({
          title: "Security token for ' .$_GET["duplicateRegistrationMail"]. '",
          input: "text",
          showCancelButton: true,
          confirmButtonText: "Validate",
          showLoaderOnConfirm: true,
          allowOutsideClick: () => !swal.isLoading(),
          preConfirm: (token) => {
            return new Promise((resolve) => {
              $.post({
                url: "api/resetPassword.php",
                  data: { mail: "' .$_GET["duplicateRegistrationMail"]. '", token: token },
                success: function(response) {
                  if(response.invalid) {
                    swal.showValidationError("Invalid security token.");
                  } else if(response.url) {
                    location.replace(response.url);
                  }
                  resolve();
                }
              })
            })
          }
        })
      }
    })';
}

if (isset($_SESSION["id"])) {
    echo '
$(document).ready(function() {
  setTimeout(showTimeoutSwal, 1410000);
  console.log("Session will expire at " + new Date(Date.now() + 1410000) + " - expiry notice fired.");
})';
}
