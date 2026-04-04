from app.models import EventType, Slot, Booking, AvailabilityPeriod


class Storage:
    """In-memory хранилище данных."""

    def __init__(self):
        self.event_types: dict[str, EventType] = {}
        self.slots: dict[str, Slot] = {}
        self.bookings: dict[str, Booking] = {}
        self.availability: dict[str, AvailabilityPeriod] = {}

    def clear(self):
        """Очистить все данные. Полезно для тестирования."""
        self.event_types.clear()
        self.slots.clear()
        self.bookings.clear()
        self.availability.clear()


storage = Storage()
