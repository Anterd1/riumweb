import React, { memo, useEffect } from 'react';
import useMousePosition from '@/hooks/useMousePosition';
import { motion } from 'framer-motion';

const CustomCursor = memo(() => {
  const { x, y } = useMousePosition();

  // Ocultar cursor nativo al montar, restaurar al desmontar
  useEffect(() => {
    // Crear estilo para ocultar cursor en todo, incluyendo links y botones
    const style = document.createElement('style');
    style.innerHTML = `
      html, body, a, button, input, select, textarea, [role="button"] {
        cursor: none !important;
      }
    `;
    style.id = 'hide-cursor-style';
    document.head.appendChild(style);

    return () => {
      // Eliminar estilo al desmontar para restaurar cursor nativo
      const existingStyle = document.getElementById('hide-cursor-style');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  const variants = {
    default: {
      x: x - 8,
      y: y - 8,
      height: 16,
      width: 16,
      backgroundColor: '#3B82F6', // Changed to blue
      mixBlendMode: 'difference',
    },
  };

  return (
    <motion.div
      variants={variants}
      animate="default"
      transition={{ 
        type: "tween", 
        duration: 0.1,
        ease: "easeOut"
      }}
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
      style={{ willChange: 'transform' }}
    />
  );
});

CustomCursor.displayName = 'CustomCursor';

export default CustomCursor;
