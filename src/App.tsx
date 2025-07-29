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
import './App.css';

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

  // Al primo caricamento: recupera le preferenze dal localStorage
  useEffect(() => {
    const savedPrefs = localStorage.getItem('cookiePreferences');
    if (savedPrefs) {
      setPreferences(JSON.parse(savedPrefs));
      setHideBanner(true);
    }
  }, []);

  // Salva le preferenze e aggiorna lo stato
  const handleSavePreferences = (prefs: CookiePreferences) => {
    setPreferences(prefs);
    localStorage.setItem('cookiePreferences', JSON.stringify(prefs));
    console.log('Preferenze aggiornate:', prefs);
    setHideBanner(true);
  };

  // Accetta tutti i cookie (usato dal banner)
  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      analytics: true,
      marketing: true,
    };
    handleSavePreferences(allAccepted);
  };

  return (
    <div className="app">
      <Navbar />
      <main>
        <Home />
        <About />
        <Booking />
        <Contact />
      </main>

      {/* Pulsante modifica preferenze */}
      <div className="cookie-actions">
        <button onClick={() => setShowModal(true)}>
          Modifica preferenze cookie
        </button>
        <p className="cookie-status">
          Preferenze attuali: Analytics {preferences.analytics ? '✔' : '❌'}, Marketing {preferences.marketing ? '✔' : '❌'}
        </p>
      </div>

      {/* Modal delle preferenze */}
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
          />
        )}
        <Footer />
      </CookieProvider>

      <BackToTopButton />
    </div>
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