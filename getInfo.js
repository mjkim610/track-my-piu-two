// write relevant info to home.html
// currently only reads when 1 entry exists
// don't know what will happen when there are multiple entries
chrome.storage.local.get('url', function (urlResult) {
    url = urlResult.url;
    document.getElementById("urlInfo").innerHTML = url;
});

chrome.storage.local.get('password', function (passwordResult) {
    password = passwordResult.password;
    document.getElementById("passwordInfo").innerHTML = password;
});

chrome.storage.local.get('time', function (timeResult) {
    time = timeResult.time;
    document.getElementById("timeInfo").innerHTML = time;
});
