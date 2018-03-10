import 'perfect-scrollbar/dist/js/perfect-scrollbar.jquery.min';
import { css } from '../modules/dev/helpers';

export default class autocomplete {
	constructor(el) {
		this.init(el);
	}
	
	init(el) {
		el.each(function () {
			let $this = $(this);
			let linkAll;
			
			$.widget('custom.catcomplete', $.ui.autocomplete, {
				_create: function () {
					this._super();
					this.widget().menu('option', 'items', '> :not(.ui-autocomplete__category)');
				},
				_renderMenu: function (ul, items) {
					let _this = this,
						currentCategory = '';
					$.each(items, function (index, item) {
						let li;
						if (item.category !== currentCategory) {
							ul.append('<li class=\'ui-autocomplete__category\'>' + item.category + '</li>');
							currentCategory = item.category;
						}
						li = _this._renderItem(ul, item);
						if (item.category) {
							if (item.topic) {
								li.attr('aria-label', item.category + ' : ' + item.topic).children().addClass('ui-autocomplete__link_topic');
							}
							if (item.card) {
								li.attr('aria-label', item.category + ' : ' + item.card.name);
							}
						}
					});
				},
				_renderItem: function (ul, item) {
					let re = new RegExp('(?![^&;]+;)(?!<[^<>]*)(' + this.term.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi, '\\$1') + ')(?![^<>]*>)(?![^&;]+;)', 'gi');
					let $link = $('<a />', { class: 'ui-autocomplete__link' }).attr('href', item.id);
					
					if (item.topic) {
						let text = item.topic.replace(re, '<span class=\'ui-autocomplete__text-highlight\'>$1</span>');
						$link.append(text);
					}
					
					if (item.card) {
						let text = item.card.name.replace(re, '<span class=\'ui-autocomplete__text-highlight\'>$1</span>');
						let $imgContainer = $('<div />', { class: 'ui-autocomplete__img' });
						let $img = $('<img />').attr('src', item.card.img);
						let $text = $('<div />', { class: 'ui-autocomplete__text' }).append(text);
						
						$imgContainer.append($img);
						
						$link.append($imgContainer, $text);
					}
					
					return $('<li></li>').data('ui-autocomplete-item', item)
						.append($link)
						.appendTo(ul);
				}
			});
			
			$this.catcomplete({
				minLength: 2,
				open: function (event, ui) {
					$('.autocomplete-wrap__inner').addClass(css.active);
					if (linkAll) {
						$('.ui-autocomplete').append('<li class="ui-autocomplete__more"><a class="ui-autocomplete__more-link" href="' + linkAll + '" data-hover="' + $this.attr('data-view-all-text') + '"><span>' + $this.attr('data-view-all-text') + '</span></a></li>'); //See all results
					}
					$('.ui-autocomplete').perfectScrollbar({
						wheelPropagation: true,
						swipePropagation: true,
						swipeEasing: false
					});
					$('.ui-autocomplete').perfectScrollbar('update');
				},
				close: function () {
					$('.autocomplete-wrap__inner').removeClass(css.active);
				},
				source: function (request, response) {
					$.ajax({
						url: $this.attr('data-search-autocomplete-url'),
						dataType: 'json',
						data: { query: request.term },
						success: function (data) {
							if (data.length === 0) {
								linkAll = false;
								$this.siblings('.autocomplete-wrap').find('.ui-autocomplete').css({ display: 'none' });
								$this.siblings('.header__form-search-empty').addClass(css.active);
							} else {
								linkAll = data[0].all;
								$this.siblings('.header__form-search-empty').removeClass(css.active);
								response($.map(data, function (item) {
									return {
										id: item.href || false,
										category: item.category || false,
										topic: item.topic || false,
										card: item.card || false,
										all: item.all || false
									};
								}));
							}
						}
					});
				},
				appendTo: $this.siblings('.autocomplete-wrap').children()
			});
		});
	}
}
