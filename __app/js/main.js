import searchEvent from './modules/search.js';
import search from './modules/search.js';
import { baseUrl } from './modules/events.js';
import { clientID } from './modules/events.js';


searchEvent();
search();

async function fetchEventDetails(eventId) {
	const endpoint = `${baseUrl}discovery/v2/events/${eventId}.json?apikey=${clientID}`;
	const response = await fetch(endpoint);
 
	if (!response.ok) {
	  throw new Error('Unable to fetch event details.');
	}
 
	const data = await response.json();
	return data;
 }
 
async function renderEventDetails(eventDetails) {
  const eventName = document.getElementById('event-name');
  const eventDate = document.getElementById('event-date');
  const eventTime = document.getElementById('event-time');
  const eventVenue = document.getElementById('event-venue');
  const eventPriceRanges = document.getElementById('event-price-ranges');
  const eventDescription = document.getElementById('event-description');

  if (!eventDetails) {
    eventName.textContent = 'No event details available';
    return;
  }

  eventName.textContent = eventDetails.name;
  eventDate.textContent = eventDetails.dates.start.localDate;
  eventTime.textContent = eventDetails.dates.start.localTime;
  eventVenue.textContent = eventDetails._embedded?.venues?.[0]?.name;
  eventPriceRanges.textContent = `Price Range: ${eventDetails.priceRanges ? eventDetails.priceRanges[0].min + " - " + eventDetails.priceRanges[0].max + " " + eventDetails.priceRanges[0].currency : "Not available"}`;
  eventDescription.textContent = eventDetails.info || 'No information available.';
}

 
 const urlParams = new URLSearchParams(window.location.search);
 const eventId = urlParams.get('id');
 
 if (eventId) {
	try {
	  const eventDetails = await fetchEventDetails(eventId);
	  renderEventDetails(eventDetails);
	} catch (error) {
	  console.error(error);
	}
 }
 