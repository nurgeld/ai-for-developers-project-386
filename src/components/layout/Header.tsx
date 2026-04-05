import { Group, Text, Button } from '@mantine/core';
import { Link, useMatchRoute } from '@tanstack/react-router';

export function Header() {
  const matchRoute = useMatchRoute();
  const isAdmin = matchRoute({ to: '/admin', fuzzy: true });

  return (
    <Group h="100%" px="md" justify="space-between">
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Group gap={8}>
          <Text size="lg" fw={700}>Calendar</Text>
        </Group>
      </Link>
      <Group gap="md">
        <Button
          variant={!isAdmin ? 'outline' : 'subtle'}
          component={Link}
          to="/book"
        >
          Записаться
        </Button>
        <Button
          variant={isAdmin ? 'outline' : 'subtle'}
          component={Link}
          to="/admin"
        >
          Предстоящие события
        </Button>
      </Group>
    </Group>
  );
}
