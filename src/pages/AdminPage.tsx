import { Container, Title, Tabs, Stack, Group, ThemeIcon, Paper, Box } from '@mantine/core';
import { IconList, IconCalendar, IconSettings } from '@tabler/icons-react';
import { BookingList } from '../components/admin/BookingList';
import { OwnerSettingsForm } from '../components/admin/OwnerSettingsForm';
import { EventTypeManager } from '../components/admin/EventTypeManager';
import { ScheduleView } from '../components/admin/ScheduleView';

export function AdminPage() {
  return (
    <Container size="lg" py="xl">
      <Group gap="xs" mb="xl">
        <ThemeIcon size="lg" variant="light" color="orange">
          <IconSettings size={24} />
        </ThemeIcon>
        <Title order={2}>Управление</Title>
      </Group>

      <Paper withBorder radius="md">
        <Tabs defaultValue="bookings">
          <Tabs.List 
            style={{ 
              borderBottom: 'none',
              gap: '4px',
              padding: '12px 16px 0',
            }}
          >
            <Tabs.Tab 
              value="bookings" 
              leftSection={<IconList size={16} />}
              style={{
                border: '1px solid transparent',
                borderBottom: '1px solid transparent',
                borderRadius: '8px 8px 0 0',
                backgroundColor: 'transparent',
                marginBottom: '-1px',
                position: 'relative',
                zIndex: 2,
              }}
              className="admin-tab"
            >
              Бронирования
            </Tabs.Tab>
            <Tabs.Tab 
              value="schedule" 
              leftSection={<IconCalendar size={16} />}
              style={{
                border: '1px solid transparent',
                borderBottom: '1px solid transparent',
                borderRadius: '8px 8px 0 0',
                backgroundColor: 'transparent',
                marginBottom: '-1px',
                position: 'relative',
                zIndex: 2,
              }}
              className="admin-tab"
            >
              Расписание
            </Tabs.Tab>
            <Tabs.Tab 
              value="settings" 
              leftSection={<IconSettings size={16} />}
              style={{
                border: '1px solid transparent',
                borderBottom: '1px solid transparent',
                borderRadius: '8px 8px 0 0',
                backgroundColor: 'transparent',
                marginBottom: '-1px',
                position: 'relative',
                zIndex: 2,
              }}
              className="admin-tab"
            >
              Настройки
            </Tabs.Tab>
          </Tabs.List>

          <style>{`
            .admin-tab[data-active="true"] {
              border: 1px solid #dee2e6 !important;
              border-top: 3px solid #F06418 !important;
              border-bottom: 1px solid white !important;
              background-color: white !important;
              color: #F06418 !important;
              font-weight: 600 !important;
            }
            .admin-tab:hover:not([data-active="true"]) {
              background-color: #f8f9fa !important;
            }
          `}</style>

          <Box p="lg" pt="md">
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
          </Box>
        </Tabs>
      </Paper>
    </Container>
  );
}
