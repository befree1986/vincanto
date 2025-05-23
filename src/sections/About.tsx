import React from 'react';
import ParallaxBackground from '../components/ParallaxBackground';
import LemonDivider from '../components/LemonDivider';
import Propriety from './Propriety';
import './About.css';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section id="about" className="about-section">
      <ParallaxBackground imageUrl="https://www.italia.it/content/dam/tdh/en/destinations/campania/salerno/maiori/media/google/image0.jpeg">
        <div className="about-hero">
          <h2>
            {t('Chi Siamo')}
          </h2>
        </div>
      </ParallaxBackground>
      
      <div className="container">
        <div className="about-content">
          <div className="about-description">
            <h2>
              a VINCANTO
            </h2>
            <p>
              {t("Abbiamo curato ogni dettaglio per garantire un'esperienza di soggiorno superiore. Gli interni, totalmente ammodernati, sfoggiano arredi di stile ricercato e finiture di pregio, con pavimenti e rivestimenti in elegante Gres Porcellanato che conferiscono un tocco di raffinatezza. I nuovi infissi in PVC assicurano isolamento e tranquillità, mentre le zanzariere su porte e finestre ti permettono di godere appieno dell'aria fresca e pulita della campagna.")}
            </p>
            <p>
              {t("La proprietà si compone di quattro accoglienti camere da letto, ciascuna dotata di un letto matrimoniale King Size per garantirti il massimo del riposo. Tre bagni moderni e funzionali completano gli spazi interni, pensati per offrire comfort e privacy a tutti gli ospiti. La cucina interna, attrezzata per ogni esigenza, è perfetta per preparare i tuoi piatti preferiti.")}
            </p>
          </div>
          
          <div className="features-container">
            <h3>
              {t('Caratteristiche della Proprietà')}
            </h3>
            <div className="features-grid">
              <div className="feature">
                <div className="feature-title">
                  <span className="feature-icon">🛏️</span>
                  <h4>
                    {t('4 Camere King Size')}
                  </h4>
                </div>
                <p>
                  {t('Camere lussuose con biancheria di pregio, ognuna con vista unica sulla costa')}
                </p>
              </div>
              
              <div className="feature">
                <div className="feature-title">
                  <span className="feature-icon">🚿</span>
                  <h4>
                    {t('3 Bagni')}
                  </h4>
                </div>
                <p>
                  {t('Bagni eleganti con ceramiche locali e finiture di pregio')}
                </p>
              </div>
              
              <div className="feature">
                <div className="feature-title">
                  <span className="feature-icon">🏞️</span>
                  <h4>
                    {t('Terrazza Esterna')}
                  </h4>
                </div>
                <p>
                  {t('Spaziosa terrazza con zona pranzo e lettini con vista sulla costa')}
                </p>
              </div>
              
              <div className="feature">
                <div className="feature-title">
                  <span className="feature-icon">🍳</span>
                  <h4>
                    {t('Cucina in Muratura')}
                  </h4>
                </div>
                <p>
                  {t('Cucina gourmet completamente attrezzata in stile tradizionale italiano')}
                </p>
              </div>
              
              <div className="feature">
                <div className="feature-title">
                  <span className="feature-icon">🍽️</span>
                  <h4>
                    {t('Barbecue & Forno a Legna')}
                  </h4>
                </div>
                <p>
                  {t("Autentico forno a legna per pizza e barbecue per cucinare all'aperto")}
                </p>
              </div>
              
              <div className="feature">
                <div className="feature-title">
                  <span className="feature-icon">🛎️</span>
                  <h4>
                    {t('Servizi inclusi')}
                  </h4>
                </div>
                <ul style={{ paddingLeft: '1.2em' }}>
                  <li>• {t('Aria condizionata')}</li>
                  <li>• {t('Cucina accessoriata')}</li>
                  <li>• {t('Internet (Wi-Fi)')}</li>
                  <li>• {t('Tv')}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Inserisco qui la sezione Propriety prima di 'La Nostra Posizione' */}
          <Propriety />

          <div className="location-info">
            <div className="location-text">
              <h3>
                {t('La Nostra Posizione')}
              </h3>
              <p>
                {t('Situati a soli 2 km dal centro paese, godi della tranquillità della campagna con la comodità dei servizi vicini, facilmente raggiungibili anche grazie al servizio navetta comunale e ai bus di linea.')}
              </p>
              <p>
                {t("L'accesso a VINCANTO avviene attraverso una scalinata di circa 200 gradini, un percorso suggestivo che si snoda nel verde. Consideriamo questi gradini parte del fascino autentico del luogo, un piccolo 'sentiero delle formichelle' che storicamente trasportavano i preziosi limoni. Salire ti ricompenserà con una vista impagabile e la sensazione di raggiungere un angolo di paradiso nascosto, lontano dalla frenesia quotidiana. È un invito a rallentare, a connettersi con la natura e a godere della pace che solo luoghi come questo sanno offrire.")}
              </p>
              <div className="distances">
                <div className="distance-item">
                  <strong>{t('Maiori')}:</strong> {t('8 min dal porto di Maiori (6 min dal lungomare)')}
                </div>
                <div className="distance-item">
                  <strong>{t('Amalfi')}:</strong> {t('20 min in auto')}
                </div>
                <div className="distance-item">
                  <strong>{t('Ravello')}:</strong> {t('20 min in auto')}
                </div>
                <div className="distance-item">
                  <strong>{t('Positano')}:</strong> {t('55 min in auto')}
                </div>
                <div className="distance-item">
                  <strong>{t('Salerno')}:</strong> {t('45 min in auto')}
                </div>
                <div className="distance-item">
                  <strong>{t('Aeroporto di Napoli')}:</strong> {t('70 min in auto')}
                </div>
                <div className="distance-item">
                  <strong>{t('Aeroporto di Salerno')}:</strong> {t('60 min in auto')}
                </div>
              </div>
            </div>
            <div className="location-image" style={{ width: '100%', height: '400px', overflow: 'hidden', borderRadius: '16px', padding: 0, margin: 0 }}>
              <img 
                src="/public/contact2b.jpg" 
                alt="Maiori view" 
                className="img-fluid"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', padding: 0, margin: 0 }}
              />
            </div>
          </div>
        </div>
      </div>
      
      <LemonDivider position="right" />
    </section>
  );
};

export default About;