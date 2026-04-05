import type { components } from './generated';

export type OwnerSettings = components['schemas']['OwnerSettings'];
export type EventType = components['schemas']['EventType'];
export type Slot = components['schemas']['Slot'];
export type Booking = components['schemas']['Booking'];
export type CreateBookingRequest = components['schemas']['CreateBookingRequest'];
export type CreateEventTypeRequest = components['schemas']['CreateEventTypeRequest'];
export type UpdateEventTypeRequest = components['schemas']['UpdateEventTypeRequest'];
export type UpdateOwnerSettingsRequest = components['schemas']['UpdateOwnerSettingsRequest'];
export type ConflictError = components['schemas']['ConflictError'];
export type InvalidSlotTimeError = components['schemas']['InvalidSlotTimeError'];
export type NotFoundError = components['schemas']['NotFoundError'];
export type ValidationError = components['schemas']['ValidationError'];
export type DuplicateDurationError = components['schemas']['DuplicateDurationError'];

export type ApiError =
  | ConflictError
  | InvalidSlotTimeError
  | NotFoundError
  | ValidationError
  | DuplicateDurationError;
