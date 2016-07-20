// data is saved in 000003.txt at
// C:\Users\mjkim\AppData\Local\Google\Chrome\User Data\Default\Local Extension Settings\eilllankfpchokjofpgnhjbfppmhjckh
function saveLoginHistory() {
    // resend message with correct loginAttempt value
    evaluateLoginAttempt(true, true);

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
        passwords.push("" + CryptoJS.AES.encrypt(passwordValue, "passphrase")); // use arbitrary key for now
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
}

function evaluateLoginAttempt(submitClicked, submitExists) {
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
            console.log("UNKNOWN");
        }
    });
}

// check whether the page has a password element
var password = document.querySelector('input[type=password]');

if (password) {
    evaluateLoginAttempt(false, true);

    var loginform = password.form;
    if (!loginform) { loginform = password.closest("fieldset"); }
    var username = loginform.querySelector('input[type=text], input[type=email]');
    var sub = loginform.querySelector('input[type=submit]');        // do multiple if loops instead of OR condition
    if (!sub) { loginform.querySelector('button[type=submit]'); }   // in order to give priority to different
    if (!sub) { loginform.querySelector('button[type=button]'); }   // input types/button types

    // NEED TO CHANGE THIS (FOR NOW IT IS AN ARBITRARY STRING)
    var attempt = "unchecked";

    // if submit button is clicked call saveLoginHistory function
    sub.onclick = saveLoginHistory;
}
else {
    evaluateLoginAttempt(false, false);
}
