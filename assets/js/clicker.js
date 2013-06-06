function Init () {
	var counter = document.getElementById ("counter");
	for (var i = 1; i < 1000; i++) {
		var option = new Option (i, i);
		counter.options.add (option);
	}
	counter.focus ();
}

function OnKeyPresscounter (event, counter) {
	var chCode = ('charCode' in event) ? event.charCode : event.keyCode;

	if (chCode == 32 /* + */) {
		if (counter.selectedIndex < counter.options.length - 1) {
			counter.selectedIndex++;
		}
	}
}