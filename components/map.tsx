import { useState, useMemo, useCallback, useRef } from "react";
import { GoogleMap, Marker, DirectionsRenderer, MarkerClusterer} from "@react-google-maps/api";
import Places from "./places";
import Distance from "./distance";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;


export default function Map() {
  const [hotel, sethotel] = useState<LatLngLiteral>();
  const [directions, setDirections] = useState<DirectionsResult>();
  const mapRef = useRef<GoogleMap>();
  const center = useMemo<LatLngLiteral>(
    () => ({ lat: 12.9716, lng: 77.5946 }), //BANGALORE
    []
  );
  const options = useMemo<MapOptions>(
    () => ({
      mapId: "334886f6fe0310be",
      disableDefaultUI: true,
      clickableIcons: true,
    }),
    []
  );
  const onLoad = useCallback((map) => (mapRef.current = map), []);
  const attractions = useMemo(() => generateattractions(center), [center]);

  const fetchDirections = (attraction: LatLngLiteral) => {
    if (!hotel) return;

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: attraction,
        destination: hotel,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    );
  };

  return (
    <div className="container">
      <div className="controls">
        <h1>Travel Helper</h1>
        <Places
          sethotel={(position) => {
            sethotel(position);
            mapRef.current?.panTo(position);
          }}
        />
        {!hotel && <p>Enter the address of your hotel.</p>}
        {directions && <Distance leg={directions.routes[0].legs[0]} />}
      </div>
      <div className="map">
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  zIndex: 50,
                  strokeColor: "#1976D2",
                  strokeWeight: 5,
                },
              }}
            />
          )}

          {hotel && (
            <>    
              <Marker
                position={hotel}
                icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
              />
              initMap()
              <MarkerClusterer>
                {(clusterer) =>
                  attractions.map((attraction) => (
                    <Marker
                      key={attraction.lat}
                      position={attraction}
                      clusterer={clusterer}
                      onClick={() => {
                        fetchDirections(attraction);
                      }}
                    />
                  ))
                }
              </MarkerClusterer>
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

const generateattractions = (position: LatLngLiteral) => {
  const _attractions: Array<LatLngLiteral> = [];
  // const bangalore = {lat: 12.98323216659285, lng: 77.62397321330374}
  const bangalore_palace = [13.0036740466106, 77.58911675177688]
  const planiterium = [12.985520842976504, 77.5894736071882]
  const cubbon_park = [12.978101603899225, 77.5951531396384]
  const science_museum = [12.975589574878384, 77.5963295433373]
  const lalbagh = [12.951150980837163, 77.58479961977467]

  const items = [bangalore_palace,planiterium,cubbon_park,science_museum,lalbagh]
  for (let i = 0; i < 5; i++) {
      _attractions.push({
        lat: items[i][0],
        lng: items[i][1],
      });
    }
  return _attractions;
};
