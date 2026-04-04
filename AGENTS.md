# Agent Guidelines for React/TypeScript/Vite Codebase

## Build, Lint, and Test Commands

### Development
```bash
# Start development server
npm run dev

# Preview production build
npm run preview
```

### Building
```bash
# Build for production
npm run build
```

### Linting
```bash
# Run ESLint on all files
npm run lint

# Run ESLint on specific file or directory
npx eslint src/components/Button.tsx
npx eslint src/pages/
```

### Testing
*Note: This project currently doesn't have a testing framework configured.*
To add testing capabilities, consider installing:
```bash
# For unit tests
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event

# For E2E tests
npm install -D playwright @playwright/test
```

Once testing is configured, typical commands would be:
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run a single test file
npx vitest run src/components/Button.test.tsx

# Run a single test function
npx vitest run -t "should render button with correct text"
```

## Code Style Guidelines

### TypeScript Usage
- Use strict type checking enabled in tsconfig.json
- Prefer interfaces for object shapes, types for unions/primitives
- Avoid `any` type; use `unknown` when type is uncertain and validate
- Use explicit return types for exported functions
- Use type assertions (`as Type`) sparingly and only when necessary

### Import Organization
1. External libraries (alphabetical)
2. Internal absolute imports (alphabetical)
3. Relative imports (alphabetical)
4. Types-only imports on separate lines when beneficial
5. No unused imports allowed

Example:
```typescript
// External libraries
import { useState } from 'react';
import { Button } from '@mantine/core';

// Internal absolute imports
import { apiClient } from '@/api/client';
import { useEventTypes } from '@/hooks/useEventTypes';

// Relative imports
import { ButtonVariant } from './Button.types';

// Types-only imports
import type { EventType } from '@/api/types';
```

### Formatting
- Use 2 spaces for indentation (Prettier/ESLint default)
- Maximum line length: 100 characters
- Trailing commas in multiline objects/arrays
- Semicolons required
- No console.log in production code (except for debugging)

### Naming Conventions
- Components: PascalCase (e.g., `EventTypeCard`)
- Functions/variables: camelCase (e.g., `createEventType`)
- Constants: UPPER_SNAKE_CASE (e.g., `MAX_RETRIES`)
- Files: 
  - Components: PascalCase.tsx (e.g., `EventTypeCard.tsx`)
  - Hooks: camelCase.ts (e.g., `useEventTypes.ts`)
  - Utilities: camelCase.ts (e.g., `dateUtils.ts`)
  - Types: PascalCase.ts (e.g., `EventType.types.ts`)
  - Tests: same name as file with .test suffix (e.g., `EventTypeCard.test.tsx`)

### Error Handling
- Use try/catch for async operations
- Throw specific errors rather than generic Error when possible
- Handle API errors consistently using the apiClient pattern
- Display user-friendly error messages in UI components
- Log errors to console in development only

### React Specific
- Use functional components with hooks
- Prefer `const` for component declarations
- Use early returns for conditional rendering
- Extract complex JSX into separate components
- Use useCallback/useMemo for performance optimization
- Follow React Hooks Rules strictly
- Use Fragment (`<>`) instead of unnecessary divs
- Accessibility: Always include meaningful alt text, labels, etc.

### Mantine UI Specific
- Import styles globally in App.tsx (already configured)
- Use Mantine's theme customization sparingly
- Follow Mantine's naming conventions for props
- Use Mantine's default breakpoints for responsive design
- Utilize Mantine hooks when appropriate (use-form, use-local-storage, etc.)

### API Communication
- Use the provided `apiClient` in `src/api/client.ts`
- Handle loading and error states in UI components
- Use React Query/SWR for complex data fetching (to be implemented)
- Validate API responses with TypeScript types
- Implement retry logic for failed requests when appropriate

### File Organization
```
src/
├── api/          # API client and types
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks
├── pages/        # Page components (route components)
├── styles/       # Global styles and theme customization
└── utils/        # Utility functions and helpers
```

### Git Practices
- Commit messages: Conventional Commits format
  - feat: new feature
  - fix: bug fix
  - docs: documentation changes
  - style: formatting, missing semicolons, etc.
  - refactor: code restructuring
  - perf: performance improvements
  - test: adding or modifying tests
  - chore: build process, tooling changes
- Branch naming: feature/, fix/, docs/, refactor/
- Pull requests: Descriptive title, summary of changes, related issues

### Performance Considerations
- Lazy load routes and heavy components
- Use React.memo for components with stable props
- Virtualize long lists
- Optimize images and assets
- Bundle analysis: Use `vite build --mode analyzer`

### Security Guidelines
- Sanitize user inputs to prevent XSS
- Use proper HTTP methods for API calls (GET for data retrieval, POST for creation, etc.)
- Handle authentication tokens securely
- Validate data both client-side and server-side
- Environment variables: Never commit .env files, use VITE_ prefix for client-side variables

## Additional Configuration Files

### ESLint Configuration
See `.eslintrc.js` or `eslint.config.js` for current rules
- TypeScript-aware linting enabled
- React hooks rules enforced
- Unused variables prohibited
- No console.log in production

### TypeScript Configuration
See `tsconfig.json` and related files
- Strict mode enabled
- Path aliases configured (@/ prefix)
- JSX parsing for React
- Module resolution configured for Node.js and browser

### Vite Configuration
See `vite.config.ts`
- React plugin configured
- Build optimization settings
- Preview server configuration

## Project-Specific Notes

### TypeSpec API Definition
- The API contract is defined in `api/main.tsp` using TypeSpec
- Generated TypeScript types are available in `src/api/types.ts`
- When updating the API specification, remember to regenerate types

### Backend Structure
- The Python/FastAPI backend is located in the `backend/` directory
- API routes are in `backend/app/routers/`
- Data models are in `backend/app/models.py`

### Environment Variables
- Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client
- Example: `VITE_API_URL=http://localhost:8000`