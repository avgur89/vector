import { TimelineMax } from 'gsap';
import { $window, getRandomInt, Resp } from '../dev/helpers';

export default class Triangle {
	constructor(el, image1, image2, text1, text2, parameters = false) {
		this.cols = parameters.cols || 12;
		this.rows = parameters.rows || 5;
		this.state = [];
		this.textLeft = parameters.cssRules.textLeft || 0;
		this.textIndent = parameters.cssRules.textIndentX || -100;
		this.moveStartText = { indentX: this.textIndent };
		this.stateText = { indentX: this.textIndent };
		this.stateTextFix = this.textIndent;
		this.textSize = parameters.cssRules.textSize || '40px';
		this.fluidTextSize1 = this.textSize;
		this.fluidTextSize2 = this.textSize;
		this.textLineHeight = parameters.cssRules.textLineHeight || '50px';
		this.textColor = parameters.cssRules.textColor || '#000000';
		this.textMaxWidth = parameters.cssRules.textMaxWidth || 10000;
		this.textTop = parameters.cssRules.textTop / 100 || 0;
		this.textTopX = parameters.cssRules.textTopX || 0;
		this.speed = parameters.speed || 0.75;
		this.canvasWidth;
		this.canvasHeight;
		this.tl = new TimelineMax();
		
		this.canvas = $(`#${el}`).get(0);
		this.context = this.canvas.getContext('2d');
		this.image1 = image1.get(0);
		this.image2 = image2.get(0);
		this.text1 = text1 || 'Example Text 1';
		this.text2 = text2 || 'Example Text 2';
		this.text1 = $.trim(this.text1);
		this.text2 = $.trim(this.text2);
		
		this.newCanvas = $('<canvas></canvas>').get(0);
		this.newContext = this.newCanvas.getContext('2d');
		
		this.createStateArray();
		this.init();
	}
	
	init() {
		this.updateLayout(this.canvas);
		this.setCanvasSize(this.canvas);
		this.setCanvasSize(this.newCanvas);
		this.draw();
		this.initResize();
		this.fixMobile();
	}
	
	fixMobile() {
		let flag = true;
		if (Resp.isMobile) {
			$window.on('resize', () => {
				if (flag) {
					if (window.innerHeight < window.innerWidth) {
						flag = false;
						this.textTopX -= 50;
					}
				} else {
					flag = true;
					this.textTopX += 50;
				}
			});
		}
	}
	
	setImage1(el) {
		this.image1 = el.get(0);
		return this;
	}
	
	setImage2(el) {
		if (el === 'transparent') {
			this.image2 = el;
		} else {
			this.image2 = el.get(0);
		}
		
		return this;
	}
	
	setText1(el) {
		this.text1 = $.trim(el);
		return this;
	}
	
	setText2(el) {
		this.text2 = $.trim(el);
		return this;
	}
	
	createStateArray() {
		let rows = this.rows;
		let cols = this.cols * 2;
		
		for (let i = 0; i <= rows; i++) {
			this.state[i] = [];
			for (let j = 0; j <= cols; j++) {
				this.state[i][j] = { scale: 0 };
			}
		}
	}
	
	updateLayout(canvas) {
		this.canvasWidth = $(canvas).width();
		this.canvasHeight = $(canvas).height();
	}
	
	setCanvasSize(canvas) {
		canvas.width = this.canvasWidth;
		canvas.height = this.canvasHeight;
	}
	
	render() {
		drawImageProp(this.context, this.image2);
		
		this.context.save();
		this.context.fillStyle = 'rgba(16, 29, 55, 0.7)';
		this.context.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
		this.context.restore();
		
		this.context.save();
		this.context.font = `${this.textSize}/${this.textLineHeight} HelveticaNeue-Bold`;
		this.context.fillStyle = this.textColor;
		this.setNormalTextSize();
		wrapText(this.context, this.text2, this.canvasWidth / 2 - this.textLeft + this.stateTextFix, this.canvasHeight * this.textTop + this.textTopX, this.textMaxWidth, +this.textLineHeight.slice(0, -2), this, '2');
		this.context.restore();
		this.renderTempCanvas();
		this.context.drawImage(this.newCanvas, 0, 0);
	}
	
