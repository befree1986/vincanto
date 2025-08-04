import React, { useEffect, useRef } from 'react';
import './CookieBanner.css';
import { Link } from 'react-router-dom';

interface CookieBannerProps {
  onClose: () => void;
  onAccept: () => void;
  onCustomize: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onClose, onAccept, onCustomize }) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Salvo l’elemento attivo prima dell’apertura
    previousFocus.current = document.activeElement as HTMLElement;

    // Focus sul banner
    bannerRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('ESC premuto, chiudere banner');
        previousFocus.current?.focus(); // restituisce il focus
        onClose(); // chiude il banner
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-banner-title"
      className="cookie-banner"
      ref={bannerRef}
      tabIndex={-1}
    >
      <h2 id="cookie-banner-title">
        Informativa sui Cookie
      </h2>
      <p>
        Utilizziamo cookie per migliorare la tua esperienza. Puoi accettare tutti, rifiutarli o personalizzare le preferenze.
        Consulta la nostra <Link to="/cookie-policy" target="_blank">Cookie Policy</Link>.
      </p>
      <div className="cookie-actions">
        <button onClick={onAccept} aria-label="Accetta tutti i cookie">Accetta Tutti</button>
        <button onClick={onClose} aria-label="Accetta solo i cookie essenziali">Accetta Essenziali</button>
        <button onClick={onCustomize} aria-label="Personalizza preferenze cookie">Personalizza</button>
      </div>
    </div>
  );
};

export default CookieBanner;