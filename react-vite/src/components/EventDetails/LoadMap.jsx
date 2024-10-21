import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import './EventDetails.css';


const libraries = ['places'];
const mapContainerStyle = {
  width: '380px',
  height: '300px',
  borderRadius: '10px'
};

const LoadMap = ({ address }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyDQBxGOJQFXaGF2KBm2WMXDvQILFWL2B_I',
    libraries,
  });

  const [center, setCenter] = useState({
    lat: 7.2905715, // default latitude
    lng: 80.6337262, // default longitude
  });


  const getCoordinates = async (address) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyDQBxGOJQFXaGF2KBm2WMXDvQILFWL2B_I`; // Replace with your API key
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        const location = data.results[0].geometry.location;
        setCenter({
          lat: location.lat,
          lng: location.lng,
        });
      } else {
        console.error('Geocoding failed:', data.status);
      }
    } catch (error) {
      console.error('Error fetching geocoding data:', error);
    }
  };


  useEffect(() => {
    if (address) {
      getCoordinates(address);
    }
  }, [address]);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  return (
    <div>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={center}
      >
        <Marker position={center} />
      </GoogleMap>
    </div>
  );
};

export default LoadMap;
