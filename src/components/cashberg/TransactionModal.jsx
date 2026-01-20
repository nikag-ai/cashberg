import React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { GlassPanel } from './GlassPanel';
import { GlassButton } from './GlassButton';
import { NumericKeypad } from './NumericKeypad';
import { CategoryPills } from './CategoryPills';
export const TransactionModal = () => {
  const {
    isTransactionModalOpen,
    setTransactionModalOpen,
    addTransaction,
    safeToSpend
  } = useAppStore();
  const [amount, setAmount] = useState('0');
  const [category, setCategory] = useState('coffee');
  const handleInput = value => {
    if (value === '.' && amount.includes('.')) return;
    if (amount === '0' && value !== '.') {
      setAmount(value);
    } else {
      setAmount(amount + value);
    }
  };
  const handleDelete = () => {
    if (amount.length === 1) {
      setAmount('0');
    } else {
      setAmount(amount.slice(0, -1));
    }
  };
  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0) {
      addTransaction({
        type: 'melt',
        amount: numAmount,
        category
      });
      setAmount('0');
      setCategory('coffee');
      setTransactionModalOpen(false);
    }
  };
  const numericAmount = parseFloat(amount) || 0;
  const isOverBudget = numericAmount > safeToSpend;
  return /*#__PURE__*/React.createElement(AnimatePresence, null, isTransactionModalOpen && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(motion.div, {
    className: "fixed inset-0 bg-black/60 backdrop-blur-sm z-40",
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1
    },
    exit: {
      opacity: 0
    },
    onClick: () => setTransactionModalOpen(false)
  }), /*#__PURE__*/React.createElement(motion.div, {
    className: "fixed inset-x-0 bottom-0 z-50",
    initial: {
      y: '100%'
    },
    animate: {
      y: 0
    },
    exit: {
      y: '100%'
    },
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300
    }
  }, /*#__PURE__*/React.createElement(GlassPanel, {
    variant: "strong",
    className: "rounded-t-[2rem] rounded-b-none border-b-0 p-6 pt-4 max-h-[85vh] overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-1 bg-white/20 rounded-full"
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setTransactionModalOpen(false),
    className: "absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
  }, /*#__PURE__*/React.createElement(X, {
    size: 24
  })), /*#__PURE__*/React.createElement("div", {
    className: "text-center mb-6"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-muted-foreground mb-2"
  }, "Melting"), /*#__PURE__*/React.createElement("p", {
    className: `mono-number-hero ${isOverBudget ? 'text-melt' : 'text-foreground'}`
  }, "-$", amount), isOverBudget && /*#__PURE__*/React.createElement(motion.p, {
    className: "text-sm text-melt mt-2",
    initial: {
      opacity: 0,
      y: -10
    },
    animate: {
      opacity: 1,
      y: 0
    }
  }, "Exceeds Safe to Spend!")), /*#__PURE__*/React.createElement("div", {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-muted-foreground mb-3"
  }, "Category"), /*#__PURE__*/React.createElement(CategoryPills, {
    selected: category,
    onSelect: setCategory
  })), /*#__PURE__*/React.createElement(NumericKeypad, {
    onInput: handleInput,
    onDelete: handleDelete,
    onClear: () => setAmount('0')
  }), /*#__PURE__*/React.createElement("div", {
    className: "mt-4"
  }, /*#__PURE__*/React.createElement(GlassButton, {
    variant: "melt",
    className: "w-full py-4 text-lg",
    onClick: handleSubmit,
    disabled: numericAmount === 0
  }, "\uD83D\uDD25 Melt It"))))));
};