$(document).ready(function(){

	$('body').on("focus",".input-group input",function(){
		$(this).parent().addClass("active");
	}).on("blur",".input-group input",function(){
		$(this).parent().removeClass("active");
	})
});