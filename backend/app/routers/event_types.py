import uuid
from fastapi import APIRouter, HTTPException
from app.models import EventType, CreateEventTypeRequest, UpdateEventTypeRequest, DuplicateDurationError
from app.storage import storage

router = APIRouter(prefix="/api/event-types", tags=["Public"])


@router.get("", response_model=list[EventType])
def list_event_types() -> list[EventType]:
    return list(storage.event_types.values())


router_owner = APIRouter(prefix="/api/owner/event-types", tags=["Owner"])


@router_owner.post("", response_model=EventType, status_code=201)
def create_event_type(body: CreateEventTypeRequest) -> EventType:
    for et in storage.event_types.values():
        if et.durationMinutes == body.durationMinutes:
            raise HTTPException(
                status_code=409,
                detail=DuplicateDurationError().model_dump(),
            )
    
    event_type = EventType(
        id=str(uuid.uuid4()),
        name=body.name,
        description=body.description,
        durationMinutes=body.durationMinutes,
    )
    storage.event_types[event_type.id] = event_type
    return event_type


@router_owner.patch("/{id}", response_model=EventType)
def update_event_type(id: str, body: UpdateEventTypeRequest) -> EventType:
    event_type = storage.event_types.get(id)
    if not event_type:
        raise HTTPException(status_code=404, detail={"error": "NOT_FOUND", "message": "Event type not found"})
    
    if body.name is not None:
        event_type.name = body.name
    if body.description is not None:
        event_type.description = body.description
    
    return event_type


@router_owner.delete("/{id}", status_code=204)
def delete_event_type(id: str):
    if id not in storage.event_types:
        raise HTTPException(status_code=404, detail={"error": "NOT_FOUND", "message": "Event type not found"})
    del storage.event_types[id]
    return None
