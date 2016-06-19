$(document).ready(function() {
	var APP_ID = 'nDuEBRrJOIE9S6m0LXMAhs9w-gzGzoHsz';
	var APP_KEY = 'gQOsO2P8gdv0c1xwyymQodkK';

	AV.initialize({appId: APP_ID, appKey: APP_KEY });

	var UserRequest = AV.Object.extend('UserRequest');
	var userRequest = new UserRequest();

	var message = function(content){
		return '<div class=\"message\">' +
				   '<p>'+ content +'</p>' +
				'</div>';
	};

	$("body").on("click","#info-submit",function(){

		var info = {
			name: function(){
				return $('input[name="name"]').val();
			}(),
			email: function(){
				return $('input[name=""]').val();
			}(),
			company: function(){
				return $('input[name="company"]').val();
			}(),
			website: function(){
				return $('input[name="website"]').val();
			}(),
			where: function(){
				return $('input[name="where"]').val();
			}(),
			accountType: function(){
				var typeArr = [];
				$('input[name="accountType"]:checked').each(function(){
					typeArr.push($(this).val());
				});
				return typeArr;
			}(),
			duration: function(){
				return $('input[name="duration"]:checked').val();
			}(),
			budget: function(){
				return $('input[name="budget"]:checked').val();
			}(),
			others: function(){
				return $('textarea[name="others"]').val();
			}()
		};

		console.log(info);
		userRequest.save(info)
		.then(function(){
			console.log('success');
			var msgElmt =  message("发送成功");
			$(msgElmt).appendTo('body').show('slow');
			setTimeout(function(){
				$('.message').animate({opacity:'0'},500).remove();
			}, 1000);
		}).catch(function(err){
			console.log('error:' + err);
			var msgElmt =  message("发送失败");
			$(msgElmt).appendTo('body').show('slow');
			setTimeout(function(){
				$('.message').animate({opacity:'0'},300).remove();
			}, 1000);
		});

	});
	
});


