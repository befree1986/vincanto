// src/components/CookieBanner.tsx
import React, { useState, useEffect } from "react";
import CookiePreferences from "./CookiePreferences";
import "./CookieBanner.css";
import type { Preferences } from "./CookiePreferences";

const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [consent, setConsent] = useState<string | null>(null);
  const [showPreferences, setShowPreferences] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem("cookieConsent");
    if (!savedConsent) {
      setVisible(true);
    }
  }, []);

  const handleConsent = (choice: string) => {
    localStorage.setItem("cookieConsent", choice);
    setConsent(choice);
    setVisible(false);
    // Qui potresti attivare cookie tecnici o script esterni
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
              <button onClick={() => setShowPreferences(true)}>Personalizza</button>
            </div>
          </div>
        </div>
      )}

      {showPreferences && (
        <CookiePreferences
          onSave={(prefs: Preferences) => {
            localStorage.setItem("cookieConsent", JSON.stringify(prefs));
            setConsent("customized");
            setVisible(false);
            setShowPreferences(false);
            // Esegui logiche in base alle preferenze salvate
          }}
        />
      )}
    </>
  );
};

export default CookieBanner;