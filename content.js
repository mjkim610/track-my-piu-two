//find type=password elements array
var password = document.querySelectorAll('input[type=password]');
password = password[0];
//alert(password.id);

//find a form including the password element
var loginform = password.form;
//alert(loginform.id);

//find a type=submit element in the form which is found above
var sub = loginform.querySelectorAll('input[type=submit]');
sub = sub[0];
//alert(sub.id);

// if submit button is clicked call saveLoginHistory function
sub.onclick = saveLoginHistory;

// data is saved in 000003.txt at
// C:\Users\mjkim\AppData\Local\Google\Chrome\User Data\Default\Local Extension Settings\eilllankfpchokjofpgnhjbfppmhjckh
function saveLoginHistory() {

    // check all elements in the form containing the "password input" element
    alert("Number of elements in form: " + loginform.elements.length);
    var i;
    for (i = 0; i < loginform.elements.length; i++) {
        alert("Element " + i + ": " + loginform.elements[i].id);
    }

    // store each variable into corresponding arrays
    chrome.storage.local.get({urls: []}, function (result) {
        var urls = result.urls;
        urls.push(document.URL);
//        chrome.storage.local.remove({ urls: urls });
        chrome.storage.local.set({ urls: urls });
    });
    chrome.storage.local.get({passwords: []}, function (result) {
        var passwords = result.passwords;
        passwords.push(password.value);
//        chrome.storage.local.remove({ passwords: passwords });
        chrome.storage.local.set({ passwords: passwords });
    });
    chrome.storage.local.get({loginTimes: []}, function (result) {
        var loginTimes = result.loginTimes;
        loginTimes.push(Date.now());
//        chrome.storage.local.remove({ loginTimes: loginTimes });
        chrome.storage.local.set({ loginTimes: loginTimes });
    });
}
