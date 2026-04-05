from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.errors import ApiException, api_exception_handler, request_validation_exception_handler
from app.storage import Storage
from app.routers import settings, event_types, slots, bookings, owner_settings


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
        allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
        allow_credentials=True,
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
    return app


app = create_app()
