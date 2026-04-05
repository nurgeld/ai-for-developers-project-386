import type { AvailabilityPeriod, CreateAvailabilityRequest } from '../api/types';
import type { ApiClient } from './apiClient';

/**
 * Service for handling availability-related business logic
 */
export class AvailabilityService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * List all availability periods
   * @returns Array of availability periods
   */
  async listAvailability(): Promise<AvailabilityPeriod[]> {
    return this.apiClient.listAvailability();
  }

  /**
   * Create a new availability period
   * @param request The availability request data
   * @returns The created availability period
   */
  async createAvailability(request: CreateAvailabilityRequest): Promise<AvailabilityPeriod> {
    return this.apiClient.createAvailability(request);
  }

  /**
   * Delete an availability period
   * @param id The ID of the availability period to delete
   */
  async deleteAvailability(id: string): Promise<void> {
    return this.apiClient.deleteAvailability(id);
  }
}