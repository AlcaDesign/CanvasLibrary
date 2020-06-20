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
const THREE_QUARTER_PI    = PI * THREE_QUARTER;
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

const PHI                 = (1 + sqrt(5)) * 0.5;
const GOLDEN_ANGLE        = 1 / (PHI * PHI);

const COLOR_BLACK         = hsl(0, 0, 0);
const COLOR_WHITE         = hsl(0, 0, 100);
const COLOR_RED           = hsl(0, 100, 50);
const COLOR_ORANGE        = hsl(30, 100, 50);
const COLOR_YELLOW        = hsl(60, 100, 50);
const COLOR_GREEN         = hsl(120, 100, 50);
const COLOR_CYAN          = hsl(180, 100, 50);
const COLOR_BLUE          = hsl(240, 100, 50);
const COLOR_PURPLE        = hsl(280, 100, 50);
const COLOR_MAGENTA       = hsl(300, 100, 50);

const TEXTALIGN_LEFT      = 'left';
const TEXTALIGN_CENTER    = 'center';
const TEXTALIGN_RIGHT     = 'right';
const TEXTBASELINE_TOP    = 'top';
const TEXTBASELINE_MIDDLE = 'middle';
const TEXTBASELINE_BOTTOM = 'bottom';

let _defaulCanvasOptions = {
		autoClear: false,
		autoCompensate: true,
		autoPushPop: false,
		canvas: true,
		centered: false,
		desynchronized: false,
		drawAndStop: false,
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
let ctx = canvas.getContext('2d', {
	desynchronized: window.canvasOptions && window.canvasOptions.desynchronized !== undefined ?
		window.canvasOptions.desynchronized : _defaulCanvasOptions.desynchronized
	// preserveDrawingBuffer: true // WebGL
});
const _originalCtx = ctx;
let _anim, _lastCanvasTime, canvasFrameRate, frameCount, width, height, width_half, height_half, width_quarter, height_quarter;
let _canvasCurrentlyCentered = false;
let _logMouseEvents = false;
let mouseUpdate = -Infinity, mouseIn = false, mouseDown = false, mouseMove = null, mousePos = null, mousePosPrev = null;

function updateMouse(e, eventName) { // Modified from p5.js
	if(_logMouseEvents) {
		console.log('Mouse event', eventName, e);
	}
	if(e && !e.clientX) {
		e = e.touches && e.touches.length ? e.touches[0] : (e.changedTouches ? e.changedTouches[0] : e);
	}
	if(!e) {
		return 'Missing event data';
	}
	mouseUpdate = e.timeStamp === undefined ? performance.now() : e.timeStamp;
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
		mousePosPrev.set(mousePos);
		mousePos.set(x, y);
	}
	// return { x, y, winX: e.clientX, winY: e.clientY, id: e.identifier };
}

// let mouseIn = false, mouseDown = false, mouseMove = null, mousePos = { x: 0, y: 0 };
// function updateMouse(e) {
// 	if(e && !e.clientX) {
// 		e = e.touches ? e.touches[0] : (e.changedTouches ? e.changedTouches[0] : e);
// 	}
// 	const { innerWidth: width, innerHeight: height } = window;
// 	uniforms.mouse.value.set(e.clientX / width, 1 - e.clientY / height);
// }

// [
// 	[ 'mouseenter', e => mouseIn = true ],
// 	[ 'mouseleave', e => (mouseIn = false, mouseDown = false) ],
// 	[ 'mousemove', e => (mouseIn = true, mouseMove = e.timeStamp) ],
// 	[ 'mousedown', e => (mouseIn = true, mouseDown = true) ],
// 	[ 'mouseup', e => mouseDown = false ],
// 	[ 'touchstart', e => mouseIn = true ],
// 	[ 'touchend', e => (mouseIn = false, mouseDown = false) ],
// 	[ 'touchcancel', e => (mouseIn = false, mouseDown = false) ],
// 	[ 'touchmove', e => (mouseIn = true, mouseMove = e.timeStamp) ]
// ].forEach(([ eventName, cb ]) => document.body.addEventListener(eventName, e => {
// 	updateMouse(e);
// 	cb(e);
// }));

