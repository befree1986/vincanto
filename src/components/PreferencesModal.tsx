import { useState } from 'react';
import './PreferencesModal.css';

interface CookiePreferences {
  analytics: boolean;
  marketing: boolean;
}

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: CookiePreferences) => void;
  
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;
  console.log('Modal mount:', { isOpen });

  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  const handleSave = () => {
    onSave({ analytics, marketing });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Impostazioni Cookie</h2>
        <p>Personalizza le preferenze di tracciamento per un'esperienza su misura.</p>

        <label>
          <input
            type="checkbox"
            checked={analytics}
            onChange={() => setAnalytics(!analytics)}
          />
          Analytics
        </label>

        <label>
          <input
            type="checkbox"
            checked={marketing}
            onChange={() => setMarketing(!marketing)}
          />
          Marketing
        </label>

        <button onClick={handleSave}>Salva</button>
        <button onClick={onClose}>Annulla</button>
      </div>
    </div>
  );
};

export default PreferencesModal;