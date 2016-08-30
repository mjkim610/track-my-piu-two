function openNav() {
    document.getElementById("mySidenav").style.width = "200px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function checkStatus() {
    var slider = document.getElementById("sliderCheckbox");
    var i;
    if (slider.checked) {
        console.log("It's checked!");
        var experimentalElements = document.getElementsByClassName("experimental");
        for (i=0; i<experimentalElements.length; i++) {
            experimentalElements[i].style.display = "block";
        }
    } else {
        console.log("It's unchecked!");
        var experimentalElements = document.getElementsByClassName("experimental");
        for (i=0; i<experimentalElements.length; i++) {
            experimentalElements[i].style.display = "none";
        }
    }
}

var openNavAnchor = document.getElementById("openNav");
var closeNavAnchor = document.getElementById("closeNav");
var slider = document.getElementById("sliderCheckbox");

openNavAnchor.onclick = openNav
closeNavAnchor.onclick = closeNav;
slider.onclick = checkStatus;
