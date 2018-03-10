import {
	$body,
	Resp
} from '../modules/dev/helpers';

export class NoTouch {
	constructor() {
		NoTouch.init();
	}

	static init() {
		if (Resp.isDesk) {
			$body.addClass('no-touch');
		}
	}

}

export default new NoTouch();
