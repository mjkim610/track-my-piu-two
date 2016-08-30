function openNav() {
    document.getElementById("mySidenav").style.width = "225px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

function checkStatus() {
    var slider = document.getElementById("sliderCheckbox");
    var i;
    if (slider.checked) {
        $(".experimental").animate({width: 'toggle'});
        // $(".experimental").fadeIn(0); // no animation
    } else {
        $(".experimental").animate({width: 'toggle'});
        // $(".experimental").fadeOut(0); // no animation
    }
}

var openNavAnchor = document.getElementById("openNav");
var closeNavAnchor = document.getElementById("closeNav");
var slider = document.getElementById("sliderCheckbox");

openNavAnchor.onclick = openNav
closeNavAnchor.onclick = closeNav;
slider.onclick = checkStatus;
