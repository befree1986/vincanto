import React, { useState } from "react";
import { useCookieContext } from "./CookieContext"; // Assicurati del path
import "./CookiePreferences.css";

type Preferences = {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
};

const CookiePreferences: React.FC = () => {
  const {
    showPreferences,
    setShowPreferences,
    savePreferences,
  } = useCookieContext();

  const [preferences, setPreferences] = useState<Preferences>({
    essential: true,       // sempre attivi
    analytics: false,
    marketing: false,
  });

  if (!showPreferences) return null;

  const handleChange = (key: keyof Preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    savePreferences(preferences);
  };

  return (
    <div className="cookie-preferences">
      <h2>Preferenze Cookie</h2>
      <p>Gestisci le categorie di cookie che vuoi abilitare:</p>

      <div className="preference-option">
        <label>
          <input
            type="checkbox"
            checked={preferences.essential}
            disabled
          />
          Cookie Essenziali (sempre attivi)
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