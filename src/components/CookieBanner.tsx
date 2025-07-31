import React from 'react';
import './CookieBanner.css';
import { Link } from 'react-router-dom';


interface CookieBannerProps {
  onClose: () => void;
  onAccept: () => void;
  onCustomize: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onClose, onAccept, onCustomize }) => {
  return (
    <div className="cookie-banner">
      <p>
        Utilizziamo cookie per migliorare la tua esperienza. Puoi accettare tutti, rifiutarli o personalizzare le preferenze.
        Consulta la nostra <Link to="/cookie-policy" target="_blank">Cookie Policy</Link>.
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