	renderTempCanvas() {
		this.newContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
		drawImageProp(this.newContext, this.image1);
		
		this.newContext.save();
		this.newContext.fillStyle = 'rgba(16, 29, 55, 0.7)';
		this.newContext.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
		this.newContext.restore();
		
		this.newContext.save();
		this.newContext.font = `${this.textSize}/${this.textLineHeight} HelveticaNeue-Bold`;
		this.newContext.fillStyle = this.textColor;
		this.setNormalTextSize();
		wrapText(this.newContext, this.text1, this.canvasWidth / 2 - this.textLeft + this.moveStartText.indentX, this.canvasHeight * this.textTop + this.textTopX, this.textMaxWidth, +this.textLineHeight.slice(0, -2), this, '1');
		this.newContext.restore();
		
		for (let i = 0; i < this.rows; i++) {
			if (i % 2 === 0) {
				// line
				for (let j = 0; j <= this.cols; j++) {
					this.newContext.save();
					this.newContext.globalCompositeOperation = 'destination-out';
					this.newContext.beginPath();
					this.newContext.moveTo(
						this.canvasWidth / this.cols * (j + 0.5 - this.state[i][j].scale / 2),
						(2 * (i + 0.5) * this.canvasHeight - this.canvasHeight * this.state[i][j].scale) / (2 * this.rows)
					);
					this.newContext.lineTo(
						this.canvasWidth / this.cols * (j + 0.5 + this.state[i][j].scale / 2),
						(2 * (i + 0.5) * this.canvasHeight - this.canvasHeight * this.state[i][j].scale) / (2 * this.rows)
					);
					this.newContext.lineTo(
						this.canvasWidth / this.cols * (j + 0.5),
						(2 * (i + 0.5) * this.canvasHeight + this.canvasHeight * this.state[i][j].scale) / (2 * this.rows)
					);
					this.newContext.closePath();
					this.newContext.fill();
					this.newContext.restore();
				}
				
				// line
				for (let j = 0; j <= this.cols; j++) {
					this.newContext.save();
					this.newContext.globalCompositeOperation = 'destination-out';
					this.newContext.beginPath();
					this.newContext.moveTo(
						this.canvasWidth / this.cols * (j - this.state[i][j].scale / 2),
						(2 * (i + 0.5) * this.canvasHeight + this.canvasHeight * this.state[i][j].scale) / (2 * this.rows)
					);
					this.newContext.lineTo(
						this.canvasWidth / this.cols * (j + this.state[i][j].scale / 2),
						(2 * (i + 0.5) * this.canvasHeight + this.canvasHeight * this.state[i][j].scale) / (2 * this.rows)
					);
					this.newContext.lineTo(
						this.canvasWidth / this.cols * (j),
						(2 * (i + 0.5) * this.canvasHeight - this.canvasHeight * this.state[i][j].scale) / (2 * this.rows)
					);
					this.newContext.closePath();
					this.newContext.fill();
					this.newContext.restore();
				}
			} else {
				// line
				for (let j = 0; j <= this.cols; j++) {
					this.newContext.save();
					this.newContext.globalCompositeOperation = 'destination-out';
					this.newContext.beginPath();
					this.newContext.moveTo(
						this.canvasWidth / this.cols * (j + 0.5 - this.state[i][j].scale / 2),
						(2 * (i + 0.5) * this.canvasHeight + this.canvasHeight * this.state[i][j].scale) / (2 * this.rows)
					);
					this.newContext.lineTo(
						this.canvasWidth / this.cols * (j + 0.5 + this.state[i][j].scale / 2),
						(2 * (i + 0.5) * this.canvasHeight + this.canvasHeight * this.state[i][j].scale) / (2 * this.rows)
					);
					this.newContext.lineTo(
						this.canvasWidth / this.cols * (j + 0.5),
						(2 * (i + 0.5) * this.canvasHeight - this.canvasHeight * this.state[i][j].scale) / (2 * this.rows)
					);
					this.newContext.closePath();
					this.newContext.fill();
					this.newContext.restore();
				}
				
				// line
				for (let j = 0; j <= this.cols; j++) {
					this.newContext.save();
					this.newContext.globalCompositeOperation = 'destination-out';
					this.newContext.beginPath();
					this.newContext.moveTo(
						this.canvasWidth / this.cols * (j - this.state[i][j].scale / 2),
						(2 * (i + 0.5) * this.canvasHeight - this.canvasHeight * this.state[i][j].scale) / (2 * this.rows)
					);
					this.newContext.lineTo(
						this.canvasWidth / this.cols * (j + this.state[i][j].scale / 2),
						(2 * (i + 0.5) * this.canvasHeight - this.canvasHeight * this.state[i][j].scale) / (2 * this.rows)
					);
					this.newContext.lineTo(
						this.canvasWidth / this.cols * (j),
						(2 * (i + 0.5) * this.canvasHeight + this.canvasHeight * this.state[i][j].scale) / (2 * this.rows)
					);
					this.newContext.closePath();
					this.newContext.fill();
					this.newContext.restore();
				}
			}
		}
	}
	
	setHalfTextSize1() {
		this.fluidTextSize1 = this.fluidTextSize1.slice(0, -2) - 1 + 'px';
		this.newContext.font = `${this.fluidTextSize1}/${this.textLineHeight} HelveticaNeue-Bold`;
	}
	
