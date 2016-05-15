			var UserSession = (function(){

					var public = {};
					var private = {
						sessionName : "pontis_session"
					};

					private.login = function(fields){
						var currentSession = private.getUser();

						var userSession = {
							lastChange: new Date().valueOf(),
							sessionFields:fields
						}

						var merged = $.extend( true, currentSession,userSession );

						if(currentSession && currentSession.sessionFields){
							for(var curField in currentSession.sessionFields){
								merged.sessionFields.push(currentSession.sessionFields[curField]);
							}
						}
						

						var str = JSON.stringify(merged);
						window.localStorage.setItem(private.sessionName,str);
						return private.getUser();
					}

					private.logout = function(fields){
						window.localStorage.clear();
					}

					private.getUser = function(){
						try{
							answer = JSON.parse(window.localStorage.getItem(private.sessionName));
						}catch(e){}

						return answer;
					}

					private.hasFieldInSession = function(fieldName){
						var user = private.getUser();
						var bool = false;
						if(user && user.sessionFields){
							for(var curField in user.sessionFields){
								if( user.sessionFields[curField]['name'] == fieldName ){
									bool = true;
								}
							}
						}
						return bool;
					}

					public.has = function(fieldName){
						return private.hasFieldInSession(fieldName);
					}

					public.logInUser = function(fieldsArr){
						private.login(fieldsArr);
						return private.getUser();
					}

					public.getUserInfo = function(){
						return private.getUser();
					}

					return public;
			})();


			var appState = (function(){

			})();

			var API = (function(){
				var public = {}

				public.endPoints = {
					'offers':'/mockdata/get_offers.json'
				}

				return public;

			})();
