'use strict';

var vector = {
	init: function() {
		var ctrl = this;

		tools.init(['backgrounds']);

		ctrl.initPlugins();
	},
	initPlugins: function() {

		//Number Picker Plugin - TobyJ
		(function ($) {
			$.fn.qtyPicker = function() {
				var dis = 'disabled';
				return this.each(function() {
					var picker = $(this),
					p = picker.find('button:last-child'),
					m = picker.find('button:first-child'),
					input = picker.find('input'),
					min = parseInt(input.attr('min'), 10),
					max = parseInt(input.attr('max'), 10),
					inputFunc = function(picker) {
						var i = parseInt(input.val(), 10);
						if ( (i <= min) || (!i) ) {
							input.val(min);
							p.prop(dis, false);
							m.prop(dis, true);
						} else if (i >= max) {
							input.val(max);
							p.prop(dis, true);
							m.prop(dis, false);
						} else {
							p.prop(dis, false);
							m.prop(dis, false);
						}
					},
					changeFunc = function(picker, qty) {
						var q = parseInt(qty, 10),
						i = parseInt(input.val(), 10);
						if ((i < max && (q > 0)) || (i > min && !(q > 0))) {
							input.val(i + q);
							inputFunc(picker);
						}
					};
					m.on('click', function(){changeFunc(picker,-1);});
					p.on('click', function(){changeFunc(picker,1);});
					input.on('change', function(){inputFunc(picker);});
		      inputFunc(picker); //init
		  });
			};
		}(jQuery));

		$('.qty-picker').qtyPicker();

		tabs.init();
		sliders.init();
		productCtrl.init();
		inputsCtrl.init();
		formsCtrl.init();
		timelineCtrl.init();
		partnersCtrl.init();
		objectsCtrl.init();
		valuesCtrl.init();
		rangeCtrl.init();
		moreCtrl.init();
		filterCheckbox.init();
		vectorCatalog.init();
		extendVector.init();
		mailToCtrl.init();
		cartPrintCtrl.init();
		priceForPrint.init();
		cartItemRemove.init();

		if ($('#contacts-map').length) {
			vectorContacts.init();
		}


		if ($(".table").length) {
			$(".table").mCustomScrollbar({
				scrollbarPosition: 'outside' ,
				axis:"x"
			});
		}

		$('.sort').on('click', function(event) {
			$(this).toggleClass('sort_up');
		});
	}
};

var tabs = {
	init: function() {
		var ctrl = this;

		ctrl.elements = $("[data-tabs]");

		if (ctrl.elements.length) {
			ctrl.dropdown = $('[data-tabs-dropdown] select');

			ctrl.dropdown.select2({
				minimumResultsForSearch: Infinity
			});

			ctrl.elements.each(function() {
				var block = $(this);
				var firstTab = block.find("[data-tab]").eq(0).data('tab');
				ctrl.container = block.find('.tabs__items');
				ctrl.open(block, firstTab);
			});

			ctrl.events();
		}
	},
	open: function(tab, id) {
		var ctrl = this;

		tab.find("[data-tab]").removeClass("tabs__tab_active").hide();
		tab.find("[data-tab='" + id + "']").addClass("tabs__tab_active").fadeIn(300);

		tab.find("[data-tab-open]").removeClass("tabs__button_active");
		tab.find("[data-tab-open='" + id + "']").addClass("tabs__button_active");

		setTimeout(function() {
			tab.find('.slick-slider').slick('refresh');
		}, 50)
	},
	events: function() {
		var ctrl = this;

		$(document).on('click', '[data-tab-open]', function(e) {
			e.preventDefault();

			var btn = $(this);
			var block = btn.closest('.tabs');
			var id = btn.data('tab-open');

			ctrl.open(block, id);
		});

		ctrl.dropdown.on('select2:select', function () {
			var tab = $(this).closest('[data-tabs]')
			var id = $(this).find(":selected").data("tab-open");
			ctrl.open(tab, id);

		});
	}
};


var cartItemRemove = {

	init: function(){

		var ctrl = cartItemRemove;
		ctrl.btn = $('[data-product-remove-table]');
		ctrl.wrap = $('[data-cart-items]');
		ctrl.buttons = $('[data-products-buttons]');

		ctrl.events();

	},

	events: function(){

		var ctrl = cartItemRemove;

		ctrl.btn.on('click', function(e){

			var $target = $(e.target);
			var block = $target.closest('.block');
			var index = block.index();

			$.each(ctrl.wrap, function(){

				var tr = $(this).find('.article').eq(index);
				tr.remove();

			})

			block.remove();

		});


		$('[data-product-remove]').on('click', function(e) {
			e.preventDefault();

			var item = $(this).closest('.article');
			var index = item.index();

			$.each(ctrl.wrap, function(){

				var tr = $(this).find('.article').eq(index);
				tr.remove();

			});

			ctrl.buttons.find('div').eq(index).remove();
		});

	}

};


