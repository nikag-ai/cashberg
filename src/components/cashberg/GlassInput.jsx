import React from 'react';
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
export const GlassInput = /*#__PURE__*/forwardRef(({
  className,
  label,
  ...props
}, ref) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "w-full"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "block text-sm text-muted-foreground mb-2 font-medium"
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    ref: ref,
    className: cn('glass-input', className)
  }, props)));
});
GlassInput.displayName = 'GlassInput';