# Vizier Frontend Complete Documentation v6

This document is a complete, detailed walkthrough of the Vizier frontend codebase as it exists in this repository. It covers architecture, flows, modules, configuration, assets, and known implementation details. It is written for developers onboarding to the project.

## 1. Project Summary

Vizier is a React + TypeScript frontend for a healthcare analytics platform. The UI centers on conversational analytics (Ask Vizier), a data upload pipeline, and a dashboard of pinned insights. The app supports a full demo mode with sample data for evaluation without signup.

Key user experiences:
- Public chat-first landing that simulates a conversation and captures email.
- Demo mode entry that seeds sample data and allows full app exploration.
- Auth flows for signup, login, password reset.
- Data upload pipeline with progress, processing states, and onboarding guidance.
- Conversational insights with charts, export to CSV, and dashboard pinning.
- Dashboard with dense and flexible layouts, drill-down, alerts, and feedback.

## 2. Tech Stack and Dependencies

Runtime dependencies (from `package.json`):
- React 18.2
- React Router DOM 6.20
- TypeScript 5.3
- Vite 5
- Tailwind CSS 3.3
- Framer Motion 10
- Recharts 2.15
- React Hook Form 7.48 + Zod 3.22
- Axios 1.6
- Lucide React 0.294

Dev dependencies:
- Vitest 1.0
- Testing Library (React + Jest DOM)
- ESLint + TypeScript ESLint plugins
- Tailwind/PostCSS/Autoprefixer

Note: There is no local ESLint config file in this repo (`.eslintrc*` not found). `npm run lint` may fail or run with defaults depending on global config.

## 3. Getting Started

Prereqs:
- Node.js 18+
- npm (or yarn)

Setup:
```bash
npm install
npm run dev
```

Default dev server:
- http://localhost:3000

## 4. Environment Configuration

The app expects Vite-style environment variables. See `./.env.example`:
- `VITE_API_URL`: Base URL for backend API (default used in code is `http://localhost:8000`).
- `VITE_ENV`: Environment string (development, staging, production).

Create a local file:
```
.env.local
VITE_API_URL=http://localhost:8000
VITE_ENV=development
```

## 5. Build and Tooling

Vite (`vite.config.ts`):
- React plugin enabled.
- Alias `@` -> `./src`.
- Dev server on port 3000.
- Proxy for `/api` to `http://localhost:8000` with path rewrite.
  - Note: Most services use a full base URL in Axios. The proxy is only used if `VITE_API_URL` is set to a relative path or if requests are made to `/api` without a base URL.

TypeScript (`tsconfig.json`, `tsconfig.node.json`):
- Strict mode enabled.
- Target ES2020.
- `moduleResolution: bundler`.
- Path alias for `@/*` to `src/*`.
- `tsconfig.node.json` is used for Vite config type checking.

Tailwind (`tailwind.config.js`):
- Custom color palette for healthcare-themed UI.
- Font family default: Inter.
- Custom shadows, animations, and keyframes.

PostCSS (`postcss.config.js`):
- Tailwind CSS + Autoprefixer.

## 6. App Entry and Routing

Entry points:
- `index.html`: Loads Inter from Google Fonts, includes `<div id="root">`.
- `src/main.tsx`: Renders `<App />`, applies global CSS.
- `src/App.tsx`: Defines providers and routes.

Providers used in `App.tsx`:
- `AuthProvider`
- `ToastProvider`
- `BrowserRouter`

Routes (from `src/App.tsx`):
- `/` -> `ChatLanding` (public). If authenticated, redirected to `/dashboard`.
- `/login` -> redirect to `/` (legacy entry for old routes).
- `/signup` -> redirect to `/`.
- `/forgot-password` -> `ForgotPassword` (public).
- `/reset-password` -> `ResetPassword` (public, requires `token` query param).
- Protected routes (wrapped in `AppLayout`):
  - `/dashboard` -> `Dashboard`
  - `/upload` -> `Upload`
  - `/insights` -> `Insights`
  - `/profile` -> `Profile`
  - `/settings` -> `Settings`
- `*` -> `NotFound`

Route guards:
- `ProtectedRoute`: checks `isAuthenticated` from `AuthContext`.
- `PublicRoute`: redirects authenticated users to `/dashboard`.