var priceForPrint = {

	init: function(){

		var ctrl = priceForPrint;
		ctrl.discount = $('[data-product-discount]');
		ctrl.fullPrice = $('[data-full-price]');
		ctrl.actualPrice = $('[data-actual-price]');
		ctrl.fullPricePrint = $('[data-full-price-print]');
		ctrl.actualPricePrint = $('[data-actual-price-print]');

		ctrl.events();

	},

	changePricePrint: function(){

		var ctrl = priceForPrint;
		var fullPriceVal = ctrl.fullPrice.html();
		var actualPriceVal = ctrl.actualPrice.html();

		ctrl.fullPricePrint.html(fullPriceVal);
		ctrl.actualPricePrint.html(actualPriceVal);
	},

	events: function(){

		var ctrl = priceForPrint;

		$(document).ready(ctrl.changePricePrint);
		ctrl.discount.on( "change", ctrl.changePricePrint);

	}
};

var cartPrintCtrl = {

	init: function(){

		var ctrl = cartPrintCtrl;
		ctrl.btn = $('[data-tab-open]');
		ctrl.printTable = $('[data-table-print]');

		ctrl.events();

	},

	events: function(){

		var ctrl = cartPrintCtrl;

		ctrl.btn.on('click', function(e){

			var $target = $(e.target);
			var view = $target.data('tab-open');
			var table = $(document).find('[data-table-print = '+ view +'');
			ctrl.printTable.removeClass('for-print__table_show');
			table.addClass('for-print__table_show');

		});
	}
};

var sliders = {
	init: function() {
		var ctrl = this;

		ctrl.events();
		$("[data-slick]").slick();

		$('.related__items_slider').each(function(index, el) {
			var slider = $(this);
			var prevArrow = slider.closest('.section').find('[data-slide-prev]');
			var nextArrow = slider.closest('.section').find('[data-slide-next]');


			slider.slick({
				slidesToShow: 4,
				slidesToScroll: 1,
				dots: false,
				variableWidth: true,
				arrows: false,
				prevArrow: prevArrow,
				nextArrow: nextArrow,
				responsive: [
				{
					breakpoint: 1199,
					settings: {
						slidesToShow: 2,
						variableWidth: false,
						arrows: true
					}
				},
				{
					breakpoint: 767,
					settings: {
						arrows: false,
						slidesToShow: 2,
						dots: true,
						variableWidth: false
					}
				},
				{
					breakpoint: 450,
					settings: {
						arrows: false,
						slidesToShow: 1,
						dots: true,
						variableWidth: false
					}
				}
				]
			})
		});

		$('.single-product__slider_thumbs').slick({
			slidesToShow: 4,
			slidesToScroll: 1,
			asNavFor: ".single-product__slider_main",
			prevArrow: 	$('.single-product__arrow_prev'),
			nextArrow: $('.single-product__arrow_next'),
			dots: false,
			variableWidth: true,
			focusOnSelect: true,
			responsive: [
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 2,
					variableWidth: false,
					arrows: true,
					prevArrow: 	$('.single-product__pics').find('[data-slide-prev]'),
					nextArrow: $('.single-product__pics').find('[data-slide-next]')
				}
			}
			]

		});
	},

	events: function() {
		try {
			var current = $('[data-slider-current]');
			var count = $('[data-slider-count]');

			$('.use__slider').on('init beforeChange', function(event, slick, currentSlide, nextSlide){

				var i = (nextSlide ? nextSlide : 0) + 1;

				if (nextSlide == undefined) i = 1;

				current.html(i);
				count.html(slick.slideCount);

			});
		} catch(err) {};
	}
}

var productCtrl = {
	init: function() {
		var ctrl = this;

		if (tools.page() == "product") {
			ctrl.certificates();
			ctrl.events();
		}
	},

	events: function() {
		var ctrl = this;

		$('.details__all').on('click', function(e) {
			e.preventDefault();
			tools.scrollTo($('.info'));
			tabs.open($('[data-tabs="info"]'), 'character')
		});

		ctrl.certificatesButton.click(function(event) {
			event.preventDefault();

			ctrl.certificatesList.hide().css('opacity', 0);

			for (var i = ctrl.lastCertificate; i < (ctrl.lastCertificate + ctrl.initialCertificateCount); i++) {
				console.log("i", i);
				ctrl.certificatesList.eq(i).css('display', 'inline-block')
				.animate({opacity:1},500);
			}

			if ( i >= (ctrl.certificatesList.length-1) ) {
				ctrl.lastCertificate = 0;
			} else {
				ctrl.lastCertificate += ctrl.initialCertificateCount;
			}
		});

		$('.details__delivery').on('click', function(event) {
			event.preventDefault();

			$(".details__tooltip").fadeIn(300);
		});

		$('.details__tooltip .tooltip__close').on('click', function(event) {
			event.preventDefault();

			$(".details__tooltip").fadeOut(300);
		});

		$('[data-product-clear-list]').on('click', function(event) {
			event.preventDefault();

			$('.cart__items').html("");
		});

		$('[data-product-discount]').on('input keyup change', function(event) {
			var input = $(this);
			var ch = input.val().replace(/[^\d]/g, '');
			if (ch.length > 2) ch = 99;

			if (ch.length != 2 && event.keyCode == 48) {
				console.log("event.keyCode", event.keyCode);
				ch = ch.replace(new RegExp("0",'g'), "");
			}

			input.val(ch);

		});
	},

	certificates: function() {
		var ctrl = this;

		ctrl.certificatesList = $('.info__certificates_desktop .info__certificate');
		ctrl.certificatesButton = $('.info__more');
		ctrl.initialCertificateCount = 3;

		if (ctrl.certificatesList.length <= 3) {
			ctrl.certificatesButton.hide();
			ctrl.certificatesList.css({
				'display': 'inline-block',
				'opacity': 1
			});
		} else {
			for (var i = 0; i < ctrl.initialCertificateCount; i++) {
				ctrl.certificatesList.eq(i).css({
					'display': 'inline-block',
					'opacity': 1
				});
			}

			ctrl.lastCertificate = ctrl.initialCertificateCount;
		}
	}
};


