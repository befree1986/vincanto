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
      <ParallaxBackground imageUrl="/welcome.jpg">
        <div className="hero-content">
          <div className="hero-bar"></div>
          <img src="/logo.svg" alt="Vincanto Logo" className="hero-logo" />
          <h2>
            {t('Un angolo di paradiso tra i limoni della Costiera Amalfitana')}
          </h2>
          <a href="#booking" className="btn btn-accent">
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
              {t('una struttura ricettiva nata da una completa ristrutturazione e immerso nella quiete di un profumato limoneto. Qui lusso, comfort e natura si incontrano per offrirti un soggiorno rigenerante.')}
            </p>
            <a href="#about" className="btn">
              {t('Scopri di più')}
            </a>
          </div>
          <div className="welcome-image">
            <img src="/esterni/ingressoindex.jpg" alt="Vincanto" className="img-fluid" />
          </div>
        </div>
        
        <div className="highlights-section">
          <h2 className="section-title">
            {t('Punti Salienti della Proprietà')}
          </h2>

          {/* Sezione "Perfetta per Ogni Ospite" a tutta larghezza */}
          <div 
            className="full-width-feature-card" 
            style={{ 
              background: '#f8f9fa', // Sfondo leggermente diverso per distinguerla
              padding: '2rem',        // Padding interno
              marginBottom: '2.5rem', // Spazio prima della griglia di card sottostante
              borderRadius: '8px',    // Bordi arrotondati
              boxShadow: '0 4px 8px rgba(0,0,0,0.05)', // Ombra leggera per dare profondità
              textAlign: 'center',    // Centra il testo e i blocchi inline/inline-block al suo interno
            }}
          >
            <div className="feature-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <span className="feature-icon" style={{ fontSize: '2.0rem', marginRight: '1rem' }}>👨‍👩‍👧‍👦</span> {/* Ridotta dimensione icona */}
              <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 600 }}>{t('Perfetta per Ogni Ospite')}</h3> {/* Ridotta dimensione titolo */}
            </div>
            <p style={{ fontSize: '1.0rem', lineHeight: '1.65', color: '#333', margin: '0' /* Rimuove margini default del paragrafo */ }}> {/* Ridotta dimensione testo e interlinea */}
              {t('Perfetta per famiglie, gruppi di amici, coppie e chiunque desideri una pausa rigenerante nella quiete della Costiera Amalfitana, senza rinunciare al comfort.')}
            </p>
            <p>
              {t('🤝 Il proprietario è sempre presente per garantire un\'accoglienza calorosa e un supporto costante durante la vostra permanenza')}
            </p>
          </div>

          <div className="highlights-grid">
            {/* Le altre card rimangono qui */}
            <div className="highlight-card" style={{ background: '#f8f9fa' }}>
              <div className="highlight-icon">🛏</div>
              <h2>
                {t('Comfort e accoglienza')}
              </h2>
              <p>
                {t('• 3 camere da letto climatizzate, luminose e arredate con gusto')}
                </p>
                <p>
                {t('• 3 bagni moderni di cui 2 con spaziosi piatti doccia')}
                </p>
                <p>
                  {t('• Smart TV in ogni camera per un intrattenimento completo')}
                </p>
            </div>
            <div className="highlight-card" style={{ background: '#f8f9fa' }}>
              <div className="highlight-icon">🏠</div>
              <h2>
                {t('Alloggio di Lusso')}
              </h2>
              <p>
                {t('• Zona giorno con ampio open space con divano letto e cucina completamente attrezzata')}
                </p>
                <p>
                {t('• Internet gratuito in tutta la casa con collegamento Wi-Fi veloce e ingressi Ethernet LAN')}
                </p>
                <p>
                {t('• Aria condizionata in ogni zona della struttura')}
                </p>
            </div>
            <div className="highlight-card" style={{ background: '#f8f9fa' }}>
              <div className="highlight-icon">🌞</div>
              <h2>
                {t('Spazi esterni esclusivi')}
              </h2>
              <p>
                {t("• Cucina esterna coperta per pranzi e cene all’aperto.")}
              </p>
              <p>{t('• Forno a legna tradizionale e barbecue')}
              </p>
              <p>
                {t('• Doccia esterna, perfetta per rinfrescarsi dopo una giornata di mare o escursioni')}
              </p>
            </div>
            <div className="highlight-card" style={{ background: '#f8f9fa' }}>
              <div className="highlight-icon">📍</div>
              <h2>
                {t('Posizione Unica')}
              </h2>
              <p>
                {t('La struttura si trova in una zona collinare tranquilla, immersa nel verde. Accessibile tramite 200 gradini utilizzata dalle formichelle, trasporitatrice di limoni. Un’esperienza autentica e una vista indimenticabile, ideale per gli amanti della quiete.')}
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