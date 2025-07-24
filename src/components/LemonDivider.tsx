import React, { useEffect, useRef, useState } from 'react';

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

  const style: React.CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? 'translateX(0) rotate(0deg)'
      : position === 'left'
      ? 'translateX(-80px) rotate(-3deg)'
      : 'translateX(80px) rotate(3deg)',
    transition: 'opacity 0.7s ease, transform 0.7s ease',
  };

  return (
    <div ref={ref} className={`lemon-divider ${position}`} style={style}>
      <div className="lemon-branch-container">
        <div className="lemon-branch"></div>
      </div>
    </div>
  );
};

export default LemonDivider;