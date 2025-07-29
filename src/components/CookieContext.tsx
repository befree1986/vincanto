import React, { createContext, useContext, useState, useEffect } from 'react';

export const CookieContext = createContext();

export const CookieProvider = ({ children }) => {
  const [showBanner, setShowBanner] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);
  const [userPreferences, setUserPreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('userPreferences');
    if (saved) {
      setUserPreferences(JSON.parse(saved));
      setShowBanner(false);
    }
  }, []);

  const setConsent = (accepted) => {
    if (accepted) {
      const fullConsent = { essential: true, analytics: true, marketing: true };
      setUserPreferences(fullConsent);
      localStorage.setItem('userPreferences', JSON.stringify(fullConsent));
    } else {
      const minimal = { essential: true, analytics: false, marketing: false };
      setUserPreferences(minimal);
      localStorage.setItem('userPreferences', JSON.stringify(minimal));
    }
    setShowBanner(false);
  };

  const savePreferences = (prefs) => {
    setUserPreferences(prefs);
    localStorage.setItem('userPreferences', JSON.stringify(prefs));
    setShowPreferences(false);
    setShowBanner(false);
  };

  return (
    <CookieContext.Provider
      value={{
        showBanner,
        setShowBanner,
        showPreferences,
        setShowPreferences,
        userPreferences,
        setConsent,
        savePreferences,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
};

export const useCookieContext = () => useContext(CookieContext);