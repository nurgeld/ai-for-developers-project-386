from datetime import date, datetime, time, timedelta, timezone


UTC = timezone.utc


def parse_clock(value: str) -> time:
    parts = value.split(":")
    if len(parts) != 2:
        raise ValueError("time must use HH:mm format")

    try:
        hour, minute = (int(part) for part in parts)
    except ValueError as exc:
        raise ValueError("time must use HH:mm format") from exc

    if hour not in range(24) or minute not in range(60):
        raise ValueError("time must use HH:mm format")

    return time(hour=hour, minute=minute, tzinfo=UTC)


def to_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=UTC)
    return value.astimezone(UTC)


def combine_date_and_clock(day: date, clock: time) -> datetime:
    return datetime.combine(day, clock)


def start_of_day(day: date) -> datetime:
    return datetime.combine(day, time.min, tzinfo=UTC)


def next_day_start(day: date) -> datetime:
    return start_of_day(day) + timedelta(days=1)
