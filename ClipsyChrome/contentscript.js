chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	// Make sure its coming from the extension and not some other tab
    if(!sender.tab) {
    	if (request.action == 'START_ROI_MODE') {
    		startROICaptureMode();
      	}

      	if(request.action == 'END_ROI_MODE') {
      		endROICaptureMode();
      	}
 	}
});

var mousedown;
var startPos;

var width_;
var height_;
var top_;
var left_; 

function getCursorXY(e) {   
    var CurX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    var CurY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
    return {"x":CurX, "y":CurY};  
};

function startROICaptureMode(){
	console.log("Starting ROI capture mode...");
	// create overlay
	$('<div>')
		.attr('id','clipsy-roi-overlay')
    	.attr("style", "background-color: #ccccdc; opacity: 0.5; width: 100%; position: absolute; top: 0; left: 0; z-index: 1000;")
    	.css("height", document.height)
    	.appendTo('body');

    // create rectangle
    $('<div>')
    	.attr('id','clipsy-roi-selector')
    	.attr("style", "background-color: #428bca; position: absolute; z-index: 1001; top: 0; left: 0; opacity: 0.3;")
    	.insertAfter('#clipsy-roi-overlay')

   	// monitor mouse events for drawing the rectangle
	mousedown = false;
	$("#clipsy-roi-overlay").mousedown(function(e){ 
		console.log("Detected mousedown...");
		mousedown = true; 
		startPos = getCursorXY(e);
	});

	$("#clipsy-roi-overlay").mousemove(function(e){
		if(mousedown){
			console.log("Detected mousemove...");
			var currPos = getCursorXY(e);
			redrawROIRectangle(startPos, currPos);
		}
	});

	$("#clipsy-roi-overlay").mouseup(function(e){
		console.log("Detected mouseup...");
		mousedown = false;
		var curPos = getCursorXY(e);
		if(Math.abs(curPos.x-startPos.x) + Math.abs(curPos.y-startPos.y) > 0) {
			confirmROIRectangle(curPos);
		} 
	});
};

function endROICaptureMode(){
	$('#clipsy-roi-overlay').remove();
	$('#clipsy-roi-selector').remove();
	$('.clipsy-roi-confirm-btn').remove();
	console.log("Ending ROI capture mode...");
};

function redrawROIRectangle(start, end){
	console.log("Redrawing ROI with start and end coords:");
	console.log(start);
	console.log(end);

	var width=Math.abs(start.x-end.x);
	var height=Math.abs(start.y-end.y);
	var top = Math.min(start.y,end.y);
	var left=Math.min(start.x,end.x);
	width_=width;
	height_=height;
	top_=top;
	left_=left;

	// resize our roi rectangle
	$('#clipsy-roi-selector')
		.css("top", top)
		.css("left", left)
		.css("width", width)
		.css( "height", height);
};

function confirmROIRectangle(curPos){

	if($('.clipsy-roi-confirm-btn').length > 0) {
		return;
	}

	// highlight ROI rectangle and ask for confirmation
	console.log("Highlighting ROI...");
	var bty = curPos.y - 21;
	var btx1 = curPos.x - 115;
	var btx2 = curPos.x - 53;
	$('#clipsy-roi-selector')
		.css("border","solid 2px #285e8e")
		.after(
			$('<button>')
				.attr('id', 'clipsy-roi-yes')
				.addClass('clipsy-roi-confirm-btn')
				.attr("style", "color:black; z-index: 1002; opacity: 1.0; position: absolute; top: " + bty + "px; left:" + btx1 + "px")
				.text('Confirm')
				.click(function(){
					pushROIToServer();
					undrawROIRectangle();
					endROICaptureMode();
				})
		)
		.after(
			$('<button>')
				.attr('id', 'clipsy-roi-no')
				.addClass('clipsy-roi-confirm-btn')
				.attr("style", "color:black; z-index: 1002; opactiy: 1.0;position: absolute; top: " + bty + "px; left:" + btx2 + "px")
				.text('Cancel')
				.click(undrawROIRectangle)
		);
};

function undrawROIRectangle(){
	$('#clipsy-roi-selector')
		.css("width", 0)
    	.css("height", 0);
    $('.clipsy-roi-confirm-btn').remove();

    console.log("Undrawing ROI rectangle");
};

function pushROIToServer(){
	var url = document.URL;
    var sw = $(window).width();
    var hiturl = "http://0.0.0.0:3000/addclip?";
    hiturl += "url="+url;
    hiturl += "&sw="+sw;
    hiturl += "&top="+top_;
    hiturl += "&left="+left_;
    hiturl += "&width="+width_;
    hiturl += "&height="+height_;
    console.log("Pushing ROI to URL:" + hiturl);
};
