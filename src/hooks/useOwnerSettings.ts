import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../api/client';

export function useOwnerSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });
}
