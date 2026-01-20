import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import { IcebergVisual } from '../cashberg/IcebergVisual';
import { FloatingDock } from '../cashberg/FloatingDock';
import { MeltFAB } from '../cashberg/MeltFAB';
import { TransactionModal } from '../cashberg/TransactionModal';
import { GlassPanel } from '../cashberg/GlassPanel';
import { TrendingDown, Snowflake } from 'lucide-react';
export const SurfaceScreen = () => {
  const {
    safeToSpend,
    totalBalance,
    frozenPercentage,
    transactions
  } = useAppStore();
  const isDanger = safeToSpend < 100;
  const recentTransactions = transactions.slice(0, 3);
  const weeklySpent = transactions.filter(t => t.type === 'melt').reduce((sum, t) => sum + t.amount, 0);
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen pb-32 pt-12 px-6 relative"
  }, /*#__PURE__*/React.createElement(motion.div, {
    className: "text-center mb-4",
    initial: {
      y: -20,
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-muted-foreground mb-2 uppercase tracking-wider"
  }, "Safe to Spend"), /*#__PURE__*/React.createElement(motion.h1, {
    className: `mono-number-hero ${isDanger ? 'text-melt' : 'text-foreground'}`,
    key: safeToSpend,
    initial: {
      scale: 1.1
    },
    animate: {
      scale: 1
    }
  }, "$", safeToSpend.toLocaleString('en-US', {
    maximumFractionDigits: 2
  }))), /*#__PURE__*/React.createElement(motion.div, {
    className: "flex justify-center mb-8",
    initial: {
      scale: 0.9,
      opacity: 0
    },
    animate: {
      scale: 1,
      opacity: 1
    },
    transition: {
      delay: 0.1
    }
  }, /*#__PURE__*/React.createElement(IcebergVisual, {
    percentage: frozenPercentage,
    isDanger: isDanger,
    size: "lg"
  })), /*#__PURE__*/React.createElement(motion.div, {
    className: "grid grid-cols-2 gap-4 mb-6",
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
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-2"
  }, /*#__PURE__*/React.createElement(TrendingDown, {
    size: 16,
    className: "text-melt"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-muted-foreground"
  }, "This Week")), /*#__PURE__*/React.createElement("p", {
    className: "mono-number text-xl text-melt"
  }, "-$", weeklySpent.toFixed(2))), /*#__PURE__*/React.createElement(GlassPanel, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-2"
  }, /*#__PURE__*/React.createElement(Snowflake, {
    size: 16,
    className: "text-primary"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-muted-foreground"
  }, "Frozen")), /*#__PURE__*/React.createElement("p", {
    className: "mono-number text-xl text-primary"
  }, "$", (totalBalance * frozenPercentage / 100).toFixed(0)))), /*#__PURE__*/React.createElement(motion.div, {
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
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between items-center mb-3"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-sm font-medium text-muted-foreground uppercase tracking-wider"
  }, "Recent")), recentTransactions.length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, recentTransactions.map(transaction => /*#__PURE__*/React.createElement(GlassPanel, {
    key: transaction.id,
    variant: "subtle",
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'melt' ? 'bg-melt/20 text-melt' : transaction.type === 'payday' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}`
  }, transaction.type === 'melt' ? '🔥' : transaction.type === 'payday' ? '💰' : '❄️'), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "font-medium capitalize"
  }, transaction.category), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-muted-foreground"
  }, transaction.date.toLocaleDateString()))), /*#__PURE__*/React.createElement("p", {
    className: `mono-number text-lg ${transaction.type === 'melt' ? 'text-melt' : 'text-success'}`
  }, transaction.type === 'melt' ? '-' : '+', "$", transaction.amount.toFixed(2)))))) : /*#__PURE__*/React.createElement(GlassPanel, {
    variant: "subtle",
    className: "p-8 text-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-muted-foreground"
  }, "No transactions yet"), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-muted-foreground/60 mt-1"
  }, "Tap the - button to melt some ice"))), /*#__PURE__*/React.createElement(FloatingDock, null), /*#__PURE__*/React.createElement(MeltFAB, null), /*#__PURE__*/React.createElement(TransactionModal, null));
};