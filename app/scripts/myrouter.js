$(function(){

	$('body').route('works/',function(request){
		console.log('works');
		//rotateXAction =true;
		App.terrain.rotateX180();
	}).route('about/',function(){
		console.log('about');
		App.terrain.rotateXStop();
	}).route('contact/',function(){
		console.log('contact');
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

	$(window).bind('hashchange',function(e,triggered){
		e.preventDefault();
		routerResolve();
	})

	$(window).load(routerResolve);

});