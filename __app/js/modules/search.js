import { fetchEvents, renderEvents, baseUrl, renderEventDetails } from './events.js';
import { clientID } from '../env.js';

export default function searchEvent() {
  const searchButton = document.getElementById('event-search__button');
  const cityInput = document.getElementById('event-search__location');
  const resultsContainer = document.getElementById('results-container');
  const loadingSpinner = document.getElementById('loading-spinner');
  const totalEvents = document.getElementById('total-events');

  if (searchButton && cityInput && resultsContainer && loadingSpinner && totalEvents) {
    loadingSpinner.classList.add('hidden');
    searchButton.addEventListener('click', async function () {
      const city = cityInput.value.trim();

      try {
        if (!city) {
          throw new Error('Please enter a valid city name');
        }

        // Hide the spinner and reset the total events
        loadingSpinner.classList.add('hidden');
        totalEvents.textContent = '';

        // Show the spinner again
        loadingSpinner.classList.remove('hidden');

        const events = await fetchEvents(city);
        if (events.length === 0) {
          resultsContainer.innerHTML = 'No events found for this city.';
          totalEvents.textContent = '';
          return;
        }

        const resultsHTML = await renderEvents(events);
        resultsContainer.innerHTML = resultsHTML;

        totalEvents.textContent = `Total Events: ${events.length}`;

        const eventButtons = document.querySelectorAll('.result-container__moreinfo-button');
        eventButtons.forEach((button) => {
          button.addEventListener('click', async (event) => { 
            const eventId = event.target.dataset.id;
            const eventDetails = await fetchEventDetails(eventId);
            renderEventDetails(eventDetails);
            window.location.href = `../event-details.html?id=${eventId}`;
          });
        });
      } catch (error) {
        resultsContainer.innerHTML =
          `An error occurred: ${error.message}. Please try again later.`;
        console.error(error);
      } finally {
        // Hide the spinner
        loadingSpinner.classList.add('hidden');
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
