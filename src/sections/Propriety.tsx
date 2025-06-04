import React from 'react';
import LemonDivider from '../components/LemonDivider';
import './Propriety.css';
import { useTranslation, Trans } from 'react-i18next';

const Propriety: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section id="proprieta" className="proprieta-section">
      <div className="container">
        <div className="propiety-content">
          <div className="propiety-description"> {/* Rimosso stile inline textAlign: 'center' */}
          <h2 className="section-title underline-title" style={{ marginTop: '2rem' }}> {/* Questo titolo ora sarà centrato grazie all'ereditarietà */}
          {t('Foto della Struttura')}
        </h2>
           </div>
           </div>
        <div className="proprieta-gallery">
          {/* Esempio per la prima immagine */}
          <div className="proprieta-img-card">
            <img src="/ingresso.jpg" alt={t('alt.proprieta.immagine1')} className="img-fluid" />
            <p className="image-caption">{t('Ingresso della struttura')}</p>
          </div>
          {/* Esempio per la seconda immagine */}
          <div className="proprieta-img-card">
            <img src="/corridoio.jpg" alt={t('alt.proprieta.immagine2')} className="img-fluid" />
            <p className="image-caption">🎨 {t('Applique nel corridoio e nelle camere in Pregiata Cermaica Vietrese devcorate a mano')} 🎨</p>
          </div>
          <div className="proprieta-img-card">
            <img src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80" alt={t('alt.proprieta.immagine3')} className="img-fluid" />
            <p className="image-caption">{t('caption.proprieta.immagine3')}</p>
          </div>
          <div className="proprieta-img-card">
            <img src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80" alt={t('alt.proprieta.immagine4')} className="img-fluid" />
            <p className="image-caption">{t('caption.proprieta.immagine4')}</p>
          </div>
          <div className="proprieta-img-card">
            <img src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80" alt={t('alt.proprieta.immagine5')} className="img-fluid" />
            <p className="image-caption">{t('caption.proprieta.immagine5')}</p>
        </div>
          <div className="proprieta-img-card">
            <img src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80" alt={t('alt.proprieta.immagine6')} className="img-fluid" />
            <p className="image-caption">{t('caption.proprieta.immagine6')}</p>
          </div>
          <div className="proprieta-img-card">
            <img src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80" alt={t('alt.proprieta.immagine7')} className="img-fluid" />
            <p className="image-caption">{t('caption.proprieta.immagine7')}</p>
          </div>
          <div className="proprieta-img-card">
            <img src="https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80" alt={t('alt.proprieta.immagine8')} className="img-fluid" />
            <p className="image-caption">{t('caption.proprieta.immagine8')}</p>
          </div>
        
        </div>
       
       <h2 className='section-title underline-title titolo-sezione' style={{ marginTop: '2rem' }}>
        {t('Le nostre Traiffe')}
      </h2>
      <div className="tariffe-table-container">
        <table className="tariffe-table">
          <thead>
            <tr>
              <th>{t('Numero di Persone')}</th>
              <th>{t('Prezzo a Notte')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label={t('Numero di Persone')}>{t('1 a 2')}</td>
              <td data-label={t('Prezzo a Notte')}>{t('50 € a Persona')}</td>
            </tr>
            <tr>
              <td data-label={t('Numero di Persone')}>{t('da 3 a 4')}</td>
              <td data-label={t('Prezzo a Notte')}>{t('40 € a Persona')}</td>
            </tr>
            <tr>
              <td data-label={t('Numero di Persone')}>{t('da 4 a 6')}</td>
              <td data-label={t('Prezzo a Notte')}>{t('30 € a Persona')}</td>
              </tr>
            {/* Puoi aggiungere più righe qui se necessario */}
          </tbody>
        </table>
        <div className="tariffe-note">   
        </div>
        <p style={{ textAlign: 'center' }}>
        {t(" Servizi inclusi nel prezzo: aria condizionata, internet Wi-Fi, uso lavatrice.")}
        </p>
        <p style={{ textAlign: 'center' , textDecoration: 'underline' }}>
      {t("* Tassa di soggiorno esclusa.")}
          </p>
        <p style={{ textAlign: 'center' }}>
          {t("Il comune di Maiori (SA) applica una tassa di soggiorno per ogni pernottamento, dal 1° gennaio al 31 dicembre di ogni anno, per contribuire al miglioramento dei servizi turistici.")}
          </p>
        <h2 className='section-title underline-title titolo-sezione' style={{ marginTop: '2rem' }}>
        {t(' ')}
      </h2>
      <h2>
      <p> {t(" Costo: € 2,00 a persona per notte ")} </p>
      <p> {t(" Esenzioni: Sono esenti i minori di 14 anni")}</p>
      <p> {t(" Pagamento: La tassa non è inclusa nel costo del soggiorno e andrà saldata direttamente presso la nostra struttura, al vostro arrivo o alla partenza.")} </p>        
      <p>
        <Trans i18nKey="info.paytouristLinkText">
          Per tutti i dettagli, potete consultare il sito del  {/*spazzio */}    
          <a href="https://www.comune.maiori.sa.it/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
          Comune di Maiori{ }
          </a>
          {} o il portale dedicato {}
          {/*spazzio */}
          <a href="https://maiori.paytourist.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>
          PayTourist.
          </a>
        </Trans>
      </p>
      </h2>   
      </div>
      {/* Il tag <a> precedentemente vuoto è stato rimosso e integrato nel testo sopra */}
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
