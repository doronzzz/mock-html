
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
				
				if( UserSession.has('msisdn') ) {
					$('body').addClass('is-logged-in');
				}

				$('.myNewComMenuItem').click(function(){
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
					window.location.reload();
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
					}
					
				});
					

				$('.sign-in').on('click',function(){
					$('body').toggleClass('show-login-dialog');
				});

				$(document).on('click','.close-dialog', function(){
					$('body').removeClass('show-login-dialog');
					$('body').removeClass('show-email-dialog');
				});

				$('.modal-overlay').on('click',function(){
					$('body').removeClass('show-login-dialog');
					$('body').removeClass('show-email-dialog');
				});

			});
			