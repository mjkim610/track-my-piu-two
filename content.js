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
        // do not store passphrase, salt, and iv in the code itself!
        var passwords = result.passwords;
        var passphrase = "allyourpasswordarebelongtous"+document.domain;
        var salt = "saltnpepper";
        var iv = "teHL337H4x0r";

        var key = CryptoJS.PBKDF2(
            passphrase,
            CryptoJS.enc.Utf8.parse(salt),
            { keySize: 512/32, iterations: 100 }
        );

        var encrypted = CryptoJS.AES.encrypt(
            passwordValue,
            key,
            { iv: CryptoJS.enc.Utf8.parse(iv) }
        );

        var ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);

        passwords.push(ciphertext);
        chrome.storage.local.set({ passwords: passwords });
    });

    chrome.storage.local.get({times: []}, function (result) {
        var times = result.times;
        times.push(new Date().toString());
        chrome.storage.local.set({ times: times });
    });
}
/*
 * Method:
 * 1. Given the parsed domain is same for previous page and current page
 * 2. If login attempt occurs at login page (TT), then create a new entry for login evaluation
 * 3. If the page after a login attempt is not a login page and is not a login attempt (FF), then assume successful login
 *      (note that multiple FF can occur in succession because login pages are redirected multiple times)
 * 4. If the page after a login attempt is a login page and is not a login attempt (FT), then assume failed login
 * Problem:
 * There is no way to differentiate a successful login after multiple web page redirections and a logout
 */
function evaluateLoginAttempt(submitClicked, submitExists) {
    var parsedDomain = parseDomain(document.domain);
    chrome.runtime.sendMessage({domain: parsedDomain, isLoginAttempt: submitClicked, isLoginPage: submitExists}, function(response) {

        console.log("=========================================");
        console.log("EVALUATING LOGIN ATTEMPT");
        console.log("Previous domain: " + response.previousDomain);
        console.log("Current domain: " + parsedDomain);
        console.log("Previous page was login attempt: " + response.previousLoginAttempt);
        console.log("Current page was login attempt: " + submitClicked);
        console.log("Previous page was login page: " + response.previousLoginPage);
        console.log("Current page was login page: " + submitExists);
        console.log("=========================================");

        if (parsedDomain == response.previousDomain && submitClicked && submitExists) {
            console.log("+++++++++");
            console.log("UNCHECKED");
            console.log("+++++++++");
            chrome.storage.local.get({attempts: []}, function (result) {
                var attempts = result.attempts;
                attempts.push("unchecked");
                chrome.storage.local.set({ attempts: attempts });
            });
        }

        if (parsedDomain == response.previousDomain && ((response.previousLoginAttempt && response.previousLoginPage) || (response.previousLoginAttempt && response.previousLoginPage)) && !submitClicked) {
            if (submitExists) {
                console.log("+++++++++");
                console.log("FAILURE");
                console.log("+++++++++");
                chrome.storage.local.get({attempts: []}, function (result) {
                    var attempts = result.attempts;
                    attempts.pop();
                    attempts.push("failure");
                    chrome.storage.local.set({ attempts: attempts });
                });
            }
            else {
                console.log("+++++++++");
                console.log("SUCCESS");
                console.log("+++++++++");
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

function parseDomain(url) {
    var res = url.split(".");
    if (res.length <= 2) {
        return url;
    }
    else {
        var i;
        finalUrl = res[1];
        for(i=2; i<res.length; i++) {
            finalUrl = finalUrl + "." + res[i];
        }
        return finalUrl;
    }
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

    // if submit button is clicked call saveLoginHistory function
    sub.onclick = saveLoginHistory;
}
else {
    evaluateLoginAttempt(false, false);
}
