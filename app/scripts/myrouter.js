$(function(){
	//异步加载配置，书写顺序和加载顺序有关
	var loadingSettings = {
		index: {
			route: "/",
			scripts: ["/scripts/asynchronous/index.js"],
			dom: "/contents/index.html"
		},
		works: {
			route: "works/",
			styles: ["/styles/page1.css"],
			scripts: ["/scripts/asynchronous/scripts1.js"],
			dom: "/contents/works.html"
		},
		about: {
			route: "about/",
			styles: ["/styles/page1.css"],
			scripts: ["/scripts/asynchronous/scripts1.js"],
			dom: "/contents/main.html"
		},
		contact: {
			route: "contact/",
			styles: ["/styles/asynchronous/page1.css","/styles/asynchronous/page2.css"],
			scripts: ["/scripts/asynchronous/scripts1.js","/scripts/asynchronous/scripts2.js"],
			dom: "/contents/main.html"
		}

	}

	var pageStates = {
		loading:  false,
		animation: false
	}

	$('body').route('works/',function(request){
		//console.log('works');
		//rotateXAction =true;
		//App.terrain.rotateX180();
		//App.terrain.rotateX180reverse();
		removeCurrentContents();
		loading();
		worksInit(loadingComplete(worksAnimation));

	}).route('about/',function(){

		//console.log('about');
		App.terrain.rotateXStop();

	}).route('contact/',function(){
		
		//console.log('contact');
		
	}).route('/',function(){
		//console.log('main');
	}).route('',function(){
		console.log('123');
	});


	var routerResolve = function(){
		var hash = location.hash.replace(/^#/, '');
		console.log(pageStates.loading,pageStates.animation);
		if (!pageStates.loading && !pageStates.animation) {
			if (hash) {
				//other pages with # in router
				var match = $.routeMatches(hash);
				if (match) {
					match.route.callback.apply(match.route.callback, match.args);
				}
			}else{
				//index page
				removeCurrentContents();
				loading();
				mainInit(loadingComplete(mainAnimation));

			}
		}
	}

	var loadStyles = function(address){
		console.log('ls');
		for (var i = 0; i < address.length; i++) {
			$('<link>').attr({rel:"stylesheet",type:"text/css",href:address[i]}).appendTo("head");
		}
	}

	var loadScripts = function(address){
		console.log('sc');
		//$('<script>').attr({type: "text/javascript",href: address}).appendTo("body");
		for (var i = 0; i < address.length; i++) {
			$.getScript(address[i]);
		}
	}

	var loading = function(callback){

		console.log('loading');
		if (callback && typeof(callback) === "function") {
			
			$('.loading').fadeIn(500,callback);
		}else{
			$('.loading').fadeIn(500);
		}
		
	}

	var loadingComplete =  function(callback){
		console.log('lc');

		if (callback && typeof(callback) === "function") {
			//console.log('lc1');
			$('.loading').delay(500).fadeOut(1000,callback);
			setTimeout(function(){
				pageStates.loading = false;
				console.log('lc1');
			}, 1500);

			// setTimeout(function(){
			// 	console.log('123')
			// }, 1000);
		}else{
			$('.loading').delay(500).fadeOut(1000,function(){
				pageStates.loading = false;
			});
		}
		
	}

	var mainInit = function(callback){
		pageStates.loading = true;
		$("header").removeClass("white").addClass("black");
		$(".loading").removeClass("white").addClass("black");
		$.get(loadingSettings.index.dom,function(data){
			$('.load-contents').html(data);
			//loadScripts(loadingSettings.index.scripts);
			setTimeout(callback, 1000);
			//(callback && typeof(callback) === "function") && callback();
		});
	}

	var mainAnimation = function(){
		pageStates.animation = true;
		$('.load-contents').addClass("active");
		$('.content.index').addClass("active");
		// $('.content.index').one('animationend',function(){
		// 	console.log('animationend');
		// });
		var triggerElmt =  $('.content.index').find(".character-group").last().get(0);

		//元素 display none时不会触发
		triggerElmt.addEventListener('animationend', function(){
			console.log('animationend');
			pageStates.animation = false;
		},false);
		

	}

	var worksInit = function(callback){
		$("header").removeClass("black").addClass("white");
		$(".loading").removeClass("black").addClass("white");
		pageStates.loading = true;
		App.bgDarker();
		App.terrain.rotateX180reverseMoveTop();
		//App.terrain.changeWireframeColor('#ffffff');
		console.log('wi');
		$.get(loadingSettings.works.dom,function(data){
			$('.load-contents').html(data);
			setTimeout(callback, 1000);
		});

	}

	var worksAnimation = function(){
		console.log('wa')
		pageStates.animation = true;
		// $('.load-contents').addClass("active");
		// $('.content.index').addClass("active");
	}


	var removeCurrentContents = function(){
		$('.load-contents').empty();
	}

	$(window).bind('hashchange',function(e,triggered){
		e.preventDefault();
		routerResolve();
	})

	$('header a').click(function(){
		//routerResolve();
	});

	$(window).load(routerResolve);

});