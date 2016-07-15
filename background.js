// check all open tabs in all open windows for the passed parameter url
// if any of the tabs has the url open, focus to that tab
// else open a new tab with the url
function focusOrCreateTab(url) {
    chrome.windows.getAll({"populate":true}, function(windows) {
        var existing_tab = null;
		var flag = false;
		//alert("There are "+windows.length+" windows");
        for (var i in windows) {
			//alert("The "+i+" th window.id is "+windows[i].id);
            var tabs = windows[i].tabs;
			
            for (var j in tabs) {
                var tab = tabs[j];
				//alert(tab.url);
                if (tab.url == url) {					
                    alert("it's already opened");
					//chrome.tabs.update(existing_tab.id, {"selected":true});
					
					chrome.tabs.reload(tab.id);
					flag = true;
                    break;
                }
            }
        }
        
		if (!flag){
			alert("it's not opened yet");
            chrome.tabs.create({"url":url, "selected":true});
        }
		
    });
}

// if extension icon is clicked call the focusOrCreateTab function with the home_url parameter
chrome.browserAction.onClicked.addListener(function(tab) {
	
    var home_url = chrome.extension.getURL("home.html");
    focusOrCreateTab(home_url);
});
