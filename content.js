
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
