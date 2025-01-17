import { useContext, useState } from "react";
import "./header.css"
import { AuthContext } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';



const Header = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
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
      navigate('/map', { state: { lat: prediction.lat, lon: prediction.lon } });
    }
    
    console.log(prediction)
  }
    return (
        <div className="header">
          <img alt="headerBike" src="./images/background.png" />
            <div className="cover">
            <div className="registerText">
          <h1 className="headerTitle">Motorbike Rentals All Over <br/>New Zealand</h1>
          {!user && <button className="headerBtn"onClick={() => navigate('/login')}>Sign in / Register</button>}
          </div>
          <div className="headerSearch">
          {user ? (
            <div className="autocomplete-container">
              <div className="searchBar">
            <input 
                type="text" 
                value={input} 
                onChange={handleInputChange}
                onSubmit={handleClick}
                placeholder="Enter an address in New Zealand" 
            />
            <button className="headerBtn"  onClick={handleClick}>Search</button>
            </div>
            <ul className="predictions-list">
            {predictions?.length > 0 && predictions.map(prediction => (
    <li key={prediction.place_id} onClick={() => handlePredictionClick(prediction)}>{prediction.description}</li>
  ))}
            </ul>
          </div>
) : (
  <div className="autocomplete-container">
            <input 
                type="text" 
                value={input} 
                onChange={handleInputChange}
                onSubmit={handleClick}
                placeholder="Enter an address in New Zealand" 
            />
            <button className="headerBtn" onClick={handleClick}>Search</button>
            <ul className="predictions-list">
            {predictions?.length > 0 && predictions.map(prediction => (
    <li key={prediction.place_id} onClick={() => handlePredictionClick(prediction)}>{prediction.description}</li>
  ))}
            </ul>
          </div>
)}
          
                      
            </div>
          </div>
    
        </div>
      )
    }
export default Header;