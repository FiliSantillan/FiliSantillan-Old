var $buttonShow = document.getElementById("show");
var $buttonHide = document.getElementById("hide");
var $menu = document.getElementById("menu");

var verMenu = function(e){
	$buttonShow.classList.remove('is-active');
	$buttonHide.classList.add('is-active');
	$menu.classList.add('is-active');
	e.preventDefault();
}

var ocultarMenu = function(e){
	$buttonShow.classList.add('is-active');
	$buttonHide.classList.remove('is-active');
	$menu.classList.remove('is-active');
	e.preventDefault();
}

$buttonShow.addEventListener("click", verMenu);
$buttonHide.addEventListener("click", ocultarMenu);

//JQuery
$(function(){
    $('nav ul li a').on('click',function(e){
        e.preventDefault();
        var strAncla=$(this).attr('href');
        $('body,html').stop(true,true).animate({
            scrollTop: $(strAncla).offset().top
        },1000);
    });
	$('.flechita').on('click',function(e){
		//prevenir en comportamiento predeterminado del enlace
		e.preventDefault();
		//obtenemos el id del elemento en el que debemos posicionarnos
		var strAncla=$(this).attr('href');
		
		//utilizamos body y html, ya que dependiendo del navegador uno u otro no funciona
		$('body,html').stop(true,true).animate({
			//realizamos la animacion hacia el ancla
			scrollTop: $(strAncla).offset().top
		},1000);
	});
});