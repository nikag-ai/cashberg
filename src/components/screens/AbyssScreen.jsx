import React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { GlassPanel } from '../cashberg/GlassPanel';
import { GlassButton } from '../cashberg/GlassButton';
import { FloatingDock } from '../cashberg/FloatingDock';
import { MeltFAB } from '../cashberg/MeltFAB';
import { TransactionModal } from '../cashberg/TransactionModal';
export const AbyssScreen = () => {
  const {
    buckets,
    updateBucket,
    safeToSpend
  } = useAppStore();
  const [expandedBucket, setExpandedBucket] = useState(null);
  const [transferAmount, setTransferAmount] = useState('');
  const handleTransfer = (bucketId, action) => {
    const amount = parseFloat(transferAmount);
    if (amount > 0) {
      if (action === 'freeze' && amount > safeToSpend) {
        return; // Can't freeze more than safe to spend
      }
      const bucket = buckets.find(b => b.id === bucketId);
      if (action === 'thaw' && bucket && amount > bucket.currentAmount) {
        return; // Can't thaw more than bucket has
      }
      updateBucket(bucketId, amount, action);
      setTransferAmount('');
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen pb-32 pt-12 px-6 abyss-bg"
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
  }, "The Abyss"), /*#__PURE__*/React.createElement("p", {
    className: "text-muted-foreground"
  }, "Your frozen savings and goals")), /*#__PURE__*/React.createElement("div", {
    className: "space-y-4"
  }, buckets.map((bucket, index) => {
    const isExpanded = expandedBucket === bucket.id;
    const progress = bucket.currentAmount / bucket.targetAmount * 100;
    const isComplete = bucket.currentAmount >= bucket.targetAmount;
    return /*#__PURE__*/React.createElement(motion.div, {
      key: bucket.id,
      initial: {
        x: -20,
        opacity: 0
      },
      animate: {
        x: 0,
        opacity: 1
      },
      transition: {
        delay: index * 0.1
      }
    }, /*#__PURE__*/React.createElement(GlassPanel, {
      className: "overflow-hidden cursor-pointer",
      onClick: () => setExpandedBucket(isExpanded ? null : bucket.id)
    }, /*#__PURE__*/React.createElement("div", {
      className: "p-5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between mb-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-2xl"
    }, bucket.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      className: "font-semibold"
    }, bucket.name), /*#__PURE__*/React.createElement("p", {
      className: "text-sm text-muted-foreground"
    }, "$", bucket.currentAmount.toLocaleString(), " of $", bucket.targetAmount.toLocaleString()))), /*#__PURE__*/React.createElement(motion.div, {
      animate: {
        rotate: isExpanded ? 90 : 0
      },
      transition: {
        duration: 0.2
      }
    }, /*#__PURE__*/React.createElement(ChevronRight, {
      size: 20,
      className: "text-muted-foreground"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "relative h-2 bg-white/10 rounded-full overflow-hidden"
    }, /*#__PURE__*/React.createElement(motion.div, {
      className: "absolute inset-y-0 left-0 rounded-full",
      style: {
        background: isComplete ? 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)' : 'linear-gradient(90deg, #22d3ee 0%, #0891b2 100%)'
      },
      initial: {
        width: 0
      },
      animate: {
        width: `${Math.min(progress, 100)}%`
      },
      transition: {
        duration: 0.5,
        delay: 0.2
      }
    }))), /*#__PURE__*/React.createElement(AnimatePresence, null, isExpanded && /*#__PURE__*/React.createElement(motion.div, {
      initial: {
        height: 0,
        opacity: 0
      },
      animate: {
        height: 'auto',
        opacity: 1
      },
      exit: {
        height: 0,
        opacity: 0
      },
      transition: {
        duration: 0.3
      },
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("div", {
      className: "px-5 pb-5 pt-2 border-t border-white/10"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mb-4"
    }, /*#__PURE__*/React.createElement("label", {
      className: "text-sm text-muted-foreground mb-2 block"
    }, "Amount to transfer"), /*#__PURE__*/React.createElement("div", {
      className: "relative"
    }, /*#__PURE__*/React.createElement("span", {
      className: "absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
    }, "$"), /*#__PURE__*/React.createElement("input", {
      type: "number",
      value: transferAmount,
      onChange: e => setTransferAmount(e.target.value),
      placeholder: "0.00",
      className: "w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 font-mono focus:outline-none focus:ring-2 focus:ring-primary/50"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-2 gap-3"
    }, /*#__PURE__*/React.createElement(GlassButton, {
      variant: "primary",
      size: "sm",
      className: "flex items-center justify-center gap-2",
      onClick: () => handleTransfer(bucket.id, 'freeze')
    }, /*#__PURE__*/React.createElement(Plus, {
      size: 18
    }), "Freeze"), /*#__PURE__*/React.createElement(GlassButton, {
      variant: "outline",
      size: "sm",
      className: "flex items-center justify-center gap-2",
      onClick: () => handleTransfer(bucket.id, 'thaw')
    }, /*#__PURE__*/React.createElement(Minus, {
      size: 18
    }), "Thaw")))))));
  })), /*#__PURE__*/React.createElement(motion.div, {
    className: "mt-6",
    initial: {
      y: 20,
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
    variant: "outline",
    className: "w-full flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement(Plus, {
    size: 20
  }), "Create New Bucket")), /*#__PURE__*/React.createElement(FloatingDock, null), /*#__PURE__*/React.createElement(MeltFAB, null), /*#__PURE__*/React.createElement(TransactionModal, null));
};