canvas.addEventListener('mouseenter',  e => (updateMouse(e, 'mouseenter'), mouseIn = true));
canvas.addEventListener('mouseleave',  e => (updateMouse(e, 'mouseleave'), mouseIn = false, mouseDown = false));
canvas.addEventListener('mousemove',   e => (updateMouse(e, 'mousemove'), mouseIn = true, mouseMove = e.timeStamp));
canvas.addEventListener('mousedown',   e => (updateMouse(e, 'mousedown'), mouseIn = true, mouseDown = true));
canvas.addEventListener('mouseup',     e => (updateMouse(e, 'mouseup'), mouseDown = false));
canvas.addEventListener('touchstart',  e => (updateMouse(e, 'touchstart'), mouseIn = true));
canvas.addEventListener('touchend',    e => (updateMouse(e, 'touchend'), mouseIn = false, mouseDown = false));
canvas.addEventListener('touchcancel', e => (updateMouse(e, 'touchcancel'), mouseIn = false, mouseDown = false));
canvas.addEventListener('touchmove',   e => (updateMouse(e, 'touchmove'), mouseIn = true));
window.addEventListener('resize', _resizeCanvas);
window.addEventListener('load', () => {
	mousePos = new Vector();
	mousePosPrev = new Vector();
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
	if(!_lastCanvasTime) {
		_lastCanvasTime = timestamp;
	}
	ctx = _originalCtx;
	_canvasOptions.autoClear && clear(null);
	if(_canvasOptions.autoPushPop) {
		push();
		_canvasOptions.centered && (_canvasCurrentlyCentered = true) && translateCenter();
		_canvasOptions.autoCompensate && compensateCanvas();
	}
	document.body.style.background = 'black !important';
	document.body.style.backgroundColor = 'black !important';
	_canvasOptions.autoPushPop && pop();
	_canvasCurrentlyCentered = false;
	_lastCanvasTime = timestamp;
	if(_canvasOptions.drawAndStop) {
		return;
	}
	_anim = requestAnimationFrame(_draw);
}

function _resizeCanvas(specificCanvas) {
	width = canvas.width = _canvasOptions.width !== null ? _canvasOptions.width : window.innerWidth;
	height = canvas.height = _canvasOptions.height !== null ? _canvasOptions.height : window.innerHeight;
	width_quarter = (width_half = width * HALF) * HALF;
	height_quarter = (height_half = height * HALF) * HALF;
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

function background(a) {
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

function globalAlpha(alpha = ctx.globalAlpha) {
	return ctx.globalAlpha = alpha;
}

function fillStyle(...args) {
	if(args.length === 1) {
		let a = args[0];
		if(typeof a === 'string' || a instanceof CanvasGradient || a instanceof CanvasPattern) {
			ctx.fillStyle = args[0];
		}
	}
	return ctx.fillStyle;
}

function lineWidth(w) {
	if(typeof w === 'number') {
		ctx.lineWidth = w;
	}
	return ctx.lineWidth;
}

// "butt" || "round" || "square";
function lineCap(style = 'butt') {
	ctx.lineCap = style;
}

// "bevel" || "round" || "miter"
function lineJoin(style) {
	ctx.lineJoin = style;
}

function miterLimit(value = 10) {
	ctx.miterLimit = value;
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

function lerpRGB(...args) {
	let r1 = 255;
	let b1 = 255;
	let g1 = 255;
	let a1 = 1;
	let r2 = 0;
	let g2 = 0;
	let b2 = 0;
	let a2 = 1;
	let t = 0.5;
	if(args.length === 3) {
		if(Array.isArray(args[0]) && Array.isArray(args[1])) {
			return lerpRGB(...args[0], ...args[1], args[2]);
		}
		[
			{ r: r1 = 255, b: b1 = 255, g: g1 = 255, a: a1 = 1 },
			{ r: r2 = 0, b: b2 = 0, g: g2 = 0, a: a2 = 1 },
			t
		] = args;
	}
	else if(args.length === 7) {
		[
			r1, g1, b1,
			r2, g2, b2,
			t
		] = args;
	}
	else if(args.length === 9) {
		[
			r1, g1, b1, a1,
			r2, g2, b2, a2,
			t
		] = args;
	}
	else if(args.length === 2 && Array.isArray(args[0])) {
		if(args[0].length === 2) {
			return lerpRGB(...args[0], args[1]);
		}
		// TODO: Allow (possibly weighted) lerping between n-count RGBs at specified positions
	}
	else {
		return { r: 127.5, g: 127.5, b: 127.5, a: 1 };
	}
	let r = lerp(r1, r2, t);
	let g = lerp(g1, g2, t);
	let b = lerp(b1, b2, t);
	let a = lerp(a1, a2, t);
	return { r, g, b, a };
}

function hsl(hue, sat, light, alpha = 1) {
	if(typeof hue !== 'number') {
		if(Array.isArray(hue)) {
			[ hue, sat, light, alpha = alpha ] = hue;
		}
		else if('h' in hue) {
			({ h: hue, s: sat, l: light, a: alpha = alpha } = hue);
		}
	}
	hue = hue % 360;
	if(hue < 0) {
		hue += 360;
	}
	return `hsl(${hue} ${sat}% ${light}% / ${alpha})`;
}

function parseHSL(input) {
	if(typeof input !== 'string') {
		return input;
	}
	let result = input.match(/hsla?\(([\d.]+)\s*,?\s*([\d.]+)%\s*,?\s*([\d.]+)%\s*[/,]?\s*([\d.]*)?\)/);
	if(result) {
		let [ i, h, s, l, a ] = result;
		return { input, h, s, l, a };
	}
	return null;
}

function setHueHSL(input, val) {
	if(val === undefined) return input;
	let p = parseHSL(input);
	p.h = val;
	return hsl(p);
}

function rotateHSL(input, amt = 90) {
	if(amt === 0) return input;
	let p = parseHSL(input);
	p.h += amt;
	return hsl(p);
}

function saturateHSL(input, amt = 0.1) {
	if(amt === 0) return input;
	let p = parseHSL(input);
	p.s *= 1 + amt;
	return hsl(p);
}

function lightenHSL(input, amt = 0.1) {
	if(amt === 0) return input;
	let p = parseHSL(input);
	p.l *= 1 + amt;
	return hsl(p);
}

function rgb(r = 255, g = 255, b = 255, a = 1) {
	if(typeof r !== 'number' && 'r' in r) {
		({ r = 255, g = 255, b = 255, a = 1 } = r);
	}
	return `rgba(${r}, ${g}, ${b}, ${a})`;
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

function clip() {
	ctx.clip();
}

function createLinearGradient(x1 = -100, y1 = -100, x2 = 100, y2 = 100) {
	if(typeof x1 !== 'number' && typeof y1 !== 'number') {
		({ x: x2, y: y2 } = y1);
		({ x: x1, y: y1 } = x1);
	}
	else if(typeof x1 !== 'number' && typeof y1 === 'number' && typeof x2 === 'number') {
		[ x2, y2 ] = [ y1, x2 ];
		({ x: x1, y: y1 } = x1);
	}
	else if(typeof x1 === 'number' && typeof y1 === 'number' && typeof x2 !== 'number') {
		({ x: x2, y: y2 } = x2);
	}
	return ctx.createLinearGradient(x1, y1, x2, y2);
}

function createRadialGradient(x1 = 0, y1 = 0, r1 = 0, x2 = 0, y2 = 0, r2 = 200) {
	return ctx.createRadialGradient(x1, y1, r1, x2, y2, r2);
}

function createPattern(image, repetition = null) {
	return ctx.createPattern(image, repetition);
}

function drawImage(img, x = 0, y = 0, ...args) {
	ctx.drawImage(img, x, y, ...args);
}

function strokeText(str = 'Hello world', x = 0, y = 0) {
	ctx.strokeText(str, x, y);
}

function fillText(str = 'Hello world', x = 0, y = 0) {
	ctx.fillText(str, x, y);
}

function strokeFillText(str = 'Hello world', x = 0, y = 0) {
	strokeText(str, x, y);
	fillText(str, x, y);
}

function fillStrokeText(str = 'Hello world', x = 0, y = 0) {
	fillText(str, x, y);
	strokeText(str, x, y);
}

function measureText(...args) {
	return ctx.measureText(...args);
}

// ctx.textAlign = "left" || "right" || "center" || "start" || "end";
function textAlign(str = 'left') {
	ctx.textAlign = str;
}

// ctx.textBaseline = "top" || "hanging" || "middle" || "alphabetic" || "ideographic" || "bottom";
function textBaseline(str = 'left') {
	if(str === 'center') str = 'middle';
	ctx.textBaseline = str;
}

function push() {
	ctx.save();
}

function pop() {
	ctx.restore();
}

function resetTransform() {
	ctx.resetTransform();
}

function translate(x = 0, y = 0) {
	if(typeof x === 'number') {
		ctx.translate(x, y);
	}
	else if('x' in x) {
		ctx.translate(x.x, x.y);
	}
}

function translateCenter(x = 0, y = 0) {
	ctx.translate(width_half + x, height_half + y);
}

function rotate(rot, offsetX, offsetY) {
	rot = rot % TAU;
	if(offsetX === undefined) {
		ctx.rotate(rot);
	}
	else if(typeof offsetX !== 'number') {
		if('x' in offsetX) {
			ctx.translate(offsetX.x, offsetX.y);
			ctx.rotate(rot);
			ctx.translate(-offsetX.x, -offsetX.y);
		}
	}
	else {
		ctx.translate(offsetX, offsetY);
		ctx.rotate(rot);
		ctx.translate(-offsetX, -offsetY);
	}
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

// const filters = [
// 		[ 'url', [ 'url' ] ],
// 		[ 'blur', [ 'length' ] ],
// 		[ 'brightness', [ 'percentage' ] ],
// 		[ 'contrast', [ 'percentage' ] ]
// 	];

function filter(filterFuncs = 'none') {
	ctx.filter = filterFuncs;
}

function beginPath() {
	ctx.beginPath();
}

function isVectorish(n) {
	return n instanceof Vector || (typeof n === 'object' && 'x' in n && 'y' in n);
}

function moveTo(x, y) {
	if(typeof x === 'number') {
		ctx.moveTo(x, y);
	}
	else if(isVectorish(x)) {
		ctx.moveTo(x.x, x.y);
	}
}

function lineTo(x, y) {
	if(typeof x === 'number') {
		ctx.lineTo(x, y);
	}
	else if(isVectorish(x)) {
		ctx.lineTo(x.x, x.y);
	}
}

function quadraticCurveTo(cpX, cpY, x, y) {
	// ctx.quadraticCurveTo(cpX, cpY, x, y);
	let a = [];
	let b = [];
	if(typeof cpX === 'number') {
		a = [ cpX, cpY ];
		if(typeof x === 'number') {
			b = [ x, y ];
		}
		else if('x' in x) {
			b = x.xy;
		}
	}
	else if('x' in cpX) {
		a = cpX.xy;
		if(typeof cpY === 'number') {
			b = [ cpY, x ];
		}
		else if('x' in cpY) {
			b = cpY.xy;
		}
	}
	ctx.quadraticCurveTo(a[0], a[1], b[0], b[1]);
}

function bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, x, y) {
	let a = [];
	let b = [];
	let c = [];
	if(typeof cp1X === 'number') {
		a = [ cp1X, cp1Y ];
		if(typeof cp2X === 'number') {
			b = [ cp2X, cp2Y ];
			if(typeof x === 'number') {
				c = [ x, y ];
			}
			else if('x' in x) {
				c = x.xy;
			}
		}
		else if('x' in cp2X) {
			b = cp2X.xy;
			if(typeof cp2Y === 'number') {
				c = [ cp2Y, x ];
			}
			else if('x' in cp2Y) {
				c = cp2Y.xy;
			}
		}
	}
	else if('x' in cp1X) {
		a = cp1X.xy;
		if(typeof cp1Y === 'number') {
			b = [ cp1Y, cp2X ];
			if(typeof cp2Y === 'number') {
				c = [ cp2Y, x ];
			}
			else if('x' in cp2Y) {
				c = cp2Y.xy;
			}
		}
		else if('x' in cp1Y) {
			b = cp1Y.xy;
			if(typeof cp2X === 'number') {
				c = [ cp2X, cp2Y ];
			}
			else if('x' in cp2X) {
				c = cp2X.xy;
			}
		}
	}
	ctx.bezierCurveTo(a[0], a[1], b[0], b[1], c[0], c[1]);
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
	if(typeof x === 'number') {
		moveTo(x, y);
		lineTo(x_, y_);
	}
	else if(isVectorish(x)) {
		moveTo(x);
		lineTo(y, x_);
	}
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
		else if(isVectorish(n)) {
			({ x, y } = n);
		}
		lineTo(x, y);
	}
}

function arcTo(x1 = 0, y1 = 0, x2 = 0, y2 = 0, radius = 50) {
	ctx.arcTo(x1, y1, x2, y2, radius);
}

function rect(x, y, w, h, r) {
	if(isVectorish(x)) {
		// Shift args down 1
		[ w, h, r ] = [ y, w, h ];
		({ x, y } = x);
	}
	// x = 0, y = 0, w = 10, h = w, r = 0
	x = x ?? 0;
	y = y ?? 0;
	w = w ?? 10;
	h = h ?? w;
	r = r ?? 0;
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

function arc(x, y, radius, startAngle, endAngle, anticlockwise) {
	if(isVectorish(x)) {
		// Shift args down 1
		[ radius, startAngle, endAngle, anticlockwise ] = [ y, radius, startAngle, endAngle ];
		({ x, y } = x);
	}
	// x = 0, y = 0, radius = 50, startAngle = 0, endAngle = Math.PI * 2, anticlockwise = false
	x = x ?? 0;
	y = y ?? 0;
	radius = radius ?? 50;
	startAngle = startAngle ?? 0;
	endAngle = endAngle ?? TAU;
	anticlockwise = anticlockwise ?? false;
	if(radius < 0) radius = 0;
	ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
}

// function circle(x = 0, y = undefined, rX = 20, rY = undefined) {
function circle(x, y, rX, rY) {
	if(isVectorish(x)) {
		[ rX, rY ] = [ y, rX ];
		({ x, y } = x);
	}
	if(isVectorish(rX)) {
		({ x: rX, y: rY } = rX);
	}
	x = x ?? 0;
	y = y ?? 0;
	rX = rX ?? 20;
	ctx.moveTo(x + rX, y);
	if(rY !== undefined) {
		ellipse(x, y, rX, rY);
	}
	else {
		if(rX < 0) rX = 0;
		ctx.arc(x, y, rX, 0, TAU);
	}
}

// function ellipse(x = 0, y = 0, rX = 50, rY = 50, rot = 0, angStart = 0, angEnd = Math.PI * 2, antiCw = false) {
function ellipse(x, y, rX, rY, rot, angStart, angEnd, antiCw) {
	if(isVectorish(x)) {
		[ rX, rY, rot, angStart, angEnd, antiCw ] = [ y, rX, rY, rot, angStart, angEnd ];
		({ x, y } = x);
	}
	if(isVectorish(rX)) {
		[ rot, angStart, angEnd, antiCw ] = [ rY, rot, angStart, angEnd ];
		({ x: rX, y: rY } = rX);
	}
	x = x ?? 0;
	y = y ?? 0;
	rX = rX ?? 50;
	rY = rY ?? rX;
	rot = rot ?? 0;
	angStart = angStart ?? 0;
	angEnd = angEnd ?? TAU;
	antiCw = antiCw ?? false;
	if(rX < 0) rX = 0;
	if(rY < 0) rY = 0;
	ctx.ellipse(x, y, rX, rY, rot, angStart, angEnd, antiCw);
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
		let point = new Vector(x, y);
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
		vid.muted = true;
		vid.src = url;
		vid.load();
	});
}

function loadData(url) {
	return fetch(url);
}

function loadText(url) {
	return loadData(url)
	.then(res => res.text());
}

function loadJSON(url) {
	return loadData(url)
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
		return Object.assign(data, { canvas, ctx });
	}
	else {
		return ctx.getImageData(img, ...args);
	}
}

function xyToI(x, y, w, h) {
	if(isVectorish(x)) {
		[ w, h ] = [ y, w ];
		({ x, y } = x);
	}
	if(w === undefined) w = 1;
	// if(h === undefined) h = Infinity;
	return x + w * y;
}

function iToXY(i, w, h) {
	return new Vector(i % w, floor(i / w));
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

let _randomGaussianPrevious = false;
let _randomGaussianY2 = 0;

// https://github.com/processing/p5.js/blob/5a46133fdc3e8c42fda1c1888864cf499940d86d/src/math/random.js#L166
// Offset, deviation
function randomGaussian(mean = 0, sd = 1) {
	let y1, x1, x2, w;
	if(_randomGaussianPrevious) {
		y1 = _randomGaussianY2;
		_randomGaussianPrevious = false;
	}
	else {
		do {
			x1 = random(2) - 1;
			x2 = random(2) - 1;
			w = x1 * x1 + x2 * x2;
		} while (w >= 1);
		w = sqrt(-2 * log(w) / w);
		y1 = x1 * w;
		_randomGaussianY2 = x2 * w;
		_randomGaussianPrevious = true;
	}
	return y1 * (sd || 1) + mean;
}

function map(n, a, b, c, d) {
	return (n - a) * (d - c) / (b - a) + c;
}

function constrain(n, mn, mx) {
	return max(mn, min(mx, n));
}

function lerp(start, stop, amt = 0.5) {
	if(typeof start !== 'number') {
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

function dist(x1, y1, x2, y2) {
	let d = distSq(x1, y1, x2, y2);
	if(d === 0) {
		return 0;
	}
	return sqrt(d);
}

function cos(input, mult = 1, add = 0) {
	return Math.cos(input % TAU) * mult;
}

function sin(input, mult = 1, add = 0) {
	return Math.sin(input % TAU) * mult + add;
}

let _warning_createVector = false;
function createVector(x, y, z) {
	if(!_warning_createVector) {
		_warning_createVector = true;
		console.warn('[Alca Canvas Warning] Hey, stop using createVector');
	}
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
	
	static center() {
		return new Vector(width_half, height_half);
	}
	
	static from(v, ...args) {
		if(v === undefined) {
			return new Vector();
		}
		else if(Array.isArray(v)) {
			return new Vector(...v);
		}
		else if(typeof v === 'object') {
			return new Vector(v.x, v.y, v.z);
		}
		else if(typeof v === 'number') {
			return new Vector(v, ...args);
		}
	}
	
	static fromAngle(angle, mult = 1) {
		let v = new Vector(cos(angle), sin(angle));
		if(mult !== 1) v.mult(mult);
		return v;
	}
	
	static random2D(angle = true, mult = 1) {
		let v;
		if(angle === true) {
			v = Vector.fromAngle(random(TAU));
		}
		else {
			v = new Vector(random(-1, 1), random(-1, 1));
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
		let z = start.z === undefined ? stop.z === undefined ? 0 : stop.z : start.z === stop.z ? start.z : lerp(start.z, stop.z, amt);
		if(apply) {
			return start.set(x, y, z);
		}
		return new Vector(x, y, z);
	}
	
	static average(vectors, ...rest) {
		if(rest.length) {
			vectors = [ vectors, ...rest ];
		}
		return vectors.reduce((p, n) => p.add(n), new Vector()).div(vectors.length);
	}
	
	// Swizzlers
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
	
	get xyObject() { return { x: this.x, y: this.y }; }
	get xzObject() { return { x: this.x, z: this.z }; }
	get yzObject() { return { y: this.y, z: this.z }; }
	get xyzObject() { return { x: this.x, y: this.y, z: this.z }; }
	
	copy() {
		return new Vector(this.x, this.y, this.z);
	}
	
	get _() {
		return this.copy();
	}
	
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
	setX(x = this.x) {
		if(x instanceof Vector) {
			this.x = x.x;
			return this;
		}
		this.x = x;
		return this;
	}
	setY(y = this.y) {
		if(y instanceof Vector) {
			this.y = y.y;
			return this;
		}
		this.y = y;
		return this;
	}
	setZ(z = this.z) {
		if(z instanceof Vector) {
			this.z = z.z;
			return this;
		}
		this.z = z;
		return this;
	}
	setXY(x = this.x, y = this.y) {
		if(x instanceof Vector) {
			this.x = x.x;
			this.y = x.y;
			return this;
		}
		this.x = x;
		this.y = y;
		return this;
	}
	setYZ(y = this.y, z = this.z) {
		if(y instanceof Vector) {
			this.y = y.y;
			this.z = y.z;
			return this;
		}
		this.y = y;
		this.z = z;
		return this;
	}
	setXZ(x = this.x, z = this.y) {
		if(x instanceof Vector) {
			this.x = x.x;
			this.z = x.z;
			return this;
		}
		this.x = x;
		this.z = z;
		return this;
	}
	setZX(...args) {
		return this.setXZ(...args);
	}

	add(x = 0, y = undefined, z = undefined) {
		if(y === undefined) {
			y = x;
			z = x;
		}
		else if(z === undefined) {
			z = 0;
		}
		if(x instanceof Vector) {
			this.x += x.x;
			this.y += x.y;
			this.z += x.z;
			return this;
		}
		this.x += x;
		this.y += y;
		this.z += z;
		return this;
	}
	addX(n = 0) {
		if(n instanceof Vector) {
			this.x += n.x;
			return this;
		}
		this.x += n;
		return this;
	}
	addY(n = 0) {
		if(n instanceof Vector) {
			this.y += n.y;
			return this;
		}
		this.y += n;
		return this;
	}
	addZ(n = 0) {
		if(n instanceof Vector) {
			this.z += n.z;
			return this;
		}
		this.z += n;
		return this;
	}
	sub(x = 0, y = undefined, z = undefined) {
		if(y === undefined) {
			y = x;
			z = x;
		}
		else if(z === undefined) {
			z = 0;
		}
		if(x instanceof Vector) {
			this.x -= x.x;
			this.y -= x.y;
			this.z -= x.z;
			return this;
		}
		this.x -= x;
		this.y -= y;
		this.z -= z;
		return this;
	}
	subX(n = 0) {
		if(n instanceof Vector) {
			this.x -= n.x;
			return this;
		}
		this.x -= n;
		return this;
	}
	subY(n = 0) {
		if(n instanceof Vector) {
			this.y -= n.y;
			return this;
		}
		this.y -= n;
		return this;
	}
	subZ(n = 0) {
		if(n instanceof Vector) {
			this.z -= n.z;
			return this;
		}
		this.z -= n;
		return this;
	}
	mult(x = 1, y = x, z = x) {
		if(x instanceof Vector) {
			this.x *= x.x;
			this.y *= x.y;
			this.z *= x.z;
			return this;
		}
		this.x *= x;
		this.y *= y;
		this.z *= z;
		return this;
	}
	multX(n = 1) {
		if(n instanceof Vector) {
			this.x *= n.x;
			return this;
		}
		this.x *= n;
		return this;
	}
	multY(n = 1) {
		if(n instanceof Vector) {
			this.y *= n.y;
			return this;
		}
		this.y *= n;
		return this;
	}
	multZ(n = 1) {
		if(n instanceof Vector) {
			this.z *= n.z;
			return this;
		}
		this.z *= n;
		return this;
	}
	div(x = 1, y = x, z = x) {
		if(x instanceof Vector) {
			this.x /= x.x;
			this.y /= x.y;
			this.z /= x.z;
			return this;
		}
		this.x /= x;
		this.y /= y;
		this.z /= z;
		return this;
	}
	divX(n = 1) {
		if(n instanceof Vector) {
			this.x /= n.x;
			return this;
		}
		this.x /= n;
		return this;
	}
	divY(n = 1) {
		if(n instanceof Vector) {
			this.y /= n.y;
			return this;
		}
		this.y /= n;
		return this;
	}
	divZ(n = 1) {
		if(n instanceof Vector) {
			this.z /= n.z;
			return this;
		}
		this.z /= n;
		return this;
	}
	
	mod(x, y, z) {
		if(x === undefined) return this;
		else if(x instanceof Vector) {
			this.x %= x.x;
			this.y %= x.y;
			this.z %= x.z;
			return this;
		}
		this.x %= x;
		this.y %= y === undefined ? x : y;
		this.z %= z === undefined ? x : y;
		return this;
	}
	// TODO: modX, modY, modZ
	
	min(mX = this.x, mY = this.y, mZ = this.z) {
		if(mX instanceof Vector) {
			this.x = min(this.x, mX.x);
			this.y = min(this.y, mX.y);
			this.z = min(this.z, mX.z);
			return this;
		}
		this.x = min(this.x, mX);
		this.y = min(this.y, mY);
		this.z = min(this.z, mZ);
		return this;
	}
	max(mX = this.x, mY = this.y, mZ = this.z) {
		if(mX instanceof Vector) {
			this.x = max(this.x, mX.x);
			this.y = max(this.y, mX.y);
			this.z = max(this.z, mX.z);
			return this;
		}
		this.x = max(this.x, mX);
		this.y = max(this.y, mY);
		this.z = max(this.z, mZ);
		return this;
	}
	minX(n) {
		this.x = min(this.x, n instanceof Vector ? n.x : n);
		return this;
	}
	minY(n) {
		this.y = min(this.y, n instanceof Vector ? n.y : n);
		return this;
	}
	minZ(n) {
		this.z = min(this.z, n instanceof Vector ? n.z : n);
		return this;
	}
	maxX(n) {
		this.x = max(this.x, n instanceof Vector ? n.x : n);
		return this;
	}
	maxY(n) {
		this.y = max(this.y, n instanceof Vector ? n.y : n);
		return this;
	}
	maxZ(n) {
		this.z = max(this.z, n instanceof Vector ? n.z : n);
		return this;
	}
	
	heading() {
		return atan2(this.y, this.x);
	}
	rotate(a = 0) {
		// if(a === 0) {
		// 	return this;
		// }
		// let newHeading = this.heading() + a;
		// let mag = this.mag();
		// return this.set(cos(newHeading), sin(newHeading)).mult(mag);
		if(!a) {
			return this;
		}
		const c = cos(a);
		const s = sin(a);
		const { x, y } = this;
		this.x = x * c - y * s;
		this.y = x * s + y * c;
		return this;
	}
	rotateXY(a) {
		let v = new Vector(this.x, this.y).rotate(a);
		this.x = v.x;
		this.y = v.y;
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
		const magSq = this.magSq();
		if(magSq > max * max) {
			this.div(sqrt(magSq));
			this.mult(max);
		}
		return this;
	}
	limit3D(max) {
		const magSq = this.magSq3D();
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
	cross(v) {
		return new Vector(
			this.y * v.z - this.z * v.y,
			this.z * v.x - this.x * v.z,
			this.x * v.y - this.y * v.x
		);
	}
	dist(x, y) {
		if(x instanceof Vector) {
			return x.copy().sub(this).mag();
		}
		else if(typeof x === 'object' && 'x' in x) {
			({ x, y } = x);
		}
		return dist(this.x, this.y, x, y);
	}
	dist3D(v) {
		return v.copy().sub(this).mag3D();
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

function linearTween    /* simple linear tweening    */ (t = 0.5, b = 0, c = 1, d = 1) { return c * t / d + b; }
function easeInQuad     /* quadratic   easing in     */ (t = 0.5, b = 0, c = 1, d = 1) { t /= d; return c * t * t + b; }
function easeOutQuad    /* quadratic   easing out    */ (t = 0.5, b = 0, c = 1, d = 1) { t /= d; return -c * t * (t - 2) + b; }
function easeInOutQuad  /* quadratic   easing in/out */ (t = 0.5, b = 0, c = 1, d = 1) { t /= d * 0.5; if(t < 1) return c * 0.5 * t * t + b; t--; return -c * 0.5 * (t * (t - 2) - 1) + b; }
function easeInCubic    /* cubic       easing in     */ (t = 0.5, b = 0, c = 1, d = 1) { t /= d; return c * t * t * t + b; }
function easeOutCubic   /* cubic       easing out    */ (t = 0.5, b = 0, c = 1, d = 1) { t /= d; t--; return c * (t * t * t + 1) + b; }
function easeInOutCubic /* cubic       easing in/out */ (t = 0.5, b = 0, c = 1, d = 1) { t /= d * 0.5; if(t < 1) return c * 0.5 * t * t * t + b; t -= 2; return c * 0.5 * (t * t * t + 2) + b; }
function easeInQuart    /* quartic     easing in     */ (t = 0.5, b = 0, c = 1, d = 1) { t /= d; return c * t * t * t * t + b; }
function easeOutQuart   /* quartic     easing out    */ (t = 0.5, b = 0, c = 1, d = 1) { t /= d; t--; return -c * (t * t * t * t - 1) + b; }
function easeInOutQuart /* quartic     easing in/out */ (t = 0.5, b = 0, c = 1, d = 1) { t /= d * 0.5; if(t < 1) return c * 0.5 * t * t * t * t + b; t -= 2; return -c * 0.5 * (t * t * t * t - 2) + b; }
function easeInQuint    /* quintic     easing in     */ (t = 0.5, b = 0, c = 1, d = 1) { t /= d; return c * t * t * t * t * t + b; }
function easeOutQuint   /* quintic     easing out    */ (t = 0.5, b = 0, c = 1, d = 1) { t /= d; t--; return c * (t * t * t * t * t + 1) + b; }
function easeInOutQuint /* quintic     easing in/out */ (t = 0.5, b = 0, c = 1, d = 1) { t /= d * 0.5; if(t < 1) return c * 0.5 * t * t * t * t * t + b; t -= 2; return c * 0.5 * (t * t * t * t * t + 2) + b; }
function easeInSine     /* sinusoidal  easing in     */ (t = 0.5, b = 0, c = 1, d = 1) { return -c * cos(t / d * HALF_PI) + c + b; }
function easeOutSine    /* sinusoidal  easing out    */ (t = 0.5, b = 0, c = 1, d = 1) { return c * sin(t / d * HALF_PI) + b; }
function easeInOutSine  /* sinusoidal  easing in/out */ (t = 0.5, b = 0, c = 1, d = 1) { return -c * 0.5 * (cos(PI * t / d) - 1) + b; }
function easeInExpo     /* exponential easing in     */ (t = 0.5, b = 0, c = 1, d = 1) { return c * pow(2, 10 * (t / d - 1)) + b; }
function easeOutExpo    /* exponential easing out    */ (t = 0.5, b = 0, c = 1, d = 1) { return c * (-pow(2, -10 * t / d ) + 1) + b; }
function easeInOutExpo  /* exponential easing in/out */ (t = 0.5, b = 0, c = 1, d = 1) { t /= d * 0.5; if(t < 1) return c * 0.5 * pow(2, 10 * (t - 1)) + b; t--; return c * 0.5 * (-pow(2, -10 * t) + 2) + b; }
function easeInCirc     /* circular    easing in     */ (t = 0.5, b = 0, c = 1, d = 1) { t /= d; return -c * (sqrt(1 - t * t) - 1) + b; }
function easeOutCirc    /* circular    easing out    */ (t = 0.5, b = 0, c = 1, d = 1) { t /= d; t--; return c * sqrt(1 - t * t) + b; }
function easeInOutCirc  /* circular    easing in/out */ (t = 0.5, b = 0, c = 1, d = 1) { t /= d * 0.5; if(t < 1) return -c * 0.5 * (sqrt(1 - t * t) - 1) + b; t -= 2; return c * 0.5 * (sqrt(1 - t * t) + 1) + b; }

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
		let options = { fontactive: resolve };
		let providers = {};
		if(typeof fontName === 'string') {
			providers = { google: { families: [ fontName ] } };
		}
		else if(Array.isArray(fontName)) {
			providers = { google: { families: fontName } };
		}
		else {
			providers = fontName;
		}
		Object.assign(options, providers);
		WebFont.load(options);
	});
}

function isFontDefault() {
	return ctx.font === '10px sans-serif';
}

function font(fontStr, fallbackIfDefault) {
	if(fontStr !== undefined) {
		ctx.font = fontStr;
		if(fallbackIfDefault !== undefined && isFontDefault()) {
			ctx.font = fallbackIfDefault;
		}
	}
	return ctx.font;
}
