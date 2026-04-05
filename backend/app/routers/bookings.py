import uuid
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Response
from app.models import Booking, CreateBookingRequest, Slot
from app.storage import storage

router = APIRouter(prefix="/api/bookings", tags=["Bookings"])

SHIFT_MINUTES = 10
SLOT_GRID_MINUTES = 30


def check_overlap(start_at: datetime, end_at: datetime, exclude_booking_id: Optional[str] = None) -> bool:
    for booking in storage.bookings.values():
        if exclude_booking_id and booking.id == exclude_booking_id:
            continue
        if start_at < booking.endAt and end_at > booking.startAt:
            return True
    return False


def is_slot_conflict(start_at: datetime, end_at: datetime) -> bool:
    for booking in storage.bookings.values():
        if start_at < booking.endAt and end_at > booking.startAt:
            return True
    return False


def apply_slot_shift(booking_end: datetime):
    """Сдвигает свободные слоты на +10 минут после booking_end."""
    slots_to_remove = []
    slots_to_add = []

    for slot_id, slot in list(storage.slots.items()):
        if slot.eventTypeId is not None:
            continue
        if slot.startAt < booking_end:
            continue

        new_start = slot.startAt + timedelta(minutes=SHIFT_MINUTES)
        new_end = slot.endAt + timedelta(minutes=SHIFT_MINUTES)

        if is_slot_conflict(new_start, new_end):
            slots_to_remove.append(slot_id)
        else:
            shifted_slot = Slot(
                id=slot.id,
                eventTypeId=None,
                startAt=new_start,
                endAt=new_end,
            )
            slots_to_add.append(shifted_slot)
            slots_to_remove.append(slot_id)

    for slot_id in slots_to_remove:
        storage.slots.pop(slot_id, None)

    for slot in slots_to_add:
        storage.slots[slot.id] = slot


@router.post("", response_model=Booking, status_code=201)
def create_booking(response: Response, request: CreateBookingRequest) -> Booking:
    event_type = storage.event_types.get(request.eventTypeId)
    if not event_type:
        raise HTTPException(status_code=404, detail="Event type not found")

    end_at = request.startAt + timedelta(minutes=event_type.durationMinutes)

    if check_overlap(request.startAt, end_at):
        raise HTTPException(status_code=409, detail="Time slot overlaps with existing booking")

    booking = Booking(
        id=str(uuid.uuid4()),
        eventTypeId=request.eventTypeId,
        startAt=request.startAt,
        endAt=end_at,
        guestName=request.guestName,
        guestEmail=request.guestEmail,
        comment=request.comment,
        createdAt=datetime.now(),
    )
    storage.bookings[booking.id] = booking

    # Set guest_email cookie for the guest
    response.set_cookie(
        key="guest_email",
        value=request.guestEmail,
        httponly=False,
        samesite="lax",
    )

    if event_type.durationMinutes == 30:
        apply_slot_shift(booking.endAt)

    return booking


@router.get("", response_model=list[Booking])
def list_bookings(
    eventTypeId: Optional[str] = Query(None),
    start: Optional[datetime] = Query(None),
    end: Optional[datetime] = Query(None),
) -> list[Booking]:
    bookings = list(storage.bookings.values())

    if eventTypeId:
        bookings = [b for b in bookings if b.eventTypeId == eventTypeId]
    if start:
        bookings = [b for b in bookings if b.startAt >= start]
    if end:
        bookings = [b for b in bookings if b.startAt <= end]

    return bookings
