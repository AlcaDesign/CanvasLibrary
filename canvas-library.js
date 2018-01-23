const {
	E, LN10, LN2, LOG10E, LOG2E, PI, SQRT1_2, SQRT2,
	abs, acos, acosh, asin, asinh, atan, atan2, atanh, cbrt, ceil, clz32,
	cosh, exp, expm1, floor, fround, hypot, imul, log, log10, log1p, log2, max,
	min, pow, /* random, */ round, sign, sinh, sqrt, tan, tanh, trunc
} = Math;

// Why not?
const ZERO       = 0.0;
const ONE        = 1.0;
const TWO        = 2.0;
const THREE      = 3.0;
const FOUR       = 4.0;
const FIVE       = 5.0;
const SIX        = 6.0;
const SEVEN      = 7.0;
const EIGHT      = 8.0;
const NINE       = 9.0;
const TEN        = 10.0;
const ELEVEN     = 11.0;
const TWELVE     = 12.0;
const SIXTEEN    = 16.0;
const THIRTY_TWO = 32.0;
const HUNDRED    = 100.0;
const THOUSAND   = 1000.0;

const HALF            = ONE / TWO;
const THIRD           = ONE / THREE;
const QUARTER         = ONE / FOUR;
const SIXTH           = ONE / SIX;
const EIGHTH          = ONE / EIGHT;
const TWELFTH         = ONE / TWELVE;
const SIXTEENTH       = ONE / SIXTEEN;
const THIRTY_SECONDTH = ONE / THIRTY_TWO;

const TENTH              = 1e-1;
const HUNDREDTH          = 1e-2;
const THOUSANDTH         = 1e-3;
const TEN_THOUSANDTH     = 1e-4;
const HUNDRED_THOUSANDTH = 1e-5;
const MILLIONTH          = 1e-6;
const TEN_MILLIONTH      = 1e-7;
const HUNDRED_MILLIONTH  = 1e-8;
const BILLIONTH          = 1e-9;
const TEN_BILLIONTH      = 1e-10;
const HUNDRED_BILLIONTH  = 1e-11;

const HALF_PI             = PI * HALF;
const THIRD_PI            = PI * THIRD;
const QUARTER_PI          = PI * QUARTER;
const SIXTH_PI            = PI * SIXTH;
const EIGHTH_PI           = PI * EIGHTH;
const TWELFTH_PI          = PI * TWELFTH;
const SIXTEENTH_PI        = PI * SIXTEENTH;
const THIRTY_SECONDTH_PI  = PI * THIRTY_SECONDTH;
const TAU                 = PI * TWO;
const TWO_TAU             = TAU * TWO;
const HALF_TAU            = PI;
const THIRD_TAU           = TAU * THIRD;
const QUARTER_TAU         = HALF_PI;
const EIGHTH_TAU          = QUARTER_PI;
const TWELFTH_TAU         = SIXTH_PI;
const SIXTEENTH_TAU       = EIGHTH_PI;
const THIRTY_SECONDTH_TAU = SIXTEENTH_PI;

let _defaulCanvasOptions = {
		autoClear: false,
		autoPushPop: false,
		centered: false,
		canvas: true
	};
let _canvasOptions = {};
let canvas = document.getElementById('canvas');
if(canvas === null) {
	canvas = document.createElement('canvas');
	canvas.id = 'canvas';
	document.body.appendChild(canvas);
}
let ctx = canvas.getContext('2d');
let _anim, _lastCanvasTime, canvasFrameRate, frameCount, width, height, width_half, height_half;

window.addEventListener('resize', _resizeCanvas);
window.addEventListener('load', () => {
	Object.assign(
		_canvasOptions,
		_defaulCanvasOptions,
		'canvasOptions' in window ? window.canvasOptions : {}
	);
	if(_canvasOptions.canvas === false) {
		document.body.removeChild(canvas);
	}
	_resizeCanvas();
	if('setup' in window) {
		window.setup();
	}
	frameCount = 0;
	_anim = requestAnimationFrame(_draw);
});

function _draw(timestamp) {
	frameCount++;
	canvasFrameRate = 1000.0 / (timestamp - _lastCanvasTime);
	_lastCanvasTime = timestamp;
	if(_canvasOptions.autoClear) {
		clear(null);
	}
	if(_canvasOptions.autoPushPop) {
		push();
		if(_canvasOptions.centered) {
			translateCenter();
		}
	}
	
	'draw' in window && window.draw(timestamp);
	
	if(_canvasOptions.autoPushPop) {
		pop();
	}
	
	_anim = requestAnimationFrame(_draw);
}

