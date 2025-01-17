import React, {useState, useEffect} from 'react';
import './info.css'; // Import your CSS Module

function Info() {
    
    
  return (
    <div className='info'>
        <div className='entry'>
            <div className='text'>
            <h2>Your Entry Into Earning From Your Bikes</h2>
            <p>Putting your bike into action when you aren’t using it, with New Zealand’s trusted Rental Sharing marketplace</p>
            <button className="infobutton">Learn more</button>
            </div>
            <div className='image'>
                <img src='./images/bike.jpg' alt='Biker'/>
            </div>
        </div>
        <div className="work">
            <div className='image'>
                <img src='./images/Vertical.webp' alt='Biker'/>
            </div>
            <div className="text">
                <div className="centered">
                    <h2>How We Work</h2>
                    <p>We’re here to help you</p>
           </div>
             <ol className="custom-list">
                <li>
                    <h4>List your Bike with us</h4>
                    <p>After signing up with us, you’ll be able to register your ride, determining the costs and when it works for you</p>
                </li>
                <li>
                    <h4>Riders request to book your bike</h4>
                    <p>We will provide who’s wanting to ride your bike, with their country and drivers licence, you decide who rides.</p>
                </li>
                <li>
                    <h4>Meeting your renter</h4>
                    <p>Once accepted, you can meet your renter at a location that works for you. Handing over your bike for them to enjoy their journey</p>
                </li>
                <li>
                    <h4>Returning your bike</h4>
                    <p>They will return your bike on the agreed upon date. Follow our steps to finish a rental and earn!</p>
                </li>
            </ol>
            </div>
        </div>
    </div>
  );
}

export default Info;
