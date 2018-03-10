import { TimelineMax, TweenMax } from 'gsap';
import 'gsap/ScrollToPlugin';
import WheelIndicator from '../../../../node_modules/wheel-indicator/lib/wheel-indicator';
import { PreloaderAPI } from '../../components/preloader';
import { $body, $window, css, currentPage, Resp } from '../../modules/dev/helpers';
import TriangleAPI from '../../modules/dev/triangle';

export class Main01 {
	constructor() {
		this.$slider = $('.home-slider');
		this.$sliderItem = () => this.$slider.find('.home-slider__item');
		this.$sliderText = () => this.$slider.find('.home-slider__text');
    this.$sliderBtn = this.$slider.find('.home-slider__btn');
		this.$sliderSubtext = this.$slider.find('.home-slider__subtext');
		this.$sliderImg = () => this.$sliderItem().find('img');
		this.$sliderPrev = this.$slider.find('.home-slider__buttons-el_prev');
		this.$sliderNext = this.$slider.find('.home-slider__buttons-el_next');
		this.$sliderDot = this.$slider.find('.home-slider__dots-el');
		this.sliderLength = this.$sliderItem().length;
		this.animSpeed = 1;
		this.animEase = Power2.easeOut;
		
		this.$goBtn = $('.go-next');
		this.$goBtnFooter = $('.go-next-footer');
	}
	
	init() {
		this.prepareSlider();
		this.initTriangle();
		this.bindEvents();
		this.initSub();
		
		PreloaderAPI.wait().then(() => {
			this.showSection();
		});
	}
	
	initSub() {
		if (this.$slider.parent().hasClass('screen_sub')) {
			this.$slider.parent().css({
					'margin-top': -1 * this.$slider.parent().offset().top
				}
			);
		}
	}
	
	bindEvents() {
		if (Resp.isDesk) this.initScroll();
		this.goPrevSlide();
		this.goNextSlide();
		
		this.$sliderDot.on('click tap', (ev) => {
			this.goToSlideNumber($(ev.currentTarget).index());
		});
		
		PreloaderAPI.wait().then(() => {
			this.initGoNextSection();
		});
	}
	
	initScroll() {
		const _this = this;
		
		this.indicator = new WheelIndicator({
			elem: this.$slider.get(0),
			callback: function (e) {
				if (_this.getActiveIndex() === _this.sliderLength - 1) {
					_this.indicator.destroy();
					_this.$goBtn.trigger('click');
				} else {
					if (e.direction === 'up') {
						_this.$sliderPrev.trigger('click');
					} else if (e.direction === 'down') {
						_this.$sliderNext.trigger('click');
					}
				}
			}
		});
	}
	
