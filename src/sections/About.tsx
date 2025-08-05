import React from 'react';
import Seo from '../components/Seo';
import ParallaxBackground from '../components/ParallaxBackground';
import LemonDivider from '../components/LemonDivider';
import Propriety from './Propriety';
import './About.css';
import { useTranslation } from 'react-i18next';

const About: React.FC = () => {
  const { t } = useTranslation();

  return (
    <main aria-label="Chi Siamo">
      <Seo
        title="Chi Siamo | VINCANTO - Esperienza nella Costiera Amalfitana"
        description="Scopri la filosofia di VINCANTO, immersa nella quiete dei limoneti della Costiera Amalfitana. Comfort, autenticità e ospitalità memorabile."
      />

      <section id="about" className="about-section">
        <ParallaxBackground imageUrl="/lemon.jpg">
          <div className="about-hero">
            <h1>{t('Chi Siamo')}</h1>
          </div>
        </ParallaxBackground>

        <div className="container">
          <div className="about-content">
            <section aria-labelledby="titolo-vincanto" className="about-description">
              <h2 id="titolo-vincanto">VINCANTO</h2>
              <p className="proprieta-description" style={{ marginBottom: '2rem' }}>
                {t("VINCANTO non è solo una casa vacanze: è un’esperienza sensoriale immersa nel cuore della Costiera Amalfitana. Circondata dai profumi degli agrumi e dal canto delle cicale, ogni angolo è pensato per farti sentire accolto come in famiglia.")}
              </p>
              <p>
                {t("Gli interni, completamente rinnovati, fondono eleganza mediterranea e comfort moderno. Materiali pregiati come gres porcellanato, ceramiche vietresi dipinte a mano e arredi sartoriali raccontano una storia di autenticità. Le zanzariere su porte e finestre ti permettono di vivere la brezza della campagna senza pensieri.")}
              </p>
              <p className="proprieta-description" style={{ marginBottom: '2rem' }}>
                {t("Con due camere matrimoniali King Size e una doppia, VINCANTO offre spazio e intimità per famiglie, coppie o gruppi di amici. I tre bagni, moderni e funzionali, garantiscono privacy e comfort. La cucina open space è il cuore pulsante della casa, perfetta per condividere momenti di gioia e piatti tradizionali.")}
              </p>
              <p>
                {t("All’esterno, sotto il pergolato ombreggiato, si apre uno spazio conviviale con cucina esterna, forno a legna e barbecue: il luogo ideale per cene al tramonto e colazioni tra i limoni. Una doccia esterna completa l’esperienza, in un’atmosfera che invita alla lentezza e alla contemplazione.")}
              </p>
            </section>

            <section aria-labelledby="sezione-proprieta">
              <Propriety />
            </section>

            <section aria-labelledby="titolo-posizione" className="location-info">
              <div className="location-text">
                <h2 id="titolo-posizione">{t('La Nostra Posizione')}</h2>
                <div style={{ marginTop: '1rem' }}>
                  <p>
                    {t("VINCANTO sorge in un luogo dove il tempo rallenta e la natura detta il ritmo. A soli 2 km dal centro di Maiori, la villa ti offre l’armonia della campagna, con la comodità dei servizi vicini. Qui, il profumo dei limoni si mescola alla brezza marina e ogni finestra è un quadro aperto sulla Costiera Amalfitana.")}
                  </p>
                  <p>
                    {t("Per raggiungere la struttura, ti aspetta una scalinata di circa 200 gradini: un percorso scenografico che si snoda tra verde e silenzio. Questi gradini sono parte della storia locale: un ‘sentiero delle formichelle’, le donne che trasportavano a spalla i limoni lungo queste vie impervie. Oggi, ogni passo è un invito alla scoperta, una salita che si trasforma in rituale lento, in attesa di una vista mozzafiato e di una quiete assoluta.")}
                  </p>
                </div>

                <div className="distances" style={{ marginTop: '1.5rem' }}>
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
            </section>
          </div>
        </div>

        <LemonDivider position="right" />
      </section>
    </main>
  );
};

export default About;