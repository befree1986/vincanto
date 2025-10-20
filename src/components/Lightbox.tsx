import React from 'react';
import { useTranslation } from 'react-i18next';
import Image from './Image'; // Usiamo il nostro componente ottimizzato
type GalleryImage = {
  src: string;
  srcSet?: string;
  altKey: string;
  captionKey?: string;
  captionText?: string;
};

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  touchStartXRef: React.MutableRefObject<number>;
}

const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  touchStartXRef,
}) => {
  const { t } = useTranslation();

  if (!images.length) {
    return null;
  }

  const currentImage = images[currentIndex];

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div
        className="lightbox-content"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          touchStartXRef.current = e.changedTouches[0].clientX;
        }}
        onTouchEnd={(e) => {
          const delta = e.changedTouches[0].clientX - touchStartXRef.current;
          if (Math.abs(delta) > 50) {
            if (delta > 0) onPrev();
            else onNext();
          }
        }}
      >
        <button className="lightbox-close" onClick={onClose}>&times;</button>
        {images.length > 1 && (
          <>
            <button className="lightbox-prev" onClick={onPrev}>&#10094;</button>
            <button className="lightbox-next" onClick={onNext}>&#10095;</button>
          </>
        )}
        <Image
          src={currentImage.src}
          srcSet={currentImage.srcSet}
          alt={t(currentImage.altKey)}
          className="lightbox-img"
        />
        {images.length > 1 && <div className="lightbox-indicator">{currentIndex + 1} / {images.length}</div>}
        {(currentImage.captionKey || currentImage.captionText) && <div className="lightbox-caption">{currentImage.captionText || t(currentImage.captionKey!)}</div>}
      </div>
    </div>
  );
};

export default Lightbox;