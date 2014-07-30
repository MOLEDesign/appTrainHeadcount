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
    $("body").fadeIn(500);
}

function loadPageFade(urlvar) {
    $("body").fadeOut(500, function(){ window.location.href = urlvar; });
}


// User functions

function dbGoUser() {
    if (errorMessage) return;
    var f = element('postSettings');
    db_user.setItem('full_name', f.elements['full_name'].value);
    db_user.setItem('mobile_number', f.elements['mobile_number'].value);
    db_user.setItem('email_address', f.elements['email_address'].value);
    db_user.setItem('depot', f.elements['depot'].value);

    console.log('Saved!');

    $('#usersettings').each(function () {
        this.reset();
    });
    alert('User information stored');
    loadPageFade('index.html');
}

function loadUserSettings() {
    $("#full_name").attr("value", db_user.full_name);
    $("#mobile_number").attr("value", db_user.mobile_number);
    $("#email_address").attr("value", db_user.email_address);
    $('#depot .typeahead').typeahead('val', db_user.getItem('depot'));
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
    $("#firstclass").attr("value", db_journey.firstclass);
    $("#standard").attr("value", db_journey.standardclass);
    $('#dept_station .typeahead').typeahead('val', db_journey.getItem('dept_station'));
    $("#dept_time").attr("value", db_journey.dept_time);
}

function dbJourneyGo() {
    if (errorMessage) return;
    var f = element('postJourney');
    db_journey.setItem('headcode', f.elements['headcode'].value);
    db_journey.setItem('firstclass', f.elements['firstclass'].value);
    db_journey.setItem('standardclass', f.elements['standardclass'].value);
    db_journey.setItem('dept_station', f.elements['dept_station'].value);
    db_journey.setItem('dept_time', f.elements['dept_time'].value);
    alert('Journey stored');
    loadPageFade('announcement_info.html');
}

function dbClearJourneyGo() {
    db_journey.setItem('headcode', '');
    db_journey.setItem('firstclass', '');
    db_journey.setItem('standardclass', '');
    db_journey.setItem('dept_station', '');
    db_journey.setItem('dept_time', '');
    alert('Journey data cleared');
    loadPageFade('journey_info.html');
}

// Annoucnement report functions

function dbClearAnnouncementGo() {
    db_announce.setItem('type', '');
    db_announce.setItem('location', '');
    db_announce.setItem('announcement', '');
    db_announce.setItem('underground', '');
    db_announce.setItem('advise_of_arrival', '');
    db_announce.setItem('comments', '');
    alert('Report data cleared');
    loadPageFade('announcement_info.html');
}

function dbAnnounceGo() {
    var f = element('postAnnounce');
    db_announce.setItem('type', f.elements['type'].value);
    db_announce.setItem('location', f.elements['location'].value);
    db_announce.setItem('announcement', f.elements['announcement'].value);
    db_announce.setItem('underground', f.elements['underground'].value);
    db_announce.setItem('advise_of_arrival', f.elements['advise_of_arrival'].value);
    db_announce.setItem('comments', f.elements['comments'].value);

    $('#loadingmessage').show();  // show the loading message.
    $.ajax({
        type: 'POST',
        url: 'http://railtracks.gwtrains.co.uk/components/com_rtannounce/mobile/save_2_1_0.php',
        data: {
            type: db_announce.getItem('type'),
            headcode: db_journey.getItem('headcode'),
            departure: db_journey.getItem('departure'),
            time: db_journey.getItem('time'),
            destination: db_journey.getItem('destination'),
            location: db_announce.getItem('location'),
            announcement: db_announce.getItem('announcement'),
            underground: db_announce.getItem('underground'),
            advise_of_arrival: db_announce.getItem('advise_of_arrival'),
            comments: db_announce.getItem('comments'),
            full_name: db_user.getItem('full_name'),
            email_address: db_user.getItem('email_address'),
            mobile_number: db_user.getItem('mobile_number')
        },
        //change the url for your project
        success: function (data) {

            db_announce.setItem('type', '');
            db_announce.setItem('location', '');
            db_announce.setItem('announcement', '');
            db_announce.setItem('underground', '');
            db_announce.setItem('advise_of_arrival', '');
            db_announce.setItem('comments', '');
            alert('Report Sent');
            loadPageFade('announcement_submitted.html');

        },
        error: function () {
            alert('There was an error recording your report. Please check signal strength and try again');
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