	showSection() {
		let textTl = new TimelineMax();
		let $goBtnCircle = $('.go-next__inner,.go-next-footer__inner');
		let $goBtnSvg = $('.go-next__svg,.go-next-footer__svg');
		let $goBtnPulse1 = $('.go-next__circle_1,.go-next-footer__circle_1');
		let $goBtnPulse2 = $('.go-next__circle_2,.go-next-footer__circle_2');
		let $goBtnText = $('.go-next__text,.go-next-footer__text');
		let $headerTop = $('.header__top');
		let $btn = $('.btn__bg').children();
		let $logo = $('.header__logo .icon');
		let $phone = $('.header__phone-anim');
		
		textTl
		//header-top
			.to($headerTop, 2 * this.animSpeed / 3, {
				y: 0,
				ease: this.animEase
			})
			//btn
			.to($btn, this.animSpeed, {
				x: 0,
				ease: this.animEase
			}, 0)
			//logo
			.to($logo, this.animSpeed, {
				y: 0,
				ease: this.animEase,
				delay: this.animSpeed / 5
			}, 0)
			//logo
			.to($phone, this.animSpeed, {
				y: 0,
				ease: this.animEase,
				delay: this.animSpeed / 5
			}, 0)
			//slider's text
			.to(this.Triangle.moveStartText, this.Triangle.speed + 1, {
				indentX: 0, ease: Power4.easeOut,
				onUpdate: () => {
					if (navigator.userAgent.indexOf('Safari') !== -1 &&
						navigator.userAgent.indexOf('Chrome') === -1) {
						this.Triangle.stateTextFix = Math.ceil(this.Triangle.stateText.indentX);
					} else {
						this.Triangle.stateTextFix = this.Triangle.stateText.indentX;
					}
				}
			}, 0)
			//slider's subtext wrapper
			.to(this.$sliderSubtext.parent(), this.animSpeed, {
				x: 0,
				ease: this.animEase
			}, 0)
			//circle go-next button
			.to($goBtnCircle, this.animSpeed, {
				scale: 1,
				ease: this.animEase
			}, 0)
			//svg go-next button
			.to($goBtnSvg, this.animSpeed, {
				y: 0,
				ease: this.animEase,
				delay: this.animSpeed
			}, 0)
			//pulse-1 go-next button
			.to($goBtnPulse1, this.animSpeed / 2, {
				scale: 1.2,
				alpha: 1,
				ease: Linear.easeNone,
				delay: this.animSpeed / 2
			}, 0)
			.to($goBtnPulse1, this.animSpeed / 2, {
				scale: 1.4,
				alpha: 0,
				ease: Linear.easeNone,
				delay: this.animSpeed
			}, 0)
			//pulse-2 go-next button
			.to($goBtnPulse2, this.animSpeed / 2, {
				scale: 1.2,
				alpha: 1,
				ease: Linear.easeNone,
				delay: this.animSpeed
			}, 0)
			.to($goBtnPulse2, this.animSpeed / 2, {
				scale: 1.4,
				alpha: 0,
				ease: Linear.easeNone,
				delay: 3 * this.animSpeed / 2
			}, 0)
			//text go-next button
			.to($goBtnText, 2 * this.animSpeed, {
				y: 0,
				alpha: 1,
				ease: this.animEase
			}, 0)
			//button prev
			.to(this.$sliderPrev, this.animSpeed, {
				y: 0,
				x: 0,
				ease: this.animEase
			}, 0)
			//button prev
			.to(this.$sliderNext, this.animSpeed, {
				y: 0,
				x: 0,
				ease: this.animEase
			}, 0)
			//dots
			.to(this.$sliderDot.parent(), this.animSpeed, {
				x: 0,
				y: 0,
				ease: this.animEase
			}, 0);
	}
	
	prepareSlider() {
		const $subtextWrapper = $('<div />', { class: 'home-slider__subtext-wrapper' });
		
		$subtextWrapper.insertAfter(this.$sliderDot.parent());
		this.$sliderSubtext.each(function () {
			$(this).appendTo($subtextWrapper);
		});
    this.$sliderBtn.each(function () {
      $(this).appendTo($subtextWrapper);
    });
		
		for (let i = 1; i < this.sliderLength; i++) {
			this.$sliderDot.clone().insertAfter(this.$sliderDot);
		}
		
		this.$sliderSubtext.eq(0).addClass(css.active);
    this.$sliderBtn.eq(0).addClass(css.active);
		this.$sliderDot.eq(0).addClass(css.active);
		this.$sliderDot = this.$sliderDot.siblings().andSelf();
		this.$sliderItem().eq(0).addClass(css.active);
	}
	
	initGoNextSection() {
		this.$goBtn.on('click tap', () => {
			this.indicator.destroy();
			
			TweenMax.to($window, 1, {
				scrollTo: $('.screen').nextAll(':visible').first().get(0),
				ease: Power1.easeOut,
				onComplete() {
					$body.removeClass(css.overflow)
						.removeClass('is-loading');
				}
			});
		});
		this.$goBtnFooter.on('click tap', () => {
			TweenMax.to($window, 1, {
				scrollTo: $('.screen').get(0),
				ease: Power1.easeOut
			});
		});
	}
	
	getActiveIndex() {
		let activeIndex = 0;
		this.$sliderItem().each((index, el) => {
			if ($(el).hasClass(css.active)) {
				activeIndex = index;
			}
		});
		
		return activeIndex;
	}
	
	goToSlideNumber(num) {
		this.$sliderItem().removeClass(css.active)
			.eq(num).addClass(css.active);
		this.$sliderDot.removeClass(css.active)
			.eq(num).addClass(css.active);
		this.$sliderSubtext.removeClass(css.active)
			.eq(num).addClass(css.active);
    this.$sliderBtn.removeClass(css.active)
      .eq(num).addClass(css.active);
		
		if (this.Triangle.isPlaying()) {
			this.Triangle.tl.timeScale(2);
			this.Triangle.tl.vars.onComplete = () => {
				this.Triangle
					.setText2(this.$sliderText().eq(this.getActiveIndex()).text())
					.setImage2(this.$sliderImg().eq(this.getActiveIndex()))
					.playAnim();
			};
			
			return;
		}
		
		this.Triangle
			.setText2(this.$sliderText().eq(this.getActiveIndex()).text())
			.setImage2(this.$sliderImg().eq(this.getActiveIndex()))
			.playAnim();
	}
	
