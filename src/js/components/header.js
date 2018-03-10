import { TimelineMax, TweenMax } from 'gsap';
import { $body, $document, $header, $scrolledElements, $window, css, currentPage, Resp, throttle } from '../modules/dev/helpers';
import Autocomplete from './autocomplete';
import { PreloaderAPI } from './preloader';

class Header {
	constructor() {
		this.$header = $('.header');
		this.$btn = $('.btn');
		this.$btnMobile = $('.header__mobile-btn');
		this.btnBorder = 'btn_border';
		this.$btnMenuOpen = $('.header__menu-btn_open');
		this.$btnMenuClose = $('.header__menu-btn_close');
		this.$btnSearch = $('.header__search-btn');
		this.$btnPhone = $('.header__phone-w');
		this.$catalogBtn = $('.header__catalog-btn');
		this.$form = $('.header__form');
		this.$formInput = this.$form.find('.header__form-input');
		this.$nav = this.$header.find('.nav');
		this.$linkReg = this.$header.find('.header__link_reg');
		this.$dropdownCountry = $('.header__dropdown_country');
		this.$dropdownLang = $('.header__dropdown_lang');
		this.$menuCol = $('.header__catalog-col');
		this.$imgContainer = $('.header__catalog-img-w');
		this.$list = $('.header__catalog-list > ul');
		this.$listItem = this.$list.children('li');
		this.$sublist = this.$listItem.children('ul');
		this.$sublistItem = this.$sublist.children('li');
		this.$sublistContainer = this.$menuCol.eq(2).find('.header__catalog-list');
		this.mobileTl = new TimelineMax();
		this.scrollTop = 0;
		
		this.freezeHeader = false;
		
		this.init();
	}
	
	init() {
		this.initDropdown();
		this.bindEvents();
		this.initToggle();
		if (Resp.isDesk) {
			this.prepareMenu();
		} else {
			this.initMobileMenu();
		}
		this.initAutocomplete();
		
		this.subHeader();
	}
	
	/**
	 * Hide header on scroll down.
	 */
	initToggle() {
		let lastScrollTop = 0;
		const _this = this;
		const $header = this.$header;
		const delta = 5;
		const headerHeight = $header.height();
		
		const checkWithThrottle = throttle(() => {
			const scrollTop = $window.scrollTop();
			
			// not enough scroll!!..
			if (Math.abs(lastScrollTop - scrollTop) <= delta) return;
			
			if (_this.freezeHeader) return this;
			
			if (scrollTop > lastScrollTop && scrollTop > headerHeight) {
				_this.hideHeader();
			} else if (scrollTop + $window.height() < $document.height()) {
				_this.showHeader();
			}
			
			lastScrollTop = scrollTop;
		}, 50, this);
		
		$window.unbind('scroll', checkWithThrottle);
		$window.on('scroll', checkWithThrottle);
		
		return this;
	}
	
	hideHeader() {
		this.$header.addClass(css.hide);
	}
	
	showHeader() {
		this.$header.removeClass(css.hide);
	}
	
	setFreezeHeader() {
		this.freezeHeader = true;
	}
	
	setUnfreezeHeader() {
		this.freezeHeader = false;
	}
	
	subHeader() {
		if (currentPage !== 'home' || !$('.screen').length) {
			
			let $headerTop = $('.header__top');
			let $btn = $('.btn__bg').children();
			let $logo = $('.header__logo .icon');
			let $phone = $('.header__phone-anim');
			
			//header-top
			TweenMax.set($headerTop, { y: 0 });
			//btn
			TweenMax.set($btn, { x: 0 });
			$btn.parent().parent().addClass('btn_border');
			//logo
			TweenMax.set($logo, { y: 0 });
			//logo
			TweenMax.set($phone, { y: 0 });
			
		}
	}
	
	initMobileMenu() {
		let $mobileMenu = $('<div />', { class: 'mobile-menu' });
		let $btnDropdown = $('<div />', { class: 'mobile-menu__dropdown-btn' });
		let $htmlAnim = $(`
			<div class="mobile-menu__anim">
				<div class="mobile-menu__anim-top"></div>
				<div class="mobile-menu__anim-mid"></div>
				<div class="mobile-menu__anim-bot"></div>
			</div>`);
		
		$btnDropdown.clone()
			.text(this.$catalogBtn.text())
			.appendTo($mobileMenu)
			.wrapInner($('<span></span>'));
		this.$listItem.parent().clone().appendTo($mobileMenu);
		$mobileMenu.find('img').remove();
		this.$nav.children().clone().appendTo($mobileMenu);
		$btnDropdown.clone()
			.text(this.$dropdownCountry.find('.header__dropdown-current-text').text())
			.appendTo($mobileMenu)
			.wrapInner($('<span></span>'));
		this.$dropdownCountry.find('ul').clone().appendTo($mobileMenu);
		this.$linkReg.clone().appendTo($mobileMenu).attr('class', '').addClass('mobile-menu__btn');
		$btnDropdown.clone()
			.text(this.$dropdownLang.find('.header__dropdown-current-text').text())
			.appendTo($mobileMenu)
			.wrapInner($('<span></span>'));
		this.$dropdownLang.find('ul').clone().appendTo($mobileMenu);
		
		$mobileMenu.wrapInner($('<div class="mobile-menu__content"></div>'));
		$htmlAnim.appendTo($mobileMenu);
		
		$mobileMenu.appendTo(this.$header);
		
		$mobileMenu.find('.' + $btnDropdown.attr('class')).on('click tap', (ev) => {
			$(ev.currentTarget).toggleClass(css.active)
				.next().slideToggle();
		});
	}
	
