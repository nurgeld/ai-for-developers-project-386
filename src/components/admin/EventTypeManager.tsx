import { useState } from 'react';
import {
  Stack,
  Text,
  Paper,
  Group,
  Button,
  TextInput,
  Select,
  Loader,
  Center,
  Modal,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEventTypes } from '../../hooks/useEventTypes';
import {
  useCreateEventType,
  useUpdateEventType,
  useDeleteEventType,
} from '../../hooks/useOwnerEventTypes';
import type { EventType } from '../../api/types';
import { ApiError } from '../../api/client';

export function EventTypeManager() {
  const { data: eventTypes, isLoading } = useEventTypes();
  const createMutation = useCreateEventType();
  const updateMutation = useUpdateEventType();
  const deleteMutation = useDeleteEventType();

  const [createOpen, setCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const createForm = useForm({
    initialValues: {
      name: '',
      description: '',
      durationMinutes: '15' as string,
    },
    validate: {
      name: (v) => (v.trim().length < 1 ? 'Обязательное поле' : null),
    },
  });

  const editForm = useForm({
    initialValues: {
      name: '',
      description: '',
    },
    validate: {
      name: (v) => (v.trim().length < 1 ? 'Обязательное поле' : null),
    },
  });

  if (isLoading) {
    return <Center py="xl"><Loader /></Center>;
  }

  function handleCreate(values: { name: string; description: string; durationMinutes: string }) {
    setApiError(null);
    createMutation.mutate(
      {
        name: values.name,
        description: values.description,
        durationMinutes: Number(values.durationMinutes) as 15 | 30,
      },
      {
        onSuccess: () => {
          setCreateOpen(false);
          createForm.reset();
        },
        onError: (err) => {
          if (err instanceof ApiError) {
            setApiError((err.data as { message?: string })?.message ?? err.message);
          }
        },
      },
    );
  }

  function startEdit(et: EventType) {
    setEditingId(et.id);
    editForm.setValues({ name: et.name, description: et.description });
  }

  function handleUpdate(values: { name: string; description: string }) {
    if (!editingId) return;
    setApiError(null);
    updateMutation.mutate(
      { id: editingId, body: values },
      {
        onSuccess: () => setEditingId(null),
        onError: (err) => {
          if (err instanceof ApiError) {
            setApiError((err.data as { message?: string })?.message ?? err.message);
          }
        },
      },
    );
  }

  function handleDelete(id: string) {
    deleteMutation.mutate(id);
  }

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text fw={600} size="lg">Типы событий</Text>
        <Button color="orange" size="xs" onClick={() => setCreateOpen(true)}>
          Создать
        </Button>
      </Group>

      {eventTypes?.map((et) => (
        <Paper key={et.id} withBorder p="md" radius="md">
          {editingId === et.id ? (
            <form onSubmit={editForm.onSubmit(handleUpdate)}>
              <Stack gap="sm">
                <TextInput
                  label="Название"
                  required
                  {...editForm.getInputProps('name')}
                />
                <TextInput
                  label="Описание"
                  {...editForm.getInputProps('description')}
                />
                <Group>
                  <Button type="submit" size="xs" color="orange" loading={updateMutation.isPending}>
                    Сохранить
                  </Button>
                  <Button variant="subtle" size="xs" onClick={() => setEditingId(null)}>
                    Отмена
                  </Button>
                </Group>
              </Stack>
            </form>
          ) : (
            <Group justify="space-between">
              <div>
                <Text fw={600}>{et.name}</Text>
                <Text size="sm" c="dimmed">{et.description}</Text>
                <Text size="sm" c="dimmed">{et.durationMinutes} мин</Text>
              </div>
              <Group gap="xs">
                <Button variant="subtle" size="xs" onClick={() => startEdit(et)}>
                  Изменить
                </Button>
                <Button
                  variant="subtle"
                  color="red"
                  size="xs"
                  onClick={() => handleDelete(et.id)}
                  loading={deleteMutation.isPending}
                >
                  Удалить
                </Button>
              </Group>
            </Group>
          )}
        </Paper>
      ))}

      {apiError && <Text c="red" size="sm">{apiError}</Text>}

      <Modal
        opened={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Новый тип события"
      >
        <form onSubmit={createForm.onSubmit(handleCreate)}>
          <Stack gap="md">
            <TextInput
              label="Название"
              placeholder="Встреча 15 минут"
              required
              {...createForm.getInputProps('name')}
            />
            <TextInput
              label="Описание"
              placeholder="Короткий тип события"
              {...createForm.getInputProps('description')}
            />
            <Select
              label="Длительность"
              data={[
                { value: '15', label: '15 минут' },
                { value: '30', label: '30 минут' },
              ]}
              {...createForm.getInputProps('durationMinutes')}
            />

            {apiError && <Text c="red" size="sm">{apiError}</Text>}

            <Button type="submit" color="orange" loading={createMutation.isPending}>
              Создать
            </Button>
          </Stack>
        </form>
      </Modal>
    </Stack>
  );
}
