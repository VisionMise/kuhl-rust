/** Information
 * Kuhl Magma Test
 * 09-2014 - Geoffrey Kuhl
 */



/** Main Class API
 *
 * API Object
 */
	var $ 	= function api() {



		/** Variables
		 *
		 * The scope is limited to this object
		 */

			/**
			 * Result Variable for method returns
			 * to be sent to callbacks.
			 */
			var result;



		/** Hooks
		 * 
		 * These can extend this object to external
		 * callback functions. These function are to be set
		 * prior to usage.
		 *
		 * @example
		 * $.callback_pre_command 	= function(player, cmd, args) {
		 * 	//My Function Code Here
		 * };
		 *
		 * Then when $.command() is called, the callback
		 * function will be called first.
		 */

			/**
			 * Pre-Command Callback
			 * Called before a command is called
			 */
			this.callback_pre_command	= function(player, cmd, args) {}


			/**
			 * Post-Command Callback
			 * Called after a command is called
			 */
			this.callback_post_command	= function(player, result) {}


			this.callback_player_hurt 	= function(player, hurtEvent) {}
			this.callback_player_death 	= function(player, deathEvent) {}
			this.callback_npc_killed 	= function(player, npc, deathEvent) {}
			this.callback_npc_hurt 		= function(player, npc, hurtEvent) {}
			this.callback_xp_gain 		= function(player, xp, level) {}
			this.callback_xp_lost 		= function(player, xp, level) {}



		/** Private Methods 
		 *
		 * These below methods' scope is not
		 * actually limited privately here. This
		 * is for organization. These funcation
		 * should only be called from within this
		 * object and not from other sources.
		 */

			/**
			 * Construct
			 * The initial construct function. This is 
			 * called automatically upon instansciation.
			 * 
			 * @return {SELF}
			 */
			this.__construct 	= function() {
				return this;
			}


			/**
			 * Store
			 * Returns an IniParser object representing
			 * the main storage INI file "kuhl.ini"
			 * 
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
			 * the logger storage INI file "log.ini".
			 * 
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
			 * The config holds static and constant data and
			 * is stored in key pairs in INI format.
			 * 
			 * @param  {String} key  	The Name of the item to retrieve
			 * @return {String} 		The value of the named key
			 */
			this.config 		= function(section, key) {
				return Data.GetConfigValue("kuhl", section, key);
			}


			/**
			 * Save Player Property
			 * @param  {[type]} player
			 * @param  {[type]} prop
			 * @param  {[type]} value
			 * @return {[type]}
			 */
			this.savePlayerProp	= function(player, prop, value) {
				var store 	= this.store();
				var key 	= player.GameID;

				store.AddSetting(key, prop, value);
				store.Save();

				return this.getPlayerProp(player, prop);
			}


			/**
			 * Get Player Property
			 * @param  {[type]} player
			 * @param  {[type]} prop
			 * @return {[type]}
			 */
			this.getPlayerProp 	= function(player, prop) {
				var store 	= this.store();
				var key 	= player.GameID;

				return store.GetSetting(key, prop);
			}


		
		/** Public Methods
		 *
		 * The below method can be called from other sources
		 * and are primarily used by the Magma Hook Functions.
		 * These both extend magma and the plugin and well as 
		 * any other objects.
		 */

			/**
			 * Send Message
			 * @param  {Object} player 		The Player Object from the Hook
			 * @param  {String} msg 		The Text Message to Send
			 * @return {SELF}
			 */
			this.sendMsg 		= function(player, msg, type) {
				var name 		= this.config("plugin", "name");
				var logit 		= true;

				if (typeKey) {
					var typeKey 	= "report_" + type;
					var typeValue 	= this.config("reporting", typeKey);

					if (typeValue) {
						logit 		= (typeValue == "true");
					}
				}

				if (logit) {
					player.MessageFrom(name, msg);
				}

				return this;
			}


			/**
			 * Log Item
			 * @param  {String} 	text 	The Text to log
			 * @param  {String} 	section	The Referrer
			 * @return {SELF}
			 */
			this.logItem 		= function(text, section) {
				var ini = this.logger();
					ini.AddSetting("log", text, section);
					ini.Save();

				return this;
			}


			/**
			 * Command
			 *
			 * The Main Command Interpreter for the input
			 * received from the Magma Hook Function "On_Command()".
			 *
			 * This function will call callback_pre_command before the
			 * command is interpreted and callback_post_command after
			 * the command is executed if it exists and if they have
			 * been set externally.
			 * 
			 * @param  {Player} player 		The Player object passed from the Hook
			 * @param  {String} cmd 		The command the player entered
			 * @param  {Array} 	args 		An array of any other arguments the player added to the command
			 * @return {SELF}
			 */
			this.command 		= function(player, cmd, args) {

				this.callback_pre_command(player, cmd, args);
				
				switch(cmd) {

					case 'test': 
						var msg 	= this.config("plugin", "test message");
						result 		= this.sendMsg(player, msg);
					break;

					case 'xp':
						var msg 	= "XP: " + this.playerXP();
						result 		= this.sendMsg(player, msg);
					break;

				}

				this.callback_post_command(player, result);

				return this;
			}


			/**
			 * Connect
			 * @param  {Player} player 		The Player object passed from the hook
			 * @return {SELF}
			 */
			this.connect 		= function(player) {
				if (player.Admin == true) {
					this.sendMsg(player, "Welcome Administrator " + player.Name);
				} else {
					this.sendMsg(player, "Welcome " + player.Name);
				}
			}


		/**
		 * Player
		 */
		
			/**
			 * Player XP
			 * @param  {[type]} player
			 * @return {[type]}
			 */
			this.playerXP 		= function(player) {
				var store 	= this.store();
				var xp 		= store.GetSetting(player.GameID, "xp");

				if (!xp || parseInt(xp) <= 0) xp = 1;
				return xp;
			}
		
		

		/** Attacking
		 * Events
		 */
		
			/**
			 * Player Hurt Event
			 * @param  {[type]} player
			 * @param  {[type]} hurtEvent
			 * @return {[type]}
			 */
			this.playerHurt 	= function(player, hurtEvent) {

				//this.playerLoseXP(player, 'player_hurt');
				this.callback_player_hurt(player, hurtEvent);

				return this;
			}


			/**
			 * Player Killed Event
			 * @param  {[type]} player
			 * @param  {[type]} deathEvent
			 * @return {[type]}
			 */
			this.playerKilled 		= function(player, deathEvent) {

				//this.playerLoseXP(player, 'player_killed');
				this.callback_player_death(player, deathEvent);

				return this;
			}


			/**
			 * NPC Killed Event
			 * @param  {[type]} player
			 * @param  {[type]} npc
			 * @param  {[type]} deathEvent
			 * @return {[type]}
			 */
			this.npcKilled 	= function(player, npc, deathEvent) {

				//this.playerGainXP(player, 'npc_killed');
				this.callback_npc_killed(player, npc, deathEvent);				

				return this;	
			}


			/**
			 * NPC Hurt Event
			 * @param  {[type]} player
			 * @param  {[type]} npc
			 * @param  {[type]} hurtEvent
			 * @return {[type]}
			 */
			this.npcHurt 		= function(player, npc, hurtEvent) {

				//this.playerGainXP(player, 'npc_hurt');
				this.callback_npc_hurt(player, npc, hurtEvent);

				return this;
			}



		/** Return
		 * Instansciate this object and return self
		 */
			return this.__construct();
	}



