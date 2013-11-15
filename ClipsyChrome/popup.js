console.log("Loaded popup...");

$('#create-new-widget').click(function(){
	console.log("Clicked on create new widget...");

	if($(this).data('state') == 'off') {

		$(this).data('state', 'on');
		$(this).addClass('selected');

		$(this).find('.glyphicon').removeClass('glyphicon-star').addClass('glyphicon-screenshot');

		$('#roi-options-panel').show();

	}
	else {
		$(this).data('state', 'off');
		$(this).removeClass('selected');
		
		$(this).find('.glyphicon').removeClass('glyphicon-screenshot').addClass('glyphicon-star');

		$('#roi-options-panel').hide();

		// End all modes

		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  console.log("Sending END_ROI_MODE request to active tab:");
		  console.log(tabs[0]);
		  chrome.tabs.sendMessage(tabs[0].id, {action: "END_ROI_MODE"}, function(response) {
		    console.log(response);
		  });
		});	

		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  console.log("Sending END_DIV_SELECTOR request to active tab:");
		  console.log(tabs[0]);
		  chrome.tabs.sendMessage(tabs[0].id, {action: "END_DIV_SELECTOR"}, function(response) {
		    console.log(response);
		  });
		});	
	}
	
});



$('#rectangle-roi-selector').click(function(){
	console.log("Clicked on rectangle-roi-selector...");

	if($(this).data('state') == 'off') {

		$(this).data('state', 'on');
		$(this).addClass('selected');
		$('#div-selector').css('visibility','hidden');

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
		$('#div-selector').css('visibility','visible');
	
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

$('#div-selector').click(function(){
	console.log("Clicked on div-selector...");

	if($(this).data('state') == 'off') {

		$(this).data('state', 'on');
		$(this).addClass('selected');
		$('#rectangle-roi-selector').css('visibility','hidden');

		// Send request to active page content script
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  console.log("Sending START_DIV_SELECTOR request to active tab:");
		  console.log(tabs[0]);
		  chrome.tabs.sendMessage(tabs[0].id, {action: "START_DIV_SELECTOR"}, function(response) {
		    console.log(response);
		  });
		});

	}
	else {
		$(this).data('state', 'off');
		$(this).removeClass('selected');
		$('#rectangle-roi-selector').css('visibility','visible');
	
		// Send request to active page content script
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		  console.log("Sending END_DIV_SELECTOR request to active tab:");
		  console.log(tabs[0]);
		  chrome.tabs.sendMessage(tabs[0].id, {action: "END_DIV_SELECTOR"}, function(response) {
		    console.log(response);
		  });
		});	
	}
	
});

$('#register-new-device').click(function(){
	console.log("Clicked on register new device...");
	$('#please-wait').show();
	$.post('http://0.0.0.0:3000/adduser',function(userid){

		$('#please-wait').hide();
		$('#qr-code').show();
		setupqr('qr-code-canvas',200,200);
		doqr(userid);

		// save userid in storage
		chrome.storage.local.set({'clipsy-userid': userid});
	});	
});

$('#marketplace-link').click(function(){
	chrome.storage.local.get('clipsy-userid', function(data) {
		userid = data["clipsy-userid"];
		chrome.tabs.create({url: 'http://0.0.0.0/index.html?user='+userid});
	});
});

