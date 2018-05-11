<!-- statusbar -->

<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 p-4" id="statusbar">

  <div class="row">
    <div class="col text-right"><span id="statusbar-logged-in-as">Logged in as</span>: <code><?php echo $_SESSION["mail"]; ?></code></div>
  </div>

  <div class="row">
    <div class="col text-right mt-1">
      <button class="btn btn-sm btn-success" id="save-button">Save data</button>
      <a href="#settings" onclick="return false;" class="btn btn-secondary" id="settings-toggler"><span><?php echo file_get_contents("assets/img/icons/gear.svg"); ?></span> <span id="statusbar-settings">Settings</span></a> <a href="?logout" class="btn btn-danger">Logout</a>
    </div>
  </div>

  <div class="row">
    <div class="col text-right mt-1"><span id="statusbar-company-worth">Company worth</span>: <span id="company-worth">0</span></div>
  </div>

  <div class="row">
    <div class="col text-right mt-1"><span id="statusbar-effective-income">Effective hourly income</span>: <span id="effective-hourly-income">0</span></div>
  </div>
</div>
