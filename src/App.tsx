import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './sections/Home';
import About from './sections/About';
import Booking from './sections/Booking';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import PreferencesModal from './components/PreferencesModal';
import { CookieProvider } from './components/CookieContext';
import { ArrowUp } from 'lucide-react';
import CookiePolicy from './pages/CookiePolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import Accessibility from './pages/Accessibility';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Analytics } from "@vercel/analytics/react";
import GoogleAnalytics from "./utils/GoogleAnalytics";


interface CookiePreferences {
  analytics: boolean;
  marketing: boolean;
}

function App() {
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    analytics: false,
    marketing: false,
  });
  const [hideBanner, setHideBanner] = useState(false);

  useEffect(() => {
    const savedPrefs = localStorage.getItem('cookiePreferences');
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
      setHideBanner(true);
    }
  }, []);

  const handleSavePreferences = (prefs: CookiePreferences) => {
    setPreferences(prefs);
    localStorage.setItem('cookiePreferences', JSON.stringify(prefs));
    console.log('Preferenze aggiornate:', prefs);
    setHideBanner(true);
  };

  const handleAcceptAll = () => {
    handleSavePreferences({ analytics: true, marketing: true });
  };

  return (
    <>

  {/* Google Analytics pageview tracking, solo se accettato */}
  {preferences.analytics && <GoogleAnalytics />}
  <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <About />
              <Booking />
              <Contact />
            </>
          }
        />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-conditions" element={<TermsConditions />} />
        <Route path="/accessibility" element={<Accessibility />} />
      </Routes>

      {hideBanner && !showModal && (
        <div className="cookie-actions">
          <button className="cookie-edit-btn" onClick={() => setShowModal(true)}>
            Modifica preferenze cookie
          </button>
          <p className="cookie-status">
            Preferenze attuali: Analytics {preferences.analytics ? '✔' : '❌'}, Marketing {preferences.marketing ? '✔' : '❌'}
          </p>
        </div>
      )}

      {showModal && (
        <PreferencesModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSavePreferences}
          initialPreferences={preferences}
        />
      )}

      <CookieProvider>
        {!hideBanner && (
          <CookieBanner
            onClose={() => setHideBanner(true)}
            onAccept={handleAcceptAll}
            onCustomize={() => {
              setShowModal(true);
              setHideBanner(true);
            }}
          />
        )}
        <Footer />
      </CookieProvider>

      <BackToTopButton />
      <Analytics />
    </>
  );
}

const BackToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`back-to-top-btn ${visible ? 'visible' : ''}`}
      aria-label="Torna su"
    >
      <ArrowUp size={28} />
    </button>
  );
};

export default App;