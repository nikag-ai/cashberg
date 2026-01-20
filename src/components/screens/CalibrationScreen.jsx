import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassPanel } from '../cashberg/GlassPanel';
import { GlassButton } from '../cashberg/GlassButton';
import { IcebergVisual } from '../cashberg/IcebergVisual';
import { useAppStore } from '@/store/appStore';
export const CalibrationScreen = () => {
  const {
    completeOnboarding,
    logout
  } = useAppStore();
  const [balance, setBalance] = useState(5000);
  const [frozenPercent, setFrozenPercent] = useState(70);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const safeToSpend = balance * (1 - frozenPercent / 100);
  const frozenAmount = balance * (frozenPercent / 100);

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await completeOnboarding(balance, frozenPercent);
    } catch (error) {
      console.error("Calibration failed:", error);
      alert("Failed to freeze state: " + (error.message || "Unknown error"));
      setIsSubmitting(false);
    }
  };

  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col items-center justify-center p-6 relative"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: logout,
    className: "absolute top-6 right-6 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-sm text-white font-medium hover:bg-white/20 transition-colors z-50"
  }, "LOGOUT"), /*#__PURE__*/React.createElement(motion.div, {
    className: "text-center mb-8",
    initial: {
      y: -30,
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1
    }
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold mb-2"
  }, "Calibrate Your Berg"), /*#__PURE__*/React.createElement("p", {
    className: "text-muted-foreground"
  }, "Set your total balance and decide how much to freeze")), /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-md space-y-8"
  }, /*#__PURE__*/React.createElement(motion.div, {
    initial: {
      x: -30,
      opacity: 0
    },
    animate: {
      x: 0,
      opacity: 1
    },
    transition: {
      delay: 0.1
    }
  }, /*#__PURE__*/React.createElement(GlassPanel, {
    className: "p-6"
  }, /*#__PURE__*/React.createElement("label", {
    className: "block text-sm text-muted-foreground mb-3"
  }, "Total Bank Balance"), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("span", {
    className: "absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-muted-foreground"
  }, "$"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: balance,
    onChange: e => setBalance(Number(e.target.value)),
    className: "w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-3xl font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50"
  })))), /*#__PURE__*/React.createElement(motion.div, {
    className: "flex justify-center",
    initial: {
      scale: 0.8,
      opacity: 0
    },
    animate: {
      scale: 1,
      opacity: 1
    },
    transition: {
      delay: 0.2
    }
  }, /*#__PURE__*/React.createElement(IcebergVisual, {
    percentage: frozenPercent,
    size: "md"
  })), /*#__PURE__*/React.createElement(motion.div, {
    initial: {
      x: 30,
      opacity: 0
    },
    animate: {
      x: 0,
      opacity: 1
    },
    transition: {
      delay: 0.3
    }
  }, /*#__PURE__*/React.createElement(GlassPanel, {
    className: "p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mb-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm text-muted-foreground"
  }, "Water Level"), /*#__PURE__*/React.createElement("span", {
    className: "font-mono font-semibold text-primary"
  }, frozenPercent, "% Frozen")), /*#__PURE__*/React.createElement("div", {
    className: "relative h-3 bg-white/10 rounded-full overflow-hidden mb-6"
  }, /*#__PURE__*/React.createElement(motion.div, {
    className: "absolute inset-y-0 left-0 rounded-full",
    style: {
      background: 'linear-gradient(90deg, #22d3ee 0%, #0891b2 100%)',
      width: `${frozenPercent}%`
    },
    layout: true
  }), /*#__PURE__*/React.createElement("input", {
    type: "range",
    min: "0",
    max: "95",
    value: frozenPercent,
    onChange: e => setFrozenPercent(Number(e.target.value)),
    className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer"
  }), /*#__PURE__*/React.createElement(motion.div, {
    className: "absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg",
    style: {
      left: `calc(${frozenPercent}% - 12px)`
    },
    layout: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-center p-4 bg-primary/10 rounded-2xl"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-muted-foreground mb-1"
  }, "Safe to Spend"), /*#__PURE__*/React.createElement("p", {
    className: "mono-number text-2xl text-primary"
  }, "$", safeToSpend.toLocaleString('en-US', {
    maximumFractionDigits: 0
  }))), /*#__PURE__*/React.createElement("div", {
    className: "text-center p-4 bg-white/5 rounded-2xl"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-muted-foreground mb-1"
  }, "Frozen"), /*#__PURE__*/React.createElement("p", {
    className: "mono-number text-2xl"
  }, "$", frozenAmount.toLocaleString('en-US', {
    maximumFractionDigits: 0
  })))))), /*#__PURE__*/React.createElement(motion.div, {
    initial: {
      y: 30,
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1
    },
    transition: {
      delay: 0.4
    }
  }, /*#__PURE__*/React.createElement(GlassButton, {
    variant: "primary",
    className: "w-full py-5 text-lg",
    onClick: handleComplete,
    disabled: isSubmitting
  }, isSubmitting ? "Freezing..." : "\u2744\uFE0F Freeze This State"))));
};