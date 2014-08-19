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
});