/** Create Class
 * Instansciate
 */
	$ 		= $();



/** Magma
 * Magma Plugin Hooks
 */

	function On_Command(player, cmd, args) {
		$.command(player, cmd, args);
	}

	function On_PlayerConnected(player) {
		$.connect(player);
	}

	function On_PlayerHurt(hurtEvent) {
		var player 	= hurtEvent.Victim;
		var npc 	= hurtEvent.Attacker;

		var hText 	=
			npc.Name 				+ 
			" hit you with " 		+
			hurtEvent.DamageType 	+
			" damage for " 			+
			hurtEvent.DamageAmount 	+ 
			" points "
		;

		$ //With
			.playerHurt(player, hurtEvent)
			.sendMsg(player, hText, 'player')
		; //End With
	}

	function On_NPCKilled(deathEvent) {
		var player 	= deathEvent.Attacker;
		var npc 	= deathEvent.Victim;

		var dText 	=
			"You killed " +
			npc.Name
		;

		$ //With
			.npcKilled(player, npc, deathEvent)
			.sendMsg(player, dText, 'npc')
		; //End With
	}

	function On_PlayerKilled(deathEvent) {
		var player 	= deathEvent.Victim;
		var npc 	= deathEvent.Attacker;

		var dText 	=
			npc.Name + 
			" killed you "
		;

		$ //With
			.playerKilled(player, deathEvent)
			.sendMsg(player, dText, 'player')
		; //End With
	}

	function On_NPCHurt(hurtEvent) {
		var player 	= hurtEvent.Attacker;
		var npc 	= hurtEvent.Victim;

		var hText 	=
			"You hit " 				+
			npc.Name 				+ 
			" with " 				+
			hurtEvent.DamageType 	+
			" damage for " 			+
			hurtEvent.DamageAmount 	+ 
			" points "
		;

		$ //With
			.npcHurt(player, npc, hurtEvent)
			.sendMsg(player, hText, 'npc')
		; //End With
	}
