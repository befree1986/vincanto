import React from 'react';
import { useTranslation } from 'react-i18next';

interface InfoSectionProps {
  titleKey: string;
  items: string[];
  className: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ titleKey, items, className }) => {
  const { t } = useTranslation();
  return (
    <section className={className}>
      <h2 className="section-title">{t(titleKey)}</h2>
      <ul className="section-list">{items.map((itemKey, index) => <li key={index}>{t(itemKey)}</li>)}</ul>
    </section>
  );
};

export default InfoSection;