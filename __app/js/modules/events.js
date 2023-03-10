import { clientID } from '../env.js';
export const baseUrl = 'https://app.ticketmaster.com/';


export async function fetchEvents(city) {
  const queryParams = new URLSearchParams({
    apikey: clientID,
    city: city,
    size: 200,
    sort: 'date,asc'
  });

  const endpoint = `${baseUrl}discovery/v2/events.json?${queryParams.toString()}`;
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error('Unable to fetch events.');
  }

  const data = await response.json();

  if (data._embedded?.events?.length > 0) {
    const events = data._embedded.events.map(event => {
      const imageUrl = event.images?.[0]?.url || '';
      const altDescription = event.images?.[0]?.alt || 'No image available';
      return { ...event, imageUrl, altDescription };
    });
    return events;
  } else {
    throw new Error('No events found.');
  }
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
      console.log(eventDetails);
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
  // eventTime.textContent = eventDetails.dates.start.localTime;
  eventVenue.textContent = eventDetails._embedded?.venues?.[0]?.name;
  eventDescription.textContent = eventDetails.info || 'No information available.';
  
  eventImage.setAttribute('src', imageUrl);
  eventImage.setAttribute('alt', altDescription);
}

export async function renderEvents(events) {
  const resultsContainer = document.getElementById('results-container');
  resultsContainer.innerHTML = '';

  for (const event of events) {
    const eventId = event.id;
    const imageUrl = event.images?.[0]?.url || '';
    const altDescription = event.images?.[0]?.alt || 'No image available';
    
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('results-container__cards');
    
    const eventNameH2 = document.createElement('h2');
    eventNameH2.classList.add('results-container__event-name');
    eventNameH2.textContent = event.name;
    cardDiv.appendChild(eventNameH2);
    
    const dateP = document.createElement('p');
    dateP.textContent = event.dates.start.localDate;
    cardDiv.appendChild(dateP);
    
    const cityP = document.createElement('p');
    cityP.textContent = event._embedded?.venues?.[0]?.city?.name || 'Not available';
    cardDiv.appendChild(cityP);
    
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = altDescription;
    img.classList.add('results-container__image');
    cardDiv.appendChild(img);
    
    const moreInfoButton = document.createElement('button');
    moreInfoButton.dataset.id = eventId;
    moreInfoButton.classList.add('result-container__moreinfo-button');
    moreInfoButton.textContent = 'More info & Buy Tickets';
    cardDiv.appendChild(moreInfoButton);

    resultsContainer.appendChild(cardDiv);
  }
}
