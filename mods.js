function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i].name === a[j].name)
                a.splice(j--, 1);
        }
    }
    return a;
}

	var QueryString = function () {
	  // This function is anonymous, is executed immediately and 
	  // the return value is assigned to QueryString!
	  var query_string = {};
	  var query = window.location.search.substring(1);
	  var vars = query.split("&");
	  for (var i=0;i<vars.length;i++) {
	    var pair = vars[i].split("=");
	        // If first entry with this name
	    if (typeof query_string[pair[0]] === "undefined") {
	      query_string[pair[0]] = decodeURIComponent(pair[1]);
	        // If second entry with this name
	    } else if (typeof query_string[pair[0]] === "string") {
	      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
	      query_string[pair[0]] = arr;
	        // If third or later entry with this name
	    } else {
	      query_string[pair[0]].push(decodeURIComponent(pair[1]));
	    }
	  } 
	  return query_string;
	}();
	

	var UserSession = (function(){

			var public = {};
			var private = {
				sessionName : "pontis_session"
			};

			private.login = function(fields){
				var currentSession = private.getUser();

				var userSession = {
					lastChange: new Date().valueOf(),
					subId:private.getSubId(),
					sessionFields:fields
				}

				var merged = $.extend( true, currentSession,userSession );
				if(currentSession && currentSession.sessionFields){
					for(var curField in currentSession.sessionFields){
						merged.sessionFields.push(currentSession.sessionFields[curField]);
					}
				}
				
				var uniqeFields = arrayUnique(merged.sessionFields);
				merged.sessionFields = uniqeFields;
				
				var str = JSON.stringify(merged);
				window.localStorage.setItem(private.sessionName,str);
				return private.getUser();
			}

			private.getSubId = function(){
				var subId = new Date().valueOf()+"_"+ navigator.userAgent.replace(/ /g, "_");
				var currentSubId = window.localStorage.getItem('subId');
				var mySubId
				if(currentSubId){
					mySubId = currentSubId
				}else{
					window.localStorage.setItem('subId',subId);
				}

				return mySubId;
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


	var API = (function(){
		var public = {}

		public.endPoints = {
			// Parameters
			// subscriberId
			// the id generated by the website
			// required
			// msisdn 
			// The phone number submitted in sign in form
			// optional
			'offers':{url:'/api/web/get-offers.php',type:"get"},

			// Show offer
			// GET
			// /show-offer.php

			// Definition
			// http://www.pontisnewcom.com/api/show-offer.php

			// Parameters
			// subscriberId the id generated by the website
			// optional	
			//       2) 	msisdn 
			// The phone number submitted in sign in form
			// Optional
			//       3)   maCode
			// 	The maCode (returned in the get-offers api)

			'showOffer':{url:'api/web/show-offer.php',type:"get"},


			// POST
			// /select-offer.php

			// Call select offer only if the offer has the parameter
			// isRequired = true

			// Definition
			// http://www.pontisnewcom.com/api/select-offer.php

			// Parameters
			// subscriberId
			// the id generated by the website
			// required	
			//       2) 	msisdn 
			// The phone number submitted in sign in form
			// Optional
			//       3)   maCode
			// 	The maCode (returned in the get-offers api)
			'selectOffer':{url:'select-offer.php',type:"post"},

			// Update subscriber
			// POST
			// /update-subscriber.php

			// Definition
			// http://www.pontisnewcom.com/api/update-subscriber.php

			// Parameters
			// subscriberId
			// required
			// Referer : url referer
			// required
			//       3)   requiredFields 
			// 	Array of required fields. Json as string
			// 	Example:
			// 	“[ { \”name\” : “\my name\” }, { \”email\” : \”myemail@mail.com\” } ]”

			// Response
			// {
			// 	“Status” : {
			// 		“Success” : “true”
			// }
			// }

			'updateSubscriber':{url:'update-subscriber.php',type:"post"},



			// Optin (select offer);
			// POST
			// /optin.php

			// Definition
			// http://www.pontisnewcom.com/api/optin.php

			// Parameters
			// Msisdn
			// 	optional
			// subscriberId
			// optinCode

			// Response
			// {
			// 	“Status” : {
			// 		“Success” : “true”
			// }
			// }

			'optIn':{url:'optin.php',type:"post"},

			/*
			Browse
			POST
			/browse.php

			Definition
			http://www.pontisnewcom.com/api/browse.php


			Parameters
			Msisdn
				optional
			subscriberId
			tag
			url

			Response
			{
				“Status” : {
					“Success” : “true”
			}
			}
			*/
			'browse':{url:'browse.php',type:"post"},


		}

		return public;

	})();
