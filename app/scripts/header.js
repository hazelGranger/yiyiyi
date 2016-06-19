$(document).ready(function(){

	var header ={
		dom: $('header'),
		list: $('.header-list'),
		headerOpen: false,

		open: function(){
			var headerobj = this;
			headerobj.dom.addClass("open");
			headerobj.list.show();
			setTimeout(function(){
				headerobj.list.animate({"opacity" : 1},500);
				 headerobj.headerOpen = true;
			}, 100);
		},

		close: function(){
			var headerobj = this;
			headerobj.list.animate({"opacity" : 0},500);
			setTimeout(function(){
				headerobj.list.hide();
				headerobj.dom.removeClass("open");
				headerobj.headerOpen = false;
			}, 600);
		}
	}

	$(".logo a").click(function(){
		console.log('logo a');
		if (header.headerOpen) {
			header.close();
		}else {
			header.open();
		}
	});

	$('body').on("click",".header-list",function(){
		console.log('123');
		if (header.headerOpen) {
			header.close();
		}
	});

	$(".header-list a").click(function(e){
		e.stopPropagation();
	});

	
});