// Google Maps Initialization
let map;

// Mock location - Industrial area in São Paulo
const mockLocation = {
  lat: -23.5505,
  lng: -46.6333
};

// Initialize Google Maps
function initMap() {
  try {
    // Create map instance
    map = new google.maps.Map(document.getElementById('map'), {
      center: mockLocation,
      zoom: 15,
      styles: [
        {
          "featureType": "all",
          "elementType": "geometry",
          "stylers": [{"color": "#f5f5f5"}]
        },
        {
          "featureType": "all",
          "elementType": "labels.text.fill",
          "stylers": [{"color": "#616161"}]
        },
        {
          "featureType": "all",
          "elementType": "labels.text.stroke",
          "stylers": [{"color": "#f5f5f5"}]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{"color": "#c9e7e9"}]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [{"color": "#e8f5e9"}]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [{"color": "#c8e6c9"}]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{"color": "#ffffff"}]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [{"color": "#e0e0e0"}]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{"color": "#d0d0d0"}]
        }
      ],
      mapTypeControl: false,
      fullscreenControl: true,
      streetViewControl: true,
      zoomControl: true,
      gestureHandling: 'cooperative'
    });

    // Add custom marker
    const marker = new google.maps.Marker({
      position: mockLocation,
      map: map,
      title: 'ReciclaMais - Centro de Reciclagem',
      animation: google.maps.Animation.DROP,
      icon: {
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
        fillColor: '#2E7D32',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
        scale: 2,
        anchor: new google.maps.Point(12, 24)
      }
    });

    // Add info window
    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="padding: 12px; max-width: 250px; font-family: 'Inter', sans-serif;">
          <h3 style="margin: 0 0 8px 0; color: #2E7D32; font-size: 16px; font-weight: 600;">
            ReciclaMais
          </h3>
          <p style="margin: 0 0 4px 0; color: #212121; font-size: 14px; line-height: 1.4;">
            <strong>Endereço:</strong><br>
            Rua das Indústrias Verdes, 1234<br>
            Distrito Industrial - São Paulo/SP
          </p>
          <p style="margin: 4px 0 0 0; color: #757575; font-size: 12px;">
            <strong>Horário:</strong> Seg-Sex 8h-18h, Sáb 8h-12h
          </p>
        </div>
      `
    });

    // Add click listener to marker
    marker.addListener('click', () => {
      infoWindow.open(map, marker);
    });

    // Hide loading placeholder
    const placeholder = document.querySelector('.contact__map-placeholder');
    if (placeholder) {
      placeholder.style.display = 'none';
    }

    // Add custom controls
    addCustomControls();

  } catch (error) {
    console.error('Error initializing Google Maps:', error);
    showMapError();
  }
}

// Add custom controls to the map
function addCustomControls() {
  // Add "Get Directions" button
  const directionsButton = document.createElement('button');
  directionsButton.textContent = 'Traçar Rota';
  directionsButton.style.cssText = `
    background-color: #2E7D32;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    margin: 10px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    transition: all 0.3s ease;
  `;

  directionsButton.addEventListener('mouseenter', () => {
    directionsButton.style.backgroundColor = '#1B5E20';
    directionsButton.style.transform = 'translateY(-1px)';
  });

  directionsButton.addEventListener('mouseleave', () => {
    directionsButton.style.backgroundColor = '#2E7D32';
    directionsButton.style.transform = 'translateY(0)';
  });

  directionsButton.addEventListener('click', () => {
    const destination = 'Rua das Indústrias Verdes, 1234, Distrito Industrial, São Paulo, SP';
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
    window.open(url, '_blank');
  });

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(directionsButton);
}

// Show map error message
function showMapError() {
  const mapElement = document.getElementById('map');
  if (mapElement) {
    mapElement.innerHTML = `
      <div class="contact__map-error">
        <i class="fa-solid fa-exclamation-triangle" style="font-size: 2rem; color: #FF5722; margin-bottom: 16px;"></i>
        <h4 style="margin: 0 0 8px 0; color: #212121;">Mapa Indisponível</h4>
        <p style="margin: 0; color: #757575; text-align: center; padding: 0 20px;">
          Não foi possível carregar o mapa no momento.<br>
          Nosso endereço: Rua das Indústrias Verdes, 1234<br>
          Distrito Industrial - São Paulo/SP
        </p>
        <button onclick="openMapsDirections()" style="margin-top: 16px; padding: 8px 16px; background-color: #2E7D32; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Abrir no Google Maps
        </button>
      </div>
    `;
    mapElement.style.display = 'flex';
    mapElement.style.alignItems = 'center';
    mapElement.style.justifyContent = 'center';
    mapElement.style.textAlign = 'center';
  }
}

// Open Google Maps directions
function openMapsDirections() {
  const destination = 'Rua das Indústrias Verdes, 1234, Distrito Industrial, São Paulo, SP';
  const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
  window.open(url, '_blank');
}

// Fallback if Google Maps fails to load
window.addEventListener('load', () => {
  // Check if map loaded after 5 seconds
  setTimeout(() => {
    const mapElement = document.getElementById('map');
    const placeholder = document.querySelector('.contact__map-placeholder');

    if (mapElement && placeholder && placeholder.style.display !== 'none') {
      showMapError();
    }
  }, 5000);
});

// Handle map resize on window resize
window.addEventListener('resize', () => {
  if (map) {
    google.maps.event.trigger(map, 'resize');
  }
});

console.log('🗺️ Google Maps module loaded');