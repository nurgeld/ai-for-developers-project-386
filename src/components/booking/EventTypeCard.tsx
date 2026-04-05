import { Card, Group, Text, Badge } from '@mantine/core';
import { useNavigate } from '@tanstack/react-router';
import type { EventType } from '../../api/types';

interface EventTypeCardProps {
  eventType: EventType;
}

export function EventTypeCard({ eventType }: EventTypeCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      withBorder
      padding="lg"
      radius="md"
      style={{ cursor: 'pointer' }}
      onClick={() =>
        navigate({ to: '/book/$eventTypeId', params: { eventTypeId: eventType.id } })
      }
    >
      <Group justify="space-between" align="flex-start">
        <div>
          <Text fw={600} size="lg">{eventType.name}</Text>
          <Text size="sm" c="dimmed" mt={4}>{eventType.description}</Text>
        </div>
        <Badge variant="light" color="gray" size="lg">
          {eventType.durationMinutes} мин
        </Badge>
      </Group>
    </Card>
  );
}
