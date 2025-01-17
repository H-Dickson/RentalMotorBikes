import React, {useState} from 'react';
import './bike.css'; // Import your CSS Module
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../../hooks/usefetch';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import axios from 'axios';
import { startOfDay } from 'date-fns';

function Bike() {
    const navigate = useNavigate();
    
    const { id } = useParams();
    const { data: bike, loading, error } = useFetch(`/bikes/find/${id}`);

    
    const { data: owner } = useFetch(`/users/account/${bike.owner_id}`);
    // const city = owner.address.city;
    
    const ownerId = bike.owner_id

    
    const [rentalInfo, setRentalInfo] = useState({
        date:{
            start: '',
            end: ''
        }
    })
    const address = bike?.address ?? 'Address not available';
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [state, setState] = useState([
        {
          startDate: today,
          endDate: tomorrow,
          key: 'selection'
        }
      ]);

      const msDay = 24* 60 *60 * 1000;
      
    var days = (state[0].endDate - state[0].startDate)/msDay + 1
    var discount = 0;
    if(days >= 5 && days < 10){
        discount = 5;
    }else if(days > 10){
        discount = 10;
    }
    var total = (bike.price * Math.round(days)) - ((bike.price * Math.round(days)) * (discount / 100));

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Update rentalInfo with the dates from state
        const updatedRentalInfo = {
            ...rentalInfo,
            date: {
            start: state[0].startDate,
            end: state[0].endDate
            }
        };
        setRentalInfo(updatedRentalInfo);

        // Perform the POST request
        try {
            navigate('/booking', { state: { rentalInfo: updatedRentalInfo, bikeId: bike._id, total} });
            //const response = await axios.post(`/rentals/${bike._id}`, updatedRentalInfo);
        
            // console.log(response.data); // Handle success
            // window.location.reload();
            // alert("Rental created!");
        } catch (error) {
            console.error('There was a problem with the axios operation:', error);
        }
    };

    return (
        <div className='bike'>
            <img className="bike-image" src={`http://localhost:5000/rs-file-storage/${bike.img}`} alt={bike.make} />
    <div className='content'>
        <div className='details'>
            <h2 className="bike-title">{bike.year} {bike.make} {bike.model} {bike.submodel}</h2>
            <p className="bike-grid"></p>
            <hr />
            <h3>Description</h3>
            <p className="bike-description">{bike.description}</p>
            <hr />
            <h3>Owner</h3>
            <div className="owner-details">
                <img className="owner-image" src={owner.img ? `http://localhost:5000/rs-file-storage/${owner.img}` : '/images/profile.jpg'} alt={owner.name}  onClick={() => navigate(`/ownerpage/${ownerId}`)}/>
                <div className="owner-info">
                    <p className="owner-name">{owner.name}</p>
                    <p className="owner-riding">Riding since {owner.Riding}</p>
                    <p className="owner-city">{owner.address?.city}</p>
                </div>
            </div>
            <hr />
            <h3>Condition</h3>
            <p className="bike-condition">{bike.condition}</p>
            <hr />
            <h3>Discounts</h3>
            <table className="discounts-table">
                    <thead>
                        <tr>
                            <th>Days</th>
                            <th>Discount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Less than 5</td>
                            <td>0%</td>
                        </tr>
                        <tr>
                            <td>5 to 9</td>
                            <td>5%</td>
                        </tr>
                        <tr>
                            <td>10 or more</td>
                            <td>10%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="bike-booking">
                <h3>Select Dates for your booking</h3>
            <DateRange
                editableDateInputs={true}
                minDate={today}
                onChange={item => setState([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={state}
                disabledDates={bike.unavailable}
                />
                <p>${bike.price}.00 x {Math.round(days)}: <span className='alignright'>${bike.price * Math.round(days)}</span></p>
<p>Discount total: <span className='alignright'>{discount}%</span></p>
<p>Total: <span className="alignright">${total}</span></p><br></br>
                <p>{address.street}, {address.city}</p>
                <button className='enterbutton' onClick={handleSubmit}>Book now!</button>
            </div>
            </div>
        </div>
    );
}

export default Bike;
