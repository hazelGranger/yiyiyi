$(document).ready(function(){
	console.log('qa.js');

	$('body').on("mouseenter",".qa-group",function(){
		$('.a').slideUp();
		$(this).find('.a').slideDown();
	});

	$('body').on("mouseleave",".qa-group",function(){
		$(this).find('.a').slideUp();
	});

});