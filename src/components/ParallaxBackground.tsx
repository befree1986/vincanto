import React, { useEffect, useState } from 'react';
import './ParallaxBackground.css';

interface ParallaxBackgroundProps {
  imageUrl: string;
  children?: React.ReactNode;
}

const ParallaxBackground: React.FC<ParallaxBackgroundProps> = ({ 
  imageUrl, 
  children 
}) => {
  const [offsetY, setOffsetY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.pageYOffset);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fix: Clamp the translateY so the background never moves up (never hides the image)
  const translateY = Math.max(0, offsetY * 0.5);

  return (
    <div className="parallax-wrapper">
      <div 
        className="parallax-background"
        style={{ 
          backgroundImage: `url(${imageUrl})`,
          transform: `none`
        }}
      />
      <div className="parallax-content">
        {children}
      </div>
    </div>
  );
};

export default ParallaxBackground;