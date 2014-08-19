$(document).ready(function(){
	onscroll = function(){
		var headerTransparency = $(document).scrollTop();
		if (headerTransparency >= 106){
		$('.header').addClass('MainMenu-scrolled');
		}
		else {
			$('.header').removeClass('MainMenu-scrolled');
		}
	}
	var target = null;
	$('.image').hover(function(e){
    	target = $(this);
    	$(target[0].firstElementChild).fadeIn(300);
	}, function(){
    	$(target[0].firstElementChild).fadeOut(300);
	});
});