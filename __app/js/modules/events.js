import { clientID } from '../env.js';
export const baseUrl = 'https://app.ticketmaster.com/';

export async function fetchEvents(city) {
  const endpoint = `${baseUrl}discovery/v2/events.json?apikey=${clientID}&city=${city}&size=10`;
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error('Unable to fetch events.');
  }

  const data = await response.json();

  if (data._embedded && data._embedded.events && data._embedded.events.length > 0) {
    return data._embedded.events;
  } else {
    throw new Error('No events found.');
  }
}

export async function fetchImage(eventId) {
  const endpoint = `${baseUrl}discovery/v2/events/${eventId}/images.json?apikey=${clientID}`;
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error('Unable to fetch image.');
  }

  const data = await response.json();

  if (data.images.length === 0) {
    return { imageUrl: '', altDescription: 'No image available' };
  }

  return { imageUrl: data.images[0].url, altDescription: data.images[0].alt };
}

export async function fetchEventDetails(eventId) {
  const endpoint = `${baseUrl}discovery/v2/events/${eventId}.json?apikey=${clientID}&include=dates`;
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error('Unable to fetch event details.');
  }

  const data = await response.json();

  if (data) {
    const priceRanges = data?.priceRanges?.map(priceRange => `${priceRange.min} - ${priceRange.max} ${priceRange.currency}`).join(', ');
    const eventDetails = { ...data, priceRanges };
    console.log(eventDetails)
    return eventDetails;
  } else {
    throw new Error('No event details found.');
  }
}


export async function renderEventDetails(eventDetails, imageUrl, altDescription) {
  const eventName = document.getElementById('event-results__name');
  const eventDate = document.getElementById('event-results__date');
  const eventTime = document.getElementById('event-results__time');
  const eventVenue = document.getElementById('event-results__venue');
  const eventDescription = document.getElementById('event-results__description');
  const eventImage = document.getElementById('event-results__image');
  
  if (!eventDetails) {
    eventName.textContent = 'No event details available';
    return;
  }
  
  eventName.textContent = eventDetails.name;
  eventDate.textContent = eventDetails.dates.start.localDate;
  eventTime.textContent = eventDetails.dates.start.localTime;
  eventVenue.textContent = eventDetails._embedded?.venues?.[0]?.name;
  eventDescription.textContent = eventDetails.info || 'No information available.';
  
  
  eventImage.setAttribute('src', imageUrl);
  eventImage.setAttribute('alt', altDescription);
}

 
export async function renderEvents(events) {
  let resultsHTML = '';

  for (const event of events) {
    const eventId = event.id;
    const { imageUrl, altDescription } = await fetchImage(eventId);
     resultsHTML += `
      <div class="results-container__cards"> 
        <h2 class="results-container__event-name">${event.name}</h2> 
        <p>${event.dates.start.localDate}</p> 
        <p>${event.dates.start.localTime}</p> 
        <p>${event._embedded?.venues?.[0]?.city?.name}</p> 
        <img src="${imageUrl}" alt="${altDescription}" class="results-container__image"> 
        <button data-id="${eventId}" class="result-container__moreinfo-button">More info</button>
      </div>`;
  }

  return resultsHTML;
}
