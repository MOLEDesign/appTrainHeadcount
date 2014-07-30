//Code to display on mobiles
//========================================

changeViewport();

function changeViewport() {
	
	windoww=window.screen.width;
	windowh=window.screen.height;
	
	var viewport = document.querySelector("meta[name=viewport]");
	
	viewport.setAttribute('content', 'width=' + windoww + ',height=' + windowh + ', initial-scale=1, maximum-scale=1.0, user-scaleable=no;')	
}