	prepareMenu() {
		this.$list.addClass(css.active);
		
		this.$listItem.each((index, el) => {
			if ($(el).hasClass(css.active)) {
				this.$sublist.eq(index).show();
			}
		});
		
		this.$sublist.each((index, el) => {
			$(el).appendTo(this.$sublistContainer);
		});
		
		this.$sublistContainer.find('ul').first().find('li').first().trigger('mouseenter');
	}
	
	bindEvents() {
		switch (currentPage) {
			case 'home':
				if ($('.screen').length) {
					PreloaderAPI.wait().then(() => {
						const toggleHeaderScroll = throttle(() => {
							toggleHeader(this);
						}, 50, this);
						
						function toggleHeader(el) {
							if ($window.scrollTop() > 5) {
								el.$header.addClass(css.fixed);
								el.$btn.addClass(el.btnBorder);
							} else {
								el.$header.removeClass(css.fixed);
								if (!el.$header.hasClass('is-white')) {
									el.$btn.removeClass(el.btnBorder);
								}
							}
						}
						
						$window.on('scroll', toggleHeaderScroll);
					});
				}
		}
		
		if (currentPage !== 'home') {
			const toggleHeaderScroll = throttle(() => {
				toggleHeader(this);
			}, 50, this);
			
			function toggleHeader(el) {
				if ($window.scrollTop() > 0) {
					el.$header.addClass('is-sub-fixed');
				} else {
					el.$header.removeClass('is-sub-fixed');
				}
			}
			
			$window.on('scroll', toggleHeaderScroll);
		}
		
		//close menu on outside click
		if (Resp.isDesk) {
			$window.on('click tap', (ev) => {
				if (this.$header.hasClass('is-catalog')) {
					if (!$(ev.target).closest(this.$header).length) {
						this.$catalogBtn.trigger('click');
					}
				}
			});
		}
		
		//menu
		this.$catalogBtn.on('click', (ev) => {
			$body.toggleClass(css.overflow);
			$(ev.currentTarget).toggleClass(css.active);
			$header.toggleClass('is-white is-catalog');
			if ($header.hasClass('is-catalog')) {
				this.$btn.addClass(this.btnBorder);
			} else {
				if (!this.$header.hasClass(css.fixed) && !this.$header.hasClass('is-white')) {
					this.$btn.removeClass(this.btnBorder);
				}
			}
		});
		
		this.$listItem.on('mouseenter', (ev) => {
			let hoverIndex = $(ev.currentTarget).index();
			
			if ($(ev.currentTarget).hasClass(css.active)) return;
			
			this.$sublistContainer.find('li').removeClass(css.active);
			this.$sublistContainer.find('ul').eq(hoverIndex).find('li').first().trigger('mouseenter');
			
			this.$listItem.removeClass(css.active)
				.eq(hoverIndex).addClass(css.active);
			
			this.$sublist.filter(':visible').hide();
			this.$sublist.eq(hoverIndex).fadeIn();
			this.$sublist.parent()
				.perfectScrollbar({
					wheelPropagation: true,
					swipePropagation: true,
					swipeEasing: false
				});
			this.$sublist.parent().perfectScrollbar('update');
			this.$sublist.parent().perfectScrollbar('update');
		});
		
		this.$sublistItem.on('mouseenter', (ev) => {
			const $currentItem = $(ev.currentTarget);
			let currentImg = $currentItem.find('img').clone();
			
			if ($currentItem.hasClass(css.active)) return;
			
			$currentItem.addClass(css.active)
				.siblings().removeClass(css.active);
			
			this.$imgContainer.find('img').remove();
			currentImg.hide().appendTo(this.$imgContainer).fadeIn();
		});
		
		//form
		this.$btnSearch.on('click tap', (ev) => {
			$(ev.currentTarget).fadeOut();
			if (!Resp.isDesk) {
				this.$btnPhone.fadeOut(() => {
					this.$form.fadeIn(function () {
						setTimeout(() => {
							$(this).find('[type="submit"]').removeClass(css.animOff);
						}, 100);
					}).css('display', 'flex')
						.find('[type="submit"]').addClass(css.animOff);
					this.$formInput.trigger('focus');
					
					this.$header.addClass('is-white');
					this.$btn.addClass(this.btnBorder);
				});
			} else {
				this.$btnMenuOpen.parent().fadeOut();
				this.$catalogBtn.fadeOut(() => {
					this.$form.fadeIn(function () {
						setTimeout(() => {
							$(this).find('[type="submit"]').removeClass(css.animOff);
						}, 100);
					}).css('display', 'flex')
						.find('[type="submit"]').addClass(css.animOff);
					this.$formInput.trigger('focus');
					
					this.$header.addClass('is-white');
					this.$btn.addClass(this.btnBorder);
				});
			}
		});
		
		this.$formInput.on('focusout keyup', (ev) => {
			if (ev.type === 'keyup') {
				if (ev.keyCode !== 27) return;
			}
			
			if (!this.$header.hasClass('is-catalog')) {
				this.$header.removeClass('is-white');
			}
			
			if (!this.$header.hasClass('is-catalog') && !this.$header.hasClass(css.fixed)) {
				this.$btn.toggleClass(this.btnBorder);
			}
			
			if (!Resp.isDesk) {
				this.$form.fadeOut(() => {
					this.$btnPhone.fadeIn();
					this.$btnSearch.addClass(css.animOff).fadeIn(function () {
						setTimeout(() => {
							$(this).removeClass(css.animOff);
						}, 100);
					});
				});
			} else {
				this.$form.fadeOut(() => {
					this.$catalogBtn.addClass(css.animOff).fadeIn(function () {
						setTimeout(() => {
							$(this).removeClass(css.animOff);
						}, 100);
					});
					this.$btnMenuOpen.parent().fadeIn();
					this.$btnSearch.addClass(css.animOff).fadeIn(function () {
						setTimeout(() => {
							$(this).removeClass(css.animOff);
						}, 100);
					});
				});
			}
		});
		
		this.$btnMenuOpen.on('click tap', () => {
			this.$header.addClass('is-menu');
		});
		
		this.$btnMenuClose.on('click tap', () => {
			this.$header.removeClass('is-menu');
		});
		
		if (!Resp.isDesk) {
			this.$btnMobile.on('click tap', (ev) => {
				let $el = $(ev.currentTarget);
				let $topLine = this.$header.find('.mobile-menu__anim-top');
				let $midLine = this.$header.find('.mobile-menu__anim-mid');
				let $botLine = this.$header.find('.mobile-menu__anim-bot');
				let $content = this.$header.find('.mobile-menu__content');
				
				if (!$el.hasClass(css.active)) {
					this.scrollTop = $window.scrollTop();
				}
				$body.removeClass('menu-active');
				$el.toggleClass(css.active);
				$header.toggleClass('is-white is-catalog');
				
				if ($header.hasClass('is-catalog')) {
					this.mobileTl = new TimelineMax();
					
					this.mobileTl.vars.onComplete = () => {
						$body.addClass('menu-active');
						TweenMax.to($content, 0.75, {
							y: 0,
							autoAlpha: 1,
							ease: Power3.easeOut
						});
					};
					
					this.mobileTl
						.to($topLine, 0.75, { scaleX: 1, ease: Power1.easeIn }, 0)
						.to($midLine, 0.75, { scaleX: 1, ease: Power3.easeIn }, 0)
						.to($botLine, 0.75, { scaleX: 1, ease: Power1.easeIn }, 0);
					
					this.$btn.addClass(this.btnBorder);
				} else {
					this.mobileTl.vars.onComplete = false;
					this.mobileTl = new TimelineMax();
					
					this.setFreezeHeader();
					$scrolledElements.scrollTop(this.scrollTop);
					setTimeout(() => {
						this.setUnfreezeHeader();
					}, 0);
					
					this.mobileTl.vars.onComplete = () => {
						TweenMax.to($topLine, 0.75, { scaleX: 0, ease: Power1.easeOut });
						TweenMax.to($midLine, 0.5, { scaleX: 0, ease: Power2.easeOut });
						TweenMax.to($botLine, 0.75, { scaleX: 0, ease: Power1.easeOut });
					};
					
					this.mobileTl.to($content, 0.25, {
						y: 15,
						autoAlpha: 0,
						ease: Power3.easeIn
					});
					
					if (!this.$header.hasClass(css.fixed) && !this.$header.hasClass('is-white')) {
						this.$btn.removeClass(this.btnBorder);
					}
				}
			});
		}
	}
	
	initDropdown() {
		let $container = $('.header__dropdown');
		
		$container.each((index, el) => {
			$(el).find('ul');
		});
	}
	
	initAutocomplete() {
		new Autocomplete(this.$formInput);
	}
}

export const HeaderAPI = new Header;
