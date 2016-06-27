$(document).ready(function(){

	var marginTopCount = function(elmt){
		console.log('marginTopCount');
		if (elmt) {

			if ($(window).width() > 767) {
				var mt = $(window).height()/2 - $(elmt).height()/2;
				$(elmt).css("margin-top",mt+"px");
			}else{
				$(elmt).css("margin-top","0");
			}
			
		}
	}

	marginTopCount('#countMarginTop');

	$(window).resize(function(){
		marginTopCount('#countMarginTop');
	});

});