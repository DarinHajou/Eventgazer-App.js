import searchEvent from './modules/search.js';

searchEvent();

export function displayEventModal(event) {
	const modalContainer = document.getElementById("modal-container");
	const modalContent = document.getElementById("modal-content");
	const closeButton = document.getElementById("close-button");
	const modalEventName = document.getElementById("modal-event-name");
	const modalEventDescription = document.getElementById(
	  "modal-event-description"
	);
	const modalEventDates = document.getElementById("modal-event-dates");
	const modalEventLocation = document.getElementById("modal-event-location");
 
	modalEventName.textContent = event.name;
	modalEventDescription.textContent = event.description;
	modalEventDates.textContent = `Dates: ${event.dates.start.localDate}`;
	modalEventLocation.textContent = `Location: ${event._embedded.venues[0].name}`;
 
	modalContainer.style.display = "block";
 
	closeButton.addEventListener('click', () => {
		modalContainer.style.display = "none";
	 });
}