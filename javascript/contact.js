function validateForm() {
    document.getElementById("contactForm").onsubmit = function() {
        var submit = true;
        var name = document.forms["contactForm"]["name"].value;
        var email = document.forms["contactForm"]["email"].value;
        var message = document.forms["contactForm"]["message"].value;
        var errorMessage;

        if (name == null || name == "") {
            errorMessage = "Please enter your name";
            document.getElementById("nameError").innerHTML = errorMessage;
            submit = false;
        }
        if (email == null || email == "") {
            errorMessage = "Please enter your email";
            document.getElementById("emailError").innerHTML = errorMessage;
            submit = false;
        }
        if (message == null || message == "") {
            errorMessage = "Please enter your message";
            document.getElementById("messageError").innerHTML = errorMessage;
            submit = false;
        }
        return submit;
    }

    document.getElementById("name").onkeyup = removeWarning;
    document.getElementById("email").onkeyup = removeWarning;
    document.getElementById("message").onkeyup = removeWarning;
}

// utilize this regular expression checker later!
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function removeWarning() {
    document.getElementById(this.id + "Error").innerHTML = "";
}

document.body.onload = validateForm;
