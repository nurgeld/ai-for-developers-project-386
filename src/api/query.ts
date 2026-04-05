import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import { SlotService } from '../services/slotService';
import { BookingService } from '../services/bookingService';
import { EventTypeService } from '../services/eventTypeService';
import type { Slot, EventType, Booking, CreateBookingRequest } from '../api/types';

// Initialize services
const slotService = new SlotService(apiClient);
const bookingService = new BookingService(apiClient);
const eventTypeService = new EventTypeService(apiClient);

// Custom hooks for slots
export const useSlots = (start: string, end: string) => {
  return useQuery<Slot[], Error>({
    queryKey: ['slots', start, end],
    queryFn: () => slotService.listSlots({ start, end }),
  });
};

// Custom hooks for event types
export const useEventTypes = () => {
  return useQuery<EventType[], Error>({
    queryKey: ['eventTypes'],
    queryFn: () => eventTypeService.listEventTypes(),
  });
};

// Custom hook for creating a booking
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation<Booking, Error, CreateBookingRequest>({
    mutationFn: (request) => bookingService.createBooking(request),
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['slots'] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};