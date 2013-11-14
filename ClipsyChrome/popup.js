console.log("Loaded popup...");

$('#start-roi-capture').click(function(){
	console.log("Clicked on Start ROI...");
	// Send request to active page content script
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  console.log("Sending START_ROI_MODE request to active tab:");
	  console.log(tabs[0]);
	  chrome.tabs.sendMessage(tabs[0].id, {action: "START_ROI_MODE"}, function(response) {
	    console.log(response);
	  });
	});
});

$('#end-roi-capture').click(function(){
	console.log("Clicked on End ROI...");	
	// Send request to active page content script
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  console.log("Sending END_ROI_MODE request to active tab:");
	  console.log(tabs[0]);
	  chrome.tabs.sendMessage(tabs[0].id, {action: "END_ROI_MODE"}, function(response) {
	    console.log(response);
	  });
	});
});
