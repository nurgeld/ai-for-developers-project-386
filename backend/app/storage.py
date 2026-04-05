import uuid
from app.models import EventType, Slot, Booking, AvailabilityPeriod


def seed_data(storage: 'Storage'):
    """Initialize storage with preset data."""
    # Preset event types
    intro = EventType(
        id=str(uuid.uuid4()),
        title='Знакомство',
        description='Короткая встреча для знакомства',
        durationMinutes=15
    )
    consultation = EventType(
        id=str(uuid.uuid4()),
        title='Консультация',
        description='Полная консультация по вашим вопросам',
        durationMinutes=30
    )
    storage.event_types[intro.id] = intro
    storage.event_types[consultation.id] = consultation

    # Preset availability for all days of week (0-6), Monday to Sunday
    for day in range(7):
        period = AvailabilityPeriod(
            id=str(uuid.uuid4()),
            dayOfWeek=day,
            startTime='09:00',
            endTime='17:00'
        )
        storage.availability[period.id] = period


class Storage:
    """In-memory хранилище данных."""

    def __init__(self):
        self.event_types: dict[str, EventType] = {}
        self.slots: dict[str, Slot] = {}
        self.bookings: dict[str, Booking] = {}
        self.availability: dict[str, AvailabilityPeriod] = {}
        # Seed with preset data
        seed_data(self)

    def clear(self):
        """Очистить все данные. Полезно для тестирования."""
        self.event_types.clear()
        self.slots.clear()
        self.bookings.clear()
        self.availability.clear()
        # Reseed with preset data
        seed_data(self)


storage = Storage()
