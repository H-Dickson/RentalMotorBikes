import React from 'react';
import './bikes.css'; // Import your CSS Module

function BikeTile({ name, path }) {
    return (
      <div className="city-tile">
        <img src={path} alt={name} />
        <p>{name}</p>
      </div>
    );
  }


function Bikes() {
    const cities = [
       { name: 'Indian', path: 'indian.jpg'},
       { name: 'Suzuki', path: 'dl650.webp'},
       { name: 'Yamaha', path: 'r7.jpg'},
       { name: 'BMW', path: 'bmw.jpg'},
       { name: 'Honda', path: 'rebel.jpg'}
    ]
  return (
    <div className='cities'>
        <h1>
            Browse by Bike
        </h1>
        <p>
          View our rentals by brand
        </p>
<div className="cities-container">
      {cities.map((city, index) => (
        <BikeTile key={index} name={city.name} path={`../images/bikes/${city.path}`} />
      ))}
    </div>
    </div>   
  );
}

export default Bikes;
