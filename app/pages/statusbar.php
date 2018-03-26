<!-- statusbar -->

<div class="col-xl-6 col-lg-6 col-md-12 col-sm-12 p-4" id="statusbar">

	<div class="row">
		<div class="col text-right">
			Logged in as: <code><?php echo $_SESSION["mail"]; ?></code>
		</div>
	</div>

	<div class="row">
		<div class="col text-right mt-1">
			 <a href="#settings" onclick="return false;" class="btn btn-secondary" id="settings-toggler"><span><?php echo file_get_contents("assets/img/icons/gear.svg"); ?></span> Settings</a> <a href="?logout" class="btn btn-danger">Logout</a>
		</div>
	</div>

  <div class="row">
    <div class="col text-right mt-1">
      Company worth: <span id="company-worth">0</span>
    </div>
  </div>
  <div class="row">
    <div class="col text-right mt-1">
      Effective hourly income: <span id="effective-hourly-income">0</span>
    </div>
  </div>
</div>
