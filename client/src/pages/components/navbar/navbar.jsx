import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'; // Step 1: Import useNavigate
import "./navbar.css";
import { AuthContext } from '../../../context/AuthContext';
import axios from "axios";

const NavBar = () => {
    const [isActive, setIsActive] = useState(false);
    const [accountActive, setAccountActive] = useState(false);
    const navigate = useNavigate(); // Step 2: Create navigate function
    const { user, dispatch } = useContext(AuthContext);
    const sideMenuRef = useRef(null);
    const [input, setInput] = useState('');
  const [prediction, setPrediction] = useState(null)
    const [predictions, setPredictions] = useState([]);

  const handleInputChange = async (e) => {
    setInput(e.target.value);

    try {
        const response = await axios.get(`http://localhost:8800/api/maps/cities?input=${e.target.value}`);
        setPredictions(response.data);
        setPrediction(response.data[0]);
        console.log(response.data)
    } catch (error) {
        console.error(error);
    }
};

  const handlePredictionClick = async (p) =>{
    setInput(p.description)
    setPrediction(p)
    setPredictions([]);
    
  }

  const handleClick = async (e) =>{
    if(prediction != null){
        console.log(prediction)
      navigate('/map', { state: { lat: prediction.lat, lon: prediction.lon } });
    }
    
    console.log(prediction)
  }
    function toggleIsActive(e) {
        e.stopPropagation(); // Prevent event from reaching document body
        setIsActive(!isActive); // Toggle isActive state
    }
    function toggleAccActive(e) {
        e.stopPropagation(); // Prevent event from reaching document body
        setAccountActive(!accountActive); // Toggle accountActive state
    }

    const logout = async (e) => {
        e.preventDefault();
        dispatch({ type: "LOGOUT" });
      };

      useEffect(() => {
        const handleClickOutside = (event) => {
            if (sideMenuRef.current && !sideMenuRef.current.contains(event.target)) {
                setIsActive(false);
                setAccountActive(false);
            }
        };

        document.body.addEventListener('click', handleClickOutside);
        return () => {
            document.body.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div>
            <div ref={sideMenuRef} className={`side-menu ${isActive ? 'active' : ''}`}>
                <h2>Stuff</h2>
            </div>
            <div className="navbar">
                <div className="navbar-left">
                    <button className={`navbutton ${isActive ? 'is-active' : ''}`} onClick={toggleIsActive}>
                        <div className="bar"></div>
                    </button>
                    <h2 onClick={() => navigate('/')} style={{cursor: 'pointer'}}>Bikes Swap</h2>                
                    </div>
                <div className="navbar-center">
                    {/* <input type="text" placeholder="Where to?" />  */}
                    <div className="autocomplete-container">
              <div className="searchBar">
              <form onSubmit={handleClick}>
            <input 
                type="text" 
                value={input} 
                onChange={handleInputChange}

                placeholder="Where to?" 
            />
            </form>
            </div>
            <ul className={`predictions-list-nav ${predictions?.length === 0 ? 'not-visible' : ''}`}>
  {predictions?.length > 0 && predictions.map(prediction => (
    <li key={prediction.place_id} onClick={() => handlePredictionClick(prediction)}>{prediction.description}</li>
  ))}
</ul>
          </div>
                </div>
                <div className="navbar-right">
    <button className="navactions list" onClick={() => navigate('/registerbike')}>List a Bike</button>
    {user ? (
        <div>
        <div ref={sideMenuRef} className={`account-menu ${accountActive ? 'active' : ''}`}>
            <h2>Hi {user.name}!</h2>
            <button className='account-buttons' onClick={() => navigate('/account')}>Account</button>
            <button className='account-buttons' onClick={() => navigate('/rentals')}>Bikes</button>
            <button className='account-buttons' onClick={() => navigate('/upcomingrentals')}>Rentals</button>
            <button className='account-buttons' onClick={() => navigate('/userrentals')}>Trips</button>
            <button className='account-buttons' onClick={logout}>Logout</button>
            </div>
            <button className="navactions logged" onClick={toggleAccActive}>{user.name}</button>
        </div>
    ) : (
        <button className="navactions login" onClick={() => navigate('/login')}>Login</button>
    )}
</div>
            </div>
        </div>
    );
}

export default NavBar;
