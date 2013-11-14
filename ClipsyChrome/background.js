

function getCursorXY(e) {   
    var CurX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
    var CurY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
    return {"x":CurX,"y":CurY};  
}

var mousedown=false;
var startPos=null;
var drawmode=false;

var width_;
var height_;
var top_;
var left_; 

function drawMode(e){
	if(mousedown){
		console.log("detected mouse down , entering draw mode");
		var currPos=getCursorXY(e);
		reDrawRectangle(startPos,currPos);
	}
}


function reDrawRectangle(start,end){
	console.log("redrawing with start and end coords");
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

  $('.rectangle').css( "top", top );
  $('.rectangle').css( "left", left );
  $('.rectangle').css( "width", width );
  $('.rectangle').css( "height", height );

}

function unDrawRectangle(){
	$('.rectangle').css( "width", 0 );
    $('.rectangle').css( "height", 0 );
    selection = false;
}

var selection = false;

function detectDraw(){
	mousedown=0;
	$(".overlay").mousedown(function(e){ selection=true; mousedown=true; startPos=getCursorXY(e);})
	$( ".overlay" ).mousemove(drawMode);
	$(".overlay").mouseup(
	function(e){
		mousedown=false;
		var curPos=getCursorXY(e);
		if(Math.abs(curPos.x-startPos.x) + Math.abs(curPos.y-startPos.y) < 20 ) unDrawRectangle();
	});
}




function KeyPress(e) {
      console.log(e);
      if (e.keyCode == 90 && e.ctrlKey) {
      	console.log("hit the key combination");
      	if(!drawmode){
      		console.log("initialized draw mode");
      		drawmode=true;
      		initDrawMode();
      	}
      	else{
      		drawmode=false;
      		destDrawMode();
      	}
      }
      if(e.keyCode == 13 && e.keyIdentifier == "Enter" && selection ){
      		var result=window.confirm("Send snap shot to your watchBoard canvas?");
          if(result){
            var url=document.URL;
            var sw=$(window).width();
            var hiturl="http://0.0.0.0:3000/image?";
            hiturl+="url="+url;
            hiturl+="&sw="+sw;
            hiturl+="&top="+top_;
            hiturl+="&left="+left_;
            hiturl+="&width="+width_;
            hiturl+="&height="+height_;
            console.log(hiturl);
            //call api to make picture
          }

  			console.log(result);

  			if(result){
  				//call json here
  			}
      }
}


document.onkeydown = KeyPress;


function initDrawMode(){
	//overlay stuff, 
	overlay();

	//attach draw handlers
	detectDraw();
}

function destDrawMode(){
	$('.overlay').remove();
}


//TODO plug this into code
function overlayCanvas(){
  var canvas = $('<canvas>');
    canvas.attr('id','qrcanv');
    canvas.attr("width",500);
    canvas.attr("height",500);
    canvas.css("z-index",1002);
    canvas.css("position","absolute");
    canvas.css("top",0);
    canvas.css("left",0);
    $('.overlay').append(canvas);
    setupqr('qrcanv',500,500);
}


function register(){
  overlayCanvas();
}

function overlay(){
	var overlaycss = "    background-color: #ccccdc;   opacity: 0.1;   width: 100%;    position: absolute;   top: 0;   left: 0;   z-index: 1000;"
	var overlay = $('<div>');
    overlay.addClass('overlay');
    overlay.attr("style",overlaycss);
    overlay.css("height",document.height);
    $('body').append(overlay);


	var rectanglecss = "    background-color: rgba(37, 31, 160, 0.69);     position: absolute;  z-index: 1001;  top: 0;   left: 0;   "
    var rectangle = $('<div>');
    rectangle.addClass('rectangle');
    rectangle.attr("style",rectanglecss);
    $('.overlay').append(rectangle);
}