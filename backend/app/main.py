from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.errors import ApiException, api_exception_handler, request_validation_exception_handler
from app.storage import Storage
from app.routers import settings, event_types, slots, bookings, owner_settings


DIST_DIR = Path(__file__).resolve().parents[2] / "dist"


def configure_spa(app: FastAPI) -> None:
    if not DIST_DIR.exists():
        return

    assets_dir = DIST_DIR / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    index_file = DIST_DIR / "index.html"

    @app.get("/", include_in_schema=False)
    async def serve_index() -> FileResponse:
        return FileResponse(index_file)

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str) -> FileResponse:
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="Not Found")

        requested_path = (DIST_DIR / full_path).resolve()
        if requested_path.is_relative_to(DIST_DIR) and requested_path.is_file():
            return FileResponse(requested_path)

        if Path(full_path).suffix:
            raise HTTPException(status_code=404, detail="Not Found")

        return FileResponse(index_file)


def create_app(storage: Storage | None = None) -> FastAPI:
    app = FastAPI(title="Calendar Booking API")
    app.state.storage = storage or Storage()

    app.add_exception_handler(ApiException, api_exception_handler)
    app.add_exception_handler(
        RequestValidationError,
        request_validation_exception_handler,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(settings.router)
    app.include_router(event_types.router)
    app.include_router(event_types.router_owner)
    app.include_router(slots.router)
    app.include_router(bookings.router)
    app.include_router(bookings.router_owner)
    app.include_router(owner_settings.router)
    configure_spa(app)
    return app


app = create_app()
