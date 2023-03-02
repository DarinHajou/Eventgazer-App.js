  import { fetchEvents, renderEvents, baseUrl, renderEventDetails } from './events.js';
  import { clientID } from '../env.js';


  export default function searchEvent() {
    const searchButton = document.getElementById('search-button');
    const cityInput = document.getElementById('location');
    const resultsContainer = document.getElementById('results-container');
  
    if (searchButton && cityInput && resultsContainer) {
      searchButton.addEventListener('click', async function () {
        resultsContainer.innerHTML = 'Loading...';
        const city = cityInput.value;
  
        try {
          if (!city) {
            throw new Error('Please enter a valid city name');
          }
  
          const events = await fetchEvents(city);
          if (events.length === 0) {
            resultsContainer.innerHTML = 'No events found for this city.';
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
              window.location.href = `../event-details.html?id=${eventId}`;
            });
          });
        } catch (error) {
          resultsContainer.innerHTML =
            `An error occurred: ${error.message}. Please try again later.`;
          console.error(error);
        }
      });
    }
  }


  export async function fetchEventDetails(eventId) {
    // const endpoint = `${baseUrl}discovery/v2/events/${eventId}.json?apikey=${clientID}`;
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error('Unable to fetch event details.');
    }

    const data = await response.json();
    return data;
  }

