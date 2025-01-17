import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; // Adjust the import path as necessary

const RouteChangeListener = () => {
  const { dispatch } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [, forceUpdate] = useState();

  useEffect(() => {
    
    const checkAndLogout = () => {
        // console.log("hello")
      // Your condition check here
      const loginTime = localStorage.getItem('loginTime');
      const currentTime = new Date().getTime();
      // console.log(loginTime + "\n" + currentTime)
      // console.log(currentTime - loginTime  + "\nTime needed\n" + 30 *60 * 10000)
      if (loginTime && currentTime - loginTime  > 30 *60 *  10000) {
        console.log("logout")
        dispatch({ type: 'LOGOUT' });
        navigate('/login');
      }
    };

    checkAndLogout();
    // Force update on route change
    forceUpdate({});
  }, [location, dispatch, navigate]); // location included to trigger re-render on route change

  return null;
};

export default RouteChangeListener;