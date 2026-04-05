import { AppShell, Group, Title, Anchor, Container } from '@mantine/core';
import { Outlet, Link } from 'react-router-dom';

export function GuestLayout() {
  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Title order={3}>Book a Meeting</Title>
          <Group gap="md">
            <Anchor component={Link} to="/" c="dimmed">
              Owner View
            </Anchor>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Main>
        <Container size="xl">
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
