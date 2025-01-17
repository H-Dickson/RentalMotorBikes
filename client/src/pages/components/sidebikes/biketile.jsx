import React from 'react';
import './sidebikes.css'; // Import your CSS Module
import { useNavigate } from 'react-router-dom';

const BikeTile = ({ bike }) => {
  const navigate = useNavigate();
  return (

    <div className='bike-tile' onClick={() => navigate(`/bike/${bike._id}`)}>
      <img src={`http://localhost:5000/rs-file-storage/${bike.img}`} alt={bike.make} />
      <h2>{bike.year} {bike.make} {bike.model}</h2>
      <p className="bikegrid"><span>{bike.address.city}. {bike.address.region}</span><span className="alignright">${bike.price}/day</span></p>

      {/* Render other bike details here */}
    </div>

  );
};

export default BikeTile;