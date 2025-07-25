import React, { useRef, useEffect, useState } from 'react';
import './LemonDivider.css';

interface LemonDividerProps {
  position?: 'left' | 'right';
}

const LemonDivider: React.FC<LemonDividerProps> = ({ position = 'left' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [out, setOut] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        setOut(!entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`lemon-divider ${position} ${visible ? 'visible' : ''} ${
        out ? 'out' : ''
      }`}
    >
      {/* ...contenuto divider... */}
    </div>
  );
};

export default LemonDivider;