import React, { useState, useEffect, useCallback } from 'react';
import LemonDivider from '../components/LemonDivider';
import './Propriety.css';
import { useTranslation, Trans } from 'react-i18next';

interface GalleryImage {
  src: string;
  altKey: string;
  captionKey?: string;
  captionText?: string;
}

interface GallerySection {
  titleKey: string;
  mainImage?: GalleryImage;
  images: GalleryImage[];
}

const galleryData: GallerySection[] = [
  {
    titleKey: 'propriety.gallery.sections.entrances.title',
    mainImage: {
      src: "/ingressoNotte/ingresso.jpg",
      altKey: 'alt.proprieta.immagine1',
    },
    images: [
      { src: "/ingressoNotte/ingresso.jpg", altKey: 'alt.proprieta.immagine1' },
      { src: "corridoio/corridoio.jpg", altKey: 'alt.proprieta.immagine2', captionText: '🎨 Applique nel corridoio e nelle camere in Pregiata Ceramica Vietrese decorate a mano 🎨' },
    ],
  },
  {
    titleKey: 'propriety.gallery.sections.rooms.title',
    mainImage: {
      src: "/caneraVerde/verdet.jpg",
      altKey: "alt.proprieta.camera.dettaglio1",
      
    },
    images: [
      { src: "/caneraVerde/verdet.jpg", altKey: 'alt.proprieta.camera.dettaglio1'},
      { src: "/caneraVerde/verde1.jpg", altKey: 'alt.proprieta.camera.dettaglio2'},
      { src: "/caneraVerde/verde3.jpg", altKey: 'alt.proprieta.camera.dettaglio3'},
      { src: "/caneraVerde/verde4.jpg", altKey: 'alt.proprieta.camera.dettaglio4'},      
      { src: "/caneraVerde/verde5.jpg", altKey: 'alt.proprieta.camera.dettaglio5'},
      { src: "/caneraVerde/verde6.jpg", altKey: 'alt.proprieta.camera.dettaglio6'},
      { src: "/cameraBlu/camerablu1.jpg", altKey: 'alt.propieta.camera.dettagio4'},
      { src: "/cameraBlu/camerablu2.jpg", altKey: 'alt.propieta.camera.dettaglio5'},
      { src: "/cameraBlu/camerablu3.jpg", altKey: 'alt.propieta.camera.dettaglio6'},
      { src: "/cameraBlu/camerablu4.jpg", altKey: 'alt.propieta.camera.dettaglio7'},
      { src: "/cameraBlu/camerablu5.jpg", altKey: 'alt.propieta.camera.dettaglio8'},
      { src: "/cameraBlu/camerablu6.jpg", altKey: 'alt.propieta.camera.dettaglio9'},
    ],
  },
  {
    titleKey: 'propriety.gallery.sections.singleroom.title',
    mainImage: {
      src: "/cameraSingola/1_giorno.jpg",
      altKey: 'alt.proprieta.singleroom.image1',
    
    },
    images: [
      { src: "/cameraSingola/1_giorno.jpg", altKey: 'alt.proprieta.singleroom.image1'},
      { src: "/cameraSingola/1_notte.jpg", altKey: 'alt.proprieta.singleroom.image2'},
      { src: "/cameraSingola/2_giorno.jpg", altKey: 'alt.proprieta.singleroom.image3'},
      { src: "/cameraSingola/2_notte.jpg", altKey: 'alt.proprieta.singleroom.image4'},  
    ],
  },
  {
    titleKey: 'propriety.gallery.section.bathroms.title',
    mainImage: {
      src: "/bagno1/bagno1.jpg",
      altKey: 'alt.proprieta.bathrooms.image1',
    },
    images: [
      { src: "/cameraBagni/1_giorno.jpg", altKey: 'alt.proprieta.bathrooms.image1'},
      { src: "/cameraBagni/1_notte.jpg", altKey: 'alt.proprieta.bathrooms.image2'},
      { src: "/cameraBagni/2_giorno.jpg", altKey: 'alt.proprieta.bathrooms.image3'},
    ],   
  },
    {
    titleKey: 'propriety.gallery.sections.openspace.title',
    mainImage: {
      src: "/openspace/title.jpg",
      altKey: 'alt.proprieta.openspace.image1',
    },
    images: [
    ],
  }
];




