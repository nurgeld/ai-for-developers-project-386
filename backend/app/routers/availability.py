import uuid
from fastapi import APIRouter
from app.models import AvailabilityPeriod, CreateAvailabilityRequest
from app.storage import storage

router = APIRouter(prefix="/api/availability", tags=["Availability"])


@router.post("", response_model=AvailabilityPeriod, status_code=201)
def create_availability(request: CreateAvailabilityRequest) -> AvailabilityPeriod:
    availability = AvailabilityPeriod(
        id=str(uuid.uuid4()),
        dayOfWeek=request.dayOfWeek,
        startTime=request.startTime,
        endTime=request.endTime,
    )
    storage.availability[availability.id] = availability
    return availability


@router.get("", response_model=list[AvailabilityPeriod])
def list_availability() -> list[AvailabilityPeriod]:
    return list(storage.availability.values())
