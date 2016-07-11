// write relevant info to home.html
// currently only reads when 1 entry exists
// don't know what will happen when there are multiple entries
chrome.storage.local.get({urls: []}, function (result) {
    var urls = result.urls;
    document.getElementById('urlInfo').innerHTML = urls[0];
});

chrome.storage.local.get({passwords: []}, function (result) {
    var passwords = result.passwords;
    document.getElementById('passwordInfo').innerHTML = passwords[0];
});

chrome.storage.local.get({loginTimes: []}, function (result) {
    var loginTimes = result.loginTimes;
    document.getElementById('timeInfo').innerHTML = loginTimes[0];
});

chrome.storage.local.get(null, function (loginResult) {
    login = Object.keys(loginResult);
    document.getElementById("loginInfo").innerHTML = login;
})

/*
var tableDiv = document.getElementById("loginInfo");
var table = document.createElement('TABLE');
var tableBody = document.createElement('TBODY');

table.border = '1';
table.appendChild(tableBody);

var heading = new Array();
heading[0] = "URL";
heading[1] = "Password";
heading[2] = "Time";

var log = new Array();
log[0] = new Array();
*/
