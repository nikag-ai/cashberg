import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, LogOut } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { GlassPanel } from '../cashberg/GlassPanel';
import { GlassButton } from '../cashberg/GlassButton';
import { FloatingDock } from '../cashberg/FloatingDock';
import { MeltFAB } from '../cashberg/MeltFAB';
import { TransactionModal } from '../cashberg/TransactionModal';
export const RepairScreen = () => {
  const {
    totalBalance,
    safeToSpend,
    frozenPercentage,
    reconcile,
    logout
  } = useAppStore();
  const [actualBalance, setActualBalance] = useState(totalBalance.toString());
  const [isReconciled, setIsReconciled] = useState(false);
  const numericActual = parseFloat(actualBalance) || 0;
  const drift = numericActual - totalBalance;
  const hasDrift = Math.abs(drift) > 0.01;
  const handleReconcile = () => {
    reconcile(numericActual);
    setIsReconciled(true);
    setTimeout(() => setIsReconciled(false), 2000);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen pb-32 pt-12 px-6"
  }, /*#__PURE__*/React.createElement(motion.div, {
    className: "mb-8",
    initial: {
      y: -20,
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1
    }
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl font-bold mb-2"
  }, "The Repair"), /*#__PURE__*/React.createElement("p", {
    className: "text-muted-foreground"
  }, "Sync your iceberg with reality")), /*#__PURE__*/React.createElement(motion.div, {
    initial: {
      y: 20,
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1
    },
    transition: {
      delay: 0.1
    }
  }, /*#__PURE__*/React.createElement(GlassPanel, {
    className: "p-6 mb-6"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4"
  }, "Current State"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-muted-foreground"
  }, "Tracked Balance"), /*#__PURE__*/React.createElement("span", {
    className: "mono-number text-xl"
  }, "$", totalBalance.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-muted-foreground"
  }, "Safe to Spend"), /*#__PURE__*/React.createElement("span", {
    className: "mono-number text-xl text-primary"
  }, "$", safeToSpend.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-muted-foreground"
  }, "Frozen"), /*#__PURE__*/React.createElement("span", {
    className: "mono-number text-xl"
  }, frozenPercentage, "%"))))), /*#__PURE__*/React.createElement(motion.div, {
    initial: {
      y: 20,
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1
    },
    transition: {
      delay: 0.2
    }
  }, /*#__PURE__*/React.createElement(GlassPanel, {
    className: "p-6 mb-6"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4"
  }, "Reconcile"), /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement("label", {
    className: "text-sm text-muted-foreground mb-2 block"
  }, "Actual Bank Balance"), /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement("span", {
    className: "absolute left-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground"
  }, "$"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: actualBalance,
    onChange: e => setActualBalance(e.target.value),
    className: "w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-2xl font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50"
  }))), hasDrift && /*#__PURE__*/React.createElement(motion.div, {
    initial: {
      height: 0,
      opacity: 0
    },
    animate: {
      height: 'auto',
      opacity: 1
    },
    className: `p-4 rounded-2xl mb-4 flex items-center gap-3 ${drift > 0 ? 'bg-success/10' : 'bg-melt/10'}`
  }, /*#__PURE__*/React.createElement(AlertCircle, {
    size: 20,
    className: drift > 0 ? 'text-success' : 'text-melt'
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "font-medium"
  }, "Drift Detected: ", drift > 0 ? '+' : '', "$", drift.toFixed(2)), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-muted-foreground"
  }, drift > 0 ? 'You have more than tracked - maybe a deposit?' : 'You have less than tracked - check for missing expenses'))), isReconciled && /*#__PURE__*/React.createElement(motion.div, {
    initial: {
      scale: 0.9,
      opacity: 0
    },
    animate: {
      scale: 1,
      opacity: 1
    },
    className: "p-4 rounded-2xl mb-4 bg-success/10 flex items-center gap-3"
  }, /*#__PURE__*/React.createElement(CheckCircle, {
    size: 20,
    className: "text-success"
  }), /*#__PURE__*/React.createElement("p", {
    className: "font-medium text-success"
  }, "Balance reconciled!")), /*#__PURE__*/React.createElement(GlassButton, {
    variant: "primary",
    className: "w-full",
    onClick: handleReconcile,
    disabled: !hasDrift
  }, "\uD83D\uDD27 Apply Repair"))), /*#__PURE__*/React.createElement(motion.div, {
    initial: {
      y: 20,
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1
    },
    transition: {
      delay: 0.3
    }
  }, /*#__PURE__*/React.createElement(GlassPanel, {
    className: "p-6"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4"
  }, "Account"), /*#__PURE__*/React.createElement(GlassButton, {
    variant: "outline",
    className: "w-full flex items-center justify-center gap-2 text-melt border-melt/30 hover:bg-melt/10",
    onClick: logout
  }, /*#__PURE__*/React.createElement(LogOut, {
    size: 18
  }), "Surface & Logout"))), /*#__PURE__*/React.createElement(FloatingDock, null), /*#__PURE__*/React.createElement(MeltFAB, null), /*#__PURE__*/React.createElement(TransactionModal, null));
};