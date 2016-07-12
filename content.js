//find type=password elements array
var password = document.querySelector('input[type=password]');
//alert(password.id);

//find a form including the password element
var loginform = password.form;
//alert(loginform.id);

//find a type=text or type=email element in the form
var id = loginform.querySelector('input[type=text], input[type=email]')
//alert(id.id);

//find a type=submit element in the form which is found above
var sub = loginform.querySelector('input[type=submit]');
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
        chrome.storage.local.set({ urls: urls });
    });
    chrome.storage.local.get({ids: []}, function (result) {
        var ids = result.ids;
        ids.push(id.value);
        chrome.storage.local.set({ ids: ids });
    });
    chrome.storage.local.get({passwords: []}, function (result) {
        var passwords = result.passwords;
        passwords.push(password.value);
        chrome.storage.local.set({ passwords: passwords });
    });
    chrome.storage.local.get({times: []}, function (result) {
        var times = result.times;
        times.push(Date.now());
        chrome.storage.local.set({ times: times });
    });
}
