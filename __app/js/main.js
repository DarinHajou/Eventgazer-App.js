import searchEvent from './modules/search.js';
import { baseUrl } from './modules/events.js';
import { clientID } from './env.js';
import { fetchEventDetails } from './modules/events.js';
import { fetchImage } from './modules/events.js';


searchEvent();


 export async function fetchEventDetailsPage(eventId) {
  const endpoint = `${baseUrl}discovery/v2/events/${eventId}.json?apikey=${clientID}&include=dates`;

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
   const eventName = document.getElementById('event-name');
   const eventDate = document.getElementById('event-date');
   const eventTime = document.getElementById('event-time');
   const eventVenue = document.getElementById('event-venue');
   const eventPriceRanges = document.getElementById('event-price-ranges');
   const eventDescription = document.getElementById('event-description');
   const eventImage = document.getElementById('event-image');
   
 
   if (!eventDetails) {
     eventName.textContent = 'No event details available';
     return;
   }
 
   eventName.textContent = eventDetails.name;
   eventDate.textContent = eventDetails.dates.start.localDate;
   console.log(eventDetails.dates.end);
   console.log(eventDetails)
   eventTime.textContent = `Start time: ${eventDetails.dates.start.localTime} - Local Time`;
   eventVenue.textContent = eventDetails._embedded?.venues?.[0]?.name;
   eventPriceRanges.textContent = `Price Range: ${eventDetails.priceRanges ? eventDetails.priceRanges[0].min + " - " + eventDetails.priceRanges[0].max + " " + eventDetails.priceRanges[0].currency : "Not available"}`;
   eventDescription.textContent = eventDetails.info || 'No information available.';
 
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
 