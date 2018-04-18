<?php

/**
 * @method public explodeGET($get)
 * @param array $get [$_GET]
 * @return string [$_GET as key => value string (ex. "abc=def&ghi&...")]
 */
function explodeGET($get)
{
    $string = "?";

    foreach ($get as $key => $value) {
        if (!empty($value)) {
            $string .= $key. "=" .$value. "&";
        } else {
            $string .= $key. "&";
        }
    }

    return $string;
}


/**
 * @method public connect()
 * @return object [mysqli object]
 */
function connect()
{
    include_once "db.php";
    $conn = new mysqli($host, $user, $pw, $db);
    $conn->set_charset("UTF-8");

    return $conn;
}


/**
 * @method public appendJSFiles
 * @param array $files [$ownJSFiles, relative links to file]
 * @return string [script link]
 */
function appendFiles($files)
{
    foreach ($files as $link => $subInfo) {
        $lastModified = date("Y-m-d H:i:s", filemtime($link));

        $mode = $subInfo["mode"];
        $params = $subInfo["params"];

        $link .= $params;

        if (empty($params)) {
            $link = $link."?";
        }

        if($subInfo["type"] == "js") {
            echo '
            <script ' .$mode. ' src="' .$link. '' .$lastModified. '"></script>';
        } else if($subInfo["type"] == "css") {
            echo '
            <link rel="stylesheet" href="' .$link. '' .$lastModified. '" />';
        }
    }
}



/**
 * @method public showInvalidityWarning
 * @param string $message [message to be shown]
 * @return string [html]
 */
function showInvalidityWarning($message)
{
    return '
	<div class="alert alert-warning" role="alert">
		Warning: ' .$message. '
	</div>';
}

/**
 * @method public pregMail
 * @param string $mail [mial adress to be validated]
 * @return bool [true/false]
 */
function pregMail($mail)
{
    if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
        return false;
    } else {
        return true;
    }
}

/**
 * @method public validateRegistration
 * @param array $post [all the $_POST-variables]
 * @return bool [basically true false by not redirecting if true]
 */
function validateRegistration($post)
{
    if (isset($_POST["registration-mail"])
        && !empty($_POST["registration-mail"])
        && isset($_POST["registration-pw-1"])
        && !empty($_POST["registration-pw-1"])
        && isset($_POST["registration-pw-2"])
        && !empty($_POST["registration-pw-2"])
        && isset($_POST["registration-language"])
        && !empty($_POST["registration-language"])
        && isset($_POST["registration-api-key"])
    ) {
        $post["registration-mail"] = test_input($post["registration-mail"]);

        if (!filter_var($post["registration-mail"], FILTER_VALIDATE_EMAIL)) {
            header("Location: index.php?missingRegistrationParameter");
        }

        $post["registration-pw-1"] = test_input($post["registration-pw-1"]);
        $post["registration-pw-2"] = test_input($post["registration-pw-2"]);

        if (($post["registration-pw-1"] != $post["registration-pw-2"]) || !is_numeric($post["registration-language"])) {
            header("Location: index.php?invalidRegistration");
        }

        if (preg_match("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{4,}$", $post["registration-pw-1"]) === false || preg_match("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{4,}$", $post["registration-pw-1"]) === false) {
            header("Location: index.php?invalidPasswordExp");
        }
    }
}

/**
 * @method public test_input
 * @param string $data []
 * @return string [stripped data]
 */
function test_input($data)
{
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

/**
 * @method public generateLeaderboardData
 * @return array [leaderboard data]
 */
function generateLeaderboardData()
{
    $result = [];

    $template = [
        "material" => [],
        "products" => [],
        "buildings" => [],
        "headquarter" => [],
        "general" => [],
    ];

    if(!$conn) {
        $conn = connect();
    }

    $userIds = [];
    $getUsersQuery = "SELECT `id` FROM `userOverview` WHERE `hashedKey` != ''";
    $getUsers = $conn->query($getUsersQuery);

    if($getUsers->num_rows > 0) {
        while($userId = $getUsers->fetch_assoc()) {
            array_push($userIds, $userId["id"]);
        }
    }

    foreach($userIds as $userId) {
        $result[$userId] = $template;

        $generalDataQuery = "SELECT `name`, `points`, `rank`, `level`, `registeredGame` FROM `userOverview` WHERE `id` = " .$userId. "";
        $generalData = $conn->query($generalDataQuery);
        while($data = $generalData->fetch_assoc()) {
            $result[$userId]["general"] = $data;
        }

    }


    return $result;
}


/*
$result = generateLeaderboardData();

print_r($result);
*/
