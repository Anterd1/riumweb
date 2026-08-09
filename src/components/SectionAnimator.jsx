import React, { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const SectionAnimator = memo(({ children, className }) => {
  const reduceMotion = useReducedMotion();
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: isMobile ? 18 : 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: isMobile ? 1 : .8, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

SectionAnimator.displayName = 'SectionAnimator';

export default SectionAnimator;

