import { useState, useEffect } from 'react';
import { Title, Text, SimpleGrid, Card, Group, Badge, Loader } from '@mantine/core';
import { api } from '../api/client';
import type { Booking, EventType } from '../api/types';

export function Dashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [bookingsData, eventTypesData] = await Promise.all([
          api.bookings.list(),
          api.eventTypes.list(),
        ]);
        setBookings(bookingsData);
        setEventTypes(eventTypesData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <Text c="red">{error}</Text>;

  const eventTypeMap = new Map(eventTypes.map((et) => [et.id, et]));
  const today = new Date().toLocaleDateString('en-CA');
  const todayBookings = bookings.filter((b) => b.startAt.startsWith(today));

  return (
    <div>
      <Title order={2} mb="md">Dashboard</Title>

      <SimpleGrid cols={{ base: 1, sm: 3 }} mb="xl">
        <Card shadow="sm" padding="lg">
          <Text size="sm" c="dimmed">Total Bookings</Text>
          <Text size="xl" fw={700}>{bookings.length}</Text>
        </Card>
        <Card shadow="sm" padding="lg">
          <Text size="sm" c="dimmed">Event Types</Text>
          <Text size="xl" fw={700}>{eventTypes.length}</Text>
        </Card>
        <Card shadow="sm" padding="lg">
          <Text size="sm" c="dimmed">Today</Text>
          <Text size="xl" fw={700}>{todayBookings.length}</Text>
        </Card>
      </SimpleGrid>

      <Title order={4} mb="md">Upcoming Bookings</Title>
      {bookings.length === 0 ? (
        <Text c="dimmed">No bookings yet.</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          {bookings.map((booking) => {
            const et = eventTypeMap.get(booking.eventTypeId);
            return (
              <Card key={booking.id} shadow="sm" padding="md">
                <Group justify="space-between" mb="xs">
                  <Text fw={600}>{et?.title || 'Unknown'}</Text>
                  <Badge>{booking.guestName}</Badge>
                </Group>
                <Text size="sm" c="dimmed">
                  {new Date(booking.startAt).toLocaleString()} — {new Date(booking.endAt).toLocaleTimeString()}
                </Text>
                <Text size="sm">{booking.guestEmail}</Text>
                {booking.comment && (
                  <Text size="sm" mt="xs" c="dimmed">{booking.comment}</Text>
                )}
              </Card>
            );
          })}
        </SimpleGrid>
      )}
    </div>
  );
}
