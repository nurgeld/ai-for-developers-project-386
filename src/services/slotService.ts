import type { Slot } from '../api/types';
import type { ApiClient } from './apiClient';

/**
 * Service for handling slot-related business logic
 */
export class SlotService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * List slots with optional filters
   * @param params Optional filter parameters
   * @returns Array of slots
   */
  async listSlots(params?: { eventTypeId?: string; start?: string; end?: string }): Promise<Slot[]> {
    return this.apiClient.listSlots(params);
  }

  /**
   * Determine the status of a slot for display purposes
   * @param slot The slot to check
   * @param guestEmail The current guest's email (from cookie)
   * @returns 'free', 'booked', or 'mine'
   */
  getSlotStatus(slot: Slot, guestEmail: string | null): 'free' | 'booked' | 'mine' {
    if (!slot.eventTypeId) return 'free';
    if (guestEmail && slot.guestEmail === guestEmail) return 'mine';
    return 'booked';
  }

  /**
   * Check if a slot is bookable (free and available for selection)
   * @param slot The slot to check
   * @returns true if the slot can be booked
   */
  isSlotBookable(slot: Slot): boolean {
    return !slot.eventTypeId;
  }

  /**
   * Format a date string to time only (HH:MM)
   * @param dateStr ISO date string
   * @returns Formatted time string
   */
  formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}