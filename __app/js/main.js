import searchEvent from './modules/search.js';
import { fetchEvents } from './modules/events.js';
import { baseUrl } from './modules/events.js';
import { clientID } from './env.js';
import { fetchEventDetails } from './modules/events.js';
import renderMap from './modules/mapbox.js';
import { renderEventDetailsPage } from './modules/renderEvents.js'


// import { fetchEventDetails } from './modules/events.js';
// import { fetchImage } from './modules/events.js';


searchEvent();