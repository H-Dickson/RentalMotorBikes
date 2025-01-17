import React, { useContext, useState } from 'react';
import './account.css'; // Import your CSS Module
import { AuthContext } from '../../../context/AuthContext';
import editItem from '../../../hooks/useEdit';

function Account() {
    const { user } = useContext(AuthContext);

    // State for tracking edit mode and edited values
    const [isEditing, setIsEditing] = useState({
        name: false,
        email: false,
        phone: false,
        Riding: false,
        Additional: false,
        // Add other fields as necessary
    });

    const [editedValues, setEditedValues] = useState({
        name: user.name,
        email: user.email,
        phone: user.phone,
        Riding: user.Riding,
        Additional: user.Additional,
        // Initialize other fields similarly
    });

    // Function to handle edit actions
    const handleEdit = async (field, isSaving = false) => {
        try {
            if (isSaving) {
                await editItem('users', user._id, { [field]: editedValues[field] });
            } else {
                setEditedValues(prev => ({ ...prev, [field]: user[field] }));
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
    <div className='account'>
            <h1>Account</h1>
            <ul>
            <li><div className="list-item-container">Email: {user.email} </div></li>
                <li>
                    <div className="list-item-container">
                        Name:
                        {isEditing.name ? (
                            <input
                                type="text"
                                value={editedValues.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                            />
                        ) : (
                            `${editedValues.name} `
                        )}
                        {isEditing.name ? (
                            <>
                                <button onClick={() => handleEdit('name', true)}>Save</button>
                                <button onClick={() => handleEdit('name')}>Cancel</button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditing(prev => ({ ...prev, name: true }))}>Edit</button>
                        )}
                    </div>
                </li>
                
                <li>
                    <div className="list-item-container">
                        Password: ******** <button>Edit</button>
                    </div>
                </li>
                <li>
                    <div className="list-item-container">
                        Phone:
                        {isEditing.phone ? (
                            <input
                                type="text"
                                value={editedValues.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                            />
                        ) : (
                            `${editedValues.phone} `
                        )}
                        {isEditing.phone ? (
                            <>
                                <button onClick={() => handleEdit('phone', true)}>Save</button>
                                <button onClick={() => handleEdit('phone')}>Cancel</button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditing(prev => ({ ...prev, phone: true }))}>Edit</button>
                        )}
                    </div>
                </li>
                <li className='list-item-container'>
                    Address:
                        <button>Edit</button>
                </li>
                    <li>
                    <ul>
                        <li><div className="list-item-container">Street: {user.address.street} </div></li>
                        <li><div className="list-item-container">City: {user.address.city} </div></li>
                        <li><div className="list-item-container">Region: {user.address.region} </div></li>
                        <li><div className="list-item-container">Postcode: {user.address.postcode} </div></li>
                        <li><div className="list-item-container">Country: {user.address.country} </div></li>
                    </ul>
                </li>
                <li>
                    <div className="list-item-container">
                        Riding:
                        {isEditing.Riding ? (
                            <input
                                type="text"
                                value={editedValues.Riding}
                                onChange={(e) => handleChange('Riding', e.target.value)}
                            />
                        ) : (
                            `${editedValues.Riding} `
                        )}
                        {isEditing.Riding ? (
                            <>
                                <button onClick={() => handleEdit('Riding', true)}>Save</button>
                                <button onClick={() => handleEdit('Riding')}>Cancel</button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditing(prev => ({ ...prev, Riding: true }))}>Edit</button>
                        )}
                    </div>
                </li>
                <li>
                    <div className="list-item-container">
                        Additional:
                        {isEditing.Additional ? (
                            <input
                                type="text"
                                value={editedValues.Additional}
                                onChange={(e) => handleChange('Additional', e.target.value)}
                            />
                        ) : (
                            `${editedValues.Additional} `
                        )}
                        {isEditing.Additional ? (
                            <>
                                <button onClick={() => handleEdit('Additional', true)}>Save</button>
                                <button onClick={() => handleEdit('Additional')}>Cancel</button>
                            </>
                        ) : (
                            <button onClick={() => setIsEditing(prev => ({ ...prev, Additional: true }))}>Edit</button>
                        )}
                    </div>
                </li>
                
                
            </ul>
        </div>
        
  );
}

export default Account;
