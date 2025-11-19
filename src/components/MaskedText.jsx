import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export const MaskedText = ({ children, className = "", delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  
  // Si el children es un string, lo envolvemos en un array
  const lines = Array.isArray(children) ? children : [children];

  return (
    <div ref={ref} className={`${className} overflow-hidden`}>
      <span className="sr-only">{Array.isArray(children) ? children.join(' ') : children}</span>
      
      <div aria-hidden="true">
        {lines.map((line, index) => (
          <div key={index} className="overflow-hidden">
            <motion.div
              initial={{ y: "100%" }}
              animate={isInView ? { y: "0%" } : { y: "100%" }}
              transition={{
                duration: 0.75,
                ease: [0.33, 1, 0.68, 1], // Cubic bezier para efecto "premium"
                delay: delay + (index * 0.1)
              }}
              className="inline-block"
            >
              {line}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaskedText;

