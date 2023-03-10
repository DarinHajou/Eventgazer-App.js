 export default function renderMap(Longitude, Latitude) {
    
    mapboxgl.accessToken = 'pk.eyJ1IjoiY29kZXRlZ3JpdHkiLCJhIjoiY2xld2p0ZnBnMGhnbzNzbzRxaTltZHUwcyJ9.ztTEqEq4WeTRyV68oE3wMg';
    const map = new mapboxgl.Map({  
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [Longitude, Latitude],
      zoom: 12
    });
    
    const marker = new mapboxgl.Marker()
      .setLngLat([Longitude, Latitude])
      .addTo(map);
  }
   
  
