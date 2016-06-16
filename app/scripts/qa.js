$(document).ready(function(){



	$('body').on("click",".qa-group",function(){
		//$('.a').slideUp();
		$(this).find('.a').slideToggle();
	});

	// $('body').on("mouseleave",".qa-group",function(){
	// 	$(this).find('.a').slideUp();
	// });

});