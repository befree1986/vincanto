// src/components/GuestFeedback.tsx
import React from "react";
import "./GuestFeedback.css";

const feedbackData = [
  {
    source: "Booking.com",
    text: "Soggiorno meraviglioso! Accoglienza impeccabile e comfort assoluto.",
    icon: "/icons/booking.svg",
  },
  {
    source: "Airbnb",
    text: "Un'esperienza perfetta. La casa è splendida e in ottima posizione.",
    icon: "/icons/airbnb.svg",
  },
  {
    source: "Google Reviews",
    text: "Pulizia, cortesia e una vista mozzafiato. Consigliatissimo!",
    icon: "/icons/google.svg",
  },
];

const GuestFeedback: React.FC = () => {
  return (
    <section id="guest-feedback" className="elegant-section">
      <h2>🌟 Recensioni dei nostri ospiti</h2>
      <div className="feedback-grid">
        {feedbackData.map((item, index) => (
          <blockquote key={index} className="feedback-card">
            <img src={item.icon} alt={item.source} className="source-icon" />
            <p>"{item.text}"</p>
            <span>{item.source}</span>
          </blockquote>
        ))}
      </div>
    </section>
  );
};

export default GuestFeedback;