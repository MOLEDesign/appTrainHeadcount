// useful for finding elements
var element = function (id) {
    return document.getElementById(id);
}
var errorMessage = undefined;

// Enable local storage
function getLocalStorage() {
    try {
        if (!!window.localStorage) return window.localStorage;
        else return undefined;
    } catch (e) {
        return undefined;
    }
}

// Enable session storage
function getSessionStorage() {
    try {
        if (!!window.sessionStorage) return window.sessionStorage;
        else return undefined;
    } catch (e) {
        return undefined;
    }
}


// Setup base storage for variables
var db_user = getLocalStorage() || dispError('Local Storage not supported.');
var db_server = getLocalStorage() || dispError('Local Storage not supported.');
var db_journey = getLocalStorage() || dispError('Local Storage not supported.');
var db_headcount = getSessionStorage() || dispError('Session Storage not supported.');
var db_misccount = getSessionStorage() || dispError('Session Storage not supported.');
var db_crs = getLocalStorage() || dispError('Local Storage not supported.');

var db_announce = getSessionStorage() || dispError('Session Storage not supported.');

// General effects and page loaders
function fadeIn() {
    $("body").hide();
    $("body").fadeIn(50);
}

function loadPageFade(urlvar) {
    $("body").fadeOut(50, function(){ window.location.href = urlvar; });
}


// User functions



function dbGoUser() {
    if (errorMessage) return;
    var f = element('postSettings');
    db_user.setItem('full_name', f.elements['full_name'].value);
    db_user.setItem('mobile_number', f.elements['mobile_number'].value);
    db_user.setItem('email_address', f.elements['email_address'].value);
    db_user.setItem('depot', f.elements['depot'].value);


    $("#full_name").attr("placeholder", db_user.getItem('full_name'));
    $("#mobile_number").attr("placeholder", db_user.getItem('mobile_number'));
    $("#email_address").attr("placeholder", db_user.getItem('email_address'));
    $("#depot").val(db_user.getItem('depot'))
    alert('User information stored');
    loadPageFade('index.html');
}

function loadUserSettings() {
    $("#full_name").attr("value", db_user.full_name);
    $("#mobile_number").attr("value", db_user.mobile_number);
    $("#email_address").attr("value", db_user.email_address);
    $("#depot .typeahead").typeahead('val', db_user.getItem('depot'));
}

function checkLoggedin() {
    $('.user_signed_in').hide();
    $('.user_not_signed_in').hide();
    if (!db_user.full_name) {
        // variable is undefined so alert and force action
        $('.user_signed_in').hide();
        $('.user_not_signed_in').show();
        $('#signed_in_message').text('You are not signed in');
    } else {
        // variable is undefined so alert and force action
        $('.user_signed_in').show();
        $('.user_not_signed_in').hide();
        $('#signed_in_message').text('You are signed in as ' + db_user.full_name);
    }
}

function checkLoggedInPage() {
    if (!db_user.full_name) {
        // variable is undefined so alert and force action
        alert('You need to sign in before accessing this page');
        loadPageFade('settings.html');
    }
}

function dbClearUser() {
    db_user.setItem('full_name', '');
    db_user.setItem('mobile_number', '');
    db_user.setItem('email_address', '');
    db_user.setItem('depot', '');
    alert('User signed out');
    loadPageFade('index.html');
}

// Journey Functions

function loadJourneySettings() {
    $("#headcode").attr("value", db_journey.headcode);
    $('#firstclasscar').val(db_journey.firstclasscar);
    $('#standardclasscar').val(db_journey.standardclasscar);
    $('#dept_station .typeahead').typeahead('val', db_journey.getItem('dept_station'));
    $('#dept_time').val(db_journey.dept_time);
}

function dbJourneyGo() {
    if (errorMessage) return;
    var f = element('postJourney');
    db_journey.setItem('headcode', f.elements['headcode'].value);
    db_journey.setItem('firstclasscar', f.elements['firstclasscar'].value);
    db_journey.setItem('standardclasscar', f.elements['standardclasscar'].value);
    db_journey.setItem('dept_station', f.elements['dept_station'].value);
    db_journey.setItem('dept_time', f.elements['dept_time'].value);
    alert('Journey stored');
    loadPageFade('index.html');
}

