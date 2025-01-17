import axios from "axios";
import  { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css"; // Assume similar styling to login, adjust as necessary


function Register() {
    const [userInfo, setUserInfo] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: {
          street: "",
          city: "",
          region: "",
          postcode: "",
          country: ""
        },
        Riding: 0,
        Additional: ""
      });
    
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name.includes('.')) {
      const [key, subKey] = e.target.name.split('.');
      setUserInfo(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          [subKey]: e.target.value
        }
      }));
    } else {
      setUserInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...userInfo,
        // Ensure all required fields are included
        // For example, if `Riding` is a number field, ensure it's converted to a number if necessary
        Riding: parseInt(userInfo.Riding, 10),
      };
      const res = await axios.post("/auth/register", payload);
      setLoading(false);
      

      navigate("/account");
    } catch (err) {
      setError(err.response.data.message || "An error occurred");
      setLoading(false);
    }
  };

  

  return (
    <div className="registerPage">
    <div className="rContainer">
      <h2>Register</h2>
      <input type="text" placeholder="Name" name="name" onChange={handleChange} className="rInput" />
      <input type="text" placeholder="Email" name="email" onChange={handleChange} className="rInput" />
      <input type="password" placeholder="Password" name="password" onChange={handleChange} className="rInput" />
      <input type="text" placeholder="Phone" name="phone" onChange={handleChange} className="rInput" />
      <input type="text" placeholder="Street" name="address.street" onChange={handleChange} className="rInput" />
      <input type="text" placeholder="City" name="address.city" onChange={handleChange} className="rInput" />
      <input type="text" placeholder="Region" name="address.region" onChange={handleChange} className="rInput" />
      <input type="text" placeholder="Postcode" name="address.postcode" onChange={handleChange} className="rInput" />
      <input type="text" placeholder="Country" name="address.country" onChange={handleChange} className="rInput" />
      <input type="number" placeholder="Riding" name="Riding" onChange={handleChange} className="rInput" />
      <input type="text" placeholder="Additional" name="Additional" onChange={handleChange} className="rInput" />
      <button disabled={loading} onClick={handleSubmit} className="rButton">
        Register
      </button>
      {error && <span className="error">{error}</span>}
    </div>
  </div>
  );
}

export default Register;