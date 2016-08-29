function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

var openNavAnchor = document.getElementById("openNav");
var closeNavAnchor = document.getElementById("closeNav");

openNavAnchor.onclick = openNav
closeNavAnchor.onclick = closeNav;
