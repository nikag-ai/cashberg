import React from 'react';
import { motion } from 'framer-motion';
import { Waves, Layers, Clock, Wrench, LogOut } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { cn } from '@/lib/utils';
const navItems = [{
  icon: /*#__PURE__*/React.createElement(Waves, {
    size: 22
  }),
  label: 'Surface',
  screen: 'surface'
}, {
  icon: /*#__PURE__*/React.createElement(Layers, {
    size: 22
  }),
  label: 'Abyss',
  screen: 'abyss'
}, {
  icon: /*#__PURE__*/React.createElement(Clock, {
    size: 22
  }),
  label: 'Stream',
  screen: 'stream'
}, {
  icon: /*#__PURE__*/React.createElement(Wrench, {
    size: 22
  }),
  label: 'Repair',
  screen: 'repair'
}];
export const FloatingDock = () => {
  const {
    currentScreen,
    setScreen
  } = useAppStore();
  return /*#__PURE__*/React.createElement(motion.nav, {
    className: "floating-dock",
    initial: {
      y: 100,
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1
    },
    transition: {
      delay: 0.3,
      type: 'spring',
      stiffness: 200
    }
  }, navItems.map(item => /*#__PURE__*/React.createElement(motion.button, {
    key: item.screen,
    onClick: () => setScreen(item.screen),
    className: cn('flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300', currentScreen === item.screen ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-white/10'),
    whileTap: {
      scale: 0.9
    },
    whileHover: {
      y: -2
    }
  }, item.icon, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] mt-1 font-medium"
  }, item.label))));
};