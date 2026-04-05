from datetime import datetime, time
from typing import Optional
from pydantic import BaseModel, field_validator


class EventType(BaseModel):
    id: str
    title: str
    description: str
    durationMinutes: int


class CreateEventTypeRequest(BaseModel):
    title: str
    description: str
    durationMinutes: int

    @field_validator('durationMinutes')
    def validate_duration(cls, v: int) -> int:
        if v not in (15, 30):
            raise ValueError('durationMinutes must be 15 or 30')
        return v


class Slot(BaseModel):
    id: str
    eventTypeId: Optional[str] = None
    guestEmail: Optional[str] = None
    startAt: datetime
    endAt: datetime


class Booking(BaseModel):
    id: str
    eventTypeId: str
    startAt: datetime
    endAt: datetime
    guestName: str
    guestEmail: str
    comment: Optional[str] = None
    createdAt: datetime


class CreateBookingRequest(BaseModel):
    eventTypeId: str
    startAt: datetime
    guestName: str
    guestEmail: str
    comment: Optional[str] = None


class AvailabilityPeriod(BaseModel):
    id: str
    dayOfWeek: int
    startTime: time
    endTime: time


class CreateAvailabilityRequest(BaseModel):
    dayOfWeek: int
    startTime: time
    endTime: time
