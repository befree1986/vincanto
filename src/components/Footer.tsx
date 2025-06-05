import React from 'react';
import './Footer.css';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/logo.svg" alt="Vincanto" className="footer-logo-img" />
            <p>
              {t('Il Tuo angolo di Paradiso nel Limoneto')}
            </p>
           </div>
            <div className="footer-links">
            <h4>
              {t('Link Veloci')}
            </h4>
            <ul>
              <li><a href="#home">{t('Home')}</a></li>
              <li><a href="#about">{t('Chi Siamo')}</a></li>
              <li><a href="#proprieta">{t('La Proprietà')}</a></li>
              <li><a href="#contact">{t('Contatti')}</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>
              {t('Contattaci')}
            </h4>
            <p>Via Torre di Milo, 7</p>
            <p>84010 Maiori (SA)</p>
            <p>
              <a href="mailto:info@vincantomaiori.it" className="footer-link">
                <i className="fas fa-envelope"></i> info@vincantomaiori.it
              </a>
              </p>
            <p>
              <a href="tel:+393331481677" className="footer-link">
                <i className="fas fa-phone"></i> Tel. +39 333 148 1677
              </a>
            </p>
          </div>
          <div className="footer-social">
            <h4>{t('Seguici')}</h4>
            <div className="social-icons-list">
              <a href="https://www.facebook.com/people/Vincanto-Maiori-Costiera-Amalfitana/61574880714522/" target="_blank" rel="noopener noreferrer" aria-label={t('Facebook')}>
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://www.instagram.com/vincanto_maiori/" target="_blank" rel="noopener noreferrer" aria-label={t('Instagram')}> {/* Sostituisci con il tuo URL Instagram effettivo */}
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://wa.me/393331481677" target="_blank" rel="noopener noreferrer" aria-label={t('WhatsApp')}>
                <i className="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>
        </div>
       <div className="footer-bottom">
        <div className="footer-paytourist-logo">
            <img src="/paytourist_logo.png" alt="Paytourist" className="footer-paytourist-logo-img"/>
            <p>
              {t('Certificata dal Comune di Maiori')}
            </p>
            <p>
              {t('Licenza SLSA000108-0026')}
            </p>
            <p>
              {t('Licenza Regionale / CIN: IT065066C248Z362SX')}            
            </p>
        </div>
        <div className="footer-verfied-logo">
          <img src="verify-logo.webp" alt="Verified" className="footer-verfied-logo-img" />
        </div>
        </div> 
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} Vincanto. {t('All Rights Reserved.')}</p>
          <p>{t('Webmaster')} Giuseppe Marino</p>
        </div>
    </footer>
  );
};

export default Footer;