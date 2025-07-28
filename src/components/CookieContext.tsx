// src/components/CookieContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Preferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
};

type CookieContextType = {
  showCookieBanner: boolean;
  setShowCookieBanner: (value: boolean) => void;
  showPreferences: boolean;
  setShowPreferences: (value: boolean) => void;
  userPreferences: Preferences;
  setUserPreferences: (prefs: Preferences) => void;
};

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export const CookieProvider = ({ children }: { children: ReactNode }) => {
  const [showCookieBanner, setShowCookieBanner] = useState(true);
  const [showPreferences, setShowPreferences] = useState(false);
  const [userPreferences, setUserPreferences] = useState<Preferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  return (
    <CookieContext.Provider
      value={{
        showCookieBanner,
        setShowCookieBanner,
        showPreferences,
        setShowPreferences,
        userPreferences,
        setUserPreferences,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
};

export const useCookieContext = (): CookieContextType => {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error('useCookieContext deve essere usato all’interno di <CookieProvider>');
  }
  return context;
};