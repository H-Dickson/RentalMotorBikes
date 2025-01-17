import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext.js";
import "./login.css";

function Login() {
  const [credentials, setCredentials] = useState({
    user: undefined,
    password: undefined,
  });

  const {  loading, error, dispatch } = useContext(AuthContext);

  const navigate = useNavigate()

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post("/auth/login", credentials);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      navigate("/")
    } catch (err) {
      dispatch({ type: "LOGIN_FAILURE", payload: err.response.data });
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  return (
    <div className="loginpage">
      <div className="lContainer">
        <input
          type="text"
          placeholder="email"
          id="email"
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          onChange={handleChange}
          onKeyPress={handleKeyPress} 
          className="lInput"
        />
        <span onClick={() => navigate('/register')} style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}>
        Not a member? Register here.
      </span>
        <button disabled={loading} onClick={handleClick} className="lButton">
          Login
        </button>
        
        {error && <span>{error.message}</span>}
      </div>
    </div>
  );
};

export default Login;