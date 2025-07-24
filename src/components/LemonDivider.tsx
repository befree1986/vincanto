import React, { useEffect, useRef, useState } from 'react';
import './LemonDivider.css';

interface LemonDividerProps {
  position: 'left' | 'right';
}

const LemonDivider: React.FC<LemonDividerProps> = ({ position }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    });

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`lemon-divider ${position} ${isVisible ? 'visible' : ''}`}
    >
      <div className="lemon-branch-container">
        <div className="lemon-branch"></div>
      </div>
    </div>
  );
};

export default LemonDivider;