from fastapi import APIRouter
from app.models import OwnerSettings, UpdateOwnerSettingsRequest
from app.storage import storage

router = APIRouter(prefix="/api/owner", tags=["Owner"])


@router.patch("/settings", response_model=OwnerSettings)
def update_settings(body: UpdateOwnerSettingsRequest) -> OwnerSettings:
    if body.name is not None:
        storage.settings.name = body.name
    if body.avatarUrl is not None:
        storage.settings.avatarUrl = body.avatarUrl
    if body.workDayStart is not None:
        storage.settings.workDayStart = body.workDayStart
    if body.workDayEnd is not None:
        storage.settings.workDayEnd = body.workDayEnd
    return storage.settings
