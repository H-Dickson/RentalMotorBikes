import React from 'react';
import "./ownerpage.css"
import useFetch from '../../hooks/usefetch';
import { useParams } from 'react-router-dom';
const OwnerPage = () =>{
    const {id} = useParams()
    const {data: owner } = useFetch(`/users/account/${id}`)
    const {data: bikes, loading, error } = useFetch(`/bikes/user/${id}`)
    console.log(owner)
    return (
        <div className='owner-page'>
            <div className='owner'>
            <h3>Owner</h3>
                <div className="owner-details">
                    <img className="owner-image" src={owner.img ? `http://localhost:5000/rs-file-storage/${owner.img}` : '/images/profile.jpg'} alt={owner.name}/>
                    <div className="owner-info">
                        <p className="owner-name">{owner.name}</p>
                        <p className="owner-riding">Riding since {owner.Riding}</p>
                        <p className="owner-city">{owner.address?.city}</p>
                    </div>
                </div>
                <h3>About {owner.name}</h3>
                <p>{owner.additional}</p>
            </div>
            <div className='owner-bikes'>
            {loading ? (
    <p>Loading bikes...</p>
) : error ? (
    <p>Error loading bikes.</p>
) : bikes && bikes.length > 0 ? (
    bikes.map((bike) => (
        <div key={bike.id} className="bike">
            <img className="bike-owner-image" src={bike.img ? `http://localhost:5000/rs-file-storage/${bike.img}` : '/images/bike-placeholder.jpg'} alt={bike.model}/>
            
                <h3>{bike.year} {bike.model} {bike.model}</h3>

            
        </div>
    ))
) : (
    <p>No bikes found.</p>
)}
            </div>
        </div>
    );
}

export default OwnerPage;