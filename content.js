// find the relevant elements
var password = document.querySelector('input[type=password]');
var loginform = password.form;
if (!loginform) {
    loginform = password.closest("fieldset");
}
var username = loginform.querySelector('input[type=text], input[type=email]')
var sub = loginform.querySelector('input[type=submit], button[type=submit], button[type=button]');

/*
// for debugging purposes, erase when done
alert(password.id);
alert(loginform.id);
alert(username.id);
alert(sub.id);
*/

// data is saved in 000003.txt at
// C:\Users\mjkim\AppData\Local\Google\Chrome\User Data\Default\Local Extension Settings\eilllankfpchokjofpgnhjbfppmhjckh
function saveLoginHistory() {

    // store values into separate variables
    var usernameValue = username.value;
    var passwordValue = password.value;

/*
    // for debugging purposes, erase when done
    alert(sub.id);
    alert(username.id + ": " + usernameValue);
    alert(password.id + ": " + passwordValue);
    alert(loginform.id);
*/

    // store each variable into corresponding arrays
    chrome.storage.local.get({urls: []}, function (result) {
        var urls = result.urls;

        var res = document.URL.split(/[.\/]/);
        var i;
        var url = "";
        for (i=0; i<res.length; i++) {
            if (res[i]=="com" || res[i]=="net" || res[i]=="org" || res[i]=="edu" || res[i]=="gov") {
                url = "*." + res[i-1] + "." + res[i];
                break;
            }
            if (res[i]=="co" || res[i]=="ac") {
                url = "*." + res[i-1] + "." + res[i] + "." + res[i+1];
                break;
            }
        }

        urls.push(url);
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
        times.push(new Date().toString());
        chrome.storage.local.set({ times: times });
    });
}

// if submit button is clicked call saveLoginHistory function
sub.onclick = saveLoginHistory;

// HOW DO I DETERMINE WHETHER USER LOGGED IN SUCCESSFULLY?
// IF THE PREVIOUS PAGE HAD A PASSWORD FIELD AND THE CURRENT PAGE ALSO HAS A PASSWORD FIELD,
// YOU CAN ASSUME THAT THE USER WAS UNSUCCESFUL IN LOGGING IN
// OR CHECK THAT THE PASSWORD FIELD AND THE USERNAME FIELD HAVE THE SAME ID'S
// IN BOTH THE PREVIOUS AND THE CURRENT PAGE