	changeActiveItem(direction) {
		let currentIndex = this.getActiveIndex();
		
		this.$sliderItem().removeClass(css.active);
		this.$sliderDot.removeClass(css.active);
		this.$sliderSubtext.removeClass(css.active);
    this.$sliderBtn.removeClass(css.active);
		
		if (direction === 'next') {
			if (currentIndex < this.sliderLength - 1) {
				this.$sliderItem().eq(currentIndex + 1).addClass(css.active);
				this.$sliderDot.eq(currentIndex + 1).addClass(css.active);
				this.$sliderSubtext.eq(currentIndex + 1).addClass(css.active);
        this.$sliderBtn.eq(currentIndex + 1).addClass(css.active);
			} else {
				this.$sliderItem().eq(0).addClass(css.active);
				this.$sliderDot.eq(0).addClass(css.active);
				this.$sliderSubtext.eq(0).addClass(css.active);
        this.$sliderBtn.eq(0).addClass(css.active);
			}
		} else {
			if (direction === 'prev') {
				if (currentIndex !== 0) {
					this.$sliderItem().eq(currentIndex - 1).addClass(css.active);
					this.$sliderDot.eq(currentIndex - 1).addClass(css.active);
					this.$sliderSubtext.eq(currentIndex - 1).addClass(css.active);
          this.$sliderBtn.eq(currentIndex - 1).addClass(css.active);
				} else {
					this.$sliderItem().eq(this.sliderLength - 1).addClass(css.active);
					this.$sliderDot.eq(this.sliderLength - 1).addClass(css.active);
					this.$sliderSubtext.eq(this.sliderLength - 1).addClass(css.active);
          this.$sliderBtn.eq(this.sliderLength - 1).addClass(css.active);
				}
			}
		}
	}
	
	goToSlide(direction) {
		this.changeActiveItem(direction);
		this.Triangle
			.setText2(this.$sliderText().eq(this.getActiveIndex()).text())
			.setImage2(this.$sliderImg().eq(this.getActiveIndex()))
			.playAnim();
	}
	
	goPrevSlide() {
		this.$sliderPrev.on('click', () => {
			if (this.Triangle.isPlaying()) {
				this.Triangle.tl.timeScale(2);
				this.Triangle.tl.vars.onComplete = () => {
					this.goToSlide('prev');
				};
				
				return;
			}
			
			this.goToSlide('prev');
		});
	}
	
	goNextSlide() {
		this.$sliderNext.on('click', () => {
			if (this.Triangle.isPlaying()) {
				this.Triangle.tl.timeScale(2);
				this.Triangle.tl.vars.onComplete = () => {
					this.goToSlide('next');
				};
				
				return;
			}
			
			this.goToSlide('next');
		});
	}
	
	initTriangle() {
		if (this.sliderLength === 1) {
			this.$sliderItem().clone().removeClass(css.active).insertAfter(this.$sliderItem());
			this.$sliderDot.hide();
			this.$sliderPrev.parent().hide();
		}
		
		this.Triangle = new TriangleAPI(
			'homeSlider',
			this.$sliderImg().eq(0),
			this.$sliderImg().eq(1),
			this.$sliderText().eq(0).text(),
			this.$sliderText().eq(1).text(),
			{
				cols: 10,
				rows: 4,
				speed: 0.5,
				cssRules: {
					textSize: this.$sliderText().css('font-size'),
					textLineHeight: this.$sliderText().css('line-height'),
					textColor: this.$sliderText().css('color'),
					textTop: parseFloat(this.$sliderText().css('top')),
					textTopX: parseInt(this.$sliderText().css('margin-top')),
					textLeft: parseInt(this.$sliderText().css('margin-left')),
					textIndentX: currentPage === 'home' ? parseInt(this.$sliderText().css('text-indent')) : 1,
					textMaxWidth: parseInt(this.$sliderText().css('max-width'))
				}
			});
	}
}

export default new Main01;
