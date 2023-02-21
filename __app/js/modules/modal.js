function openModal(event) {
	const modal = document.getElementById('myModal');
	const modalName = document.getElementById('modal-name');
	const modalDate = document.getElementById('modal-date');
	const modalTime = document.getElementById('modal-time');
	const modalVenue = document.getElementById('modal-venue');
	const modalDescription = document.getElementById('modal-description');
	const closeButton = document.getElementsByClassName('close')[0];
	const moreInfoButton = document.getElementById('modal-more-info');
 
	modalName.textContent = event.name;
	modalDate.textContent = event.dates.start.localDate;
	modalTime.textContent = event.dates.start.localTime;
	modalVenue.textContent = event._embedded?.venues?.[0]?.name;
	modalDescription.textContent = event.info;
 
	moreInfoButton.addEventListener('click', function () {
	  window.location.href = `event-details.html?eventId=${event.id}`;
	});
 
	modal.style.display = 'block';
 
	closeButton.addEventListener('click', function () {
	  modal.style.display = 'none';
	});
 
	window.addEventListener('click', function (event) {
	  if (event.target == modal) {
		 modal.style.display = 'none';
	  }
	});
 }
 
