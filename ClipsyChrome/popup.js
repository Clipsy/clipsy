console.log("Loaded popup...");

$('#create-new-widget').click(function(){
	console.log("Clicked on create new widget...");

	if($(this).data('state') == 'off') {

		$(this).data('state', 'on');
		$(this).addClass('selected');

		$(this).find('.glyphicon').removeClass('glyphicon-star').addClass('glyphicon-screenshot');

		// Send request to active page content script
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  console.log("Sending START_ROI_MODE request to active tab:");
		  console.log(tabs[0]);
		  chrome.tabs.sendMessage(tabs[0].id, {action: "START_ROI_MODE"}, function(response) {
		    console.log(response);
		  });
		});

	}
	else {
		$(this).data('state', 'off');
		$(this).removeClass('selected');
		
		$(this).find('.glyphicon').removeClass('glyphicon-screenshot').addClass('glyphicon-star');

		// Send request to active page content script
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  console.log("Sending END_ROI_MODE request to active tab:");
		  console.log(tabs[0]);
		  chrome.tabs.sendMessage(tabs[0].id, {action: "END_ROI_MODE"}, function(response) {
		    console.log(response);
		  });
		});	
	}
	
});

