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


storage = Storage()
