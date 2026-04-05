from datetime import date

from fastapi import APIRouter, Depends, Query

from app.dependencies import get_storage
from app.models import Slot
from app.services import list_slots as list_slots_service
from app.storage import Storage

router = APIRouter(prefix="/api/slots", tags=["Public"])


@router.get("", response_model=list[Slot])
def list_slots(
    eventTypeId: str = Query(...),
    startDate: date = Query(...),
    endDate: date = Query(...),
    storage: Storage = Depends(get_storage),
) -> list[Slot]:
    return list_slots_service(storage, eventTypeId, startDate, endDate)
