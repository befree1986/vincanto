import React from 'react';
import './LemonDivider.css';

interface LemonDividerProps {
  position: 'left' | 'right';
}

const LemonDivider: React.FC<LemonDividerProps> = ({ position }) => {
  return (
    <div className={`lemon-divider ${position}`}>
      <div className="lemon-branch-container">
        <div className="lemon-branch"></div>
      </div>
    </div>
  );
};

export default LemonDivider;