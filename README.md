# Booking System

A calendar-based booking application for event scheduling. The system supports two roles: calendar owner and guests.

## Overview

**Calendar Owner** can:
- Create event types (e.g., "Знакомство" — 15 min, "Консультация" — 30 min)
- View upcoming bookings across all event types
- Configure availability: days of the week and time ranges (e.g., 9:00–12:00, 14:00–19:00)
- Filter bookings by event type, date range, and status

**Guests** can:
- Browse available event types with name, description, and duration
- View a calendar with available (gray), booked (red), and personal (green) slots
- Book a free slot by providing name, email, and optional comment (max 500 chars)
- Navigate the calendar up to 4 weeks ahead (day or week view)

## Key Rules

- **No overlap**: Two bookings cannot occupy the same time slot, even for different event types
- **Buffer time**: After a 30-minute booking, subsequent free slots shift forward by +10 minutes
- **No registration**: Guests book without creating an account; personal slot highlighting is managed via cookies on the frontend
- **Slot generation**: Slots are generated as a 30-minute grid within configured availability periods, spanning 4 weeks ahead

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Mantine UI, React Router
- **Backend**: Python, FastAPI, Pydantic, Poetry
- **API Contract**: TypeSpec (`api/main.tsp`)

## Getting Started

### Frontend

```bash
npm install
npm run dev          # Start development server (with real backend on port 8000)
npm run dev:mock     # Start with Prism mock API (port 4010, read-only)
npm run build        # Build for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

### Backend

```bash
cd backend
poetry install
poetry run uvicorn app.main:app --reload
```

### Using Makefile

```bash
make stop            # Stop all services (vite, prism, uvicorn)
make restart         # Stop all and start with real backend
make mock-api        # Start Prism mock server only
```

## API

The API contract is defined in `api/main.tsp` using TypeSpec.

### Workflow

1. Edit `api/main.tsp` (TypeSpec)
2. Run `npm run compile:api` to generate OpenAPI spec
3. Run `npm run generate:types` to generate TypeScript types in `src/api/generated.ts`

### Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/event-types` | Create an event type (15 or 30 min only) |
| GET | `/api/event-types` | List all event types |
| GET | `/api/slots` | List available and booked slots |
| POST | `/api/bookings` | Create a booking (sets `guest_email` cookie) |
| GET | `/api/bookings` | List bookings with filters (`eventTypeId`, `start`, `end`, `guestEmail`, `status`) |
| POST | `/api/availability` | Create an availability period |
| GET | `/api/availability` | List availability periods |
| DELETE | `/api/availability/{id}` | Delete an availability period |

### Guest Identification

On successful booking, the server sets a `guest_email` cookie. The frontend uses this to highlight "my bookings" in green by comparing `slot.guestEmail` with the cookie value.

## Project Structure

```
src/
├── api/          # API client and types
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks
├── pages/        # Page components (route components)
└── utils/        # Utility functions

backend/
└── app/
    ├── main.py       # FastAPI application entry point
    ├── models.py     # Pydantic models
    └── routers/      # API route handlers
```