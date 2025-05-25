import React, { useEffect } from 'react';
import ParallaxBackground from '../components/ParallaxBackground';
import LemonDivider from '../components/LemonDivider';
import './Home.css';
import { useTranslation } from 'react-i18next';

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    document.title = 'VINCANTO | Casa Vacanza Maiori';
  }, []);

  return (
    <section id="home" className="home-section">
      {/* Selettore lingua in alto a destra */}
      <div style={{ position: 'absolute', top: 24, right: 32, zIndex: 10, display: 'flex', gap: 8 }}>
        <button onClick={() => i18n.changeLanguage('it')} aria-label="Italiano" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          {/* Bandiera Italia SVG */}
          <svg width="28" height="24" viewBox="0 0 3 2"><rect width="1" height="2" x="0" y="0" fill="#008d46"/><rect width="1" height="2" x="1" y="0" fill="#fff"/><rect width="1" height="2" x="2" y="0" fill="#d2232c"/></svg>
        </button>
        <button onClick={() => i18n.changeLanguage('en')} aria-label="English" className="language-selector-button">
          {/* Bandiera UK SVG */}
          <svg width="28" height="24" viewBox="0 0 60 30"><clipPath id="s"><path d="M0,0 v30 h60 v-30 z"/></clipPath><g clipPath="url(#s)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 l60,30 M60,0 l-60,30" stroke="#fff" strokeWidth="6"/><path d="M0,0 l60,30 M60,0 l-60,30" stroke="#c8102e" strokeWidth="4"/><path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/><path d="M30,0 v30 M0,15 h60" stroke="#c8102e" strokeWidth="6"/></g></svg>
        </button>
        <button onClick={() => i18n.changeLanguage('de')} aria-label="Deutsch" className="language-selector-button">
          {/* Bandiera DEU  SVG */}
          <svg width="28" height="24" viewBox="0 0 5 3"><rect width="5" height="1" y="0" fill="#000000"/><rect width="5" height="1" y="1" fill="#FF0000"/><rect width="5" height="1" y="2" fill="#FFCC00"/></svg>
        </button>
      </div>
      <ParallaxBackground imageUrl="/welcome.jpg">
        <div className="hero-content">
          <div className="hero-bar"></div>
          <img src="/logo.svg" alt="Vincanto Logo" className="hero-logo" />
          <h2>
            {t('Un angolo di paradiso tra i limoni della Costiera Amalfitana')}
          </h2>
          <a href="#contact" className="btn btn-accent">
            {t('Prenota Ora')}
          </a>
        </div>
      </ParallaxBackground>
      
      <div className="container">
        <div className="welcome-section">
          <div className="welcome-text">
            <h2>
              {t('Benvenuti a VINCANTO')}
            </h2>
            <p>
              {t('un rifugio esclusivo nato da una completa ristrutturazione e immerso nella quiete di un profumato limoneto. Qui lusso, comfort e natura si incontrano per offrirti un soggiorno rigenerante.')}
            </p>
            <a href="#about" className="btn">
              {t('Scopri di più')}
            </a>
          </div>
          <div className="welcome-image">
            <img src="https://lh3.googleusercontent.com/p/AF1QipPM8TeeZ26vR6-HJVwG1FBZ63G6xj5ujSyJZI4N=s680-w680-h510-rw" alt="Vincanto" className="img-fluid" />
          </div>
        </div>
        
        <div className="highlights-section">
          <h2 className="section-title">
            {t('Punti Salienti della Proprietà')}
          </h2>
          <div className="highlights-grid">
            <div className="highlight-card">
              <div className="highlight-icon">🍋</div>
              <h3>
                {t('Accesso al Limone')}
              </h3>
              <p>
                {t('Esplora i nostri limoneti privati con splendide viste sulla costa')}
              </p>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">🏠</div>
              <h3>
                {t('Alloggio di Lusso')}
              </h3>
              <p>
                {t('3 camere da letto king-size e 2 bagni moderni')}
              </p>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">🌅</div>
              <h3>
                {t('Terrazza Privata')}
              </h3>
              <p>
                {t("Perfetto per indimenticabili serate all'aperto circondati dal verde, con doccia esterna rinfrescante.")}
              </p>
            </div>
            <div className="highlight-card">
              <div className="highlight-icon">🍽️</div>
              <h3>
                {t('Cucina Gourmet')}
              </h3>
              <p>
                {t('Cucina in muratura completamente attrezzata con forno a legna tradizionale e BBQ')}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <LemonDivider position="right" />
    </section>
  );
};

export default Home;