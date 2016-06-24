$(document).ready(function(){


	$('body').on("click",".qa-group",function(){
		var $this = $(this);
		$('.qa-group').each(function(){
			if ($this.get(0) === $(this).get(0)) {
				$(this).find('.a').slideToggle();
			}else{
				$(this).find('.a').slideUp();
			}
		});
	});

});