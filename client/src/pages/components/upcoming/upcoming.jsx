import React, { useContext, useEffect, useState } from 'react';
import './upcoming.css';
import { AuthContext } from '../../../context/AuthContext';
import useFetch from '../../../hooks/usefetch.js';
import { useNavigate } from 'react-router-dom';
import { filter } from 'lodash';

function Upcoming() {
    const { user } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(true); // Step 1: Initialize loading state
    const { data: bikes, error } = useFetch(`/bikes/user/${user._id}`);
    const [bikeRentals, setBikeRentals] = useState([]);
    const [activeOption, setActiveOption] = useState('pending'); // Step 1
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRentals = async () => {
            let allRentals = [];
            for (const bike of bikes) {
                const response = await fetch(`/rentals/bike/${bike._id}`);
                const rentalData = await response.json();
                allRentals = allRentals.concat(rentalData);
            }
            const sortedRentals = allRentals.sort((a, b) => {
                if (!a.date || !a.date.start) return 1;
                if (!b.date || !b.date.start) return -1;
                return new Date(a.date.start) - new Date(b.date.start);
            });
            setBikeRentals(sortedRentals);
            setIsLoading(false);
        };

        if (bikes.length) {
            fetchRentals();
        }
    }, [bikes]);

    // Filter rentals based on activeOption
    const getFilteredRentals = () => {
        return bikeRentals.filter(rental => {
            switch (activeOption) {
                case 'pending':
                    return !rental.accepted && !rental.deleted;
                case 'upcoming':
                    return rental.accepted && !rental.deleted && new Date(rental.date.start) > new Date();
                case 'completed':
                    return rental.accepted && new Date(rental.date.start) < new Date();
                case 'cancelled':
                    return !rental.accepted && rental.deleted;
                default:
                    return true;
            }
        });
    };

    const filteredRentals = getFilteredRentals();

    if (isLoading) return <div className='user-rentals'>
                            <div className="user-rentals-header">
                            <h2>Upcoming Rentals</h2>
                            <hr className='line'></hr>
                            </div>
                            <p className='align-center'>Loading your Rentals...</p>
                            <div className='user-rentals-grid'>
                                
                            </div>
                         </div>;
    if (error) return <div className='user-rentals'>
    <div className="user-rentals-header">
    <h2>Upcoming Rentals</h2>
    <hr className='line'></hr>
    </div>
    <p className='align-center'>There was an error Loading your Rentals {error}</p>
    <div className='user-rentals-grid'>
        
    </div>
 </div>;
    
    // Step 2: Render each rental as a grid item
    return (
        <div className='user-rentals'>
        <div className="user-rentals-header">
            <h2>Upcoming Rentals</h2>
            <hr className='line'></hr>
            <div className="user-rentals-options">
                    <span
                        className={activeOption === 'pending' ? 'active-option' : ''}
                        onClick={() => setActiveOption('pending')}
                    >
                        Pending
                    </span>
                    <span
                        className={activeOption === 'upcoming' ? 'active-option' : ''}
                        onClick={() => setActiveOption('upcoming')}
                    >
                        Upcoming
                    </span>
                    <span
                        className={activeOption === 'completed' ? 'active-option' : ''}
                        onClick={() => setActiveOption('completed')}
                    >
                        Completed
                    </span>
                    <span
                        className={activeOption === 'cancelled' ? 'active-option' : ''}
                        onClick={() => setActiveOption('cancelled')}
                    >
                        Cancelled
                    </span>
                </div>
        </div>
        <div className='user-rentals-grid'>
            {filteredRentals.map((rental, index) => (
                <div key={index} className='user-rentals-display'>
                    {/* Assuming each rental has an image. Adjust the image path as necessary. */}
                    <img src={`http://localhost:5000/rs-file-storage/${rental.img}`} alt="" className='user-rental-image'/>
                    <div>
                        Start Date: {new Date(rental.date.start).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                        <br/>
                        End Date: {new Date(rental.date.end).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                    </div>
                    <button className="user-view-btn" onClick={() => navigate(`/rental/${rental._id}`)}>View</button>
                </div>
            ))}
        </div>
    </div>
        // <div className='rentals'>
        //     <div className="rentals-header"> {/* Ensure this div uses block layout */}
        //         <h2>Rentals</h2>
        //     </div>
        //     <div className='rentals-grid'>
        //     {allRentals.map((rental, index) => (
        //         <div key={index}>
        //             <h3>{rental.bikeName}</h3>
        //             <div><img src={`http://localhost:5000/rs-file-storage/${rental.bikeImg}`} alt="" className='rental-image'/></div>
        //             <div>Make: {rental.bikeMake}</div>
        //             <div>Model: {rental.bikeModel}</div>
        //             <div>Price: {rental.bikePrice}</div>
        //             <div>Registration: {rental.bikeRegistration}</div>
        //             <div>Address: {rental.bikeAddress.street}, {rental.bikeAddress.city}</div>
                    
        //             <div>Start Date:{new Date(rental.date.start).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>
        //             <div>End Date:{new Date(rental.date.end).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}</div>
                    
        //             <div>Price: {rental.price}</div>
        //             <button className="view-btn">View</button>
        //         </div>
        //     ))}
        //     </div>
        // </div>
    );
}

export default Upcoming;