import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
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
    </header>
  );
};

export default Navbar;