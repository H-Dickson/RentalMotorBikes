import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import useFetch from '../../../hooks/usefetch';
import "./userrentals.css";
import { useNavigate } from 'react-router-dom';

const UserRentals = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { data: rentals, isLoading, error } = useFetch(`/rentals/user/${user._id}`);
    const [activeOption, setActiveOption] = useState('pending'); // Step 1

    // Step 2: Filter rentals based on the active option
    const filteredRentals = rentals.filter(rental => {
        switch (activeOption) {
            case 'pending':
                return !rental.accepted && !rental.deleted;
            case 'upcoming':
                return rental.accepted && !rental.deleted && new Date(rental.date.start) > new Date();
            case 'completed':
                return rental.accepted && !rental.deleted && new Date(rental.date.start) < new Date();
            case 'cancelled':
                return !rental.accepted && rental.deleted;
            default:
                return true;
        }
    });

    return (
        <div className='user-rentals'>
            <div className="user-rentals-header">
                <h2>My Trips</h2>
                <hr className='line'></hr>
                {/* UI for Options as text elements */}
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
                {/* Display Filtered Rentals */}
                {filteredRentals.map((rental, index) => (
                    <div key={index} className='user-rentals-display'>
                        <img src={`http://localhost:5000/rs-file-storage/${rental.img}`} alt="" className='user-rental-image' />
                        <div>Start Date:{new Date(rental.date.start).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                        <br></br>End Date:{new Date(rental.date.end).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                        </div>
                        <button className="user-view-btn" onClick={() => navigate(`/rental/${rental._id}`)}>View</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserRentals;