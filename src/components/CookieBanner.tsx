import React, { useState, useEffect } from "react";
import CookiePreferences from "./CookiePreferences";
import "./CookieBanner.css";

interface CookieBannerProps {
    onClose: () => void;
    onAccept: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({onClose, onAccept}) => {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem("cookieConsent");
    if (!savedConsent) {
      setVisible(true);
    }
  }, []);

  if (!visible && !showPreferences) return null;

  return (
    <>
      {visible && (
        <div className="cookie-banner">
          <div className="cookie-content">
            <p>
              Usiamo i cookie per migliorare l'esperienza utente. Puoi accettare, rifiutare o personalizzare le preferenze. Leggi la{" "}
              <a href="/cookie-policy" target="_blank">Cookie Policy</a>.
            </p>
          <div className="cookie-actions">
            <button onClick={()=> {
                localStorage.setItem("cookieConsent", "accept");
                onAccept();
            }}>Accetta</button>
            <button onClick={() => {
                localStorage.setItem("cookieConsent", "rejected");
                onClose();
            }}>Rifiuta</button>

            <button onClick={() => setShowPreferences(true)}>Personalizza</button>
            </div>
          </div>
        </div>
      )}

      {showPreferences && (
        <CookiePreferences />
      )}
    </>
  );
};

export default CookieBanner;