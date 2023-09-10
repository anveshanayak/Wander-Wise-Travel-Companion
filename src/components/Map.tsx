import GoogleMapReact from 'google-map-react';
import { Box, Paper, Typography, Rating, useMediaQuery } from '@mui/material';
import LocationOnOutlineIcon from '@mui/icons-material/LocationOnOutlined';
import { useState, useMemo, useCallback, useRef } from "react";
import { GoogleMap, Marker, DirectionsRenderer, MarkerClusterer} from "@react-google-maps/api";
import Places from "./places";
import Distance from "./distance";

import styles from './Map.module.css';
import type { TypeMapProps } from '../@types';


type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

const generateAttractions = async (position: LatLngLiteral) => {
  // const _attractions: Array<LatLngLiteral> = [];
  const _attractions: Array<LatLngLiteral> = [];

  // Make a GET request to the Travel Advisor API
  const response = await fetch('https://travel-advisor.p.rapidapi.com/locations/v2/auto-complete?query=bangalore&lang=en_US&units=km', {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'string',
      'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
    },
    // Pass the latitude and longitude of the clicked position
    body: JSON.stringify({
      lat: position.lat,
      lng: position.lng
    })
  });

  // Parse the response from the API
  const data = await response.json();

  // Extract the necessary information from the API response
  const attractions = data.attractions;

  // Loop through the attractions and push them to the _attractions array
  attractions.forEach((attraction: any) => {
    _attractions.push({
      lat: attraction.latitude,
      lng: attraction.longitude
    });
  });

  return _attractions;
};


const Map = ({
  coordinates,
  setCoordinates,
  setBounds,
  places,
  setChildClicked,
  weatherData,
}: TypeMapProps) => {
  const isDesktop = useMediaQuery('(min-width: 600px');

  // const [directions, setDirections] = useState<DirectionsResult>();


  // const fetchDirections = (hotel: LatLngLiteral, attraction: LatLngLiteral) => {
  //   if (!hotel) return;

  //   const service = new google.maps.DirectionsService();
  //   service.route(
  //     {
  //       origin: attraction,
  //       destination: hotel,
  //       travelMode: google.maps.TravelMode.DRIVING,
  //     },
  //     (result, status) => {
  //       if (status === "OK" && result) {
  //         setDirections(result);
  //       }
  //     }
  //   );
  // };

  return (
   
    <Box sx={{ height: '85vh', width: '100%' }}>

      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY }}
        center={coordinates}
        defaultZoom={14}
        margin={[50, 50, 50, 50]}
        onChange={(e) => {
          setCoordinates({ lat: e.center.lat, lng: e.center.lng });
          setBounds({ ne: e.marginBounds.ne, sw: e.marginBounds.sw });
          // fetchDirections(coordinates,{ lat: e.center.lat, lng: e.center.lng });
        }}
        onChildClick={(child) => {
          setChildClicked(child);
        }}
      >
        {places?.map((place, index) => {
          const lat = place.latitude;
          const lng = place.longitude;
          const rating = place.rating;
          if (lat && lng && rating) {
            return (
              // @ts-ignore
              <div className={styles.markerContainer} lat={+lat} lng={+lng} key={index}>
                {/* {directions && <Distance leg={directions.routes[0].legs[0]} />} */}
                {!isDesktop ? (
                  <LocationOnOutlineIcon color="primary" fontSize="large" />
                ) : (
                  <Paper
                    elevation={3}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      width: '100px',
                      padding: '5px'
                    }}
                  >
                    <Typography variant="subtitle2" gutterBottom>
                      {place.name}
                    </Typography>
                    <img
                      style={{ cursor: 'default' }}
                      src={
                        place.photo
                          ? place.photo.images.large.url
                          : 'https://www.foodserviceandhospitality.com/wp-content/uploads/2016/09/Restaurant-Placeholder-001.jpg'
                      }
                      alt={place.name}
                    />
                    <Rating size="small" value={+rating} readOnly />
                  </Paper>
                )}
              </div>
            );
          }
        })}

        {weatherData.length &&
          weatherData.map((data, index) => (
            // @ts-ignore
            <div key={index} lat={data[0]} lng={data[1]}>
              <img height={75} src={data[2]} />
            </div>
          ))}
      </GoogleMapReact>
    </Box>
  );
};

export default Map;
