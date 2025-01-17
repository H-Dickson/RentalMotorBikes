import React, { useState, useEffect, useMemo} from "react";
import { MapContainer, Marker, TileLayer, Popup, useMapEvents, useMap  } from "react-leaflet"
import {divIcon, point} from "leaflet"
import MarkerClusterGroup from "react-leaflet-cluster";
import { debounce } from 'lodash';
import { Axios } from 'axios';
import { useLocation, useNavigate } from "react-router-dom";

import "leaflet/dist/leaflet.css"
import './mapPage.css'; // Import your CSS Module
import useFetch from "../../hooks/usefetch";
import SideBikes from "../components/sidebikes/sidebikes";



const MapPage = () =>{
    const navigate = useNavigate();
    const {state} = useLocation();
    const defaultPosition = [-41.2865, 174.7762]; // Wellington
    let lat = null, lon = null;
    if (state && state.lat && state.lon) {
        lat = state.lat;
        lon = state.lon;
    }
    const position = (lat !== null && lon !== null) ? [lat, lon] : defaultPosition;
    console.log(position);
    console.log(position)
    // if (state){
    //   position[0] = lat
    //   position[1]= lon
    // }
    const {data: Bikes} = useFetch(`/bikes`)
    const [selectedBike, setSelectedPlace] = useState(null);
    const [visibleBikes, setVisibleBikes] = useState([]);
  console.log(selectedBike)
  
    const getIcon = (price) => {
        return divIcon({
          className: "custom-icon",
          html: `<div style="background-color:white; padding: 10px; width: 40px; height: 20px; border-radius: 5px; text-align: center; display: flex; justify-content: center; align-items: center;">$${price}</div>`
        });
      }
      const MapEvents = () => {
        const map = useMap();

        useEffect(() => {
          const resetSelectedBikeOnMapUpdate = () => {
            setSelectedPlace(null);
          };
      
          // Listen for map updates
          map.on('moveend', resetSelectedBikeOnMapUpdate);
      
          // Cleanup
          return () => {
            map.off('moveend', resetSelectedBikeOnMapUpdate);
          };
        }, [map, setSelectedPlace]);
    
      
        const updateVisibleBikes = () => {
          const bounds = map.getBounds();
          const newVisibleBikes = Bikes.filter((bike) => bounds.contains([bike.location.lat, bike.location.lon]));
          setVisibleBikes(newVisibleBikes);
        };
      
        useMapEvents({
          moveend: debounce(updateVisibleBikes, 1000), // delay in ms
        });


      
        // useEffect(() => {
        //   map.whenReady(updateVisibleBikes);
        // }, []);
      
        return null;
      };


  return (
    <div className='map-page'>
      <div className='map-container'>
    <div className='map'>
      <MapContainer center={position} zoom={13} >
      <MapEvents />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        <TileLayer 
            attribution="CartoDB_Voyager"
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        <MarkerClusterGroup>
          {Bikes.map((bike, index) => (
            <Marker
              key={index}
              position={[bike.location.lat, bike.location.lon]}
              icon={getIcon(bike.price)}
              eventHandlers={{
                click: () => {
                  if (selectedBike === bike) {
                    setSelectedPlace(null);
                  } else {
                    setSelectedPlace(bike);
                  }
                },
              }}
            />
          ))}
        </MarkerClusterGroup>
        {selectedBike &&  (
          <Popup
            position={[selectedBike.location.lat, selectedBike.location.lon]}
            onClose={() => setSelectedPlace(null)}
          >
            {/* <a className="popUp" href={`/bikes/${selectedBike._id}`}> */}
      <div className="popup-bike"  onClick={() => navigate(`/bike/${selectedBike._id}`)}>
        <img src={`http://localhost:5000/rs-file-storage/${selectedBike.img}`} alt={selectedBike.make} />
        <h3>{selectedBike.make} {selectedBike.model}</h3>
        <p className="bikegrid"><span>{selectedBike.address.city}. {selectedBike.address.region}</span><span className="alignright">${selectedBike.price}</span></p>
      </div>
    {/* </a> */}
          </Popup>
        )}
      </MapContainer>
    </div>
    </div>
    <div className="sidebikes">
    <SideBikes bikesInView={visibleBikes}/>
    </div>
    </div>
  );
}

export default MapPage;
