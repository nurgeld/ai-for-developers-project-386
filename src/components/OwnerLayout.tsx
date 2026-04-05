import { AppShell, Group, Title, Anchor, Container } from '@mantine/core';
import { Outlet, Link, useLocation } from 'react-router-dom';

const links = [
  { label: 'Dashboard', to: '/' },
  { label: 'Event Types', to: '/event-types' },
  { label: 'Availability', to: '/availability' },
  { label: 'Bookings', to: '/bookings' },
];

export function OwnerLayout() {
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Title order={3}>Calendar Owner</Title>
          <Group gap="md">
            {links.map((link) => (
              <Anchor
                key={link.to}
                component={Link}
                to={link.to}
                c={location.pathname === link.to ? 'blue' : 'dimmed'}
                fw={location.pathname === link.to ? 700 : 400}
              >
                {link.label}
              </Anchor>
            ))}
            <Anchor component={Link} to="/book" c="dimmed">
              Guest View
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
