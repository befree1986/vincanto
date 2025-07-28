import { createContext, useContext, useState } from "react";

const CookieContext = createContext();

export const useCookieContext = () => useContext(CookieContext);

export const CookieProvider = ({ children }) => {
  const [showPreferences, setShowPreferences] = useState(false);

  return (
    <CookieContext.Provider value={{ showPreferences, setShowPreferences }}>
      {children}
    </CookieContext.Provider>
  );
};