import { Button, Group, Text } from '@mantine/core';
import type { EventType, Slot } from '../api/types';

interface SlotGridProps {
  slots: Slot[];
  eventTypes: EventType[];
  selectedSlot: Slot | null;
  onSelectSlot: (slot: Slot) => void;
  guestEmail: string | null;
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function getSlotStatus(slot: Slot, guestEmail: string | null): 'free' | 'booked' | 'mine' {
  if (!slot.eventTypeId) return 'free';
  if (guestEmail && slot.guestEmail === guestEmail) return 'mine';
  return 'booked';
}

export function SlotGrid({ slots, selectedSlot, onSelectSlot, guestEmail }: SlotGridProps) {
  if (slots.length === 0) {
    return <Text c="dimmed" ta="center">No slots available for this period.</Text>;
  }

  const groupedByDay = new Map<string, Slot[]>();
  for (const slot of slots) {
    const dayKey = new Date(slot.startAt).toLocaleDateString('en-CA');
    if (!groupedByDay.has(dayKey)) groupedByDay.set(dayKey, []);
    groupedByDay.get(dayKey)!.push(slot);
  }

  const sortedDays = Array.from(groupedByDay.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  return (
    <div>
      {sortedDays.map(([day, daySlots]) => {
        const dayDate = new Date(day + 'T00:00:00');
        const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'short' });
        const dayNum = dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

        return (
          <div key={day} style={{ marginBottom: '16px' }}>
            <Text fw={600} mb="xs" size="sm">
              {dayName}, {dayNum}
            </Text>
            <Group gap="xs" wrap="wrap">
              {daySlots.map((slot) => {
                const status = getSlotStatus(slot, guestEmail);
                const isSelected = selectedSlot?.id === slot.id;
                const isClickable = status === 'free';

                return (
                  <Button
                    key={slot.id}
                    variant={isSelected ? 'filled' : status === 'booked' ? 'outline' : status === 'mine' ? 'light' : 'light'}
                    color={status === 'booked' ? 'red' : status === 'mine' ? 'green' : isSelected ? 'blue' : 'gray'}
                    disabled={!isClickable}
                    onClick={() => isClickable && onSelectSlot(slot)}
                    size="sm"
                    style={{
                      height: 'auto',
                      padding: '8px 12px',
                      minWidth: '100px',
                      flex: '0 0 auto',
                    }}
                  >
                    <div>
                      <Text size="sm" fw={isSelected ? 700 : 500}>
                        {formatTime(slot.startAt)}
                      </Text>
                      {status === 'booked' && (
                        <Text size="xs" c="red">Booked</Text>
                      )}
                      {status === 'mine' && (
                        <Text size="xs" c="green">My booking</Text>
                      )}
                    </div>
                  </Button>
                );
              })}
            </Group>
          </div>
        );
      })}
    </div>
  );
}
