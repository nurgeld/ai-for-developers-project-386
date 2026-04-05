# Agent Guidelines for React/TypeScript/Vite Codebase

## Engineering Principles

- **Fix the cause, not the symptom.** Investigate root causes before applying workarounds.
- **Don't modify code you didn't change.** Revert unexpected modifications.
- **Extend existing models first.** Update existing types before adding parallel entities.
- **YAGNI & DRY.** Don't over-engineer; reuse existing abstractions.

---

## Build, Lint, and Test Commands

### Makefile (preferred)
```bash
make help            # Show all available commands
make dev             # Start development server
make dev-mock        # Start with Prism mock API (port 4010)
make build           # TypeScript compile + Vite build
make lint            # Run ESLint
make test            # Run tests (requires vitest setup)
make test-watch      # Run tests in watch mode
make mock-api        # Start Prism mock server
make compile-api     # Compile TypeSpec to OpenAPI
make generate-types  # Generate TS types from OpenAPI
make clean           # Remove build artifacts
make stop            # Stop all services
make restart         # Stop all and start with real backend
make restart-mock    # Stop all and start with mock API
```

### Single Test Commands
```bash
npx vitest run src/components/Button.test.tsx   # Run single test file
npx vitest run -t "should render"               # Run tests matching name
```

---

## Code Style Guidelines

### TypeScript
- Strict mode enabled; avoid `any`, prefer `unknown`
- Prefer interfaces for object shapes, types for unions
- Explicit return types for exported functions

### Import Order
```typescript
import { useState } from 'react';
import { Card } from '@mantine/core';

import { api } from '../api/client';
import { SlotGrid } from '../components/SlotGrid';

import type { Booking } from '../api/types';
```

### Formatting
- 2 spaces indentation, 100 char max line length
- Trailing commas in multiline objects/arrays
- Semicolons required; no `console.log` in production code

### Naming Conventions
- Components: PascalCase (`SlotGrid.tsx`)
- Hooks: camelCase with `use` prefix (`useBookings.ts`)
- Utilities: camelCase (`formatDate.ts`)
- Types: PascalCase (from `types.ts`, `generated.ts`)
- Constants: UPPER_SNAKE_CASE
- Tests: `*.test.tsx` alongside source files

### Exports
- Prefer named exports; default export only for root `App.tsx`

---

## React Guidelines

- Functional components with hooks
- Named function declarations: `export function Component() {}`
- Early returns for loading/error states
- Use `useCallback`/`useMemo` when needed
- Include accessibility attributes (alt, aria-label)

### Routing (TanStack Router)
- Code-based routing defined in `src/router.tsx`
- Routes: `/` (home), `/book` (catalog), `/book/$eventTypeId` (booking), `/admin` (admin)
- Type-safe navigation via `useNavigate()` and `Link`
- Router registered globally via `declare module '@tanstack/react-router'`

### State Management (TanStack Query)
- All API data fetched via `useQuery` / `useMutation` hooks in `src/hooks/`
- Query keys: `['settings']`, `['eventTypes']`, `['slots', ...]`, `['owner', 'bookings', ...]`
- Mutations invalidate related queries on success
- Local UI state (step, selectedDate, selectedSlot) managed via `useState`

### Mantine UI
- Import styles in `App.tsx` (already done)
- Use responsive props: `cols={{ base: 1, sm: 3 }}`
- Follow Mantine prop naming (`c` for color, `fw` for fontWeight)
- Forms via `@mantine/form` (`useForm` hook)
- Calendar via `@mantine/dates` DatePicker with `renderDay` for slot counters

---

## File Organization

```
src/
├── api/                    # API client, types, generated code
│   ├── client.ts                # API request functions
│   ├── types.ts                 # Re-exports from generated
│   ├── generated.ts             # OpenAPI-generated types (do not edit)
│   └── openapi.json             # OpenAPI spec (do not edit)
├── components/
│   ├── layout/
│   │   └── Header.tsx           # Navigation (Записаться | Предстоящие события)
│   ├── booking/
│   │   ├── OwnerProfile.tsx     # Avatar + owner name
│   │   ├── EventTypeCard.tsx    # Event type card (15/30 min)
│   │   ├── BookingSummary.tsx   # Left sidebar with selected date/time
│   │   ├── SlotCalendar.tsx     # DatePicker with renderDay slot counters
│   │   ├── SlotList.tsx         # Slot list for selected day
│   │   ├── BookingForm.tsx      # Guest name + email form
│   │   └── BookingSuccess.tsx   # Success screen after booking
│   └── admin/
│       ├── BookingCard.tsx      # Single booking card with cancel button
│       ├── BookingList.tsx      # List of owner bookings
│       ├── OwnerSettingsForm.tsx # Owner settings form
│       └── EventTypeManager.tsx # CRUD for event types
├── hooks/
│   ├── useOwnerSettings.ts      # useQuery: GET /api/settings
│   ├── useEventTypes.ts         # useQuery: GET /api/event-types
│   ├── useSlots.ts              # useQuery: GET /api/slots
│   ├── useCreateBooking.ts      # useMutation: POST /api/bookings
│   ├── useOwnerBookings.ts      # useQuery: GET /api/owner/bookings
│   ├── useCancelBooking.ts      # useMutation: DELETE /api/owner/bookings/:id
│   ├── useUpdateSettings.ts     # useMutation: PATCH /api/owner/settings
│   └── useOwnerEventTypes.ts    # CRUD mutations for event types
├── pages/
│   ├── HomePage.tsx             # Landing page (/)
│   ├── EventTypesPage.tsx       # Event type selection (/book)
│   ├── BookingPage.tsx          # Booking flow with 3 steps (/book/:eventTypeId)
│   └── AdminPage.tsx            # Admin with tabs: bookings + settings (/admin)
├── router.tsx                   # TanStack Router route tree
├── App.tsx                      # MantineProvider + QueryClient + RouterProvider
└── main.tsx                     # ReactDOM entry point
docs/                            # Mockups and design assets (gitignored)
```

