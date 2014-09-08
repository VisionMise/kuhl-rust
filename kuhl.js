/**
 * Kuhl Magma Test
 * 09-2014 - Geoffrey Kuhl
 */



/**
 * Engine
 * @return {Object}
 */
var $ 	= function api() {



	/** Variables **/

		/** 
		 * Self Reference to this
		 */
		var self 			= this;


		/**
		 * Result Variable for method returns
		 * to be sent to callbacks
		 */
		var result;



	/** Hooks **/

		/**
		 * Pre-Command Callback
		 * Called before a command is called
		 */
		this.callback_pre_command	= function() {}


		/**
		 * Post-Command Callback
		 * Called after a command is called
		 * @return {[type]}
		 */
		this.callback_post_command	= function() {}



	/** Private Methods **/

		/**
		 * Construct
		 * The initial construct function
		 * @return {SELF}
		 */
		this.__construct 	= function() {
			return this;
		}
		

		/**
		 * Store
		 * Returns an IniParser object representing
		 * the main storage INI file "kuhl.ini"
		 * @return {IniParser}
		 */
		this.store 			= function() {
			if (!Plugin.IniExists("kuhl")) {
				Plugin.CreateIni("kuhl");
			}

			return Plugin.GetIni("kuhl");
		}


		/**
		 * Logger
		 * Returns an IniParser object representing
		 * the logger storage INI file "log.ini"
		 * @return {IniParser}
		 */
		this.logger 		= function() {
			if (!Plugin.IniExists("log")) {
				Plugin.CreateIni("log");
			}

			return Plugin.GetIni("log");	
		}


		/**
		 * Config
		 * @param  {String} key of the item to retrieve
		 * @return {String}
		 */
		this.config 		= function(key) {
			return Data.GetConfigValue("kuhl", "plugin", key);
		}

	

	this.sendMsg 		= function(player, msg) {
		var name 		= this.config("name");
		return player.MessageFrom(name, msg);
	}

	this.logItem 		= function(text, section) {
		var ini = this.logger();
			ini.AddSetting("log", text, section);
			ini.Save();

		return this;
	}

	this.command 		= function(player, cmd, args) {
		
		switch(cmd) {

			case 'test': 
				var msg 	= this.config("test message");
				result 		= this.sendMsg(player, msg);
			break;

		}

		return this;
	}	

	return this.__construct();
}


/**
 * Instansciate
 */
$ 		= $();









/**
 * Magma Plugin Hooks
 */

	function On_Command(player, cmd, args) {
		$.command(player, cmd, args);
	}

	function Player_Connect(player) {
		$.command
	}
