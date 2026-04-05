from datetime import datetime
from typing import Dict
from app.models import EventType, Booking, OwnerSettings


class Storage:
    def __init__(self):
        self.event_types: Dict[str, EventType] = {}
        self.bookings: Dict[str, Booking] = {}
        self.settings: OwnerSettings = OwnerSettings(
            name="Tota",
            avatarUrl=None,
            workDayStart="09:00",
            workDayEnd="18:00",
        )
        self._seed_data()

    def _seed_data(self):
        et15 = EventType(
            id="event-type-15",
            name="Встреча 15 минут",
            description="Короткая встреча для быстрого обсуждения",
            durationMinutes=15,
        )
        et30 = EventType(
            id="event-type-30",
            name="Встреча 30 минут",
            description="Стандартная встреча для детального обсуждения",
            durationMinutes=30,
        )
        self.event_types[et15.id] = et15
        self.event_types[et30.id] = et30

    def get_settings(self) -> OwnerSettings:
        return self.settings

    def set_settings(self, settings: OwnerSettings) -> None:
        self.settings = settings

    def list_event_types(self) -> list[EventType]:
        return list(self.event_types.values())

    def get_event_type(self, event_type_id: str) -> EventType | None:
        return self.event_types.get(event_type_id)

    def save_event_type(self, event_type: EventType) -> None:
        self.event_types[event_type.id] = event_type

    def delete_event_type(self, event_type_id: str) -> None:
        del self.event_types[event_type_id]

    def list_bookings(self) -> list[Booking]:
        return list(self.bookings.values())

    def get_booking(self, booking_id: str) -> Booking | None:
        return self.bookings.get(booking_id)

    def save_booking(self, booking: Booking) -> None:
        self.bookings[booking.id] = booking

    def delete_booking(self, booking_id: str) -> None:
        del self.bookings[booking_id]


storage = Storage()
