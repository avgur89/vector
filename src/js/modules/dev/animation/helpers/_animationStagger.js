export const ANIMATION_STAGGER = (args) => {
	new TimelineMax()
		.staggerTo(args.elements, args.duration, {
			y: args.y || 0,
			x: args.x || 0,
			opacity: args.opacity || 1,
			ease: args.ease
		}, args.delay)
		.eventCallback('onComplete', args.onComplete, null);
};
