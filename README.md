# 🧊 Cashberg

**Cashberg** is a conceptual financial visualization application that reimagines personal finance through the metaphor of an iceberg. Most of your financial life is hidden beneath the surface—Cashberg helps you dive deep, understand your depth, and keep your head above water.

## 🌊 The Concept

Traditional finance apps are spreadsheets in disguise. **Cashberg** is a "Physical UI" experience where:
- **The Surface**: Your available, liquid cash—what you see every day.
- **The Abyss**: Your true net worth, savings, and long-term assets hiding below.
- **The Stream**: The flow of transactions affecting your iceberg.
- **The Melt**: Spending money, watching your iceberg shrink.
- **The Repair**: Reconciling your accounts to freeze the water back into ice.

## ✨ Features & Critical User Journeys (CUJs)

The application is built around distinct experiential stages:

### 1. The Dive (Authentication)
*   **User Journey**: The entry point. A calm splash screen that transitions into a secure login/signup flow.
*   **Goal**: Seamless, immersive entry into the financial ocean.

### 2. The Calibration (Onboarding)
*   **User Journey**: Setting the initial mass of your iceberg. Users input their accounts, assets, and liabilities to form their personal financial glacier.
*   **Goal**: Establish the baseline for visualization.

### 3. The Surface (Dashboard)
*   **User Journey**: The daily view. Users see their "above water" metrics—what's available for immediate spending.
*   **Key Action**: Interaction with the **Melt Button** to view or log "fractures" (expenses).

### 4. The Abyss (Deep Dive)
*   **User Journey**: navigating below the water line. Users explore their full financial reality, including debts, investments, and long-term savings.
*   **Visuals**: Darker, deeper UI themes with pressure-sensitive data visualization.

### 5. The Fracture (Transaction Entry)
*   **User Journey**: Logging a new expense. A modal experience that mimics "chipping away" at your assets.
*   **Components**: Custom **Fracture Keypad** for intuitive numeric entry.

### 6. The Stream (History)
*   **User Journey**: Reviewing the history of flows (income and expenses). A chronological river of financial events.

### 7. The Repair (Reconciliation)
*   **User Journey**: Fixing discrepancies. Tools to align the digital iceberg with real-world bank balances.

## 🛠️ Tech Stack

Built with a focus on performance, aesthetics, and developer experience.

*   **Frontend**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Language**: JavaScript (ES Modules)
*   **Styling**: Vanilla CSS with Glassmorphism & custom "Physical UI" design system.
*   **Animations**: [Framer Motion](https://www.framer.com/motion/) for fluid state transitions.
*   **Backend / Serverless**: [Firebase](https://firebase.google.com/)
    *   **Authentication**: Secure user management.
    *   **Firestore**: Real-time scalable NoSQL database.
    *   **Cloud Functions**: Server-side logic for complex financial calculations.
*   **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+ recommended)
*   npm or yarn
*   Firebase CLI (`npm install -g firebase-tools`)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/nikag-ai/cashberg.git
    cd cashberg
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Firebase**:
    *   Ensure you have a Firebase project created.
    *   Login to Firebase CLI: `firebase login`
    *   Initialize/Select project if needed: `firebase use --add`

### Running Locally

To start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

To run Firebase emulators (for local backend testing):

```bash
firebase emulators:start
```

## 📂 Project Structure

```
cashberg/
├── src/
│   ├── backend/           # Firebase Functions & Tests
│   ├── connectors/        # Data providers & Custom Hooks
│   ├── ui/
│   │   ├── components/    # Reusable UI atoms (Buttons, Cards, etc.)
│   │   ├── core/          # Layouts & Global Styles
│   │   ├── pages/         # Route definitions (if using router)
│   │   └── screens/       # Full-screen functional views (TheDive, TheSurface, etc.)
│   ├── App.jsx            # Main Application Logic
│   └── main.jsx           # Entry Point
├── public/                # Static assets
└── firebase.json          # Firebase configuration
```

## 🎨 Design System

**Cashberg** utilizes a custom "Physical UI" design language:
*   **Glassmorphism**: Heavy use of semi-transparent backgrounds and blurs to create depth.
*   **Organic Motion**: Elements float, drift, and freeze.
*   **Tactile Inputs**: Sliders and custom keypads replace standard browser inputs.

---

*Note: This project is currently in active development.*
