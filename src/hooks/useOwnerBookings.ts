import { useQuery } from '@tanstack/react-query';
import { listBookings } from '../api/client';
import type { ListBookingsParams } from '../api/client';

export function useOwnerBookings(params?: ListBookingsParams) {
  return useQuery({
    queryKey: ['owner', 'bookings', params],
    queryFn: () => listBookings(params),
  });
}
