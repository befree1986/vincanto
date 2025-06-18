import React from 'react';
import LemonDivider from '../components/LemonDivider';
import './Propriety.css';
import { useTranslation, Trans } from 'react-i18next';

interface GalleryImage {
  src: string;
  altKey: string;
  captionKey?: string; // Per didascalie da tradurre
  captionText?: string; // Per didascalie con testo diretto (es. con emoji)
}

interface GallerySection {
  titleKey: string; // Chiave di traduzione per il titolo della sezione
  headerImage?: {    // Immagine opzionale per la testata della sezione (Approccio 2)
    src: string;
    altKey: string;
  };
  mainImage?: GalleryImage; // Immagine principale opzionale per la sezione
  images: GalleryImage[];    // Immagini per la griglia sottostante (o l'unica galleria se mainImage non c'è)
}

// Definisci qui i dati della tua galleria, organizzati per sezioni.
// Puoi aggiungere, rimuovere o modificare sezioni e immagini come preferisci.
const galleryData: GallerySection[] = [
  {
    titleKey: 'propriety.gallery.sections.entrances.title', // Esempio: "Ingressi e Corridoi"
    headerImage: { // Immagine di testata per la sezione "Ingressi e Corridoi"
      src: "/ingresso.jpg", // SOSTITUISCI con il percorso della tua immagine di testata
      altKey: 'alt.proprieta.entrances.header' // Nuova chiave di traduzione per l'alt text
    },
    images: [
      { src: "/ingresso.jpg", altKey: 'alt.proprieta.immagine1', captionKey: 'Ingresso della struttura' },
      { src: "/corridoio.jpg", altKey: 'alt.proprieta.immagine2', captionText: '🎨 Applique nel corridoio e nelle camere in Pregiata Ceramica Vietrese decorate a mano 🎨' },
    ],
  },
  {
    titleKey: 'propriety.gallery.sections.rooms.title', // Esempio: "Le Camere"
    headerImage: { // Immagine di testata per la sezione "Le Camere"
      src: "/caneraVerde/verdett.jpg", // SOSTITUISCI con il percorso della tua immagine di testata
      altKey: 'alt.proprieta.rooms.header' // Nuova chiave di traduzione per l'alt text
    },
   
    images: [ // Immagini più piccole per la griglia sotto l'immagine principale
      // Sostituisci questi placeholder con le tue immagini reali
      { src: "/caneraVerde/verdet.jpg", altKey: 'alt.proprieta.camera.dettaglio1', captionKey: 'caption.camera.dettaglio1' },
      { src: "/caneraVerde/verde1.jpg", altKey: 'alt.proprieta.camera.dettaglio2', captionKey: 'caption.camera.dettaglio2' },
      { src: "/caneraVerde/verde3.jpg", altKey: 'alt.proprieta.camera.dettaglio3', captionKey: 'caption.camera.dettaglio3' },
    ],
  },
  {
    titleKey: 'propriety.gallery.sections.details.title', // Esempio: "Dettagli e Ambienti"
    images: [
      { src: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80", altKey: 'alt.proprieta.immagine4', captionKey: 'caption.proprieta.immagine4' },
      { src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80", altKey: 'alt.proprieta.immagine5', captionKey: 'caption.proprieta.immagine5' },
      { src: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80", altKey: 'alt.proprieta.immagine6', captionKey: 'caption.proprieta.immagine6' },
      { src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80", altKey: 'alt.proprieta.immagine7', captionKey: 'caption.proprieta.immagine7' },
      { src: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=600&q=80", altKey: 'alt.proprieta.immagine8', captionKey: 'caption.proprieta.immagine8' },
      // Aggiungi altre immagini di dettagli qui
    ],
  },
  // Puoi aggiungere altre sezioni come "I Bagni", "Esterni", "Cucina", ecc.
  // {
  //   titleKey: 'propriety.gallery.sections.bathrooms.title',
  //   images: [
  //     { src: "/path/to/bathroom1.jpg", altKey: 'alt.bathroom1', captionKey: 'caption.bathroom1' },
  //   ],
  // },
];

const Propriety: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section id="proprieta" className="proprieta-section">
      <div className="container">
        {/* Questo div propriety-content ora avvolge tutta la sezione Propriety */}
        <div className="propriety-content">
          <div className="propriety-description">
          <h2 className="section-title underline-title" style={{ marginTop: '2rem' }}> {/* Questo titolo ora sarà centrato grazie all'ereditarietà */}
          {t('propriety.gallery.mainTitle')}
        </h2>
           </div>
       
          {galleryData.map((section, sectionIndex) => {
            // Determina se ci sono immagini nella griglia oltre all'eventuale immagine principale
            const hasGridImages = section.images && section.images.length > 0;

            return (
            <div key={section.titleKey || `section-${sectionIndex}`} className="gallery-section-container">
              {section.headerImage ? (
                <div className="gallery-section-image-header">
                  <img src={section.headerImage.src} alt={t(section.headerImage.altKey)} className="header-bg-image" />
                  <h3 className="header-title-overlay">{t(section.titleKey)}</h3>
                </div>
              ) : (
                <h3 className="gallery-section-title">
                  {t(section.titleKey)}
                </h3>
              )}

              {section.mainImage && (
                <div className="gallery-main-image-card">
                  <img src={section.mainImage.src} alt={t(section.mainImage.altKey)} className="img-fluid-main" />
                  <p className="image-caption">
                    {section.mainImage.captionText ? section.mainImage.captionText : (section.mainImage.captionKey ? t(section.mainImage.captionKey) : '')}
                  </p>
                </div>
              )}

              {hasGridImages && (
                <div className="proprieta-gallery">
                  {section.images.map((image, imgIndex) => (
                    <div className="proprieta-img-card" key={image.src || `gallery-img-${sectionIndex}-${imgIndex}`}>
                      <img src={image.src} alt={t(image.altKey)} className="img-fluid" />
                      <p className="image-caption">
                        {image.captionText ? image.captionText : (image.captionKey ? t(image.captionKey) : '')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )})}

       <h2 className='section-title underline-title titolo-sezione' style={{ marginTop: '2rem' }}>
        {t('propriety.rates.title')}
      </h2>
      <div className="tariffe-table-container">
        <table className="tariffe-table">
          <thead>
            <tr>
              <th>{t('propriety.rates.table.personsHeader')}</th>
              <th>{t('propriety.rates.table.pricePerNightHeader')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label={t('propriety.rates.table.personsHeader')}>{t('propriety.rates.table.persons1to2')}</td>
              <td data-label={t('propriety.rates.table.pricePerNightHeader')}>{t('propriety.rates.table.price1to2')}</td>
            </tr>
            <tr>
              <td data-label={t('propriety.rates.table.personsHeader')}>{t('propriety.rates.table.persons3to4')}</td>
              <td data-label={t('propriety.rates.table.pricePerNightHeader')}>{t('propriety.rates.table.price3to4')}</td>
            </tr>
            <tr>
              <td data-label={t('propriety.rates.table.personsHeader')}>{t('propriety.rates.table.persons4to6')}</td>
              <td data-label={t('propriety.rates.table.pricePerNightHeader')}>{t('propriety.rates.table.price4to6')}</td>
              </tr>
            {/* Puoi aggiungere più righe qui se necessario */}
          </tbody>
        </table>
        <div className="tariffe-note">   
        </div>
        <p style={{ textAlign: 'center' }}>
        {t("propriety.rates.servicesIncluded")}
        </p>
        <p style={{ textAlign: 'center' , textDecoration: 'underline' }}>
      {t("propriety.rates.touristTaxExcluded")}
          </p>
        <p style={{ textAlign: 'center' }}>
          {t("propriety.rates.touristTaxInfo")}
          </p>
        <h2 className='section-title underline-title titolo-sezione' style={{ marginTop: '2rem' }}>
        {t(' ')}
      </h2>
      <h2>
      <p> {t("propriety.rates.touristTaxCost")} </p>
      <p> {t("propriety.rates.touristTaxExemptions")}</p>
      <p> {t("propriety.rates.touristTaxPaymentInfo")} </p>
      <p>
        <Trans i18nKey="propriety.rates.touristTaxLinkText">
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
      </div> {/* Chiusura di tariffe-table-container */}
        </div> {/* Chiusura di propriety-content */}
      </div> {/* Chiusura di container */}
      <LemonDivider position="left" />
    </section>
   );
  };

export default Propriety;
