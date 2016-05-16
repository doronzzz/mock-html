
			$(function(){

				console.log(UserSession.getUserInfo());

				$.ajax({
				  url: API.endPoints.offers.url,
				  type: "get", //send it through get method
				  data:{subscriberId:window.localStorage.getItem('subId')},
				  success: function(response,status,xhr) {
				    //Do Something
				    var obj = JSON.parse(response);
				    var arr = [];

					for (var i in obj.offers){

						if(obj.offers[i].imageId){
							var str = obj.offers[i].imageId;
							obj.offers[i].imageId = str.replace('jpg','png');
						}

						if(obj.offers[i].requiredFields){
							arr.push(obj.offers[i].requiredFields[0]);
						}

					}

					console.log(arr);

					if(arr.length !== 0){
						$('body').addClass('show-email-dialog');
							
						var source = $("#user-fields-modal").html();
						var fieldsTmpl = Handlebars.compile(source);
						var context = {"fields":arr};
						var html = fieldsTmpl(context);
						$('body').append(html);
					}
					
					var source = $("#offers_template").html();
					var template = Handlebars.compile(source);
					var context = obj;
					var html = template(context);
					$('body #carousel-container').append(html);
					$($('.carousel-indicators li')[0]).addClass('active');
					$($('.carousel-inner .item')[0]).addClass('active');

				  },

				  error: function(xhr) {
				    //Do Something to handle error
				  }
				});


			});


			$(function(){
				
				UserSession.logInUser([]);
				if( UserSession.has('phoneNum') ) {
					$('body').addClass('is-logged-in')
				}

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
			