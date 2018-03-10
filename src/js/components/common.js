import objectFitImages from 'object-fit-images';
import '../modules/dep/jquery-ui.min';
import HeaderAPI from './header';
import './noTouch';
import './preloader';
import './select';

/**
 * Website's common scripts.
 *
 * @module Common
 */
export class Common {
	constructor() {
		this.init();
	}
	
	init() {
		objectFitImages();
	}
}

export default new Common;
