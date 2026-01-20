import React from 'react';
import { motion } from 'framer-motion';
import { Delete } from 'lucide-react';
export const NumericKeypad = ({
  onInput,
  onDelete,
  onClear
}) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];
  return /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-3 p-4"
  }, keys.map(key => /*#__PURE__*/React.createElement(motion.button, {
    key: key,
    className: "keypad-button font-mono",
    onClick: () => {
      if (key === 'del') {
        onDelete();
      } else {
        onInput(key);
      }
    },
    whileTap: {
      scale: 0.85
    },
    whileHover: {
      backgroundColor: 'rgba(255,255,255,0.15)'
    }
  }, key === 'del' ? /*#__PURE__*/React.createElement(Delete, {
    size: 24
  }) : key)));
};