# Active Context

This document captures the current focus of work, recent changes, and next steps for the FormCam project.

## Current Focus
- Finalizing form components and validation logic.
- Enhancing camera upload workflow with compression.
- Implementing offline sync queue.

## Recent Changes (last few commits)
- Added `src/components/cameraUpload` with basic image picker integration.
- Created input components (`input`, `inputDatePicker`, `inputRadio`) and associated styles.
- Defined TypeScript types for form data in `src/@types/types.ts`.
- Updated navigation layout to include new form screens.

## Next Steps
1. **Validation** – Add client‑side validation for required fields and proper formats.
2. **Compression** – Integrate image compression before upload to reduce payload size.
3. **Offline Queue** – Implement a local storage queue (e.g., AsyncStorage) to store submissions when offline.
4. **API Integration** – Wire up `src/services/api.ts` to send completed forms to the backend.
5. **Testing** – Write unit tests for form logic and integration tests for the upload flow.

## Important Patterns / Preferences
- Use React Context (`src/context/auth.tsx`) for global auth state.
- Keep component styles colocated in a `styles.ts` file next to the component.
- Prefer functional components with hooks over class components.
- Follow the project's ESLint and Prettier configuration for formatting.

## Learnings / Insights
- The Expo image picker works well on both iOS and Android, but needs explicit permission handling.
- Large images can cause memory pressure; compressing to <1 MB is advisable.
- Offline sync requires careful handling of retries and conflict resolution.
