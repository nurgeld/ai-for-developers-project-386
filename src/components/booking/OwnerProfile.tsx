import { Group, Avatar, Stack, Text } from '@mantine/core';
import type { OwnerSettings } from '../../api/types';

interface OwnerProfileProps {
  settings: OwnerSettings;
}

export function OwnerProfile({ settings }: OwnerProfileProps) {
  return (
    <Group gap="sm">
      <Avatar src={settings.avatarUrl} size="lg" radius="xl" color="orange">
        {settings.name.charAt(0)}
      </Avatar>
      <Stack gap={0}>
        <Text fw={600}>{settings.name}</Text>
        <Text size="sm" c="dimmed">Host</Text>
      </Stack>
    </Group>
  );
}
