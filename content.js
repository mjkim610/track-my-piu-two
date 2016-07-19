// data is saved in 000003.txt at
// C:\Users\mjkim\AppData\Local\Google\Chrome\User Data\Default\Local Extension Settings\eilllankfpchokjofpgnhjbfppmhjckh
function saveLoginHistory() {

    // store values into separate variables
    var usernameValue = username.value;
    var passwordValue = password.value;
    var attemptValue = attempt;

    // store each variable into corresponding arrays
    chrome.storage.local.get({urls: []}, function (result) {
        var urls = result.urls;
        urls.push(document.domain);
        chrome.storage.local.set({ urls: urls });
    });
    chrome.storage.local.get({usernames: []}, function (result) {
        var usernames = result.usernames;
        usernames.push(usernameValue);
        chrome.storage.local.set({ usernames: usernames });
    });
    chrome.storage.local.get({passwords: []}, function (result) {
        var passwords = result.passwords;
        passwords.push("" + CryptoJS.AES.encrypt(passwordValue, "passphrase"));
        chrome.storage.local.set({ passwords: passwords });
    });
    chrome.storage.local.get({times: []}, function (result) {
        var times = result.times;
        times.push(new Date().toString());
        chrome.storage.local.set({ times: times });
    });
    chrome.storage.local.get({attempts: []}, function (result) {
        var attempts = result.attempts;
        attempts.push(attemptValue);
        chrome.storage.local.set({ attempts: attempts });
    });
    // resend message with correct loginAttempt value
    sendMessage(true, true);
}

//domains that work: [facebook.com, github.com, yscec.yonsei.ac.kr, everytime.kr, acmicpc.net, amazon.com, login.live.com]
// domains that don't work: [naver.com, albamon.com, reddit.com]
function sendMessage(submitClicked, submitExists) {
    chrome.runtime.sendMessage({domain: document.domain, isLoginAttempt: submitClicked}, function(response) {
        console.log("Previous domain: " + response.previousDomain);
        console.log("Current domain: " + document.domain);
        console.log("Previous page was login attempt: " + response.previousLoginAttempt);
        console.log("Current page was login attempt: " + submitClicked);
        console.log("Current page was login page: " + submitExists);

        if (response.previousDomain == document.domain && response.previousLoginAttempt == true && submitClicked == false && submitExists == true) {
            console.log("FAIL");
        }
        else if (response.previousDomain == document.domain && response.previousLoginAttempt == true && submitExists == false) {
            console.log("SUCCESS");
        }
        else {
            console.log("I DON'T KNOW");
        }
    });
}

// find the relevant elements
var password = document.querySelector('input[type=password]');
// if current page has a login form
if (password) {
    var loginform = password.form;
    if (!loginform) {
        loginform = password.closest("fieldset");
    }
    var username = loginform.querySelector('input[type=text], input[type=email]');
    var sub = loginform.querySelector('input[type=submit], button[type=submit], button[type=button]');

    // NEED TO CHANGE THIS (FOR NOW IT IS AN ARBITRARY STRING)
    var attempt = "Unknown";

    // store the current conditions to background.js (the else statement is unncessary because javascript error occurs at line 52)
    if (password)
        sendMessage(false, true);

    // if submit button is clicked call saveLoginHistory function
    sub.onclick = saveLoginHistory;
}
// if current page does not have a login form
else {
    sendMessage(false, false);
}
