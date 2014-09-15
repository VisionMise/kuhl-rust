<?php

	class storage {

		protected $folder;
		protected $name;
		protected $path;

		public $settings;

		function __construct($name) {

			$this->folder 	= 'store';
			$this->name 	= $name;
			$this->path 	= realpath($this->folder) ."/$name.conf";

			if (!file_exists($this->path)) touch($this->path);
			$this->load();
		}

		function __get($key) {
			return (isset($this->settings[$key])) ? $this->settings[$key] : null;
		}

		function __set($key, $value) {
			$this->settings[$key] 	= $value;

			$this->save();
			$this->load();
		}

		protected function save() {
			$json 	= json_encode($this->settings);
			return $this->write($json);
		}

		protected function load() {
			$this->settings = json_decode($this->read(), true);
			return true;
		}

		private function write($data) {
			return file_put_contents($this->path, $data);
		}

		private function read() {
			return file_get_contents($this->path);
		}

	}

?>