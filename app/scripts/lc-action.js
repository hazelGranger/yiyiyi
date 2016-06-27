$(document).ready(function() {
	var APP_ID = 'nDuEBRrJOIE9S6m0LXMAhs9w-gzGzoHsz';
	var APP_KEY = 'gQOsO2P8gdv0c1xwyymQodkK';

	AV.initialize({appId: APP_ID, appKey: APP_KEY });

	var UserRequest = AV.Object.extend('UserRequest');
	var userRequest = new UserRequest();

	var message = function(content,type){
		console.log('msg')
		return '<div class=\"message '+ type +'\">' +
				   '<p>'+ content +'</p>' +
				'</div>';
	};

	$("body").on("click","#m-submit",function(){

		var validation = {
			name: 0,
			email: 0,
			company: 0,
			website: 0,
			where: 0,
			accountType: 0,
			duration: 0,
			budget: 0,
			others: 0
		}

		var submitPass = false;

		var validateEmpty = function(str){
			if (str && str != "") {
				return 1;
			}else {
				return 0;
			}
		}

		var validateArrStr = function(arrStr){
			if (arrStr && arrStr.length > 0) {
				return 1;
			}else {
				return 0;
			}
		}

		var validateEmail = function(email){
			var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (!email || email == "") {
				return 0;
			}else if(reg.test(email)){
				return 1;
			}else {
				return 2;
			}
		}

		var info = {
			name: function(){
				var i_name =  $('input[name="name"]').val();
				validation.name = validateEmpty(i_name);
				return i_name;
			}(),
			email: function(){
				var i_email =  $('input[name="email"]').val();
				validation.email = validateEmail(i_email);
				return i_email;
			}(),
			company: function(){
				var i_company =  $('input[name="company"]').val();
				validation.company = validateEmpty(i_company);
				return i_company;
			}(),
			website: function(){
				var i_website = $('input[name="website"]').val();
				validation.website = validateEmpty(i_website);
				return i_website;
			}(),
			where: function(){
				var i_where = $('input[name="where"]').val();
				validation.where = validateEmpty(i_where);
				return i_where;
			}(),
			accountType: function(){
				var typeArr = [];
				$('input[name="accountType"]:checked').each(function(){
					typeArr.push($(this).val());
				});
				validation.accountType = validateArrStr(typeArr);
				return typeArr;
			}(),
			duration: function(){
				var i_duration = $('input[name="duration"]:checked').val();
				validation.duration = validateEmpty(i_duration);
				return i_duration;
			}(),
			budget: function(){
				var i_budget = $('input[name="budget"]:checked').val();
				validation.budget = validateEmpty(i_budget);
				return i_budget;
			}(),
			others: function(){
				var i_others = $('textarea[name="others"]').val();
				validation.others = validateEmpty(i_others);
				return i_others;
			}()
		};

		console.log(info);

		var beforeSubmit =  function(){
			submitPass = true;
			for(prop in validation){	

				if (validation[prop] == 0) {
					console.log(prop,validation[prop]);
					submitPass = false;
					$('#m_'+  prop ).text("此项不能为空");
				}

				if (validation[prop] == 2) {
					console.log(prop,validation[prop]);
					submitPass = false;
					$('#m_'+  prop ).text("此项格式不正确");
				}
			}
			return submitPass;
		};


		if (beforeSubmit()) {

			userRequest.save(info)
			.then(function(){
				console.log('success');
				var msgElmt =  message("发送成功","success");
				$(msgElmt).appendTo('body').show('slow');
				setTimeout(function(){
					$('.message').animate({opacity:'0'},500).remove();
					
				}, 1000);
			}).catch(function(err){
				console.log('error:' + err);
				var msgElmt =  message("发送失败","error");
				$(msgElmt).appendTo('body').show('slow');
				setTimeout(function(){
					$('.message').animate({opacity:'0'},300).remove();
				}, 1000);
			});

		}
		

	});

	$("body").on("focus","input,textarea",function(){
		$('.v-info').text("");
	})
	
});


