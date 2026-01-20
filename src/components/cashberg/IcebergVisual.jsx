import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
export const IcebergVisual = ({
  percentage = 30,
  isDanger = false,
  size = 'md',
  className
}) => {
  const sizes = {
    sm: {
      width: 80,
      height: 120
    },
    md: {
      width: 160,
      height: 240
    },
    lg: {
      width: 240,
      height: 360
    }
  };
  const {
    width,
    height
  } = sizes[size];
  const waterLevel = height * (percentage / 100);
  return /*#__PURE__*/React.createElement("div", {
    className: cn('relative', className)
  }, /*#__PURE__*/React.createElement(motion.svg, {
    width: width,
    height: height,
    viewBox: "0 0 160 240",
    className: cn('transition-all duration-500', isDanger ? 'iceberg-glow-danger' : 'iceberg-glow'),
    animate: {
      y: [0, -8, 0]
    },
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "iceGradient",
    x1: "0%",
    y1: "0%",
    x2: "100%",
    y2: "100%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: isDanger ? "#FF6B6B" : "#22d3ee",
    stopOpacity: "1"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "50%",
    stopColor: isDanger ? "#FF8E8E" : "#67e8f9",
    stopOpacity: "0.9"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: isDanger ? "#FF6B6B" : "#06b6d4",
    stopOpacity: "0.8"
  })), /*#__PURE__*/React.createElement("linearGradient", {
    id: "underwaterGradient",
    x1: "0%",
    y1: "0%",
    x2: "0%",
    y2: "100%"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0%",
    stopColor: isDanger ? "#991B1B" : "#0891b2",
    stopOpacity: "0.6"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "100%",
    stopColor: isDanger ? "#7F1D1D" : "#0e7490",
    stopOpacity: "0.3"
  })), /*#__PURE__*/React.createElement("clipPath", {
    id: "underwaterClip"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: 240 - waterLevel,
    width: "160",
    height: waterLevel
  }))), /*#__PURE__*/React.createElement(motion.path, {
    d: "M80 10 L110 50 L120 90 L130 150 L125 200 L110 230 L50 230 L35 200 L30 150 L40 90 L50 50 Z",
    fill: "url(#iceGradient)",
    stroke: "rgba(255,255,255,0.3)",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement(motion.path, {
    d: "M80 10 L110 50 L120 90 L130 150 L125 200 L110 230 L50 230 L35 200 L30 150 L40 90 L50 50 Z",
    fill: "url(#underwaterGradient)",
    clipPath: "url(#underwaterClip)"
  }), /*#__PURE__*/React.createElement(motion.line, {
    x1: "0",
    y1: 240 - waterLevel,
    x2: "160",
    y2: 240 - waterLevel,
    stroke: "rgba(255,255,255,0.2)",
    strokeWidth: "1",
    strokeDasharray: "4 4"
  }), /*#__PURE__*/React.createElement(motion.ellipse, {
    cx: "65",
    cy: "60",
    rx: "8",
    ry: "15",
    fill: "rgba(255,255,255,0.3)",
    animate: {
      opacity: [0.3, 0.5, 0.3]
    },
    transition: {
      duration: 2,
      repeat: Infinity
    }
  }), /*#__PURE__*/React.createElement(motion.ellipse, {
    cx: "75",
    cy: "45",
    rx: "4",
    ry: "8",
    fill: "rgba(255,255,255,0.4)"
  }), isDanger && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(motion.path, {
    d: "M60 80 L75 100 L65 130",
    stroke: "#FF6B6B",
    strokeWidth: "2",
    fill: "none",
    initial: {
      pathLength: 0
    },
    animate: {
      pathLength: 1
    },
    transition: {
      duration: 0.5
    }
  }), /*#__PURE__*/React.createElement(motion.path, {
    d: "M90 70 L85 95 L100 120",
    stroke: "#FF6B6B",
    strokeWidth: "1.5",
    fill: "none",
    initial: {
      pathLength: 0
    },
    animate: {
      pathLength: 1
    },
    transition: {
      duration: 0.5,
      delay: 0.2
    }
  }))), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 overflow-hidden pointer-events-none"
  }, [...Array(5)].map((_, i) => /*#__PURE__*/React.createElement(motion.div, {
    key: i,
    className: "absolute w-2 h-2 rounded-full bg-white/20",
    style: {
      left: `${20 + i * 25}%`,
      bottom: '10%'
    },
    animate: {
      y: [-20, -80 - i * 20],
      opacity: [0.6, 0],
      scale: [0.5, 1.2]
    },
    transition: {
      duration: 3 + i * 0.5,
      repeat: Infinity,
      delay: i * 0.8
    }
  }))));
};