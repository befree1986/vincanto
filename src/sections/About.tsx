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
              {t("La struttura dispone di tre camere matrimoniali King Size, luminose e accoglienti, e due bagni moderni e funzionali per il massimo comfort e privacy. La cucina open space, completamente attrezzata, è perfetta per condividere momenti conviviali e preparare i tuoi piatti preferiti.")}
            </p> 
            <p className="proprieta-description" style={{ marginBottom: '2rem' }}> {/* Rimosso textAlign: 'center' da qui, poiché ora è ereditato dal genitore */}
              {t('Immersa nel cuore profumato di un limoneto tipico della Costiera Amalfitana')}, {/* Corretto refuso nel testo */}
            </p>
            <p>
              {t('La casa, spaziosa e accogliente, si compone di un’ampia zona giorno con cucina open space completamente attrezzata, ideale per condividere momenti in famiglia o con amici. Dispone di tre camere da letto confortevoli e arredate con gusto, e di due bagni completi, entrambi dotati di ampi piatti doccia.')}
            </p>
           <p>
               {('All’esterno, gli ospiti possono godere di una cucina esterna, perfetta per pranzi e cene all’aperto sotto il pergolato, con vista sul verde circostante. A completare l’offerta, una doccia esterna, un forno a legna tradizionale e un barbecue, ideali per serate conviviali immersi nel profumo dei limoni e del mare.')}
          </p>
            
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
              <div className="distances" style={{ marginTop: '1.5rem' }}>
                {/* Riga 1 */}
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <div className="distance-item" style={{ width: '32%', marginRight: '2%' }}>
                    <strong>{t('Maiori')}:</strong> {t('8 min dal porto di Maiori (6 min dal lungomare)')}
                  </div>
                  <div className="distance-item" style={{ width: '32%', marginRight: '2%' }}>
                    <strong>{t('Amalfi')}:</strong> {t('20 min in auto')}
                  </div>
                  <div className="distance-item" style={{ width: '32%' }}>
                    <strong>{t('Ravello')}:</strong> {t('20 min in auto')}
                  </div>
                </div>
                {/* Riga 2 */}
                <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                  <div className="distance-item" style={{ width: '32%', marginRight: '2%' }}>
                    <strong>{t('Positano')}:</strong> {t('55 min in auto')}
                  </div>
                  <div className="distance-item" style={{ width: '32%', marginRight: '2%' }}>
                    <strong>{t('Salerno')}:</strong> {t('45 min in auto')}
                  </div>
                  <div className="distance-item" style={{ width: '32%' }}>
                    <strong>{t('Aeroporto di Napoli')}:</strong> {t('70 min in auto')}
                  </div>
                </div>
                {/* Riga 3 (con un solo elemento) */}
                <div style={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
                  <div className="distance-item" style={{ width: '32%' }}>
                    <strong>{t('Aeroporto di Salerno')}:</strong> {t('60 min in auto')}
                  </div>
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