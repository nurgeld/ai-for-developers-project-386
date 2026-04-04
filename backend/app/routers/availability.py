import uuid
from fastapi import APIRouter
from app.models import AvailabilityPeriod, CreateAvailabilityRequest
from app.storage import storage

router = APIRouter(prefix="/availability", tags=["Availability"])


@router.post("", response_model=AvailabilityPeriod, status_code=201)
def create_availability(request: CreateAvailabilityRequest) -> AvailabilityPeriod:
    """Создать период доступности."""
    availability = AvailabilityPeriod(
        id=str(uuid.uuid4()),
        eventTypeId=request.eventTypeId,
        dayOfWeek=request.dayOfWeek,
        startTime=request.startTime,
        endTime=request.endTime,
    )
    storage.availability[availability.id] = availability
    return availability


@router.get("", response_model=list[AvailabilityPeriod])
def list_availability(eventTypeId: str) -> list[AvailabilityPeriod]:
    """Получить список периодов доступности для типа события."""
    return [
        a for a in storage.availability.values()
        if a.eventTypeId == eventTypeId
    ]