function _resizeCanvas() {
	width_half = (width = canvas.width = window.innerWidth) * HALF;
	height_half = (height = canvas.height = window.innerHeight) * HALF;
	ctx.fillStyle = 'hsl(0, 0%, 100%)';
	ctx.strokeStyle = 'hsl(0, 0%, 100%)';
}

function clear(x, y, w, h) {
	if(x !== undefined && typeof x === 'number') {
		ctx.clearRect(x, y, w, h);
	}
	else if(_canvasOptions.centered && x !== null) {
		ctx.clearRect(-width_half, -height_half, width, height);
	}
	else {
		ctx.clearRect(0, 0, width, height);
	}
}

function background(a, b, c) {
	push();
	if(typeof a !== 'number') {
		fill(a);
	}
	if(_canvasOptions.centered) {
		ctx.fillRect(-width_half, -height_half, width, height);
	}
	else {
		ctx.fillRect(0, 0, width, height);
	}
	pop();
}

function fill(...args) {
	if(args.length === 1) {
		let a = args[0];
		if(typeof a === 'string' || a instanceof CanvasGradient || a instanceof CanvasPattern) {
			ctx.fillStyle = args[0];
		}
	}
	else if(args.length === 0) {
		return ctx.fillStyle;
	}
}

function stroke(...args) {
	if(args.length === 1) {
		let a = args[0];
		if(typeof a === 'string' || a instanceof CanvasGradient) {
			ctx.strokeStyle = args[0];
		}
	}
	else if(args.length === 0) {
		return ctx.strokeStyle;
	}
}

function fillPath() {
	ctx.fill();
}

function strokePath() {
	ctx.stroke();
}

function push() {
	ctx.save();
}

function pop() {
	ctx.restore();
}

function translate(...args) {
	ctx.translate(...args);
}

function translateCenter() {
	translate(width_half, height_half);
}

function rotate(rot) {
	ctx.rotate(rot % TAU);
}

function scale(x = 1, y = x) {
	ctx.scale(x, y);
}

function beginPath() {
	ctx.beginPath();
}

function moveTo(x, y) {
	ctx.moveTo(x, y);
}

function lineTo(x, y) {
	ctx.lineTo(x, y);
}

function closePath() {
	ctx.closePath();
}

function point(x = 0, y = 0, r = 0, g = 0, b = 0, a = 255, doPut_ = true) {
	let imgData = ctx.createImageData(1, 1);
	imgData.data[0] = r;
	imgData.data[1] = g;
	imgData.data[2] = b;
	imgData.data[3] = a;
	if(doPut_) {
		ctx.putImageData(imgData, x, y);
	}
	return imgData;
}

function line(x, y, x_, y_, doDraw_ = true) {
	if(doDraw_) {
		ctx.beginPath();
		line(x, y, x_, y_, false);
		ctx.stroke();
		return;
	}
	ctx.moveTo(x, y);
	ctx.lineTo(x_, y_);
}

function rect(x = 0, y = 0, w = 10, h = w, doDraw_ = true) {
	if(doDraw_) {
		ctx.beginPath();
		rect(x, y, w, h, false);
		ctx.stroke();
		return;
	}
	ctx.rect(x, y, w, h);
}

function circle(x = 0, y = 0, r = 50, doDraw_ = true) {
	if(doDraw_) {
		ctx.beginPath();
		circle(x, y, r, false);
		ctx.stroke();
		return;
	}
	ctx.arc(x, y, r, 0, TAU);
}

function arc(...args) {
	ctx.arc(...args);
}

function regularPolygon(sides, radius = 50, rotation = 0, doDraw_ = true) {
	if(doDraw_) {
		ctx.beginPath();
		regularPolygon(sides, radius, rotation, false);
		ctx.stroke();
		return;
	}
	let circumference = TAU * radius;
	let count = min(sides, circumference);
	for(let i = 0; i < count; i++) {
		let t = i / count * TAU + rotation;
		let x = cos(t) * radius;
		let y = sin(t) * radius;
		if(i === 0) {
			ctx.moveTo(x, y);
		}
		else {
			ctx.lineTo(x, y);
		}
	}
	ctx.closePath();
}


function random(low = 1, high = null) {
	if(high === null) {
		return Math.random() * low;
	}
	return Math.random() * (high - low) + low;
}

function map(n, a, b, c, d) {
	return (n - a) * (d - c) / (b - a) + c;
}

function lerp(start, stop, amt) {
	return amt * (stop - start) + start;
}

function cos(input) {
	return Math.cos(input % TAU);
}

function sin(input) {
	return Math.sin(input % TAU);
}


function createVector(x, y) {
	return new Vector(x, y);
}

class Vector {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
	
	static fromAngle(angle) {
		return createVector(cos(angle), sin(angle));
	}
	
