$(function(){
	//异步加载配置，书写顺序和加载顺序有关
	var loadingSettings = {
		index: {
			route: "/"
		},
		works: {
			route: "works/",
			styles: ["/styles/page1.css"],
			scripts: ["/scripts/asynchronous/scripts1.js"],
			dom: "/contents/main.html"
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

	$('body').route('works/',function(request){
		console.log('works');
		//rotateXAction =true;
		App.terrain.rotateX180();

	}).route('about/',function(){

		console.log('about');
		App.terrain.rotateXStop();

	}).route('contact/',function(){
		
		console.log('contact');
		$.get(loadingSettings.contact.dom,function(data){
			$('.load-contents').html(data);
			loadStyles(loadingSettings.contact.styles);
			loadScripts(loadingSettings.contact.scripts);
		});
		
	}).route('/',function(){
		console.log('main');
	});


	var routerResolve = function(){
		var hash = location.hash.replace(/^#/, '');
		if (hash) {
			var match = $.routeMatches(hash);
			if (match) {
				match.route.callback.apply(match.route.callback, match.args);
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

	var loading = function(){

	}

	$(window).bind('hashchange',function(e,triggered){
		e.preventDefault();
		routerResolve();
	})

	$(window).load(routerResolve);

});