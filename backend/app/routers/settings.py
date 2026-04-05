from fastapi import APIRouter
from app.models import OwnerSettings
from app.storage import storage

router = APIRouter(prefix="/api", tags=["Public"])


@router.get("/settings", response_model=OwnerSettings)
def get_settings() -> OwnerSettings:
    return storage.settings
