'use strict';

var tools = {
	init: function(params) {

		this.client();

		if (params == undefined) return;

		params.forEach(function(item) {
			try {tools[item]()} catch(err) {console.error('Error in "' + item + '".')}
		});
		
	},
	client: function() {
		
		window.client = {
			get: function() {
				this.document = $(document);
				this.windowW = $(window).width();
				this.windowH = $(window).height();
				this.isMobile = this.windowW <= 1200;
				this.scrollW = this.getScrollWidth();
			},
			getScrollWidth: function() {
				var outer = document.createElement("div"); outer.style.visibility = "hidden"; outer.style.width = "100px"; outer.style.msOverflowStyle = "scrollbar";
				document.body.appendChild(outer);
				var widthNoScroll = outer.offsetWidth;
				outer.style.overflow = "scroll";
				var inner = document.createElement("div");
				inner.style.width = "100%";
				outer.appendChild(inner);        
				var widthWithScroll = inner.offsetWidth;
				outer.parentNode.removeChild(outer);
				return widthNoScroll - widthWithScroll;
			}
		};

		client.get();

		$(window).on('resize', function() {
			client.get();
		});
	},
	backgrounds: function() {

		$("[data-bg-src]").each(function() {
			var block = $(this);

			var src = block.attr('data-bg-src');
			var size = block.attr('data-bg-size') || "auto";
			var pos = block.attr('data-bg-pos') || "auto";
			var repeat = "no-repeat";

			block.css({
				'background-image': 'url('+ src +')',
				'background-size': size,
				'background-position': pos,
				'background-repeat': repeat
			});
		});
	},

	page: function() {
		return $("[data-page]").data("page");
	},

	scrollTo: function(obj) {
		/*$("body").animate({
	        scrollTop: obj.offset().top - 110
	    }, 500);*/

	    // Mozilla fix
	    $('body,html').stop(true,true).animate({scrollTop: obj.offset().top - 110}, 500);
	}
};