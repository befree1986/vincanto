import React, { useState } from "react";
import "./CookieBanner.css";

interface Preferences {
  analytics: boolean;
  marketing: boolean;
}

interface Props {
  initialPreferences: Preferences;
  onSave: (prefs: Preferences) => void;
  onClose: () => void;
}

const CookiePreferences: React.FC<Props> = ({ initialPreferences, onSave, onClose }) => {
  const [prefs, setPrefs] = useState(initialPreferences);

  const handleToggle = (key: keyof Preferences) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="cookie-preferences">
      <h2>Preferenze Cookie</h2>

      <div className="preference-option">
        <label>
          <input
            type="checkbox"
            checked={prefs.analytics}
            onChange={() => handleToggle("analytics")}
          />
          Cookie Analitici
        </label>
      </div>

      <div className="preference-option">
        <label>
          <input
            type="checkbox"
            checked={prefs.marketing}
            onChange={() => handleToggle("marketing")}
          />
          Cookie di Marketing
        </label>
      </div>

      <button className="save-btn" onClick={() => onSave(prefs)}>Salva Preferenze</button>
      <button className="save-btn" style={{ marginLeft: "1rem", backgroundColor: "#999" }} onClick={onClose}>
        Annulla
      </button>
    </div>
  );
};

export default CookiePreferences;