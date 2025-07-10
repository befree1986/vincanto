import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ' hidden'}`}>
      <div className="navbar-container">
        <div className="logo">
          <a href="#home">
            <img src="/logo.svg" alt="Vincanto" className="logo-img" />
          </a>
        </div>

        <nav id="navMenu" className={`nav-menu ${isOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li><a href="#home" onClick={closeMenu}>{t('Home')}</a></li>
            <li><a href="#about" onClick={closeMenu}>{t('Chi Siamo')}</a></li>
            <li><a href="#proprieta" onClick={closeMenu}>{t('La Proprietà')}</a></li>
            <li><a href="#contact" onClick={closeMenu}>{t('Contatti')}</a></li>
          </ul>
          <a href="#booking" className="btn btn-navbar" onClick={closeMenu}>
            {t('Prenota Ora')}
          </a>
        </nav>

        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isOpen}
          aria-controls="navMenu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className="language-selector-wrapper">
        {['it', 'en', 'de', 'fr'].map(lang => (
          <button
            key={lang}
            onClick={() => i18n.changeLanguage(lang)}
            aria-label={lang}
            className="language-flag-button"
          >
            {/* Qui puoi inserire gli SVG delle bandiere come già fatto */}
          </button>
        ))}
      </div>

      {isOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
    </header>
  );
};

export default Navbar;