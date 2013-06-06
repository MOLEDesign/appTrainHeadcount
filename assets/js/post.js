function dbCountgo() {

	var f = element('countForm');
	db_count.setItem('countpoint', f.elements['countpoint'].value);
	db_count.setItem('firstclass', f.elements['firstclass'].value);
	db_count.setItem('standardclass', f.elements['standardclass'].value);
	
	$('#loadingmessage').show();  // show the loading message.
	$.ajax({
		type: 'POST',
		url: 'http://myspace/administrator/components/com_trainheadcount/devicehelpers/save_1_0_0.php',
		data: { 
			countpoint:db_count.getItem('countpoint'),
			firstclass:db_count.getItem('firstclass'),
			standardclass:db_count.getItem('standardclass'),
			headcode:db_journey.getItem('headcode'),
			deptstat:db_journey.getItem('deptstat'),
			depttime:db_journey.getItem('depttime'),
			fullname:db_user.getItem('fullname'),
			depot:db_user.getItem('depot'),
			mobilenumber:db_user.getItem('mobilenumber')
		},
		//change the url for your project
		success: function(data){
			$('#loadingmessage').hide();  // hide the loading message.
			alert('Your count was successfully recorded');
			db_count.setItem('countpoint', '');
			db_count.setItem('firstclass', '');
			db_count.setItem('standardclass', '');
			changePage ('page_05.html?v=1')
		},
		error: function(){
			$('#loadingmessage').hide();  // hide the loading message.
			alert('There was an error recording your count. Please check signal strength and try again');
		}
	});
	
	return false;

};

function dispResultscount() {
	if(errorMessage) {
		element('results').innerHTML = errorMessage;
		return;
	}
	
	var t = new bwTable();
	t.addRow( ['headcode', db_user.getItem('headcode')] );
	t.addRow( ['coach', db_user.getItem('coach')] );
	t.addRow( ['carriage', db_user.getItem('carriage')] );
	t.addRow( ['description', db_user.getItem('description')] );
	element('results').innerHTML = t.getTableHTML();
}

