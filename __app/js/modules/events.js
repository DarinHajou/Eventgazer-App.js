const clientID = 'TbrR0cz7CJFLfvehoWUIGUpVwO4JNreb';
const baseUrl = 'https://app.ticketmaster.com/';

export async function fetchEvents(city) {
  const endpoint = `${baseUrl}discovery/v2/events.json?apikey=${clientID}&city=${city}&size=50`;
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

async function fetchImage(eventId) {
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

export async function renderEvents(events) {
  let resultsHTML = '';

  for (const event of events) {
    const eventId = event.id;
    const { imageUrl, altDescription } = await fetchImage(eventId);
    resultsHTML += `
      <div class="event"> 
        <h2 class="event__name">${event.name}</h2> 
        <p>${event.dates.start.localDate}</p> 
        <p>${event.dates.start.localTime}</p> 
        <p>${event._embedded?.venues?.[0]?.city?.name}</p> 
        <img src="${imageUrl}" alt="${altDescription}" class="event-image"> 
        <a href="/event-details.html?id=${eventId}" target="_blank" class="event__button">More info</a>
      </div>`;
  }

  return resultsHTML;
}

