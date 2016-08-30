function formatTime(timeRaw) {
    var timeConverted = new Date(timeRaw);

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
    return timeConverted;
}

function loadTable() {
    chrome.storage.sync.get(null, function (result) {
        // count the number of entries
        var entryCount = result.urls.length;

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
            cellAttempt.className = "experimental";
            cellAttempt.setAttribute("style", "display: none;");
			cellSFlag = row.insertCell(5);
			cellTFlag = row.insertCell(6);

            timeConverted = formatTime(result.times[i]);

            cellUrl.innerHTML = result.urls[i];
            cellUsername.innerHTML = result.usernames[i];
            cellPassword.innerHTML = result.passwords[i];
            cellTime.innerHTML = timeConverted;
            cellAttempt.innerHTML = result.attempts[i];
			cellSFlag.innerHTML = "T";
			cellSFlag.style.display='none';
			cellTFlag.innerHTML = "T";
			cellTFlag.style.display='none';
        }
    });
}

function showResult() {
	rows = table.getElementsByTagName("tr");
	//if textbox is empty
    if (searchText.value == "") {
        alert("Searchbox is Empty.\nResult will contain all entries within the chosen time!");
		for(var i = 1; i<rows.length; i++) {
			var row = rows[i];
			row.getElementsByTagName("td")[5].innerHTML="T";
		}
        show();
	}
	//if there is text to search
    else {
        if (radioUrl.checked) {
            for (var i = 1; i < rows.length; i++) {
                var row = rows[i];
                var url = row.getElementsByTagName("td")[0].innerHTML;
                if (url.includes(searchText.value)) {
                    row.getElementsByTagName("td")[5].innerHTML="T";
                } else {
                    row.getElementsByTagName("td")[5].innerHTML="F";
                }
            }
            show();
        } else if (radioUsername.checked) {
            for (var i = 1; i < rows.length; i++) {
                var row = rows[i];
                var userName = row.getElementsByTagName("td")[1].innerHTML;
                if (userName.includes(searchText.value)) {
                    row.getElementsByTagName("td")[5].innerHTML="T";
                }
                else {
                    row.getElementsByTagName("td")[5].innerHTML="F";
                }
            }
            show();
        } else {
            alert("Please select search type!");
        }
    }
}

