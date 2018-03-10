import { TweenMax } from 'gsap';
import { css } from '../modules/dev/helpers';

export default class Map {
	constructor(el) {
		this.$mapContainer = $(el);
		this.$mapRegion = this.$mapContainer.find('.path[data-region]');
		this.data = false;
		this.class = {
			mark: 'map__mark',
			tooltip: 'map__tooltip'
		};
		this.text = {
			city: this.$mapContainer.parent().data('text-city'),
			manager: this.$mapContainer.parent().data('text-manager'),
			phone: this.$mapContainer.parent().data('text-phone'),
			address: this.$mapContainer.parent().data('text-address')
		};
		this.$mark = () => this.$mapContainer.parent().find('.' + this.class.mark);
		
		this.$select = $('.js-map-select');
	}
	
	init() {
		this.getData();
	}
	
	start() {
		this.prepareMap();
		this.bindEvents();
	}
	
	bindEvents() {
		this.$mapRegion.on('click tap', (ev) => {
			let $el = $(ev.currentTarget);
			if ($el.hasClass(css.active) || typeof $el.data('text') === 'undefined') return;
			
			this.showTooltip($el.data('text'), $el.data('position'));
			this.showRegion($el);
		});
		
		this.$mark().on('click tap', (ev) => {
			let $el = $(ev.currentTarget);
			
			if ($el.hasClass(css.active)) return;
			
			$el.addClass(css.active);
			
			this.showTooltip($el.data('all'), $el.data('position'), $el.data('type'));
			this.showRegion(this.$mapRegion.filter('[data-region="' + $el.data('region') + '"]'));
		});
		
		this.$select.on('change', (ev) => {
			let $el = $(ev.currentTarget);
			
			if (!$el.find('option:selected').data('region')) return;
			
			let region = $el.find('option:selected').data('region');
			
			this.$mapRegion.filter('[data-region="' + region + '"]').trigger('click');
		});
	}
	
	resetSelect() {
		this.$select.val('').trigger('change');
	}
	
	showRegion(el, flag = true) {
		if (flag) {
			this.hideRegion();
			
			if (el.data('text').region !== this.$select.find('option:selected').data('region')) {
				this.resetSelect();
			}
		}
		
		el.addClass(css.active);
		
		if (el.data('text').office !== 'false') {
			this.$mapContainer.parent().find('.' + this.class.mark + '_blue')
				.filter('[data-region="' + el.data('text').region + '"]').addClass(css.reverse);
		}
		
		if (el.data('target')) {
			if (flag) {
				this.showRegion(this.$mapRegion.filter('[data-region="' + el.data('target') + '"]'), false);
			}
		} else {
			if (el.data('text').redirect !== 'false') {
				this.showRegion(this.$mapRegion.filter('[data-region="' + el.data('text').redirect + '"]'), false);
			}
		}
	}
	
	hideRegion() {
		this.$mark().removeClass(css.active);
		this.$mapRegion.removeClass(css.active);
		this.$mapContainer.parent().find('.' + this.class.mark + '_blue').removeClass(css.reverse);
	}
	
