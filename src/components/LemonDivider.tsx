import React, { useRef, useEffect, useState } from 'react';
import './LemonDivider.css';

interface LemonDividerProps {
  position: 'left' | 'right';
}

const LemonDivider: React.FC<LemonDividerProps> = ({ position }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`lemon-divider ${position} ${visible ? 'visible' : ''}`}
    >
      <div className="lemon-branch-container">
        <div className="lemon-branch"></div>
      </div>
    </div>
  );
};

export default LemonDivider;