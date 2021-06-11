////////////////////////////// TEMP ///////////////////////////

var c = document.getElementById("playground"); // GET CANVAS
var batataTon = document.getElementById("batata"); // GET DOT BUTTON

batataTon.addEventListener("click", tick);

///////////////////////////////////////////////////////////////



// uniform radius for inner circles
var gInRadius = 50;
// uniform radius for outer circles
var gOutRadius = 120;
//// global HitCircle counter
//var idCounter = 0;
// array of active HitCircles
var activeHitCircles = [];
// # of frames inbetween HitCircle creation
var delay = 20;
// # of frames since previous HitCircle creation
var framesSince = 0;

// current click location (x)
var clickX = 0;
// current click location (y)
var clickY = 0;

var mouseDown = false;

onmousedown = function(e) {
	clickX = e.clientX;
	clickY = e.clientY;
	mouseDown = true;
	}

onmouseup = function(e) {
	mouseDown = false;
	}

var songD = 20;

var fps = 30;

var perfectScore = 0;
var score = 0;

var tickCount = 0;

var duckI;

// a HitCircle has a ceneter (x, y), a duration (number of frames it takes for the outer circle to reach the inner circle)
// an inner radius (defined globally), an outer radius (defined globally)
//// an ID number
class HitCircle {
	constructor(x, y, duration) {
		this.x = x;
		this.y = y;
		this.duration = duration;
		this.inRadius = gInRadius;
		this.outRadius = gInRadius + duration;
		this.initOR = this.outRadius
		this.isActive = (this.outRadius >= this.inRadius);
	}
}

//prepare to interact with canvas in 2D
var ctx = c.getContext("2d");

var requestID;  //init global var for use with animation frames

var clear = (e) => {
    console.log("clear invoked...");
    ctx.clearRect(0, 0, c.width, c.height); // clears the canvas
};

// runs each frame:
// 0) checks if mouse is down in focused HitCircle
// 1) makes all HitCircle outer circles shrink (or HitCircle is removed if applicable)
// 2) makes new HitCircles (if applicable)
// 3) clear canvas
// 4) draw all active HitCircles
var tick = () => {
	// --- step 0 ---
	if (activeHitCircles.length > 0) {
		var clickDist = Math.sqrt((clickX - activeHitCircles[0].x)**2 + (clickY - activeHitCircles[0].y)**2);
		if (clickDist < gInRadius && mouseDown) {
			score += (activeHitCircles[0].initOR - activeHitCircles[0].outRadius) / (activeHitCircles[0].initOR - gInRadius);
			activeHitCircles.shift();
		}
	}
	
	// --- step 1 ---
	for (hitCircle of activeHitCircles) {
		hitCircle.outRadius -= 1;
		hitCircle.isActive = (hitCircle.outRadius >= hitCircle.inRadius);
		
		if (!hitCircle.isActive) {
			activeHitCircles.shift();
		}
	}
	
	// --- step 2 ---
	if (framesSince == delay) {
		// makes new HitCircle centered at random coords s.t. the entire HitCircle lies on the canvas
		let nextHitCircle = new HitCircle(
			Math.floor(Math.random() * (c.width - 2 * gOutRadius)) + gOutRadius, 
			Math.floor(Math.random() * (c.height - 2 * gOutRadius)) + gOutRadius, 
			Math.ceil(gOutRadius - gInRadius - (40 * tickCount) / (fps * songD) )
		);

		perfectScore += (Math.ceil(gOutRadius - gInRadius - (40 * tickCount) / (fps * songD) ) + gInRadius) / Math.ceil(gOutRadius - gInRadius - (40 * tickCount) / (fps * songD) );
		
		if (nextHitCircle.isActive) {
			activeHitCircles.push(nextHitCircle);
		}
		framesSince = 0;
	}
	framesSince++;
	
	// --- step 3 ---
	ctx.clearRect(0, 0, c.width, c.height);
	ctx.drawImage(image, 0 ,0, c.width, c.height)
	
	// --- step 4 ---
	for (hitCircle of activeHitCircles) {
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.arc(hitCircle.x, hitCircle.y, hitCircle.inRadius, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.beginPath();
		ctx.arc(hitCircle.x, hitCircle.y, hitCircle.outRadius, 0, 2 * Math.PI);
		ctx.stroke();
	}
	
	tickCount++;

	if (tickCount < songD * fps) {
		console.log(score / perfectScore);
		requestID = setTimeout(() => window.requestAnimationFrame(tick), 1000/fps - 15); // adds step to the queue for the next animation frame
	}
};

var stopIt = () => {
    console.log("stopIt invoked...");
    console.log(requestID);
    window.cancelAnimationFrame(requestID); // stops step from being called and calling itself next frame
};





////////////////////////////// TEMP ///////////////////////////

batataTon.addEventListener("click", tick);

///////////////////////////////////////////////////////////////


//header for cat api get request, not really suppose to set access control to "*" but it breaks without it
var myHeaders = new Headers(
    {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        'Access-Control-Allow-Credentials': 'true',
    }
);
//myInit stores request infos
var myInit = {
    method: 'GET',
    headers: myHeaders,
    mode: 'cors',
    cache: 'default'
};

//using cors-anywhere because setting mode to "no-cors" returns an opaque type that can't be parsed through
var request = new Request('https://cors-anywhere.herokuapp.com/https://random-d.uk/api/v2/random', myInit);

//fetch to GET request, parses response to json then puts duck pic as background on canvas
fetch(request)
  .then(response => response.json())
  .then(data => {
    console.log(data.url)
    image = new Image()
    image.src = data.url
    image.onload = function() {
        ctx.drawImage(image, 0 ,0, c.width, c.height)
    }
  });