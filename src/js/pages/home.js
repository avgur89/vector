/**
 * Home page scripts.
 *
 * @module Home
 */

import Map from '../components/map';
import Main01 from './sections/01-main';
import Main03 from './sections/03-catalog';

/** Import sections scripts */

export default class Home {
	constructor() {
		Home.init();
	}
  /**
   * Initialize Main page scripts.
   *
   * @static
   */
  static init() {
  	let svgMap = new Map('#map');
  	svgMap.init();
  	
	  Main01.init();
	  if ($('#brands').length) {
		  Main03.init();
	  }
  }
}
