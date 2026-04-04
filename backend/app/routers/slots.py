from datetime import datetime, timedelta
from fastapi import APIRouter, Query
from app.models import Slot
from app.storage import storage

router = APIRouter(prefix="/slots", tags=["Slots"])


def generate_slots(event_type_id: str, duration_minutes: int) -> list[Slot]:
    """Генерирует слоты на основе периодов доступности."""
    slots = []
    
    availability_periods = [
        a for a in storage.availability.values()
        if a.eventTypeId == event_type_id
    ]
    
    if not availability_periods:
        return slots
    
    now = datetime.now()
    end_date = now + timedelta(days=14)
    
    current = now
    while current <= end_date:
        day_of_week = current.weekday()
        
        for period in availability_periods:
            if period.dayOfWeek == day_of_week:
                start_hour, start_minute = map(int, str(period.startTime).split(':'))
                end_hour, end_minute = map(int, str(period.endTime).split(':'))
                
                slot_start = current.replace(hour=start_hour, minute=start_minute, second=0, microsecond=0)
                slot_end = current.replace(hour=end_hour, minute=end_minute, second=0, microsecond=0)
                
                while slot_start < slot_end:
                    slot_end_time = slot_start + timedelta(minutes=duration_minutes)
                    
                    is_booked = any(
                        b.eventTypeId == event_type_id and
                        b.startAt <= slot_start and
                        b.endAt >= slot_end_time
                        for b in storage.bookings.values()
                    )
                    
                    slots.append(Slot(
                        id=f"{event_type_id}_{slot_start.isoformat()}",
                        eventTypeId=event_type_id,
                        startAt=slot_start,
                        endAt=slot_end_time,
                        isBooked=is_booked,
                    ))
                    
                    slot_start = slot_end_time
        
        current += timedelta(days=1)
    
    return slots


@router.get("", response_model=list[Slot])
def list_slots(
    eventTypeId: str = Query(..., description="ID типа события"),
    start: datetime | None = Query(None, description="Фильтр по начальной дате"),
    end: datetime | None = Query(None, description="Фильтр по конечной дате"),
) -> list[Slot]:
    """Получить список слотов с фильтрами."""
    event_type = storage.event_types.get(eventTypeId)
    if not event_type:
        return []
    
    slots = generate_slots(eventTypeId, event_type.durationMinutes)
    
    if start:
        slots = [s for s in slots if s.startAt >= start]
    if end:
        slots = [s for s in slots if s.startAt <= end]
    
    return slots
