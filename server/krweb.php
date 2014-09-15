<?php


	print init($_POST);
	exit();




	function init(array $param = array()) {
		global $store;
		global $engine;

		ini_set('display_errors', '1');
		ini_set('error_reporting', 'E_ALL');

		include('system/store.php');
		include('system/events.php');
		include('system/interpreter.php');
		include('system/engine.php');

		$engine 	= new engine($param);
		
		return $engine->response();
	}

?>