	setHalfTextSize2() {
		this.fluidTextSize2 = this.fluidTextSize2.slice(0, -2) - 1 + 'px';
		this.context.font = `${this.fluidTextSize2}/${this.textLineHeight} HelveticaNeue-Bold`;
	}
	
	setNormalTextSize() {
		this.fluidTextSize1 = this.textSize;
		this.fluidTextSize2 = this.textSize;
		this.newContext.font = `${this.fluidTextSize1}/${this.textLineHeight} HelveticaNeue-Bold`;
		this.context.font = `${this.fluidTextSize2}/${this.textLineHeight} HelveticaNeue-Bold`;
	}
	
	draw() {
		this.render();
		window.requestAnimationFrame(this.draw.bind(this));
	}
	
	isPlaying() {
		return this.tl.isActive();
	}
	
	playAnim() {
		this.tl = new TimelineMax();
		let rows = this.rows;
		let cols = this.cols * 2;
		let delay = 0;
		
		for (let i = 0; i <= rows; i++) {
			for (let j = 0; j <= cols; j++) {
				delay = getRandomInt(0, 100 * this.speed / 2) / 100;
				
				this.tl.to(this.state[i][j], this.speed - delay / 4, { scale: 1.05, ease: Power1.easeInOut, delay: delay }, 0);
			}
		}
		
		this.tl.to(this.stateText, this.speed + 1, {
			indentX: 0, ease: Power4.easeOut,
			onUpdate: () => {
				if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1) {
					this.stateTextFix = Math.ceil(this.stateText.indentX);
				} else {
					this.stateTextFix = this.stateText.indentX;
				}
			},
			onComplete: () => {
				this.image1 = this.image2;
				this.text1 = this.text2;
				this.stateText = { indentX: this.textIndent };
				this.stateTextFix = this.textIndent;
				this.createStateArray();
			}
		}, 0);
	}
	
	initResize() {
		if (!Resp.isDesk) {
			this.cols = this.cols / 2;
		}
		$window.on('resize', () => {
			this.updateLayout(this.canvas);
			this.setCanvasSize(this.canvas);
			this.setCanvasSize(this.newCanvas);
		});
	}
}

function wrapText(context, text, x, y, maxWidth, lineHeight, that, count) {
	let words = text.split(' ');
	let line = '';
	
	if (words.length === 1) {
		let metrics = context.measureText(text);
		let testWidth = metrics.width;
		if (testWidth > maxWidth) {
			if (count === '1') {
				that.setHalfTextSize1();
			} else if (count === '2') {
				that.setHalfTextSize2();
			}
			wrapText(context, text, x, y, maxWidth, lineHeight, that, count);
			return false;
		}
		context.fillText(text, x, y);
		
		return false;
	}
	
	for (let n = 0; n < words.length; n++) {
		let testLine = line + words[n] + ' ';
		let metrics = context.measureText(testLine);
		let testWidth = metrics.width;
		if (testWidth > maxWidth && n > 0) {
			context.fillText(line, x, y);
			line = words[n] + ' ';
			y += lineHeight;
		} else {
			line = testLine;
		}
	}
	context.fillText(line, x, y);
	
	return true;
}

function drawImageProp(ctx, img, x, y, w, h, offsetX, offsetY) {
	
	if (arguments.length === 2) {
		x = y = 0;
		w = ctx.canvas.width;
		h = ctx.canvas.height;
	}
	
	/// default offset is center
	offsetX = offsetX ? offsetX : 0.5;
	offsetY = offsetY ? offsetY : 0.5;
	
	/// keep bounds [0.0, 1.0]
	if (offsetX < 0) offsetX = 0;
	if (offsetY < 0) offsetY = 0;
	if (offsetX > 1) offsetX = 1;
	if (offsetY > 1) offsetY = 1;
	
	let iw = img.width,
		ih = img.height,
		r = Math.min(w / iw, h / ih),
		nw = iw * r,   /// new prop. width
		nh = ih * r,   /// new prop. height
		cx, cy, cw, ch, ar = 1;
	
	/// decide which gap to fill
	if (nw < w) ar = w / nw;
	if (nh < h) ar = h / nh;
	nw *= ar;
	nh *= ar;
	
	/// calc source rectangle
	cw = iw / (nw / w);
	ch = ih / (nh / h);
	
	cx = (iw - cw) * offsetX;
	cy = (ih - ch) * offsetY;
	
	/// make sure source rectangle is valid
	if (cx < 0) cx = 0;
	if (cy < 0) cy = 0;
	if (cw > iw) cw = iw;
	if (ch > ih) ch = ih;
	
	/// fill image in dest. rectangle
	ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}
