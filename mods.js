
			var userSession = (function(){

					var public = {};
					var private = {
						sessionName : "pontis_session"
					};

					private.login = function(fields){
						var userSession = {
							lastLogin: new Date().valueOf(),
							sessionFields:fields
						}
						var str = JSON.stringify(userSession);
						window.localStorage.setItem(private.sessionName,str);
						return private.getUser();
					}

					private.logout = function(fields){
						window.localStorage.clearItem(private.sessionName);
					}

					private.getUser = function(){
						var answer = {};
						try{
							answer = JSON.parse(window.localStorage.getItem(private.sessionName));
						}catch(e){}

						return answer;
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
