import React from 'react';
import './ParallaxBackground.css';

interface ParallaxBackgroundProps {
  imageUrl: string;
  children?: React.ReactNode;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ imageUrl, children }) => {
  return (
    <div className="parallax-wrapper">
      <div
        className="parallax-background"
        style={{ backgroundImage: `url(${imageUrl})` }}
      ></div>
      <div className="parallax-content">
        {children}
      </div>
    </div>
  );
};

export default ParallaxBackground;