	static random2D(angle = true, mult = 1) {
		let v;
		if(angle) {
			v = Vector.fromAngle(random(TAU));
		}
		else {
			v = createVector(random(-1, 1), random(-1, 1));
		}
		if(typeof angle === 'number') {
			v.mult(angle);
		}
		else if(mult !== 1) {
			v.mult(mult);
		}
		return v;
	}
	
	draw() {
		point(this.x, this.y);
	}
	
	set(x = this.x, y = this.y) {
		if(x instanceof Vector) {
			y = x.y;
			x = x.x;
		}
		this.x = x;
		this.y = y;
		return this;
	}
	copy() {
		return createVector(this.x, this.y);
	}

	add(x = 0, y = 0) {
		if(x instanceof Vector) {
			return this.add(x.x, x.y);
		}
		this.x += x;
		this.y += y;
		return this;
	}
	sub(x = 0, y = 0) {
		if(x instanceof Vector) {
			return this.sub(x.x, x.y);
		}
		this.x -= x;
		this.y -= y;
		return this;
	}
	mult(x = 1, y = x) {
		if(x instanceof Vector) {
			return this.mult(x.x, x.y);
		}
		this.x *= x;
		this.y *= y;
		return this;
	}
	div(x = 1, y = null) {
		if(y === null) {
			y = x;
		}
		this.x /= x;
		this.y /= y;
		return this;
	}
	
	heading() {
		return atan2(this.y, this.x);
	}
	rotate(a) {
		let newHeading = this.heading() + a;
		let mag = this.mag();
		return this.set(cos(newHeading), sin(newHeading)).mult(mag);
	}
	magSq() {
		return this.x * this.x + this.y * this.y;
	}
	mag() {
		return Math.sqrt(this.magSq());
	}
	normalize() {
		let mag = this.mag();
		return mag === 0 ? this : this.div(mag);
	}
	setMag(mag) {
		return this.normalize().mult(mag);
	}
	limit(max) {
		let magSq = this.magSq();
		if(magSq > max * max) {
			this.div(sqrt(magSq));
			this.mult(max);
		}
		return this;
	}
	dot(x = 0, y = 0) {
		if(x instanceof Vector) {
			return this.dot(x.x, x.y);
		}
		return this.x * x + this.y * y;
	}
	dist(v) {
		let d = v.copy().sub(this);
		return d.mag();
	}
}


// Robert Penner - http://gizma.com/easing/
// t: Current time
// b: Start value
// c: Change in value
// d: Duration

function linearTween    /* simple linear tweening    */ (t, b, c, d) { return c * t / d + b; }
function easeInQuad     /* quadratic   easing in     */ (t, b, c, d) { t /= d; return c * t * t + b; }
function easeOutQuad    /* quadratic   easing out    */ (t, b, c, d) { t /= d; return -c * t * (t - 2) + b; }
function easeInOutQuad  /* quadratic   easing in/out */ (t, b, c, d) { t /= d / 2; if(t < 1) return c / 2 * t * t + b; t--; return -c / 2 * (t * (t - 2) - 1) + b; }
function easeInCubic    /* cubic       easing in     */ (t, b, c, d) { t /= d; return c * t * t * t + b; }
function easeOutCubic   /* cubic       easing out    */ (t, b, c, d) { t /= d; t--; return c * (t * t * t + 1) + b; }
function easeInOutCubic /* cubic       easing in/out */ (t, b, c, d) { t /= d / 2; if(t < 1) return c / 2 * t * t * t + b; t -= 2; return c / 2 * (t * t * t + 2) + b; }
function easeInQuart    /* quartic     easing in     */ (t, b, c, d) { t /= d; return c * t * t * t * t + b; }
function easeOutQuart   /* quartic     easing out    */ (t, b, c, d) { t /= d; t--; return -c * (t * t * t * t - 1) + b; }
function easeInOutQuart /* quartic     easing in/out */ (t, b, c, d) { t /= d / 2; if(t < 1) return c / 2 * t * t * t * t + b; t -= 2; return -c / 2 * (t * t * t * t - 2) + b; }
function easeInQuint    /* quintic     easing in     */ (t, b, c, d) { t /= d; return c * t * t * t * t * t + b; }
function easeOutQuint   /* quintic     easing out    */ (t, b, c, d) { t /= d; t--; return c * (t * t * t * t * t + 1) + b; }
function easeInOutQuint /* quintic     easing in/out */ (t, b, c, d) { t /= d / 2; if(t < 1) return c / 2 * t * t * t * t * t + b; t -= 2; return c / 2 * (t * t * t * t * t + 2) + b; }
function easeInSine     /* sinusoidal  easing in     */ (t, b, c, d) { return -c * cos(t / d * HALF_PI) + c + b; }
function easeOutSine    /* sinusoidal  easing out    */ (t, b, c, d) { return c * sin(t / d * HALF_PI) + b; }
function easeInOutSine  /* sinusoidal  easing in/out */ (t, b, c, d) { return -c / 2 * (cos(PI * t / d) - 1) + b; }
function easeInExpo     /* exponential easing in     */ (t, b, c, d) { return c * pow(2, 10 * (t / d - 1)) + b; }
function easeOutExpo    /* exponential easing out    */ (t, b, c, d) { return c * (-pow(2, -10 * t / d ) + 1) + b; }
function easeInOutExpo  /* exponential easing in/out */ (t, b, c, d) { t /= d / 2; if(t < 1) return c / 2 * pow(2, 10 * (t - 1)) + b; t--; return c / 2 * (-pow(2, -10 * t) + 2) + b; }
function easeInCirc     /* circular    easing in     */ (t, b, c, d) { t /= d; return -c * (sqrt(1 - t * t) - 1) + b; }
function easeOutCirc    /* circular    easing out    */ (t, b, c, d) { t /= d; t--; return c * sqrt(1 - t * t) + b; }
function easeInOutCirc  /* circular    easing in/out */ (t, b, c, d) { t /= d / 2; if(t < 1) return -c / 2 * (sqrt(1 - t * t) - 1) + b; t -= 2; return c / 2 * (sqrt(1 - t * t) + 1) + b; }

