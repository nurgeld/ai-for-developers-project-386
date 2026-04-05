from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, field_validator


class EventType(BaseModel):
    id: str
    name: str
    description: str
    durationMinutes: int


class CreateEventTypeRequest(BaseModel):
    name: str
    description: str
    durationMinutes: int

    @field_validator('durationMinutes')
    def validate_duration(cls, v: int) -> int:
        if v not in (15, 30):
            raise ValueError('durationMinutes must be 15 or 30')
        return v


class UpdateEventTypeRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class OwnerSettings(BaseModel):
    name: str
    avatarUrl: Optional[str] = None
    workDayStart: str = "09:00"
    workDayEnd: str = "18:00"


class UpdateOwnerSettingsRequest(BaseModel):
    name: Optional[str] = None
    avatarUrl: Optional[str] = None
    workDayStart: Optional[str] = None
    workDayEnd: Optional[str] = None


class Slot(BaseModel):
    startAt: datetime
    endAt: datetime
    isBooked: bool


class Booking(BaseModel):
    id: str
    eventTypeId: str
    eventTypeName: str
    guestName: str
    guestEmail: str
    startAt: datetime
    endAt: datetime
    createdAt: datetime


class CreateBookingRequest(BaseModel):
    eventTypeId: str
    guestName: str
    guestEmail: str
    startAt: datetime


class ConflictError(BaseModel):
    error: Literal["SLOT_ALREADY_BOOKED"] = "SLOT_ALREADY_BOOKED"
    message: str = "Выбранный слот уже занят. Пожалуйста, выберите другое время."


class InvalidSlotTimeError(BaseModel):
    error: Literal["INVALID_SLOT_TIME"] = "INVALID_SLOT_TIME"
    message: str = "Недопустимое время начала слота. Время должно соответствовать сетке и быть в рамках рабочих часов."


class DuplicateDurationError(BaseModel):
    error: Literal["DUPLICATE_DURATION"] = "DUPLICATE_DURATION"
    message: str = "Тип события с такой длительностью уже существует. Разрешено только по одному типу для 15 и 30 минут."


class NotFoundError(BaseModel):
    error: Literal["NOT_FOUND"] = "NOT_FOUND"
    message: str


class ValidationError(BaseModel):
    error: Literal["VALIDATION_ERROR"] = "VALIDATION_ERROR"
    message: str
    details: Optional[list[str]] = None