var inputsCtrl = {
	class: {
		inputFocus: "input_focus",
		inputError: "input_error"
	},

	init: function() {
		var ctrl = this;

		ctrl.inputs = $('[data-input]');

		if (ctrl.inputs.length) {
			ctrl.events();
		}
	},

	events: function() {
		var ctrl = this;

		ctrl.inputs.on('focus', function() {
			$(this).parent().addClass(ctrl.class.inputFocus);
		}).
		on('focusout', function(event) {
			$(this).parent().removeClass(ctrl.class.inputFocus);
		});

		$("[data-input-phone]").mask("(+380) 99 999 99 99", {placeholder:" "});
	}
};

var formsCtrl = {
	init: function() {
		var ctrl = this;

		ctrl.forms = $('[data-form]');

		if (ctrl.forms.length) {
			ctrl.events();
		}
	},

	events: function() {
		var ctrl = this;
		var success = true;

		$('[data-form-submit]').on('click', function(event) {
			console.log('submit');

			var form = $(this).closest('[data-form]');
			var inputs = form.find('[data-input]');

			inputs.each(function() {
				var field = $(this);
				var input = field.parent();
				var value = field.val();

				input.removeClass(inputsCtrl.class.inputError);

				if (value != '' && field.is('[data-input-email]')) {
					if (!ctrl.validateEmail(value)) {
						input.addClass(inputsCtrl.class.inputError);
						success = false;
					}
				};

				if (value == '' && field.is('[data-input-phone]')) {
					input.addClass(inputsCtrl.class.inputError);
					success = false;
				}

			});

			console.log("success", success);
		});
	},

	validateEmail: function(email) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	}
};

var timelineCtrl = {
	init: function() {
		var ctrl = this;
		var timeline = $('[data-timeline]');

		if ( timeline.length ) {
			ctrl.slider = $('[data-timeline-items]');
			ctrl.items = timeline.find('[data-timeline-item]');
			ctrl.progressLine = $('[data-timeline-progress]');
			ctrl.eventsSlider = $('.history__events');

			ctrl.slider.slick({
				slidesToShow: ctrl.items.length,
				focusOnSelect: true,
				variableWidth: true,
				asNavFor: ctrl.eventsSlider,
				arrows: false,
				dots: false,

				responsive: [
				{
					breakpoint: 768,
					settings: {
						slidesToShow: 3,
						slidesToScroll: 1,
						infinite: false,
						variableWidth: false,
						centerMode: true,
						centerPadding: 0
					}
				}]
			});

			ctrl.eventsSlider.slick(
			{
				slidesToShow: 1,
				slidesToScroll: 1,
				asNavFor: "[data-timeline-items]",
				arrows: true,
				fade: true,
				prevArrow: ".history__slider [data-slide-next]",
				nextArrow: ".history__slider [data-slide-prev]",
				dots: false
			}
			);

			ctrl.events();
		}

	},

	events: function() {
		var ctrl = this;

		ctrl.items.on('click', function() {
			var item = $(this);

			ctrl.goTo(item);
		});

		ctrl.eventsSlider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
			ctrl.goTo(ctrl.items.eq(nextSlide));
		});

		$(window).on('load resize', function() {
			setTimeout(function(){
				var currentSlide = ctrl.slider.find('.slick-slide.slick-current.slick-active');
				ctrl.goTo(currentSlide);
			}, 100);
		});
	},

	goTo: function(item) {
		var ctrl = this;

		if (window.client.windowW <= (767 - window.client.getScrollWidth()) || item.length == 0) {
			var progress = 0.5;
		} else {
			var fullWidth = ctrl.progressLine.parent().width(),
			offsetLeft = item.position().left + item.width()/2 - 2,
			progress = offsetLeft / fullWidth;
		}

		ctrl.progressLine.css('transform', 'scaleX(' + progress + ')');
	}
};

