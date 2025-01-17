import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../hooks/usefetch';
import "./rentalbikepage.css";
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const UpcomingPage = () =>{
    const {user} = useContext(AuthContext)
    
    const { id } = useParams(); // Get bike id from URL params
    const navigate = useNavigate()
    const { data: rental, loading, error } = useFetch(`/rentals/find/${id}`);
    const { data: bike } = useFetch(`/bikes/find/${rental?.bike_id}`); // Use optional chaining
    const owner = user._id == bike.owner_id
    console.log(owner)
    const instance = axios.create({
        baseURL: 'http://localhost:8800/api',
        withCredentials: true  // Adjust to match your backend server URL
    });
    const handleSubmit = async (e) =>{
        e.preventDefault();
    try {
        await instance.put(`/rentals/accept/${rental._id}`);
        navigate("/upcomingrentals")
        // Handle success, e.g., by reloading the page or showing a success message
    } catch (error) {
        // Handle error, e.g., by showing an error message
    }
    }
    const handleDelete = async (e) =>{
        e.preventDefault();
        try {
            await instance.put(`/rentals/delete/${rental._id}`);
            navigate("/upcomingrentals")
            // Handle success, e.g., by reloading the page or showing a success message
        } catch (error) {
            // Handle error, e.g., by showing an error message
        }
    }

    // Conditional rendering to ensure rental and rental.date are defined
    if (loading || !rental || !rental.date) {
        return <div>Loading...</div>; // Or any other loading state representation
    }

    const start = new Date(rental.date.start);
    const end = new Date(rental.date.end);
    console.log(!rental.accepted, rental.deleted)
    console.log(rental)
    return (
        <div className='rentalbike'>
            <div>
                <img src={`http://localhost:5000/rs-file-storage/${bike?.img}`} alt={`${bike?.make} ${bike?.model}`}></img>
            </div>
            <div>
                {bike?.year} {bike?.make} {bike?.model}
            </div>
            <div>
                {start.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })} To {end.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
            </div>
            <div>
                {rental.total}
            </div>
            <div>
                {bike?.address?.street}, {bike?.address?.city}
            </div>
            {/* Conditional rendering for the Accept Rental button */}
            {!rental.accepted && !rental.deleted && owner && (
                <div>
                <button onClick={handleSubmit}>Accept Rental</button>
                <button onClick={handleDelete}>Decline Rental</button>
                </div>
            )}
            {rental.accepted && !rental.deleted && (
                <div>
                <button onClick={handleDelete}>Cancel Rental</button>
                </div>
            )}
        </div>
    );
}

export default UpcomingPage;