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
const THIRTY     = 30.0;
const THIRTY_TWO = 32.0;
const SIXTY      = 60.0;
const HUNDRED    = 100.0;
const THOUSAND   = 1000.0;

const HALF            = ONE / TWO;
const THIRD           = ONE / THREE;
const TWO_THIRDS      = THIRD * TWO;
const QUARTER         = ONE / FOUR;
const THREE_QUARTER   = QUARTER * THREE;
const FIFTH           = ONE / FIVE;
const SIXTH           = ONE / SIX;
const SEVENTH         = ONE / SEVEN;
const EIGHTH          = ONE / EIGHT;
const TWELFTH         = ONE / TWELVE;
const SIXTEENTH       = ONE / SIXTEEN;
const ONE_THIRTIETH   = ONE / THIRTY;
const THIRTY_SECONDTH = ONE / THIRTY_TWO;
const SIXTIETH        = ONE / SIXTY;

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
const FIFTH_PI            = PI * FIFTH;
const SIXTH_PI            = PI * SIXTH;
const SEVENTH_PI          = PI * SEVENTH;
const EIGHTH_PI           = PI * EIGHTH;
const TWELFTH_PI          = PI * TWELFTH;
const SIXTEENTH_PI        = PI * SIXTEENTH;
const THIRTY_SECONDTH_PI  = PI * THIRTY_SECONDTH;
const TAU                 = PI * TWO;
const TWO_TAU             = TAU * TWO;
const HALF_TAU            = PI;
const THIRD_TAU           = TAU * THIRD;
const QUARTER_TAU         = HALF_PI;
const FIFTH_TAU           = TAU * FIFTH;
const SIXTH_TAU           = THIRD_PI;
const EIGHTH_TAU          = QUARTER_PI;
const TWELFTH_TAU         = SIXTH_PI;
const SIXTEENTH_TAU       = EIGHTH_PI;
const THIRTY_SECONDTH_TAU = SIXTEENTH_PI;

const SQRT_3              = sqrt(THREE);
const SQRT_4              = sqrt(FOUR);
const SQRT_5              = sqrt(FIVE);

const PHI                 = (1 + Math.sqrt(5)) / 2;
const GOLDEN_ANGLE        = 1 / (PHI * PHI);

