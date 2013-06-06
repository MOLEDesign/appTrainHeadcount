// JavaScript Document

function dispResultsjourney() {
	if(errorMessage) {
		element('results').innerHTML = errorMessage;
		return;
	}
	
	var t = new bwTable();
	t.addRow( ['Headcode : ', db_journey.getItem('headcode')] );
	t.addRow( ['Departing From : ', db_journey.getItem('deptstat')] );
	t.addRow( ['Departure Time : ', db_journey.getItem('depttime')] );
	element('results').innerHTML = t.getTableHTML();
}

function dbGojourney() {
	if(errorMessage) return;
	var f = element('journeyForm');
	db_journey.setItem('headcode', f.elements['headcode'].value);
	db_journey.setItem('deptstat', f.elements['deptstat'].value);
	db_journey.setItem('depttime', f.elements['depttime'].value);
	dispResultsjourney();
}

function dbClearallgo() {
	db_journey.setItem('deptstat', '');
	db_journey.setItem('depttime', '');
	db_journey.setItem('headcode', '');
	changePage ('page_06.html?v=1')
}

function dbNewcount() {
	changePage ('page_03.html?v=1')
}
