import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Title, Text, Stack, Group, Button, Loader, Card, TextInput,
  Textarea, Badge, Modal, Radio
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { IconCalendar } from '@tabler/icons-react';
import { useSlots, useEventTypes, useCreateBooking } from '../api/query';
import type { Slot, CreateBookingRequest } from '../api/types';
import { SlotGrid } from '../components/SlotGrid';
import { getGuestEmail } from '../utils/guestEmail';

const WEEKS_LIMIT = 4;

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekEnd(weekStart: Date): Date {
  const end = new Date(weekStart);
  end.setDate(end.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}

export function GuestCalendar() {
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  
  const guestEmail = getGuestEmail();

  const form = useForm({
    initialValues: {
      eventTypeId: '',
      guestName: '',
      guestEmail: '',
      comment: '',
    },
    validate: {
      eventTypeId: (value) => (value ? null : 'Select event type'),
      guestName: (value) => (value ? null : 'Name is required'),
      guestEmail: (value) => (value && /^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email'),
      comment: (value) => (value && value.length > 500 ? 'Comment must be under 500 characters' : null),
    },
  });

  const { weekStart, weekEnd } = useMemo(() => {
    const baseWeekStart = getWeekStart(new Date());
    const start = new Date(baseWeekStart);
    start.setDate(start.getDate() + weekOffset * 7);
    const end = getWeekEnd(start);
    return { weekStart: start, weekEnd: end };
  }, [weekOffset]);

  const { data: slots = [], isLoading: slotsLoading, error: slotsError } = useSlots(
    weekStart.toISOString(),
    weekEnd.toISOString()
  );

  const { data: eventTypes = [], isLoading: eventTypesLoading, error: eventTypesError } = useEventTypes();

  const { mutate: createBooking, error: bookingError, isSuccess: isBookingSuccess, reset: resetBooking } = useCreateBooking();

  // Handle successful booking
  useEffect(() => {
    if (isBookingSuccess) {
      closeModal();
      setBookingSuccess(true);
      form.reset();
      resetBooking();
    }
  }, [isBookingSuccess, closeModal, form, resetBooking]);

  const handleSlotSelect = (slot: Slot) => {
    setSelectedSlot(slot);
    openModal();
  };

  const handleBook = useCallback(() => {
    if (!selectedSlot) return;
    const values = form.getValues();

    const body: CreateBookingRequest = {
      eventTypeId: values.eventTypeId,
      startAt: selectedSlot.startAt,
      guestName: values.guestName,
      guestEmail: values.guestEmail,
      comment: values.comment || undefined,
    };

    createBooking(body);
  }, [selectedSlot, form, createBooking]);

  const navigateWeek = (direction: number) => {
    const newOffset = weekOffset + direction;
    if (newOffset < 0 || newOffset > WEEKS_LIMIT) return;
    setWeekOffset(newOffset);
    setSelectedSlot(null);
  };

  const formatWeekLabel = () => {
    const start = new Date(weekStart);
    const end = new Date(weekEnd);
    const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const endStr = end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${startStr} — ${endStr}`;
  };

  const loading = slotsLoading || eventTypesLoading;
  const error: Error | null = slotsError || eventTypesError || bookingError || null;

  // Show loader if any data is still loading
  if (loading) return <Loader />;
  
  // Show error if any request failed
  if (error) return <Text c="red">{error.message}</Text>;

  if (bookingSuccess) {
    return (
      <Stack gap="lg" align="center" style={{ padding: '4rem 0' }}>
        <Title order={2}>Booking Confirmed!</Title>
        <Text c="dimmed">Your booking has been created successfully.</Text>
        <Button onClick={() => setBookingSuccess(false)}>Book Another Slot</Button>
      </Stack>
    );
  }

  return (
    <Stack gap="lg">
      <Title order={2}>Book a Meeting</Title>

      <Group justify="space-between">
        <Button
          variant="default"
          onClick={() => navigateWeek(-1)}
          disabled={weekOffset === 0}
        >
          ← Previous Week
        </Button>
        <Text fw={600}>{formatWeekLabel()}</Text>
        <Button
          variant="default"
          onClick={() => navigateWeek(1)}
          disabled={weekOffset === WEEKS_LIMIT}
        >
          Next Week →
        </Button>
      </Group>

      <Card shadow="sm" padding="md" withBorder>
        <Text fw={600} mb="sm">Available Slots</Text>
        <SlotGrid
          slots={slots}
          eventTypes={eventTypes}
          selectedSlot={selectedSlot}
          onSelectSlot={handleSlotSelect}
          guestEmail={guestEmail}
        />
      </Card>

      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title="Book a Slot"
        centered
        size="md"
      >
        {selectedSlot && (
          <Stack gap="md">
            <Badge size="lg">
              {new Date(selectedSlot.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} — {new Date(selectedSlot.endAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Badge>

            <Radio.Group
              label="Event Type"
              {...form.getInputProps('eventTypeId')}
            >
              <Stack gap="xs" mt="xs">
                {eventTypes.map((et) => (
                  <Radio
                    key={et.id}
                    value={et.id}
                    label={`${et.title} (${et.durationMinutes} min)`}
                    description={et.description}
                  />
                ))}
              </Stack>
            </Radio.Group>

            <TextInput
              label="Name"
              placeholder="Your name"
              required
              {...form.getInputProps('guestName')}
            />
            <TextInput
              label="Email"
              placeholder="your@email.com"
              required
              {...form.getInputProps('guestEmail')}
            />
            <Textarea
              label="Comment (optional)"
              placeholder="Any additional info..."
              maxLength={500}
              autosize
              minRows={2}
              maxRows={4}
              {...form.getInputProps('comment')}
            />

            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={closeModal}>Cancel</Button>
              <Button onClick={handleBook} leftSection={<IconCalendar />}>
                Book
              </Button>
            </Group>
          </Stack>
        )}
      </Modal>
    </Stack>
  );
}