<form class="mb-3" id="password-change-form" method="POST" action="api/changePassword.php">

    <!-- SETTING CHANGE PASSWORD -->
    <div class="form-group">
        <label class="text-success">
            <strong><?php echo file_get_contents ("assets/img/icons/security.svg"); ?> <span id="change-pw-txt">Change password</span></strong>
        </label>

        <br/>

        <div class="input-group mb-1 mt-1">

            <input
                    class="form-control col-md-12 col-xl-6"
                    id="settings-current-password"
                    name="settings-current-password"
                    type="password"
                    pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$"
                    placeholder="current password"
                    required
            />

        </div>

        <div class="input-group mb-1 mt-1">

            <input
                    class="form-control col-md-12 col-xl-6"
                    id="settings-new-password-1"
                    name="settings-new-password-1"
                    type="password"
                    pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$"
                    placeholder="enter new password"
                    required
            />

        </div>

        <div class="input-group mb-1 mt-1">

            <input
                    class="form-control col-md-12 col-xl-6"
                    id="settings-new-password-2"
                    name="settings-new-password-2"
                    type="password"
                    pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$"
                    placeholder="repeat new password"
                    required
            />

        </div>

        <small class="form-text text-warning" id="change-pw-desc">
            Warning: your password will be changed instantly and you will be forced to login again!
        </small>
    </div>

    <button class="btn btn-danger" id="general-settings-password-change-submit" type="submit">
        Change password
    </button>
</form>

<form class="mb-3" id="account-deletion-form" method="POST" action="api/deleteAccount.php">
    <!-- SETTING DELETE ACCOUNT -->
    <div class="form-group">
        <label class="text-success">
            <strong><?php echo file_get_contents ("assets/img/icons/delete.svg"); ?> <span id="delete-acc-txt">Delete account</span></strong>
        </label>

        <br/>

        <div class="input-group mb-1 mt-1">

            <input
                    class="form-control col-md-12 col-xl-6"
                    id="settings-confirm-account-deletion"
                    name="settings-confirm-account-deletion"
                    type="text"
                    placeholder="security token"
                    pattern="^[a-f0-9]{32}$"
                    required
            />

        </div>

        <small class="form-text text-warning" id="delete-acc-desc">
            Warning: your account will be deleted instantly! This will remove any trace of personal settings and/or values permanently.
        </small>
    </div>

    <button class="btn btn-warning" id="general-settings-delete-account-submit" type="submit">
        Delete account
    </button>
</form>