## 7. Contexts and Global State

### 7.1 AuthContext (`src/contexts/AuthContext.tsx`)
Handles:
- User state and loading state.
- Login, signup, logout, demo login.
- Refreshing user data.

Storage:
- `user` (JSON)
- `access_token`
- `is_demo` (demo flag)
- `demo_data_loaded` (demo data status)

Demo login:
- Uses a mock user and stores in `localStorage`.

### 7.2 ToastContext (`src/contexts/ToastContext.tsx`)
In-app toasts using Framer Motion.
Exports `showToast` and `hideToast`.

### 7.3 ThemeContext (`src/contexts/ThemeContext.tsx`)
Supports `light`, `dark`, `system`.
Writes to `localStorage` key `vizier_theme`.
Note: ThemeProvider is defined but not wired into `App.tsx`.

### 7.4 VizierContext (`src/contexts/VizierContext.tsx`)
Manages chat messages and suggestions for a conversational experience.
Uses `vannaService` and demo data from `mockData`.
Note: VizierProvider is defined but not used in `App.tsx`.

## 8. Local and Session Storage Keys

LocalStorage keys used:
- `access_token`: auth token.
- `user`: serialized `User`.
- `is_demo`: demo mode flag (used in AuthContext and vannaService).
- `demo_data_loaded`: demo upload flag.
- `dashboard_density`: dashboard layout density.
- `pinned_charts`: demo pinned charts cache.
- `saved_insights`: saved insights (Insights page and `savedInsightsManager`).
- `vizier_has_data`: used by Dashboard to detect data (not set in code).
- `pipeline_start_<uploadRunId>`: mock pipeline status state.
- `vizier_feedback`: AdviseModal feedback list.
- `vizier_alerts`: AlertModal alert list.
- `annotations_<chart.id>`: dashboard card annotations.
- `annotations_<insight.id>`: insight card annotations.
- `onboarding_first_question_asked`: FirstInsightPrompt state.
- `onboarding_welcome_shown`: DemoWelcomeModal state.
- `onboarding_tour_completed`: ProductTour state.
- `user_preferences`: preferences in `user.service`.
- `vizier_theme`: theme selection in ThemeContext.
- `demo_mode`: alternate demo flag used in `user.service` and constants.

SessionStorage keys used:
- `demo_interactions`: tracks demo interactions for UpgradePrompt.
- `upgrade_prompt_shown`: UpgradePrompt dismissal flag.

Note: Demo mode flag uses both `is_demo` and `demo_mode` in different modules. Align these keys if you unify demo state.

## 9. API Layer

### 9.1 API client (`src/services/api.ts`)
- Axios instance with base URL `VITE_API_URL` (default `http://localhost:8000`).
- Adds `Authorization: Bearer <token>` if token exists.
- On 401, clears `access_token` and `user` and redirects to `/login`.
- `getErrorMessage` maps API errors to user-friendly strings.

### 9.2 Auth service (`src/services/auth.service.ts`)
Endpoints:
- `POST /auth/signup`
- `POST /auth/login` (stores token + user)
- `POST /auth/logout`
- `GET /users/me`
- `POST /auth/change-password`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

### 9.3 User service (`src/services/user.service.ts`)
Endpoints (note the `/api` prefix):
- `GET /api/users/me`
- `PATCH /api/users/me`
- `POST /api/users/change-password`
- `POST /api/users/forgot-password`
- `POST /api/users/reset-password`
- `GET /api/users/preferences`
- `PATCH /api/users/preferences`
- `GET /api/users/export` (returns Blob)
- `POST /api/users/delete-account`
- `POST /api/users/avatar` (multipart)
- `DELETE /api/users/avatar`

Demo mode in this service is based on `demo_mode` localStorage key.

### 9.4 Pipeline service (`src/services/pipeline.service.ts`)
Endpoints:
- `POST /pipeline/upload_and_trigger`
- `GET /pipeline/status/:id`

If status endpoint fails, a mock status is generated and progress is simulated.

### 9.5 Vanna service (`src/services/vanna.service.ts`)
Endpoints:
- `POST /vanna/ask`
- `GET /vanna/suggestions`

Demo mode returns mock responses from `mockData.ts`.