	showTooltip(data, position, type) {
		this.hideTooltip();
		
		let $tooltip = $('<div />', { class: this.class.tooltip });
		let $closeBtn = $('<div />', { class: this.class.tooltip + '-close' });
		let $title = $('<div />', { class: this.class.tooltip + '-title' });
		let $text = $('<div />', { class: this.class.tooltip + '-text' });
		let $phone = $('<a />', { class: this.class.tooltip + '-phone' });
		let $mail = $('<a />', { class: this.class.tooltip + '-mail' });
		
		$closeBtn.append($('<svg class="icon icon-tooltip-close"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-tooltip-close"></use></svg>'));
		
		$closeBtn.on('click tap', () => {
			this.hideRegion();
			this.hideTooltip();
			this.resetSelect();
		});
		
		$tooltip.appendTo(this.$mapContainer.parent())
			.css({
				position: 'absolute',
				top: position.top - 50,
				left: position.left + 20
			})
			.append($closeBtn);
		
		if (type === 'office') {
			$tooltip
				.append($title.clone().text(this.text.city))
				.append($text.clone().text(data.city))
				.append($title.clone().text(this.text.address))
				.append($text.clone().text(data.office.address))
				.append($title.clone().text(this.text.phone))
				.append($phone.clone().text(data.office.phone).attr('href', `tel:+${data.office.phone}`))
				.append($mail.clone().text(data.office.mail).attr('href', `mailto:${data.office.mail}`));
		} else if (type === 'storage') {
			$tooltip
				.append($title.clone().text(this.text.city))
				.append($text.clone().text(data.city))
				.append($title.clone().text(this.text.address))
				.append($text.clone().text(data.storage.address))
				.append($title.clone().text(this.text.phone))
				.append($phone.clone().text(data.storage.phone).attr('href', `tel:+${data.storage.phone}`))
				.append($mail.clone().text(data.storage.mail).attr('href', `mailto:${data.storage.mail}`));
		} else {
			if (data.redirect !== 'false') {
				data = this.$mapRegion.filter('[data-region="' + data.redirect + '"]').data('text');
			}
			
			$tooltip
				.append($title.clone().text(this.text.city))
				.append($text.clone().text(data.city))
				.append($title.clone().text(this.text.manager))
				.append($text.clone().text(data.name))
				.append($title.clone().text(this.text.phone))
				.append($phone.clone().text(data.phone).attr('href', `tel:+${data.phone}`))
				.append($mail.clone().text(data.mail).attr('href', `mailto:${data.mail}`));
		}
		
		TweenMax.to($tooltip, 0.5, {
			y: 0,
			alpha: 1,
			ease: Power1.ease
		});
		
	}
	
	hideTooltip() {
		TweenMax.to(this.$mapContainer.parent().find('.' + this.class.tooltip), 0.5, {
			alpha: 0,
			y: 10,
			ease: Power1.ease,
			onComplete() {
				$(this.target).remove();
			}
		});
	}
	
	getCenterRegion(el) {
		let containerTop = this.$mapContainer.parent()[0].getBoundingClientRect().top;
		let containerLeft = this.$mapContainer.parent()[0].getBoundingClientRect().left;
		let elTop = el[0].getBoundingClientRect().top + el[0].getBoundingClientRect().height / 2;
		let elLeft = el[0].getBoundingClientRect().left + el[0].getBoundingClientRect().width / 2;
		let top = elTop - containerTop;
		let left = elLeft - containerLeft;
		
		return {
			top: top,
			left: left
		};
	}
	
	prepareMap() {
		this.$mapRegion.each((index, el) => {
			let $el = $(el);
			let region = $el.data('region');
			let position = this.getCenterRegion($el);
			let data = this.data.filter(item => item.region === region)[0];
			let $mark = $('<div />', { class: this.class.mark });
			let markColorClass = {
				manager: this.class.mark + '_red',
				office: this.class.mark + '_blue',
				storage: this.class.mark + '_black'
			};
			
			$mark.append($('<div />', { class: this.class.mark + '-in' }));
			
			if (data === undefined) return;
			
			$el.data('position', position);
			$el.data('text', data);
			
			if (data.storage !== 'false') {
				$mark.clone().appendTo(this.$mapContainer.parent())
					.addClass(markColorClass.storage)
					.css({
						position: 'absolute',
						top: position.top,
						left: position.left
					})
					.data('type', 'storage')
					.data('text', data.storage)
					.data('position', position)
					.data('all', data)
					.attr('data-region', region);
			}
			
			if (data.office !== 'false') {
				$mark.clone().appendTo(this.$mapContainer.parent())
					.addClass(markColorClass.office)
					.css({
						position: 'absolute',
						top: position.top - 10,
						left: position.left - 15
					})
					.data('type', 'office')
					.data('text', data.office)
					.data('position', position)
					.data('all', data)
					.attr('data-region', region);
			}
			
			if (data.redirect === 'false' && data.name !== 'false') {
				$mark.clone().appendTo(this.$mapContainer.parent())
					.addClass(markColorClass.manager)
					.css({
						position: 'absolute',
						top: position.top - 10,
						left: position.left + 15
					})
					.data('type', 'manager')
					.data('text', data.redirect)
					.data('position', position)
					.data('all', data)
					.attr('data-region', region);
			} else {
				this.$mapRegion.filter('[data-region="' + data.redirect + '"]')
					.data('target', region);
			}
		});
	}
	
	getData() {
		let url = this.$mapContainer.data('json-url');
		$.ajax({
			url: url,
			success: (data) => {
				if (data.length) {
					this.data = data;
					this.start();
				}
			}
		});
	}
}
