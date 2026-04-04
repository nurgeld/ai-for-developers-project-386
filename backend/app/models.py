from datetime import datetime, time
from pydantic import BaseModel


class EventType(BaseModel):
    id: str
    title: str
    description: str
    durationMinutes: int


class CreateEventTypeRequest(BaseModel):
    title: str
    description: str
    durationMinutes: int


class Slot(BaseModel):
    id: str
    eventTypeId: str
    startAt: datetime
    endAt: datetime
    isBooked: bool


class Booking(BaseModel):
    id: str
    eventTypeId: str
    startAt: datetime
    endAt: datetime
    guestName: str
    guestEmail: str
    createdAt: datetime


class CreateBookingRequest(BaseModel):
    eventTypeId: str
    startAt: datetime
    guestName: str
    guestEmail: str


class AvailabilityPeriod(BaseModel):
    id: str
    eventTypeId: str
    dayOfWeek: int
    startTime: time
    endTime: time


class CreateAvailabilityRequest(BaseModel):
    eventTypeId: str
    dayOfWeek: int
    startTime: time
    endTime: time
