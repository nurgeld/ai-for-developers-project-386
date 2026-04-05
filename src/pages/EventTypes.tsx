import { useState, useEffect } from 'react';
import {
  Table, Button, Group, TextInput, Textarea,
  Modal, Stack, Text, Badge, Card, Loader, SegmentedControl
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus } from '@tabler/icons-react';
import { api } from '../api/client';
import type { EventType } from '../api/types';

export function EventTypes() {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    durationMinutes: 15,
  });

  useEffect(() => {
    api.eventTypes.list()
      .then(setEventTypes)
      .catch((err) => {
        console.error('Failed to load event types:', err);
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!form.title || !form.durationMinutes) return;
    try {
      await api.eventTypes.create(form);
      setForm({ title: '', description: '', durationMinutes: 15 });
      close();
      const data = await api.eventTypes.list();
      setEventTypes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    }
  };

  if (loading) return <Loader />;
  if (error) return <Text c="red">{error}</Text>;

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Text size="xl" fw={700}>Event Types</Text>
        <Button leftSection={<IconPlus size={16} />} onClick={open}>
          Add Event Type
        </Button>
      </Group>

      {eventTypes.length === 0 ? (
        <Card shadow="sm" padding="lg" withBorder>
          <Text c="dimmed" ta="center">No event types yet. Create your first one.</Text>
        </Card>
      ) : (
        <Table striped highlightOnHover>
            <Table.Thead>
            <Table.Tr>
              <Table.Th>Title</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Duration</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {eventTypes.map((et) => (
              <Table.Tr key={et.id}>
                <Table.Td><Text fw={600}>{et.title}</Text></Table.Td>
                <Table.Td>{et.description}</Table.Td>
                <Table.Td>
                  <Badge>{et.durationMinutes} min</Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      <Modal opened={opened} onClose={close} title="Add Event Type" centered>
        <Stack>
          <TextInput
            label="Title"
            placeholder="Consultation"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <Textarea
            label="Description"
            placeholder="Description of the event"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Stack gap="xs">
            <Text size="sm" fw={500}>Duration (minutes)</Text>
            <SegmentedControl
              value={String(form.durationMinutes)}
              onChange={(val) => setForm({ ...form, durationMinutes: Number(val) })}
              data={[
                { label: '15 min', value: '15' },
                { label: '30 min', value: '30' },
              ]}
            />
          </Stack>
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={close}>Cancel</Button>
            <Button onClick={handleSubmit}>Create</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
