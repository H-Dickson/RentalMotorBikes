import React, { useContext } from 'react';
import './rental.css'; // Import your CSS Module
import { AuthContext } from '../../../context/AuthContext';
import useFetch from '../../../hooks/usefetch.js'
import { useNavigate } from 'react-router-dom';

function Rental() {
    const { user } = useContext(AuthContext);
    const {data} = useFetch(`/bikes/user/${user._id}`)
    const navigate = useNavigate(); 
     // Dependency array, re-run the effect if user changes
    console.log(data)
    return (
        <div className='rental-grid'>
            <h2>Bikes</h2>
            <hr className='line'></hr>
            {data.map((bike, index) => (
                <div key={index} className="bike-info">
                <div><img  src={`http://localhost:5000/rs-file-storage/${bike.img}`} alt="" className='bike-rental-image'/> </div>
                Make: {bike.make}<br/>
                Model: {bike.model}<br/>
                Price: {bike.price}<br/>
                Registration: {bike.registration}<br/>
                Address: {bike.address.street}, {bike.address.city}<br/>
                <button className="view-btn" onClick={() => navigate(`/ownedbike/${bike._id}`)}>View</button>
            </div>
        ))}
        </div>
    );
}

export default Rental;