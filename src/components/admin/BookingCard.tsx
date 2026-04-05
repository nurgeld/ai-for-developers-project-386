import { Paper, Text, Group, Button } from '@mantine/core';
import type { Booking } from '../../api/types';
import { dayjs } from '../../lib/dayjs';

interface BookingCardProps {
  booking: Booking;
  onCancel: (id: string) => void;
  isCancelling: boolean;
}

export function BookingCard({ booking, onCancel, isCancelling }: BookingCardProps) {
  const isPast = dayjs.utc(booking.startAt).isBefore(dayjs());

  return (
    <Paper withBorder p="lg" radius="md" bd={`1px solid ${isPast ? 'var(--mantine-color-gray-4)' : 'var(--mantine-color-green-6)'}`}>
      <Group justify="space-between" align="flex-start">
        <div>
          <Text fw={600} c={isPast ? 'gray.6' : 'green.8'}>{booking.guestName}</Text>
          <Text size="sm" c={isPast ? 'gray.5' : 'dimmed'}>{booking.guestEmail}</Text>
          <Text size="sm" c={isPast ? 'gray.5' : 'dimmed'}>
            Слот: {dayjs.utc(booking.startAt).format('YYYY-MM-DD HH:mm')}
          </Text>
          <Text size="sm" c={isPast ? 'gray.5' : 'dimmed'}>
            Создано: {dayjs.utc(booking.createdAt).format('DD.MM.YYYY, HH:mm')}
          </Text>
          <Text size="sm" c={isPast ? 'gray.5' : 'dimmed'}>
            Тип: {booking.eventTypeName}
          </Text>
        </div>
        <Button
          variant="subtle"
          color={isPast ? 'gray' : 'red'}
          size="xs"
          onClick={() => onCancel(booking.id)}
          loading={isCancelling}
        >
          Отменить
        </Button>
      </Group>
    </Paper>
  );
}
