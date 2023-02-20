import { fetchEvents, renderEvents } from './events.js';

export default function searchEvent() {
  const searchButton = document.getElementById('search-button');
  const cityInput = document.getElementById('location');
  const resultsContainer = document.getElementById('results-container');

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
    } catch (error) {
      resultsContainer.innerHTML =
        'An error occurred, please try again later.';
      console.error(error);
    }
  });
}
