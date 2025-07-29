import Navbar from './components/Navbar';
import Home from './sections/Home';
import About from './sections/About';
import Booking from './sections/Booking';
import GuestFeedback from './components/GuestFeedback';
import Contact from './sections/Contact';
import CookieBanner from './components/CookieBanner';
import { CookieProvider } from './components/CookieContext';
import CookieCOntroller from './components/CookieController';
import CookiePreferences from './components/CookieBanner';
import Footer from './components/Footer';
import { ArrowUp } from 'lucide-react';
import './App.css';
import React, { useEffect, useState } from 'react';


function App() {
  // Removed useCookiePreferences as it does not exist
  
  return (
    <div className="app">
      <Navbar />
      <main>
        <Home />
        <About />
        <Booking />
        <Contact />
      </main>
      <CookieProvider>
      <CookieBanner />
      {/* Removed showPreferences and CookiePreferences usage since useCookiePreferences is not defined */}
      <Footer />
      </CookieProvider>
      
      {/* Bottone Torna su */}
      <BackToTopButton />
      {/* RIMOSSO: selezione lingua, ora solo in Navbar */}
    </div>
  );
}

// Bottone Torna su
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