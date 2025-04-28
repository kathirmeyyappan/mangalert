import React from 'react';
import './LoadingScreen.css';
import gintamaGif from '../assets/gintama.gif';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <img 
          src={gintamaGif} 
          alt="Loading..." 
          className="loading-gif"
        />
        <h2>Finding your recently completed plan-to-read/watch manga/anime...</h2>
      </div>
    </div>
  );
};

export default LoadingScreen; 