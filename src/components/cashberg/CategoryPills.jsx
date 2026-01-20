import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
const categories = [{
  id: 'coffee',
  label: '☕ Coffee',
  emoji: '☕'
}, {
  id: 'food',
  label: '🍔 Food',
  emoji: '🍔'
}, {
  id: 'transport',
  label: '🚗 Transport',
  emoji: '🚗'
}, {
  id: 'shopping',
  label: '🛍️ Shopping',
  emoji: '🛍️'
}, {
  id: 'entertainment',
  label: '🎬 Fun',
  emoji: '🎬'
}, {
  id: 'bills',
  label: '📄 Bills',
  emoji: '📄'
}, {
  id: 'health',
  label: '💊 Health',
  emoji: '💊'
}, {
  id: 'other',
  label: '📦 Other',
  emoji: '📦'
}];
export const CategoryPills = ({
  selected,
  onSelect
}) => {
  return /*#__PURE__*/React.createElement("div", {
    className: "overflow-x-auto pb-2 -mx-4 px-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 min-w-max"
  }, categories.map(category => /*#__PURE__*/React.createElement(motion.button, {
    key: category.id,
    onClick: () => onSelect(category.id),
    className: cn(selected === category.id ? 'pill-badge-active' : 'pill-badge'),
    whileTap: {
      scale: 0.95
    }
  }, category.label))));
};