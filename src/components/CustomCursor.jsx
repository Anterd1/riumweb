import React, { memo } from 'react';
import useMousePosition from '@/hooks/useMousePosition';
import { motion } from 'framer-motion';

const CustomCursor = memo(() => {
  const { x, y } = useMousePosition();

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
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
    />
  );
});

CustomCursor.displayName = 'CustomCursor';

export default CustomCursor;
