import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFetch from '../../../hooks/usefetch';
import { AuthContext } from '../../../context/AuthContext';
import './ownedBike.css'
import editBike from '../../../hooks/editBike.js';

function OwnedBike() {
    const { id } = useParams(); // Get bike id from URL params
    const { user } = useContext(AuthContext); // Assuming user context provides logged-in user info
    const navigate = useNavigate(); // For navigation

    const { data: bike, loading, error } = useFetch(`/bikes/find/${id}`);

    const [isEditing, setIsEditing] = useState({
        make: false,
        model: false,
        registration: false,
        price: false,
        available: false,
        // Add other fields as necessary
    });

    const [editedValues, setEditedValues] = useState({
        make: '',
        model: '',
        registration: '',
        price: '',
        available: '',
        // Initialize other fields similarly
    });

    useEffect(() => {
        if (!loading && bike) {
            setEditedValues({
                make: bike.make,
                model: bike.model,
                registration: bike.registration,
                price: bike.price,
                available: bike.available,
                // Initialize other fields similarly
            });
        }
    }, [loading, bike]);

    if (loading) {
        return <p>Loading...</p>; // Placeholder for loading state
    }

    if (error) {
        return <p>Error: {error.message}</p>; // Placeholder for error state
    }

    // Function to check if the logged-in user is the owner of the bike
    const isOwner = bike.owner_id === user._id;

    // Redirect to home page if user is not the owner
    if (!isOwner) {
        navigate('/');
        return null; // Optional: return null or a loading/error state if you prefer
    }

    if(!user){
        navigate('/');
        return null; 
    }

    const handleEdit = async (field, isSaving = false) => {
        try {
            if (isSaving) {
                console.log("bikes/"+bike._id)
                await editBike('bikes', bike._id, { [field]: editedValues[field] });
            } else {
                setEditedValues(prev => ({ ...prev, [field]: bike[field] }));
            }
            setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
        } catch (error) {
            console.error('Error editing:', error);
        }
    };

    // Function to handle input changes
    const handleChange = (field, value) => {
        setEditedValues(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className='owned-bike'>
            <ul>
                <li className='list-item-container'>
                    Make:
                    {isEditing.make ? (
                        <input
                            type="text"
                            value={editedValues.make}
                            onChange={(e) => handleChange('make', e.target.value)}
                        />
                    ) : (
                        `${editedValues.make} `
                    )}
                    {isEditing.make ? (
                        <>
                            <button onClick={() => handleEdit('make', true)}>Save</button>
                            <button onClick={() => handleEdit('make')}>Cancel</button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(prev => ({ ...prev, make: true }))}>Edit</button>
                    )}
                </li>
                <li className='list-item-container'>
                    Model:
                    {isEditing.model ? (
                        <input
                            type="text"
                            value={editedValues.model}
                            onChange={(e) => handleChange('model', e.target.value)}
                        />
                    ) : (
                        `${editedValues.model} `
                    )}
                    {isEditing.model ? (
                        <>
                            <button onClick={() => handleEdit('model', true)}>Save</button>
                            <button onClick={() => handleEdit('model')}>Cancel</button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(prev => ({ ...prev, model: true }))}>Edit</button>
                    )}
                </li>
                <li className='list-item-container'>
                    Registration:
                    {isEditing.registration ? (
                        <input
                            type="text"
                            value={editedValues.registration}
                            onChange={(e) => handleChange('registration', e.target.value)}
                        />
                    ) : (
                        `${editedValues.registration} `
                    )}
                    {isEditing.registration ? (
                        <>
                            <button onClick={() => handleEdit('registration', true)}>Save</button>
                            <button onClick={() => handleEdit('registration')}>Cancel</button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(prev => ({ ...prev, registration: true }))}>Edit</button>
                    )}
                </li>
                <li className='list-item-container'>
                    Address:
                        <button>Edit</button>
                </li>
                    <li>
                    <ul>
                        <li><div className="list-item-container">Street: {bike.address.street} </div></li>
                        <li><div className="list-item-container">City: {bike.address.city} </div></li>
                        <li><div className="list-item-container">Region: {bike.address.region} </div></li>
                        <li><div className="list-item-container">Postcode: {bike.address.postcode} </div></li>
                        <li><div className="list-item-container">Country: {bike.address.country} </div></li>
                    </ul>
                </li>
                <li className='list-item-container'>
                    Price:
                    {isEditing.price ? (
                        <input
                            type="number"
                            value={editedValues.price}
                            onChange={(e) => handleChange('price', e.target.value)}
                        />
                    ) : (
                        `$${editedValues.price}/day `
                    )}
                    {isEditing.price ? (
                        <>
                            <button onClick={() => handleEdit('price', true)}>Save</button>
                            <button onClick={() => handleEdit('price')}>Cancel</button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(prev => ({ ...prev, price: true }))}>Edit</button>
                    )}
                </li>
                {/* Add other fields similarly */}
                <li>Unavailable Dates: {isEditing.available}</li>
            </ul>
        </div>
    );
}

export default OwnedBike;
