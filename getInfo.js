var resetButton = document.querySelector("button[id=reset]");
var table = document.getElementById("loginInfoTable");

function loadTable() {
    // display which keys exist in the storage
    chrome.storage.local.get(null, function (result) {
        login = Object.keys(result);
        document.getElementById("loginInfo").innerHTML = login;
    })

    // count the number of entries
    var entryCount;
    chrome.storage.local.get(null, function (result) {
        entryCount = result.urls.length;

        // insert each entry into a new row
        for (i=0; i<entryCount; i++) {
            var row = table.insertRow(i+1);
            var cellUrl = row.insertCell(0);
            var cellPassword = row.insertCell(1);
            var cellTime = row.insertCell(2);

            cellUrl.innerHTML = result.urls[i];
            cellPassword.innerHTML = result.passwords[i];
            cellTime.innerHTML = result.times[i];
        }
    })
}

function resetHistory() {
    chrome.storage.local.clear();
    alert("History cleared!");
}

document.body.onload = loadTable
resetButton.onclick = resetHistory;
