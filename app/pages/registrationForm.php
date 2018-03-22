<form class="mb-3" method="POST" action="index.php" id="registration-form">

  <p>
		<small id="registration-star" class="form-text text-muted">
	    Fields with <span class="text-danger">*</span> are required.
	  </small>
	</p>

	<div class="form-group">
		<label for="registration-mail">
			Registration mail <span class="text-danger">*</span>
		</label>

		<input
		required
		type="email"
		class="form-control"
		id="registration-mail"
		name="registration-mail"
		placeholder="Registration mail"
		aria-describedby="registration-help" />

		<small id="registration-help" class="form-text text-muted">
			Registration is purely for authentification purposes. You will not receive any mails.
		</small>
	</div>

	<div class="form-group">
		<label for="registration-pw-1">
			Registration password <span class="text-danger">*</span>
		</label>

		<input type="password"
		required
		class="form-control"
		id="registration-pw-1"
		placeholder="Registration password"
		aria-describedby="registration-pw-1-help"
		name="registration-pw-1"
		pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$"
    />

		<small id="registration-pw-1-help" class="form-text text-muted">
			Please do not use your game or mail password. Minimum of 4 characters including one number (e.g. "pas1").
		</small>
	</div>

	<div class="form-group">
		<label for="registration-pw-2">
			Repeat password <span class="text-danger">*</span>
		</label>

		<input type="password"
		required
		class="form-control"
		id="registration-pw-2"
		name="registration-pw-2"
		placeholder="Repeat password"
		pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$"
    />
	</div>

	<div class="form-group">
		<label for="registration-api-key">
			API key
		</label>

		<input type="text"
		class="form-control"
		id="registration-api-key"
		name="registration-api-key"
		placeholder="API key"
		aria-describedby="registration-api-key-help"
		pattern="^[a-f0-9]{45}"
    />

		<small id="registration-api-key-help" class="form-text text-muted">
			Leave this field empty if you don't have a key or don't want it to be saved.
		</small>
	</div>

	<div class="form-group">
		<select required class="custom-select" name="registration-language" id="registration-language">
				<option selected disabled value="">select your preferred language</option>

				<?php

        $languageQuery = "SELECT * FROM `languages` WHERE `active` = 1 ORDER BY `short` ASC";
        $getLanguages = $conn->query($languageQuery);

        if ($getLanguages->num_rows > 0) {
            while ($language = $getLanguages->fetch_assoc()) {
                echo '
		     <option value="' .$language["id"]. '">' .$language["short"]. ' | ' .$language["name"]. '</option>';
            }
        } else {
            echo '
		     <option value="" disabled>
					Sorry, server seems to be unavailable. Please try again later! If this issue persists, please write a mail to admin@gerritalex.de
				</option>';
        }

        ?>
			</select> <span class="text-danger">*</span>
	</div>

	<button class="btn btn-success" type="submit" id="registration-submit">
		Register
	</button>
	<button class="btn btn-danger" id="registration-reset-fields" type="button">
		Reset fields
	</button>
</form>
