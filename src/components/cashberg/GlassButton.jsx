import React from 'react';
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
export const GlassButton = ({
  variant = 'default',
  size = 'md',
  children,
  className,
  ...props
}) => {
  const variants = {
    default: 'glass-button',
    primary: 'glass-button-primary',
    melt: 'glass-button-melt',
    outline: 'border border-white/20 bg-transparent hover:bg-white/10 rounded-full transition-all duration-300'
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  return /*#__PURE__*/React.createElement(motion.button, _extends({
    className: cn(variants[variant], sizes[size], 'font-medium', className),
    whileTap: {
      scale: 0.95
    },
    whileHover: {
      scale: 1.02
    }
  }, props), children);
};