$(document).ready(function(){
	console.log('qa.js');
	$('.qa-group').mouseenter(function(){
		console.log('mouseenter');
		$('.a').slideUp();
		$(this).find('.a').sildeDown();

	});
});