const eventDetailsImage = document.querySelector('.event-details-image');
eventDetailsImage.src = imageUrl;

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const eventId = urlParams.get('eventId');

if (!eventId) {
  // Display an error message or redirect to the home page.
  console.error('Event ID not found.');
}

const eventDetailsContainer = document.querySelector('.event-details-container');
const eventDetailsTitle = eventDetailsContainer.querySelector('.event-details-title');
const eventDetailsImage = eventDetailsContainer.querySelector('.event-details-image');
const eventDetailsDate = eventDetailsContainer.querySelector('.event-details-date');
const eventDetailsTime = eventDetailsContainer.querySelector('.event-details-time');
const eventDetailsLocation = eventDetailsContainer.querySelector('.event-details-location');

const clientID = 'TbrR0cz7CJFLfvehoWUIGUpVwO4JNreb';
const baseUrl = 'https://app.ticketmaster.com/';

const endpoint = `${baseUrl}discovery/v2/events/${eventId}.json?apikey=${clientID}`;
fetch(endpoint)
  .then(response => {
    if (!response.ok) {
      throw new Error('Unable to fetch event details.');
    }
    return response.json();
  })
  .then(data => {
    eventDetailsTitle.textContent = data.name;
    eventDetailsDate.textContent = data.dates.start.localDate;
    eventDetailsTime.textContent = data.dates.start.localTime;
    eventDetailsLocation.textContent = data._embedded?.venues?.[0]?.name;

    const imageEndpoint = `${baseUrl}discovery/v2/events/${eventId}/images.json?apikey=${clientID}`;
    fetch(imageEndpoint)
      .then(response => {
        if (!response.ok) {
          throw new Error('Unable to fetch image.');
        }
        return response.json();
      })
      .then(data => {
        if (data.images.length > 0) {
          eventDetailsImage.src = data.images[0].url;
          eventDetailsImage.alt = data.images[0].alt;
        } else {
          eventDetailsImage.alt = 'No image available';
        }
      })
      .catch(error => {
        console.error(error);
      });
  })
  .catch(error => {
    console.error(error);
  });