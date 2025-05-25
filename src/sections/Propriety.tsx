import React from 'react';
import LemonDivider from '../components/LemonDivider';
import './Propriety.css';
import { useTranslation } from 'react-i18next';

const Propriety: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section id="proprieta" className="proprieta-section">
      <div className="container">
        <h2 className="section-title underline-title">
          {t('La Proprietà')}
        </h2>
        </div>
        <p className="proprieta-description" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          {t('Descrizione Proprietà')}
        </p>
        <div className="proprieta-gallery">
          <div className="proprieta-img-card">
            <img src="https://lh3.googleusercontent.com/p/AF1QipNtrJ92Qev3zyTcqNA8PsGlIIJr63p4ix5l7XJ2=s680-w680-h510-rw" alt={t('Proprietà 1')} className="img-fluid" />
          </div>
          <div className="proprieta-img-card">
            <img src="https://lh3.googleusercontent.com/p/AF1QipMJ-hFnOtK--MbqUsPj7dh5LSjsz9f3hFJ-B0c5=s680-w680-h510-rw" alt={t('Proprietà 2')} className="img-fluid" />
          </div>
          <div className="proprieta-img-card">
            <img src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80" alt={t('Proprietà 3')} className="img-fluid" />
          </div>
          <div className="proprieta-img-card">
            <img src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80" alt={t('Proprietà 4')} className="img-fluid" />
          </div>
          <div className="proprieta-img-card">
            <img src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80" alt={t('Proprietà 5')} className="img-fluid" />
        </div>
          <div className="proprieta-img-card">
            <img src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80" alt={t('Proprietà 6')} className="img-fluid" />
          </div>
          <div className="proprieta-img-card">
            <img src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80" alt={t('Proprietà 7')} className="img-fluid" />
          </div>
          <div className="proprieta-img-card">
            <img src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80" alt={t('Proprietà 8')} className="img-fluid" />
          </div>
        </div>
       <h2 className='section-title underline-title' style={{ marginTop: '2rem' }}>
        {t('Tariffe Indicative')}
      </h2>
      <div className="tariffe-table-container">
        <table className="tariffe-table">
          <thead>
            <tr>
              <th>{t('Periodo')}</th>
              <th>{t('Prezzo a Notte (intera proprietà)')}</th>
              <th>{t('Soggiorno Minimo')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label={t('Periodo')}>{t('Bassa Stagione')}</td>
              <td data-label={t('Prezzo a Notte (intera proprietà)')}>{t('A partire da €X')}</td>
              <td data-label={t('Soggiorno Minimo')}>{t('Y notti')}</td>
            </tr>
            <tr>
              <td data-label={t('Periodo')}>{t('Media Stagione')}</td>
              <td data-label={t('Prezzo a Notte (intera proprietà)')}>{t('A partire da €Y')}</td>
              <td data-label={t('Soggiorno Minimo')}>{t('Z notti')}</td>
            </tr>
            <tr>
              <td data-label={t('Periodo')}>{t('Alta Stagione')}</td>
              <td data-label={t('Prezzo a Notte (intera proprietà)')}>{t('A partire da €Z')}</td>
              <td data-label={t('Soggiorno Minimo')}>{t('W notti')}</td>
            </tr>
            {/* Puoi aggiungere più righe qui se necessario */}
          </tbody>
        </table>
        <p className="tariffe-note">
          {t('I prezzi sono indicativi e possono variare in base al numero di ospiti, al periodo specifico e alla durata del soggiorno.')}
          {' '}
          {t('Per un preventivo dettagliato e personalizzato, non esitare a')}{' '}
          <a href="#contact">{t('contattarci')}</a>.
        </p>
      </div>
      {/* 
        TODO: Sostituisci '€X', 'Y notti', ecc. con i valori reali delle tariffe.
        Esempio di chiavi di traduzione da aggiungere al tuo file i18n JSON:
        "Tariffe Indicative": "Tariffe Indicative",
        "Periodo": "Periodo",
        "Prezzo a Notte (intera proprietà)": "Prezzo a Notte (intera proprietà)",
        "Soggiorno Minimo": "Soggiorno Minimo",
        "Bassa Stagione": "Bassa Stagione (es. Nov-Mar)",
        "Media Stagione": "Media Stagione (es. Apr-Giu, Set-Ott)",
        "Alta Stagione": "Alta Stagione (es. Lug-Ago, Festività)",
        "A partire da €X": "A partire da €200", // Esempio
        "Y notti": "3 notti", // Esempio
        "I prezzi sono indicativi e possono variare in base al numero di ospiti, al periodo specifico e alla durata del soggiorno.": "I prezzi sono indicativi e possono variare in base al numero di ospiti, al periodo specifico e alla durata del soggiorno.",
        "Per un preventivo dettagliato e personalizzato, non esitare a": "Per un preventivo dettagliato e personalizzato, non esitare a",
        "contattarci": "contattarci"
      */}
      <LemonDivider position="left" />
    </section>
   );
  };

export default Propriety;