---

## API Patterns (v2.0.0)

### Public API (`/api`)
```typescript
import { api } from '../api/client';
import type { Booking, Slot, EventType, OwnerSettings } from '../api/types';

const settings: OwnerSettings = await api.settings.get();
const eventTypes: EventType[] = await api.eventTypes.list();
const slots: Slot[] = await api.slots.list({ eventTypeId: 'abc', startDate: '2026-03-01', endDate: '2026-03-31' });
const booking = await api.bookings.create({ eventTypeId: 'abc', guestName: 'John', guestEmail: 'john@example.com', startAt: '2026-03-28T09:00:00Z' });
```

### Owner API (`/api/owner`)
```typescript
await api.owner.settings.update({ name: 'Tota', workDayStart: '09:00', workDayEnd: '18:00' });
await api.owner.eventTypes.create({ name: 'Встреча 15 минут', description: '...', durationMinutes: 15 });
await api.owner.eventTypes.update(id, { name: 'Новое название', description: 'Новое описание' });
await api.owner.eventTypes.delete(id);
await api.owner.bookings.list();                          // future only, startAt >= now, sorted ASC
await api.owner.bookings.list({ eventTypeId: 'abc' });    // filtered by type
await api.owner.bookings.cancel(id);                      // returns 204 No Content
```

### Guest Flow (Public API)
1. `GET /api/settings` — owner profile (name, avatar)
2. `GET /api/event-types` — list of event types for selection
3. `GET /api/slots?eventTypeId=&startDate=&endDate=` — slots for month (counters)
4. `GET /api/slots?eventTypeId=&startDate=&endDate=` — slots for selected day
5. `POST /api/bookings` — create booking

### Slot Grid Rules
- Slots generated with step = `EventType.durationMinutes` (15 or 30 min)
- Within `OwnerSettings.workDayStart` - `workDayEnd` (default: 09:00-18:00)
- `Slot.isBooked: true` means slot is occupied — no guest data returned in public API
- **Overlap rule**: cannot book overlapping time even with different event types → 409 Conflict

### Booking Model
- `eventTypeName` is a **snapshot** saved at booking creation time
- Survives event type deletion (orphan bookings)
- `listBookings` without filters returns only future bookings (`startAt >= now()`), sorted ASC

### Error Handling
- 409 Conflict: `SLOT_ALREADY_BOOKED` (slot occupied) or `DUPLICATE_DURATION` (event type)
- 400 Bad Request: `INVALID_SLOT_TIME` (not aligned to grid or outside work hours)
- 404 Not Found: resource doesn't exist
- Use try/catch; show user-friendly messages via Mantine `Text` with `c="red"`

---

## Project-Specific Notes

- **TypeSpec API**: Edit `api/main.tsp`, then run `npm run compile:api`
- **Type Generation**: Run `npm run generate:types` to update `src/api/generated.ts`
- **Backend**: Python/FastAPI on port 8000 (in-memory storage)
- **Mock API**: Prism serves mock responses on port 4010 using `src/api/openapi.json`
- **Seed data**: On startup, creates "Встреча 15 минут" (15min) and "Встреча 30 минут" (30min)
- **OwnerSettings defaults**: workDayStart="09:00", workDayEnd="18:00"
- **No authorization**: single pre-defined owner profile, no login/registration
- **docs/**: Contains mockups and user flow video (gitignored, large binary files)

---

## Git Practices

- Conventional Commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`
- Branch naming: `feature/`, `fix/`, `docs/`, `refactor/`

---

## Configuration

- **ESLint**: `eslint.config.js` - TypeScript-aware with React hooks rules
- **TypeScript**: `tsconfig.app.json` - Strict mode enabled
- **Vite**: `vite.config.ts` - React plugin with API proxy to backend
- **API Proxy**: `/api` → `http://localhost:8000` (or `4010` in mock mode)
