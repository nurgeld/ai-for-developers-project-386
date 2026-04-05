import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createEventType,
  updateEventType,
  deleteEventType,
} from '../api/client';
import type { UpdateEventTypeRequest } from '../api/types';

export function useCreateEventType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEventType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventTypes'] });
    },
  });
}

export function useUpdateEventType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateEventTypeRequest }) =>
      updateEventType(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventTypes'] });
    },
  });
}

export function useDeleteEventType() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEventType,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventTypes'] });
    },
  });
}
