import React from 'react';
import './cities.css'; // Import your CSS Module
import {useNavigate } from 'react-router-dom';

function CityTile({ name, lat, lon, path }) {
  const navigate = useNavigate()
  const handleClick = () => {
    navigate('/map', { state: { lat, lon } });
};
    return (
      <div className="city-tile"
      onClick={handleClick}
      >
        <img src={path} alt={name} />
        <p>{name}</p>
      </div>
    );
  }


function Cities() {
    const cities = [
       { name: 'Auckland', lat: -36.8485, lon: 174.7633, path: 'auckland.jpg'},
       { name: 'Hamilton',lat: -37.7870, lon: 175.2793, path: 'hamilton.jpg'},
       { name: 'Wellington', lat: -41.2865, lon: 174.7762, path: 'wellington.jpg'},
       { name: 'Christchurch', lat: -43.5321, lon: 172.6362, path: 'christchurch.jpg'},
       { name: 'Dunedin', lat: -45.8788, lon: 170.5020, path: 'dunedin.jpg'},
       { name: 'Queenstown', lat: -45.0312, lon: 168.6626,  path: 'queenstown.jpg'}
    ]
  return (
    <div className='cities'>
        <h1>
            Browse by City
        </h1>
<div className="cities-container">
      {cities.map((city, index) => (
        <CityTile key={index} name={city.name} lat={city.lat} lon={city.lon} path={`../images/cities/${city.path}`} />
      ))}
    </div>
    </div>   
  );
}

export default Cities;
