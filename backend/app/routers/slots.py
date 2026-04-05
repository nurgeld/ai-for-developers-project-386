import uuid
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Query
from app.models import Slot
from app.storage import storage

router = APIRouter(prefix="/api/slots", tags=["Slots"])

SLOT_GRID_MINUTES = 30
SHIFT_MINUTES = 10


def generate_slots() -> list[Slot]:
    """Generate slots with proper shifts.

    Logic:
    1. Generate base 30-min grid within availability periods
    2. For each slot, check if it's booked
    3. For free slots after 30-min bookings, apply +10 min shift
    4. Stop shifting when we hit another booking (it was already shifted when created)
    """
    slots = []
    availability_periods = list(storage.availability.values())

    if not availability_periods:
        return slots

    # Group bookings by day for quick lookup
    bookings_by_day = {}
    for booking in storage.bookings.values():
        day_key = booking.startAt.date()
        if day_key not in bookings_by_day:
            bookings_by_day[day_key] = []
        bookings_by_day[day_key].append(booking)

    now = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    end_date = now + timedelta(days=28)

    current = now
    while current <= end_date:
        day_of_week = current.weekday()
        day_key = current.date()
        day_bookings = bookings_by_day.get(day_key, [])

        for period in availability_periods:
            if period.dayOfWeek == day_of_week:
                # Parse availability times
                start_parts = str(period.startTime).split(':')
                end_parts = str(period.endTime).split(':')
                start_hour, start_minute = int(start_parts[0]), int(start_parts[1])
                end_hour, end_minute = int(end_parts[0]), int(end_parts[1])

                period_start = current.replace(
                    hour=start_hour, minute=start_minute, second=0, microsecond=0
                )
                period_end = current.replace(
                    hour=end_hour, minute=end_minute, second=0, microsecond=0
                )

                # Track current position and cumulative shift
                current_pos = period_start
                cumulative_shift = 0
                last_30min_booking_end = None

                while current_pos < period_end:
                    # Calculate this slot's actual start/end with current shift
                    slot_start = current_pos + timedelta(minutes=cumulative_shift)
                    slot_end = slot_start + timedelta(minutes=SLOT_GRID_MINUTES)

                    # Don't exceed period end
                    if slot_end > period_end:
                        break

                    # Check if this slot overlaps with a booking
                    booked_info = None
                    for booking in day_bookings:
                        if booking.startAt < slot_end and booking.endAt > slot_start:
                            booked_info = (booking.eventTypeId, booking.guestEmail, booking.endAt)
                            break

                    if booked_info:
                        # Add booked slot using actual booking times
                        event_type_id, guest_email, booking_end = booked_info
                        slots.append(Slot(
                            id=str(uuid.uuid4()),
                            eventTypeId=event_type_id,
                            guestEmail=guest_email,
                            startAt=slot_start,
                            endAt=slot_end,
                        ))

                        # Check if this was a 30-min booking
                        event_type = storage.event_types.get(event_type_id)
                        if event_type and event_type.durationMinutes == 30:
                            # Apply shift to next slot
                            cumulative_shift += SHIFT_MINUTES
                            last_30min_booking_end = booking_end

                        # Move to next base position
                        current_pos += timedelta(minutes=SLOT_GRID_MINUTES)
                    else:
                        # Free slot - add it
                        slots.append(Slot(
                            id=str(uuid.uuid4()),
                            eventTypeId=None,
                            guestEmail=None,
                            startAt=slot_start,
                            endAt=slot_end,
                        ))

                        # Move to next base position
                        current_pos += timedelta(minutes=SLOT_GRID_MINUTES)

        current += timedelta(days=1)

    return slots


@router.get("", response_model=list[Slot])
def list_slots(
    eventTypeId: Optional[str] = Query(None),
    start: Optional[datetime] = Query(None),
    end: Optional[datetime] = Query(None),
) -> list[Slot]:
    slots = generate_slots()

    if start:
        start_naive = start.replace(tzinfo=None)
        slots = [s for s in slots if s.startAt >= start_naive]
    if end:
        end_naive = end.replace(tzinfo=None)
        slots = [s for s in slots if s.startAt <= end_naive]

    return slots