function countResult(count) {
    if (count != 0) {
        console.log("There are " + count + " matching result(s).");
    } else {
        console.log("There are no matching result.");
    }
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
	var today = dateToInt(time.getFullYear(), time.getMonth()+1, time.getDate());

	var twodayago = new Date();
	twodayago.setDate(twodayago.getDate()-2);
	twodayago = dateToInt(twodayago.getFullYear(), twodayago.getMonth()+1, twodayago.getDate());

	switch(selectedIndex) {
		case 0://whole
			for (var i = 1; i < rows.length; i++) {
				var row = rows[i];
				row.getElementsByTagName("td")[6].innerHTML ="T";
			}
			break;
		case 1://1day
			for (var i = 1; i < rows.length; i++) {
				var row = rows[i];
				if (row.style.display!='none') {
					var timeC = row.getElementsByTagName("td")[3].innerHTML;
					var yearC = getByIndex(timeC, 0, 3);
					var monthC = getByIndex(timeC, 5, 6);
					var dateC = getByIndex(timeC, 8, 9);
					var then = dateToInt(yearC,monthC,dateC);

					if (then!=today) {
						row.getElementsByTagName("td")[6].innerHTML="F";
					} else {
						row.getElementsByTagName("td")[6].innerHTML="T";
					}
				}
			}
            break;
		case 2://2days
			var yesterday = new Date();
			yesterday.setDate(yesterday.getDate() -1);
			yesterday = dateToInt(yesterday.getFullYear(), yesterday.getMonth()+1, yesterday.getDate());
			for (var i = 1; i < rows.length; i++){
				var row = rows[i];
				var timeC = row.getElementsByTagName("td")[3].innerHTML;
				var yearC = getByIndex(timeC, 0, 3);
				var monthC = getByIndex(timeC, 5, 6);
				var dateC = getByIndex(timeC, 8, 9);
				var then = dateToInt(yearC,monthC,dateC);

				if((then!=yesterday)&&(then!=today)) {
					row.getElementsByTagName("td")[6].innerHTML="F";
				} else {
					row.getElementsByTagName("td")[6].innerHTML="T";
				}
			}
            break;
		case 3://1week
			var weekago = new Date();
			weekago.setDate(weekago.getDate() -6);
			weekago = dateToInt(weekago.getFullYear(), weekago.getMonth()+1, weekago.getDate());
			for (var i = 1; i < rows.length; i++) {
				var row = rows[i];
				var timeC = row.getElementsByTagName("td")[3].innerHTML;
				var yearC = getByIndex(timeC, 0, 3);
				var monthC = getByIndex(timeC, 5, 6);
				var dateC = getByIndex(timeC, 8, 9);
				var then = dateToInt(yearC,monthC,dateC);

				if((then<weekago)||(then>today)) {
					row.getElementsByTagName("td")[6].innerHTML="F";
				} else {
					row.getElementsByTagName("td")[6].innerHTML="T";
				}
			}
            break;
		case 4://1month
			var monthago = new Date();
			monthago.setMonth(monthago.getMonth() -1);
			monthago = dateToInt(monthago.getFullYear(), monthago.getMonth()+1, monthago.getDate());

			for (var i = 1; i < rows.length; i++) {
				var row = rows[i];
				if (row.style.display!='none') {
					var timeC = row.getElementsByTagName("td")[3].innerHTML;
					var yearC = getByIndex(timeC, 0, 3);
					var monthC = getByIndex(timeC, 5, 6);
					var dateC = getByIndex(timeC, 8, 9);
					var then = dateToInt(yearC,monthC,dateC);

					if((then<monthago)||(then>today)) {
						row.getElementsByTagName("td")[6].innerHTML="F";
					} else {
						row.getElementsByTagName("td")[6].innerHTML="T";
					}
				}
			}
            break;
		case 5://1year
			var yearago = new Date();
			yearago.setFullYear(yearago.getFullYear() -1);
			yearago = dateToInt(yearago.getFullYear(), yearago.getMonth()+1, yearago.getDate());
			for (var i = 1; i < rows.length; i++) {
				var row = rows[i];
				var timeC = row.getElementsByTagName("td")[3].innerHTML;
				var yearC = getByIndex(timeC, 0, 3);
				var monthC = getByIndex(timeC, 5, 6);
				var dateC = getByIndex(timeC, 8, 9);
				var then = dateToInt(yearC,monthC,dateC);

				if((then<yearago)||(then>today)) {
					row.getElementsByTagName("td")[6].innerHTML="F";
				} else {
					row.getElementsByTagName("td")[6].innerHTML="T";
				}
			}
            break;
		default:
			break;
	}
	show();
}

function getByIndex(str, start, finish) {
	var result = "";
	for (var i = start; i < finish+1; i++) {
		result += str.charAt(i);}
	return result;
}

function dateToInt(a, b, c) {
	return parseInt(a)*10000+parseInt(b)*100+parseInt(c);
}

function show() {
	rows = table.getElementsByTagName("tr");
	var count = 0;
	for (var i = 1; i<rows.length; i++) {
		var row = rows[i];
		var SFlag = row.getElementsByTagName("td")[5].innerHTML;
		var TFlag = row.getElementsByTagName("td")[6].innerHTML;
		if((SFlag=="T")&&(TFlag=="T")) {
			row.style.display='';
			count++;
		} else {
			row.style.display='none';
		}
	} countResult(count);
}

function resetHistory() {
    var confirm;
    if (window.confirm("Are you sure you want to clear your login history?") == true) {
        chrome.storage.sync.clear();
        alert("History cleared!");
        chrome.tabs.reload();
    } else {
        alert("History clear cancelled!")
    }
}

var entryCount;
var resetButton = document.querySelector("button[id=reset]");
var searchButton = document.querySelector("button[id=search]");
var searchText = document.getElementById("searchText");
var table = document.getElementById("loginInfoTable");
var radioUrl = document.getElementById("radioUrl");
var radioUsername = document.getElementById("radioUsername");
var dropdown = document.getElementById("select");

document.body.onload = loadTable;
resetButton.onclick = resetHistory;
searchButton.onclick = showResult;
dropdown.onchange = changeSelect;


// jquery listener function for pressing enter to search
$(document).ready(function() {
    $('#searchText').keypress(function(e) {
        if (e.keyCode == 13) {
            showResult();
        }
    });
});
