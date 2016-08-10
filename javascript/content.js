function saveLoginHistory() {

    evaluateLoginAttempt(true, true);
    console.log("SUBMIT BUTTON CLICKED");

    // store values into separate variables
    var usernameValue = username.value;
    var passwordValue = password.value;

    // store each variable into corresponding arrays
    chrome.storage.sync.get({urls: []}, function (result) {
        var urls = result.urls;
        urls.push(document.domain);
        chrome.storage.sync.set({ urls: urls });
    });

    chrome.storage.sync.get({usernames: []}, function (result) {
        var usernames = result.usernames;
        usernames.push(usernameValue);
        chrome.storage.sync.set({ usernames: usernames });
    });

    chrome.storage.sync.get({passwords: []}, function (result) {
        // obfuscation
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
        chrome.storage.sync.set({ passwords: passwords });
    });

    chrome.storage.sync.get({times: []}, function (result) {
        var times = result.times;
        times.push(new Date().toString());
        chrome.storage.sync.set({ times: times });
    });

    // create array object for storing old login logs
	time = new Date().toString();

	chrome.storage.sync.get({ arrays: [] }, function(result) {
	    var arrays = result.arrays;
	    var array = { url: document.domain, username: usernameValue, time: time };
	    if (arrays.length != 0) {
	        for (var i = 0; i < arrays.length; i++) {
	            if (JSON.parse(arrays[i]).url == document.domain) {
	                console.log("Updating array");
	                arrays.splice(i, 1);
	            }
	        }
	        console.log("Pushing to array");
	        arrays.push(JSON.stringify(array));
	        chrome.storage.sync.set({
	            arrays: arrays
	        });
	    } else {
	        console.log("Array is empty");
	        arrays.push(JSON.stringify(array));
	        chrome.storage.sync.set({
	            arrays: arrays
	        });
	    }
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

        console.log("======================================");
        console.log("EVALUATING LOGIN ATTEMPT");
        console.log("Previous domain: " + response.previousDomain);
        console.log("Current domain: " + parsedDomain);
        console.log("Previous page was login attempt: " + response.previousLoginAttempt);
        console.log("Current page was login attempt: " + submitClicked);
        console.log("Previous page was login page: " + response.previousLoginPage);
        console.log("Current page was login page: " + submitExists);
        console.log("======================================");

        /*
        // function to compare the number of elements in the url/attempt arrays
        // remove once done with debugging process
        chrome.storage.sync.get({ urls: [] }, function(result) {
            var urlCount = result.urls.length;
            chrome.storage.sync.get({ attempts: [] }, function(result) {
                var attemptCount = result.attempts.length;

                console.log("urlCount: "+urlCount);
                console.log("attemptCount: "+attemptCount);
            })
        });
        */

        if (parsedDomain == response.previousDomain && submitClicked && submitExists) {
            console.log("+++++++++");
            console.log("UNCHECKED");
            console.log("+++++++++");
            chrome.storage.sync.get({attempts: []}, function (result) {
                var attempts = result.attempts;
                // assume failure
                attempts.push("failure");
                chrome.storage.sync.set({ attempts: attempts });
            });
        }

        if (parsedDomain == response.previousDomain && (response.previousLoginAttempt && response.previousLoginPage) && !submitClicked) {
            if (submitExists) {
                chrome.storage.sync.get({attempts: []}, function (result) {
                    var attempts = result.attempts;
                    var attemptPop = attempts.pop();
                    // if previous state is failure or unchecked, current state is failure
                    if (attemptPop=="failure") {
                        console.log("+++++++++");
                        console.log("FAILURE");
                        console.log("+++++++++");
                        attempts.push("failure");
                        chrome.storage.sync.set({ attempts: attempts });
                    }
                    // if previous state is success, current state is logout
                    else if (attemptPop=="success") {
                        console.log("+++++++++");
                        console.log("LOGOUT");
                        console.log("+++++++++");
                        attempts.push("success");
                        chrome.storage.sync.set({ attempts: attempts });
                    }
                });
            }
            // if conditions are met, change (assumed) failure into success
            else if (response.previousLoginAttempt) {
                console.log("+++++++++");
                console.log("SUCCESS");
                console.log("+++++++++");
                chrome.storage.sync.get({attempts: []}, function (result) {
                    var attempts = result.attempts;
                    attempts.pop();
                    attempts.push("success");
                    chrome.storage.sync.set({ attempts: attempts });
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

function setBadgeValue() {
    chrome.storage.sync.get({arrays: []}, function (result) {
        // count the number of entries
        var entryArray = result.arrays;
        var entryTime;
        var currentTime = new Date();

        var warningCount = 0;

        for (i=0; i<entryArray.length; i++) {
            entryTime = new Date((JSON.parse(entryArray[i])).time);
            entryTime.setDate(entryTime.getDate()+100);

//          if (entryTime < currentTime) {
            if (entryTime < currentTime || entryTime >= currentTime) { // this shows every instance (using this temporarily for testing)
                warningCount++;
            }
        }

        chrome.runtime.sendMessage({badgeValue: warningCount}, function(response) {
        });
    });
}

/* https://en.wikipedia.org/wiki/List_of_most_popular_websites
 *
 * sites that work: google, facebook, amazon, login.live.com, wordpress, github,
 * naver, nate, yscec.yonsei.ac.kr, everytime.kr, daum, megabox, reddit, heroku,
 * gmarket.co.kr, c9.io, ebay.ca, 8tracks.com, wemakeprice
 *
 * sites that do not work:
 * twitter(multiple password fields),
 * yes24(img wrapped in anchor tag),
 * 11st.co.kr(username not captured) (doesn't work on lastpass either),
 */

// check whether the page has a password element
var password = document.querySelector('input[type=password]');
// if there is no password field, it is not a login page
if (password) {
    evaluateLoginAttempt(false, true);

    // find the loginform element from the password element
    var loginform = password.form;
    if (!loginform) { loginform = password.closest("fieldset"); }
    if (!loginform) { loginform = password.closest("div"); }

    // find the username element from the loginform element
    var username = loginform.querySelector('input[type=text], input[type=email]');

    // find the submit button element from the loginform element
    var submitButton = loginform.querySelector('input[type=submit]');
    if (!submitButton) { submitButton = loginform.querySelector('button[type=submit]'); }
    if (!submitButton) { submitButton = loginform.querySelector('button[type=button]'); }
    if (!submitButton) { submitButton = loginform.querySelector('input[type=button]'); }
    if (!submitButton) { submitButton = loginform.querySelector('input[type=image]'); }

    console.log("======================================");
    console.log("EVALUATING CURRENT PAGE");
    if (password.id) { console.log("Password: " + password.id); }
    else { console.log("Password: " + password.placeholder); }
    if (loginform.name) { console.log("Login Form: " + loginform.name); }
    else { console.log("Login Form: " + loginform.className); }
    if (username.id) { console.log("Username: " + username.id); }
    else { console.log("Username: " + username.placeholder); }
    if (submitButton.id) { console.log("Submit Button: " + submitButton.id); }
    else { console.log("Submit Button: " + submitButton.className); }
    console.log("======================================");

    // if submit button is clicked call saveLoginHistory function
    submitButton.onclick = saveLoginHistory;
}
else {
    evaluateLoginAttempt(false, false);
}

/*
var logout = $("a[class*='logout']");
console.log(logout.attr('class'));
*/

setBadgeValue();
