import searchEvent from './modules/search.js';
import { baseUrl } from './modules/events.js';
import { clientID } from './env.js';
import { fetchEventDetails } from './modules/events.js';
import { fetchImage } from './modules/events.js';


searchEvent();


 export async function fetchEventDetailsPage(eventId) {
  const endpoint = `${baseUrl}discovery/v2/events/${eventId}.json?apikey=${clientID}`;

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error('Unable to fetch event details.');
  }

  const eventDetails = await response.json();
  const { imageUrl, altDescription } = await fetchImage(eventId);
  await renderEventDetailsPage(eventDetails, imageUrl, altDescription);

  return eventDetails;
}
 

export async function renderEventDetailsPage(eventDetails) {
  const eventName = document.getElementById('event-details__name');
  const eventImage = document.getElementById('event-details__image');
  const eventDate = document.getElementById('event-details__date');
  const eventTime = document.getElementById('event-details__time');
  const eventVenue = document.getElementById('event-details__venue');
  const eventPriceRanges = document.getElementById('event-details__price-ranges');
  const eventDescription = document.getElementById('event-details__description');
  const eventTicketPrices = document.getElementById('event-ticket-prices');
  const eventSeatmap = document.getElementById('event-details__seatmap');

  if (!eventDetails) {
    eventName.textContent = 'No event details available';
    return;
  }

  eventName.textContent = eventDetails.name;
  eventDate.textContent = eventDetails.dates.start.localDate;
  eventTime.textContent = `Start time: ${eventDetails.dates.start.localTime} - Local Time`;
  eventVenue.textContent = eventDetails._embedded?.venues?.[0]?.name;
  eventPriceRanges.textContent = `Price Range: ${eventDetails.priceRanges ? eventDetails.priceRanges[0].min + " - " + eventDetails.priceRanges[0].max + " " + eventDetails.priceRanges[0].currency : "Not available"}`;
  eventDescription.textContent = eventDetails.info || 'No information available.';
  
  if (eventDetails.seatmap) {
    const seatmapImg = document.createElement('img');
    seatmapImg.setAttribute('src', eventDetails.seatmap.staticUrl);
    seatmapImg.setAttribute('alt', 'Seatmap');
    eventSeatmap.appendChild(seatmapImg);
  } else {
    eventSeatmap.textContent = 'Not available';
  }

  try {
    const { imageUrl, altDescription } = await fetchImage(eventDetails.id);
    eventImage.src = imageUrl;
    eventImage.alt = altDescription;
  } catch (error) {
    console.error(error);
  }
}


 
 const urlParams = new URLSearchParams(window.location.search);
 const eventId = urlParams.get('id');
 
 if (eventId) {
	try {
	  const eventDetails = await fetchEventDetailsPage(eventId);
	  renderEventDetailsPage(eventDetails);
	} catch (error) {
	  console.error(error);
	}
 } 
 