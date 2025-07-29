import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Home from './sections/Home';
import About from './sections/About';
import Booking from './sections/Booking';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import { CookieProvider } from './components/CookieContext';
import { ArrowUp } from 'lucide-react';
import './App.css';

function App() {
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