<?php
function getIp() {
	if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
		return $_SERVER['HTTP_CLIENT_IP'];
	}
	elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
		return $_SERVER['HTTP_X_FORWARDED_FOR'];
	}
	else {
		return $_SERVER['REMOTE_ADDR'];
	}
}

function getPing() {
	$ip = getIp();
	/*if (strpos($ip, ":") === false) {
        exec("ping -c 1 " . $ip . " | head -n 2 | tail -n 1 | awk '{print $7}'", $ping);
    }
	else {
        exec("ping -6 -c 1 " . $ip . " | head -n 2 | tail -n 1 | awk '{print $7}'", $ping);
    }*/
	exec("ping -n 3 $ip", $ping);

	/*return explode("=", $ping[0])[1];*/
    echo json_encode($ping);
    return $ping;
}

switch($_SERVER['QUERY_STRING']) {
	case 'ip':
		echo getIp();
		break;
	case 'ping':
		echo getPing();
		break;
	default:
		show_source(__FILE__);
		break;
}
