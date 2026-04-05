import uuid
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from app.models import (
    Booking,
    CreateBookingRequest,
    ConflictError,
    InvalidSlotTimeError,
)
from app.storage import storage

router = APIRouter(prefix="/api/bookings", tags=["Public"])


@router.post("", response_model=Booking, status_code=201)
def create_booking(body: CreateBookingRequest) -> Booking:
    event_type = storage.event_types.get(body.eventTypeId)
    if not event_type:
        raise HTTPException(
            status_code=404,
            detail={"error": "NOT_FOUND", "message": "Event type not found"},
        )
    
    end_at = body.startAt + timedelta(minutes=event_type.durationMinutes)
    
    for booking in storage.bookings.values():
        if body.startAt < booking.endAt and end_at > booking.startAt:
            raise HTTPException(
                status_code=409,
                detail=ConflictError().model_dump(),
            )
    
    booking = Booking(
        id=str(uuid.uuid4()),
        eventTypeId=body.eventTypeId,
        eventTypeName=event_type.name,
        guestName=body.guestName,
        guestEmail=body.guestEmail,
        startAt=body.startAt,
        endAt=end_at,
        createdAt=datetime.now(),
    )
    storage.bookings[booking.id] = booking
    return booking


router_owner = APIRouter(prefix="/api/owner/bookings", tags=["Owner"])


@router_owner.get("", response_model=list[Booking])
def list_bookings(
    eventTypeId: Optional[str] = Query(None),
    startDate: Optional[str] = Query(None),
    endDate: Optional[str] = Query(None),
) -> list[Booking]:
    bookings = list(storage.bookings.values())
    
    now = datetime.now()
    start_of_today = now.replace(hour=0, minute=0, second=0, microsecond=0)
    bookings = [b for b in bookings if b.startAt >= start_of_today]
    
    if eventTypeId:
        bookings = [b for b in bookings if b.eventTypeId == eventTypeId]
    
    if startDate:
        start = datetime.fromisoformat(startDate)
        bookings = [b for b in bookings if b.startAt >= start]
    
    if endDate:
        end = datetime.fromisoformat(endDate)
        bookings = [b for b in bookings if b.startAt <= end]
    
    bookings.sort(key=lambda b: b.startAt)
    return bookings


@router_owner.delete("/{id}", status_code=204)
def cancel_booking(id: str):
    if id not in storage.bookings:
        raise HTTPException(
            status_code=404,
            detail={"error": "NOT_FOUND", "message": "Booking not found"},
        )
    del storage.bookings[id]
    return None