### 9.6 Charts service (`src/services/charts.service.ts`)
Endpoints:
- `GET /charts/`
- `POST /charts/`
- `DELETE /charts/:id`

Demo mode stores charts in `localStorage` under `pinned_charts`.

## 10. Core Feature Flows

### 10.1 Chat-first landing (`ChatLanding`)
Path: `/`
- Starts with a scripted Vizier message.
- Displays goal cards (outcomes, operations, revenue) to seed a conversation.
- Simulates Vizier responses and shows inline signup.
- Demo entry uses `loginWithDemo` and redirects to `/upload`.

### 10.2 Upload flow (`Upload`)
Path: `/upload` (protected)
- File selection with `FileDropZone` and `FileList`.
- Demo mode: simulates progress and steps, then redirects to `/insights`.
- Real mode: calls `pipelineService.uploadAndTrigger` and polls status.

### 10.3 Insights flow (`Insights`)
Path: `/insights` (protected)
- Uses `vannaService.ask` to get responses.
- Applies `recommendChartType` if server returns `table` or no chart type.
- Displays results via `InsightMessage` with chart type selector and pin/export actions.
- Saves insights to `localStorage` under `saved_insights` for dashboard use.

### 10.4 Dashboard flow (`Dashboard`)
Path: `/dashboard` (protected)
- Loads pinned charts from `chartsService`.
- Supports grid/list layout and density modes (comfortable, compact, dense).
- Displays summary metrics via `StatsOverview`.
- Allows drill-down via `DrillDownModal`.
- Quick actions for Upload, Ask Vizier, Alerts, and Feedback.

### 10.5 Auth flow
Pages:
- `Login`, `Signup`: use `AuthLayout` and form components.
- `ForgotPassword`, `ResetPassword`: standalone pages using common UI components.

### 10.6 Demo onboarding
Components:
- `DemoWelcomeModal`: shown on first demo visit.
- `ProductTour`: spotlight tour across dashboard elements.
- `FirstInsightPrompt`: suggested first question in Insights.
- `UpgradePrompt`: shown after several demo interactions.

## 11. Charting and Visualization

Primary charting uses Recharts. Chart types are defined in:
- `src/types/api.types.ts` (API ChartType)
- `src/utils/chartRecommendation.ts` (local ChartType)

Chart renderers:
- `src/components/conversation/ChartRenderer.tsx` (core renderer)
- `src/components/insights/ChartRenderer.tsx` (re-export for backward compatibility)

Supported chart types:
- `bar_chart`
- `horizontal_bar_chart`
- `line_chart`
- `pie_chart`
- `donut_chart`
- `big_number`
- `table`

Helper utilities:
- `src/utils/chartHelpers.ts` for colors, axes, formatting, CSV export.
- `src/utils/chartRecommendation.ts` for heuristic chart selection.

## 12. Styling System

Global styles:
- `src/index.css`: Tailwind base + typography defaults, focus ring, custom scrollbar, glass class.
- `src/styles/chat.css`: animation keyframes for chat UI.

Tailwind custom tokens:
- Primary, success, warning, error, neutral color scales.
- Font: Inter.
- Shadows and animation keyframes.

Fonts:
- Inter loaded in `index.html`.

## 13. Assets

Public assets:
- `public/vizier-icon.svg`, `public/vizier-logo.svg`, `public/vizier-avatar.svg`
- `public/images/vizier-avatar.png`
- `public/images/test` (tiny placeholder file)

Used in UI:
- The avatar image is used across chat, insights, and quick actions.

## 14. Module Catalog (File-by-File)

This catalog enumerates every file in this repo with a short purpose statement.

### Root
- `.env.example`: Example env vars (`VITE_API_URL`, `VITE_ENV`).
- `.gitignore`: Standard ignore rules for Node + Vite.
- `index.html`: App shell and font preloads.
- `package.json`: Scripts and dependencies.
- `package-lock.json`: npm lockfile.
- `postcss.config.js`: PostCSS plugin list.
- `README.md`: Project overview and basic setup.
- `tailwind.config.js`: Tailwind theme customization.
- `tsconfig.json`: TypeScript compiler settings for app source.
- `tsconfig.node.json`: TypeScript settings for Vite config.
- `vite.config.ts`: Vite config, aliasing, dev server config.

### Public
- `public/vizier-avatar.svg`: SVG avatar icon.
- `public/vizier-icon.svg`: App favicon.
- `public/vizier-logo.svg`: Logo mark.
- `public/images/vizier-avatar.png`: Primary avatar image for UI.
- `public/images/test`: Placeholder file.

### Source root
- `src/main.tsx`: React entrypoint, renders `<App />`.
- `src/App.tsx`: Routing and top-level providers.
- `src/index.css`: Global styles and Tailwind layers.
- `src/styles/chat.css`: Chat animations (`slide-up`, `fade-in`).
- `src/vite-env.d.ts`: Vite env types.

### Contexts (`src/contexts`)
- `src/contexts/AuthContext.tsx`: Authentication state, demo login, logout.
- `src/contexts/ToastContext.tsx`: Toast state and UI integration.
- `src/contexts/ThemeContext.tsx`: Theme switching logic.
- `src/contexts/VizierContext.tsx`: Conversational state, suggestions, demo greeting.
- `src/contexts/index.ts`: Re-exports of all contexts.

### Hooks (`src/hooks`)
- `src/hooks/useAuth.ts`: Convenience re-export of `useAuth`.
- `src/hooks/useToast.ts`: Convenience re-export of `useToast`.
- `src/hooks/useLocalStorage.ts`: Generic localStorage state hook.
- `src/hooks/useDebounce.ts`: Debounce hooks for values and callbacks.
- `src/hooks/index.ts`: Aggregated exports.

### Data (`src/data`)
- `src/data/mockData.ts`: Demo dataset, mock Q&A responses, demo insights, suggestion lists.

### Services (`src/services`)
- `src/services/api.ts`: Axios client with interceptors + error mapper.
- `src/services/auth.service.ts`: Auth API calls and token storage.
- `src/services/user.service.ts`: User profile, preferences, and avatar APIs.
- `src/services/pipeline.service.ts`: Upload and pipeline status calls with mock fallback.
- `src/services/vanna.service.ts`: Q&A service with demo fallback.
- `src/services/charts.service.ts`: Pinned chart APIs with demo fallback.
- `src/services/index.ts`: Service exports and shared types.

### Types (`src/types`)
- `src/types/api.types.ts`: API response shapes (VannaResponse, PipelineStatus, etc).
- `src/types/auth.types.ts`: Auth-related types (User, LoginData, SignupData).
- `src/types/insights.types.ts`: Dashboard and insight models.
- `src/types/pipeline.types.ts`: Upload pipeline, step definitions, and file types.
- `src/types/user.types.ts`: User roles, orgs, sessions, notifications.
- `src/types/index.ts`: Aggregated type exports.

### Utilities (`src/utils`)
- `src/utils/constants.ts`: App constants, chart colors, error/success messages.
- `src/utils/formatters.ts`: Number, currency, date, and text helpers.
- `src/utils/validators.ts`: Zod schemas for forms.
- `src/utils/chartHelpers.ts`: Chart color, axis, formatting, and export helpers.
- `src/utils/chartRecommendation.ts`: Heuristic chart recommendations.
- `src/utils/savedInsights.ts`: localStorage manager for saved insights.
- `src/utils/index.ts`: Aggregated exports.

### Pages (`src/pages`)
- `src/pages/ChatLanding.tsx`: Public chat-first landing with inline auth and demo entry.
- `src/pages/Dashboard.tsx`: Pinned insights, dashboard controls, drill-down flow.
- `src/pages/Insights.tsx`: Conversational insights view with chart selection and export.
- `src/pages/Upload.tsx`: File upload and processing flow.
- `src/pages/Profile.tsx`: Profile summary and password change UI.
- `src/pages/Settings.tsx`: Settings tab interface with sections.
- `src/pages/Login.tsx`: Login page (legacy route).
- `src/pages/Signup.tsx`: Signup page (legacy route).
- `src/pages/ForgotPassword.tsx`: Password recovery flow.
- `src/pages/ResetPassword.tsx`: Password reset flow.
- `src/pages/NotFound.tsx`: 404 page.
- `src/pages/index.ts`: Page exports.

### Components: Auth (`src/components/auth`)
- `src/components/auth/AuthLayout.tsx`: Two-column auth layout with intro.
- `src/components/auth/AuthModal.tsx`: Inline modal for signup/login (demo upgrade).
- `src/components/auth/DemoCard.tsx`: Demo entry card on auth pages.
- `src/components/auth/ForgotPasswordForm.tsx`: Form-only password reset request.
- `src/components/auth/LoginForm.tsx`: Login form using RHF + zod.
- `src/components/auth/PasswordChangeForm.tsx`: Password change form.
- `src/components/auth/ResetPasswordForm.tsx`: Password reset form.
- `src/components/auth/SignupForm.tsx`: Signup form with role selection.
- `src/components/auth/VizierIntroduction.tsx`: Left-side marketing panel.
- `src/components/auth/index.ts`: Auth exports.

### Components: Common UI (`src/components/common`)
- `src/components/common/Avatar.tsx`: User avatar with initials fallback.
- `src/components/common/Badge.tsx`: Colored badge component.
- `src/components/common/Button.tsx`: Primary button with variants and loading state.
- `src/components/common/Card.tsx`: Card layout with variants.
- `src/components/common/ErrorMessage.tsx`: Dismissible error banner.
- `src/components/common/Input.tsx`: Input with label, icon, password toggle.
- `src/components/common/LoadingSpinner.tsx`: Spinner and dot loader.
- `src/components/common/Modal.tsx`: Modal with backdrop and animation.
- `src/components/common/Select.tsx`: Styled select field.
- `src/components/common/Toast.tsx`: Toast UI (standalone and container).
- `src/components/common/index.ts`: Common exports.

### Components: Layout (`src/components/layout`)
- `src/components/layout/AppLayout.tsx`: Main authenticated layout with sidebar and demo banner.
- `src/components/layout/Sidebar.tsx`: Navigation with collapse state.
- `src/components/layout/TopBar.tsx`: Top bar with title and avatar (currently unused).
- `src/components/layout/MobileNav.tsx`: Bottom nav for mobile (currently unused).
- `src/components/layout/DemoModeBanner.tsx`: Demo banner (unused; separate from AppLayout banner).
- `src/components/layout/index.ts`: Layout exports.

### Components: Chat Landing (`src/components/chat`)
- `src/components/chat/MessageBubble.tsx`: Chat bubble for landing page.
- `src/components/chat/TypingIndicator.tsx`: Landing typing indicator.
- `src/components/chat/GoalCard.tsx`: Goal selection cards.
- `src/components/chat/InlineAuth.tsx`: Inline signup form.
- `src/components/chat/TrustBadges.tsx`: Security badges for landing page.
- `src/components/chat/index.ts`: Chat exports.

### Components: Conversation (`src/components/conversation`)
- `src/components/conversation/ChatInterface.tsx`: Alternate chat layout with ResultsDisplay.
- `src/components/conversation/QueryInput.tsx`: Chat input with avatar.
- `src/components/conversation/ResultsDisplay.tsx`: Chart + SQL + export actions.
- `src/components/conversation/ChartRenderer.tsx`: Recharts chart renderer.
- `src/components/conversation/VizierAvatar.tsx`: Animated avatar component.
- `src/components/conversation/index.ts`: Conversation exports.

### Components: Insights (`src/components/insights`)
- `src/components/insights/ConversationView.tsx`: Simple list of InsightMessage entries.
- `src/components/insights/ConversationContainer.tsx`: Alternative chat container with suggestions.
- `src/components/insights/ChartTypeSelector.tsx`: Chart type toggle row.
- `src/components/insights/ChartRenderer.tsx`: Re-export of conversation ChartRenderer.
- `src/components/insights/QueryInput.tsx`: Insights page text input.
- `src/components/insights/MessageBubble.tsx`: Alternative message bubble with charts and SQL.
- `src/components/insights/InsightMessage.tsx`: Main insights message card with pin/export.
- `src/components/insights/SuggestionChips.tsx`: Suggestion buttons for insights.
- `src/components/insights/TypingIndicator.tsx`: Thinking indicator for insights.
- `src/components/insights/index.ts`: Insights exports.

### Components: Dashboard (`src/components/dashboard`)
- `src/components/dashboard/AdviseModal.tsx`: Feedback modal (saves to localStorage).
- `src/components/dashboard/AlertModal.tsx`: Alert configuration modal (localStorage).
- `src/components/dashboard/DashboardCard.tsx`: Pinned chart card with notes and drill-down.
- `src/components/dashboard/DashboardGrid.tsx`: Grid layout helper.
- `src/components/dashboard/StatsOverview.tsx`: Summary metrics cards.
- `src/components/dashboard/StatCard.tsx`: Generic stat card.
- `src/components/dashboard/SavedInsightCard.tsx`: Legacy saved insight card.
- `src/components/dashboard/QuickActions.tsx`: Quick actions tiles.
- `src/components/dashboard/InsightsGrid.tsx`: Grid for saved insights (legacy).
- `src/components/dashboard/InsightCard.tsx`: Insight card with annotations (legacy).
- `src/components/dashboard/EmptyDashboard.tsx`: Empty state UX.
- `src/components/dashboard/DrillDownModal.tsx`: Drill-down report with synthetic data.
- `src/components/dashboard/DashboardLayout.tsx`: Simple vertical layout wrapper.
- `src/components/dashboard/index.ts`: Dashboard exports.

### Components: Onboarding (`src/components/onboarding`)
- `src/components/onboarding/UploadGuidanceCard.tsx`: Upload help card with template download.
- `src/components/onboarding/UpgradePrompt.tsx`: Demo upgrade CTA.
- `src/components/onboarding/ProductTour.tsx`: Guided tour overlay.
- `src/components/onboarding/FirstInsightPrompt.tsx`: Demo first-question prompt.
- `src/components/onboarding/DemoWelcomeModal.tsx`: Demo welcome modal.
- `src/components/onboarding/index.ts`: Onboarding exports.

### Components: Upload (`src/components/upload`)
- `src/components/upload/FileDropZone.tsx`: Drag and drop uploader.
- `src/components/upload/FileList.tsx`: Selected file list.
- `src/components/upload/UploadProgress.tsx`: Upload progress UI (unused in Upload page).
- `src/components/upload/ProcessingStatus.tsx`: Polling-based processing UI (unused).
- `src/components/upload/ProcessingAnimation.tsx`: Fullscreen processing animation (used).
- `src/components/upload/UploadComplete.tsx`: Completion screen.
- `src/components/upload/index.ts`: Upload exports.

### Components: Settings (`src/components/settings`)
- `src/components/settings/OrganizationSettings.tsx`: Organization form.
- `src/components/settings/IntegrationSettings.tsx`: Integrations and API key UI.
- `src/components/settings/SecuritySettings.tsx`: Security settings and sessions UI.
- `src/components/settings/BillingSection.tsx`: Billing plan and invoices UI.
- `src/components/settings/index.ts`: Settings exports.

### Components: Profile (`src/components/profile`)
- `src/components/profile/ProfileHeader.tsx`: Profile header with avatar and role.
- `src/components/profile/ProfileForm.tsx`: Profile edit form.
- `src/components/profile/PasswordSection.tsx`: Password change or demo lockout.
- `src/components/profile/DataManagement.tsx`: Export and delete-account controls.
- `src/components/profile/index.ts`: Profile exports.

## 15. Known Implementation Notes

These are important details observed in the codebase:
- Demo mode flag keys are inconsistent (`is_demo` vs `demo_mode`).
- Vite proxy is configured, but Axios base URL uses full host by default.
- Some UI copy strings contain encoding artifacts like "ƒ?" or "ƒ?½" (check copy in `ChatLanding`, `DemoCard`, `UpgradePrompt`, `ProductTour`, etc).
- `ThemeProvider`, `VizierProvider`, `TopBar`, `MobileNav`, and some upload components exist but are not currently wired into routes.
- `saved_insights` and `pinned_charts` represent different storage concepts and formats.

## 16. Quick Mental Model

If you are new to this project:
1. `src/App.tsx` defines the route map.
2. `AuthContext` drives login state and demo mode.
3. `Insights` page is the core "Ask Vizier" experience, relying on `vannaService`.
4. `Dashboard` is powered by `chartsService` and uses `DashboardCard` to render pinned charts.
5. `Upload` feeds data into the pipeline (or simulates it in demo mode).

This document is version 6 and reflects the repository state at the time it was generated.
