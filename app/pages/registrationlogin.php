<div class="col bg-light mb-3 mt-3 p-4" id="module-registrationlogin">
  <h6>Registration & Login</h6>
  <hr class="mb-3" />

  <div class="row">
    <div id="registration-accordion" role="tablist" aria-multiselectable="true" class="col">
      <div class="card">
        <div class="card-header bg-dark" role="tab" id="headingOne">
          <h5 class="mb-0">
            <a data-toggle="collapse" data-parent="#registration-accordion" href="#collapse-registration" aria-expanded="true" aria-controls="collapse-registration">
              Registration
            </a>
          </h5>
        </div>

        <div id="collapse-registration" class="collapse show" role="tabpanel" aria-labelledby="headingOne">
          <div class="card-block p-4 bg-light">
            <?php

            if (isset($_GET["invalidRegistration"])) {
                echo showInvalidityWarning("passwords did not match.");
            } elseif (isset($_GET["invalidPasswordExp"])) {
                echo showInvalidityWarning("password contains invalid pattern.");
            } elseif (isset($_GET["missingRegistrationParameter"])) {
                echo showInvalidityWarning("some info is either missing or invalid. Please try again.");
            }

            require "app/pages/registrationLogin/registrationForm.php";

             ?>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-header bg-dark" role="tab" id="headingTwo">
          <h5 class="mb-0">
            <a class="collapsed" data-toggle="collapse" data-parent="#registration-accordion" href="#collapse-login" aria-expanded="false" aria-controls="collapse-login">
              Login
            </a>
          </h5>
        </div>
        <div id="collapse-login" class="collapse" role="tabpanel" aria-labelledby="headingTwo">
          <div class="card-block p-4 bg-light">
            <?php

            require "app/pages/registrationLogin/loginForm.php";

            ?>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
