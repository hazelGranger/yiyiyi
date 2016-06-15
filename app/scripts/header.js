$(document).ready(function(){

	var state = {
		headerOpen : false
	};

	$(".logo a").click(function(){
		var $header = $('header');
		var $list = $('.header-list');
		if (state.headerOpen) {
			
			$list.animate({"opacity" : 0},500);
			setTimeout(function(){
				$list.hide();
				$header.removeClass("open");
				state.headerOpen = false;				
			}, 600);

		}else {
			$header.addClass("open");
			$list.show();
			setTimeout(function(){
				$list.animate({"opacity" : 1},500);
				state.headerOpen = true;
			}, 100);

		}

	});

	
});