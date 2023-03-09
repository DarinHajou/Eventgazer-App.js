  import searchEvent from './modules/search.js';
  import { baseUrl } from './modules/events.js';
  import { clientID } from './env.js';
  import { fetchEventDetails } from './modules/events.js';
  import renderMap from './modules/mapbox.js';

  // import { fetchEventDetails } from './modules/events.js';
  // import { fetchImage } from './modules/events.js';


  searchEvent();
  

  export async function renderEventDetailsPage(eventDetails) {

    const eventName = document.getElementById('event-details__name');
    const eventImage = document.getElementById('event-details__image');
    const eventDate = document.getElementById('event-details__date');
    const eventTime = document.getElementById('event-details__time');
    const eventVenue = document.getElementById('event-details__venue');
    const eventPriceRanges = document.getElementById('event-details__price-ranges');
    const eventDescription = document.getElementById('event-details__description');
    const eventSeatmap = document.getElementById('event-details__seatmap');
    const buyTicketButton = document.getElementById('event-details__buy-button');
    const eventAccessibility = document.getElementById('event-details__accessibility');
    const eventSchedule = document.getElementById('event-details__schedule');
  
    if (eventDetails._embedded && eventDetails._embedded.events) {
      const events = eventDetails._embedded.events;
      events.forEach(event => {
        const startTime = event.dates.start.localTime;
        const endTime = event.dates.end.localTime;
        const eventName = event.name;
        const eventItem = document.createElement('li');
        eventItem.textContent = `${startTime} - ${endTime}: ${eventName}`;
        eventSchedule.appendChild(eventItem);
        console.log(typeof eventDetails._embedded?.attractions[0]?.eventSchedule?.dateTBA);
      });
    } else {
      eventSchedule.textContent = 'No schedule information available.';
    }
  
    buyTicketButton.addEventListener('click', () => {
      const eventUrl = eventDetails.url;
      window.open(eventUrl, '_blank');
    });
  
    if (!eventDetails) {
      eventName.textContent = 'No event details available';
      return;
    }
  
  /*   mapboxgl.accessToken = 'pk.eyJ1IjoiY29kZXRlZ3JpdHkiLCJhIjoiY2xld2p0ZnBnMGhnbzNzbzRxaTltZHUwcyJ9.ztTEqEq4WeTRyV68oE3wMg';
  
    const longitude = eventDetails._embedded?.venues?.[0]?.location?.longitude;
    const latitude = eventDetails._embedded?.venues?.[0]?.location?.latitude;
  
    const map = new mapboxgl.Map({  
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [longitude, latitude],
      zoom: 12
    });
  
    const marker = new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map); */

      const accessibilityInfo = eventDetails.accessibility;
      const accessibilityText = `Accessible seating: ${accessibilityInfo?.info?.accessibleSeating || 'Not available'}. Accessible entrance: ${accessibilityInfo?.info?.accessibleEntrance || 'Not available'}. `;
      eventAccessibility.style.fontWeight = 'normal';
      eventAccessibility.textContent = accessibilityText;
      
    
    eventName.textContent = eventDetails.name;
    eventDate.innerHTML = `<b> Date: </b> ${eventDetails.dates.start.localDate}`;
    eventTime.innerHTML = `<b>Start time: </b> ${eventDetails.dates.start.localTime} - Local Time`;
    eventVenue.innerHTML = `<b>Venue:</b> ${eventDetails._embedded?.venues?.[0]?.name ? ' ' + eventDetails._embedded.venues[0].name : 'Not available'}`;
    eventPriceRanges.innerHTML = `<b>Price Range:</b> ${eventDetails.priceRanges ? eventDetails.priceRanges[0].min + " - " + eventDetails.priceRanges[0].max + " " + eventDetails.priceRanges[0].currency : "Not available"}`;
    eventDescription.textContent = eventDetails.info || 'No information available.';
    eventAccessibility.style.fontWeight = 'normal';
    eventAccessibility.textContent = eventDetails.accessibility ? eventDetails.accessibility.info : 'No accessibility information available';

      if (eventDetails.accessibility && eventDetails.accessibility.info) {
    const accessibilityInfo = eventDetails.accessibility.info;
    const accessibleSeating = accessibilityInfo.accessibleSeating ? `Accessible seating: ${accessibilityInfo.accessibleSeating}. ` : '';
    const accessibleEntrance = accessibilityInfo.accessibleEntrance ? `Accessible entrance: ${accessibilityInfo.accessibleEntrance}.` : '';
    const accessibilityText = accessibleSeating + accessibleEntrance;
    eventAccessibility.textContent = accessibilityText;
  } else {
    eventAccessibility.textContent = 'No accessibility information available';
  }

    

    if (eventDetails.seatmap) {
      const seatmapImg = document.createElement('img');
      seatmapImg.setAttribute('src', eventDetails.seatmap.staticUrl);
      seatmapImg.setAttribute('alt', 'Seatmap');
      eventSeatmap.appendChild(seatmapImg);
    } else {
      eventSeatmap.textContent = 'Not available';
    }

    const longitude = eventDetails._embedded?.venues?.[0]?.location?.longitude;
    const latitude = eventDetails._embedded?.venues?.[0]?.location?.latitude;
      renderMap(longitude, latitude);

    try {
      // const { imageUrl, altDescription } = await fetchImage(eventDetails.id);
      eventImage.src = eventDetails.images[0].url;
      eventImage.alt = eventDetails.name;
    } catch (error) {
      console.error(error);
    }
  }

  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('id');

  if (eventId) {
    try {
      const eventDetails = await fetchEventDetails(eventId);
      renderEventDetailsPage(eventDetails);
    } catch (error) {
      console.error(error);
    }
  }


