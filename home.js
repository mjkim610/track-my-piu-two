function loadTable() {
    // count the number of entries
    var entryCount;
    chrome.storage.local.get(null, function (result) {
        entryCount = result.urls.length;

        var row, cellUrl, cellUsername, cellPassword, cellTime,
            timeConverted, yyyy, mm, dd, hh, minute, ss, ampm;

        // insert each entry into a new row
        for (i=0; i<entryCount; i++) {
            row = table.insertRow(i+1);
            cellUrl = row.insertCell(0);
            cellUsername = row.insertCell(1);
            cellPassword = row.insertCell(2);
            cellTime = row.insertCell(3);

            // format time variable into readable format
            timeConverted = new Date(result.times[i]);
            yyyy = timeConverted.getFullYear();
            mm = timeConverted.getMonth()+1;
            if (mm < 10) { mm = '0' + mm; }
            dd = timeConverted.getDate();
            if (dd < 10) { dd = '0' + dd; }
            hh = timeConverted.getHours();
            if (hh >= 12) { hh = hh - 12; ampm = 'PM'; }
            else { ampm = 'AM' };
            minute = timeConverted.getMinutes();
            if (minute < 10) { minute = '0' + minute; }
            ss = timeConverted.getSeconds();
            if (ss < 10) { ss = '0' + ss; }

            timeConverted = yyyy + '/' + mm + '/' + dd + ' ' + hh + ':' + minute + ':' + ss + ' ' + ampm;

            cellUrl.innerHTML = result.urls[i];
            cellUsername.innerHTML = result.usernames[i];
            cellPassword.innerHTML = result.passwords[i];
            cellTime.innerHTML = timeConverted;
        }
    });
}

function showResult() {
    if (searchText.value == "") {
        alert("SearchBox is Empty!");
    }
    else {
        alert(searchText.value);
        if (radioURL.checked) {
            alert("URL");
        }
        else if (radioID.checked) {
            alert("ID");
        }
        else {
            alert("Please select search type!");
        }
    }
}

function resetHistory() {
    chrome.storage.local.clear();
    alert("History cleared!");
    chrome.tabs.reload();
}

var resetButton = document.querySelector("button[id=reset]");
var searchButton = document.querySelector("button[id=search]");
var searchText = document.getElementById("searchText");
var table = document.getElementById("loginInfoTable");
var radioURL = document.getElementById("radioURL");
var radioID = document.getElementById("radioID");

document.body.onload = loadTable;
resetButton.onclick = resetHistory;
searchButton.onclick = showResult;
