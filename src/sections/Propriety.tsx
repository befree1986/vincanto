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
        </div>
      </div>
      <LemonDivider position="left" />
    </section>
  );
};

export default Propriety;
