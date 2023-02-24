import { fetchEvents, renderEvents, baseUrl, clientID } from './events.js';

export default function searchEvent() {
  const searchButton = document.getElementById('search-button');
  const cityInput = document.getElementById('location');
  const resultsContainer = document.getElementById('results-container');

  if (searchButton && cityInput && resultsContainer) {
    searchButton.addEventListener('click', async function () {
      resultsContainer.innerHTML = 'Loading...';
      const city = cityInput.value;

      try {
        const events = await fetchEvents(city);
        if (events.length === 0) {
          resultsContainer.innerHTML = 'No events found.';
          return;
        }

        const resultsHTML = await renderEvents(events);
        resultsContainer.innerHTML = resultsHTML;

        const eventButtons = document.querySelectorAll('.event__button');
        eventButtons.forEach((button) => {
          button.addEventListener('click', async (event) => {
            const eventId = event.target.dataset.id;
            const eventDetails = await fetchEventDetails(eventId);
            renderEventDetails(eventDetails);
            window.location.href = `/event-details.html?id=${eventId}`;
          });
        });
      } catch (error) {
        resultsContainer.innerHTML =
          'An error occurred, please try again later.';
        console.error(error);
      }
    });
  }
}

export async function fetchEventDetails(eventId) {
  const endpoint = `${baseUrl}discovery/v2/events/${eventId}.json?apikey=${clientID}`;
  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error('Unable to fetch event details.');
  }

  const data = await response.json();
  return data;
}

export async function renderEventDetails(eventDetails) {
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