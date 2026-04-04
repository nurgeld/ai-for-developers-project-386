import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";

using TypeSpec.Http;
using TypeSpec.Rest;

// ==================== Scalars ====================

/**
 * Day of week: 0 = Monday, 1 = Tuesday, ..., 6 = Sunday
 */
scalar DayOfWeek extends int32;

// ==================== Models ====================

model EventType {
  id: string;
  title: string;
  description: string;
  /** Duration in minutes (e.g., 15 for "Знакомство", 30 for "Консультация") */
  durationMinutes: int32;
}

/**
 * A time slot in the calendar.
 * Slots are generated as a fixed 30-minute grid within availability periods.
 * Free slots have eventTypeId = null.
 */
model Slot {
  id: string;
  /** null for free slots; set to eventTypeId when booked */
  eventTypeId?: string;
  startAt: utcDateTime;
  endAt: utcDateTime;
}

model Booking {
  id: string;
  eventTypeId: string;
  startAt: utcDateTime;
  endAt: utcDateTime;
  guestName: string;
  guestEmail: string;
  /** Free-text comment from guest, max 500 characters */
  comment?: string;
  createdAt: utcDateTime;
}

/**
 * Global availability period — applies to all event types.
 * Defines which days of the week and time ranges are available for booking.
 */
model AvailabilityPeriod {
  id: string;
  /** Day of week (0 = Monday, 6 = Sunday) */
  dayOfWeek: DayOfWeek;
  @format("time")
  startTime: string;
  @format("time")
  endTime: string;
}

// ==================== Request Models ====================

model CreateEventTypeRequest {
  title: string;
  description: string;
  /** Duration in minutes (e.g., 15, 30) */
  durationMinutes: int32;
}

model CreateBookingRequest {
  eventTypeId: string;
  startAt: utcDateTime;
  guestName: string;
  guestEmail: string;
  /** Free-text comment from guest, max 500 characters */
  comment?: string;
}

model CreateAvailabilityRequest {
  /** Day of week (0 = Monday, 6 = Sunday) */
  dayOfWeek: DayOfWeek;
  @format("time")
  startTime: string;
  @format("time")
  endTime: string;
}

// ==================== API ====================

@route("/event-types")
@tag("Event Types")
interface EventTypes {
  @post create(@body body: CreateEventTypeRequest): EventType;
  @get list(): EventType[];
}

@route("/slots")
@tag("Slots")
interface Slots {
  /**
   * List available and booked slots.
   *
   * Slots are generated as a fixed 30-minute grid within configured availability
   * periods, spanning 4 weeks ahead from the current date. When the last day
   * approaches, the system automatically generates slots for the next 4 weeks.
   *
   * Free slots have eventTypeId = null. Booked slots have eventTypeId set.
   */
  @get list(
    @query eventTypeId?: string,
    @query start?: utcDateTime,
    @query end?: utcDateTime
  ): Slot[];
}

@route("/bookings")
@tag("Bookings")
interface Bookings {
  /**
   * Create a booking.
   *
   * **Overlap Rule**: Returns `409 Conflict` if the requested time slot
   * overlaps with an existing booking.
   *
   * **Slot Shift Rule**: If the booked event type has duration of 30 minutes,
   * all subsequent free slots are shifted forward by +10 minutes (rest time).
   * Previously booked slots are not affected. No overlap allowed.
   *
   * The `endAt` is calculated automatically based on `EventType.durationMinutes`.
   */
  @post create(@body body: CreateBookingRequest): Booking;
  @get list(
    @query eventTypeId?: string,
    @query start?: utcDateTime,
    @query end?: utcDateTime
  ): Booking[];
}

@route("/availability")
@tag("Availability")
interface Availability {
  @post create(@body body: CreateAvailabilityRequest): AvailabilityPeriod;
  @get list(): AvailabilityPeriod[];
}