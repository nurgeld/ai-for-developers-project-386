import { Container, Title, Text, Button, Group, Paper, Stack, List } from '@mantine/core';
import { Link } from '@tanstack/react-router';

export function HomePage() {
  return (
    <Container size="lg" py="xl">
      <Group align="flex-start" justify="space-between" wrap="wrap" gap="xl">
        <Stack gap="md" style={{ maxWidth: 500 }}>
          <Text
            size="sm"
            fw={600}
            c="dimmed"
            tt="uppercase"
            style={{
              border: '1px solid var(--mantine-color-gray-3)',
              borderRadius: 20,
              display: 'inline-block',
              padding: '4px 16px',
              width: 'fit-content',
            }}
          >
            Быстрая запись на звонок
          </Text>
          <Title order={1} size="3rem">Calendar</Title>
          <Text c="dimmed" size="lg">
            Забронируйте встречу за минуту: выберите тип события и удобное время.
          </Text>
          <Button
            component={Link}
            to="/book"
            color="orange"
            size="lg"
            radius="xl"
            rightSection={<span>&rarr;</span>}
            w="fit-content"
          >
            Записаться
          </Button>
        </Stack>

        <Paper
          withBorder
          p="xl"
          radius="md"
          style={{ maxWidth: 400, flex: '1 1 300px' }}
          bg="orange.0"
        >
          <Text fw={600} size="lg" mb="md">Возможности</Text>
          <List spacing="sm" size="sm" c="dimmed">
            <List.Item>Выбор типа события и удобного времени для встречи.</List.Item>
            <List.Item>Быстрое бронирование с подтверждением и дополнительными заметками.</List.Item>
            <List.Item>Управление типами встреч и просмотр предстоящих записей в админке.</List.Item>
          </List>
        </Paper>
      </Group>
    </Container>
  );
}
