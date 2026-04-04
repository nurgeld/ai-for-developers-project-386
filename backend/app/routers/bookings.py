import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Query
from app.models import Booking, CreateBookingRequest
from app.storage import storage

router = APIRouter(prefix="/bookings", tags=["Bookings"])


def check_overlap(start_at: datetime, end_at: datetime) -> bool:
    """Проверяет, пересекается ли время с существующими бронированиями."""
    for booking in storage.bookings.values():
        existing_start = booking.startAt
        existing_end = booking.endAt
        if start_at < existing_end and end_at > existing_start:
            return True
    return False


@router.post("", response_model=Booking, status_code=201)
def create_booking(request: CreateBookingRequest) -> Booking:
    """
    Создать бронирование.
    
    При пересечении времени с существующим бронированием возвращает 409 Conflict.
    endAt вычисляется автоматически на основе durationMinutes типа события.
    """
    event_type = storage.event_types.get(request.eventTypeId)
    if not event_type:
        raise HTTPException(status_code=404, detail="Event type not found")
    
    end_at = request.startAt + timedelta(minutes=event_type.durationMinutes)
    
    if check_overlap(request.startAt, end_at):
        raise HTTPException(
            status_code=409,
            detail="Time slot overlaps with existing booking"
        )
    
    booking = Booking(
        id=str(uuid.uuid4()),
        eventTypeId=request.eventTypeId,
        startAt=request.startAt,
        endAt=end_at,
        guestName=request.guestName,
        guestEmail=request.guestEmail,
        createdAt=datetime.now(),
    )
    storage.bookings[booking.id] = booking
    return booking


@router.get("", response_model=list[Booking])
def list_bookings(
    start: datetime | None = Query(None, description="Фильтр по начальной дате"),
    end: datetime | None = Query(None, description="Фильтр по конечной дате"),
) -> list[Booking]:
    """Получить список бронирований с фильтрами."""
    bookings = list(storage.bookings.values())
    
    if start:
        bookings = [b for b in bookings if b.startAt >= start]
    if end:
        bookings = [b for b in bookings if b.startAt <= end]
    
    return bookings
