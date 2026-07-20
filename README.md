# Smart Survey 👋

**Smart Survey** is a powerful React Native Expo application designed for seamless field site surveys. It allows users to collect, manage, and export comprehensive survey data incorporating device sensors and native capabilities such as Camera capture, GPS Location tracking, Contact selection, and Clipboard integration.

---

## 🚀 Key Features

- 📋 **Survey Management**: Create, edit, and maintain site survey drafts with custom details, priorities, and dates.
- 📷 **Camera Integration**: Capture real-time site photos directly within the survey workflow.
- 📍 **GPS Location**: Fetch precise geographical coordinates (Latitude, Longitude, Accuracy) for audit verification.
- 👤 **Contact Selection**: Import site contact information directly from the device's address book.
- 📋 **Clipboard Utility**: Effortlessly copy survey summaries to clipboard for rapid sharing and reporting.
- 🎨 **Modern Design System**: Clean, dark-mode inspired UI components (Cards, Badges, Headers, Buttons).
- 🗂️ **Drawer & Tab Navigation**: Responsive navigation built on Expo Router and React Native Gesture Handler/Reanimated.

---

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) & [Expo SDK 54](https://expo.dev)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction) (File-based routing with Drawer + Tabs)
- **State Management**: React Context API (`SurveyContext`)
- **Native Modules**:
  - `expo-camera` - Photo capture
  - `expo-location` - Device GPS location
  - `expo-contacts` - Device contacts
  - `expo-clipboard` - System clipboard integration
  - `@react-native-async-storage/async-storage` - Storage support
- **UI & Styling**: Custom TypeScript components with consistent theme constants

---

## 📁 Project Structure

```text
smart-survey/
├── app/                  # Expo Router file-based screens
│   ├── (drawer)/         # Drawer navigation stack (Camera, Location, Contacts, Preview, Settings)
│   │   └── (tabs)/       # Tab navigation (Home, Survey, History, Profile)
│   ├── _layout.tsx       # Root layout provider
│   └── index.tsx         # Entry redirection
├── components/           # Reusable UI components (AppHeader, Card, PrimaryButton, etc.)
├── constants/            # Design system tokens and theme definitions
├── context/              # Survey context state management
├── utils/                # Utility helpers (Clipboard handlers)
└── package.json          # Dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Expo Go app on iOS/Android or an emulator/simulator

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Scan the QR code with **Expo Go** or press `a` for Android / `i` for iOS simulator.

