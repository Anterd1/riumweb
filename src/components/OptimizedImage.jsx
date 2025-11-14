import React, { useState } from 'react';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height,
  priority = false,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Generar srcset para diferentes tamaños si es una imagen local
  const generateSrcSet = (baseSrc) => {
    if (!baseSrc || baseSrc.startsWith('http')) return undefined;
    // Para imágenes locales, podríamos generar srcset si hay un servicio de optimización
    // Por ahora retornamos undefined para usar la imagen original
    return undefined;
  };

  return (
    <div className={`relative overflow-hidden ${className}`} style={{ aspectRatio: width && height ? `${width}/${height}` : undefined }}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse" />
      )}
      <img
        src={src}
        srcSet={generateSrcSet(src)}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        {...props}
      />
      {error && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <span className="text-gray-500 text-sm">Error al cargar imagen</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;

