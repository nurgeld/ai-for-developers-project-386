from fastapi import APIRouter, Depends

from app.dependencies import get_storage
from app.models import OwnerSettings
from app.storage import Storage

router = APIRouter(prefix="/api", tags=["Public"])


@router.get("/settings", response_model=OwnerSettings)
def get_settings(storage: Storage = Depends(get_storage)) -> OwnerSettings:
    return storage.get_settings()
