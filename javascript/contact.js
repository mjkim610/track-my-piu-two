function initialize() {
    loadMapsScript();
    validateForm();
}

function loadMapsScript() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAbqw9jWAQB-k-iHkFWM-BoqVPLgjBAgk8&callback=initMap';
    document.body.appendChild(script);
}

function initMap() {
    var map;
    var yonseiERC = { lat: 37.560847, lng: 126.935469 };
    map = new google.maps.Map(document.getElementById('map'), {
        center: yonseiERC,
        zoom: 17
    });

    var marker = new google.maps.Marker({
        position: yonseiERC,
        animation: google.maps.Animation.DROP,
        map: map,
        title: 'Yonsei University Engineering Research Park'
    });

    var infoWindow = new google.maps.InfoWindow({
      content: "<h1 class='mapInfo'><b>Eagle Team Headquarters:</b></br>Yonsei University Engineering Research Park</h1>"
    });


    marker.addListener('click', function() {
      infoWindow.open(map, marker);
    });
}

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

function removeWarning() {
    document.getElementById(this.id + "Error").innerHTML = "";
}


document.body.onload = initialize;

/* ********************
 * *******NOTES********
 * ********************
 */
// google maps API key: AIzaSyAbqw9jWAQB-k-iHkFWM-BoqVPLgjBAgk8

// utilize this regular expression checker later!
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}
