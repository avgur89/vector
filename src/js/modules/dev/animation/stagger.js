import { TimelineMax } from 'gsap';
import SCROLL_TRIGGER_ANIMATIONS from './helpers/_scrollTriggerAnimations';
import { Resp } from '../helpers';
import '../../dep/DrawSVGPlugin';
import 'script-loader!gsap/CSSRulePlugin';

class Stagger {
	constructor() {
		this.$container = $('[data-anim="group"]');
        this.$faqSvg    = $('.faq__item__img .icon');
        this.$faqCircle    = $('.faq__item__img .circle');
        this.$faqLine   = $('.faq .line');
        this.$faqText   = $('.faq__item__text');
        this.$footerBtn   = $('.footer__top');
	}

	init() {
		if (Resp.isDesk && this.$faqSvg.length) {
			this.createAnim();
            this.createAnimFaq();
		}
	}
	createAnimFaq() {
		let tl = new TimelineMax({ paused: true });
        tl.staggerFrom(this.$faqSvg, 0.5, {
           y: -40,
           autoAlpha: 0,
           ease: Power4.easeOut
        }, 0.75, 'start+=0.25');
        tl.staggerFromTo(this.$faqCircle, 0.75, {
            drawSVG:"0",
			ease: Power2.easeIn
        },
         {
            drawSVG:"0 100%"
         },
			0.75, 'start');
        tl.staggerFrom(this.$faqLine, 0.75, {
            scaleX: 0,
            ease: Power4.easeOut
        }, 0.75, 'start+=0.5');
        tl.staggerFrom(this.$faqText, 0.5, {
            y: 100,
            autoAlpha: 0
        }, 0.75, 'start+=0.5');
        new SCROLL_TRIGGER_ANIMATIONS({
           container: '.faq',
           triggerHook: 0.85,
           onStart: () => {
           setTimeout(() => {
           	tl.play();
        }, 1000);
        }
        });
	}

	createAnim() {
		this.$container.each((index, container) => {
			let $el;
			let delay = $(container).data('anim-delay') ? $(container).data('anim-delay') * 1000 : false;
			let triggerHook = $(container).data('anim-trigger-hook') || 0.85;

			// check self animation
			if ($(container).data('anim-stagger')) {
				$el = $(container).find('[data-anim-stagger]').andSelf();
				createAnim(container, $el);
			} else if ($(container).data('anim-each')) {
				$el = $(container).addClass('has-anim').children();
				$el.each(function () {
					$(this).attr('data-anim-stagger', $(container).data('anim-each'));
					createAnim(this, $(this));
				});
			} else {
				$el = $(container).find('[data-anim-stagger]');
				createAnim(container, $el);
			}

			function createAnim(container = container, el = $el) {
				let tl = new TimelineMax({ paused: true });
				tl.staggerTo(el, 0.75, {
					y: 0,
					x: 0,
					alpha: 1,
					ease: Power4.easeOut
				}, 0.15);

				new SCROLL_TRIGGER_ANIMATIONS({
					container: container,
					triggerHook: triggerHook,
					onStart: () => {
						setTimeout(() => {
							tl.play();
						}, delay);
					}
				});
			}
		});
	}

}

export const AnimStagger = new Stagger();

window.reinitStagger = reinitStagger;

function reinitStagger() {
	let reAnimStagger = new Stagger();
	
	reAnimStagger.init();
}
