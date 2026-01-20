import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Snowflake, Banknote, Undo2 } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { GlassPanel } from '../cashberg/GlassPanel';
import { FloatingDock } from '../cashberg/FloatingDock';
import { MeltFAB } from '../cashberg/MeltFAB';
import { TransactionModal } from '../cashberg/TransactionModal';
export const StreamScreen = () => {
  const {
    transactions,
    undoTransaction
  } = useAppStore();
  const getIcon = type => {
    switch (type) {
      case 'melt':
        return /*#__PURE__*/React.createElement(Flame, {
          size: 20,
          className: "text-melt"
        });
      case 'freeze':
        return /*#__PURE__*/React.createElement(Snowflake, {
          size: 20,
          className: "text-primary"
        });
      case 'payday':
        return /*#__PURE__*/React.createElement(Banknote, {
          size: 20,
          className: "text-success"
        });
    }
  };
  const getLabel = type => {
    switch (type) {
      case 'melt':
        return 'Spent';
      case 'freeze':
        return 'Saved';
      case 'payday':
        return 'Income';
    }
  };

  // Group transactions by date
  const groupedTransactions = transactions.reduce((groups, transaction) => {
    const date = transaction.date.toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {});
  const formatDate = dateString => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      });
    }
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
  }, "The Stream"), /*#__PURE__*/React.createElement("p", {
    className: "text-muted-foreground"
  }, "Your transaction history")), Object.keys(groupedTransactions).length > 0 ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-6"
  }, Object.entries(groupedTransactions).map(([date, dayTransactions], groupIndex) => /*#__PURE__*/React.createElement(motion.div, {
    key: date,
    initial: {
      y: 20,
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1
    },
    transition: {
      delay: groupIndex * 0.1
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider"
  }, formatDate(date)), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, dayTransactions.map((transaction, index) => /*#__PURE__*/React.createElement(motion.div, {
    key: transaction.id,
    initial: {
      x: -20,
      opacity: 0
    },
    animate: {
      x: 0,
      opacity: 1
    },
    transition: {
      delay: groupIndex * 0.1 + index * 0.05
    }
  }, /*#__PURE__*/React.createElement(GlassPanel, {
    className: "p-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'melt' ? 'bg-melt/20' : transaction.type === 'payday' ? 'bg-success/20' : 'bg-primary/20'}`
  }, getIcon(transaction.type)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "font-medium capitalize"
  }, transaction.category), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-muted-foreground"
  }, getLabel(transaction.type), " \u2022 ", transaction.date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("p", {
    className: `mono-number text-lg ${transaction.type === 'melt' ? 'text-melt' : transaction.type === 'payday' ? 'text-success' : 'text-primary'}`
  }, transaction.type === 'melt' ? '-' : '+', "$", transaction.amount.toFixed(2)), /*#__PURE__*/React.createElement(motion.button, {
    onClick: () => undoTransaction(transaction.id),
    className: "p-2 rounded-full hover:bg-white/10 transition-colors",
    whileTap: {
      scale: 0.9
    },
    title: "Undo"
  }, /*#__PURE__*/React.createElement(Undo2, {
    size: 16,
    className: "text-muted-foreground"
  }))))))))))) : /*#__PURE__*/React.createElement(motion.div, {
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
    className: "p-12 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-6xl mb-4"
  }, "\uD83C\uDF0A"), /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-semibold mb-2"
  }, "The stream is empty"), /*#__PURE__*/React.createElement("p", {
    className: "text-muted-foreground"
  }, "Your transaction history will flow here once you start spending"))), /*#__PURE__*/React.createElement(FloatingDock, null), /*#__PURE__*/React.createElement(MeltFAB, null), /*#__PURE__*/React.createElement(TransactionModal, null));
};