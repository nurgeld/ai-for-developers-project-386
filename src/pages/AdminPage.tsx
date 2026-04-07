import { Container, Title, Tabs, Stack } from '@mantine/core';
import { BookingList } from '../components/admin/BookingList';
import { OwnerSettingsForm } from '../components/admin/OwnerSettingsForm';
import { EventTypeManager } from '../components/admin/EventTypeManager';
import { ScheduleView } from '../components/admin/ScheduleView';

export function AdminPage() {
  return (
    <Container size="lg" py="xl">
      <Title order={2} mb="lg">Предстоящие события</Title>

      <Tabs defaultValue="bookings">
        <Tabs.List mb="lg">
          <Tabs.Tab value="bookings">Бронирования</Tabs.Tab>
          <Tabs.Tab value="schedule">Расписание</Tabs.Tab>
          <Tabs.Tab value="settings">Настройки</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="bookings">
          <BookingList />
        </Tabs.Panel>

        <Tabs.Panel value="schedule">
          <ScheduleView />
        </Tabs.Panel>

        <Tabs.Panel value="settings">
          <Stack gap="xl">
            <OwnerSettingsForm />
            <EventTypeManager />
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
