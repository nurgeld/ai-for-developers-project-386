import uuid
from fastapi import APIRouter, HTTPException
from app.models import EventType, CreateEventTypeRequest
from app.storage import storage

router = APIRouter(prefix="/api/event-types", tags=["Event Types"])


@router.post("", response_model=EventType, status_code=201)
def create_event_type(request: CreateEventTypeRequest) -> EventType:
    """Создать тип события."""
    event_type = EventType(
        id=str(uuid.uuid4()),
        title=request.title,
        description=request.description,
        durationMinutes=request.durationMinutes,
    )
    storage.event_types[event_type.id] = event_type
    return event_type


@router.get("", response_model=list[EventType])
def list_event_types() -> list[EventType]:
    """Получить список типов событий."""
    return list(storage.event_types.values())
