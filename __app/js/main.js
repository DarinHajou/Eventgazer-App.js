import searchEvent from './modules/search.js';
import search from './modules/search.js';
import { baseUrl } from './modules/events.js';
import { clientID } from './modules/events.js';


searchEvent();
search();

export function displayEventModal(event) {
	const modalContainer = document.getElementById("modal-container");
	const modalContent = document.getElementById("modal-content");
	const closeButton = document.getElementById("close-button");
	const modalEventName = document.getElementById("modal-event-name");
	const modalEventDescription = document.getElementById(
	  "modal-event-description"
	);
	const modalEventDates = document.getElementById("modal-event-dates");
	const modalEventLocation = document.getElementById("modal-event-location");
 
	modalEventName.textContent = event.name;
	modalEventDescription.textContent = event.description;
	modalEventDates.textContent = `Dates: ${event.dates.start.localDate}`;
	modalEventLocation.textContent = `Location: ${event._embedded.venues[0].name}`;
 
	modalContainer.style.display = "block";
 
	closeButton.addEventListener('click', () => {
		modalContainer.style	.display = "none";
	 });
}




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
	const eventDescription = document.getElementById('event-description');
 
	if (!eventDetails) {
	  eventName.textContent = 'No event details available';
	  return;
	}
 
	eventName.textContent = eventDetails.name;
	eventDate.textContent = eventDetails.dates.start.localDate;
	eventTime.textContent = eventDetails.dates.start.localTime;
	eventVenue.textContent = eventDetails._embedded?.venues?.[0]?.name;
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
 