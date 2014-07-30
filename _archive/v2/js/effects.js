/*  JavaScript Document                      */

var isiPad = navigator.userAgent.indexOf("iPad") != -1;

$(document).ready(function(){	
/*	setOrientationListener(); */

	/* Load the default page */
	changePage ('index.html')
	
	
	/* Check if user variables have been entered */
	if (!db_user.getItem('fullname') || !db_user.getItem('mobilenumber')) {
		// variable is undefined so alert and force action
		alert('Please enter your personal details before logging headcounts');
		changePage ('page_04.html?v=1')
	}

	
	$('nav a').on('click', function(){
		$('nav a').removeClass('selected');
		$(this).addClass('selected');
		changePage($(this).attr('data-file'));
	})
	
	/* If using an apple device, can prompt to add to home screen */
	checkiPadStandAlone()
	
});

function changePage (fileName) {

	$('.content_container').animate({opacity:0}, 500, function(){
		$('.content_loading_container').load('assets/content/'+fileName, function() {
			$('.content_container').delay(250).animate({opacity:1}, 500);	
		})
	});
	
}
	

function setOrientationListener(){
	// check alignemnt every 500 miliseconds
	rotationInterval = setInterval( function(){ updateOrientation(); }, 500 );
}

function updateOrientation(){
	if($('body').width() < 320){
		$('.page').removeClass('landscape').addClass('portrait');
	}else{
		$('.page').removeClass('portrait').addClass('landscape');	
	}
}

function checkiPadStandAlone(){
	if(window.navigator.standalone == false) {
		$('.page').css('display','none');
		$('body').css('background-color','white').append('<img  src="assets/images/template/add_to_homescreen_fault.png?v=1"/>');
	}
}