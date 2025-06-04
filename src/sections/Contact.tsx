import React, { useState } from 'react';
import './Contact.css';
import { useTranslation } from 'react-i18next';

interface FormData {
  name: string;
  email: string;
  phone: string;
  guests: string;
  checkin: string;
  checkout: string;
  message: string;
}

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    guests: '',
    checkin: '',
    checkout: '',
    message: '',
  });
  
  const [submitted, setSubmitted] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    setSubmitted(true);
    
    // Reset form after submission
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        guests: '',
        checkin: '',
        checkout: '',
        message: '',
      });
      setSubmitted(false);
    }, 5000);
  };
  
  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <h2 className="section-title">
          {t('Contatti')}
        </h2>
        <div className="contact-content">
          <div className="booking-form-container">
            <h3>
              {t('Hai richieste particolari o domande?')}
            </h3>
            {submitted ? (
              <div className="success-message">
                <p>
                  {t('Grazie per la tua richiesta! Ti ricontatteremo al più presto.')}
                </p>
              </div>
            ) : (
              <form className="booking-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">
                    {t('Nome e Cognome')}
                  </label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">
                      {t('Email')}
                    </label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">
                      {t('Telefono')}
                    </label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="guests">
                    {t('Numero di Ospiti')}
                  </label>
                  <select 
                    id="guests" 
                    name="guests" 
                    value={formData.guests} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="">{t('Seleziona')}</option>
                    <option value="1-2">1-2</option>
                    <option value="3-4">3-4</option>
                    <option value="5-6">5-6</option>
                    <option value="7-8">7-8</option>
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="checkin">
                      {t('Data di Arrivo')}
                    </label>
                    <input 
                      type="date" 
                      id="checkin" 
                      name="checkin" 
                      value={formData.checkin} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="checkout">
                      {t('Data di Partenza')}
                    </label>
                    <input 
                      type="date" 
                      id="checkout" 
                      name="checkout" 
                      value={formData.checkout} 
                      onChange={handleChange} 
                      required 
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="message">
                    {t('Richieste Speciali')}
                  </label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    value={formData.message} 
                    onChange={handleChange}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-accent">
                  {t('Invia Richiesta')}
                </button>
              </form>
            )}
          </div>
          <div className="contact-divider">
           
          </div>
          <div className="contact-info">
            <div className="contact-details">
                <h3>
                  {t('Contattaci')}
                </h3>
              <div className="contact-item">
                <h4>
                  {t('Indirizzo')}
                </h4>
                <p>Via Torre di Milo, 7</p>
                <p>Maiori, (SA)</p>
                <p>84010, Italia</p>
              </div>
              <div className="contact-item">
                <h4>
                  {t('Telefono & Email')}
                </h4>
                <p>
                  <a href="tel:3331481677" className="footer-link">
                <i className="fas fa-phone"></i> +39 333 148 1677 </a>
                </p>
                <p>
                  <a href="mailto:info@vincantomaiori.it" className="footer-link">
                <i className="fas fa-envelope"></i> info@vincantoma.it </a>
                </p>
              </div>
              <div className="contact-item">
                <h4>
                  {t('Trasporti')}
                </h4>
                <p><strong>{t('Da Napoli Aeroporto')}:</strong> {t('Servizio di trasferimento privato disponibile (70 min)')}</p>
                <p><strong>{t('Da Salerno')}:</strong> {t('Traghetto per Maiori (45 min) | Autobus (60 min)')}</p>
                <p><strong>{t('Da Amalfi')}:</strong> {t('Autobus locale (40 min)')}</p>
              </div>
            </div>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3026.138502828421!2d14.64101131568713!3d40.65196497933509!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x133bbf759bd276b7%3A0x49b8fbf1f67d6fb7!2sVia%20Torre%20di%20Milo%2C%207%2C%2084010%20Maiori%20SA%2C%20Italia!5e0!3m2!1sit!2sit!4v1716300000000!5m2!1sit!2sit"
                width="100%"
                height="300"
                className="map-iframe"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Posizione Vincanto"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;