var partnersCtrl = {
	viewD: 1,
	viewT: 2,
	viewM: 3,

	init: function() {
		var ctrl = this;

		ctrl.slider = $('[data-partners]');

		if (ctrl.slider.length) {
			ctrl.blocks = $('.partner');
			ctrl.size = ctrl.blocks.eq(0).width();
			ctrl.nav = $('.partners__slider .slider-nav');

			ctrl.events();
		}
	},

	initDesktop:function() {
		var ctrl = this;

		/*for (var i = 0; i < ctrl.blocks.length; i++) {
			if ((i % 9) == 0) {
				ctrl.blocks.eq(i-1).find('.partner__hover').addClass('partner__hover_reverse');
			}

			ctrl.blocks.eq(4 + 9*i).find('.partner__hover').addClass('partner__hover_reverse');
		}

		$(".holder").jPages({
			containerID: "partners",
			perPage: 9,
			previous: ".partners__slider [data-slide-prev]",
			next: ".partners__slider [data-slide-next]",
			callback: function( pages, items ){
				if ( (items.range.end - items.range.start + 1) <= 5) {
					$('#partners').height(ctrl.size*2);
				}
			}
		});

		if (ctrl.blocks.length <= 9) {
			ctrl.nav.hide();
		}*/
		if (ctrl.blocks.length > 10) {

			ctrl.slider.on('init', function(event, slick) {
				ctrl.slider.find("[data-slick-index='" + 4 + "']").find('.partner__hover').addClass('partner__hover_reverse');
				ctrl.slider.find("[data-slick-index='" + 3 + "']").find('.partner__hover').eq(1).addClass('partner__hover_reverse');
			});

			ctrl.slider.slick({
				rows: 2,
				slidesPerRow: 1,
				slidesToShow: 5,
				slidesToScroll: 1,
				arrows: true,
				prevArrow: 	$('.partners__slider').find('[data-slide-prev]'),
				nextArrow: $('.partners__slider').find('[data-slide-next]'),
				dots: false,
				infinite: false,

			});

			ctrl.slider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
				ctrl.slider.find("[data-slick-index]").removeClass('last-element');
				$('.partner__hover').removeClass('partner__hover_reverse');
				ctrl.slider.find("[data-slick-index='" +(nextSlide + 4)+ "']").find('.partner__hover').addClass('partner__hover_reverse');
				ctrl.slider.find("[data-slick-index='" +(nextSlide + 3)+ "']").find('.partner__hover').eq(1).addClass('partner__hover_reverse');

			});
		} else {
			ctrl.nav.hide();
			ctrl.blocks.filter(':eq(4), :eq(9)').find('.partner__hover').addClass('partner__hover_reverse');
		}

	},

	initTablet: function() {
		var ctrl = this;

		/*for (var i = 0; i < ctrl.blocks.length; i++) {
			if ((i % 7) == 0) {
				ctrl.blocks.eq(i-1).find('.partner__hover').addClass('partner__hover_reverse');
			}

			ctrl.blocks.eq(3 + 7*i).find('.partner__hover').addClass('partner__hover_reverse');
		}

		$(".holder").jPages({
			containerID: "partners",
			perPage: 7,
			previous: ".partners__slider [data-slide-prev]",
			next: ".partners__slider [data-slide-next]",
			callback: function( pages, items ){
				if ( (items.range.end - items.range.start + 1) <= 4) {
					$('#partners').height(ctrl.size*2);
				}
			}
		});*/

		if (ctrl.blocks.length > 8) {

			ctrl.slider.on('init', function(event, slick) {
				ctrl.slider.find("[data-slick-index='" + 3 + "']").find('.partner__hover').addClass('partner__hover_reverse');
				ctrl.slider.find("[data-slick-index='" + 2 + "']").find('.partner__hover').eq(1).addClass('partner__hover_reverse');
			});

			ctrl.slider.slick({
				rows: 2,
				slidesPerRow: 1,
				slidesToShow: 4,
				slidesToScroll: 1,
				arrows: true,
				prevArrow: 	$('.partners__slider').find('[data-slide-prev]'),
				nextArrow: $('.partners__slider').find('[data-slide-next]'),
				dots: false
			})

			ctrl.slider.on('beforeChange', function(event, slick, currentSlide, nextSlide){
				ctrl.slider.find("[data-slick-index]").removeClass('last-element');
				$('.partner__hover').removeClass('partner__hover_reverse');
				ctrl.slider.find("[data-slick-index='" +(nextSlide + 3)+ "']").find('.partner__hover').addClass('partner__hover_reverse');
				ctrl.slider.find("[data-slick-index='" +(nextSlide + 2)+ "']").find('.partner__hover').eq(1).addClass('partner__hover_reverse');

			});
		} else {
			ctrl.nav.hide();
			ctrl.blocks.filter(':eq(3), :eq(7)').find('.partner__hover').addClass('partner__hover_reverse');
		}
	},

	initMobile: function() {
		var ctrl = this;

		/*$(".holder").jPages({
			containerID: "partners",
			perPage: 1,
			previous: ".partners__slider [data-slide-prev]",
			next: ".partners__slider [data-slide-next]"
		});*/

		if (ctrl.blocks.length > 1) {

			ctrl.slider.slick({
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: true,
				prevArrow: 	$('.partners__slider').find('[data-slide-prev]'),
				nextArrow: $('.partners__slider').find('[data-slide-next]'),
				dots: false,
				variableWidth: true
			})

		}  else {
			ctrl.nav.hide();
		}
	},

	destroySlider: function() {
		var ctrl = this;

		try {
			$(".holder").jPages("destroy");

			ctrl.slider.unbind("keydown.jPages mousewheel.jPages DOMMouseScroll.jPages");
			$('.partners__slider .slider-nav').find('.slider-nav__button').unbind("click.jPages")
			.removeClass('animated jp-hidden jp-invisible jp-hidden jp-disabled');
		} catch (err) {};

		$('.partner__hover').removeClass('partner__hover_reverse');
		ctrl.nav.show();
	},

	events: function() {
		var ctrl = this;

		$(window).on('load', function() {
			setTimeout(function() {
				var width = window.client.windowW + window.client.getScrollWidth();


				if (width >= 1200) ctrl.view = ctrl.viewD;
				else if (width >= 768) ctrl.view = ctrl.viewT;
				else ctrl.view = ctrl.viewM;

				ctrl.slider.attr('data-view', ctrl.view);

				if (ctrl.view == ctrl.viewD) ctrl.initDesktop();
				if (ctrl.view == ctrl.viewT) ctrl.initTablet();
				if (ctrl.view == ctrl.viewM) ctrl.initMobile();

				/*if (ctrl.slider.attr('data-view') != ctrl.view) {
					ctrl.destroySlider();
					ctrl.slider.attr('data-view', ctrl.view);

					if (ctrl.view == ctrl.viewD) ctrl.initDesktop();
					if (ctrl.view == ctrl.viewT) ctrl.initTablet();
					if (ctrl.view == ctrl.viewM) ctrl.initMobile();
				}*/

				// if (ctrl.view !== ctrl.viewM) $('.partner__info').width(ctrl.size*2 + 2);
			}, 100);
		}).on('load resize', function() {
			setTimeout(function() {
				var width = window.client.windowW + window.client.getScrollWidth();
				ctrl.size = ctrl.blocks.eq(0).width();

				if (width >= 768) {
					$('.partner__info').width(ctrl.size*2 + 2);
					ctrl.nav.width(ctrl.size + 1).height(ctrl.size);
					console.log("ctrl.size", ctrl.size);
				}
			}, 100);
		});

		ctrl.blocks.click(function() {
			if (ctrl.view == ctrl.viewM) {
				$(this).find('.partner__hover').slideToggle(300);
			}
		});
	}
} ;

