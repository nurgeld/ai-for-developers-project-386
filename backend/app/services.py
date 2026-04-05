import uuid
from datetime import date, datetime, timedelta
from typing import Optional

from pydantic import ValidationError as PydanticValidationError

from app.errors import (
    build_validation_details,
    conflict_error,
    duplicate_duration_error,
    invalid_slot_time_error,
    not_found_error,
    validation_error,
)
from app.models import (
    Booking,
    CreateBookingRequest,
    CreateEventTypeRequest,
    EventType,
    OwnerSettings,
    Slot,
    UpdateEventTypeRequest,
    UpdateOwnerSettingsRequest,
)
from app.storage import Storage
from app.time_utils import UTC, combine_date_and_clock, parse_clock, start_of_day, to_utc


def _build_booking_end(start_at: datetime, duration_minutes: int) -> datetime:
    return start_at + timedelta(minutes=duration_minutes)


def _validate_date_range(start_date: date, end_date: date) -> None:
    if start_date > end_date:
        raise validation_error("startDate must be earlier than or equal to endDate")


def _validate_slot_start(
    start_at: datetime,
    duration_minutes: int,
    settings: OwnerSettings,
) -> tuple[datetime, datetime]:
    normalized_start = to_utc(start_at)
    normalized_end = _build_booking_end(normalized_start, duration_minutes)

    if normalized_start.second != 0 or normalized_start.microsecond != 0:
        raise invalid_slot_time_error()

    if normalized_start.minute % duration_minutes != 0:
        raise invalid_slot_time_error()

    work_day_start = combine_date_and_clock(
        normalized_start.date(),
        parse_clock(settings.workDayStart),
    )
    work_day_end = combine_date_and_clock(
        normalized_start.date(),
        parse_clock(settings.workDayEnd),
    )

    if normalized_start < work_day_start or normalized_end > work_day_end:
        raise invalid_slot_time_error()

    return normalized_start, normalized_end


def list_event_types(storage: Storage) -> list[EventType]:
    return storage.list_event_types()


def create_event_type(storage: Storage, body: CreateEventTypeRequest) -> EventType:
    for event_type in storage.list_event_types():
        if event_type.durationMinutes == body.durationMinutes:
            raise duplicate_duration_error()

    event_type = EventType(
        id=str(uuid.uuid4()),
        name=body.name,
        description=body.description,
        durationMinutes=body.durationMinutes,
    )
    storage.save_event_type(event_type)
    return event_type


def update_event_type(
    storage: Storage,
    event_type_id: str,
    body: UpdateEventTypeRequest,
) -> EventType:
    event_type = storage.get_event_type(event_type_id)
    if event_type is None:
        raise not_found_error("Event type not found")

    if body.name is not None:
        event_type.name = body.name
    if body.description is not None:
        event_type.description = body.description

    storage.save_event_type(event_type)
    return event_type


def delete_event_type(storage: Storage, event_type_id: str) -> None:
    if storage.get_event_type(event_type_id) is None:
        raise not_found_error("Event type not found")
    storage.delete_event_type(event_type_id)


def update_owner_settings(
    storage: Storage,
    body: UpdateOwnerSettingsRequest,
) -> OwnerSettings:
    payload = storage.get_settings().model_dump()
    payload.update(body.model_dump(exclude_unset=True))

    if payload.get("avatarUrl") == "":
        payload["avatarUrl"] = None

    try:
        settings = OwnerSettings.model_validate(payload)
    except PydanticValidationError as exc:
        raise validation_error(
            message="Owner settings are invalid",
            details=build_validation_details(exc),
        ) from exc

    storage.set_settings(settings)
    return settings


def list_slots(
    storage: Storage,
    event_type_id: str,
    start_date: date,
    end_date: date,
    now: Optional[datetime] = None,
) -> list[Slot]:
    _validate_date_range(start_date, end_date)

    event_type = storage.get_event_type(event_type_id)
    if event_type is None:
        return []

    settings = storage.get_settings()
    work_day_start = parse_clock(settings.workDayStart)
    work_day_end = parse_clock(settings.workDayEnd)
    current_time = to_utc(now or datetime.now(UTC))
    slots: list[Slot] = []
    current_day = start_date

    while current_day <= end_date:
        slot_start = combine_date_and_clock(current_day, work_day_start)
        day_end = combine_date_and_clock(current_day, work_day_end)

        while slot_start + timedelta(minutes=event_type.durationMinutes) <= day_end:
            slot_end = slot_start + timedelta(minutes=event_type.durationMinutes)
            is_booked = any(
                to_utc(booking.startAt) < slot_end and to_utc(booking.endAt) > slot_start
                for booking in storage.list_bookings()
            )

            if slot_start > current_time:
                slots.append(
                    Slot(startAt=slot_start, endAt=slot_end, isBooked=is_booked)
                )

            slot_start = slot_end

        current_day += timedelta(days=1)

    return slots


def create_booking(
    storage: Storage,
    body: CreateBookingRequest,
    now: Optional[datetime] = None,
) -> Booking:
    del now
    event_type = storage.get_event_type(body.eventTypeId)
    if event_type is None:
        raise not_found_error("Event type not found")

    normalized_start, normalized_end = _validate_slot_start(
        start_at=body.startAt,
        duration_minutes=event_type.durationMinutes,
        settings=storage.get_settings(),
    )

    for existing_booking in storage.list_bookings():
        if normalized_start < to_utc(existing_booking.endAt) and normalized_end > to_utc(
            existing_booking.startAt
        ):
            raise conflict_error()

    booking = Booking(
        id=str(uuid.uuid4()),
        eventTypeId=body.eventTypeId,
        eventTypeName=event_type.name,
        guestName=body.guestName,
        guestEmail=body.guestEmail,
        startAt=normalized_start,
        endAt=normalized_end,
        createdAt=datetime.now(UTC),
    )
    storage.save_booking(booking)
    return booking


def list_owner_bookings(
    storage: Storage,
    event_type_id: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    now: Optional[datetime] = None,
) -> list[Booking]:
    if start_date is not None and end_date is not None:
        _validate_date_range(start_date, end_date)

    current_time = to_utc(now or datetime.now(UTC))
    today_start = start_of_day(current_time.date())
    bookings = [
        booking for booking in storage.list_bookings() if to_utc(booking.startAt) >= today_start
    ]

    if event_type_id is not None:
        bookings = [booking for booking in bookings if booking.eventTypeId == event_type_id]

    if start_date is not None:
        start_boundary = start_of_day(start_date)
        bookings = [
            booking for booking in bookings if to_utc(booking.startAt) >= start_boundary
        ]

    if end_date is not None:
        end_boundary = start_of_day(end_date + timedelta(days=1))
        bookings = [booking for booking in bookings if to_utc(booking.startAt) < end_boundary]

    return sorted(bookings, key=lambda booking: to_utc(booking.startAt))


def cancel_booking(storage: Storage, booking_id: str) -> None:
    if storage.get_booking(booking_id) is None:
        raise not_found_error("Booking not found")
    storage.delete_booking(booking_id)
