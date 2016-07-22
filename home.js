function loadTable() {

    chrome.storage.local.get(null, function (result) {
        // count the number of entries
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
            cellAttempt = row.insertCell(4);

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
            cellAttempt.innerHTML = result.attempts[i];
        }
    });
}

function showResult() {
	//if textbox is empty
    if (searchText.value == "") {
        alert("SearchBox is Empty!");}
	
	//if there is text to search
    else {
        rows = table.getElementsByTagName("tr");
        var count = 0;
        if (radioURL.checked) {
            alert("search by URL");
            for (var i = 1; i < rows.length; i++) {
                var row = rows[i];
                var url = row.getElementsByTagName("td")[0].innerHTML;
                if (url.includes(searchText.value)) {
                    row.style.display = '';
                    count++;
                }
                else {
                    row.style.display = 'none';
                }
            }
            countResult(count);
        }
        else if (radioID.checked) {
            alert("search by UserName");
            for (var i = 1; i < rows.length; i++) {
                var row = rows[i];
                var userName = row.getElementsByTagName("td")[1].innerHTML;
                if (userName.includes(searchText.value)) {
                    row.style.display = '';
                    count++;
                }
                else {
                    row.style.display = 'none';
                }
            }
            countResult(count);
        }
        else {
            alert("Please select search type!");
        }
    }
}

function countResult(count) {
    if (count != 0) {
        alert("There are " + count + " matching result(s).");
    }
    else {
        alert("There are no matching result.");
    }
}

function resetHistory() {
    chrome.storage.local.clear();
    alert("History cleared!");
    chrome.tabs.reload();
}

function removeTable() {
    for (i = 0; i < entryCount; i++) {
        row = table.deleteRow(entryCount - i);
    }
}

function changeSelect(){
	var selectedIndex = dropdown.selectedIndex;
	var rows = table.getElementsByTagName("tr");
	
	var time = new Date();
	var year = time.getFullYear();//alert("year: "+year);
	var month = time.getMonth()+1;//alert("month: "+month);
	var date = time.getDate();//alert("date: "+date);
	var todayT = dateToInt(year, month, date);
	
	var yesterday = time.setDate(time.getDate()-1);
	
	var yearY = yesterday.getFullYear(); 
	var monthY = yesterday.getMonth()+1;
	var dateY = yesterday.getDate();
	yesterday = dateToInt(yearY, monthY, dateY);
	alert(yesterday);
	
	switch(selectedIndex) {
		
		case 0://whole
			alert(dropdown.options[0].value);
			for (var i = 1; i < rows.length; i++){
				var row = rows[i];
				var timeC = row.getElementsByTagName("td")[3].innerHTML;
				var yearC = getByIndex(timeC, 0, 3);
				var monthC = getByIndex(timeC, 5, 6);
				var dateC = getByIndex(timeC, 8, 9);
				var then = dateToInt(yearC,monthC,dateC);
				
			}
			break;
		case 1://1day
			alert(dropdown.options[1].value);
			break;
		case 2://2days
			alert(dropdown.options[2].value);	
			break;
		case 3://1week
			alert(dropdown.options[3].value);	
			break;
		case 4://1month
			alert(dropdown.options[4].value);	
			break;
		case 5://1year
			alert(dropdown.options[5].value);
			break;
		default:
			break;
	}
}
function getByIndex(str, start, finish){
	var result = "";
	for (var i = start; i < finish+1; i++){
		result += str.charAt(i);}
	return result;
}
function dateToInt(a, b, c){
	return parseInt(a)*10000+parseInt(b)*100+parseInt(c);
	
}

var entryCount;
var resetButton = document.querySelector("button[id=reset]");
var searchButton = document.querySelector("button[id=search]");
var searchText = document.getElementById("searchText");
var table = document.getElementById("loginInfoTable");
var radioURL = document.getElementById("radioURL");
var radioID = document.getElementById("radioID");
var dropdown = document.getElementById("select");

document.body.onload = loadTable;
resetButton.onclick = resetHistory;
searchButton.onclick = showResult;
dropdown.onchange = changeSelect;




