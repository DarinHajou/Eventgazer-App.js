export default function eventSearch() { 
	
	const searchButton = document.getElementById('search-button');
	const cityInput = document.getElementById('location');
	const resultsContainer = document.getElementById('results-container');
	
	searchButton.addEventListener('click', async function () {
		resultsContainer.innerHTML ="loading...";
	
	});
};

