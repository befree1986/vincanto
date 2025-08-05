import React from "react";
import "./Booking.css";
import LemonDivider from "../components/LemonDivider";
import { useTranslation } from "react-i18next";

const BOOKING_URL = "https://www.booking.com/hotel/it/vincanto-maiori-costiera-amalfitana.it.html";
const AIRBNB_URL = "https://www.airbnb.it/rooms/1387891577187940063";

const BookingForm: React.FC = () => {
  const bookingPlatforms = [
    {
      name: "Booking.com",
      url: BOOKING_URL,
      logo: "/assets/booking-logo.png",
    },
    {
      name: "Airbnb",
      url: AIRBNB_URL,
      logo: "/assets/airbnb-logo.svg",
    },
  ];

  return (
    <div className="booking-showcase" role="region" aria-label="Piattaforme di prenotazione">
      <div className="logo-only-links">
        {bookingPlatforms.map(({ name, url, logo }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="logo-link"
            title={`Prenota su ${name}`}
          >
            <img
              src={logo}
              alt={name}
              className="logo-image"
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </div>
  );
};

const Booking: React.FC = () => {
  const { t } = useTranslation();

  return (
    <section id="booking" className="booking-section">
      <div className="container">
        <header>
          <h2 className="section-title underline-title titolo-sezione">
            {t("Prenota il tuo Soggiorno")}
          </h2>
          <p className="section-subtitle booking-subtitle">
            {t("Siamo presenti sulle principali piattaforme online.")}
          </p>
        </header>
        <BookingForm />
      </div>
      <LemonDivider position="left" />
    </section>
  );
};

export default Booking;