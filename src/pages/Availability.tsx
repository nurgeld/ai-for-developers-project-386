import { useState, useEffect } from 'react';
import {
  Table, Button, Group, Text, Stack, Badge,
  Card, Loader, Modal, Select, TextInput, ActionIcon
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import { api } from '../api/client';
import type { AvailabilityPeriod } from '../api/types';

const DAYS_OF_WEEK = [
  { value: '0', label: 'Monday' },
  { value: '1', label: 'Tuesday' },
  { value: '2', label: 'Wednesday' },
  { value: '3', label: 'Thursday' },
  { value: '4', label: 'Friday' },
  { value: '5', label: 'Saturday' },
  { value: '6', label: 'Sunday' },
];

export function Availability() {
  const [availability, setAvailability] = useState<AvailabilityPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [form, setForm] = useState({
    dayOfWeek: 0,
    startTime: '09:00',
    endTime: '17:00',
  });

  useEffect(() => {
    api.availability.list()
      .then(setAvailability)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async () => {
    try {
      await api.availability.create(form);
      close();
      setForm({ dayOfWeek: 0, startTime: '09:00', endTime: '17:00' });
      const data = await api.availability.list();
      setAvailability(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.availability.delete(id);
      const data = await api.availability.list();
      setAvailability(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (loading) return <Loader />;
  if (error) return <Text c="red">{error}</Text>;

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Text size="xl" fw={700}>Availability</Text>
        <Button leftSection={<IconPlus size={16} />} onClick={open}>
          Add Period
        </Button>
      </Group>

      {availability.length === 0 ? (
        <Card shadow="sm" padding="lg" withBorder>
          <Text c="dimmed" ta="center">No availability periods. Add your first one.</Text>
        </Card>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Day</Table.Th>
              <Table.Th>Start</Table.Th>
              <Table.Th>End</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {availability.map((period) => (
              <Table.Tr key={period.id}>
                <Table.Td>
                  <Badge>{DAYS_OF_WEEK.find((d) => d.value === String(period.dayOfWeek))?.label}</Badge>
                </Table.Td>
                <Table.Td>{period.startTime}</Table.Td>
                <Table.Td>{period.endTime}</Table.Td>
                <Table.Td>
                  <ActionIcon color="red" variant="subtle" onClick={() => handleDelete(period.id)}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}

      <Modal opened={opened} onClose={close} title="Add Availability Period" centered>
        <Stack>
          <Select
            label="Day of Week"
            data={DAYS_OF_WEEK}
            value={String(form.dayOfWeek)}
            onChange={(val) => setForm({ ...form, dayOfWeek: Number(val) })}
          />
          <TextInput
            label="Start Time"
            placeholder="09:00"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          />
          <TextInput
            label="End Time"
            placeholder="17:00"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={close}>Cancel</Button>
            <Button onClick={handleSubmit}>Create</Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
