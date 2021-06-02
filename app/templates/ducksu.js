////////////////////////////// TEMP ///////////////////////////

var c = document.getElementById("playground"); // GET CANVAS
var batataTon = document.getElementById("batata"); // GET DOT BUTTON

batataTon.addEventListener("click", tick);

console.log("wadadfafafafaf");

var durationT = 200;

///////////////////////////////////////////////////////////////



// uniform radius for inner circles
var gInRadius = 100;
// uniform radius for outer circles
var gOutRadius = 200;
//// global HitCircle counter
//var idCounter = 0;
// array of active HitCircles
var activeHitCircles = [];
// # of frames inbetween HitCircle creation
var delay = 10;
// # of frames since previous HitCircle creation
var framesSince = 0;

// a HitCircle has a ceneter (x, y), a duration (number of frames it takes for the outer circle to reach the inner circle)
// an inner radius (defined globally), an outer radius (defined globally)
//// an ID number
// an isActive boolean
class HitCircle {
	constructor(x, y, duration) {
		this.x = x;
		this.y = y;
		this.duration = duration;
		this.inRadius = gInRadius;
		this.outRadius = gOutRadius;
//		this.id = idCounter;
//		idCounter++;
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
	console.log("tick!");
	// --- step 2 ---
	if (framesSince == delay) {
		// makes new HitCircle centered at random coords s.t. the entire HitCircle lies on the canvas
		let nextHitCircle = new HitCircle(
			Math.floor(Math.random() * (c.width - 2 * gOutRadius)) + gOutRadius, 
			Math.floor(Math.random() * (c.height - 2 * gOutRadius)) + gOutRadius, 
			200
		);
		
		if (nextHitCircle.isActive) {
			activeHitCircles.push(nextHitCircle);
		}
		framesSince = 0;
	}
	framesSince++;
	
	// --- step 3 ---
	ctx.clearRect(0, 0, c.width, c.height);
	
	// --- step 4 ---
	for (hitCircle in activeHitCircles) {
		ctx.beginPath();
		ctx.arc(hitCircle.x, hitCircle.y, hitCircle.inRadius, 0, 2 * Math.PI);
		ctx.arc(hitCircle.x, hitCircle.y, hitCircle.outRadius, 0, 2 * Math.PI);
		ctx.fill();
	}
	
	requestID = window.requestAnimationFrame(tick); // adds step to the queue for the next animation frame
};

var drawDot = () => {
    console.log("drawDot invoked...");
    // clears previous step function from the queue of functions for the next animation frame
    // so that step doesn't keep calling itself after we put another step in the queue
    // in case drawDot was called twice without calling stopIt
    window.cancelAnimationFrame(requestID);
    var step = () => {
        ctx.clearRect(0, 0, c.width, c.height); // clears the canvas
        ctx.beginPath(); // starts the path for the circle
        ctx.arc(c.width / 2, c.height / 2, radius, 0, 2 * Math.PI); // makes the circle
        ctx.fill(); // renders the path
        if (radius > c.width / 2) growing = false; // if the circle is too big, stop growing
        if (radius < 1) growing = true; // if the circle is too small, start growing
        radius += growing * 2 - 1; // true * 2 - 1 => 1, false * 2 - 1 => -1
        requestID = window.requestAnimationFrame(step); // adds step to the queue for the next animation frame
        // each frame, step should be called exactly once
    };
    requestID = window.requestAnimationFrame(step); // starts the cycle of step calling itself each frame
};


var stopIt = () => {
    console.log("stopIt invoked...");
    console.log(requestID);
    window.cancelAnimationFrame(requestID); // stops step from being called and calling itself next frame
};





////////////////////////////// TEMP ///////////////////////////

batataTon.addEventListener("click", tick);

///////////////////////////////////////////////////////////////