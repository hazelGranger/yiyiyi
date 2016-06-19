$(function(){
	//异步加载配置，书写顺序和加载顺序有关
	var loadingSettings = {
		index: {
			route: "/",
			scripts: ["/scripts/asynchronous/index.js"],
			dom: "/contents/index2.html"
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
			dom: "/contents/about.html"
		},
		contact: {
			route: "contact/",
			styles: ["/styles/asynchronous/page1.css","/styles/asynchronous/page2.css"],
			scripts: ["/scripts/asynchronous/scripts1.js","/scripts/asynchronous/scripts2.js"],
			dom: "/contents/contact.html"
		},
		form: {
			route: "form/",
			dom: "/contents/form.html"
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
		//mainInit(loadingComplete(mainAnimation));
		console.log('index#');
		mainInit();
		loadingComplete(mainAnimation);

	}).route('works/',function(request){
		//console.log('works');
		//rotateXAction =true;
		//App.terrain.rotateX180();
		//App.terrain.rotateX180reverse();
		removeCurrentContents();
		loading();
		//worksInit(loadingComplete(worksAnimation));
		worksInit();
		loadingComplete(worksAnimation);

	}).route('about/',function(){

		//console.log('about');
		removeCurrentContents();
		loading();
		aboutInit();
		loadingComplete(aboutAnimation);

	}).route('contact/',function(){
		
		removeCurrentContents();
		loading();
		contactInit();
		loadingComplete(contactAnimation);
		//console.log('contact');
		
	}).route('/',function(){
		//console.log('main');
	}).route('form/',function(){
		removeCurrentContents();
		loading();
		formInit();
		loadingComplete(formAnimation);
	});


	var routerResolve = function(e){
		var hash = location.hash.replace(/^#/, '');
		if (!e || e.type != "load") {
			if (hash != "form/") {
				$(".logo a").trigger("click");
			}
		}
		
		console.log(pageStates.loading,pageStates.animation,"rr");
		if (!pageStates.loading) {
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
				mainInit();
				setTimeout(loadingComplete(mainAnimation),1000);

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
			$('.loading').delay(500).fadeOut(1000);
			console.log(pageStates.loading,pageStates.animation,"lc");
			if (pageStates.animation == true ) {

				$('.loading').delay(500).fadeOut(1000);
				setTimeout(function(){
					pageStates.loading = false;
					console.log('lc1');
				}, 1500); 

				$('.load-contents').one("terrainAnimation",function (argument) {
					console.log('trabm');
					callback();
				});
				//$('.').one();
			}else{
				console.log('callback');
				$('.loading').delay(500).fadeOut(1000,callback);
				setTimeout(function(){
					pageStates.loading = false;
					console.log('lc123');
				}, 1500);
			}

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
			if (pageStates.desBg == "light") {
				App.bgLighter();
				pageStates.bg = "light";
				App.terrain.changeWireframeColor('#ffffff');

			}else if (pageStates.desBg == "dark"){

				App.bgDarker();
				pageStates.bg = "dark";
				App.terrain.changeWireframeColor('#ffffff');
				
			}else if(pageStates.desBg == "white"){

				App.bgWhite();
				pageStates.bg = "white";
				App.terrain.changeWireframeColor('#dddddd');
			}else if(pageStates.desBg == "red"){
				App.bgRed();
				pageStates.bg = "red";
			}
		}
	}


	var terrainTransition =  function(){


		console.log(pageStates.terrain,pageStates.desTerrain,"tts");

		switch (pageStates.terrain) {
			case 0: 
				if (pageStates.desTerrain == 1) {
					pageStates.animation = true;
					pageStates.terrain = 1;
					App.terrain.rotateX90();

				}else if (pageStates.desTerrain == 2) {
					pageStates.animation = true;
					pageStates.terrain = 2;
					App.terrain.rotateX90();
				}else if(pageStates.desTerrain == 3){
					pageStates.animation = true;
					pageStates.terrain = 3;
					App.terrain.disappear();
				}
				break;
			case 1:
				if (pageStates.desTerrain == 0) {
					pageStates.animation = true;
					pageStates.terrain = 0;
					App.terrain.reset20();
					console.log('10');
				}else if(pageStates.desTerrain == 2){
					pageStates.animation = true;
					pageStates.terrain = 2;
					App.terrain.stay();
					console.log('12');
				}else if(pageStates.desTerrain == 3){
					pageStates.animation = true;
					pageStates.terrain = 3;
					App.terrain.disappear();
				}
				break;
			case 2:
				if (pageStates.desTerrain == 0) {
					pageStates.animation = true;
					pageStates.terrain = 0;
					App.terrain.reset20();
					console.log('20');
					//App.terrain.reset20();
				}else if (pageStates.desTerrain == 1){
					pageStates.animation = true;
					pageStates.terrain = 1;
					App.terrain.stay();
				}else if(pageStates.desTerrain == 3){
					pageStates.animation = true;
					pageStates.terrain = 3;
					App.terrain.disappear();
				}else if(pageStates.desTerrain == 4){
					pageStates.animation = true;
					pageStates.terrain = 4;
					App.terrain.stay();
				}
				break;
			case 3:
				if (pageStates.desTerrain == 0) {
					pageStates.animation = true;
					pageStates.terrain = 0;
					App.terrain.appear();
					setTimeout(function(){

					}, 600);
				}else{

				}
		}
	}

	var mainInit = function(){
		
		pageStates.loading = true;
		setDesStates("light",0);
		$("header").removeClass("white").addClass("black");
		$(".loading").removeClass("white").addClass("black");
		bgTransition();
		terrainTransition();
		//bgTransition();
		//terrainTransitionBack();
		//terrainTransitionTo();
		//terrainTransition(callback);
		$.get(loadingSettings.index.dom,function(data){
			$('.load-contents').html(data);
			console.log('mi-bg');
			//loadScripts(loadingSettings.index.scripts);
			//setTimeout(callback, 1000);
			//setTimeout(setStates("light",0),200);
		});
	}

	var mainAnimation = function(){
		//pageStates.animation = true;
		$('.bg').removeClass("flow");
		$('.logo').removeClass("about");
		$('.load-contents').removeClass("relative").addClass("active");
		$('.content.index').addClass("active");
		// $('.content.index').one('animationend',function(){
		// 	console.log('animationend');
		// });
		//触发 animation 动画 ，暂时不需
		//var triggerElmt =  $('.content.index').find(".character-group").last().get(0);

		//元素 display none时不会触发
		// triggerElmt.addEventListener('animationend', function(){
		// 	console.log('animationend');
		// 	pageStates.animation = false;
		// },false);
		
	}

	var worksInit = function(){
		console.log('wi');
		pageStates.loading = true;
		setDesStates("dark",1);
		$("header").removeClass("black").addClass("white");
		$(".loading").removeClass("black").addClass("white");
		bgTransition();
		terrainTransition();

		$.get(loadingSettings.works.dom,function(data){
			$('.load-contents').html(data);
		});
	}

	var worksAnimation = function(){
		//pageStates.animation = true;
		$('.bg').addClass("flow");
		$('.logo').removeClass("about");
		$('.load-contents').addClass("active").addClass("relative");
		$('.content.works').addClass("active");

		console.log(pageStates.loading,pageStates.animation);
	}

	var aboutInit = function(){
		pageStates.loading = true;
		console.log('ai');
		$("header").removeClass("white").addClass("black");
		$(".loading").removeClass("white").addClass("black");
		
		setDesStates("white",2);
		bgTransition();
		terrainTransition();

		$.get(loadingSettings.about.dom,function(data){
			$('.load-contents').html(data);
		});
	}

	var aboutAnimation = function(){
		$('.bg').addClass("flow");
		$('.logo').addClass("about");
		$('.load-contents').addClass("active").addClass("relative");
		$('.content.about').addClass("active");

	}

	var contactInit = function(){
		pageStates.loading = true;
		console.log('ci');
		$("header").removeClass("black").addClass("white");
		$(".loading").removeClass("black").addClass("white");
		setDesStates("dark",3);
		bgTransition();
		terrainTransition();

		$.get(loadingSettings.contact.dom,function(data){
			$('.load-contents').html(data);
		});

	}

	var contactAnimation = function(){
		$('.bg').removeClass("flow");
		$('.logo').removeClass("about");
		$('.load-contents').addClass("active").removeClass("relative");
		$('.content.contact').addClass("active");

	}

	var formInit = function(){
		pageStates.loading = true;
		console.log('fi');
		$("header").removeClass("black").addClass("white");
		$(".loading").removeClass("black").addClass("white");
		setDesStates("red",4);
		bgTransition();
		terrainTransition();

		$.get(loadingSettings.form.dom,function(data){
			console.log('load form');
			$('.load-contents').html(data);
		})

	}

	var formAnimation = function(){
		console.log('fa');
		$('.bg').addClass("flow");
		$('.logo').removeClass("about");
		$('.load-contents').addClass("active").addClass("relative");
		$('.content.form').addClass("active");
	}


	var removeCurrentContents = function(){
		console.log('removeCurrentContents');
		$('.load-contents').empty().removeClass("active");

	}

	$(window).bind('hashchange',function(e,triggered){
		e.preventDefault();
		routerResolve(e);
	})

	$('header a').click(function(){
		//routerResolve();
	});

	$('body').click(function(){
		console.log(pageStates.loading,pageStates.animation);
	});

	$('.load-contents').on("animationComplete",function(){
		console.log('animationComplete');
		pageStates.animation = false;
	})

	$(window).load(routerResolve);


});