// src/components/CookieBanner.tsx
import React, { useState, useEffect } from "react";
import "./CookieBanner.css";

const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [consent, setConsent] = useState<string | null>(null);

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
    // Qui potresti attivare cookie tecnici o di terze parti se serve
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner">
      <div className="cookie-content">
        <p>
          Usiamo i cookie per migliorare l'esperienza utente. Puoi accettare, rifiutare o personalizzare le preferenze. Leggi la <a href="/cookie-policy" target="_blank">Cookie Policy</a>.
        </p>
        <div className="cookie-actions">
          <button onClick={() => handleConsent("accepted")}>Accetta</button>
          <button onClick={() => handleConsent("rejected")}>Rifiuta</button>
          <button onClick={() => handleConsent("customized")}>Personalizza</button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;