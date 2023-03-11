import searchEvent from './modules/eventSearch.js';
import { fetchEvents } from './modules/fetchEvents.js';
import { baseUrl } from './modules/fetchEvents.js';
import { clientID } from './env.js';
import { fetchEventDetails } from './modules/fetchEvents.js';
import renderMap from './modules/mapbox.js';

// import { fetchEventDetails } from './modules/events.js';
// import { fetchImage } from './modules/events.js';


searchEvent();

