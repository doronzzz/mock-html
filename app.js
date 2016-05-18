			var pontisApp = function(){

				var public = {};
				public.getOffers = function(){

					UserSession.logInUser([]);
					var myData = {subscriberId:window.localStorage.getItem('subId')};
					var fields = UserSession.getUserInfo().sessionFields;
					
					for(var i = 0; i<fields.length; i++){
						if(fields[i].name === "msisdn"){
							myData.msisdn = fields[i].value;
						}
					}

					$.ajax({
						  url: API.endPoints.offers.url,
						  type: "get", //send it through get method
						  data:myData,
						  success: function(response,status,xhr) {
						    //Do Something
						    var obj = JSON.parse(response);
						    var fieldsObj = {
						    	text:[],
						    	checkbox:[],
						    	email:[],
						    	password:[]
						    };
						    
						    //if error do nothing.
						    if(obj.status.success === "false"){
						    	return;
						    }

						    var showFieldsDialog = false;

							for (var i in obj.offers){

								// if(obj.offers[i].imageId){
								// 	var str = obj.offers[i].imageId;
								// 	obj.offers[i].imageId = str.replace('jpg','png');
								// }

								if(obj.offers[i].requiredFields){
									
									if(obj.offers[i].requiredFields.length){
										showFieldsDialog = true;
									}

									for( var fld = 0; fld<obj.offers[i].requiredFields.length; fld++){
										var zisField = obj.offers[i].requiredFields[fld];
										if(zisField.type === "text"){
											fieldsObj.text.push(obj.offers[i].requiredFields[fld]);
										}
										if(zisField.type === "boolean"){
											fieldsObj.checkbox.push(obj.offers[i].requiredFields[fld]);
										}
										if(zisField.type === "password"){
											fieldsObj.password.push(obj.offers[i].requiredFields[fld]);
										}
										if(zisField.type === "email"){
											fieldsObj.email.push(obj.offers[i].requiredFields[fld]);
										}
									}
								}

							}

							if(showFieldsDialog){
								$('body').addClass('show-email-dialog');
									
								var source = $("#user-fields-modal").html();
								var fieldsTmpl = Handlebars.compile(source);
								var context = {"fields":fieldsObj};
								var html = fieldsTmpl(context);
								$('body').append(html);
							}
							
							var source = $("#offers_template").html();
							var template = Handlebars.compile(source);
							var context = obj;
							var html = template(context);
							$('#carousel-container').html('');
							$('body #carousel-container').append(html);
							$($('.carousel-indicators li')[0]).addClass('active');
							$($('.carousel-inner .item')[0]).addClass('active');

						  },

						  error: function(xhr) {
						    //Do Something to handle error
						  }
						});


				}

				return public;

			}()


			$(function(){
				UserSession.logInUser([]);
				console.log(UserSession.getUserInfo());
					var subId = UserSession.getUserInfo().subId;
					var msisdn = UserSession.getField('msisdn');
					var myData = {subscriberId:subId,url:window.location.href};
					if(msisdn){
						myData.msisdn = msisdn.value;
					}
					
					if(window.location.href.indexOf('contract') != -1){
						myData.tag = "Contract_details_page"
					};

					$.ajax({
						type:"post",
						url:"/api/web"+API.endPoints.browse.url,
						data:myData
					});

			});


			$(function(){
				
				if( UserSession.has('msisdn') && UserSession.getField('msisdn').value !== "" ) {
					$('body').addClass('is-logged-in');
				}

				$('#goToContract').click(function(){
					window.location.href = "/contract.html";
				});

				$(".myNewComMenuItem").hover(
				  function() {
				    $( 'body' ).addClass( "mega-menu" );
				  }, function() {
				    $( 'body' ).removeClass( "mega-menu" );
				  }
				);

				$("#myNewComMenu").hover(
				  function() {
				    $( 'body' ).addClass( "mega-menu" );
				  }, function() {
				    $( 'body' ).removeClass( "mega-menu" );
				  }
				);


				$('.login .btn-block').on('click',function(e){
					var phoneInput = $('.login input')[0];
					var fields = [{
								'type':'text',
								'name':'msisdn',
								'value':$(phoneInput).val()
							}]

					UserSession.logInUser(fields);
					window.location.reload();
				});

				$('.logged-in').on('click',function(){
					window.localStorage.clear();
					window.location.href = "/"; 
				});


				$(document).on('click','#submit-fields , .modal-overlay , .close-dialog',function(){
					if(	$('body').hasClass("show-email-dialog")	){

						var fields = [];
						var inputs = $('.req-email-dialog .fields input');
						for (var i = 0; i<inputs.length; i++){
							
							var fName = $(inputs[i]).attr('name');
							var fVal = $(inputs[i]).val();
							var type = $(inputs[i]).attr('data-type');
							
							if(fVal === "on"){
								fVal = true;
							}

							if(fVal === "off"){
								fVal = false;
							}

							var field = {
								'type':type,
								'name': fName,
								'value': fVal
							}

							fields.push(field);
						}

						UserSession.logInUser(fields);
						var subId = UserSession.getUserInfo().subId;
						var bodyParams = UserSession.getUserInfo().sessionFields;
						// bodyParams.push({"value": subId,name:"subscriberId"});
						// bodyParams.push({"value": window.location.href,name:"referer"})

						$.ajax({
							type:"post",
							url:"/api/web"+API.endPoints.updateSubscriber.url,
							data:{requiredFields:JSON.stringify(bodyParams),subscriberId:subId,referer:window.location.href}
						});

						$('body').removeClass('show-email-dialog');
						try{
							pontisApp.getOffers();							
						}catch(e){

						}
					}
					
				});
					

				$('.sign-in').on('click',function(){
					$('body').toggleClass('show-login-dialog');
				});

				$(document).on('click','.close-dialog', function(){
					$('body').removeClass('show-login-dialog');
					$('body').removeClass('thanksDialog');
				});

				$('.modal-overlay').on('click',function(){
					$('body').removeClass('show-login-dialog');
					// $('body').removeClass('show-email-dialog');
				});

			});
			