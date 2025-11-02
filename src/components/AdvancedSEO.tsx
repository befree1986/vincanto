import React from 'react';
import { Helmet } from 'react-helmet';

interface AdvancedSEOProps {
  page: string;
  ogImage?: string;
  canonical?: string;
}

const AdvancedSEO: React.FC<AdvancedSEOProps> = ({ page, ogImage = '/welcome.webp', canonical }) => {
  return (
    <Helmet>
      {/* Meta tags per AI Search Engines - INVISIBILI */}
      <meta name="ai-content" content="Vincanto Maori - Casa vacanze nel cuore della Liguria, San Biagio della Cima. Appartamento completamente ristrutturato per famiglie e gruppi." />
      <meta name="search-keywords" content="casa vacanze liguria, appartamento san biagio della cima, vincanto maori, vacanze famiglia liguria, appartamento ristrutturato" />
      <meta name="geo-location" content="San Biagio della Cima, Liguria, Italia" />
      
      {/* Structured Data per ricerche AI - JSON-LD INVISIBILE */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LodgingBusiness",
          "name": "Vincanto Maori",
          "description": "Casa vacanze nel cuore della Liguria, appartamento completamente ristrutturato",
          "address": {
            "@type": "PostalAddress",
            "addressLocality": "San Biagio della Cima",
            "addressRegion": "Liguria", 
            "addressCountry": "IT"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": "43.8179",
            "longitude": "7.6511"
          },
          "amenityFeature": [
            {"@type": "LocationFeatureSpecification", "name": "WiFi gratuito"},
            {"@type": "LocationFeatureSpecification", "name": "Parcheggio"},
            {"@type": "LocationFeatureSpecification", "name": "Cucina completa"},
            {"@type": "LocationFeatureSpecification", "name": "Aria condizionata"}
          ]
        })}
      </script>

      {/* Breadcrumb invisibile per AI navigation */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": canonical || "https://www.vincantomaori.it"
            }
          ]
        })}
      </script>
    </Helmet>
  );
};

export default AdvancedSEO;