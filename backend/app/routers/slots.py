from datetime import datetime, timedelta
from fastapi import APIRouter, Query
from app.models import Slot
from app.storage import storage

router = APIRouter(prefix="/api/slots", tags=["Public"])


def generate_slots_for_range(
    event_type_id: str,
    start_date: datetime,
    end_date: datetime,
) -> list[Slot]:
    event_type = storage.event_types.get(event_type_id)
    if not event_type:
        return []
    
    duration = event_type.durationMinutes
    work_start_hour, work_start_min = map(int, storage.settings.workDayStart.split(':'))
    work_end_hour, work_end_min = map(int, storage.settings.workDayEnd.split(':'))
    
    slots = []
    current_date = start_date.replace(hour=0, minute=0, second=0, microsecond=0)
    
    while current_date <= end_date:
        day_start = current_date.replace(hour=work_start_hour, minute=work_start_min)
        day_end = current_date.replace(hour=work_end_hour, minute=work_end_min)
        
        current_slot = day_start
        while current_slot + timedelta(minutes=duration) <= day_end:
            slot_end = current_slot + timedelta(minutes=duration)
            
            is_booked = any(
                b.startAt < slot_end and b.endAt > current_slot
                for b in storage.bookings.values()
            )
            
            slots.append(Slot(
                startAt=current_slot,
                endAt=slot_end,
                isBooked=is_booked,
            ))
            
            current_slot += timedelta(minutes=duration)
        
        current_date += timedelta(days=1)
    
    return slots


@router.get("", response_model=list[Slot])
def list_slots(
    eventTypeId: str = Query(...),
    startDate: str = Query(...),
    endDate: str = Query(...),
) -> list[Slot]:
    start = datetime.fromisoformat(startDate)
    end = datetime.fromisoformat(endDate)
    all_slots = generate_slots_for_range(eventTypeId, start, end)
    now = datetime.now()
    return [slot for slot in all_slots if slot.startAt > now]
