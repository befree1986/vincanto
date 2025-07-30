import React from 'react';
import './CookieBanner.css';


interface CookieBannerProps {
  onClose: () => void;
  onAccept: () => void;
  onCustomize: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onClose, onAccept, onCustomize }) => {
  return (
    <div className="cookie-banner">
      <p>
        Utilizziamo i cookie per migliorare la tua esperienza. Puoi accettare tutti, rifiutarli o personalizzare le tue preferenze.
      </p>
      <div className="cookie-actions">
        <button onClick={onAccept}>Accetta</button>
        <button onClick={onClose}>Rifiuta</button>
        <button onClick={onCustomize}>Personalizza</button>
      </div>
    </div>
  );
};

export default CookieBanner;