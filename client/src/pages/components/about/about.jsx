import React from 'react';
import './about.css'; // Import your CSS Module

function About() {
  return (
    <div className='info'>
        <div className='about'>
            <div className='text'>
            <h2>Bike Swap</h2>
            <p>Bike Swap was created to fill a need for helping other riders travel how we like, on two wheels, all over New Zealand. Our vision is to give all those the ability to experience our country the best way possible and give private owners the ability to turn their weekend toys into a profitable business.</p>
            <h2>Why us?</h2>
            <p>We at Bike Swap aim for all users to have a safe access into motorbiking in New Zealand, with vehicles screened and checked that they are up to a level fitting of New Zealand Roads. We also want to protect our members and their bikes, with giving the power to accept of reject rides, the power is in our owners hands.</p>
            
            </div>
            <div className='image'>
                <img src='./images/rider.jpg'/>
            </div>
        </div>
       
    </div>
  );
}

export default About;
