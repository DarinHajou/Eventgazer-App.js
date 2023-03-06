  import searchEvent from './modules/search.js';
  import { baseUrl } from './modules/events.js';
  import { clientID } from './env.js';
  import { fetchEventDetails } from './modules/events.js';
  import { fetchImage } from './modules/events.js';


  searchEvent();

  export async function fetchEventDetailsPage(eventId) {
    const endpoint = `${baseUrl}discovery/v2/events/${eventId}.json?apikey=${clientID}`;

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
    const eventName = document.getElementById('event-details__name');
    const eventImage = document.getElementById('event-details__image');
    const eventDate = document.getElementById('event-details__date');
    const eventTime = document.getElementById('event-details__time');
    const eventVenue = document.getElementById('event-details__venue');
    const eventPriceRanges = document.getElementById('event-details__price-ranges');
    const eventDescription = document.getElementById('event-details__description');
    const eventTicketPrices = document.getElementById('event-ticket-prices');
    const eventSeatmap = document.getElementById('event-details__seatmap');

    if (!eventDetails) {
      eventName.textContent = 'No event details available';
      return;
    }

    mapboxgl.accessToken = 'pk.eyJ1IjoiY29kZXRlZ3JpdHkiLCJhIjoiY2xld2p0ZnBnMGhnbzNzbzRxaTltZHUwcyJ9.ztTEqEq4WeTRyV68oE3wMg';

    const longitude = eventDetails._embedded?.venues?.[0]?.location?.longitude;
    const latitude = eventDetails._embedded?.venues?.[0]?.location?.latitude;

  const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [longitude, latitude],
  zoom: 12
});

 // Create a new marker
  const marker = new mapboxgl.Marker()
    .setLngLat([longitude, latitude])
    .addTo(map);
    

    eventName.textContent = eventDetails.name;
    eventDate.innerHTML = `<b> Date: </b> ${eventDetails.dates.start.localDate}`;
    eventTime.innerHTML = `<b>Start time: </b> ${eventDetails.dates.start.localTime} - Local Time`;
    eventVenue.innerHTML = `<b>Venue:</b> ${eventDetails._embedded?.venues?.[0]?.name ? ' ' + eventDetails._embedded.venues[0].name : 'Not available'}`;
    eventPriceRanges.innerHTML = `<b>Price Range:</b> ${eventDetails.priceRanges ? eventDetails.priceRanges[0].min + " - " + eventDetails.priceRanges[0].max + " " + eventDetails.priceRanges[0].currency : "Not available"}`;
    eventDescription.textContent = eventDetails.info || 'No information available.';

    if (eventDetails.seatmap) {
      const seatmapImg = document.createElement('img');
      seatmapImg.setAttribute('src', eventDetails.seatmap.staticUrl);
      seatmapImg.setAttribute('alt', 'Seatmap');
      eventSeatmap.appendChild(seatmapImg);
    } else {
      eventSeatmap.textContent = 'Not available';
    }

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
