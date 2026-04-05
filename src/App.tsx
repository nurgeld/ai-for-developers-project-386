import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { OwnerLayout } from './components/OwnerLayout';
import { GuestLayout } from './components/GuestLayout';
import { Dashboard } from './pages/Dashboard';
import { EventTypes } from './pages/EventTypes';
import { Availability } from './pages/Availability';
import { Bookings } from './pages/Bookings';
import { GuestCalendar } from './pages/GuestCalendar';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<OwnerLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="event-types" element={<EventTypes />} />
              <Route path="availability" element={<Availability />} />
              <Route path="bookings" element={<Bookings />} />
            </Route>
            <Route path="/book" element={<GuestLayout />}>
              <Route index element={<GuestCalendar />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
}
