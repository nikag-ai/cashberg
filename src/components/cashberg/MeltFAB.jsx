import React from 'react';
import { motion } from 'framer-motion';
import { Minus } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
export const MeltFAB = () => {
  const {
    setTransactionModalOpen
  } = useAppStore();
  return /*#__PURE__*/React.createElement(motion.button, {
    className: "fab right-6 bottom-28",
    onClick: () => setTransactionModalOpen(true),
    initial: {
      scale: 0,
      opacity: 0
    },
    animate: {
      scale: 1,
      opacity: 1
    },
    transition: {
      delay: 0.5,
      type: 'spring',
      stiffness: 300
    },
    whileTap: {
      scale: 0.85
    },
    whileHover: {
      scale: 1.1
    }
  }, /*#__PURE__*/React.createElement(Minus, {
    size: 28,
    className: "text-white",
    strokeWidth: 3
  }));
};