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
      <ParallaxBackground imageUrl="/lemon.jpg"> {/* https://www.italia.it/content/dam/tdh/en/destinations/campania/salerno/maiori/media/google/image0.jpeg*/}
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
              VINCANTO
            </h2>
            <p>
              {t("Ogni dettaglio di VINCANTO è pensato per offrirti un soggiorno indimenticabile. Gli interni, completamente rinnovati, uniscono design contemporaneo e materiali di pregio: pavimenti e rivestimenti in elegante gres porcellanato, arredi ricercati e finiture di alta qualità. I nuovi infissi in PVC garantiscono silenzio e comfort, mentre le zanzariere su porte e finestre ti permettono di godere della brezza della campagna in totale relax.")}
            </p>
            <p>
              {t("La proprietà dispone di tre camere matrimoniali King Size, luminose e accoglienti, e due bagni moderni e funzionali per il massimo comfort e privacy. La cucina open space, completamente attrezzata, è perfetta per condividere momenti conviviali e preparare i tuoi piatti preferiti.")}
            </p>
          </div>
          
          <div className="features-container">
            <h2 className="section-title underline-title">
              {t('Caratteristiche della Proprietà')}
            </h2>
            <div className="feature-grid">
            </div>
            <div className="features-grid">
              <div className="feature feature-main">
                <div className="feature-title">
                  <span className="feature-icon">👨‍👩‍👧‍👦</span>
                  <h4>{t('Perfetta per Ogni Ospite')}</h4>
                </div>
                <p>
                  {t('Perfetta per famiglie, gruppi di amici, coppie e chiunque desideri una pausa rigenerante nella quiete della Costiera Amalfitana, senza rinunciare al comfort.')}
                </p>
              </div>

              <div className="feature">
                <div className="feature-title">
                  <span className="feature-icon">🛏️</span>
                  <h4>{t('3 Camere King Size')}</h4>
                </div>
                <p>
                  {t('Camere spaziose, luminose e climatizzate, con biancheria di pregio e arredi moderni.')}
                </p>
              </div>
              <div className="feature">
                <div className="feature-title">
                  <span className="feature-icon">🚿</span>
                  <h4>{t('2 Bagni')}</h4>
                </div>
                <p>
                  {t('Bagni moderni con ampi box doccia, finiture di design e dotazioni di qualità.')}
                </p>
              </div>
              <div className="feature">
                <div className="feature-title">
                  <span className="feature-icon">🏞️</span>
                  <h4>{t('Terrazza Esterna')}</h4>
                </div>
                <p>
                  {t('Ampia terrazza panoramica con pergolato, cucina esterna, barbecue e forno a legna, ideale per cene all’aperto e relax immersi nel verde.')}
                </p>
              </div>
              <div className="feature">
                <div className="feature-title">
                  <span className="feature-icon">🛋️</span>
                  <h4>{t('Zona Giorno')}</h4>
                </div>
                <p>
                  {t('Zona living open space, luminosa e accogliente, perfetta per momenti di relax e convivialità.')}
                </p>
              </div>
              <div className="feature">
                <div className="feature-title">
                  <span className="feature-icon">🟦</span>
                  <h4>{t('Ceramica Vietrese')}</h4>
                </div>
                <p>
                  {t('Applique artigianali in ceramica vietrese decorano corridoio e camere, donando colore e unicità agli ambienti.')}
                </p>
              </div>
              <div className="feature">
                <div className="feature-title">
                  <span className="feature-icon">📍</span>
                  <h4>{t('Posizione Unica')}</h4>
                </div>
                <p>
                  {t('A pochi minuti dal centro di Maiori, immersa nella quiete della collina e circondata dalla natura mediterranea.')}
                </p>
              </div>
            </div>
          </div>

          {/* Inserisco qui la sezione Propriety prima di 'La Nostra Posizione' */}
          <Propriety />

          <div className="location-info">
            <div className="location-text">
              <h4>
                {t('La Nostra Posizione')}
              </h4>
              <div style={{ marginTop: '1rem' }}> {/* Aggiunto div con marginTop */}
                <p>
                  {t('Situati a soli 2 km dal centro paese, godi della tranquillità della campagna con la comodità dei servizi vicini, facilmente raggiungibili anche grazie al servizio navetta comunale e ai bus di linea.')}
                </p>
                <p>
                  {t("L'accesso a VINCANTO avviene attraverso una scalinata di circa 200 gradini, un percorso suggestivo che si snoda nel verde. Consideriamo questi gradini parte del fascino autentico del luogo, un piccolo 'sentiero delle formichelle' che storicamente trasportavano i preziosi limoni. Salire ti ricompenserà con una vista impagabile e la sensazione di raggiungere un angolo di paradiso nascosto, lontano dalla frenesia quotidiana. È un invito a rallentare, a connettersi con la natura e a godere della pace che solo luoghi come questo sanno offrire.")}
                </p>
              </div>
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
            <div className="location-image-container">
              <img 
                src="/contact3.jpg" 
                alt="Vista panoramica su Maiori e la Costiera Amalfitana" 
                className="img-fluid"
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