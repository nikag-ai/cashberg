const tailwindcssAnimate = require("tailwindcss-animate");

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "1rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                melt: {
                    DEFAULT: "hsl(var(--melt))",
                    foreground: "hsl(var(--melt-foreground))",
                },
                success: {
                    DEFAULT: "hsl(var(--success))",
                    foreground: "hsl(var(--success-foreground))",
                },
                sidebar: {
                    DEFAULT: "hsl(var(--sidebar-background))",
                    foreground: "hsl(var(--sidebar-foreground))",
                    primary: "hsl(var(--sidebar-primary))",
                    "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
                    accent: "hsl(var(--sidebar-accent))",
                    "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
                    border: "hsl(var(--sidebar-border))",
                    ring: "hsl(var(--sidebar-ring))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 4px)",
                sm: "calc(var(--radius) - 8px)",
                xl: "calc(var(--radius) + 8px)",
                "2xl": "calc(var(--radius) + 16px)",
                "3xl": "2rem",
                "4xl": "2.5rem",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "float-up": {
                    "0%": { transform: "translateY(0) scale(1)", opacity: "1" },
                    "100%": { transform: "translateY(-50px) scale(1.05)", opacity: "0" },
                },
                "float-down": {
                    "0%": { transform: "translateY(-50px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                "slide-up": {
                    "0%": { transform: "translateY(100%)" },
                    "100%": { transform: "translateY(0)" },
                },
                "slide-down": {
                    "0%": { transform: "translateY(0)" },
                    "100%": { transform: "translateY(100%)" },
                },
                "pulse-glow": {
                    "0%, 100%": { filter: "drop-shadow(0 0 40px hsla(187, 85%, 53%, 0.3))" },
                    "50%": { filter: "drop-shadow(0 0 60px hsla(187, 85%, 53%, 0.5))" },
                },
                "ripple": {
                    "0%": { transform: "scale(0.8)", opacity: "1" },
                    "100%": { transform: "scale(2)", opacity: "0" },
                },
                "bob": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "float-up": "float-up 0.5s ease-out forwards",
                "float-down": "float-down 0.5s ease-out forwards",
                "slide-up": "slide-up 0.3s ease-out",
                "slide-down": "slide-down 0.3s ease-out",
                "pulse-glow": "pulse-glow 3s ease-in-out infinite",
                "ripple": "ripple 0.6s ease-out",
                "bob": "bob 3s ease-in-out infinite",
            },
            boxShadow: {
                "glow-ice": "0 0 60px hsla(187, 85%, 53%, 0.3)",
                "glow-melt": "0 0 60px hsla(0, 84%, 60%, 0.3)",
                "glow-success": "0 0 60px hsla(142, 71%, 45%, 0.3)",
                "glass": "0 8px 32px hsla(0, 0%, 0%, 0.2)",
            },
        },
    },
    plugins: [tailwindcssAnimate],
}
