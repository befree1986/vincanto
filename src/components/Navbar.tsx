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
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className={`navbar${scrolled ? ' scrolled' : ' hidden'}`}>
      <div className="navbar-container">
        <div className="logo">
          <a href="#home">
            <img src="/logo.svg" alt="Vincanto" className="logo-img" />
          </a>
        </div>
        <nav className={`nav-menu ${isOpen ? 'active' : ''}`}>
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
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle Menu">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {/* Contenitore per il selettore della lingua, spostato qui */}
      <div className="language-selector-wrapper">
        <button onClick={() => i18n.changeLanguage('it')} aria-label="Italiano" className="language-flag-button">
          {/* Bandiera Italia SVG */}
          <svg width="20" height="20" viewBox="0 0 3 2"><rect width="1" height="2" x="0" y="0" fill="#008d46"/><rect width="1" height="2" x="1" y="0" fill="#fff"/><rect width="1" height="2" x="2" y="0" fill="#d2232c"/></svg>
        </button>
        <button onClick={() => i18n.changeLanguage('en')} aria-label="English" className="language-flag-button">
          {/* Bandiera UK SVG */}
          <svg width="20" height="20" viewBox="0 0 60 30"><clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><g clipPath="url(#s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 l60,30 M60,0 l-60,30" stroke="#fff" strokeWidth="6"/><path d="M0,0 l60,30 M60,0 l-60,30" stroke="#c8102e" strokeWidth="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/><path d="M30,0 v30 M0,15 h60" stroke="#c8102e" strokeWidth="6"/></g></svg>
        </button>
        <button onClick={() => i18n.changeLanguage('de')} aria-label="Deutsch" className="language-flag-button">
          {/* Bandiera DEU SVG */}
          <svg width="20" height="20" viewBox="0 0 5 3"><rect width="5" height="1" y="0" fill="#000000"/><rect width="5" height="1" y="1" fill="#FF0000"/><rect width="5" height="1" y="2" fill="#FFCC00"/></svg>
        </button>
        <button onClick={() => i18n.changeLanguage('fr')} aria-label="Français" className="language-flag-button">
          {/* Bandiera FR SVG */}
          <svg width="20" height="20" viewBox="0 0 3 2"><rect width="1" height="2" x="0" y="0" fill="#0055A4"/><rect width="1" height="2" x="1" y="0" fill="#FFFFFF"/><rect width="1" height="2" x="2" y="0" fill="#EF4135"/></svg>
        </button>
      </div>
    </header>
  );
};

export default Navbar;