import type { EventType, CreateEventTypeRequest } from '../api/types';
import type { ApiClient } from './apiClient';

/**
 * Service for handling event type-related business logic
 */
export class EventTypeService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  /**
   * List all event types
   * @returns Array of event types
   */
  async listEventTypes(): Promise<EventType[]> {
    return this.apiClient.listEventTypes();
  }

  /**
   * Create a new event type
   * @param request The event type request data
   * @returns The created event type
   */
  async createEventType(request: CreateEventTypeRequest): Promise<EventType> {
    return this.apiClient.createEventType(request);
  }
}