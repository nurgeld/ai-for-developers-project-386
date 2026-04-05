import type {
  EventType,
  Slot,
  Booking,
  AvailabilityPeriod,
  CreateEventTypeRequest,
  CreateBookingRequest,
  CreateAvailabilityRequest,
} from '../api/types';

const BASE = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  });

  if (response.status === 409) {
    throw new Error('Slot is already booked. Please select another time.');
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || response.statusText);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}

export class ApiClient {
  // Event Types
  async listEventTypes(): Promise<EventType[]> {
    return request<EventType[]>(`${BASE}/event-types`);
  }

  async createEventType(body: CreateEventTypeRequest): Promise<EventType> {
    return request<EventType>(`${BASE}/event-types`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // Slots
  async listSlots(params?: { eventTypeId?: string; start?: string; end?: string }): Promise<Slot[]> {
    const qs = new URLSearchParams();
    if (params?.eventTypeId) qs.set('eventTypeId', params.eventTypeId);
    if (params?.start) qs.set('start', params.start);
    if (params?.end) qs.set('end', params.end);
    const query = qs.toString();
    return request<Slot[]>(`${BASE}/slots${query ? `?${query}` : ''}`);
  }

  // Bookings
  async listBookings(params?: {
    eventTypeId?: string;
    start?: string;
    end?: string;
    guestEmail?: string;
    status?: string;
  }): Promise<Booking[]> {
    const qs = new URLSearchParams();
    if (params?.eventTypeId) qs.set('eventTypeId', params.eventTypeId);
    if (params?.start) qs.set('start', params.start);
    if (params?.end) qs.set('end', params.end);
    if (params?.guestEmail) qs.set('guestEmail', params.guestEmail);
    if (params?.status) qs.set('status', params.status);
    const query = qs.toString();
    return request<Booking[]>(`${BASE}/bookings${query ? `?${query}` : ''}`);
  }

  async createBooking(body: CreateBookingRequest): Promise<Booking> {
    return request<Booking>(`${BASE}/bookings`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // Availability
  async listAvailability(): Promise<AvailabilityPeriod[]> {
    return request<AvailabilityPeriod[]>(`${BASE}/availability`);
  }

  async createAvailability(body: CreateAvailabilityRequest): Promise<AvailabilityPeriod> {
    return request<AvailabilityPeriod>(`${BASE}/availability`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async deleteAvailability(id: string): Promise<void> {
    return request<void>(`${BASE}/availability/${id}`, {
      method: 'DELETE',
    });
  }
}