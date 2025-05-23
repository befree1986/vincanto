import Navbar from './components/Navbar';
import Home from './sections/Home';
import About from './sections/About';
import Booking from './sections/Booking';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import { ArrowUp } from 'lucide-react';
import './App.css';
import React, { useEffect, useState } from 'react';

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
      <Footer />
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
      className="back-to-top-btn"
      style={{
        position: 'fixed',
        right: '2rem',
        bottom: '2.5rem',
        zIndex: 9999,
        background: 'var(--terracotta)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '48px',
        height: '48px',
        boxShadow: 'var(--shadow-lg)',
        display: visible ? 'flex' : 'none',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'opacity 0.4s',
        opacity: visible ? 1 : 0,
      }}
      aria-label="Torna su"
    >
      <ArrowUp size={28} />
    </button>
  );
};

export default App;