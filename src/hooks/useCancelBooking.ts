import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelBooking } from '../api/client';

export function useCancelBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'bookings'] });
    },
  });
}