const ease = {
		linearTween,
		easeInQuad,  easeOutQuad,  easeInOutQuad,
		easeInCubic, easeOutCubic, easeInOutCubic,
		easeInQuart, easeOutQuart, easeInOutQuart,
		easeInQuint, easeOutQuint, easeInOutQuint,
		easeInSine,  easeOutSine,  easeInOutSine,
		easeInExpo,  easeOutExpo,  easeInOutExpo,
		easeInCirc,  easeOutCirc,  easeInOutCirc,
		in:    { linear: linearTween, quad: easeInQuad,    cubic: easeInCubic,    quart: easeInQuart,    quint: easeInQuint,    sine: easeInSine,    expo: easeInExpo,    circ: easeInCirc    },
		out:   { linear: linearTween, quad: easeOutQuad,   cubic: easeOutCubic,   quart: easeOutQuart,   quint: easeOutQuint,   sine: easeOutSine,   expo: easeOutExpo,   circ: easeOutCirc   },
		inOut: { linear: linearTween, quad: easeInOutQuad, cubic: easeInOutCubic, quart: easeInOutQuart, quint: easeInOutQuint, sine: easeInOutSine, expo: easeInOutExpo, circ: easeInOutCirc },
		linear: Object.assign(linearTween,
		       { in: linearTween, out: linearTween,  inOut: linearTween    }),
		quad:  { in: easeInQuad,  out: easeOutQuad,  inOut: easeInOutQuad  },
		cubic: { in: easeInCubic, out: easeOutCubic, inOut: easeInOutCubic },
		quart: { in: easeInQuart, out: easeOutQuart, inOut: easeInOutQuart },
		quint: { in: easeInQuint, out: easeOutQuint, inOut: easeInOutQuint },
		sine:  { in: easeInSine,  out: easeOutSine,  inOut: easeInOutSine  },
		expo:  { in: easeInExpo,  out: easeOutExpo,  inOut: easeInOutExpo  },
		circ:  { in: easeInCirc,  out: easeOutCirc,  inOut: easeInOutCirc  }
	};

function getTimeArray(timestamp = null) {
	if(timestamp === null) {
		timestamp = new Date();
	}
	else if(typeof timestamp === 'string' || typeof timestamp === 'number') {
		let parsedTimestamp = Date.parse(timestamp);
		if(!isNaN(parsedTimestamp)) {
			timestamp = new Date(parsedTimestamp);
		}
		else {
			throw new RangeError('Invalid Date');
		}
	}
	else if(!(timestamp instanceof Date)) {
		throw new TypeError('Unsupported timestamp');
	}
	let arr = [
			timestamp.getHours(),
			timestamp.getMinutes(),
			timestamp.getSeconds(),
			timestamp.getMilliseconds()
		];
	return arr;
}

function getTimeArrayPadded(...opts) {
	return getTimeArray(...opts).map(n => `0${n}`.slice(-2));
}

function getTimeArraySmooth(...opts) {
	let arr = getTimeArray(...opts);
	let milliseconds = arr[3] / 1000;
	let seconds = (arr[2] + milliseconds) / 60;
	let minutes = (arr[1] + seconds) / 60;
	let hours = ((arr[0] % 12 || 12) + minutes) / 12;
	return [ hours, minutes, seconds, milliseconds ];
}
