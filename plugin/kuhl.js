/** Information
 * Kuhl Magma Test
 * 09-2014 - Geoffrey Kuhl
 */



/** Main Class
 *
 * Main Object
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


			/**
			 * Post Player get Hurt By NPC Event Callback
			 * @param  {player} 	player    
			 * @param  {hurtEvent} hurtEvent
			 */
			this.callback_player_hurt 	= function(player, hurtEvent) {}


			/**
			 * Post Player Die from NPC Event Callback
			 * @param  {player} 	player    
			 * @param  {deathEvent} deathEvent
			 */
			this.callback_player_death 	= function(player, deathEvent) {}


			/**
			 * Post Player kills NPC Event Callback
			 * @param  {player} 	player    
			 * @param  {player} 	npc    
			 * @param  {deathEvent} deathEvent
			 */
			this.callback_npc_killed 	= function(player, npc, deathEvent) {}


			/**
			 * Post NPC get Hurt By Player Event Callback
			 * @param  {player} 	player    
			 * @param  {hurtEvent} hurtEvent
			 */
			this.callback_npc_hurt 		= function(player, npc, hurtEvent) {}


			/**
			 * Post Player Gain XP Callback
			 * @param  {Player} 	player 
			 * @param  {Integer} 	xp     
			 * @param  {Integer} 	level 
			 */
			this.callback_xp_gain 		= function(player, xp, level) {}


			/**
			 * Post Player Lose XP Callback
			 * @param  {Player} 	player 
			 * @param  {Integer} 	xp     
			 * @param  {Integer} 	level 
			 */
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

				var avail 		= this.webServerAvailable(player);
				if (!avail) {
					sendMsg(player, "Cannot connect to server", 'error');
					return this;
				}

				return this.webCommand(player, cmd, args);
			}

			this.webCommand 	= function(player, cmd, args) {

				var url 		= this.config('server', 'url');
				var uid 		= player.GameID;
				var query 		= 'id=' + uid + '&command=' + cmd;

				url += '/krweb.php';
				for (var arg in args) {
					query += "&args[]=" + arg;
				}

				var response 	= Web.POST(url, query)
				var resp 		= response.split("\n");
				for (var line in resp) {
					this.evaluateResponse(player, line, resp[line]);
				}

				return this;
			}

			this.webEvent 		= function(player, cmd, args) {

				var url 		= this.config('server', 'url');
				var uid 		= player.GameID;
				var query 		= 'id=' + uid + '&event=' + cmd;

				url += '/krweb.php';
				for (var arg in args) {
					query += "&args[]=" + arg;
				}

				var response 	= Web.POST(url, query);
				var resp 		= response.split("\n");

				for (var line in response) {
					this.evaluateResponse(player, line, response[line]);
				}

				return this;
			}


			this.evaluateResponse	= function(player, line, item) {
				var parts 			= item.split("=");
				var cmd 			= parts[0];
				var val 			= parts[1];

				switch (cmd) {

					case 'cmd':
						this.execCmd(player, val);
					break;

					default:
					case 'msg':
						sendMsg(player, val);
					break;

				}

				return this;
			}




			this.execCmd 			= function(player, input) {
				var args 		= input.split(",");
				var cmd 		= args[0];

				switch (cmd) {

					case 'gainxp':
					break;

					case 'losexp':
					break;

					case 'gainhp':
					break;

					case 'losehp':
						this.playerLoseHP(player, args[1]);
					break;

					case 'gainlevel':
					break;

					case 'loselevel':
					break;

					case 'additem':
					break;

				}

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


		
		/** Player
		 * Player Methods
		 */
		
		 	/**
		 	 * Player Stats
		 	 * @param  {player} player 
		 	 * @return {string}
		 	 */
			this.playerStats 	= function(player) {
				var level 		= this.playerLevel(player);
				var xp 			= this.playerXP(player);
				var sText 		= 
					player.Name +
					" | Level " +
					level 		+
					" | XP " 	+
					xp 
				;

				return sText;
			}
		

			/**
			 * Player XP
			 * @param  {player} player
			 * @return {integer}
			 */
			this.playerXP 		= function(player) {
				var store 	= this.store();
				var xp 		= parseInt(store.GetSetting(player.GameID, "xp"));

				if (!xp || parseInt(xp) < 1) xp = 0;
				return xp;
			}


			/**
			 * Player Level
			 * @param  {player} player 
			 * @return {integer}        
			 */
			this.playerLevel 	= function(player) {
				var store 	= this.store();
				var xp 		= this.playerXP(player);

				var maxLvl 	= parseFloat(this.config("xp", "max_level"));
				var scale 	= parseFloat(this.config("xp", "scale"));
				var rate 	= parseFloat(this.config("xp", "rate"));
				var step 	= (scale / 4);

				var level 	= ((Math.sqrt(scale * (rate * xp + step)) + (step * rate)) / maxLvl);
				level 		= Math.floor(level);

				return level;
			}

			this.playerHP 		= function(player) {
				return player.Health;
			}

			this.playerLoseHP 	= function(player, hp) {
				player.Health 	= player.Health - hp;
				return this;
			}

			this.playerGainHP 	= function(player, hp) {
				player.Health 	= player.Health + hp;
				return this;
			}

			/**
			 * Player Gain Level Event
			 * @param  {player} 	player 
			 * @param  {integer} 	level
			 * @return {SELF}        
			 */
			this.playerGainLevel	= function(player, level) {
				var item 	= this.config("levels", level).split(',');
				var lText 	=
					"You are now level " + level
				;

				this.sendMsg(player, lText, 'level');
				this.playerAddItem(player, item[0], item[1]);
				
				this.callback_level_gain(player, level);
				return this;
			}


			/**
			 * Player Gain XP
			 * @param  {player} player     
			 * @param  {string} xpGainType 
			 * @return {integer} newXP
			 */
			this.playerGainXP 		= function(player, xpGainType) {
				var store 			= this.store();
				var eventWeight 	= parseFloat(this.config("xp", xpGainType));
				//var scale 			= parseFloat(this.config("xp", "scale"));

				if (!eventWeight) return this;

				var curXP 			= parseInt(this.playerXP(player));
				var curLvl 			= this.playerLevel(player);
				var incXP 			= (eventWeight);
				var newXP 			= (incXP + curXP);

				store.AddSetting(player.GameID, "xp", newXP);
				store.Save();
				store 				= '';

				var newLvl 			= this.playerLevel(player);
				var xText 			=
					"XP++ (" + incXP + ") [" + newXP + "]"
				;


				this.sendMsg(player, xText, 'xp');
				this.callback_xp_gain(player, xp);

				if (newLvl > curLvl) {
					this.playerGainLevel(player, newLvl);
					store.AddSetting(player.GameID, "level", newLvl);
					store.Save();
				}

				return newXP;
			}


			/**
			 * Player Lose XP
			 * @param  {player} player     
			 * @param  {string} xpLoseType 
			 * @return {integer} newXP            
			 */
			this.playerLoseXP 		= function(player, xpLoseType) {
				var store 			= this.store();
				var eventWeight 	= parseFloat(this.config("xp", xpLoseType));
				//var scale 			= parseFloat(this.config("xp", "scale"));

				if (!eventWeight) return this;

				var curXP 			= parseInt(this.playerXP(player));
				var curLvl 			= this.playerLevel(player);
				var decXP 			= (eventWeight);
				var newXP 			= (curXP - decXP);

				store.AddSetting(player.GameID, "xp", newXP);
				store.Save();
				store 				= '';

				var newLvl 			= this.playerLevel(player);
				var xText 			=
					"XP-- (" + decXP + ") [XP: " + newXP + "]"
				;

				this.sendMsg(player, xText, 'xp');
				this.callback_xp_gain(player, xp);

				return newXP;
			}


			/**
			 * Player Add Item
			 * @param  {player} player 
			 * @param  {string} item   
			 * @param  {intger} count  
			 * @return {SELF}
			 */
			this.playerAddItem 		= function(player, item, count) {

				item 				= item.replace(/_/gi, ' ');
				player.Inventory.AddItem(item, count);

				var iText = 
					"x"		+
					count 	+
					" " 	+
					item 	+
					" added to your inventory"
				;

				this.sendMsg(player, iText, 'inventory');
				return this;
			}



		/** Attacking
		 * Events
		 */
		
			/**
			 * Player Hurt Event
			 * @param  {player} player
			 * @param  {hurtEvent} hurtEvent
			 * @return {SELF}
			 */
			this.playerHurt 	= function(player, hurtEvent) {

				this.playerLoseXP(player, 'player_hurt_' + (hurtEvent.Attacker.Name).toLowerCase());
				this.callback_player_hurt(player, hurtEvent);

				return this;
			}


			/**
			 * Player Killed Event
			 * @param  {player} player
			 * @param  {deathEvent} deathEvent
			 * @return {SELF}
			 */
			this.playerKilled 		= function(player, deathEvent) {

				this.playerLoseXP(player, 'player_killed');
				this.callback_player_death(player, deathEvent);

				return this;
			}


			/**
			 * NPC Killed Event
			 * @param  {player} player
			 * @param  {[type]} npc
			 * @param  {deathEvent} deathEvent
			 * @return {SELF}
			 */
			this.npcKilled 	= function(player, npc, deathEvent) {

				this.playerGainXP(player, 'npc_killed');
				this.callback_npc_killed(player, npc, deathEvent);				

				return this;	
			}


			/**
			 * NPC Hurt Event
			 * @param  {player} player
			 * @param  {[type]} npc
			 * @param  {hurtEvent} hurtEvent
			 * @return {SELF}
			 */
			this.npcHurt 		= function(player, npc, hurtEvent) {

				this.playerGainXP(player, 'npc_hurt');
				this.callback_npc_hurt(player, npc, hurtEvent);

				return this;
			}


		/** Remote Connections
		 * Remote Web API Methods
		 */
		
			this.webServerAvailable = function(player) {
				var url 		= this.config('server', 'url');
				var server 		= this.config('server', 'alias');
					url 	   += "/checkin.php";

				var resp 		= Web.GET(url);

				return (server == resp);
			}
		
			



		/** Return
		 * Instansciate this object and return self
		 */
			return this.__construct();
	}






/** Create Main Class
 * Instansciate the Main Class
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
