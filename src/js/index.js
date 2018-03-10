'use strict';

/**
 * App entry point.
 *
 * @module App
 */

import 'babel-polyfill';

/** Import initialized-by-default modules/libs */
import './components/common';
import './components/publicAPI';

/** Import page controllers */
import Home from './pages/home';
import AboutProject from './pages/about-project';
import About from './pages/about';

/** Import utils */
import { currentPage } from './modules/dev/helpers';

/**
 * Run appropriate scripts for each page.
 **/
switch (currentPage) {
  /** Home page */
  case 'home': new Home; break;
	
	/** About page */
  case 'about': new About; break;
  
  /** About Project page */
  case 'one-project': new AboutProject; break;

  /** No page found */
  default: console.warn('Undefined page');
}
