# Tech Context

This document captures the technologies, tools, and constraints used in the FormCam project.

## Primary Stack
- **Framework**: Next.js (React) with Expo for native capabilities.
- **Language**: TypeScript for source code, JavaScript for scripts.
- **Styling**: Styled‑components and custom theme files in `src/styles/*`.
- **State Management**: React Context API (auth context) and local component state.

## Build & Tooling
- **Package Manager**: Yarn
- **Bundler**: Metro (React Native) and Webpack (web)
- **Transpilation**: Babel and TypeScript compiler
- **Linting/Formatting**: Biome, ESLint, Prettier
- **Testing**: (Not yet implemented) – planned with Jest/React Native Testing Library

## Dependencies
- `expo-image-picker` – camera and gallery access
- `axios` – HTTP requests in `src/services/api.ts`
- `react-navigation` – navigation within native parts
- `@expo/vector-icons` – icon library

## Constraints
- Must run on both iOS and Android devices.
- Offline capability required – data queued locally when network unavailable.
- Limited device storage – images should be compressed before upload.

## Development Environment
- macOS with Zsh shell.
- VS Code as editor.
- Node.js (>=18) and Yarn installed.
- Android Studio & Xcode for emulators.
