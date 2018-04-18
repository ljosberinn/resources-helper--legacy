<form class="mb-3" method="POST" action="index.php" id="login-form">

    <div class="form-group">
        <label for="login-mail">
            Login mail
        </label>

        <input
        required
        type="email"
        class="form-control"
        id="login-mail"
        name="login-mail"

        <?php

    if (isset($_GET["passwordResetSuccess"]) || isset($_GET["successfulRegistration"]) || isset($_COOKIE["returningUser"])) {
        $possibleValues = [
            $_GET["passwordResetSuccess"],
            $_GET["successfulRegistration"],
            $_COOKIE["returningUser"],
          ];

        foreach ($possibleValues as $value) {
            if (!empty($value)) {
                echo 'value="' .$value. '"';
            }
        }
    }

    ?>
        placeholder="Login mail" />
    </div>

    <div class="form-group">
        <label for="login-pw">
            Login password
        </label>

        <input type="password"
        required
        class="form-control"
        id="login-pw"
        placeholder="Login password"
        name="login-pw"
        pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$">
    </div>

    <button class="btn btn-success" type="submit" id="login-submit">
        Login
    </button>
    <button class="btn btn-danger" id="login-forgot-password" type="button">
        Reset password
    </button>
</form>
