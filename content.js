//find type=password elements array
var pass = document.querySelectorAll('input[type=password]');
pass = pass[0];
//alert(pass.id);

/*
    in naver, this does not find the right form
    it should find id=frmNIDLogin
    but it finds [object HTMLInputElement]
*/
//find a form including the password element
var logform = pass.form;
//alert(logform.id);

//find a type=submit element in the form which is found above
var sub = logform.querySelectorAll('input[type=submit]');
sub = sub[0];
//alert(sub.id);

// if submit button is clicked call saveLoginHistory function
sub.onclick = saveLoginHistory;

function saveLoginHistory() {
    alert(pass.value);
    chrome.storage.sync.set({'password': password}, function() {
        message("Password saved!");
    })
}

/*
function saveLoginHistory() {
    alert("i have to save this!");
    chrome.storage.sync.set({'passwordId:' passId}, function() {
        message('Password ID saved');
    });
}
*/
