//find type=password elements array
var pass = document.querySelectorAll('input[type=password]');
pass = pass[0];
//alert(pass.id);

//find a form including the password element
var logform = pass.form;
//alert(logform.id);

//find a type=submit element in the form which is found above
var sub = logform.querySelectorAll('input[type=submit]');
sub = sub[0];
//alert(sub.id);

// if submit button is clicked call saveLoginHistory function
sub.onclick = saveLoginHistory;






// data is saved in 000003.txt at
// C:\Users\mjkim\AppData\Local\Google\Chrome\User Data\Default\Local Extension Settings\eilllankfpchokjofpgnhjbfppmhjckh
function saveLoginHistory() {

    // check all elements in the form containing the "password input" element
    alert("Number of elements in form: " + logform.elements.length);
    var i;
    for (i = 0; i < logform.elements.length; i++) {
        alert("Element " + i + ": " + logform.elements[i].id);
    }

    // actual storage logic
    chrome.storage.local.set({'url': document.URL});
    chrome.storage.local.set({'password': pass.value});
    chrome.storage.local.set({'time': Date.now()});
}
