import { useState, useEffect } from 'react';
import {
  Table, Button, Group, Text, Stack, Card, Loader,
  SimpleGrid, TextInput, Select
} from '@mantine/core';
import { api } from '../api/client';
import type { Booking, EventType } from '../api/types';

export function Bookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterEventTypeId, setFilterEventTypeId] = useState<string | null>(null);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [refetchKey, setRefetchKey] = useState(0);

  useEffect(() => {
    api.eventTypes.list()
      .then(setEventTypes)
      .catch((err) => {
        console.error('Failed to load event types:', err);
        setError(err instanceof Error ? err.message : String(err));
      });
  }, []);

  useEffect(() => {
    const params: { eventTypeId?: string; start?: string; end?: string } = {};
    if (filterEventTypeId) params.eventTypeId = filterEventTypeId;
    if (filterStartDate) params.start = filterStartDate;
    if (filterEndDate) params.end = filterEndDate;

    console.log('Fetching bookings with params:', params);
    api.bookings.list(params)
      .then((data) => {
        console.log('Bookings data received:', data);
        setBookings(data);
      })
      .catch((err) => {
        console.error('Failed to load bookings:', err);
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => setLoading(false));
  }, [filterEventTypeId, filterStartDate, filterEndDate, refetchKey]);

  const eventTypeMap = new Map(eventTypes.map((et) => [et.id, et]));

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  if (loading) return <Loader />;
  if (error) return <Text c="red">{error}</Text>;

  return (
    <Stack gap="lg">
      <Group justify="space-between">
        <Text size="xl" fw={700}>Bookings</Text>
        <Button
          variant="default"
          onClick={() => {
            setFilterEventTypeId(null);
            setFilterStartDate('');
            setFilterEndDate('');
            setRefetchKey((k) => k + 1);
          }}
        >
          Reset Filters
        </Button>
      </Group>

      <Card shadow="sm" padding="md" withBorder>
        <Text size="sm" fw={600} mb="sm">Filters</Text>
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <Select
            label="Event Type"
            placeholder="All"
            value={filterEventTypeId}
            onChange={setFilterEventTypeId}
            data={eventTypes.map((et) => ({ value: et.id, label: et.title }))}
            clearable
          />
          <TextInput
            label="Start Date"
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
          />
          <TextInput
            label="End Date"
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
          />
        </SimpleGrid>
      </Card>

      {bookings.length === 0 ? (
        <Card shadow="sm" padding="lg" withBorder>
          <Text c="dimmed" ta="center">No bookings found.</Text>
        </Card>
      ) : (
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Event Type</Table.Th>
              <Table.Th>Guest</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Start</Table.Th>
              <Table.Th>End</Table.Th>
              <Table.Th>Comment</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {bookings.map((booking) => (
              <Table.Tr key={booking.id}>
                <Table.Td>{eventTypeMap.get(booking.eventTypeId)?.title || booking.eventTypeId}</Table.Td>
                <Table.Td><Text fw={600}>{booking.guestName}</Text></Table.Td>
                <Table.Td><Text size="sm" c="dimmed">{booking.guestEmail}</Text></Table.Td>
                <Table.Td>{formatDateTime(booking.startAt)}</Table.Td>
                <Table.Td>{formatDateTime(booking.endAt)}</Table.Td>
                <Table.Td><Text size="sm" c="dimmed">{booking.comment || '—'}</Text></Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Stack>
  );
}
