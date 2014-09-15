<?php

	class engine {

		private $param;
		private $queue;

		protected $uid;
		protected $store;

		function __construct(array $param = array()) {
			$this->queue 	= array();
			$this->param 	= $param;
			$this->uid 		= $param['id'];
			$this->store 	= new storage($this->uid);

			$this->evaluate($this->processInput());
		}

		private function evaluate($result) {

			if ($result === false) {
				$this->addMessage("Errors were encountered");
			} elseif ($result === true) {
				$this->addMessage("What?");
			} elseif (is_array($result)) {
				$msgs 	= (isset($result['messages'])) ? $result['messages'] : array();
				$cmds 	= (isset($result['commands'])) ? $result['commands'] : array();

				foreach ($msgs as $m) {
					$this->addMessage($m);
				}

				foreach ($cmds as $c => $a) {
					$this->addCommand($c, $a);
				}
			}

		}

		private function processInput() {
			$args 		= (isset($this->param['args'])) ? $this->param['args'] : array();

			if (isset($this->param['event'])) {
				$event 			= $this->param['event'];
				raiseEvent($event, $args);
				return true;
			} else {
				$command 	= (isset($this->param['command']))
					? $this->param['command']
					: null 
				;

				$intp 		= new interpreter();

				if (method_exists($intp, $command)) {
					$result 	= $intp->$command($args);
					return $result;
				} else {
					$this->addMessage("Invalid Command");
					return false;
				}
			}

		}

		private function addToQueue($type, $item) {
			$this->queue[] 	= "$type=$item";
		}

		public function addCommand($cmd, array $args = array()) {
			$str 		= "$cmd,".implode(',', $args);
			$this->addToQueue("cmd", $str);
		}

		public function addMessage($msg) {
			$this->addToQueue("msg", $msg);
		}

		public function response() {
			return implode("\n", $this->queue);
		}

	}

?>