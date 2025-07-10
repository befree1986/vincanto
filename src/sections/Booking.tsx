import React from 'react';
import './Booking.css';
import LemonDivider from '../components/LemonDivider';
import { useTranslation } from 'react-i18next';

// 🔗 Link abbreviati definiti qui
const BOOKING_URL = "https://www.booking.com/hotel/it/vincanto-maiori-costiera-amalfitana.it.html?force_referer=https%3A%2F%2Fwww.google.com%2F&activeTab=main";
const AIRBNB_URL = "https://www.airbnb.it/rooms/1387891577187940063?source_impression_id=p3_1752002400_P3igXnrRx0t0fqsA";

const BookingForm: React.FC = () => {
  return (
    <div className="booking-showcase">
      <div className="logo-only-links">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="logo-link"
          title="Prenota su Booking.com"
        >
          <img
            src="/assets/booking-logo.png"
            alt="Booking.com"
            className="logo-image"
          />
        </a>
        <a
          href={AIRBNB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="logo-link"
          title="Prenota su Airbnb"
        >
          <img
            src="/assets/airbnb-logo.svg"
            alt="Airbnb"
            className="logo-image"
          />
        </a>
      </div>
    </div>
  );
};

const Booking: React.FC = () => {
  const { t } = useTranslation();
  return (
    <section id="booking" className="booking-section">
      <div className="container">
        <h2 className="section-title underline-title titolo-sezione">
          {t('Prenota il tuo Soggiorno')}
        </h2>
        <p className="section-subtitle booking-subtitle">
          {t('Siamo presenti sulle principali piattaforme online.')}
        </p>
        <BookingForm />
      </div>
      <LemonDivider position="left" />
    </section>
  );
};

export default Booking;