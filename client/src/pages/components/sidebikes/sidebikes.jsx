import React from 'react';
import './sidebikes.css'; // Import your CSS Module
import BikeTile from './biketile';

const SideBikes = ({ bikesInView }) => {
  const containerClass = bikesInView.length > 0 ? 'side-bikes' : 'side-bikes no-bikes';

  return (
    <div className={containerClass}>
      {bikesInView.length > 0 ? (
        bikesInView.map((bike, index) => (
          <BikeTile key={index} bike={bike} />
        ))
      ) : (
        <p className={containerClass}>No bikes available for your search. Try zooming out the map and exploring New Zealand!</p> // This will be rendered if bikesInView is empty
      )}
    </div>
  );
}

export default SideBikes;