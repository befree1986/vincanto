// src/components/CookiePreferences.tsx
import React, { useState } from "react";
import "./CookiePreferences.css";

interface Preferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface Props {
  onSave: (prefs: Preferences) => void;
}

const CookiePreferences: React.FC<Props> = ({ onSave }) => {
  const [preferences, setPreferences] = useState<Preferences>({
    necessary: true, // sempre abilitati
    analytics: false,
    marketing: false,
  });

  const handleChange = (key: keyof Preferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    onSave(preferences);
  };

  return (
    <div className="cookie-preferences">
      <h2>Preferenze Cookie</h2>
      <p>Gestisci le categorie di cookie che vuoi abilitare:</p>

      <div className="preference-option">
        <label>
          <input type="checkbox" checked={true} disabled />
          Cookie Necessari (obbligatori)
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
    </div>
  );
};

export default CookiePreferences;