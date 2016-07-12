// find the relevant elements
var password = document.querySelector('input[type=password]');
var loginform = password.form;
var username = loginform.querySelector('input[type=text], input[type=email]')
var sub = loginform.querySelector('input[type=submit]');

// data is saved in 000003.txt at
// C:\Users\mjkim\AppData\Local\Google\Chrome\User Data\Default\Local Extension Settings\eilllankfpchokjofpgnhjbfppmhjckh
function saveLoginHistory() {

    // store values into separate variables
    var usernameValue = username.value;
    var passwordValue = password.value;

    // for debugging purposes, erase when done
    alert(sub.id);
    alert(username.id + ": " + usernameValue);
    alert(password.id + ": " + passwordValue);
    alert(loginform.id);

    // store each variable into corresponding arrays
    chrome.storage.local.get({urls: []}, function (result) {
        var urls = result.urls;
        urls.push(document.URL);
        chrome.storage.local.set({ urls: urls });
    });
    chrome.storage.local.get({usernames: []}, function (result) {
        var usernames = result.usernames;
        usernames.push(usernameValue);
        chrome.storage.local.set({ usernames: usernames });
    });
    chrome.storage.local.get({passwords: []}, function (result) {
        var passwords = result.passwords;
        passwords.push(passwordValue);
        chrome.storage.local.set({ passwords: passwords });
    });
    chrome.storage.local.get({times: []}, function (result) {
        var times = result.times;
        times.push(Date.now());
        chrome.storage.local.set({ times: times });
    });
}

// if submit button is clicked call saveLoginHistory function
sub.onclick = saveLoginHistory;
