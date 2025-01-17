import React, { useEffect, useState } from 'react';
import "./paymentpage.css";
import {loadStripe} from "@stripe/stripe-js"
import {Elements} from "@stripe/react-stripe-js"
import { Navigate, useLocation } from 'react-router-dom';
import CheckoutForm from './CheckoutForm';
const PaymentPage = () =>{
    const [stripePromise, setStripePromise] = useState(null);
    const [clientSecret, setClientSecret ] = useState("");
    const location = useLocation();
    const { rentalId } = location.state || {};
    useEffect(() => {
        fetch("http://localhost:8800/config").then(async (r) =>{
            const {publishableKey} = await r.json();
          setStripePromise(loadStripe(publishableKey))
          })
      }, [Navigate]);
    
      useEffect(() => {
        fetch("http://localhost:8800/create-payment-intent", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json', // Set the content type to application/json
          },
          body: JSON.stringify({rentalId}),
        }).then(async (r) => {
            const {clientSecret} = await r.json();
            setClientSecret(clientSecret)
          })
      }, []);
      console.log(stripePromise)
      console.log(clientSecret)
    return (
        <div className='payment-box'>
          {stripePromise && clientSecret  &&(
    <Elements stripe={stripePromise} options={{clientSecret}}>
    <CheckoutForm 
    rentalId={rentalId}/>
  </Elements>
  )}
        </div>
    );
}

export default PaymentPage;