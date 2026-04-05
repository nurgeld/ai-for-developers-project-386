import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createBooking } from '../api/client';
import type { Booking, Slot } from '../api/types';

function overlaps(slot: Slot, booking: Booking) {
  return slot.startAt < booking.endAt && slot.endAt > booking.startAt;
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: (booking) => {
      queryClient.setQueriesData({ queryKey: ['slots'] }, (current: Slot[] | undefined) => {
        if (!current) {
          return current;
        }

        return current.map((slot) => (
          overlaps(slot, booking) ? { ...slot, isBooked: true } : slot
        ));
      });

      queryClient.setQueryData(['owner', 'bookings', undefined], (current: Booking[] | undefined) => {
        if (!current) {
          return [booking];
        }

        const next = current.filter((item) => item.id !== booking.id);
        next.push(booking);
        next.sort((left, right) => left.startAt.localeCompare(right.startAt));

        return next;
      });

      queryClient.invalidateQueries({ queryKey: ['slots'] });
      queryClient.invalidateQueries({ queryKey: ['owner', 'bookings'] });
    },
  });
}
