import React, { useState, useEffect } from "react";
import { useCookieContext } from "./CookieContext";
import CookiePreferences from "./CookiePreferences";
import "./CookieBanner.css";

const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const { showPreferences, setShowPreferences } = useCookieContext();

  useEffect(() => {
    const savedConsent = localStorage.getItem("cookieConsent");
    console.log("Consent salvato:", savedConsent); // Debug temporaneo
    if (!savedConsent) {
      setVisible(true);
    }
  }, []);

  const handleConsent = (choice: string) => {
    localStorage.setItem("cookieConsent", choice);
    setVisible(false);
    setShowPreferences(false);
  };

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
              <button onClick={() => handleConsent("accepted")}>Accetta</button>
              <button onClick={() => handleConsent("rejected")}>Rifiuta</button>
              <button onClick={() => {
                console.log("Apertura preferenze"); // Debug temporaneo
                setShowPreferences(true);
              }}>Personalizza</button>
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