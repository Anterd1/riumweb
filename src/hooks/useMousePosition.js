import React, { useState, useEffect, useRef } from 'react';

const useMousePosition = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const rafRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Usar requestAnimationFrame para optimizar actualizaciones
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return position;
};

export default useMousePosition;