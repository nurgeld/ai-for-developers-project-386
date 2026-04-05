import type { Booking, CreateBookingRequest } from '../api/types';
import type { ApiClient } from './apiClient';

/**
 * Service for handling booking-related business logic
 */
export class BookingService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * Create a new booking
   * @param request The booking request data
   * @returns The created booking
   */
  async createBooking(request: CreateBookingRequest): Promise<Booking> {
    return this.apiClient.createBooking(request);
  }

  /**
   * List bookings with optional filters
   * @param params Optional filter parameters
   * @returns Array of bookings
   */
  async listBookings(params?: {
    eventTypeId?: string;
    start?: string;
    end?: string;
    guestEmail?: string;
    status?: string;
  }): Promise<Booking[]> {
    return this.apiClient.listBookings(params);
  }
}