import React, { useState } from "react";
import { useCookieContext } from "./CookieContext"; // Assicurati del path
import "./CookiePreferences.css";

export interface Preferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookiePreferences: React.FC = () => {
  const {
    showPreferences,
    setShowPreferences,
    setUserPreferences,
  } = useCookieContext();

  const [preferences, setPreferences] = useState<Preferences>({
    necessary: true,       // sempre attivi
    analytics: false,
    marketing: false,
  });

  // Se il pannello non deve essere visibile, non renderizzare nulla
  if (!showPreferences) return null;

  const handleChange = (key: keyof Preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    setUserPreferences(preferences);      // salva preferenze nel contesto
    setShowPreferences(false);            // chiude il pannello
    // opzionale: mostra un messaggio di conferma
  };

  return (
    <div className="cookie-preferences">
      <h2>Preferenze Cookie</h2>
      <p>Gestisci le categorie di cookie che vuoi abilitare:</p>

      <div className="preference-option">
        <label>
          <input type="checkbox" checked={true} disabled />
          Cookie Necessari (sempre attivi)
        </label>
      </div>

      <div className="preference-option">
        <label>
          <input
            type="checkbox"
            checked={preferences.analytics}
            onChange={() => handleChange("analytics")}
          />
          Cookie Analitici
        </label>
      </div>

      <div className="preference-option">
        <label>
          <input
            type="checkbox"
            checked={preferences.marketing}
            onChange={() => handleChange("marketing")}
          />
          Cookie di Marketing
        </label>
      </div>

      <button className="save-btn" onClick={handleSave}>Salva Preferenze</button>
      <button className="close-btn" onClick={() => setShowPreferences(false)}>Chiudi</button>
    </div>
  );
};

export default CookiePreferences;