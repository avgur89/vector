import { TweenMax } from 'gsap';
import WheelIndicator from '../../../node_modules/wheel-indicator/lib/wheel-indicator';
import { $body, $document, $scrolledElements, $window, css, Resp } from '../modules/dev/helpers';
import { HeaderAPI } from '../components/header';

export default class About {
	constructor() {
		this.$section = $('.content').children().eq(0).nextAll();
		this.animating = false;
		this.$header = $('.header');
		
		this.init();
	}
	
	init() {
		if (Resp.isDesk) this.bindReload();
		$window.on('load', () => {
			this.initFullpage();
		});
	}
	
	bindReload() {
		const $link = $('a');
		
		$window.on('beforeunload', reloadPage);
		
		function reloadPage() {
			$scrolledElements.scrollTop(0);
			$body.text('');
		}
		
		const isOnIOS = navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i);
		const eventName = isOnIOS ? 'pagehide' : 'beforeunload';
		
		window.addEventListener(eventName, function () {
			window.event.cancelBubble = true;
			$scrolledElements.scrollTop(0);
			$body.text('');
		});
		
		// hack - unbind window reload
		$link.mouseenter(function () {
			$window.off('beforeunload', reloadPage);
		});
		
		$link.mousedown(function () {
			$window.off('beforeunload', reloadPage);
		});
	}
	
	initFullpage() {
		if (!Resp.isDesk) return;
		
		this.$section.eq(0).addClass(css.active);
		this.bindScroll();
	}
	
	bindScroll() {
		const _this = this;
		
		const indicator = new WheelIndicator({
			elem: window,
			callback(e) {
				if (_this.$header.hasClass('is-catalog')) return;
				
				HeaderAPI.setFreezeHeader();
				if (e.direction === 'up') {
					_this.goPrevSection();
				} else if (e.direction === 'down') {
					_this.goNextSection();
				}
			}
		});
	}
	
	goNextSection() {
		const currentIndex = this.$section.filter('.' + css.active).index();
		
		if (this.$section.filter('.' + css.active).hasClass(css.last)) return;
		
		this.goToSection(currentIndex + 1);
	}
	
	goPrevSection() {
		const currentIndex = this.$section.filter('.' + css.active).index();
		
		if (currentIndex === 1) return;
		
		if (this.$section.hasClass(css.last)) {
			this.goToSection(currentIndex);
		} else {
			this.goToSection(currentIndex - 1);
		}
	}
	
	goToSection(counter) {
		if (this.animating) return;
		
		const _this = this;
		let speed = 0.75;
		const footerHeight = $('.footer').outerHeight();
		
		this.animating = true;
		
		if (this.$section.filter('.' + css.last).length) {
			const offset = _this.$section.eq(counter - 1).offset().top;
			
			this.$section.filter('.' + css.last).removeClass(css.last);
			TweenMax.to(window, speed, {
				scrollTo: offset,
				ease: Power1.easeInOut,
				onComplete() {
					_this.animating = false;
				}
			});
		} else if (counter === this.$section.length + 1) {
			const offset = _this.$section.eq(counter - 2).offset().top + footerHeight;
			
			this.$section.filter('.' + css.active).addClass(css.last);
			TweenMax.to(window, speed, {
				scrollTo: offset,
				ease: Power1.easeInOut,
				onComplete() {
					_this.animating = false;
				}
			});
		} else {
			if (Math.abs(_this.$section.eq(counter - 1).offset().top - this.$section.filter('.' + css.active).offset().top) > $window.height()) {
				speed = Math.abs(_this.$section.eq(counter - 1).offset().top - this.$section.filter('.' + css.active).offset().top) / $window.height() - counter / 2;
				if (speed > 2) {
					speed = 2;
				}
			}
			
			this.$section.filter('.' + css.active).removeClass(css.active);
			this.$section.eq(counter - 1).addClass(css.active);
			
			const offset = counter === 1 ? _this.$section.eq(counter - 1).offset().top - 111 : _this.$section.eq(counter - 1).offset().top;
			
			TweenMax.to(window, speed, {
				scrollTo: offset,
				ease: Power1.easeInOut,
				onComplete() {
					_this.animating = false;
				}
			});
		}
	}
}
