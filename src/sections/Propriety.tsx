import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { galleryData } from '../data/galleryData';
import type { GalleryImage } from '../data/galleryData';
import '../styles/Propriety.base.css';
import '../styles/Propriety.desktop.css';
import '../styles/Propriety.mobile.css';
import LemonDivider from '../components/LemonDivider';
import Image from '../components/Image';
import Lightbox from '../components/Lightbox';
import InfoSection from '../components/InfoSection';
import { Helmet } from 'react-helmet';

const Propriety: React.FC = () => {
  const { t } = useTranslation();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [lightboxImages, setLightboxImages] = useState<GalleryImage[]>([]);
  const touchStartX = useRef(0);

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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, closeLightbox, showPrevImage, showNextImage]);

  useEffect(() => {
    const images = document.querySelectorAll('.gallery-img');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.classList.add('visible');
          if (window.innerWidth < 600) {
            el.classList.add('mobile-reveal');
          }
        }
      });
    }, { threshold: 0.3 });

    images.forEach((img) => observer.observe(img));
    return () => observer.disconnect();
  }, []);
    return (
    <section id="proprieta" className="proprieta-section">
      {/* SEO e Dati Strutturati (JSON-LD) */}
      <Helmet>
        <title>{t('seo.propriety.title')}</title>
        <meta name="description" content={t('seo.propriety.description')} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VacationRental",
            "name": "Vincanto",
            "description": t('seo.propriety.description'),
            "url": "https://www.vincantomaiori.it/",
            "image": [
              "https://www.vincantomaiori.it/ingressoNotte/ingresso2.webp",
              "https://www.vincantomaiori.it/openSpace/open_new.webp",
              "https://www.vincantomaiori.it/esterni/ingressoindex.webp"
            ],
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Via Torre di Milo, 7",
              "addressLocality": "Maiori",
              "addressRegion": "SA",
              "postalCode": "84010",
              "addressCountry": "IT"
            },
            "telephone": "+393331481677",
            "email": "info@vincantomaiori.it",
            "priceRange": "€150 - €330"
          })}
        </script>
      </Helmet>

      <div className="container">
        {/* Titolo galleria */}
        <h2
          className="section-title underline-title"
          style={{ marginTop: '2rem' }}
        >
          {t('propriety.gallery.mainTitle')}
        </h2>

        {/* Galleria immagini */}
        <div className="gallery-grid">
          {galleryData.map((section, sectionIndex) => {
            const allImages = section.mainImage
              ? [section.mainImage, ...section.images]
              : section.images;

            return (
              <div
                key={section.titleKey || `section-${sectionIndex}`}
                className="gallery-section-container"
              >
                <h3 className="gallery-section-title">
                  {t(section.titleKey)}
                </h3>

                {allImages.length > 0 && (
                  <div
                    className="gallery-main-image-card"
                    onClick={() => openLightbox(allImages, allImages.indexOf(section.mainImage || allImages[0]))}
                  >
                    <Image
                      src={(section.mainImage || allImages[0]).src}
                      alt={t((section.mainImage || allImages[0]).altKey)}
                      srcSet={(section.mainImage || allImages[0]).srcSet}
                      className="img-fluid-main gallery-img"
                      loading="lazy" // Gestito dal componente Image, ma lo lasciamo per chiarezza
                    />
                    {((section.mainImage || allImages[0]).captionKey ||
                      (section.mainImage || allImages[0]).captionText) && (
                      <p className="image-caption">
                        {(section.mainImage || allImages[0]).captionText ||
                          t((section.mainImage || allImages[0]).captionKey!)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Lightbox */}
        {isLightboxOpen && (
          <Lightbox
            images={lightboxImages}
            currentIndex={currentImageIndex}
            onClose={closeLightbox}
            onPrev={showPrevImage}
            onNext={showNextImage}
            touchStartXRef={touchStartX}
          />
        )}
                {/* Tabella Tariffe */}
        <h2
          className="section-title underline-title titolo-sezione"
          style={{ marginTop: '2rem' }}
        >
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
                <td>{t('propriety.rates.table.persons1to2')}</td>
                <td>{t('propriety.rates.table.price1to2')}</td>
              </tr>
              <tr>
                <td>{t('propriety.rates.table.persons3to4')}</td>
                <td>{t('propriety.rates.table.price3to4')}</td>
              </tr>
              <tr>
                <td>{t('propriety.rates.table.persons5to6')}</td>
                <td>{t('propriety.rates.table.price5to6')}</td>
              </tr>
              <tr>
                <td>{t('propriety.rates.table.persons7to8')}</td>
                <td>{t('propriety.rates.table.price7to8')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Regole di Prenotazione */}
        <InfoSection
          className="booking-rules"
          titleKey="section.booking.rules.title"
          items={[
            'section.booking.rules.minoriList1',
            'section.booking.rules.summerList1',
            'section.booking.rules.allYearList1',
            'section.booking.rules.checkinoutList1',
            'section.booking.rules.checkinoutList2',
            'section.booking.rules.paymentList1',
          ]}
        />

        {/* Servizi Inclusi */}
        <InfoSection
          className="included-services"
          titleKey="section.includedServices.title"
          items={[
            'section.includedServices.comfortList1',
            'section.includedServices.comfortList2',
            'section.includedServices.comfortList3',
            'section.includedServices.comfortList4',
            'section.includedServices.comfortList5',
            'section.includedServices.comfortList6',
            'section.includedServices.comfortList7',
            'section.includedServices.comfortList8',
            'section.includedServices.comfortList9',
            'section.includedServices.comfortList10',
            'section.includedServices.comfortList11',
            'section.includedServices.comfortList12',
            'section.includedServices.connectivityList1',
            'section.includedServices.connectivityList2',
          ]}
        />

        {/* Costi Extra */}
        <InfoSection
          className="extra-costs"
          titleKey="section.extraCosts.title"
          items={[
            'section.extraCosts.mandatoryList1',
            'section.extraCosts.mandatoryList2',
            'section.extraCosts.onRequestList1',
          ]}
        />

        {/* Info Tassa di Soggiorno */}
        <div className="tariffe-note">
          <h3 className="section-subtitle">{t('propriety.rates.touristTaxTitle')}</h3>
          <p>{t('propriety.rates.touristTaxCost')}</p>
          <p>{t('propriety.rates.touristTaxExemptions')}</p>
          <p>{t('propriety.rates.touristTaxPaymentInfo')}</p>
          <p>
            <Trans i18nKey="propriety.rates.touristTaxLinkText">
              Per tutti i dettagli, potete consultare il sito del&nbsp;
              <a
                href="https://www.comune.maiori.sa.it/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Comune di Maiori
              </a>
              &nbsp;o il portale dedicato&nbsp;
              <a
                href="https://maiori.paytourist.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                PayTourist
              </a>.
            </Trans>
          </p>
        </div>

        {/* Divider finale */}
        <LemonDivider position="left" />
      </div>
    </section>
  );
};

export default Propriety;