import { useEffect } from 'react';
import { useCookieContext } from './CookieContext';

const CookieController = () => {
  const { setConsent } = useCookieContext();

  useEffect(() => {
    const saved = localStorage.getItem('userPreferences');
    if (!saved) {
      // Optional: autodecline on no action after X seconds
    }
  }, []);

  return null;
};

export default CookieController;