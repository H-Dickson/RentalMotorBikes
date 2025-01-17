import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './booking.css'; // Import your CSS Module
import useFetch from '../../../hooks/usefetch';

import axios from 'axios';
// import { update } from 'lodash';

function Booking(id) {
  const location = useLocation();
  const navigate = useNavigate();

  const { rentalInfo, bikeId, total } = location.state || {};
  const { data: bike, loading, error } = useFetch(`/bikes/find/${bikeId}`);
  const [selectedInsurance, setSelectedInsurance] = useState('min');
  const [showDetails, setShowDetails] = useState({ min: true, std: false, ext: false });
  const [roadsideAssistance, setRoadsideAssistance] = useState(false);
  const INSURANCE_COSTS = {
    min: 5, // Example cost
    std: 10, // Example cost
    ext: 15, // Example cost
  };
  const roadside = 20;
  const msDay = 24* 60 *60 * 1000;
      
var numberOfDays = (rentalInfo.date.end - rentalInfo.date.start)/msDay + 1
const basePrice = bike.price * numberOfDays;

let discount = 0;
if (numberOfDays >= 5 && numberOfDays <= 10) {
  discount = 0.05; // 5% discount
} else if (numberOfDays > 10) {
  discount = 0.1; // 10% discount
}
const discountedPrice = basePrice - (basePrice * discount);

const insuranceCost = numberOfDays * INSURANCE_COSTS[selectedInsurance];
const roadsideCost = roadsideAssistance ? numberOfDays * roadside : 0;

const totalPrice = discountedPrice + insuranceCost + roadsideCost;


  const handleClick = async (e) => {
    e.preventDefault();

    const updatedRentalInfo = {
      ...rentalInfo,
      selectedInsurance: selectedInsurance,
      roadsideAssistance: roadsideAssistance,
      total: totalPrice,
    }
    try{
      const res = await axios.post(`/rentals/${bikeId}`, updatedRentalInfo);
      const rentalId = res.data._id
      console.log(rentalId); // Ensure this logs correctly
    // Debugging before navigate
    console.log("Navigating to /checkout with rentalId:", rentalId);

    navigate("/checkout", { state: { rentalId: rentalId } });
    }catch (e){
      console.error("error", e.message)
    }
  };
  
  const handleInsuranceClick = (type) => {
    if (selectedInsurance === type) return;
    setSelectedInsurance(type);
    // Reset all showDetails values to false, then set the clicked type to true
    setShowDetails({ min: false, std: false, ext: false, [type]: !showDetails[type] });
  };

  if (!rentalInfo || !bikeId || typeof total === 'undefined') {
    return null;
  }

  return (
    <div className='booking'>
        
      <div className='booking-options'>
        
        {/* Insurance Options */}
        <div>
          <h2>Insurance</h2>
          {['min', 'std', 'ext'].map((type) => (
  <div 
    key={type} 
    onClick={() => handleInsuranceClick(type)} 
    className={`insurance ${showDetails[type] ? 'insurance-selected' : ''}`}>
    <p>{type.toUpperCase()} Insurance - ${INSURANCE_COSTS[type]}/day</p>
    {showDetails[type] && <p>Details about {type.toUpperCase()} insurance...</p>}
  </div>
))}
        </div>

        {/* Roadside Assistance */}
        <div>
          <h2>Roadside Assistance</h2>
          <input
            type="checkbox"
            checked={roadsideAssistance}
            onChange={(e) => setRoadsideAssistance(e.target.checked)}
          />
          <label>Include roadside assistance  - ${roadside}/day</label>
        </div>


      </div>

      <div className='booking-info'>
  <img src={`http://localhost:5000/rs-file-storage/${bike.img}`} alt={`${bike.make} ${bike.model}`} />
  <h2>{bike.year} {bike.make} {bike.model} {bike.submodel}</h2>
  {new Date(rentalInfo.date.start).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })} To {new Date(rentalInfo.date.end).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
  <div className='booking-summary'>
  <h3>Booking Summary</h3>
  <hr></hr>
  <p>Base Price (for {numberOfDays} days): ${basePrice.toFixed(2)}</p>
  {discount > 0 ? (
    <p>Multi-Day Discount: -${(basePrice * discount).toFixed(2)}</p>
  ) : (
    <p>Multi-Day Discount: -$0.00</p>
  )}
  <p>Insurance ({selectedInsurance ? selectedInsurance.toUpperCase() : 'NONE'}): +${selectedInsurance ? insuranceCost.toFixed(2) : '0.00'}</p>
  <p>Roadside Assistance: +${roadsideAssistance ? roadsideCost.toFixed(2) : '0.00'}</p>
  <h3 className='total-price'>Total Price: ${totalPrice.toFixed(2)}</h3>
  <hr></hr>
  
  <button className='enterbutton' onClick={handleClick}>Confirm Booking</button>
</div>

</div>
    </div>
  );
}

export default Booking;