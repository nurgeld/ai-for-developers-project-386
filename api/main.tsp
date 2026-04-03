import "@typespec/http";
import "@typespec/rest";
import "@typespec/openapi3";

using TypeSpec.Http;
using TypeSpec.Rest;

// ==================== Models ====================

model EventType {
  id: string;
  title: string;
  description: string;
  /** Duration in minutes (e.g., 30, 60) */
  durationMinutes: int32;
}

model Slot {
  id: string;
  eventTypeId: string;
  startAt: utcDateTime;
  endAt: utcDateTime;
  isBooked: boolean;
}

model Booking {
  id: string;
  eventTypeId: string;
  startAt: utcDateTime;
  endAt: utcDateTime;
  guestName: string;
  guestEmail: string;
  createdAt: utcDateTime;
}

model AvailabilityPeriod {
  id: string;
  eventTypeId: string;
  /** Day of week (0 = Monday, 6 = Sunday) */
  dayOfWeek: int32;
  @format("time")
  startTime: string;
  @format("time")
  endTime: string;
}

// ==================== Request Models ====================

model CreateEventTypeRequest {
  title: string;
  description: string;
  /** Duration in minutes (e.g., 30, 60) */
  durationMinutes: int32;
}

model CreateBookingRequest {
  eventTypeId: string;
  startAt: utcDateTime;
  guestName: string;
  guestEmail: string;
}

model CreateAvailabilityRequest {
  eventTypeId: string;
  /** Day of week (0 = Monday, 6 = Sunday) */
  dayOfWeek: int32;
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
  @get list(
    @query eventTypeId: string,
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
   * **Overlap Rule**: If the requested time slot overlaps with an existing booking,
   * returns `409 Conflict`.
   * 
   * The `endAt` is calculated automatically based on `EventType.durationMinutes`.
   */
  @post create(@body body: CreateBookingRequest): Booking;
  @get list(
    @query start?: utcDateTime,
    @query end?: utcDateTime
  ): Booking[];
}

@route("/availability")
@tag("Availability")
interface Availability {
  @post create(@body body: CreateAvailabilityRequest): AvailabilityPeriod;
  @get list(@query eventTypeId: string): AvailabilityPeriod[];
}
