// data is saved in 000003.txt at
// C:\Users\mjkim\AppData\Local\Google\Chrome\User Data\Default\Local Extension Settings\cbkfgfglpekbddlcdfmjciampadpagbp
function saveLoginHistory() {

    evaluateLoginAttempt(true, true);
    console.log("SUBMIT BUTTON CLICKED");

    // store values into separate variables
    var usernameValue = username.value;
    var passwordValue = password.value;

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
}

function evaluateLoginAttempt(submitClicked, submitExists) {
    chrome.runtime.sendMessage({domain: document.domain, isLoginAttempt: submitClicked}, function(response) {

        console.log("EVALUATING LOGIN ATTEMPT");
        console.log("=========================================");
        console.log("Previous domain: " + response.previousDomain);
        console.log("Current domain: " + document.domain);
        console.log("Previous page was login attempt: " + response.previousLoginAttempt);
        console.log("Current page was login attempt: " + submitClicked);
        console.log("Current page was login page: " + submitExists);
        console.log("=========================================");

        // if submit button is clicked, store current status
        if (submitClicked) {
            console.log("UNCHECKED");
            chrome.storage.local.get({attempts: []}, function (result) {
                var attempts = result.attempts;
                attempts.push("unchecked");
                chrome.storage.local.set({ attempts: attempts });
            });
        }

        // if submit button is not clicked, check if current status is success/failure
        else {
            if (response.previousDomain == document.domain && submitExists == true && response.previousLoginAttempt == true) {
                console.log("FAILURE");
                chrome.storage.local.get({attempts: []}, function (result) {
                    var attempts = result.attempts;
                    attempts.pop();
                    attempts.push("failure");
                    chrome.storage.local.set({ attempts: attempts });
                });
            }
            else if (response.previousDomain == document.domain && submitExists == false && response.previousLoginAttempt == true) {
                console.log("SUCCESS");
                chrome.storage.local.get({attempts: []}, function (result) {
                    var attempts = result.attempts;
                    attempts.pop();
                    attempts.push("success");
                    chrome.storage.local.set({ attempts: attempts });
                });
            }
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
    if (!sub) { loginform.querySelector('button[type=button]'); }   // input/button types

    // NEED TO CHANGE THIS (FOR NOW IT IS AN ARBITRARY STRING)
    var attempt = "unchecked";

    // if submit button is clicked call saveLoginHistory function
    sub.onclick = saveLoginHistory;
}
else {
    evaluateLoginAttempt(false, false);
}
