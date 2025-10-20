import React from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  srcSet?: string;
  sizes?: string;
  loading?: 'lazy' | 'eager';
}

const Image: React.FC<ImageProps> = ({
  src,
  alt,
  srcSet,
  sizes = '(max-width: 600px) 90vw, (max-width: 992px) 45vw, 480px',
  loading = 'lazy',
  ...props
}) => {
  return <img src={src} alt={alt} srcSet={srcSet} sizes={sizes} loading={loading} {...props} />;
};

export default Image;