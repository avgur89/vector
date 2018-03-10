import 'select2/dist/js/select2.full';

class Select {
	constructor(el) {
		this.$el = $(el);
		
		this.init();
	}
	
	init() {
		this.$el.select2({
			dropdownCssClass: 'select-dropdown',
			minimumResultsForSearch: -1,
			allowClear: false,
			language: {
				noResults: function () {
					return 'не найдено';
				}
			},
			escapeMarkup: function (markup) {
				return markup;
			}
		})
			.on('select2:opening', function (e) {
				$(this).closest('.form-group').removeClass('has-error');
			})
			.on('select2:open', function (e) {
				// fix for custom scrollbar
				setTimeout(function () {
					$('.select2-results__options').perfectScrollbar({
						wheelPropagation: true,
						swipePropagation: true,
						swipeEasing: false
					});
					
					// fix for custom scrollbar
					$('.select2-results__options').scrollTop(1);
				}, 0);
			})
		;
	}
}

export default new Select('.js-select');
