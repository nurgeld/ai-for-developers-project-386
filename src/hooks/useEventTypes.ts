import { useQuery } from '@tanstack/react-query';
import { listEventTypes } from '../api/client';

export function useEventTypes() {
  return useQuery({
    queryKey: ['eventTypes'],
    queryFn: listEventTypes,
  });
}
