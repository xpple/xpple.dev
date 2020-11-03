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
	exec("ping -c 1 " . $ip . " | head -n 2 | tail -n 1 | awk '{print $7}'", $ping);
	return explode("=", $ping[0])[1];
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
?>