let _defaulCanvasOptions = {
		autoClear: false,
		autoCompensate: false,
		autoPushPop: false,
		centered: false,
		canvas: true,
		width: null,
		height: null
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
let _canvasCurrentlyCentered = false;
let mouseIn = false, mouseDown = false, mousePos = null, mousePosPrev = null;

function updateMouse(e) { // Modified from p5.js
	if(e && !e.clientX) {
		e = e.touches ? e.touches[0] : (e.changedTouches ? e.changedTouches[0] : e);
	}
	let rect = canvas.getBoundingClientRect();
	let sx   = canvas.scrollWidth / width;
	let sy   = canvas.scrollHeight / height;
	let x = (e.clientX - rect.left) / sx;
	let y = (e.clientY - rect.top) / sy;
	if(x < 0) x = 0;
	else if(x > width) x = width;
	if(y < 0) y = 0;
	else if(y > height) y = height;
	if(mousePos) {
		mousePosPrev = mousePos.copy();
		mousePos.set(x, y);
	}
	// return { x, y, winX: e.clientX, winY: e.clientY, id: e.identifier };
}

canvas.addEventListener('mouseenter', e => (updateMouse(e), mouseIn = true));
canvas.addEventListener('mouseleave', e => (updateMouse(e), mouseIn = false, mouseDown = false));
canvas.addEventListener('mousemove',  e => (updateMouse(e), mouseIn = true));
canvas.addEventListener('mousedown',  e => (updateMouse(e), mouseIn = true, mouseDown = true));
canvas.addEventListener('mouseup',    e => (updateMouse(e), mouseDown = false));
window.addEventListener('resize', _resizeCanvas);
window.addEventListener('load', () => {
	mousePos = createVector();
	mousePosPrev = createVector();
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
	_canvasOptions.autoClear && clear(null);
	if(_canvasOptions.autoPushPop) {
		push();
		_canvasOptions.centered && (_canvasCurrentlyCentered = true) && translateCenter();
		_canvasOptions.autoCompensate && compensateCanvas();
	}
	'draw' in window && window.draw(timestamp);
	_canvasOptions.autoPushPop && pop();
	_canvasCurrentlyCentered = false;
	_anim = requestAnimationFrame(_draw);
}

function _resizeCanvas() {
	// if(_canvasOptions.width === null)
	width_half = (width = canvas.width = _canvasOptions.width !== null ? _canvasOptions.width : window.innerWidth) * HALF;
	height_half = (height = canvas.height = _canvasOptions.height !== null ? _canvasOptions.height : window.innerHeight) * HALF;
	ctx.fillStyle = 'hsl(0, 0%, 100%)';
	ctx.strokeStyle = 'hsl(0, 0%, 100%)';
	if('onResize' in window) {
		window.onResize();
	}
}

function clear(x, y, w, h) {
	if(x !== undefined && typeof x === 'number') {
		ctx.clearRect(x, y, w, h);
	}
	else if(_canvasOptions.centered && _canvasCurrentlyCentered/*  && x !== null */) {
		ctx.clearRect(-width_half, -height_half, width, height);
	}
	else {
		ctx.clearRect(0, 0, width, height);
	}
}

function background(a, b, c) {
	push();
	if(typeof a !== 'number') {
		fillStyle(a);
	}
	if(_canvasOptions.centered && _canvasCurrentlyCentered) {
		ctx.fillRect(-width_half, -height_half, width, height);
	}
	else {
		ctx.fillRect(0, 0, width, height);
	}
	pop();
}

function fillStyle(...args) {
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

function lineWidth(w) {
	if(typeof w === 'number') {
		ctx.lineWidth = w;
	}
	return ctx.lineWidth;
}

function strokeStyle(...args) {
	if(args.length === 1) {
		let a = args[0];
		if(typeof a === 'string' || a instanceof CanvasGradient) {
			ctx.strokeStyle = a;
		}
	}
	else if(args.length === 2) {
		strokeStyle(args[0]);
		lineWidth(args[1]);
	}
	return ctx.strokeStyle;
}

function hsl(hue, sat, light, alpha = 1) {
	hue = hue % 360;
	if(hue < 0) {
		hue += 360;
	}
	return `hsl(${hue} ${sat}% ${light}% / ${alpha})`;
}

function fill(...args) {
	if(args.length) {
		fillStyle(...args);
	}
	ctx.fill();
}

function stroke(...args) {
	if(args.length) {
		strokeStyle(...args);
	}
	ctx.stroke();
}

function push() {
	ctx.save();
}

function pop() {
	ctx.restore();
}

function translate(...args) {
	let [ x ] = args;
	if(x instanceof Vector) {
		ctx.translate(x.x, x.y);
	}
	else {
		ctx.translate(args[0], args[1] || 0);
	}
}

function translateCenter() {
	ctx.translate(width_half, height_half);
}

function rotate(rot) {
	ctx.rotate(rot % TAU);
}

function scale(x = 1, y = x) {
	ctx.scale(x, y);
}

function shearX(rad) {
	ctx.transform(1, 0, tan(rad), 1, 0, 0);
}

function shearY(rad) {
	ctx.transform(1, tan(rad), 0, 1, 0, 0);
}

function compensateCanvas() {
	let offX = 0;
	let offY = 0;
	if(width % 2) offX += 0.5;
	if(height % 2) offY += 0.5;
	if(offX || offY) {
		translate(offX, offY);
	}
}

const compOper = {
		default:		'source-over',		sourceOver:		'source-over',		sourceIn:			'source-in',
		sourceOut:		'source-out',		sourceAtop:		'source-atop',		destinationOver:	'destination-over',
		destinationIn:	'destination-in',	destinationOut:	'destination-out',	destinationAtop:	'destination-atop',
		lighter:		'lighter',			copy:			'copy',				xor: 				'xor',
		multiply:		'multiply',			screen:			'screen',			overlay:			'overlay',
		darken:			'darken',			lighten:		'lighten',			colorDodge:			'color-dodge',
		colorBurn:		'color-burn',		hardLight:		'hard-light',		softLight:			'soft-light',
		difference:		'difference',		exclusion:		'exclusion',		hue:				'hue',
		saturation:		'saturation',		color:			'color',			luminosity:			'luminosity',
		source: {
			over:		'source-over',		in:				'source-in',		out:				'source-out',
			atop:		'source-atop'
		},
		destination: {
			over:		'destination-over',	in:				'destination-in',	out:				'destination-out',
			atop:		'destination-atop'
		},
		light: {
			hard:		'hard-light',		soft:			'soft-light'
		}
	};


function compositeOperation(type = compOper.default) { // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
	ctx.globalCompositeOperation = type;
}

function beginPath() {
	ctx.beginPath();
}

function moveTo(x, y) {
	if(typeof x === 'number') {
		ctx.moveTo(x, y);
	}
	else if('x' in x) {
		ctx.moveTo(x.x, x.y);
	}
}

function lineTo(x, y) {
	if(typeof x === 'number') {
		ctx.lineTo(x, y);
	}
	else if('x' in x) {
		ctx.lineTo(x.x, x.y);
	}
}

function closePath() {
	ctx.closePath();
}

function point(x = 0, y = 0, r = 0, g = 0, b = 0, a = 255, doPut_ = true) {
	// let imgData = ctx.createImageData(1, 1);
	// imgData.data[0] = r;
	// imgData.data[1] = g;
	// imgData.data[2] = b;
	// imgData.data[3] = a;
	// if(doPut_) {
	// 	ctx.putImageData(imgData, x, y);
	// }
	// return imgData;
}

function line(x = 0, y = 0, x_ = 0, y_ = 0) {
	ctx.moveTo(x, y);
	ctx.lineTo(x_, y_);
}

function vertices(...verts) {
	if(verts.length === 0) return;
	else if(verts.length === 1 && Array.isArray(verts[0])) {
		verts = verts[0];
	}
	for(let i = 0; i < verts.length; i++) {
		let n = verts[i];
		let x = 0;
		let y = 0;
		if(Array.isArray(n)) {
			([ x, y ] = n);
		}
		else if(n instanceof Vector || ('x' in n && 'y' in n)) {
			({ x, y } = n);
		}
		lineTo(x, y);
	}
}

function arcTo(...args) {
	ctx.arcTo(...args);
}

function rect(x = 0, y = 0, w = 10, h = w, r = 0) {
	if(r > 0) {
		moveTo(x + r, y);
		arcTo(x + w, y,     x + w, y + h, r);
		arcTo(x + w, y + h, x,     y + h, r);
		arcTo(x,     y + h, x,     y,     r);
		arcTo(x,     y,     x + w, y,     r);
		closePath();
	}
	else {
		ctx.rect(x, y, w, h);
	}
}

function arc(...args) {
	ctx.arc(...args);
}

function circle(x = 0, y = undefined, r = 50) {
	if(typeof x !== 'number' && 'x' in x) {
		r = y === undefined ? r : y;
		y = x.y;
		x = x.x;
	}
	else if(y === undefined) {
		y = 0;
	}
	ctx.moveTo(x + r, y);
	ctx.arc(x, y, r, 0, TAU);
}

function regularPolygon(sides, radius = 50, rotation = 0) {
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

function genRegularPolygon(sides = 3, radius = 50, rotation = 0) {
	let iSizes = 1 / sides * TAU;
	let data = {
			sides,
			radius,
			rotation,
			points: []
		};
	for(let i = 0; i < sides; i++) {
		let t = i * iSizes + rotation;
		let x = cos(t) * radius;
		let y = sin(t) * radius;
		let point = createVector(x, y);
		Object.assign(point, { i, t });
		data.points.push(point);
	}
	return data;
}

function loadImage(url) {
	return new Promise((resolve, reject) => {
		let img = new Image();
		img.crossOrigin = 'Anonymous';
		img.onload = () => resolve(img);
		img.src = url;
	});
}

function loadVideo(url) {
	return new Promise((resolve, reject) => {
		let vid = document.createElement('video');
		vid.crossOrigin = 'anonymous';
		vid.onloadeddata = () => resolve(vid);
		vid.preload = true;
		vid.src = url;
		vid.load();
	});
}

function loadJSON(url) {
	return fetch(url)
	.then(res => res.json());
}

function getImageData(img, ...args) {
	if(img instanceof Image) {
		let canvas = document.createElement('canvas');
		let ctx = canvas.getContext('2d');
		Object.assign(canvas, { width: img.width, height: img.height });
		ctx.drawImage(img, 0, 0);
		let data;
		if(args.length) {
			data = ctx.getImageData(...args);
		}
		else {
			data = ctx.getImageData(0, 0, img.width, img.height);
		}
		Object.assign(data, { canvas, ctx });
		return data;
	}
	else {
		return ctx.getImageData(img, ...args);
	}
}

function xyToI(x, y, w, h) {
	return x + w * y;
}

function iToXY(i, w, h) {
	return createVector(i % w, floor(i / w));
}


function random(low = 1, high = null) {
	if(Array.isArray(low)) {
		return low[floor(Math.random() * low.length)];
	}
	if(high === null) {
		return Math.random() * low;
	}
	return Math.random() * (high - low) + low;
}

function map(n, a, b, c, d) {
	return (n - a) * (d - c) / (b - a) + c;
}

function constrain(n, mn, mx) {
	return max(mn, min(mx, n));
}

function lerp(start, stop, amt) {
	if(start instanceof Vector) {
		return Vector.lerp(start, stop, amt);
	}
	return amt * (stop - start) + start;
}

function _distSq(x1, y1, x2, y2) {
	let _x = x2 - x1;
	let _y = y2 - y1;
	return _x * _x + _y * _y;
}

function distSq(x1, y1, x2, y2) {
	if(x1 === undefined || y1 === undefined || x2 === undefined || y2 === undefined) {
		return 0;
	}
	else if(typeof x1 === 'number') {
		if(x1 === x1) {
			return _distSq(x1, y1, x2, y2);
		}
		return 0;
	}
	else if('x' in x1) {
		return _distSq(x1.x, x1.y, y1.x, y1.y);
	}
	return 0;
}

function dist(...args) {
	let d = distSq(...args);
	if(d === 0) {
		return 0;
	}
	return sqrt(d);
}

function cos(input, mult = null) {
	let c = Math.cos(input % TAU);
	if(mult === null) {
		return c;
	}
	return c * mult;
}

function sin(input, mult = null) {
	let s = Math.sin(input % TAU);
	if(mult === null) {
		return s;
	}
	return s * mult;
}


function createVector(x, y, z) {
	return new Vector(x, y, z);
}

class Vector {
	constructor(x = 0, y = 0, z = 0) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	toString() {
		let { x, y, z } = this;
		return `{ x: ${x}, y: ${y}, z: ${z} }`;
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
	
	static lerp(start, stop, amt = 0.5, apply = false) {
		let x = start.x === stop.x ? start.x : lerp(start.x, stop.x, amt);
		let y = start.y === stop.y ? start.y : lerp(start.y, stop.y, amt);
		let z = start.z === stop.z ? start.z : lerp(start.z, stop.z, amt);
		if(apply) {
			return start.set(x, y, z);
		}
		return createVector(x, y, z);
	}
	
	get xy() { return [ this.x, this.y ]; }
	get yx() { return [ this.y, this.x ]; }
	get xz() { return [ this.x, this.z ]; }
	get zx() { return [ this.z, this.x ]; }
	get yz() { return [ this.y, this.z ]; }
	get zy() { return [ this.z, this.y ]; }
	get xyz() { return [ this.x, this.y, this.z ]; }
	get xzy() { return [ this.x, this.z, this.y ]; }
	get yxz() { return [ this.y, this.x, this.z ]; }
	get yzx() { return [ this.y, this.z, this.x ]; }
	get zyx() { return [ this.z, this.y, this.x ]; }
	get zxy() { return [ this.z, this.x, this.y ]; }
	
	equals(vec) {
		return this.x === vec.x && this.y === vec.y;
	}
	
	equals3D(vec = {}) {
		return this.x === vec.x && this.y === vec.y && this.z === vec.z;
	}
	
	draw() {
		point(this.x, this.y);
	}
	
	set(x = this.x, y = this.y, z = this.z) {
		if(x instanceof Vector) {
			this.x = x.x;
			this.y = x.y;
			this.z = x.z;
			return this;
		}
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}
	copy() {
		return createVector(this.x, this.y, this.z);
	}

	add(x = 0, y = x, z = 0) {
		if(x instanceof Vector) {
			return this.add(x.x, x.y, x.z);
		}
		this.x += x;
		this.y += y;
		this.z += z;
		return this;
	}
	sub(x = 0, y = x, z = x) {
		if(x instanceof Vector) {
			return this.sub(x.x, x.y, x.z);
		}
		this.x -= x;
		this.y -= y;
		this.z -= z;
		return this;
	}
	mult(x = 1, y = x, z = x) {
		if(x instanceof Vector) {
			return this.mult(x.x, x.y, x.z);
		}
		this.x *= x;
		this.y *= y;
		this.z *= z;
		return this;
	}
	div(x = 1, y = x, z = x) {
		this.x /= x;
		this.y /= y;
		this.z /= z;
		return this;
	}
	
	heading() {
		return atan2(this.y, this.x);
	}
	rotate(a = 0) {
		if(a === 0) {
			return this;
		}
		let newHeading = this.heading() + a;
		let mag = this.mag();
		return this.set(cos(newHeading), sin(newHeading)).mult(mag);
	}
	rotateXY(a) {
		this.rotate(a);
		return this;
	}
	rotateYZ(a) {
		let v = new Vector(this.y, this.z).rotate(a);
		this.y = v.x;
		this.z = v.y;
		return this;
	}
	rotateZX(a) {
		let v = new Vector(this.z, this.x).rotate(a);
		this.z = v.x;
		this.x = v.y;
		return this;
	}
	magSq() {
		return this.x * this.x + this.y * this.y;
	}
	magSq3D() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}
	mag() {
		return Math.sqrt(this.magSq());
		// return hypot(this.x, this.y);
	}
	mag3D() {
		return Math.sqrt(this.magSq3D());
		// return hypot(this.x, this.y);
	}
	normalize(mag = this.mag()) {
		return mag === 0 ? this : this.div(mag);
	}
	normalize3D(mag = this.mag3D()) {
		return mag === 0 ? this : this.div(mag);
	}
	setMag(mag) {
		return this.normalize().mult(mag);
	}
	setMag3D(mag) {
		return this.normalize3D().mult(mag);
	}
	limit(max) {
		let magSq = this.magSq();
		if(magSq > max * max) {
			this.div(sqrt(magSq));
			this.mult(max);
		}
		return this;
	}
	limit3D(max) {
		let magSq = this.magSq3D();
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
	dot3D(x = 0, y = 0, z = 0) {
		if(x instanceof Vector) {
			return this.dot(x.x, x.y, x.z);
		}
		return this.x * x + this.y * y + this.z * z;
	}
	dist(v) {
		let d = v.copy().sub(this);
		return d.mag();
	}
	dist3D(v) {
		let d = v.copy().sub(this);
		return d.mag3D();
	}
	lerp(stop, amt) {
		return Vector.lerp(this, stop, amt, true);
	}
	round() {
		this.x = round(this.x);
		this.y = round(this.y);
		this.z = round(this.z);
		return this;
	}
	floor() {
		this.x = floor(this.x);
		this.y = floor(this.y);
		this.z = floor(this.z);
		return this;
	}
	fastFloor() {
		this.x = ~~this.x;
		this.y = ~~this.y;
		this.z = ~~this.z;
		return this;
	}
	ceil() {
		this.x = ceil(this.x);
		this.y = ceil(this.y);
		this.z = ceil(this.z);
		return this;
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

function loadWebFont(fontName) {
	if('WebFont' in window === false) {
		return Promise.reject('WebFont not available. Load using this script: https://cdnjs.cloudflare.com/ajax/libs/webfont/1.6.28/webfontloader.js');
	}
	if(fontName === '') {
		return Promise.resolve();
	}
	return new Promise((resolve, reject) => {
		WebFont.load({
			google: { families: [ fontName ] },
			fontactive: resolve
		});
	});
}

function isFontDefault() {
	return ctx.font === '10px sans-serif';
}