var objectsCtrl = {
	init: function() {
		var ctrl = this;

		ctrl.slider = $('[data-objects]');

		if (ctrl.slider.length) {
			ctrl.slider.slick({
			slidesToScroll: 1,
			slidesToShow: 5,
			arrows: true,
			prevArrow: 	$('.objects').find('[data-slide-prev]'),
			nextArrow: $('.objects').find('[data-slide-next]'),
			dots: false,
			variableWidth: true,
			infinite: false,
			responsive: [
			{
			  breakpoint: 1024,
			  settings: {
			  	slidesToShow: 4,
			  }
			},
			{
			  breakpoint: 800,
			  settings: {
			  	slidesToShow: 3
			  }
			},
			{
			  breakpoint: 768,
			  settings: {
			  	slidesToShow: 2
			  }
			},
			{
			  breakpoint: 500,
			  settings: {
			  	slidesToShow: 1,
			  	variableWidth: false,
			  }
			}
			]
		})
			ctrl.objects = ctrl.slider.find('.object');
			ctrl.events();
		}
	},

	events: function() {
		var ctrl = this;

		ctrl.objects.hover(function() {
			if (!$(this).hasClass('object_hovered')) {
				if (window.client.windowW + window.client.getScrollWidth() > 1199) {
					$(this).addClass('object_hovered')
					.find('.object__info').show(300);

					$('.objects__slider').addClass('objects__slider_hovered');
				}
			}
		}, function() {
			if (window.client.windowW + window.client.getScrollWidth() > 1199) {
				$(this).find('.object__info').hide(300);
				$('.objects__slider').removeClass('objects__slider_hovered');
				var self = $(this);

				setTimeout(function() {
					self.removeClass('object_hovered');
				}, 300);
			}

		}).on('click touchend',  function(event) {
			var width = window.client.windowW + window.client.getScrollWidth();
			console.log("width", width);


			if (width <= 767) {
				$(this).find('.object__info').slideToggle(300);
			}

			if (width > 767 && width < 1200) {
				$('.object__info').not($(this).find('.object__info')).hide(300)
				$(this).find('.object__info').toggle(300);
			}
		});
	}
}

var valuesCtrl = {
	init: function() {
		var ctrl = this;

		ctrl.block = $('.values');

		if (ctrl.block.length) {
			ctrl.events();
		}
	},

	events: function() {
		var ctrl = this;

		$(window).on('load scroll', function() {
			var bottomState = $(window).scrollTop() + window.client.windowH/3;
			if (ctrl.block.offset().top < bottomState) {
				ctrl.block.addClass('values_animated');
			}
		});
	}
};

