import { TimelineMax, TweenMax } from 'gsap';
import '../modules/dep/imagesloaded.pkgd';
import { AnimStagger } from '../modules/dev/animation/stagger';
import { $body, $window, currentPage, Resp } from '../modules/dev/helpers';

class Preloader {
	constructor() {
		this.$preloader = $('.preloader');
		this.$preloaderCounter = this.$preloader.find('.preloader__counter');
		this.$preloaderLine = this.$preloader.find('.preloader__line-in');
		this.$preloaderText = this.$preloader.find('.preloader__text');
		this.$preloaderLogo = this.$preloader.find('.preloader__text-rect');
		
		this.$images = $('img');
		this.loadedCount = 0;
		this.imagesToLoad = $('img').length;
		this.loadingProgress = 0;
		
		this.speed = 1.2;
		this.preloaderTime = 0;
		
		this.resolved = false;
		
		this.init();
	}
	
	init() {
		return new Promise(resolve => {
			let _this = this;
			let progressTl = new TimelineMax({ paused: true, onUpdate: progressUpdate.bind(_this), onComplete: loadComplete.bind(_this) });
			
			this.$images.imagesLoaded({
					background: true
				}
			).progress(function () {
				loadProgress.apply(_this);
			});
			
			progressTl.to(this.$preloaderLine, 1, { width: '100%', ease: Linear.easeNone }, 0);
			progressTl.to(this.$preloaderLogo, 1, { attr: { width: '100%', x: '0%' }, ease: Linear.easeNone }, 0);
			
			function loadProgress() {
				this.loadedCount++;
				this.loadingProgress = (this.loadedCount / this.imagesToLoad);
				TweenMax.to(progressTl, this.speed, { progress: this.loadingProgress, ease: Power4.ease });
			}
			
			function progressUpdate() {
				this.loadingProgress = Math.round(progressTl.progress() * 100);
				this.$preloaderCounter.text(this.loadingProgress);
			}
			
			function loadComplete() {
				let preloaderOutTl = new TimelineMax();
				
				this.resolved = true;
				resolve();
				
				preloaderOutTl
					.to(this.$preloaderText, 2 * this.speed / 5, { y: 25, autoAlpha: 0, ease: Power2.ease }, 0)
					.to(this.$preloaderLine, 2 * this.speed / 5, { y: 25, autoAlpha: 0, ease: Power2.ease }, 0)
					.to(this.$preloaderCounter, 2 * this.speed / 5, { y: 25, autoAlpha: 0, ease: Power2.ease }, 0)
					.to(this.$preloader, 2 * this.speed / 3, { autoAlpha: 0, ease: Power2.ease }, 0);
				
				if (!Resp.isDesk) {
					$body.removeClass('is-loading');
				}
				
				if (currentPage === 'home') {
					$window.scrollTop(0);
				}
				AnimStagger.init();
				
				return preloaderOutTl;
			}
		});
	}
	
	wait() {
		return new Promise(resolve => {
			let waitInerval = setInterval(() => {
				if (this.resolved === true) {
					clearInterval(waitInerval);
					resolve();
				}
			}, 50);
		});
	}
}

export const PreloaderAPI = new Preloader();
