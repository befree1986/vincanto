import { useState, useEffect, useRef } from 'react';
import './PreferencesModal.css';
import { useTranslation } from 'react-i18next';

interface CookiePreferences {
  essential?: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (preferences: CookiePreferences) => void;
  initialPreferences: CookiePreferences;
}

const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPreferences,
}) => {
  const { t } = useTranslation();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    } else {
      previousFocus.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const [analytics, setAnalytics] = useState(initialPreferences.analytics);
  const [marketing, setMarketing] = useState(initialPreferences.marketing);

  const handleSave = () => {
    onSave({
      essential: initialPreferences.essential ?? true,
      analytics,
      marketing
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-card" onClick={(e) => e.stopPropagation()} ref={modalRef} tabIndex={-1}>
        <h2 id="modal-title" className="modal-title">{t('cookie.prefs.title')}</h2>
        <p className="modal-description">
          {t('cookie.prefs.description')}
        </p>

        <div className="modal-checkboxes">
          <label>
            <input
              type="checkbox"
              checked={analytics}
              onChange={() => setAnalytics(!analytics)}
            />
            {t('cookie.prefs.analytics')}
          </label>

          <label>
            <input
              type="checkbox"
              checked={marketing}
              onChange={() => setMarketing(!marketing)}
            />
            {t('cookie.prefs.marketing')}
          </label>
        </div>

        <div className="modal-actions">
          <button className="btn-outline" onClick={onClose}>{t('cookie.prefs.cancel')}</button>
          <button className="btn-filled" onClick={handleSave}>{t('cookie.prefs.save')}</button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesModal;