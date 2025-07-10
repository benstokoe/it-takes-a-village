# AGENTS.md - React Native Expo Project with Supabase

## Build/Lint/Test Commands

- `npm run lint` - Run ESLint and Prettier checks
- `npm run format` - Auto-fix ESLint issues and format with Prettier
- `npm start` - Start Expo dev server with dev client
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- No test framework configured - check with user before adding tests

## Code Style Guidelines

- **Imports**: Use `@/` path alias for internal imports, external imports first, React imports use named imports
- **Formatting**: Prettier config: 100 char width, 2 spaces, single quotes, trailing commas (ES5)
- **Types**: Strict TypeScript enabled, use explicit types for function parameters and return values
- **Naming**: PascalCase for components, camelCase for functions/variables, kebab-case for files
- **Components**: Use functional components with hooks, export named functions and types
- **UI**: NativeWind/Tailwind for styling, use class-variance-authority for component variants
- **Error Handling**: Use console.error for errors, early returns for error conditions
- **State**: Use React hooks (useState, useEffect), Context for global state (see AuthProvider pattern)
- **Architecture**: Expo Router file-based routing, utils/ for hooks/services, components/ui for reusable UI

## Project Stack

React Native 0.79, Expo 53, TypeScript, Supabase, NativeWind, Expo Router, React Hook Form + Zod
