import { fetchEvents, renderEvents, baseUrl, renderEventDetails } from './events.js';
// import { fetchEventDetails } from '.fetchEvents.js'; 
import { clientID } from '../env.js';


// Get references to HTML elements
export default function searchEvent() {
  const searchForm = document.querySelector('.event-search__form');
  const cityInput = document.getElementById('event-search__location');
  const resultsContainer = document.getElementById('results-container');
  const loadingSpinner = document.getElementById('loading-spinner');
  const totalEvents = document.getElementById('total-events');

  if (searchForm && cityInput && resultsContainer && loadingSpinner && totalEvents) {
    loadingSpinner.classList.add('hidden');
    searchForm.addEventListener('submit', async function (event) {
      event.preventDefault(); // prevent the form from submitting and reloading the page

      const city = cityInput.value.trim();
      
      try {
        if (!city) {
          throw new Error('Please enter a valid city name');
        }

        // Add hidden class to the results container
        resultsContainer.classList.add('hidden');
        resultsContainer.innerHTML = '';
        loadingSpinner.classList.remove('hidden');
        totalEvents.textContent = '';
        
        const events = await fetchEvents(city);
        if (events.length === 0) {
          resultsContainer.innerHTML = 'No events found for this city.';
          totalEvents.textContent = '';
          return;
        }
        
        renderEvents(events).then(() => {
          const resultsHTML = resultsContainer.innerHTML;
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

          // Remove the hidden class from the results container
          resultsContainer.classList.remove('hidden');
        });
        
      } catch (error) {
        resultsContainer.innerHTML =
        `An error occurred: ${error.message}`;
        console.error(error);
        resultsContainer.classList.add('hidden');
      } finally {
        loadingSpinner.classList.add('hidden');
      }
    });
  }
}


// This function fetches event details using the provided event ID and returns the data in JSON format. If an error occurs, it throws an error with a message.
export async function fetchEventDetails(eventId) {
  const endpoint = `${baseUrl}discovery/v2/events/${eventId}.json?apikey=${clientID}`;
  const response = await fetch(endpoint);
  
  if (!response.ok) {
    throw new Error('Unable to fetch event details.');
  }
  
  const data = await response.json();
  return data;
}