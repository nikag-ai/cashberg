import React from 'react';
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
export const GlassPanel = ({
  variant = 'default',
  children,
  className,
  ...props
}) => {
  const variants = {
    default: 'glass-panel',
    strong: 'glass-panel-strong',
    subtle: 'bg-white/[0.03] backdrop-blur-sm border border-white/[0.05] rounded-3xl'
  };
  return /*#__PURE__*/React.createElement(motion.div, _extends({
    className: cn(variants[variant], className)
  }, props), children);
};