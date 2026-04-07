import { useMemo } from 'react';
import { DatePicker } from '@mantine/dates';
import { Box } from '@mantine/core';
import type { Slot } from '../../api/types';
import { dayjs } from '../../lib/dayjs';

interface SlotCalendarProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  monthSlots: Slot[];
  onMonthChange: (date: Date) => void;
}

export function SlotCalendar({
  value,
  onChange,
  monthSlots,
  onMonthChange,
}: SlotCalendarProps) {
  const today = dayjs().startOf('day');

  const freeCountByDate = useMemo(() => {
    const map: Record<string, number> = {};
    for (const slot of monthSlots) {
      if (!slot.isBooked) {
        const key = dayjs.utc(slot.startAt).format('YYYY-MM-DD');
        map[key] = (map[key] ?? 0) + 1;
      }
    }
    return map;
  }, [monthSlots]);

  return (
    <Box
      style={{
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <DatePicker
        value={value ? dayjs(value).format('YYYY-MM-DD') : null}
        onChange={(val) => {
          if (!val) {
            onChange(null);
            return;
          }

          const nextDate = dayjs(val);
          onChange(nextDate.isBefore(today, 'day') ? null : nextDate.toDate());
        }}
        onDateChange={(dateStr) => {
          onMonthChange(dayjs(dateStr).toDate());
        }}
        locale="ru"
        size="lg"
        firstDayOfWeek={1}
        minDate={today.format('YYYY-MM-DD')}
        excludeDate={(date) => dayjs(date).isBefore(today, 'day')}
        highlightToday
        getDayProps={(date) => {
          const day = dayjs(date);
          const key = day.format('YYYY-MM-DD');
          const isPast = day.isBefore(today, 'day');
          const count = freeCountByDate[key];
          const hasAvailability = count !== undefined && count > 0 && !isPast;

          if (hasAvailability) {
            return {
              style: {
                fontWeight: 600,
              },
            };
          }

          return {};
        }}
      />
    </Box>
  );
}
