import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useHistory for navigation
import "./completionpage.css";

const CompletionPage = () => {
    const navigate = useNavigate();



    return (
        <div className='completionpage'>
            <h2>Your Booking is Confirmed!</h2>
            <h3>The owner will either accept or deny your rental from this point.</h3>
            <div className="buttons">
                <button onClick={() => navigate('/')}>Home</button>
                <button onClick={() => navigate('/userrentals')}>View Bookings</button>
            </div>
        </div>
    );
}

export default CompletionPage;