var rangeCtrl = {
	init: function() {
		var ctrl = this;
		ctrl.range = document.getElementById('range');

		if (ctrl.range !== null) {
			var valMin = document.getElementById('range-from').value;
			var valMax = document.getElementById('range-to').value;
			var min = +document.getElementById('range-from').getAttribute('data-range-min');
			var max = +document.getElementById('range-to').getAttribute('data-range-max');

			noUiSlider.create(ctrl.range, {
				start: [ valMin, valMax ],
				connect: true,
				format: wNumb({
					decimals: 0
				}),
				range: {
					'min': min,
					'max': max
				}
			});

			this.events();
		}
	},

	events: function() {
		var ctrl = this;

		ctrl.inputFrom = document.getElementById('range-from');
		ctrl.inputTo = document.getElementById('range-to');

		ctrl.range.noUiSlider.on('update', function( values, handle ) {

			var value = values[handle];

			if ( handle ) {
				ctrl.inputTo.value = value;
				//$(ctrl.inputTo).trigger("dataChange");
			} else {
				ctrl.inputFrom.value = Math.round(value);
				//$(ctrl.inputFrom).trigger("dataChange");
			}
		});

		ctrl.range.noUiSlider.on('change', function( values, handle ) {

			var value = values[handle];

			if ( handle ) {
				//ctrl.inputTo.value = value;
				$(ctrl.inputTo).trigger("change");
			} else {
				//ctrl.inputFrom.value = Math.round(value);
				$(ctrl.inputFrom).trigger("change");
			}
		});

		ctrl.inputFrom.addEventListener('change', function(){
			ctrl.range.noUiSlider.set([this.value, null]);
		});

		ctrl.inputTo.addEventListener('change', function(){
			ctrl.range.noUiSlider.set([null, this.value]);
		});
	}
}

var moreCtrl = {
	init: function() {
		var ctrl = this;

		ctrl.blocks = $('[data-more]');

		if (ctrl.blocks.length) {
			ctrl.blocks.each(function() {
				var container = $(this).find('[data-more-container]');
				container.attr('data-more-initial-h', container.outerHeight());
			});

			ctrl.events();
		}

	},

	events: function() {
		var ctrl = this;

		$("[data-more-btn]").on('click', function(event) {
			event.preventDefault();

			var btn = $(this);
			var block = btn.closest("[data-more]");
			var container = block.find("[data-more-container]");
			var opened = block.attr('data-more-opened');
			var initialHeight = container.attr('data-more-initial-h');
			var btnLabel = btn.find('[data-more-btn-label]');
			var btnNewLabel = btnLabel.attr('data-more-btn-label');
			var btnOldLabel = btnLabel.html();

			container.css({
				'height': initialHeight,
				'max-height': 'none'
			});

			btnLabel.html(btnNewLabel).attr('data-more-btn-label', btnOldLabel);

			if (btn.attr('data-hover') !== undefined) {
				btn.attr('data-hover', btnNewLabel);
			}

			if(opened == "false") {
				container.css({
					'height': 'auto'
				});

				var endHeight = container.height();

				container.css({
					"height": initialHeight
				});

				container.animate({
					height: endHeight
				}, 0,
				function() {
					container.css({
						'height': endHeight
					});
					block.attr('data-more-opened', true);
				});

			} else {

				container.animate({
					height: initialHeight
				}, 0,
				function() {
					block.attr('data-more-opened', false);
				});
			}
		});
	}
}

var filterCheckbox = {
	init: function() {
		var ctrl = this;
		ctrl.elements = $('[data-filter-checkbox]');

		if (ctrl.elements.length) {
			ctrl.list = $('[data-filter-selected-list]');
			ctrl.choiceBlock = $('[data-filter-choice]');
			ctrl.clear = $('[data-filter-clear]');
			ctrl.events();
		}
	},

	events: function() {
		var ctrl = this;

		ctrl.elements.find('input').change(function() {
			var input = $(this);
			var id = input.attr('id');

			if (!input.is(':checked')) {
				ctrl.remove(id);
				console.log(1);
			} else {
				var text = input.closest("[data-filter-checkbox]").find('[data-filter-checkbox-text]').html();
				ctrl.add(id, text);
				console.log(2);
			}
		});

		ctrl.list.on('click', '[data-filter-remove-checkbox]', function() {
			var id = $(this).closest("[data-filter-selected-checkbox]").attr('data-filter-selected-checkbox');
			ctrl.remove(id);
		});

		ctrl.clear.on('click', function(event) {
			event.preventDefault();
			$('[data-filter-selected-checkbox]').each(function() {
				var id = $(this).attr('data-filter-selected-checkbox');
				ctrl.remove(id);
			});

			ctrl.choiceBlock.hide();
		});
	},

	add: function(id, text) {
		var ctrl = this;

		var item = '<div class="filter__selected" data-filter-selected-checkbox="' + id + '">' +
		'<div class="filter__label_type_3">' + text + '</div>' +
		'<button class="filter__remove" data-filter-remove-checkbox>' +
		'<svg class="icon icon-remove">' +
		'<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-remove"></use>' +
		'</svg>' +
		'</button>'  +
		'</div>';

		ctrl.list.append(item);
		ctrl.choiceBlock.show();
	},

	remove: function(id) {
		var ctrl = this;
		ctrl.list.find('[data-filter-selected-checkbox="' + id + '"]').remove();
		$('#' + id).attr('checked', false);

		if ($('[data-filter-selected-checkbox]').length == 0) {
			ctrl.choiceBlock.hide();
		}
	}
};

var vectorCatalog = {
	filter:
	{
		toggle:function()
		{
			var $filter_box = $("[data-filter-open]"),
			open = $filter_box.data("filter-open")
			if($filter_box.is(":visible")){
				$filter_box.removeClass(open);
				setTimeout(function(){$filter_box.hide();}, 400);
			}
			else
			{
				$filter_box.show();
				setTimeout(function(){$filter_box.addClass(open);}, 10);
			}
		}
	},
	init:function()
	{
		client.document.on(client.isMobile ? "touchstart" : "click", "[data-filter]", function(e){
			vectorCatalog.filter.toggle();
		});
	}
};

if ($('#contacts-map').length) {
	var vectorContacts = (function() {


	// html objects
	var html = {
		map: document.getElementById("contacts-map"),
		selectCountries: document.getElementById("contacts-map-countries"),
		selectsCities: document.querySelectorAll(".contacts-map__cities"),
		listMarkers: document.getElementById("contacts-map-markers"),
		popup: document.getElementById("contacts-map-popup"),
		popupContent: document.getElementById("contacts-map-popup").querySelector(".popup__content"),
		popupClose: document.getElementById("contacts-map-popup").querySelector(".popup__close"),
		btnRoute: document.getElementById("contacts-btn-set-route")
	};

	var mapOptions = {
		styles: [{featureType:"water",elementType:"geometry",stylers:[{color:"#e9e9e9"},{lightness:17}]},{featureType:"landscape",elementType:"geometry",stylers:[{color:"#f5f5f5"},{lightness:20}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#ffffff"},{lightness:17}]},{featureType:"road.highway",elementType:"geometry.stroke",stylers:[{color:"#ffffff"},{lightness:29},{weight:.2}]},{featureType:"road.arterial",elementType:"geometry",stylers:[{color:"#ffffff"},{lightness:18}]},{featureType:"road.local",elementType:"geometry",stylers:[{color:"#ffffff"},{lightness:16}]},{featureType:"poi",elementType:"geometry",stylers:[{color:"#f5f5f5"},{lightness:21}]},{featureType:"poi.park",elementType:"geometry",stylers:[{color:"#dedede"},{lightness:21}]},{elementType:"labels.text.stroke",stylers:[{visibility:"on"},{color:"#ffffff"},{lightness:16}]},{elementType:"labels.text.fill",stylers:[{saturation:36},{color:"#333333"},{lightness:40}]},{elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"geometry",stylers:[{color:"#f2f2f2"},{lightness:19}]},{featureType:"administrative",elementType:"geometry.fill",stylers:[{color:"#fefefe"},{lightness:20}]},{featureType:"administrative",elementType:"geometry.stroke",stylers:[{color:"#fefefe"},{lightness:17},{weight:1.2}]}],
		icons: {
			0: {
				url: 'static/img/contacts/marker1.png',
			    // This marker is 20 pixels wide by 32 pixels high.
			    size: [16, 20],
			    // The origin for this image is (0, 0).
			    origin: [0, 0],
			    // The anchor for this image is the base of the flagpole at (0, 32).
			    anchor: [8, 20]
			},
			1: {
				url: 'static/img/contacts/marker2.png',
				size: [16, 20],
				origin: [0, 0],
				anchor: [8, 20]
			},
			2: {
				url: 'static/img/contacts/marker3.png',
				size: [16, 20],
				origin: [0, 0],
				anchor: [8, 20]
			}
		},
		currentPos: null
	};

	var classes = {
		popupActice: "contacts-map__popup_active",
		selectCitiesActive: "contacts-map__select_active",
		btnRouteActive: "popup__btn_enabled"
	};

	var data = {
		countries: [],
		cities: [],
		markers: []
	};

	var map;

	var init = function() {

		getData();

		// show select cities for country
		var country = html.selectCountries.querySelectorAll("option")[html.selectCountries.selectedIndex].getAttribute("data-select-country");
		document.querySelector("[data-select-for='" + country + "']").classList.add(classes.selectCitiesActive);

		//var startCenter = data.cities[html.selectCities.selectedIndex];
		var pos = JSON.parse(document.querySelector(".contacts-map__select_active").getElementsByTagName("select")[0].value);
		var startCenter = pos;
		mapOptions.currentCityPos = pos;
		var zoom = html.map.getAttribute("data-contacts-map-zoom") - 0;


		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var pos = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};

				mapOptions.currentPos = pos;
				html.btnRoute.classList.add(classes.btnRouteActive);

            /*infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            map.setCenter(pos);*/

        }, function() {
            //handleLocationError(true, infoWindow, map.getCenter());
        });
		} else {
          // Browser doesn't support Geolocation
          //handleLocationError(false, infoWindow, map.getCenter());
      }




      map = new google.maps.Map(html.map, {
      	zoom: zoom,
      	center: startCenter,
      	scrollwheel: false,
      	styles: mapOptions.styles
      });

      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer;

      directionsDisplay.setMap(map);


      var setRoute = function() {
      	console.log('route');
      	hideWindow();
      	calculateAndDisplayRoute(directionsService, directionsDisplay);
      };


      html.btnRoute.addEventListener("click", setRoute, false);


      setMarkers();


      events();
  };


  var getData = function() {
  	getCountries();
  	getMarkers();
  };

  var getCountries = function() {
  	var result = [];
  	var items = html.selectCountries.getElementsByTagName('option');
  	var i = 0,
  	len = items.length;
  	for (i; i < len; i++) {
  		var item = items[i];
  		var val = JSON.parse(item.value);
  		result.push(val);
  	}
  	data.countries = result;
  };

  var getMarkers = function() {
  	var result = [];
  	var items = html.listMarkers.getElementsByTagName("div");
  	var i = 0, len = items.length;
  	for (i; i < len; i++) {
  		var item = items[i];
  		var val = JSON.parse(item.getAttribute("data-contacts-map-marker"));
  		result.push(val)
  	}
  	data.markers = result;
  }

  var panTo = function(pos) {
  	map.panTo(pos);
  };

  var setMarkers = function() {

  	var markers = data.markers;

  	var i = 0, len = markers.length;

  	for (i; i < len; i++) {

  		var icon = {
  			url: mapOptions.icons[markers[i].type].url,
  			size: new google.maps.Size(mapOptions.icons[markers[i].type].size[0], mapOptions.icons[markers[i].type].size[1]),
  			origin: new google.maps.Point(mapOptions.icons[markers[i].type].origin[0], mapOptions.icons[markers[i].type].origin[1]),
  			anchor: new google.maps.Point(mapOptions.icons[markers[i].type].anchor[0], mapOptions.icons[markers[i].type].anchor[1])
  		};

  		var marker = new google.maps.Marker({
  			position: markers[i].position,
  			map: map,
  			icon: icon,
  			indexMarker: i
  		});

  		marker.addListener('click', function() {
  			showWindow(this.indexMarker);
  		});
  	}

  };

  var showWindow = function(index) {
  	html.popupContent.innerHTML = data.markers[index].text;
  	var pos = data.markers[index].position;
  	mapOptions.currentCityPos = pos;
  	html.popup.classList.add(classes.popupActice);
  };

  var hideWindow = function() {
  	html.popup.classList.remove(classes.popupActice);
  };


  var events = function() {

  	var $eventSelectCountries = $(html.selectCountries);

  	$eventSelectCountries.on("select2:select", function (e) {
			//var index = this.selectedIndex, pos = data.countries[index];
			//panTo(pos);

			var country = this.querySelectorAll("option")[this.selectedIndex].getAttribute("data-select-country");
			document.querySelector("." + classes.selectCitiesActive).classList.remove(classes.selectCitiesActive);

			var newCitySelect = document.querySelector("[data-select-for='" + country + "']");
			newCitySelect.classList.add(classes.selectCitiesActive);
			var pos = JSON.parse(newCitySelect.getElementsByTagName("select")[0].value);
			panTo(pos);

			mapOptions.currentCityPos = pos;


		});

  	var $eventSelectCities = $(".contacts-map__cities");


  	$eventSelectCities.on("select2:select", function (e) {
  		var pos = JSON.parse(this.value);
  		panTo(pos);
  		mapOptions.currentCityPos = pos;
  		hideWindow();
  	});

  	html.popupClose.addEventListener("click", hideWindow, false);
  };



  function calculateAndDisplayRoute(directionsService, directionsDisplay) {

  	console.log(mapOptions.currentPos, mapOptions.currentCityPos);

  	directionsService.route({
  		origin: mapOptions.currentPos,
  		destination: mapOptions.currentCityPos,
  		travelMode: 'DRIVING'
  	}, function(response, status) {
  		if (status === 'OK') {
  			directionsDisplay.setDirections(response);
  		} else {
  			window.alert('Directions request failed due to ' + status);
  		}
  	});
  }

  return {
  	init: init,
  	panTo: panTo
  };

})();
}

var extendVector = (function() {

	var html = {
		$sliderEquipment: $("[data-equipment-slider]")
	};

	var init = function() {

		if (client.isMobile) {
			html.$sliderEquipment.slick({
				slidesToShow: 2,
				slidesToScroll: 1,
				arrows: true,
				prevArrow: ".used-equipment [data-slide-next]",
				nextArrow: ".used-equipment [data-slide-prev]",
				dots: false,
				responsive: [
				{
					breakpoint: 767,
					settings: {
						slidesToShow: 1,
						dots: true,
						arrows: false
					}
				}
				]
			});
		}

	};

	return {
		init: init
	};

})();

var mailToCtrl = {

		init: function(){

			var ctrl = mailToCtrl;

			ctrl.events();

		},

		events: function(){
		var content = $('.new__content').html();
		var title = $('.new__title').html();
		var oldHref = $('.new__mail').attr('href');
		$('.new__mail').attr('href', oldHref + encodeURIComponent(title) + '&body=' + encodeURIComponent(content));

	}
}



$(document).ready(function() {
	vector.init();
});
