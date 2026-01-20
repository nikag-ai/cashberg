import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassPanel } from '../cashberg/GlassPanel';
import { GlassButton } from '../cashberg/GlassButton';
import { GlassInput } from '../cashberg/GlassInput';
import { useAppStore } from '@/store/appStore';
import { toast } from 'sonner';

export const DiveScreen = () => {
  const {
    login,
    signup,
    loginWithGoogle
  } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    console.log("[DiveScreen] Starting submission. Mode:", isLogin ? "LOGIN" : "SIGNUP");

    // Timeout Promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request timed out. Please check your connection.")), 10000)
    );

    try {
      if (isLogin) {
        console.log("[DiveScreen] Attempting Login...");
        await Promise.race([login(email, password), timeoutPromise]);
        console.log("[DiveScreen] Login Successful");
      } else {
        console.log("[DiveScreen] Attempting Signup...");
        await Promise.race([signup(email, password), timeoutPromise]);
        console.log("[DiveScreen] Signup Successful");
        toast.success("Welcome aboard! Account created.");
      }
    } catch (error) {
      console.error("[DiveScreen] Error:", error);
      toast.error(error.message);
    } finally {
      console.log("[DiveScreen] Finished. Loading false.");
      setLoading(false);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 pointer-events-none overflow-hidden"
  }, [...Array(15)].map((_, i) => /*#__PURE__*/React.createElement(motion.div, {
    key: i,
    className: "absolute rounded-full bg-primary/10",
    style: {
      width: Math.random() * 100 + 20,
      height: Math.random() * 100 + 20,
      left: `${Math.random() * 100}%`,
      bottom: '-20%'
    },
    animate: {
      y: [0, -window.innerHeight * 1.3],
      opacity: [0.3, 0],
      scale: [1, 1.5]
    },
    transition: {
      duration: Math.random() * 10 + 10,
      repeat: Infinity,
      delay: Math.random() * 5
    }
  }))), /*#__PURE__*/React.createElement(motion.div, {
    className: "text-center mb-12",
    initial: {
      y: -50,
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1
    },
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  }, /*#__PURE__*/React.createElement(motion.h1, {
    className: "text-6xl md:text-7xl font-bold tracking-tight mb-4",
    style: {
      background: 'linear-gradient(135deg, #22d3ee 0%, #67e8f9 50%, #06b6d4 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      filter: 'drop-shadow(0 0 30px rgba(34, 211, 238, 0.4))'
    }
  }, "CASHBERG"), /*#__PURE__*/React.createElement(motion.p, {
    className: "text-muted-foreground text-lg",
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1
    },
    transition: {
      delay: 0.3
    }
  }, "Dive into your finances")), /*#__PURE__*/React.createElement(motion.div, {
    initial: {
      y: 50,
      opacity: 0
    },
    animate: {
      y: 0,
      opacity: 1
    },
    transition: {
      delay: 0.2,
      duration: 0.6
    },
    className: "w-full max-w-sm"
  }, /*#__PURE__*/React.createElement(GlassPanel, {
    className: "p-8"
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit,
    className: "space-y-6"
  }, /*#__PURE__*/React.createElement(GlassInput, {
    label: "Email",
    type: "email",
    placeholder: "diver@cashberg.app",
    value: email,
    onChange: e => setEmail(e.target.value)
  }), /*#__PURE__*/React.createElement(GlassInput, {
    label: "Password",
    type: "password",
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    value: password,
    onChange: e => setPassword(e.target.value)
  }), /*#__PURE__*/React.createElement(GlassButton, {
    type: "submit",
    variant: "primary",
    className: "w-full",
    disabled: loading
  }, loading ? "Processing..." : (isLogin ? "Enter Deep" : "Create Account"))), /*#__PURE__*/React.createElement("div", {
    className: "relative my-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 flex items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full border-t border-white/10"
  })), /*#__PURE__*/React.createElement("div", {
    className: "relative flex justify-center text-sm"
  }, /*#__PURE__*/React.createElement("span", {
    className: "px-4 bg-transparent text-muted-foreground"
  }, "or"))), /*#__PURE__*/React.createElement(GlassButton, {
    variant: "outline",
    className: "w-full",
    onClick: () => setIsLogin(!isLogin)
  }, isLogin ? "Create an account" : "Back to Login")), /*#__PURE__*/React.createElement(GlassButton, {
    variant: "ghost",
    className: "w-full mt-4 flex items-center justify-center gap-2",
    onClick: loginWithGoogle
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
    fill: "#4285F4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
    fill: "#34A853"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
    fill: "#FBBC05"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
    fill: "#EA4335"
  })), "Sign in with Google")), /*#__PURE__*/React.createElement(motion.p, {
    className: "absolute bottom-6 text-sm text-muted-foreground/50",
    initial: {
      opacity: 0
    },
    animate: {
      opacity: 1
    },
    transition: {
      delay: 1
    }
  }, "v1.0.0 \u2022 Glass OS"));
};