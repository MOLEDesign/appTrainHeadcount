// useful for finding elements
var element = function(id) { return document.getElementById(id); }
var errorMessage = undefined;


function getLocalStorage() {
    try {
        if( !! window.localStorage ) return window.localStorage;
        else return undefined;
    } catch(e) {
        return undefined;
    }
}


function getSessionStorage() {
    try {
        if( !! window.sessionStorage ) return window.sessionStorage;
        else return undefined;
    } catch(e) {
        return undefined;
    }
}


function dispError( message ) {
    errorMessage = '<p class="error">' + message + '</p>';
    haveError = true;
}


// Setup base storage for variables
var db_user = getLocalStorage() || dispError('Local Storage not supported.');
var db_server = getLocalStorage() || dispError('Local Storage not supported.');
var db_journey = getLocalStorage() || dispError('Local Storage not supported.');
var db_count = getSessionStorage() || dispError('Session Storage not supported.');
var db_crs = getLocalStorage() || dispError('Local Storage not supported.');