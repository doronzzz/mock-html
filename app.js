
			$(function(){
				UserSession.logInUser([]);
				console.log(UserSession.getUserInfo());
			});


			$(function(){
				
				if( UserSession.has('phoneNum') ) {
					$('body').addClass('is-logged-in')
				}

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
								'name':'phoneNum',
								'value':$(phoneInput).val()
							}]

					UserSession.logInUser(fields);
					window.location.reload();
				});

				$('.logged-in').on('click',function(){
					window.localStorage.clear();
					window.location.reload();
				});


				$(document).on('click','#submit-fields',function(){

					var fields = [];
					var inputs = $('.req-email-dialog .fields input');
					for (var i = 0; i<inputs.length; i++){
						
						var fName = $(inputs[i]).attr('name');
						var fVal = $(inputs[i]).val();
						var field = {
							'type':'text',
							'name': fName,
							'value': fVal
						}

						fields.push(field);
					}

					UserSession.logInUser(fields);
					$('body').removeClass('show-email-dialog');


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
			