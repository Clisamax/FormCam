# System Patterns

This document records the architectural decisions, design patterns, and component relationships used throughout the FormCam project.

## Architecture Overview
- **Layered Architecture**: UI → Services → API → Persistence.
- **Modular Structure**: Features are isolated in `/src/app/(…)` directories.
- **Navigation**: Next.js app router with layout partitions.

## Design Patterns
- **Provider Pattern** – `src/context/auth.tsx` supplies authentication state.
- **Factory Pattern** – Camera upload component creates platform‑specific upload handlers.
- **Observer Pattern** – Form state listeners update UI on input changes.
- **Singleton** – API service (`src/services/api.ts`) provides a single configured instance.

## Component Relationships
- UI components import shared styles from `src/styles/*`.
- Forms assemble input components (`input`, `inputDatePicker`, `inputRadio`, etc.) to build complete screens.
- Camera upload component interacts with native device APIs via Expo/React Native bridge.

## Critical Paths
1. **Capture Image** → `src/components/cameraUpload` → store temporary file.
2. **Fill Form** → various `src/components/input*` → validate.
3. **Submit** → `src/services/api.ts` → sync with backend (offline queue if needed).