const Propriety: React.FC = () => {
  const { t } = useTranslation();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<GalleryImage[]>([]);

  const openLightbox = useCallback((images: GalleryImage[], startIndex: number) => {
    if (images.length === 0) return;
    setLightboxImages(images);
    setCurrentImageIndex(startIndex);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'auto';
  }, []);

  const showNextImage = useCallback(() => {
    if (lightboxImages.length <= 1) return;
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % lightboxImages.length);
  }, [lightboxImages.length]);

  const showPrevImage = useCallback(() => {
    if (lightboxImages.length <= 1) return;
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + lightboxImages.length) % lightboxImages.length);
  }, [lightboxImages.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (event.key === 'Escape') closeLightbox();
      else if (event.key === 'ArrowLeft') showPrevImage();
      else if (event.key === 'ArrowRight') showNextImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen, closeLightbox, showPrevImage, showNextImage]);
    return (
    <section id="proprieta" className="proprieta-section">
      <div className="container">
        <div className="propriety-content">
          <h2 className="section-title underline-title" style={{ marginTop: '2rem' }}>
            {t('propriety.gallery.mainTitle')}
          </h2>

          <div className="gallery-grid">
            {galleryData.map((section, sectionIndex) => {
              const allImages = section.mainImage
                ? [section.mainImage, ...section.images]
                : section.images;

              return (
                <div key={section.titleKey || `section-${sectionIndex}`} className="gallery-section-container">
                  <h3 className="gallery-section-title">{t(section.titleKey)}</h3>

                  {section.mainImage && (
                    <div className="gallery-main-image-card" onClick={() => openLightbox(allImages, 0)}>
                      <img
                        src={section.mainImage.src}
                        alt={t(section.mainImage.altKey)}
                        className="img-fluid-main"
                      />
                      <p className="image-caption">
                        {section.mainImage.captionText || (section.mainImage.captionKey && t(section.mainImage.captionKey))}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {isLightboxOpen && lightboxImages.length > 0 && (
            <div className="lightbox-overlay" onClick={closeLightbox}>
              <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                <button className="lightbox-close" onClick={closeLightbox}>&times;</button>
                {lightboxImages.length > 1 && (
                  <>
                    <button className="lightbox-prev" onClick={showPrevImage}>&#10094;</button>
                    <button className="lightbox-next" onClick={showNextImage}>&#10095;</button>
                  </>
                )}
                <img
                  src={lightboxImages[currentImageIndex].src}
                  alt={t(lightboxImages[currentImageIndex].altKey)}
                  className="lightbox-img"
                />
                {(lightboxImages[currentImageIndex].captionKey || lightboxImages[currentImageIndex].captionText) && (
                  <div className="lightbox-caption">
                    {lightboxImages[currentImageIndex].captionText
                      ? lightboxImages[currentImageIndex].captionText
                      : t(lightboxImages[currentImageIndex].captionKey!)}
                  </div>
                )}
              </div>
            </div>
            
          )}
          <h2 className="section-title underline-title titolo-sezione" style={{ marginTop: '2rem' }}>
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
        <td data-label={t('propriety.rates.table.personsHeader')}>
          {t('propriety.rates.table.persons1to2')}
        </td>
        <td data-label={t('propriety.rates.table.pricePerNightHeader')}>
          {t('propriety.rates.table.price1to2')}
        </td>
      </tr>
      <tr>
        <td data-label={t('propriety.rates.table.personsHeader')}>
          {t('propriety.rates.table.persons3to4')}
        </td>
        <td data-label={t('propriety.rates.table.pricePerNightHeader')}>
          {t('propriety.rates.table.price3to4')}
        </td>
      </tr>
      <tr>
        <td data-label={t('propriety.rates.table.personsHeader')}>
          {t('propriety.rates.table.persons4to6')}
        </td>
        <td data-label={t('propriety.rates.table.pricePerNightHeader')}>
          {t('propriety.rates.table.price4to6')}
        </td>
      </tr>
    </tbody>
  </table>
  {/* 📅 Regole di Prenotazione */}
<section className="booking-rules">
  <h2 className="section-title">📅 Regole di Prenotazione</h2>
  <div className="rule-group">
    <h4 className="section-subtitle">Minori 0-3 anni</h4>
    <ul className="section-list">
      <li>Per i bambini di età compresa tra 0 e 3 anni, il soggiorno è gratuito.</li>
    </ul>
  </div>
  <div className="rule-group">
    <h4 className="section-subtitle">Periodo Estivo</h4>
    <ul className="section-list">
      <li>Dal <strong>11 al 24 agosto</strong> si accettano solo prenotazioni settimanali <strong>da domenica a domenica</strong>.</li>
    </ul>
  </div>

  <div className="rule-group">
    <h4 className="section-subtitle">Tutto l’anno</h4>
    <ul className="section-list">
      <li>Il soggiorno minimo durante tutto l’anno è di <strong>2 notti</strong>.</li>
    </ul>
  </div>
  <div className="rule-group">
    <h4 className="section-subtitle">Check-in e Check-out</h4>
    <ul className="section-list">
      <li>Check-in: dalle <strong>16:00</strong> con possibilità di anticipazione <strong> (a discrezione del proprietario)</strong></li>
      <li>Check-out: entro le <strong>09:00</strong></li>
    </ul>
  </div>
</section>

{/* 🛎️ Servizi Inclusi */}
<section className="included-services">
  <h2 className="section-title">🛎️ Servizi Inclusi</h2>
  <div className="service-group">
    <h4 className="section-subtitle">Comfort</h4>
    <ul className="section-list">
      <li>Biancheria da letto e da bagno</li>
      <li>Aria condizionata</li>
      <li>Riscaldamento</li>
      <li>Asciugacapelli</li>
      <li>Asse e ferro da stiro</li>
      <li>Prodotti da bagno</li>
      <li>Kit di pronto soccorso</li>
      <li>Macchina da caffè</li>
      <li>Frigorifero</li>
      <li>Forno a microonde</li>
      <li>Stoviglie e posate</li>
      <li>Lavastoviglie</li>

    </ul>
  </div>

  <div className="service-group">
    <h4 className="section-subtitle">Connettività</h4>
    <ul className="section-list">
      <li>Wi-Fi gratuito</li>
      <li>Connessione Ethernet LAN in tutte le stanze</li>
    </ul>
  </div>
</section>

{/* 💰 Costi Extra */}
<section className="extra-costs">
  <h2 className="section-title">💰 Costi Extra (non inclusi)</h2>

  <div className="cost-group">
    <h4 className="section-subtitle">Obbligatori</h4>
    <ul className="section-list">
      <li>Pulizia finale obbligatoria: <strong>30€</strong></li>
      <li>Tassa di soggiorno secondo normativa comunale</li>
    </ul>
  </div>

  <div className="cost-group">
    <h4 className="section-subtitle">Su richiesta</h4>
    <ul className="section-list">
      <li>Posto auto riservato e custodito a <strong>15€/giorno</strong></li>
    </ul>
  </div>
</section>
</div>
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




        </div>
        <LemonDivider position="left" />
      </div>
    </section>
  );
};

export default Propriety;