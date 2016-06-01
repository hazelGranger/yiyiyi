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
		animation: false,
		bg: "light",
		terrain: 0,//0 表示初始状态，1表示翻转后，2表示平铺，3表示消失
		desBg : "",
		desTerrain: ""
	}

	$('body').route('index/',function(){

		removeCurrentContents();
		loading();
		mainInit(loadingComplete(mainAnimation));

	}).route('works/',function(request){
		//console.log('works');
		//rotateXAction =true;
		//App.terrain.rotateX180();
		//App.terrain.rotateX180reverse();
		removeCurrentContents();
		loading();
		worksInit(loadingComplete(worksAnimation));

	}).route('about/',function(){

		//console.log('about');
		removeCurrentContents();
		loading();
		aboutInit(loadingComplete(aboutAnimation));

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
				console.log('index');
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

	var setStates = function(bg,terrain){
		pageStates.bg = bg;
		pageStates.terrain = terrain;
	}

	var setDesStates = function(desBg,desTerrain){
		pageStates.desBg = desBg;
		pageStates.desTerrain = desTerrain;
	}

	var bgTransition = function(){
		console.log(pageStates.bg,pageStates.desBg);
		if(pageStates.bg != pageStates.desBg){
			if (pageStates.bg == "light") {
				App.bgDarker();
			}else if (pageStates.bg == "dark"){
				App.bgLighter();
				console.log('light');
			}
		}
	}

	var terrainTransitionBack = function(){
		console.log(pageStates.terrain,pageStates.desTerrain);
		if (pageStates.terrain != pageStates.desTerrain) {

			if (pageStates.terrain == 0) {
				console.log('b0');
			}else if (pageStates.terrain == 1) {
				console.log('b1');
				App.terrain.reset10();
			}else{
				console.log('b2');

			}
		}
	}

	var terrainTransitionTo = function(){

		if (pageStates.terrain != pageStates.desTerrain) {
			if (pageStates.desTerrain == 0) {
				//index首页
				console.log('t0');

			}else if (pageStates.desTerrain == 1){
				//works 页
				console.log('t1');
				App.terrain.rotateX180reverseMoveTop();
			}else if (pageStates.desTerrain == 2){
				//about 页
				console.log('t2');
				App.terrain.rotateX();
			}
		}
	}

	var terrainTransition =  function(){

		console.log(pageStates.terrain,pageStates.desTerrain,"tts");

		switch (pageStates.terrain) {
			case 0: 
				if (pageStates.desTerrain == 1) {

					App.terrain.rotateX180reverseMoveTop();

				}else if (pageStates.desTerrain == 2) {

					App.terrain.rotateX90();
				}
				break;
			case 1:
				if (pageStates.desTerrain == 0) {
					App.terrain.reset10();
				}else if(pageStates.desTerrain == 2){
					console.log('12');
					App.terrain.t12();
				}
				break;
			case 2:
				if (pageStates.desTerrain == 0) {
					App.terrain.reset20();
				}else if (pageStates.desTerrain == 1){
					App.terrain.t21();
				}
				break;
		}
	}

	var mainInit = function(callback){
		
		pageStates.loading = true;
		setDesStates("light",0);
		$("header").removeClass("white").addClass("black");
		$(".loading").removeClass("white").addClass("black");
		bgTransition();
		//terrainTransitionBack();
		//terrainTransitionTo();
		terrainTransition();
		$.get(loadingSettings.index.dom,function(data){
			$('.load-contents').html(data);
			//loadScripts(loadingSettings.index.scripts);
			setTimeout(callback, 1000);
			setStates("light",0);
			//(callback && typeof(callback) === "function") && callback();
		});
	}

	var mainAnimation = function(){
		//pageStates.animation = true;
		$('.load-contents').addClass("active");
		$('.content.index').addClass("active");
		// $('.content.index').one('animationend',function(){
		// 	console.log('animationend');
		// });
		var triggerElmt =  $('.content.index').find(".character-group").last().get(0);

		//元素 display none时不会触发
		// triggerElmt.addEventListener('animationend', function(){
		// 	console.log('animationend');
		// 	pageStates.animation = false;
		// },false);
		
	}

	var worksInit = function(callback){
		$("header").removeClass("black").addClass("white");
		$(".loading").removeClass("black").addClass("white");
		pageStates.loading = true;
		setDesStates("dark",1);
		bgTransition();
		// terrainTransitionBack();
		// terrainTransitionTo();
		//App.terrain.changeWireframeColor('#ffffff');
		terrainTransition();
		console.log('wi');
		$.get(loadingSettings.works.dom,function(data){
			$('.load-contents').html(data);
			setTimeout(callback, 1000);
			setStates("dark",1);
		});
	}

	var worksAnimation = function(){
		//pageStates.animation = true;

		// $('.load-contents').addClass("active");
		// $('.content.index').addClass("active");
	}

	var aboutInit = function(callback){
		console.log('ai');
		$("header").removeClass("black").addClass("white");
		$(".loading").removeClass("black").addClass("white");
		pageStates.loading = true;
		setDesStates("dark",2);
		bgTransition();
		terrainTransition();

		$.get(loadingSettings.about.dom,function(data){
			$('.load-contents').html(data);
			setTimeout(callback, 1000);
			setStates("dark",2);
		});
	}

	var aboutAnimation = function(){

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