function dbClearJourneyGo() {
    db_journey.setItem('headcode', '');
    db_journey.setItem('firstclasscar', '');
    db_journey.setItem('standardclasscar', '');
    db_journey.setItem('dept_station', '');
    db_journey.setItem('dept_time', '');
    alert('Journey data cleared');
    loadPageFade('journey_info.html');
}

// Annoucnement report functions

function dbClearHeadcountGo() {
    db_headcount.setItem('count_point', '');
    db_headcount.setItem('first_class', '');
    db_headcount.setItem('standard_class', '');
    alert('Headcount data cleared');
    loadPageFade('count_headcount.html');
}

function dbClearMisccountGo() {
    db_misccount.setItem('count_point', '');
    db_misccount.setItem('bikes_off', '');
    db_misccount.setItem('bikes_on', '');
    db_misccount.setItem('large_luggage', '');
    alert('Misccount data cleared');
    loadPageFade('count_misccount.html');
}

function dbHeadcountGo() {
    var f = element('postHeadcount');
    db_headcount.setItem('count_point', f.elements['count_point'].value);
    db_headcount.setItem('first_class', f.elements['first_class'].value);
    db_headcount.setItem('standard_class', f.elements['standard_class'].value);

    if (!db_journey.dept_time) {
        db_journey.setItem('dept_time', '');
    }

    $('#loadingmessage').show();  // show the loading message.
    $.ajax({
        type: 'POST',
        url: 'http://railtrcks.gwtrains.co.uk/components/com_rtheadcount/mobile/save_2_2_0.php',
        data: {
            count_point: db_headcount.getItem('count_point'),
            first_class: db_headcount.getItem('first_class'),
            standard_class: db_headcount.getItem('standard_class'),
            headcode: db_journey.getItem('headcode'),
            dept_time: db_journey.getItem('dept_time'),
            dept_station: db_journey.getItem('dept_station'),
            firstclasscar: db_journey.getItem('firstclasscar'),
            standardclasscar: db_journey.getItem('standardclasscar'),
            full_name: db_user.getItem('full_name'),
            email_address: db_user.getItem('email_address'),
            mobile_number: db_user.getItem('mobile_number'),
            depot: db_user.getItem('depot')
        },
        //change the url for your project
        success: function (data) {

            db_headcount.setItem('count_point', '');
            db_headcount.setItem('first_class', '');
            db_headcount.setItem('standard_class', '');
            alert('Headcount Sent');
            loadPageFade('announcement_submitted.html');

        },
        error: function () {
            alert('There was an error recording your headcount. Please check signal strength and try again');
            $("#count_point .typeahead").typeahead('val', db_headcount.getItem('count_point'));
            $('#first_class').val(db_headcount.first_class);
            $('#standard_class').val(db_headcount.standard_class);
            loadPageFade('count_headcount.html');
        }
    });

    return false;

};

function stationLookUp() {
    var stationList = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('station_name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: 'data/stations.json'
    });

    stationList.initialize();

    $('#dept_station .typeahead').typeahead(null, {
        name: 'dept_station',
        displayKey: 'crs_code',
        valueKey: 'crs_code',
        source: stationList.ttAdapter(),
        templates: {
            empty: [
                '<div class="empty-message">',
                'Unable to find any FGW Stations that match the current query',
                '</div>'
            ].join('\n'),
            suggestion: Handlebars.compile('<p><strong>{{station_name}}</strong> ({{crs_code}})</p>')
        }
    });

    $('#count_point .typeahead').typeahead(null, {
        name: 'count_point',
        displayKey: 'crs_code',
        valueKey: 'crs_code',
        source: stationList.ttAdapter(),
        templates: {
            empty: [
                '<div class="empty-message">',
                'Unable to find any FGW Stations that match the current query',
                '</div>'
            ].join('\n'),
            suggestion: Handlebars.compile('<p><strong>{{station_name}}</strong> ({{crs_code}})</p>')
        }
    });
}

function depotLookUp() {
    var depotList = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('depot_name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        prefetch: 'data/depots.json'
    });

    depotList.initialize();

    $('#depot .typeahead').typeahead(null, {
        name: 'depot',
        displayKey: 'depot_name',
        valueKey: 'depot_name',
        source: depotList.ttAdapter(),
        templates: {
            empty: [
                '<div class="empty-message">',
                'Unable to find any FGW Depots that match the current query',
                '</div>'
            ].join('\n'),
            suggestion: Handlebars.compile('<p><strong>{{depot_name}}</strong></p>')
        }
    });
}

